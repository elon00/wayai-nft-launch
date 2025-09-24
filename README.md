<div align="center">

# 🚀 WayAI - AI-Powered NFT Platform with DeFi

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.19-blue.svg)](https://soliditylang.org/)
[![React](https://img.shields.io/badge/React-18.2.0-61dafb.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Hardhat](https://img.shields.io/badge/Hardhat-2.19.0-yellow.svg)](https://hardhat.org/)
[![Vite](https://img.shields.io/badge/Vite-4.4.5-646cff.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.3.0-38bdf8.svg)](https://tailwindcss.com/)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-0.8.0-black.svg)](https://ui.shadcn.com/)

**AI-powered NFT generation, staking, and DeFi platform built on Ethereum**

[📖 Documentation](#-documentation) • [🚀 Quick Start](#-quick-start) • [📚 Features](#-features) • [🏗️ Architecture](#-architecture) • [🤝 Contributing](#-contributing)

</div>

---

## 🌟 Overview

WayAI is a revolutionary AI-powered NFT platform that combines cutting-edge artificial intelligence with decentralized finance (DeFi) capabilities. Users can generate unique NFTs using AI agents, stake tokens for rewards, and participate in a comprehensive DeFi ecosystem built on Ethereum.

### ✨ Key Features

- 🤖 **AI-Powered NFT Generation**: Create unique NFTs using advanced AI agents
- 🏦 **Multi-Tier Staking**: Earn rewards with flexible staking options
- 💰 **Token Vesting**: Secure token distribution with vesting schedules
- 🔄 **Cross-Contract Integration**: Seamless interaction between NFT, Token, and Staking contracts
- 🌐 **Multi-Network Support**: Deployed on Ethereum mainnet and testnets
- 🎨 **Modern UI/UX**: Beautiful, responsive interface built with React & Tailwind CSS
- 🔒 **Security First**: Audited smart contracts with industry best practices

---

## 📋 Table of Contents

- [🚀 Quick Start](#-quick-start)
- [📚 Features](#-features)
- [🏗️ Architecture](#-architecture)
- [🛠️ Tech Stack](#-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Deployment](#-deployment)
- [🧪 Testing](#-testing)
- [🔒 Security](#-security)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [🙏 Acknowledgments](#-acknowledgments)

---

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) >= 18.0.0
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MetaMask](https://metamask.io/) wallet
- [Infura](https://infura.io/) or [Alchemy](https://alchemy.com/) account
- [Etherscan](https://etherscan.io/) API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/wayai.git
   cd wayai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys and configuration
   ```

4. **Start local development**
   ```bash
   # Start Hardhat node (in one terminal)
   npx hardhat node

   # Start frontend (in another terminal)
   npm run dev
   ```

5. **Deploy to testnet**
   ```bash
   npx hardhat run scripts/deploy.cjs --network sepolia
   ```

### 🔧 Environment Variables

Create a `.env` file with the following variables:

```env
# Network Configuration
INFURA_PROJECT_ID=your_infura_project_id
PRIVATE_KEY=your_wallet_private_key
ETHERSCAN_API_KEY=your_etherscan_api_key

# Contract Addresses (will be filled after deployment)
VITE_NFT_CONTRACT_ADDRESS=0x...
VITE_TOKEN_CONTRACT_ADDRESS=0x...
VITE_STAKING_CONTRACT_ADDRESS=0x...
```

---

## 📚 Features

### 🤖 AI Agent System
- **NFT Generation**: AI-powered creation of unique digital assets
- **Market Analysis**: Real-time market insights and trends
- **Automated Trading**: Smart contract interactions via AI agents

### 🏦 DeFi Capabilities
- **Multi-Tier Staking**: Bronze, Silver, Gold, and Platinum tiers
- **Token Vesting**: Secure token distribution with cliff periods
- **Reward Distribution**: Automated reward calculation and distribution
- **Liquidity Provision**: Integration with DEX protocols

### 🎨 NFT Features
- **ERC-721 Compliant**: Full standard compliance
- **Royalty Support**: Built-in royalty system for creators
- **Batch Operations**: Efficient bulk minting and transfers
- **Metadata Management**: Dynamic metadata with IPFS support

### 🔒 Security Features
- **Access Control**: Role-based permissions using OpenZeppelin
- **Reentrancy Protection**: Guards against reentrancy attacks
- **Input Validation**: Comprehensive input sanitization
- **Emergency Controls**: Circuit breakers and emergency functions

---

## 🏗️ Architecture

### Smart Contracts

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   WayAINFT      │    │  WayAIToken     │    │  WayAIStaking   │
│                 │    │                 │    │                 │
│ • ERC-721 NFT   │    │ • ERC-20 Token  │    │ • Staking Logic │
│ • AI Minting    │    │ • Vesting       │    │ • Multi-Tier    │
│ • Royalties     │    │ • Burning       │    │ • Rewards       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Frontend      │
                    │                 │
                    │ • React + TS    │
                    │ • Wallet Connect│
                    │ • Contract Int. │
                    └─────────────────┘
```

### Frontend Architecture

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── WalletConnector.tsx
│   ├── AIAgentDashboard.tsx
│   └── LandingPage.tsx
├── hooks/              # Custom React hooks
│   └── useBlockchain.ts
├── lib/                # Utility libraries
│   ├── blockchain.ts   # Web3 interactions
│   ├── aiAgents.ts     # AI agent logic
│   └── networks.ts     # Network configurations
└── types/              # TypeScript type definitions
    └── blockchain.ts
```

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern component library
- **React Router** - Client-side routing
- **Ethers.js** - Ethereum JavaScript library

### Smart Contracts
- **Solidity 0.8.19** - Smart contract language
- **Hardhat** - Ethereum development environment
- **OpenZeppelin** - Secure smart contract library
- **Waffle** - Testing framework for Solidity

### Development Tools
- **ESLint** - JavaScript linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **Commitlint** - Commit message linting
- **TypeChain** - TypeScript bindings for contracts

### Deployment & Monitoring
- **Vercel/Netlify** - Frontend hosting
- **Infura/Alchemy** - RPC providers
- **Etherscan** - Contract verification
- **GitHub Actions** - CI/CD pipeline

---

## 📁 Project Structure

```
wayai/
├── contracts/              # Smart contracts
│   ├── WayAINFT.sol       # ERC-721 NFT contract
│   ├── WayAIToken.sol     # ERC-20 Token contract
│   └── WayAIStaking.sol   # Staking contract
├── scripts/               # Deployment and utility scripts
│   ├── deploy.cjs         # Main deployment script
│   ├── test-contracts.cjs # Contract testing script
│   └── setup-testnet.cjs  # Testnet setup guide
├── src/                   # Frontend source code
│   ├── components/        # React components
│   ├── hooks/            # Custom hooks
│   ├── lib/              # Utility libraries
│   ├── types/            # TypeScript types
│   └── assets/           # Static assets
├── test/                 # Contract tests
├── .github/              # GitHub workflows
├── public/               # Public assets
├── hardhat.config.js     # Hardhat configuration
├── vite.config.ts        # Vite configuration
├── tailwind.config.js    # Tailwind configuration
├── tsconfig.json         # TypeScript configuration
├── package.json          # Dependencies and scripts
└── README.md             # Project documentation
```

---

## 🚀 Deployment

### Local Development

1. **Start Hardhat node**
   ```bash
   npx hardhat node
   ```

2. **Deploy contracts locally**
   ```bash
   npx hardhat run scripts/deploy.cjs --network localhost
   ```

3. **Start frontend**
   ```bash
   npm run dev
   ```

### Testnet Deployment

1. **Setup environment**
   ```bash
   node scripts/setup-testnet.cjs
   ```

2. **Deploy to Sepolia**
   ```bash
   npx hardhat run scripts/deploy.cjs --network sepolia
   ```

3. **Verify contracts**
   ```bash
   npx hardhat verify --network sepolia <contract-address>
   ```

### Mainnet Deployment

1. **Update configuration**
   ```bash
   # Update hardhat.config.js for mainnet
   # Update .env with mainnet settings
   ```

2. **Deploy to mainnet**
   ```bash
   npx hardhat run scripts/deploy.cjs --network mainnet
   ```

---

## 🧪 Testing

### Contract Testing

```bash
# Run all tests
npx hardhat test

# Run with gas reporting
REPORT_GAS=true npx hardhat test

# Run specific test file
npx hardhat test test/WayAINFT.test.js
```

### Frontend Testing

```bash
# Run unit tests
npm run test:unit

# Run e2e tests
npm run test:e2e

# Run all tests
npm test
```

### Security Testing

```bash
# Run Slither security analysis
npx slither .

# Run Mythril security analysis
npx mythril analyze contracts/

# Run contract linter
npm run lint:contracts
```

---

## 🔒 Security

### Security Measures

- **Reentrancy Protection**: All contracts use `ReentrancyGuard`
- **Access Control**: Role-based permissions with OpenZeppelin
- **Input Validation**: Comprehensive input sanitization
- **Emergency Functions**: Circuit breakers for emergency situations
- **Audited Code**: Regular security audits by third parties

### Security Audits

- [Audit Report 1](link-to-audit) - [Date]
- [Audit Report 2](link-to-audit) - [Date]

### Bug Bounty

We maintain an active bug bounty program. Please report security issues to security@wayai.app.

---

## 🤝 Contributing

We welcome contributions from the community! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm test`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Code Style

- Use ESLint and Prettier for code formatting
- Follow Solidity style guide (NatSpec documentation)
- Write comprehensive tests for new features
- Update documentation for any API changes

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **OpenZeppelin** - For secure smart contract libraries
- **Hardhat** - For excellent development tools
- **Infura** - For reliable RPC services
- **shadcn/ui** - For beautiful UI components
- **Ethereum Community** - For continuous innovation

---

## 📞 Support

- **Documentation**: [docs.wayai.app](https://docs.wayai.app)
- **Discord**: [discord.gg/wayai](https://discord.gg/wayai)
- **Twitter**: [@WayAI_Official](https://twitter.com/WayAI_Official)
- **Email**: support@wayai.app

---

<div align="center">

**Built with ❤️ by the WayAI Team**

[⭐ Star us on GitHub](https://github.com/your-username/wayai) • [🐛 Report Issues](https://github.com/your-username/wayai/issues) • [💬 Discussions](https://github.com/your-username/wayai/discussions)

</div>