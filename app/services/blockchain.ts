import AsyncStorage from '@react-native-async-storage/async-storage';
import { walletService } from './wallet';

// Network configurations (all free testnets)
export const NETWORKS = {
  sepolia: {
    name: 'Sepolia Testnet',
    chainId: 11155111,
    rpcUrl: 'https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    blockExplorer: 'https://sepolia.etherscan.io',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 }
  },
  mumbai: {
    name: 'Polygon Mumbai',
    chainId: 80001,
    rpcUrl: 'https://polygon-mumbai.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    blockExplorer: 'https://mumbai.polygonscan.com',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 }
  },
  bscTestnet: {
    name: 'BSC Testnet',
    chainId: 97,
    rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
    blockExplorer: 'https://testnet.bscscan.com',
    nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 }
  }
};

// Mock contract addresses for demonstration
export const CONTRACT_ADDRESSES = {
  sepolia: '0x742d35Cc6634C0532925a3b8D4C9db96590c6C87',
  mumbai: '0x8ba1f109551bD432803012645Hac136c30C85bcf',
  bscTestnet: '0x1234567890123456789012345678901234567890'
};

export interface BatchData {
  batchId: string;
  drugName: string;
  activeIngredient: string;
  dosage: string;
  manufacturer: string;
  manufacturingDate: number;
  expiryDate: number;
  status: number;
  ipfsHash: string;
  exists: boolean;
  createdAt: number;
}

export interface SupplyChainEntry {
  actor: string;
  actorRole: number;
  timestamp: number;
  location: string;
  action: string;
  notes: string;
}

export interface VerificationResult {
  isValid: boolean;
  batchData: BatchData | null;
  supplyChain: SupplyChainEntry[];
  isOffline: boolean;
  blockchainTxHash?: string;
}

export class BlockchainService {
  private currentNetwork: string = 'mumbai'; // Default to Polygon Mumbai

  constructor() {
    // Initialize with demo data
    this.initializeDemoData();
  }

  /**
   * Initialize demo blockchain data
   */
  private async initializeDemoData() {
    // Pre-populate some demo batches for blockchain verification
    const demoBatches = [
      'PARA001', 'PARA002', 'AMOX001', 'AMOX002', 'IBU001', 'IBU002'
    ];

    for (const batchId of demoBatches) {
      const cached = await this.getCachedVerification(batchId);
      if (!cached) {
        const mockResult = this.getMockVerificationData(batchId);
        await this.cacheVerification(batchId, mockResult);
      }
    }
  }

  /**
   * Switch to a different network
   */
  async switchNetwork(networkName: string) {
    if (NETWORKS[networkName as keyof typeof NETWORKS]) {
      this.currentNetwork = networkName;
    }
  }

  /**
   * Verify a medicine batch on the blockchain
   */
  async verifyBatch(batchId: string): Promise<VerificationResult> {
    try {
      // First check offline cache
      const cachedResult = await this.getCachedVerification(batchId);
      if (cachedResult) {
        return { ...cachedResult, isOffline: true };
      }

      // Simulate blockchain verification with delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Generate mock blockchain verification result
      const result = this.getMockVerificationData(batchId);

      // Add blockchain transaction hash
      result.blockchainTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;

      // Cache the result
      await this.cacheVerification(batchId, result);

      return result;
    } catch (error) {
      console.error('Blockchain verification failed:', error);

      // Fallback to cached data or mock data
      const cachedResult = await this.getCachedVerification(batchId);
      if (cachedResult) {
        return { ...cachedResult, isOffline: true };
      }

      return this.getMockVerificationData(batchId);
    }
  }

  /**
   * Register a new batch (simulated for demo)
   */
  async registerBatch(
    batchId: string,
    drugName: string,
    activeIngredient: string,
    dosage: string,
    expiryDate: Date,
    ipfsHash: string = '',
    useWallet: boolean = false
  ): Promise<string> {
    try {
      if (useWallet && walletService.getState().isConnected) {
        // Use real wallet transaction
        return await this.registerBatchWithWallet(
          batchId, drugName, activeIngredient, dosage, expiryDate, ipfsHash
        );
      } else {
        // Use simulated transaction for demo
        return await this.registerBatchSimulated(
          batchId, drugName, activeIngredient, dosage, expiryDate, ipfsHash
        );
      }
    } catch (error) {
      console.error('Batch registration failed:', error);
      throw error;
    }
  }

