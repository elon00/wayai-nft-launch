// Network configurations for WayAI platform
export interface NetworkConfig {
  chainId: number;
  name: string;
  displayName: string;
  rpcUrl: string;
  blockExplorer: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  isTestnet: boolean;
  faucets?: string[];
  features: {
    staking: boolean;
    lending: boolean;
    governance: boolean;
    bridge: boolean;
  };
}

export const NETWORKS: Record<number, NetworkConfig> = {
  // Ethereum Mainnet
  1: {
    chainId: 1,
    name: 'ethereum',
    displayName: 'Ethereum Mainnet',
    rpcUrl: 'https://mainnet.infura.io/v3/',
    blockExplorer: 'https://etherscan.io',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    isTestnet: false,
    features: {
      staking: true,
      lending: true,
      governance: true,
      bridge: true,
    },
  },

  // Sepolia Testnet (Recommended)
  11155111: {
    chainId: 11155111,
    name: 'sepolia',
    displayName: 'Sepolia Testnet',
    rpcUrl: 'https://sepolia.infura.io/v3/',
    blockExplorer: 'https://sepolia.etherscan.io',
    nativeCurrency: {
      name: 'Sepolia Ether',
      symbol: 'SepoliaETH',
      decimals: 18,
    },
    isTestnet: true,
    faucets: [
      'https://sepoliafaucet.com',
      'https://faucet.sepolia.dev',
      'https://sepolia-faucet.pk910.de',
      'https://faucets.chain.link/sepolia',
    ],
    features: {
      staking: true,
      lending: false,
      governance: false,
      bridge: false,
    },
  },

  // Goerli Testnet (Deprecated)
  5: {
    chainId: 5,
    name: 'goerli',
    displayName: 'Goerli Testnet',
    rpcUrl: 'https://goerli.infura.io/v3/',
    blockExplorer: 'https://goerli.etherscan.io',
    nativeCurrency: {
      name: 'Goerli Ether',
      symbol: 'GoerliETH',
      decimals: 18,
    },
    isTestnet: true,
    faucets: [
      'https://faucet.goerli.mudit.blog',
      'https://goerlifaucet.com',
    ],
    features: {
      staking: true,
      lending: false,
      governance: false,
      bridge: false,
    },
  },

  // Polygon Mumbai Testnet
  80001: {
    chainId: 80001,
    name: 'mumbai',
    displayName: 'Polygon Mumbai',
    rpcUrl: 'https://rpc-mumbai.maticvigil.com',
    blockExplorer: 'https://mumbai.polygonscan.com',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    isTestnet: true,
    faucets: [
      'https://faucet.polygon.technology',
      'https://mumbaifaucet.com',
    ],
    features: {
      staking: true,
      lending: false,
      governance: false,
      bridge: true,
    },
  },

  // Polygon Mainnet
  137: {
    chainId: 137,
    name: 'polygon',
    displayName: 'Polygon Mainnet',
    rpcUrl: 'https://polygon-rpc.com',
    blockExplorer: 'https://polygonscan.com',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    isTestnet: false,
    features: {
      staking: true,
      lending: true,
      governance: true,
      bridge: true,
    },
  },

  // Binance Smart Chain Testnet
  97: {
    chainId: 97,
    name: 'bsc-testnet',
    displayName: 'BSC Testnet',
    rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545',
    blockExplorer: 'https://testnet.bscscan.com',
    nativeCurrency: {
      name: 'Binance Coin',
      symbol: 'BNB',
      decimals: 18,
    },
    isTestnet: true,
    faucets: [
      'https://testnet.binance.org/faucet-smart',
    ],
    features: {
      staking: true,
      lending: false,
      governance: false,
      bridge: true,
    },
  },
};

// Default network configuration
export const DEFAULT_NETWORK = NETWORKS[11155111]; // Sepolia

// Network utilities
export const getNetworkByChainId = (chainId: number): NetworkConfig | undefined => {
  return NETWORKS[chainId];
};

export const getNetworkByName = (name: string): NetworkConfig | undefined => {
  return Object.values(NETWORKS).find(network => network.name === name);
};

export const getTestnetNetworks = (): NetworkConfig[] => {
  return Object.values(NETWORKS).filter(network => network.isTestnet);
};

export const getMainnetNetworks = (): NetworkConfig[] => {
  return Object.values(NETWORKS).filter(network => !network.isTestnet);
};

export const isValidNetwork = (chainId: number): boolean => {
  return chainId in NETWORKS;
};

// RPC URL builders
export const buildInfuraRpcUrl = (projectId: string, network: string = 'sepolia'): string => {
  return `https://${network}.infura.io/v3/${projectId}`;
};

export const buildAlchemyRpcUrl = (apiKey: string, network: string = 'eth-sepolia'): string => {
  return `https://${network}.g.alchemy.com/v2/${apiKey}`;
};

// Faucet utilities
export const getFaucetForNetwork = (chainId: number): string[] => {
  const network = NETWORKS[chainId];
  return network?.faucets || [];
};

export const getBestFaucetForNetwork = (chainId: number): string | null => {
  const faucets = getFaucetForNetwork(chainId);
  if (faucets.length === 0) return null;

  // Prioritize faucets based on reliability and speed
  const priorityFaucets: Record<number, string[]> = {
    11155111: [
      'https://sepoliafaucet.com',
      'https://faucets.chain.link/sepolia',
      'https://faucet.sepolia.dev',
    ],
    5: [
      'https://faucet.goerli.mudit.blog',
      'https://goerlifaucet.com',
    ],
    80001: [
      'https://faucet.polygon.technology',
      'https://mumbaifaucet.com',
    ],
    97: [
      'https://testnet.binance.org/faucet-smart',
    ],
  };

  const priorityList = priorityFaucets[chainId] || faucets;
  return priorityList[0] || null;
};