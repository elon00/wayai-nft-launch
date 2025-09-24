// Blockchain utility functions for WayAI platform
export interface WalletState {
  connected: boolean;
  address: string | null;
  chainId: number | null;
  balance: string;
}

export interface TransactionResult {
  success: boolean;
  hash?: string;
  error?: string;
  gasUsed?: string;
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

export interface StakeInfo {
  amount: string;
  rewardRate: number;
  lockPeriod: number;
  startTime: number;
  endTime: number;
}

// Wallet connection utilities
export class WalletManager {
  private static instance: WalletManager;
  private walletState: WalletState = {
    connected: false,
    address: null,
    chainId: null,
    balance: '0'
  };

  static getInstance(): WalletManager {
    if (!WalletManager.instance) {
      WalletManager.instance = new WalletManager();
    }
    return WalletManager.instance;
  }

  async connectWallet(): Promise<WalletState> {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });

        const chainId = await window.ethereum.request({
          method: 'eth_chainId'
        });

        const balance = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [accounts[0], 'latest']
        });

        this.walletState = {
          connected: true,
          address: accounts[0],
          chainId: parseInt(chainId, 16),
          balance: this.formatBalance(balance)
        };

        // Listen for account changes
        window.ethereum.on('accountsChanged', this.handleAccountsChanged.bind(this));
        window.ethereum.on('chainChanged', this.handleChainChanged.bind(this));

        return this.walletState;
      } else {
        throw new Error('MetaMask not installed');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  }

  async disconnectWallet(): Promise<void> {
    this.walletState = {
      connected: false,
      address: null,
      chainId: null,
      balance: '0'
    };

    if (window.ethereum) {
      window.ethereum.removeListener('accountsChanged', this.handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', this.handleChainChanged);
    }
  }

  getWalletState(): WalletState {
    return this.walletState;
  }

  private async handleAccountsChanged(accounts: string[]): Promise<void> {
    if (accounts.length === 0) {
      await this.disconnectWallet();
    } else {
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [accounts[0], 'latest']
      });

      this.walletState.address = accounts[0];
      this.walletState.balance = this.formatBalance(balance);
    }
  }

  private async handleChainChanged(chainId: string): Promise<void> {
    this.walletState.chainId = parseInt(chainId, 16);
  }

  private formatBalance(balance: string): string {
    return (parseInt(balance, 16) / 1e18).toFixed(4);
  }
}

// NFT Minting functions
export class NFTManager {
  private static instance: NFTManager;

  static getInstance(): NFTManager {
    if (!NFTManager.instance) {
      NFTManager.instance = new NFTManager();
    }
    return NFTManager.instance;
  }

  async mintNFT(
    contractAddress: string,
    metadata: NFTMetadata,
    recipient: string
  ): Promise<TransactionResult> {
    try {
      const transactionParameters = {
        to: contractAddress,
        from: recipient,
        data: this.encodeMintData(metadata, recipient),
      };

      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });

      return {
        success: true,
        hash: txHash as string,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getNFTBalance(contractAddress: string, owner: string): Promise<string> {
    try {
      const balance = await window.ethereum.request({
        method: 'eth_call',
        params: [{
          to: contractAddress,
          data: this.encodeBalanceOfData(owner),
        }, 'latest']
      });

      return parseInt(balance as string, 16).toString();
    } catch (error) {
      console.error('Error getting NFT balance:', error);
      return '0';
    }
  }

  private encodeMintData(metadata: NFTMetadata, recipient: string): string {
    // Encode function call data for mint function
    // This would need to match your smart contract's mint function signature
    const functionSignature = 'mint(address,string)';
    const encodedMetadata = this.stringToHex(JSON.stringify(metadata));
    const encodedRecipient = this.addressToHex(recipient);

    return '0x' + this.keccak256(functionSignature).substring(0, 8) +
           encodedRecipient.substring(2) + encodedMetadata.substring(2);
  }

  private encodeBalanceOfData(owner: string): string {
    const functionSignature = 'balanceOf(address)';
    const encodedOwner = this.addressToHex(owner);

    return '0x' + this.keccak256(functionSignature).substring(0, 8) +
           encodedOwner.substring(2);
  }

  private stringToHex(str: string): string {
    return Buffer.from(str, 'utf8').toString('hex');
  }

  private addressToHex(address: string): string {
    return address.startsWith('0x') ? address : '0x' + address;
  }

  private keccak256(data: string): string {
    // Simple hash function - in production, use a proper crypto library
    return require('crypto').createHash('sha256').update(data).digest('hex');
  }
}

// Token management functions
export class TokenManager {
  private static instance: TokenManager;

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  async getTokenBalance(contractAddress: string, owner: string): Promise<string> {
    try {
      const balance = await window.ethereum.request({
        method: 'eth_call',
        params: [{
          to: contractAddress,
          data: this.encodeBalanceOfData(owner),
        }, 'latest']
      });

      // Assuming 18 decimals, adjust based on your token
      return (parseInt(balance as string, 16) / 1e18).toString();
    } catch (error) {
      console.error('Error getting token balance:', error);
      return '0';
    }
  }

