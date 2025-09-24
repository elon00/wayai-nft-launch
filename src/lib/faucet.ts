// Faucet integration for WayAI platform
import { getBestFaucetForNetwork, NETWORKS } from './networks';

export interface FaucetRequest {
  address: string;
  network: number;
  amount?: string;
}

export interface FaucetResponse {
  success: boolean;
  txHash?: string;
  amount?: string;
  message?: string;
  error?: string;
  waitTime?: number;
}

export interface FaucetInfo {
  name: string;
  url: string;
  isActive: boolean;
  supportedNetworks: number[];
  limits: {
    minAmount: string;
    maxAmount: string;
    cooldownMinutes: number;
  };
  features: {
    requiresCaptcha: boolean;
    requiresTwitter: boolean;
    requiresDiscord: boolean;
    instant: boolean;
  };
}

// Popular faucet configurations
export const FAUCET_CONFIGS: Record<string, FaucetInfo> = {
  sepoliafaucet: {
    name: 'Sepolia Faucet',
    url: 'https://sepoliafaucet.com',
    isActive: true,
    supportedNetworks: [11155111],
    limits: {
      minAmount: '0.1',
      maxAmount: '1.0',
      cooldownMinutes: 1440, // 24 hours
    },
    features: {
      requiresCaptcha: true,
      requiresTwitter: false,
      requiresDiscord: false,
      instant: false,
    },
  },
  chainlink: {
    name: 'Chainlink Faucet',
    url: 'https://faucets.chain.link/sepolia',
    isActive: true,
    supportedNetworks: [11155111, 5],
    limits: {
      minAmount: '0.5',
      maxAmount: '0.5',
      cooldownMinutes: 1440,
    },
    features: {
      requiresCaptcha: true,
      requiresTwitter: false,
      requiresDiscord: false,
      instant: false,
    },
  },
  google: {
    name: 'Google Cloud Faucet',
    url: 'https://faucet.sepolia.dev',
    isActive: true,
    supportedNetworks: [11155111],
    limits: {
      minAmount: '0.5',
      maxAmount: '0.5',
      cooldownMinutes: 1440,
    },
    features: {
      requiresCaptcha: false,
      requiresTwitter: false,
      requiresDiscord: false,
      instant: true,
    },
  },
  alchemy: {
    name: 'Alchemy Faucet',
    url: 'https://faucet.alchemy.com',
    isActive: true,
    supportedNetworks: [11155111, 5, 80001],
    limits: {
      minAmount: '0.1',
      maxAmount: '0.5',
      cooldownMinutes: 1440,
    },
    features: {
      requiresCaptcha: true,
      requiresTwitter: false,
      requiresDiscord: false,
      instant: false,
    },
  },
  infura: {
    name: 'Infura Faucet',
    url: 'https://faucet.infura.io',
    isActive: true,
    supportedNetworks: [11155111, 5],
    limits: {
      minAmount: '0.2',
      maxAmount: '0.5',
      cooldownMinutes: 1440,
    },
    features: {
      requiresCaptcha: true,
      requiresTwitter: false,
      requiresDiscord: false,
      instant: false,
    },
  },
};

// Faucet Manager Class
export class FaucetManager {
  private static instance: FaucetManager;
  private requestHistory: Map<string, number> = new Map();

  static getInstance(): FaucetManager {
    if (!FaucetManager.instance) {
      FaucetManager.instance = new FaucetManager();
    }
    return FaucetManager.instance;
  }

