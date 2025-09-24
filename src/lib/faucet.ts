/**
 * Sepolia Faucet Integration
 * Get free Sepolia ETH for testing
 */

export interface FaucetResponse {
  success: boolean;
  message: string;
  txHash?: string;
  amount?: string;
}

/**
 * Request ETH from Sepolia faucet
 * @param address - Your wallet address
 * @returns Promise with faucet response
 */
export async function requestSepoliaETH(address: string): Promise<FaucetResponse> {
  try {
    // Using Sepolia Faucet API
    const response = await fetch('https://sepoliafaucet.com/api/faucet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ address }),
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: 'ETH requested successfully!',
        txHash: data.txHash,
        amount: data.amount || '0.1 ETH',
      };
    } else {
      return {
        success: false,
        message: data.message || 'Failed to request ETH',
      };
    }
  } catch (error) {
    console.error('Faucet request error:', error);
    return {
      success: false,
      message: 'Network error. Please try again later.',
    };
  }
}

/**
 * Alternative faucet using Infura
 * @param address - Your wallet address
 * @returns Promise with faucet response
 */
export async function requestETHFromInfura(address: string): Promise<FaucetResponse> {
  try {
    // This is a placeholder - Infura doesn't have a direct faucet
    // Users need to use external faucets
    return {
      success: false,
      message: 'Please use an external Sepolia faucet. Visit: https://sepoliafaucet.com or https://faucets.chain.link/sepolia',
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error accessing faucet service',
    };
  }
}

/**
 * Get list of available Sepolia faucets
 */
export function getSepoliaFaucets() {
  return [
    {
      name: 'Sepolia Faucet',
      url: 'https://sepoliafaucet.com',
      description: 'Official Sepolia faucet - 0.1 ETH per request',
    },
    {
      name: 'Chainlink Faucet',
      url: 'https://faucets.chain.link/sepolia',
      description: 'Chainlink Sepolia faucet - 0.1 ETH',
    },
    {
      name: 'Alchemy Faucet',
      url: 'https://faucet.alchemy.com',
      description: 'Alchemy Sepolia faucet - requires account',
    },
    {
      name: 'Infura Faucet',
      url: 'https://www.infura.io/faucet/sepolia',
      description: 'Infura Sepolia faucet - 0.1 ETH',
    },
  ];
}

/**
 * Check if address has enough ETH for deployment
 * @param address - Wallet address to check
 * @param requiredAmount - Required amount in ETH (default: 0.01)
 * @returns Promise<boolean>
 */
export async function hasEnoughETH(address: string, requiredAmount: number = 0.01): Promise<boolean> {
  try {
    const response = await fetch(`https://api-sepolia.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${process.env.ETHERSCAN_API_KEY || 'YOUR_API_KEY'}`);
    const data = await response.json();

    if (data.status === '1') {
      const balance = parseInt(data.result) / 1e18; // Convert wei to ETH
      return balance >= requiredAmount;
    }

    return false;
  } catch (error) {
    console.error('Error checking ETH balance:', error);
    return false;
  }
}