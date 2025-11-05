import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

// MetaMask SDK configuration
const METAMASK_CONFIG = {
  dappMetadata: {
    name: 'MediTrack',
    description: 'Blockchain-powered pharmaceutical supply chain verification',
    url: 'https://meditrack.app',
    iconUrl: 'https://meditrack.app/icon.png',
  },
  infuraAPIKey: '9aa3d95b3bc440fa88ea12eaa4456161', // Free Infura key for demo
};

// Supported networks
export const SUPPORTED_NETWORKS = {
  ethereum: {
    chainId: '0x1',
    chainName: 'Ethereum Mainnet',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
    blockExplorerUrls: ['https://etherscan.io'],
  },
  sepolia: {
    chainId: '0xaa36a7',
    chainName: 'Sepolia Testnet',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
    blockExplorerUrls: ['https://sepolia.etherscan.io'],
  },
  mumbai: {
    chainId: '0x13881',
    chainName: 'Polygon Mumbai',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
    rpcUrls: ['https://polygon-mumbai.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
    blockExplorerUrls: ['https://mumbai.polygonscan.com'],
  },
  bscTestnet: {
    chainId: '0x61',
    chainName: 'BSC Testnet',
    nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
    rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
    blockExplorerUrls: ['https://testnet.bscscan.com'],
  },
};

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  chainId: string | null;
  balance: string | null;
  networkName: string | null;
}

export interface TransactionRequest {
  to: string;
  data: string;
  value?: string;
  gasLimit?: string;
  gasPrice?: string;
}

export class WalletService {
  private sdk: any;
  private ethereum: any;
  private state: WalletState = {
    isConnected: false,
    address: null,
    chainId: null,
    balance: null,
    networkName: null,
  };

  constructor() {
    // Initialize SDK lazily to avoid constructor issues
    this.initializeSDK();
  }

  private async initializeSDK() {
    try {
      // Dynamic import to avoid constructor issues
      const MetaMaskSDKModule = await import('@metamask/sdk-react-native');
      const MetaMaskSDK = MetaMaskSDKModule.default;
      this.sdk = new (MetaMaskSDK as any)(METAMASK_CONFIG);
      this.ethereum = this.sdk.getProvider();
      this.setupEventListeners();
    } catch (error) {
      console.warn('MetaMask SDK initialization failed:', error);
      // Continue without MetaMask for demo purposes
    }
  }

  /**
   * Setup MetaMask event listeners
   */
  private setupEventListeners() {
    if (!this.ethereum) return;

    // Account changed
    this.ethereum.on('accountsChanged', (accounts: string[]) => {
      if (accounts.length === 0) {
        this.disconnect();
      } else {
        this.state.address = accounts[0];
        this.updateBalance();
        this.saveWalletState();
      }
    });

    // Chain changed
    this.ethereum.on('chainChanged', (chainId: string) => {
      this.state.chainId = chainId;
      this.state.networkName = this.getNetworkName(chainId);
      this.updateBalance();
      this.saveWalletState();
    });

    // Connection
    this.ethereum.on('connect', (connectInfo: { chainId: string }) => {
      console.log('MetaMask connected:', connectInfo);
    });

    // Disconnection
    this.ethereum.on('disconnect', (error: any) => {
      console.log('MetaMask disconnected:', error);
      this.disconnect();
    });
  }

  /**
   * Check if MetaMask is available
   */
  async isMetaMaskAvailable(): Promise<boolean> {
    try {
      return !!this.ethereum;
    } catch (error) {
      return false;
    }
  }

