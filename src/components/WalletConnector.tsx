import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useWallet } from '@/hooks/useBlockchain';
import { formatAddress, formatBalance } from '@/lib/utils';
import { NETWORKS } from '@/lib/networks';
import { Wallet, ExternalLink, Copy, CheckCircle, AlertCircle } from 'lucide-react';

interface WalletConnectorProps {
  onWalletConnected?: (address: string) => void;
  onWalletDisconnected?: () => void;
}

export const WalletConnector = ({ onWalletConnected, onWalletDisconnected }: WalletConnectorProps) => {
  const { walletState, connect, disconnect, isConnecting } = useWallet();
  const [showNetworkModal, setShowNetworkModal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (walletState.connected && onWalletConnected) {
      onWalletConnected(walletState.address!);
    } else if (!walletState.connected && onWalletDisconnected) {
      onWalletDisconnected();
    }
  }, [walletState.connected, onWalletConnected, onWalletDisconnected]);

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      alert('Failed to connect wallet. Please make sure MetaMask is installed and try again.');
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  const copyAddress = async () => {
    if (walletState.address) {
      await navigator.clipboard.writeText(walletState.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const openBlockExplorer = () => {
    if (walletState.address && walletState.chainId) {
      const network = NETWORKS[walletState.chainId];
      if (network) {
        window.open(`${network.blockExplorer}/address/${walletState.address}`, '_blank');
      }
    }
  };

  const getNetworkInfo = () => {
    if (!walletState.chainId) return null;
    return NETWORKS[walletState.chainId];
  };

  const networkInfo = getNetworkInfo();

  if (walletState.connected && walletState.address) {
    return (
      <Card className="bg-white/10 border-white/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Wallet Connected
            </CardTitle>
            <Badge variant="outline" className="text-green-400 border-green-400">
              <CheckCircle className="h-3 w-3 mr-1" />
              Connected
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">Address</div>
              <div className="text-white font-mono">{formatAddress(walletState.address)}</div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={copyAddress}
                className="border-white/30 text-white hover:bg-white/10"
              >
                {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={openBlockExplorer}
                className="border-white/30 text-white hover:bg-white/10"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">Balance</div>
              <div className="text-white font-semibold">{formatBalance(walletState.balance)} ETH</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Network</div>
              <div className="text-white font-medium">
                {networkInfo?.displayName || 'Unknown'}
              </div>
            </div>
          </div>

          {networkInfo?.isTestnet && (
            <div className="flex items-center gap-2 p-2 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
              <AlertCircle className="h-4 w-4 text-yellow-400" />
              <span className="text-sm text-yellow-400">
                Connected to {networkInfo.displayName} testnet
              </span>
            </div>
          )}

          <Button
            onClick={handleDisconnect}
            variant="outline"
            className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10"
          >
            Disconnect Wallet
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/10 border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Connect Wallet
        </CardTitle>
        <CardDescription className="text-gray-300">
          Connect your MetaMask wallet to start using WayAI
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <Button
            onClick={handleConnect}
            disabled={isConnecting}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            size="lg"
          >
            {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
          </Button>

          <div className="text-center">
            <span className="text-sm text-gray-400">Don't have MetaMask? </span>
            <a
              href="https://metamask.io/download/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-purple-400 hover:text-purple-300 underline"
            >
              Download here
            </a>
          </div>
        </div>

        <div className="border-t border-white/10 pt-4">
          <h4 className="text-sm font-medium text-white mb-2">Supported Networks</h4>
          <div className="space-y-2">
            {Object.values(NETWORKS).slice(0, 4).map((network) => (
              <div key={network.chainId} className="flex items-center justify-between text-sm">
                <span className="text-gray-300">{network.displayName}</span>
                <Badge variant="outline" className="text-xs">
                  {network.nativeCurrency.symbol}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 pt-4">
          <h4 className="text-sm font-medium text-white mb-2">Quick Setup</h4>
          <div className="space-y-2 text-sm text-gray-300">
            <div>1. Install MetaMask browser extension</div>
            <div>2. Create or import your wallet</div>
            <div>3. Switch to Sepolia testnet (recommended)</div>
            <div>4. Get test ETH from a faucet</div>
            <div>5. Connect to WayAI</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};