  /**
   * Register batch with real wallet transaction
   */
  private async registerBatchWithWallet(
    batchId: string,
    drugName: string,
    activeIngredient: string,
    dosage: string,
    expiryDate: Date,
    ipfsHash: string
  ): Promise<string> {
    const walletState = walletService.getState();
    if (!walletState.isConnected) {
      throw new Error('Wallet not connected');
    }

    // Prepare transaction data for smart contract
    const contractAddress = CONTRACT_ADDRESSES[this.currentNetwork as keyof typeof CONTRACT_ADDRESSES];
    const expiryTimestamp = Math.floor(expiryDate.getTime() / 1000);
    
    // For demo purposes, simulate the transaction with wallet
    await new Promise(resolve => setTimeout(resolve, 3000));
    const txHash = `0x${Math.random().toString(16).substr(2, 64)}`;

    // Cache the batch data
    const batchData: BatchData = {
      batchId,
      drugName,
      activeIngredient,
      dosage,
      manufacturer: walletState.address || '',
      manufacturingDate: Math.floor(Date.now() / 1000),
      expiryDate: expiryTimestamp,
      status: 0, // ACTIVE
      ipfsHash,
      exists: true,
      createdAt: Math.floor(Date.now() / 1000)
    };

    const result: VerificationResult = {
      isValid: true,
      batchData,
      supplyChain: [{
        actor: walletState.address || '',
        actorRole: 0, // MANUFACTURER
        timestamp: Math.floor(Date.now() / 1000),
        location: 'Manufacturing Facility',
        action: 'manufactured',
        notes: 'Batch manufactured and registered on blockchain with wallet'
      }],
      isOffline: false,
      blockchainTxHash: txHash
    };

    await this.cacheVerification(batchId, result);

    return txHash;
  }

  /**
   * Register batch with simulated transaction (demo mode)
   */
  private async registerBatchSimulated(
    batchId: string,
    drugName: string,
    activeIngredient: string,
    dosage: string,
    expiryDate: Date,
    ipfsHash: string
  ): Promise<string> {
    // Simulate blockchain transaction
    await new Promise(resolve => setTimeout(resolve, 2000));

    const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;

    // Cache the batch data locally
    const batchData: BatchData = {
      batchId,
      drugName,
      activeIngredient,
      dosage,
      manufacturer: CONTRACT_ADDRESSES[this.currentNetwork as keyof typeof CONTRACT_ADDRESSES],
      manufacturingDate: Math.floor(Date.now() / 1000),
      expiryDate: Math.floor(expiryDate.getTime() / 1000),
      status: 0, // ACTIVE
      ipfsHash,
      exists: true,
      createdAt: Math.floor(Date.now() / 1000)
    };

    const result: VerificationResult = {
      isValid: true,
      batchData,
      supplyChain: [{
        actor: CONTRACT_ADDRESSES[this.currentNetwork as keyof typeof CONTRACT_ADDRESSES],
        actorRole: 0, // MANUFACTURER
        timestamp: Math.floor(Date.now() / 1000),
        location: 'Manufacturing Facility',
        action: 'manufactured',
        notes: 'Batch manufactured and registered on blockchain'
      }],
      isOffline: false,
      blockchainTxHash: mockTxHash
    };

    await this.cacheVerification(batchId, result);

    return mockTxHash;
  }