  /**
   * Connect to MetaMask wallet
   */
  async connect(): Promise<WalletState> {
    try {
      if (!this.ethereum) {
        throw new Error('MetaMask not available. Please install MetaMask mobile app.');
      }

      // Request account access
      const accounts = await this.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found. Please unlock MetaMask.');
      }

      // Get chain ID
      const chainId = await this.ethereum.request({
        method: 'eth_chainId',
      });

      // Update state
      this.state = {
        isConnected: true,
        address: accounts[0],
        chainId,
        balance: null,
        networkName: this.getNetworkName(chainId),
      };

      // Get balance
      await this.updateBalance();

      // Save state
      await this.saveWalletState();

      return this.state;
    } catch (error: any) {
      console.error('Failed to connect to MetaMask:', error);
      Alert.alert(
        'Connection Failed',
        error.message || 'Failed to connect to MetaMask. Please try again.'
      );
      throw error;
    }
  }

  /**
   * Disconnect from wallet
   */
  async disconnect(): Promise<void> {
    this.state = {
      isConnected: false,
      address: null,
      chainId: null,
      balance: null,
      networkName: null,
    };

    await AsyncStorage.removeItem('wallet_state');
  }

  /**
   * Get current wallet state
   */
  getState(): WalletState {
    return { ...this.state };
  }

  /**
   * Switch to a specific network
   */
  async switchNetwork(networkKey: keyof typeof SUPPORTED_NETWORKS): Promise<void> {
    try {
      if (!this.ethereum) {
        throw new Error('MetaMask not available');
      }

      const network = SUPPORTED_NETWORKS[networkKey];

      try {
        // Try to switch to the network
        await this.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: network.chainId }],
        });
      } catch (switchError: any) {
        // If network doesn't exist, add it
        if (switchError.code === 4902) {
          await this.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [network],
          });
        } else {
          throw switchError;
        }
      }
    } catch (error: any) {
      console.error('Failed to switch network:', error);
      Alert.alert(
        'Network Switch Failed',
        error.message || 'Failed to switch network. Please try again.'
      );
      throw error;
    }
  }

  /**
   * Sign a transaction
   */
  async signTransaction(transaction: TransactionRequest): Promise<string> {
    try {
      if (!this.ethereum || !this.state.isConnected) {
        throw new Error('Wallet not connected');
      }

      const txHash = await this.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: this.state.address,
          to: transaction.to,
          data: transaction.data,
          value: transaction.value || '0x0',
          gas: transaction.gasLimit,
          gasPrice: transaction.gasPrice,
        }],
      });

      return txHash;
    } catch (error: any) {
      console.error('Failed to sign transaction:', error);
      Alert.alert(
        'Transaction Failed',
        error.message || 'Failed to sign transaction. Please try again.'
      );
      throw error;
    }
  }

  /**
   * Sign a message
   */
  async signMessage(message: string): Promise<string> {
    try {
      if (!this.ethereum || !this.state.isConnected) {
        throw new Error('Wallet not connected');
      }

      const signature = await this.ethereum.request({
        method: 'personal_sign',
        params: [message, this.state.address],
      });

      return signature;
    } catch (error: any) {
      console.error('Failed to sign message:', error);
      Alert.alert(
        'Signing Failed',
        error.message || 'Failed to sign message. Please try again.'
      );
      throw error;
    }
  }

  /**
   * Estimate gas for a transaction
   */
  async estimateGas(transaction: TransactionRequest): Promise<string> {
    try {
      if (!this.ethereum) {
        throw new Error('MetaMask not available');
      }

      const gasEstimate = await this.ethereum.request({
        method: 'eth_estimateGas',
        params: [{
          from: this.state.address,
          to: transaction.to,
          data: transaction.data,
          value: transaction.value || '0x0',
        }],
      });

      return gasEstimate;
    } catch (error: any) {
      console.error('Failed to estimate gas:', error);
      throw error;
    }
  }

  /**
   * Get current gas price
   */
  async getGasPrice(): Promise<string> {
    try {
      if (!this.ethereum) {
        throw new Error('MetaMask not available');
      }

      const gasPrice = await this.ethereum.request({
        method: 'eth_gasPrice',
      });

      return gasPrice;
    } catch (error: any) {
      console.error('Failed to get gas price:', error);
      throw error;
    }
  }

  /**
   * Update wallet balance
   */
  private async updateBalance(): Promise<void> {
    try {
      if (!this.ethereum || !this.state.address) return;

      const balance = await this.ethereum.request({
        method: 'eth_getBalance',
        params: [this.state.address, 'latest'],
      });

      // Convert from wei to ether
      const balanceInEther = parseInt(balance, 16) / Math.pow(10, 18);
      this.state.balance = balanceInEther.toFixed(4);
    } catch (error) {
      console.error('Failed to update balance:', error);
    }
  }

  /**
   * Get network name from chain ID
   */
  private getNetworkName(chainId: string): string {
    const networks: { [key: string]: string } = {
      '0x1': 'Ethereum Mainnet',
      '0xaa36a7': 'Sepolia Testnet',
      '0x13881': 'Polygon Mumbai',
      '0x61': 'BSC Testnet',
      '0x89': 'Polygon Mainnet',
      '0x38': 'BSC Mainnet',
    };

    return networks[chainId] || `Unknown Network (${chainId})`;
  }

  /**
   * Save wallet state to storage
   */
  private async saveWalletState(): Promise<void> {
    try {
      await AsyncStorage.setItem('wallet_state', JSON.stringify(this.state));
    } catch (error) {
      console.error('Failed to save wallet state:', error);
    }
  }

  /**
   * Load wallet state from storage
   */
  async loadWalletState(): Promise<void> {
    try {
      const savedState = await AsyncStorage.getItem('wallet_state');
      if (savedState) {
        const parsedState = JSON.parse(savedState);

        // Verify connection is still valid
        if (parsedState.isConnected && this.ethereum) {
          try {
            const accounts = await this.ethereum.request({
              method: 'eth_accounts',
            });

            if (accounts.length > 0 && accounts[0] === parsedState.address) {
              this.state = parsedState;
              await this.updateBalance();
            }
          } catch (error) {
            // Connection no longer valid, clear state
            await this.disconnect();
          }
        }
      }
    } catch (error) {
      console.error('Failed to load wallet state:', error);
    }
  }

  /**
   * Get transaction receipt
   */
  async getTransactionReceipt(txHash: string): Promise<any> {
    try {
      if (!this.ethereum) {
        throw new Error('MetaMask not available');
      }

      const receipt = await this.ethereum.request({
        method: 'eth_getTransactionReceipt',
        params: [txHash],
      });

      return receipt;
    } catch (error: any) {
      console.error('Failed to get transaction receipt:', error);
      throw error;
    }
  }

  /**
   * Wait for transaction confirmation
   */
  async waitForTransaction(txHash: string, confirmations: number = 1): Promise<any> {
    return new Promise((resolve, reject) => {
      let attempts = 0;
      const maxAttempts = 60; // 5 minutes with 5-second intervals

      const checkTransaction = async () => {
        try {
          const receipt = await this.getTransactionReceipt(txHash);

          if (receipt && receipt.blockNumber) {
            const currentBlock = await this.ethereum.request({
              method: 'eth_blockNumber',
            });

            const confirmationCount = parseInt(currentBlock, 16) - parseInt(receipt.blockNumber, 16);

            if (confirmationCount >= confirmations) {
              resolve(receipt);
              return;
            }
          }

          attempts++;
          if (attempts >= maxAttempts) {
            reject(new Error('Transaction confirmation timeout'));
            return;
          }

          setTimeout(checkTransaction, 5000); // Check every 5 seconds
        } catch (error) {
          reject(error);
        }
      };

      checkTransaction();
    });
  }
}

// Export singleton instance
export const walletService = new WalletService();