  async requestFromFaucet(request: FaucetRequest): Promise<FaucetResponse> {
    try {
      // Check if user can request from faucet (cooldown)
      const canRequest = this.canRequestFromFaucet(request.address, request.network);
      if (!canRequest.allowed) {
        return {
          success: false,
          error: `Please wait ${canRequest.waitTimeMinutes || 60} minutes before requesting again`,
          waitTime: (canRequest.waitTimeMinutes || 60) * 60 * 1000,
        };
      }

      // Get the best faucet for the network
      const faucetUrl = getBestFaucetForNetwork(request.network);
      if (!faucetUrl) {
        return {
          success: false,
          error: 'No faucet available for this network',
        };
      }

      // Find faucet configuration
      const faucet = this.getFaucetByUrl(faucetUrl);
      if (!faucet) {
        return {
          success: false,
          error: 'Faucet configuration not found',
        };
      }

      // Make request to faucet
      const response = await this.makeFaucetRequest(faucet, request);

      // Record the request
      this.recordFaucetRequest(request.address, request.network);

      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  private async makeFaucetRequest(faucet: FaucetInfo, request: FaucetRequest): Promise<FaucetResponse> {
    // This would integrate with actual faucet APIs
    // For now, we'll simulate the process

    if (faucet.name === 'Sepolia Faucet') {
      return this.requestFromSepoliaFaucet(faucet, request);
    } else if (faucet.name === 'Chainlink Faucet') {
      return this.requestFromChainlinkFaucet(faucet, request);
    } else if (faucet.name === 'Google Cloud Faucet') {
      return this.requestFromGoogleFaucet(faucet, request);
    }

    // Generic faucet request simulation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          txHash: '0x' + Math.random().toString(16).substr(2, 64),
          amount: request.amount || '0.5',
          message: `Successfully requested ${request.amount || '0.5'} ETH from ${faucet.name}`,
        });
      }, 2000);
    });
  }

  private async requestFromSepoliaFaucet(faucet: FaucetInfo, request: FaucetRequest): Promise<FaucetResponse> {
    // Simulate Sepolia faucet request
    return new Promise((resolve) => {
      setTimeout(() => {
        const success = Math.random() > 0.1; // 90% success rate
        if (success) {
          resolve({
            success: true,
            txHash: '0x' + Math.random().toString(16).substr(2, 64),
            amount: '0.5',
            message: 'Successfully requested 0.5 SepoliaETH. Transaction will be confirmed shortly.',
          });
        } else {
          resolve({
            success: false,
            error: 'Faucet temporarily unavailable. Please try again later.',
          });
        }
      }, 3000);
    });
  }

  private async requestFromChainlinkFaucet(faucet: FaucetInfo, request: FaucetRequest): Promise<FaucetResponse> {
    // Simulate Chainlink faucet request
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          txHash: '0x' + Math.random().toString(16).substr(2, 64),
          amount: '0.5',
          message: 'Successfully requested 0.5 test LINK tokens. Use them for testing Chainlink services.',
        });
      }, 2000);
    });
  }

  private async requestFromGoogleFaucet(faucet: FaucetInfo, request: FaucetRequest): Promise<FaucetResponse> {
    // Simulate Google Cloud faucet request
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          txHash: '0x' + Math.random().toString(16).substr(2, 64),
          amount: '0.5',
          message: 'Successfully requested 0.5 SepoliaETH from Google Cloud Faucet.',
        });
      }, 1000);
    });
  }

  private canRequestFromFaucet(address: string, network: number): { allowed: boolean; waitTimeMinutes?: number } {
    const key = `${address}-${network}`;
    const lastRequest = this.requestHistory.get(key);

    if (!lastRequest) {
      return { allowed: true };
    }

    const networkConfig = NETWORKS[network];
    const cooldownMinutes = 1440; // Default 24 hours

    const timeSinceLastRequest = Date.now() - lastRequest;
    const cooldownMs = cooldownMinutes * 60 * 1000;

    if (timeSinceLastRequest < cooldownMs) {
      const waitTimeMinutes = Math.ceil((cooldownMs - timeSinceLastRequest) / (60 * 1000));
      return { allowed: false, waitTimeMinutes };
    }

    return { allowed: true };
  }

  private recordFaucetRequest(address: string, network: number): void {
    const key = `${address}-${network}`;
    this.requestHistory.set(key, Date.now());
  }

  private getFaucetByUrl(url: string): FaucetInfo | undefined {
    return Object.values(FAUCET_CONFIGS).find(faucet =>
      url.includes(faucet.name.toLowerCase().replace(/\s+/g, ''))
    );
  }

  getAvailableFaucets(network: number): FaucetInfo[] {
    return Object.values(FAUCET_CONFIGS).filter(faucet =>
      faucet.supportedNetworks.includes(network) && faucet.isActive
    );
  }

  getFaucetLimits(network: number): { minAmount: string; maxAmount: string; cooldownMinutes: number } | null {
    const faucets = this.getAvailableFaucets(network);
    if (faucets.length === 0) return null;

    // Return the best limits (lowest minimum, reasonable maximum)
    return {
      minAmount: '0.1',
      maxAmount: '1.0',
      cooldownMinutes: 1440,
    };
  }
}

// Utility functions
export const getFaucetStatus = async (network: number): Promise<{
  available: boolean;
  faucets: FaucetInfo[];
  recommendedFaucet?: string | null;
}> => {
  const manager = FaucetManager.getInstance();
  const faucets = manager.getAvailableFaucets(network);

  return {
    available: faucets.length > 0,
    faucets,
    recommendedFaucet: getBestFaucetForNetwork(network),
  };
};

export const formatFaucetAmount = (amount: string): string => {
  const num = parseFloat(amount);
  return `${num.toFixed(2)} ETH`;
};

export const getNextFaucetRequestTime = (address: string, network: number): Date | null => {
  const manager = FaucetManager.getInstance();
  const canRequest = manager['canRequestFromFaucet'](address, network);

  if (canRequest.allowed) return null;

  return new Date(Date.now() + (canRequest.waitTimeMinutes! * 60 * 1000));
};

// Export singleton instance
export const faucetManager = FaucetManager.getInstance();