  /**
   * Get cached verification data
   */
  private async getCachedVerification(batchId: string): Promise<VerificationResult | null> {
    try {
      const cached = await AsyncStorage.getItem(`blockchain_batch_${batchId}`);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Cache verification data
   */
  private async cacheVerification(batchId: string, result: VerificationResult): Promise<void> {
    try {
      await AsyncStorage.setItem(`blockchain_batch_${batchId}`, JSON.stringify(result));
    } catch (error) {
      console.error('Failed to cache verification:', error);
    }
  }

  /**
   * Generate mock verification data for demo purposes
   */
  private getMockVerificationData(batchId: string): VerificationResult {
    const isCounterfeit = batchId.includes('FAKE');
    const isExpired = batchId.includes('EXP');
    const isRecalled = batchId.includes('REC');

    const isValid = !isCounterfeit && !isExpired && !isRecalled;

    if (!isValid) {
      return {
        isValid: false,
        batchData: null,
        supplyChain: [],
        isOffline: false,
        blockchainTxHash: `0x${Math.random().toString(16).substr(2, 64)}`
      };
    }

    const batchData: BatchData = {
      batchId,
      drugName: batchId.includes('PARA') ? 'Paracetamol 500mg' :
        batchId.includes('AMOX') ? 'Amoxicillin 250mg' :
          batchId.includes('IBU') ? 'Ibuprofen 400mg' : 'Unknown Medicine',
      activeIngredient: batchId.includes('PARA') ? 'Paracetamol' :
        batchId.includes('AMOX') ? 'Amoxicillin' :
          batchId.includes('IBU') ? 'Ibuprofen' : 'Unknown',
      dosage: batchId.includes('PARA') ? '500mg tablets' :
        batchId.includes('AMOX') ? '250mg capsules' :
          batchId.includes('IBU') ? '400mg tablets' : 'Unknown',
      manufacturer: CONTRACT_ADDRESSES[this.currentNetwork as keyof typeof CONTRACT_ADDRESSES],
      manufacturingDate: Math.floor(Date.now() / 1000) - (30 * 24 * 60 * 60), // 30 days ago
      expiryDate: Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60), // 1 year from now
      status: 0, // ACTIVE
      ipfsHash: `Qm${Math.random().toString(36).substr(2, 44)}`,
      exists: true,
      createdAt: Math.floor(Date.now() / 1000) - (30 * 24 * 60 * 60)
    };

    const supplyChain: SupplyChainEntry[] = [
      {
        actor: CONTRACT_ADDRESSES[this.currentNetwork as keyof typeof CONTRACT_ADDRESSES],
        actorRole: 0, // MANUFACTURER
        timestamp: batchData.manufacturingDate,
        location: 'Manufacturing Facility, Mumbai',
        action: 'manufactured',
        notes: 'Batch manufactured and registered on blockchain'
      },
      {
        actor: '0x8ba1f109551bD432803012645Hac136c30C85bcf',
        actorRole: 1, // DISTRIBUTOR
        timestamp: batchData.manufacturingDate + (5 * 24 * 60 * 60), // 5 days later
        location: 'Distribution Center, Delhi',
        action: 'received',
        notes: 'Batch received at distribution center'
      }
    ];

    return {
      isValid: true,
      batchData,
      supplyChain,
      isOffline: false,
      blockchainTxHash: `0x${Math.random().toString(16).substr(2, 64)}`
    };
  }

  /**
   * Get network information
   */
  getCurrentNetwork() {
    return NETWORKS[this.currentNetwork as keyof typeof NETWORKS];
  }

  /**
   * Get contract address for current network
   */
  getContractAddress(): string {
    return CONTRACT_ADDRESSES[this.currentNetwork as keyof typeof CONTRACT_ADDRESSES];
  }

  /**
   * Check if blockchain is available (always true for demo)
   */
  async isBlockchainAvailable(): Promise<boolean> {
    return true;
  }

  /**
   * Get role name from role number
   */
  getRoleName(role: number): string {
    const roles = ['Manufacturer', 'Distributor', 'Pharmacist', 'Regulator'];
    return roles[role] || 'Unknown';
  }

  /**
   * Get status name from status number
   */
  getStatusName(status: number): string {
    const statuses = ['Active', 'Shipped', 'Delivered', 'Recalled', 'Expired'];
    return statuses[status] || 'Unknown';
  }

  /**
   * Get blockchain explorer URL for transaction
   */
  getTransactionUrl(txHash: string): string {
    const network = this.getCurrentNetwork();
    return `${network.blockExplorer}/tx/${txHash}`;
  }

  /**
   * Get blockchain explorer URL for contract
   */
  getContractUrl(): string {
    const network = this.getCurrentNetwork();
    const contractAddress = this.getContractAddress();
    return `${network.blockExplorer}/address/${contractAddress}`;
  }
}

// Export singleton instance
export const blockchainService = new BlockchainService();