  async transferTokens(
    contractAddress: string,
    recipient: string,
    amount: string
  ): Promise<TransactionResult> {
    try {
      const transactionParameters = {
        to: contractAddress,
        data: this.encodeTransferData(recipient, amount),
      };

      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });

      return {
        success: true,
        hash: txHash as string,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private encodeBalanceOfData(owner: string): string {
    const functionSignature = 'balanceOf(address)';
    const encodedOwner = this.addressToHex(owner);

    return '0x' + this.keccak256(functionSignature).substring(0, 8) +
           encodedOwner.substring(2);
  }

  private encodeTransferData(recipient: string, amount: string): string {
    const functionSignature = 'transfer(address,uint256)';
    const encodedRecipient = this.addressToHex(recipient);
    const encodedAmount = this.numberToHex(amount);

    return '0x' + this.keccak256(functionSignature).substring(0, 8) +
           encodedRecipient.substring(2) + encodedAmount.substring(2);
  }

  private addressToHex(address: string): string {
    return address.startsWith('0x') ? address : '0x' + address;
  }

  private numberToHex(num: string): string {
    return '0x' + (parseInt(num) * 1e18).toString(16); // Assuming 18 decimals
  }

  private keccak256(data: string): string {
    return require('crypto').createHash('sha256').update(data).digest('hex');
  }
}

// Deposit functionality
export class DepositManager {
  private static instance: DepositManager;

  static getInstance(): DepositManager {
    if (!DepositManager.instance) {
      DepositManager.instance = new DepositManager();
    }
    return DepositManager.instance;
  }

  async depositETH(amount: string, recipient: string): Promise<TransactionResult> {
    try {
      const transactionParameters = {
        to: recipient,
        value: this.ethToWei(amount),
      };

      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });

      return {
        success: true,
        hash: txHash as string,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async depositTokens(
    tokenContract: string,
    amount: string,
    recipient: string
  ): Promise<TransactionResult> {
    try {
      const transactionParameters = {
        to: tokenContract,
        data: this.encodeTransferData(recipient, amount),
      };

      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });

      return {
        success: true,
        hash: txHash as string,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private ethToWei(amount: string): string {
    return '0x' + (parseFloat(amount) * 1e18).toString(16);
  }

  private encodeTransferData(recipient: string, amount: string): string {
    const functionSignature = 'transfer(address,uint256)';
    const encodedRecipient = this.addressToHex(recipient);
    const encodedAmount = this.numberToHex(amount);

    return '0x' + this.keccak256(functionSignature).substring(0, 8) +
           encodedRecipient.substring(2) + encodedAmount.substring(2);
  }

  private addressToHex(address: string): string {
    return address.startsWith('0x') ? address : '0x' + address;
  }

  private numberToHex(num: string): string {
    return '0x' + (parseInt(num) * 1e18).toString(16);
  }

  private keccak256(data: string): string {
    return require('crypto').createHash('sha256').update(data).digest('hex');
  }
}

// Staking functionality
export class StakingManager {
  private static instance: StakingManager;

  static getInstance(): StakingManager {
    if (!StakingManager.instance) {
      StakingManager.instance = new StakingManager();
    }
    return StakingManager.instance;
  }

  async stakeTokens(
    stakingContract: string,
    amount: string,
    lockPeriod: number
  ): Promise<TransactionResult> {
    try {
      const transactionParameters = {
        to: stakingContract,
        data: this.encodeStakeData(amount, lockPeriod),
      };

      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });

      return {
        success: true,
        hash: txHash as string,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async unstakeTokens(stakingContract: string): Promise<TransactionResult> {
    try {
      const transactionParameters = {
        to: stakingContract,
        data: this.encodeUnstakeData(),
      };

      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });

      return {
        success: true,
        hash: txHash as string,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async claimRewards(stakingContract: string): Promise<TransactionResult> {
    try {
      const transactionParameters = {
        to: stakingContract,
        data: this.encodeClaimRewardsData(),
      };

      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });

      return {
        success: true,
        hash: txHash as string,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private encodeStakeData(amount: string, lockPeriod: number): string {
    const functionSignature = 'stake(uint256,uint256)';
    const encodedAmount = this.numberToHex(amount);
    const encodedPeriod = '0x' + lockPeriod.toString(16);

    return '0x' + this.keccak256(functionSignature).substring(0, 8) +
           encodedAmount.substring(2) + encodedPeriod.substring(2);
  }

  private encodeUnstakeData(): string {
    const functionSignature = 'unstake()';
    return '0x' + this.keccak256(functionSignature).substring(0, 8);
  }

  private encodeClaimRewardsData(): string {
    const functionSignature = 'claimRewards()';
    return '0x' + this.keccak256(functionSignature).substring(0, 8);
  }

  private numberToHex(num: string): string {
    return '0x' + (parseInt(num) * 1e18).toString(16);
  }

  private keccak256(data: string): string {
    return require('crypto').createHash('sha256').update(data).digest('hex');
  }
}

// Transaction monitoring
export class TransactionMonitor {
  private static instance: TransactionMonitor;

  static getInstance(): TransactionMonitor {
    if (!TransactionMonitor.instance) {
      TransactionMonitor.instance = new TransactionMonitor();
    }
    return TransactionMonitor.instance;
  }

  async waitForTransaction(txHash: string): Promise<TransactionResult> {
    try {
      let receipt = null;
      let attempts = 0;
      const maxAttempts = 60;

      while (!receipt && attempts < maxAttempts) {
        try {
          receipt = await window.ethereum.request({
            method: 'eth_getTransactionReceipt',
            params: [txHash],
          });

          if (!receipt) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            attempts++;
          }
        } catch (error) {
          attempts++;
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      if (receipt) {
        return {
          success: receipt.status === '0x1',
          hash: txHash,
          gasUsed: parseInt(receipt.gasUsed, 16).toString(),
        };
      } else {
        return {
          success: false,
          hash: txHash,
          error: 'Transaction timeout',
        };
      }
    } catch (error) {
      return {
        success: false,
        hash: txHash,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getTransactionHistory(address: string, limit: number = 10): Promise<any[]> {
    try {
      // This would typically call an API or indexer
      // For now, return empty array
      return [];
    } catch (error) {
      console.error('Error getting transaction history:', error);
      return [];
    }
  }
}

// Global utility functions
export const BlockchainUtils = {
  async getGasPrice(): Promise<string> {
    try {
      const gasPrice = await window.ethereum.request({
        method: 'eth_gasPrice',
      });
      return (parseInt(gasPrice as string, 16) / 1e9).toString();
    } catch (error) {
      console.error('Error getting gas price:', error);
      return '20'; // Default gas price
    }
  },

  async estimateGas(transaction: any): Promise<string> {
    try {
      const gasEstimate = await window.ethereum.request({
        method: 'eth_estimateGas',
        params: [transaction],
      });
      return parseInt(gasEstimate as string, 16).toString();
    } catch (error) {
      console.error('Error estimating gas:', error);
      return '21000'; // Default gas limit
    }
  },

  formatAddress(address: string): string {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  },

  isValidAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  },
};

// Export singleton instances
export const walletManager = WalletManager.getInstance();
export const nftManager = NFTManager.getInstance();
export const tokenManager = TokenManager.getInstance();
export const depositManager = DepositManager.getInstance();
export const stakingManager = StakingManager.getInstance();
export const transactionMonitor = TransactionMonitor.getInstance();