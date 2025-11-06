import React, { createContext, useContext, useEffect, useState } from 'react';
import { walletService, WalletState } from '../services/wallet';

interface WalletContextValue {
  walletState: WalletState;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  switchNetwork: (network: string) => Promise<void>;
  signMessage: (message: string) => Promise<string>;
  signTransaction: (transaction: any) => Promise<string>;
  isMetaMaskAvailable: boolean;
}

const WalletContext = createContext<WalletContextValue>({
  walletState: {
    isConnected: false,
    address: null,
    chainId: null,
    balance: null,
    networkName: null,
  },
  isConnecting: false,
  connect: async () => {},
  disconnect: async () => {},
  switchNetwork: async () => {},
  signMessage: async () => '',
  signTransaction: async () => '',
  isMetaMaskAvailable: false,
});

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    address: null,
    chainId: null,
    balance: null,
    networkName: null,
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMetaMaskAvailable, setIsMetaMaskAvailable] = useState(false);

  useEffect(() => {
    initializeWallet();
  }, []);

  const initializeWallet = async () => {
    try {
      // Check if MetaMask is available
      const available = await walletService.isMetaMaskAvailable();
      setIsMetaMaskAvailable(available);

      if (available) {
        // Load saved wallet state
        await walletService.loadWalletState();
        setWalletState(walletService.getState());
      }
    } catch (error) {
      console.error('Failed to initialize wallet:', error);
    }
  };

  const connect = async () => {
    if (isConnecting) return;
    
    setIsConnecting(true);
    try {
      const newState = await walletService.connect();
      setWalletState(newState);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    try {
      await walletService.disconnect();
      setWalletState(walletService.getState());
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
      throw error;
    }
  };

  const switchNetwork = async (network: string) => {
    try {
      await walletService.switchNetwork(network as any);
      setWalletState(walletService.getState());
    } catch (error) {
      console.error('Failed to switch network:', error);
      throw error;
    }
  };

  const signMessage = async (message: string): Promise<string> => {
    try {
      return await walletService.signMessage(message);
    } catch (error) {
      console.error('Failed to sign message:', error);
      throw error;
    }
  };

  const signTransaction = async (transaction: any): Promise<string> => {
    try {
      return await walletService.signTransaction(transaction);
    } catch (error) {
      console.error('Failed to sign transaction:', error);
      throw error;
    }
  };

  return (
    <WalletContext.Provider
      value={{
        walletState,
        isConnecting,
        connect,
        disconnect,
        switchNetwork,
        signMessage,
        signTransaction,
        isMetaMaskAvailable,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  return useContext(WalletContext);
}