import { useState, useEffect, useCallback } from 'react';
import {
  WalletState,
  walletManager,
  BlockchainUtils,
  TransactionResult,
  NFTMetadata,
  StakeInfo
} from '@/lib/blockchain';

export const useWallet = () => {
  const [walletState, setWalletState] = useState<WalletState>(walletManager.getWalletState());
  const [isConnecting, setIsConnecting] = useState(false);

  const connect = useCallback(async () => {
    setIsConnecting(true);
    try {
      const newState = await walletManager.connectWallet();
      setWalletState(newState);
      return newState;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    try {
      await walletManager.disconnectWallet();
      setWalletState(walletManager.getWalletState());
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  }, []);

  useEffect(() => {
    // Update wallet state when it changes
    const interval = setInterval(() => {
      const currentState = walletManager.getWalletState();
      setWalletState(currentState);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    walletState,
    connect,
    disconnect,
    isConnecting,
  };
};

export const useGasPrice = () => {
  const [gasPrice, setGasPrice] = useState<string>('0');
  const [isLoading, setIsLoading] = useState(false);

  const fetchGasPrice = useCallback(async () => {
    setIsLoading(true);
    try {
      const price = await BlockchainUtils.getGasPrice();
      setGasPrice(price);
    } catch (error) {
      console.error('Failed to fetch gas price:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGasPrice();
    const interval = setInterval(fetchGasPrice, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [fetchGasPrice]);

  return { gasPrice, isLoading, refetch: fetchGasPrice };
};

export const useNFTBalance = (contractAddress: string, owner: string) => {
  const [balance, setBalance] = useState<string>('0');
  const [isLoading, setIsLoading] = useState(false);

  const fetchBalance = useCallback(async () => {
    if (!contractAddress || !owner) return;

    setIsLoading(true);
    try {
      // Import the NFT manager dynamically to avoid circular dependencies
      const { nftManager } = await import('@/lib/blockchain');
      const nftBalance = await nftManager.getNFTBalance(contractAddress, owner);
      setBalance(nftBalance);
    } catch (error) {
      console.error('Failed to fetch NFT balance:', error);
    } finally {
      setIsLoading(false);
    }
  }, [contractAddress, owner]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return { balance, isLoading, refetch: fetchBalance };
};

export const useTokenBalance = (contractAddress: string, owner: string) => {
  const [balance, setBalance] = useState<string>('0');
  const [isLoading, setIsLoading] = useState(false);

  const fetchBalance = useCallback(async () => {
    if (!contractAddress || !owner) return;

    setIsLoading(true);
    try {
      const { tokenManager } = await import('@/lib/blockchain');
      const tokenBalance = await tokenManager.getTokenBalance(contractAddress, owner);
      setBalance(tokenBalance);
    } catch (error) {
      console.error('Failed to fetch token balance:', error);
    } finally {
      setIsLoading(false);
    }
  }, [contractAddress, owner]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return { balance, isLoading, refetch: fetchBalance };
};

export const useTransactionMonitor = () => {
  const [pendingTransactions, setPendingTransactions] = useState<Map<string, TransactionResult>>(new Map());

  const monitorTransaction = useCallback(async (txHash: string): Promise<TransactionResult> => {
    try {
      const { transactionMonitor } = await import('@/lib/blockchain');
      const result = await transactionMonitor.waitForTransaction(txHash);

      setPendingTransactions(prev => {
        const newMap = new Map(prev);
        newMap.set(txHash, result);
        return newMap;
      });

      return result;
    } catch (error) {
      const errorResult: TransactionResult = {
        success: false,
        hash: txHash,
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      setPendingTransactions(prev => {
        const newMap = new Map(prev);
        newMap.set(txHash, errorResult);
        return newMap;
      });

      return errorResult;
    }
  }, []);

  const clearTransaction = useCallback((txHash: string) => {
    setPendingTransactions(prev => {
      const newMap = new Map(prev);
      newMap.delete(txHash);
      return newMap;
    });
  }, []);

  return {
    pendingTransactions,
    monitorTransaction,
    clearTransaction,
  };
};