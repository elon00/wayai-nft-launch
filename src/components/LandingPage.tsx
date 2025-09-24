import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

const LandingPage = () => {
  const [walletAddress, setWalletAddress] = useState('')
  const [isClaiming, setIsClaiming] = useState(false)

  const handleClaim = async () => {
    if (!walletAddress) return

    setIsClaiming(true)
    // Simulate claim process
    setTimeout(() => {
      setIsClaiming(false)
      alert('NFT claimed successfully!')
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-6">
            WayAI
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Claim your exclusive AI-powered NFT and join the future of decentralized intelligence.
            Built by Martin Luther.
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
              Learn More
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-900">
              View Collection
            </Button>
          </div>
        </div>

        {/* NFT Preview Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[1, 2, 3].map((item) => (
            <Card key={item} className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardHeader>
                <div className="w-full h-48 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg mb-4 flex items-center justify-center">
                  <div className="text-4xl">🤖</div>
                </div>
                <CardTitle>WayAI NFT #{item}</CardTitle>
                <CardDescription className="text-gray-300">
                  Unique AI-powered digital collectible with advanced capabilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Rarity:</span>
                    <span className="text-purple-300">Legendary</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Power:</span>
                    <span className="text-blue-300">∞</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Intelligence:</span>
                    <span className="text-green-300">Maximum</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Claim Section */}
        <div className="max-w-md mx-auto">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Claim Your NFT</CardTitle>
              <CardDescription className="text-gray-300">
                Connect your wallet to claim your exclusive WayAI NFT
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Enter your wallet address"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="bg-white/20 border-white/30 text-white placeholder-gray-400"
                />
              </div>
              <Button
                onClick={handleClaim}
                disabled={!walletAddress || isClaiming}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                size="lg"
              >
                {isClaiming ? 'Claiming...' : 'Claim NFT'}
              </Button>
              <p className="text-xs text-gray-400 text-center">
                By claiming, you agree to our terms and conditions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-8 mt-16">
          {[
            { label: 'Total Supply', value: '10,000' },
            { label: 'Claimed', value: '2,847' },
            { label: 'Remaining', value: '7,153' },
            { label: 'Floor Price', value: '0.5 ETH' }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-400">
            <p>&copy; 2024 WayAI. Built by Martin Luther. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage