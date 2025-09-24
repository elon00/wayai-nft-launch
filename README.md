# WayAI - AI-Powered NFT Platform

![WayAI](https://img.shields.io/badge/WayAI-AI--Powered%20NFT%20Platform-blue)
![Version](https://img.shields.io/badge/version-1.0.0-green)
![License](https://img.shields.io/badge/license-MIT-blue)
![Blockchain](https://img.shields.io/badge/blockchain-Ethereum-orange)

> 🚀 **WayAI** is a cutting-edge AI-powered NFT platform that combines artificial intelligence with decentralized finance (DeFi) capabilities. Built by **Martin Luther**.

## ✨ Features

### 🤖 AI Agent System
- **NFT Generator Pro**: Creates unique sci-fi and cyberpunk NFTs with customizable themes
- **Market Oracle**: Analyzes NFT market trends and pricing with AI predictions
- **Portfolio Sage**: Optimizes NFT portfolios based on risk and return analysis
- **Security Sentinel**: Fraud detection and suspicious activity monitoring

### 🔗 Blockchain Integration
- **Multi-Network Support**: Ethereum Mainnet, Sepolia, Polygon, BSC
- **Wallet Management**: MetaMask integration with real-time balance tracking
- **Smart Contracts**: Full ERC-20, ERC-721, and ERC-1155 support
- **DeFi Operations**: Staking, lending, governance, and bridging

### 🎨 NFT Generation
- **Sci-Fi Themes**: Neural networks, quantum matrices, cyber cores
- **Dynamic Metadata**: AI-generated names, descriptions, and attributes
- **Rarity System**: Common, Rare, Epic, Legendary classifications
- **Multiple Styles**: Cyberpunk, minimalist, abstract, realistic

### 🏗️ Technical Stack
- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: shadcn/ui with Tailwind CSS
- **Blockchain**: Web3 integration with MetaMask
- **AI Integration**: Custom AI agent system with MCP
- **State Management**: React hooks with real-time updates

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and **npm**
- **MetaMask** wallet extension
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/elon00/wayai-nft-launch.git
   cd wayai-nft-launch
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration:
   ```env
   VITE_INFURA_PROJECT_ID=your_infura_project_id
   VITE_ALCHEMY_API_KEY=your_alchemy_api_key
   VITE_WALLET_CONNECT_PROJECT_ID=your_walletconnect_id
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔧 Configuration

### Network Configuration

The platform supports multiple networks:

| Network | Chain ID | Status | Faucet |
|---------|----------|--------|---------|
| Ethereum Mainnet | 1 | ✅ Active | N/A |
| Sepolia Testnet | 11155111 | ✅ Active | ✅ Available |
| Polygon Mainnet | 137 | ✅ Active | N/A |
| Polygon Mumbai | 80001 | ✅ Active | ✅ Available |
| BSC Testnet | 97 | ✅ Active | ✅ Available |

### Environment Variables

```env
# Network Configuration
VITE_NETWORK_ID=11155111
VITE_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID

# API Keys
VITE_INFURA_PROJECT_ID=your_infura_project_id
VITE_ALCHEMY_API_KEY=your_alchemy_api_key
VITE_WALLET_CONNECT_PROJECT_ID=your_walletconnect_id

# Contract Addresses (deploy these first)
VITE_NFT_CONTRACT_ADDRESS=0x...
VITE_TOKEN_CONTRACT_ADDRESS=0x...
VITE_STAKING_CONTRACT_ADDRESS=0x...

# AI Configuration
VITE_AI_API_KEY=your_openai_api_key
VITE_AI_MODEL=gpt-4

# IPFS Storage
VITE_PINATA_API_KEY=your_pinata_key
VITE_PINATA_SECRET_KEY=your_pinata_secret
```

## 🧪 Testing with Testnet

### 1. Get Testnet ETH

**Recommended Faucets for Sepolia:**

1. **Sepolia Faucet** (Fastest)
   - URL: https://sepoliafaucet.com
   - Amount: 0.5-1.0 ETH
   - Cooldown: 24 hours

2. **Chainlink Faucet**
   - URL: https://faucets.chain.link/sepolia
   - Amount: 0.5 ETH
   - Also provides test LINK tokens

3. **Google Cloud Faucet**
   - URL: https://faucet.sepolia.dev
   - Amount: 0.5 ETH
   - Instant transactions

### 2. Configure MetaMask

1. **Add Sepolia Network** to MetaMask:
   - Network Name: Sepolia Testnet
   - RPC URL: https://sepolia.infura.io/v3/YOUR_PROJECT_ID
   - Chain ID: 11155111
   - Currency Symbol: SepoliaETH
   - Block Explorer: https://sepolia.etherscan.io

2. **Get test ETH** from one of the faucets above

3. **Connect your wallet** to the WayAI platform

### 3. Test Features

- **Generate AI NFTs**: Use the AI Agent Dashboard
- **Test Staking**: Stake your test tokens
- **Market Analysis**: Get AI-powered market insights
- **Portfolio Optimization**: Optimize your test portfolio

## 📱 Usage Guide

### Connecting Your Wallet

1. Click "Connect Wallet" in the top navigation
2. Select MetaMask or WalletConnect
3. Approve the connection request
4. Your wallet will be connected to the platform

### Generating NFTs

1. Navigate to the AI Agent Dashboard
2. Select the "NFT Generator Pro" agent
3. Choose your preferred theme and style
4. Click "Generate Sci-Fi NFT"
5. Wait for the AI to create your unique NFT

### Staking Tokens

1. Ensure you have tokens in your wallet
2. Navigate to the Staking section
3. Select the amount to stake
4. Choose your lock period
5. Confirm the transaction

### Market Analysis

1. Select the "Market Oracle" agent
2. Click "Analyze Market Trends"
3. Review the AI-generated market insights
4. Use the predictions for your trading decisions

## 🏗️ Development

### Project Structure

```
wayai-nft-launch/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── AIAgentDashboard.tsx
│   │   └── LandingPage.tsx
│   ├── hooks/              # Custom React hooks
│   │   └── useBlockchain.ts
│   ├── lib/                # Utility libraries
│   │   ├── blockchain.ts   # Blockchain functions
│   │   ├── aiAgents.ts     # AI agent system
│   │   ├── networks.ts     # Network configurations
│   │   ├── faucet.ts       # Faucet integration
│   │   └── utils.ts        # Utility functions
│   ├── types/              # TypeScript definitions
│   └── main.tsx            # Application entry point
├── public/                 # Static assets
├── .env.example           # Environment variables template
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite configuration
```

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run preview         # Preview production build

# Testing
npm run test            # Run tests
npm run test:watch      # Run tests in watch mode

# Linting
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint errors

# Type checking
npm run type-check      # Run TypeScript type checking
```

### Adding New Features

1. **Create Components**: Add new React components in `src/components/`
2. **Add Hooks**: Create custom hooks in `src/hooks/`
3. **Update Types**: Add TypeScript definitions in `src/types/`
4. **Add Utilities**: Create utility functions in `src/lib/`

## 🔒 Security

### Best Practices

- Never commit API keys or private keys to version control
- Use environment variables for all sensitive configuration
- Implement proper input validation and sanitization
- Use HTTPS for all external API calls
- Implement rate limiting for API endpoints

### Smart Contract Security

- All smart contracts should be audited before deployment
- Use established libraries like OpenZeppelin
- Implement proper access controls
- Use multi-signature wallets for contract ownership

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write comprehensive tests for new features
- Update documentation for any API changes
- Ensure all linting checks pass
- Use conventional commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Getting Help

- **Documentation**: Check this README and inline code comments
- **Issues**: Open an issue on GitHub for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions and ideas
- **Email**: Contact support@wayai.app for technical support

### Troubleshooting

#### Common Issues

1. **MetaMask Connection Issues**
   - Ensure MetaMask is installed and unlocked
   - Check that you're on the correct network
   - Try refreshing the page and reconnecting

2. **Transaction Failures**
   - Check your gas balance
   - Ensure you have sufficient tokens
   - Verify the contract addresses are correct

3. **AI Agent Errors**
   - Check your API keys in the environment variables
   - Ensure you have sufficient API quota
   - Try again with a different prompt

#### Performance Tips

- Use a fast RPC endpoint (Alchemy or Infura recommended)
- Keep your browser and MetaMask updated
- Clear browser cache if experiencing issues
- Use a stable internet connection

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Basic NFT generation and minting
- ✅ Multi-network support
- ✅ AI agent system
- ✅ Wallet integration

### Phase 2 (Next)
- 🔄 Advanced DeFi features (lending, borrowing)
- 🔄 Cross-chain bridging
- 🔄 Governance system
- 🔄 Mobile app development

### Phase 3 (Future)
- 🔄 Layer 2 integration
- 🔄 Advanced AI features
- 🔄 Social features
- 🔄 Enterprise solutions

## 🙏 Acknowledgments

- **Built by**: Martin Luther
- **UI Components**: shadcn/ui
- **Blockchain Libraries**: ethers.js, web3.js
- **AI Integration**: OpenAI API
- **Community**: Ethereum and DeFi communities

---

**WayAI** - Where artificial intelligence meets decentralized finance. Built for the future, today. 🚀