// Blockchain-related type definitions for WayAI platform

export interface TokenInfo {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  balance?: string;
}

export interface NFTInfo {
  tokenId: string;
  contractAddress: string;
  owner: string;
  metadata: NFTMetadata;
  image: string;
  name: string;
  description: string;
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  external_url?: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
    display_type?: string;
  }>;
  animation_url?: string;
}

export interface PoolInfo {
  address: string;
  token0: TokenInfo;
  token1: TokenInfo;
  fee: number;
  liquidity: string;
  volume24h: string;
  apy: number;
}

export interface StakeInfo {
  amount: string;
  rewardRate: number;
  lockPeriod: number;
  startTime: number;
  endTime: number;
  rewardsEarned: string;
  canUnstake: boolean;
}

export interface TransactionInfo {
  hash: string;
  from: string;
  to: string;
  value: string;
  gasPrice: string;
  gasLimit: string;
  gasUsed?: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: number;
  type: 'transfer' | 'mint' | 'stake' | 'unstake' | 'claim' | 'swap' | 'deposit' | 'withdraw';
  description?: string;
}

export interface WalletInfo {
  address: string;
  ensName?: string;
  balance: {
    eth: string;
    tokens: TokenInfo[];
  };
  nfts: NFTInfo[];
  transactions: TransactionInfo[];
}

export interface ContractInfo {
  address: string;
  name: string;
  abi: any[];
  type: 'erc20' | 'erc721' | 'erc1155' | 'staking' | 'dex' | 'lending';
  description?: string;
}

export interface NetworkInfo {
  chainId: number;
  name: string;
  rpcUrl: string;
  blockExplorer: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  isTestnet: boolean;
}

export interface SwapQuote {
  fromToken: TokenInfo;
  toToken: TokenInfo;
  amountIn: string;
  amountOut: string;
  priceImpact: number;
  minimumReceived: string;
  path: string[];
  fees: string;
}

export interface LendingInfo {
  asset: TokenInfo;
  totalSupplied: string;
  totalBorrowed: string;
  supplyAPY: number;
  borrowAPY: number;
  collateralFactor: number;
  userSupplied: string;
  userBorrowed: string;
}

export interface YieldFarm {
  id: string;
  name: string;
  contractAddress: string;
  stakingToken: TokenInfo;
  rewardToken: TokenInfo;
  totalStaked: string;
  apy: number;
  userStaked: string;
  userRewards: string;
  rewardsPerDay: string;
  lockPeriod?: number;
}

export interface BridgeInfo {
  fromChain: NetworkInfo;
  toChain: NetworkInfo;
  fromToken: TokenInfo;
  toToken: TokenInfo;
  amount: string;
  estimatedTime: number;
  fee: string;
  bridgeContract: string;
}

export interface AirdropInfo {
  id: string;
  token: TokenInfo;
  amount: string;
  claimed: boolean;
  claimDeadline: number;
  merkleProof?: string[];
}

export interface VestingInfo {
  token: TokenInfo;
  totalAmount: string;
  claimedAmount: string;
  startTime: number;
  endTime: number;
  cliffTime: number;
  vestingSchedule: 'linear' | 'cliff' | 'custom';
  claimableAmount: string;
}

export interface GovernanceInfo {
  proposalId: string;
  title: string;
  description: string;
  proposer: string;
  status: 'active' | 'succeeded' | 'defeated' | 'queued' | 'executed';
  startTime: number;
  endTime: number;
  forVotes: string;
  againstVotes: string;
  abstainVotes: string;
  userVote?: 'for' | 'against' | 'abstain';
}

export interface AnalyticsData {
  tvl: string;
  volume24h: string;
  volume7d: string;
  transactions24h: number;
  uniqueUsers24h: number;
  priceChange24h: number;
  marketCap: string;
  tokenHolders: number;
}

export interface NotificationInfo {
  id: string;
  type: 'transaction' | 'reward' | 'governance' | 'system' | 'airdrop';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

// Event types for real-time updates
export interface BlockchainEvent {
  type: 'transfer' | 'mint' | 'burn' | 'stake' | 'unstake' | 'claim' | 'swap';
  contractAddress: string;
  transactionHash: string;
  blockNumber: number;
  timestamp: number;
  data: Record<string, any>;
}

// Error types
export interface BlockchainError {
  code: number;
  message: string;
  data?: any;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form types
export interface MintNFTForm {
  name: string;
  description: string;
  image: File | string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
  recipient: string;
  amount: number;
}

export interface StakeForm {
  amount: string;
  lockPeriod: number;
  autoRestake: boolean;
}

export interface SwapForm {
  fromToken: string;
  toToken: string;
  amount: string;
  slippage: number;
  deadline: number;
}

export interface BridgeForm {
  fromChain: number;
  toChain: number;
  token: string;
  amount: string;
  recipient: string;
}

// Configuration types
export interface AppConfig {
  supportedNetworks: NetworkInfo[];
  defaultNetwork: number;
  contracts: Record<string, ContractInfo>;
  tokens: Record<string, TokenInfo>;
  features: {
    staking: boolean;
    lending: boolean;
    governance: boolean;
    bridge: boolean;
    airdrop: boolean;
  };
  limits: {
    maxTransactionValue: string;
    minStakeAmount: string;
    maxSlippage: number;
  };
}

// Utility types
export type Address = string;
export type TokenAmount = string;
export type WeiAmount = string;
export type Hash = string;
export type BlockNumber = number;
export type Timestamp = number;

// Enums
export enum TransactionStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  FAILED = 'failed',
}

export enum TransactionType {
  TRANSFER = 'transfer',
  MINT = 'mint',
  STAKE = 'stake',
  UNSTAKE = 'unstake',
  CLAIM = 'claim',
  SWAP = 'swap',
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

export enum PoolType {
  UNISWAP_V2 = 'uniswap_v2',
  UNISWAP_V3 = 'uniswap_v3',
  SUSHISWAP = 'sushiswap',
  PANCAKESWAP = 'pancakeswap',
}

export enum StakeType {
  FIXED = 'fixed',
  FLEXIBLE = 'flexible',
  LOCKED = 'locked',
}

export enum NotificationType {
  TRANSACTION = 'transaction',
  REWARD = 'reward',
  GOVERNANCE = 'governance',
  SYSTEM = 'system',
  AIRDROP = 'airdrop',
}