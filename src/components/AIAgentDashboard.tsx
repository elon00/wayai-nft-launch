import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { aiAgentManager, AIAgent, AITask, NFTGenerationRequest, NFTGenerationResult } from '@/lib/aiAgents';
import { formatTimeAgo } from '@/lib/utils';

interface AIAgentDashboardProps {
  onNFTGenerated?: (result: NFTGenerationResult) => void;
}

export const AIAgentDashboard = ({ onNFTGenerated }: AIAgentDashboardProps) => {
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);
  const [tasks, setTasks] = useState<AITask[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationRequest, setGenerationRequest] = useState<NFTGenerationRequest>({
    theme: 'sci-fi',
    style: 'cyberpunk',
    colors: ['#00ffff', '#ff00ff', '#00ff00'],
    complexity: 'medium',
    rarity: 'rare',
    attributes: {}
  });

  useEffect(() => {
    const loadAgents = () => {
      const allAgents = aiAgentManager.getAllAgents();
      setAgents(allAgents);
      if (allAgents.length > 0 && !selectedAgent) {
        setSelectedAgent(allAgents[0]);
      }
    };

    loadAgents();
    const interval = setInterval(loadAgents, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, [selectedAgent]);

  useEffect(() => {
    if (selectedAgent) {
      const agentTasks = aiAgentManager.getAgentTasks(selectedAgent.id);
      setTasks(agentTasks);
    }
  }, [selectedAgent]);

  const handleGenerateNFT = async () => {
    if (!selectedAgent || selectedAgent.id !== 'nft-generator') {
      alert('Please select the NFT Generator agent');
      return;
    }

    setIsGenerating(true);
    try {
      const result = await aiAgentManager.generateNFT(generationRequest);
      if (onNFTGenerated) {
        onNFTGenerated(result);
      }
      alert(`NFT Generated Successfully!\nName: ${result.metadata.name}\nDescription: ${result.metadata.description}`);
    } catch (error) {
      alert(`Generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleMarketAnalysis = async () => {
    if (!selectedAgent || selectedAgent.id !== 'market-analyzer') {
      alert('Please select the Market Oracle agent');
      return;
    }

    try {
      const result = await aiAgentManager.analyzeMarket();
      alert(`Market Analysis Complete!\nTrend: ${result.marketTrend}\nAverage Price: ${result.averagePrice} ETH\n24h Volume: $${result.volume24h.toLocaleString()}`);
    } catch (error) {
      alert(`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const getStatusColor = (status: AIAgent['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-gray-500';
      case 'training': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTaskStatusColor = (status: AITask['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'running': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">AI Agent Control Center</h1>
        <p className="text-gray-300 text-lg">
          Manage and interact with WayAI's intelligent agents for NFT generation, market analysis, and more
        </p>
      </div>

      {/* Agent Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {agents.map((agent) => (
          <Card
            key={agent.id}
            className={`cursor-pointer transition-all duration-200 ${
              selectedAgent?.id === agent.id
                ? 'ring-2 ring-purple-500 bg-purple-900/20'
                : 'bg-white/10 hover:bg-white/20'
            }`}
            onClick={() => setSelectedAgent(agent)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-white">{agent.name}</CardTitle>
                <div className={`w-3 h-3 rounded-full ${getStatusColor(agent.status)}`} />
              </div>
              <CardDescription className="text-gray-300 text-sm">
                {agent.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Accuracy:</span>
                  <span className="text-white">{(agent.performance.accuracy * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Speed:</span>
                  <span className="text-white">{(agent.performance.speed * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Reliability:</span>
                  <span className="text-white">{(agent.performance.reliability * 100).toFixed(0)}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selected Agent Details */}
      {selectedAgent && (
        <Card className="bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-2xl">{selectedAgent.name}</CardTitle>
            <CardDescription className="text-gray-300">
              {selectedAgent.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {(selectedAgent.performance.accuracy * 100).toFixed(0)}%
                </div>
                <div className="text-sm text-gray-400">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {(selectedAgent.performance.speed * 100).toFixed(0)}%
                </div>
                <div className="text-sm text-gray-400">Speed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {(selectedAgent.performance.reliability * 100).toFixed(0)}%
                </div>
                <div className="text-sm text-gray-400">Reliability</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {selectedAgent.capabilities.map((capability) => (
                <Badge key={capability} variant="secondary" className="bg-purple-600 text-white">
                  {capability}
                </Badge>
              ))}
            </div>

            {/* Agent-specific controls */}
            {selectedAgent.id === 'nft-generator' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">NFT Generation Controls</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="theme-select" className="block text-sm text-gray-300 mb-1">Theme</label>
                    <select
                      id="theme-select"
                      className="w-full p-2 bg-white/20 border border-white/30 rounded text-white"
                      value={generationRequest.theme}
                      onChange={(e) => setGenerationRequest({...generationRequest, theme: e.target.value})}
                    >
                      <option value="sci-fi">Sci-Fi</option>
                      <option value="cyberpunk">Cyberpunk</option>
                      <option value="minimalist">Minimalist</option>
                      <option value="abstract">Abstract</option>
                      <option value="realistic">Realistic</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="style-select" className="block text-sm text-gray-300 mb-1">Style</label>
                    <select
                      id="style-select"
                      className="w-full p-2 bg-white/20 border border-white/30 rounded text-white"
                      value={generationRequest.style}
                      onChange={(e) => setGenerationRequest({...generationRequest, style: e.target.value as any})}
                    >
                      <option value="cyberpunk">Cyberpunk</option>
                      <option value="sci-fi">Sci-Fi</option>
                      <option value="minimalist">Minimalist</option>
                      <option value="abstract">Abstract</option>
                      <option value="realistic">Realistic</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="rarity-select" className="block text-sm text-gray-300 mb-1">Rarity</label>
                    <select
                      id="rarity-select"
                      className="w-full p-2 bg-white/20 border border-white/30 rounded text-white"
                      value={generationRequest.rarity}
                      onChange={(e) => setGenerationRequest({...generationRequest, rarity: e.target.value as any})}
                    >
                      <option value="common">Common</option>
                      <option value="rare">Rare</option>
                      <option value="epic">Epic</option>
                      <option value="legendary">Legendary</option>
                    </select>
                  </div>
                </div>
                <Button
                  onClick={handleGenerateNFT}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  {isGenerating ? 'Generating NFT...' : 'Generate Sci-Fi NFT'}
                </Button>
              </div>
            )}

            {selectedAgent.id === 'market-analyzer' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Market Analysis</h3>
                <Button
                  onClick={handleMarketAnalysis}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                >
                  Analyze Market Trends
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Task History */}
      <Card className="bg-white/10 border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Recent Tasks</CardTitle>
          <CardDescription className="text-gray-300">
            View the latest AI agent activities and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tasks.slice(0, 5).map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${getTaskStatusColor(task.status)}`} />
                    <span className="text-white font-medium capitalize">{task.type}</span>
                    <span className="text-gray-400 text-sm">
                      {formatTimeAgo(task.startTime)}
                    </span>
                  </div>
                  {task.progress > 0 && (
                    <div className="mt-2">
                      <Progress value={task.progress} className="h-2" />
                    </div>
                  )}
                </div>
                <Badge variant="outline" className="text-xs">
                  {task.status}
                </Badge>
              </div>
            ))}
            {tasks.length === 0 && (
              <div className="text-center text-gray-400 py-4">
                No recent tasks
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};