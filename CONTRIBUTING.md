# 🤝 Contributing to WayAI

Thank you for your interest in contributing to WayAI! We welcome contributions from the community and are grateful for your support. This document provides guidelines for contributing to our project.

## 📋 Table of Contents

- [Getting Started](#-getting-started)
- [Development Process](#-development-process)
- [Code Standards](#-code-standards)
- [Testing](#-testing)
- [Documentation](#-documentation)
- [Security](#-security)
- [Community Guidelines](#-community-guidelines)
- [Recognition](#-recognition)

---

## 🚀 Getting Started

### Prerequisites

Before contributing, ensure you have the following installed:

- [Node.js](https://nodejs.org/) >= 18.0.0
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)
- [MetaMask](https://metamask.io/) (for testing)
- [Hardhat](https://hardhat.org/) (for smart contract development)

### Development Setup

1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/wayai.git
   cd wayai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env
   # Edit .env with your development keys
   ```

4. **Start development servers**
   ```bash
   # Terminal 1: Start Hardhat node
   npx hardhat node

   # Terminal 2: Start frontend
   npm run dev
   ```

### Project Structure

```
wayai/
├── contracts/          # Smart contracts
├── scripts/           # Deployment scripts
├── src/              # Frontend source
├── test/             # Contract tests
├── docs/             # Documentation
└── .github/          # GitHub workflows
```

---

## 🔄 Development Process

### 1. Create an Issue

Before starting work, check if there's already an issue for your contribution:

- **Bug Reports**: Use the bug report template
- **Feature Requests**: Use the feature request template
- **Questions**: Use GitHub Discussions

### 2. Fork and Branch

```bash
# Fork the repository on GitHub
# Clone your fork
git clone https://github.com/your-username/wayai.git
cd wayai

# Create a feature branch
git checkout -b feature/amazing-feature
# or
git checkout -b fix/bug-fix
# or
git checkout -b docs/documentation-update
```

### 3. Make Changes

- Follow the [Code Standards](#-code-standards)
- Write tests for new functionality
- Update documentation as needed
- Ensure all tests pass

### 4. Commit Changes

```bash
# Stage your changes
git add .

# Commit with a descriptive message
git commit -m "Add amazing feature: detailed description"

# Follow conventional commit format:
# feat: add new feature
# fix: fix a bug
# docs: update documentation
# style: formatting changes
# refactor: code restructuring
# test: add tests
# chore: maintenance tasks
```

### 5. Push and Create Pull Request

```bash
# Push to your fork
git push origin feature/amazing-feature

# Create a Pull Request on GitHub
```

### 6. Code Review

- Address any feedback from maintainers
- Update your PR as needed
- Ensure CI/CD checks pass

---

## 📏 Code Standards

### General Guidelines

- **Consistency**: Follow existing code style and patterns
- **Readability**: Write clear, self-documenting code
- **Documentation**: Add comments for complex logic
- **Testing**: Write tests for all new functionality

### Frontend Standards

#### TypeScript/React

- Use TypeScript for all new code
- Follow React best practices (hooks, functional components)
- Use custom hooks for reusable logic
- Implement proper error boundaries
- Use React.memo for performance optimization

#### Styling

- Use Tailwind CSS classes consistently
- Follow the design system defined in `src/lib/design-system.ts`
- Use shadcn/ui components when possible
- Maintain responsive design principles

### Smart Contract Standards

#### Solidity

- Use Solidity 0.8.19 or later
- Follow [Solidity Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html)
- Use NatSpec documentation for all functions
- Implement proper access control
- Use OpenZeppelin contracts when possible

#### Security

- Never trust user input - always validate
- Use `ReentrancyGuard` for state-changing functions
- Implement proper access controls
- Use `SafeMath` for arithmetic operations
- Include emergency functions

### Git Standards

#### Commit Messages

Follow [Conventional Commits](https://conventionalcommits.org/):

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

#### Branch Naming

- `feature/feature-name`
- `fix/bug-description`
- `docs/documentation-update`
- `refactor/component-name`
- `test/test-description`

---

## 🧪 Testing

### Testing Requirements

- **Unit Tests**: Required for all new functions
- **Integration Tests**: Required for contract interactions
- **E2E Tests**: Required for critical user flows
- **Security Tests**: Required for smart contracts

### Running Tests

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit        # Unit tests
npm run test:integration # Integration tests
npm run test:e2e         # End-to-end tests
npm run test:contracts   # Smart contract tests

# Run with coverage
npm run test:coverage

# Run security tests
npm run security:audit
```

### Writing Tests

#### Frontend Tests

```typescript
// Use Jest and React Testing Library
import { render, screen, fireEvent } from '@testing-library/react';
import { WalletConnector } from './WalletConnector';

describe('WalletConnector', () => {
  it('should connect wallet on button click', async () => {
    render(<WalletConnector />);
    const button = screen.getByRole('button', { name: /connect wallet/i });
    fireEvent.click(button);
    // Add assertions
  });
});
```

#### Smart Contract Tests

```javascript
const { expect } = require("chai");

describe("WayAINFT", function () {
  it("Should mint NFT correctly", async function () {
    const [owner] = await ethers.getSigners();
    await wayAINFT.mintWithAI(owner.address, "ipfs://metadata", 1);
    expect(await wayAINFT.balanceOf(owner.address)).to.equal(1);
  });
});
```

---

## 📚 Documentation

### Documentation Requirements

- Update README.md for significant changes
- Add inline code documentation
- Update API documentation
- Create user guides for new features

### Documentation Standards

- Use clear, concise language
- Include code examples
- Add screenshots for UI changes
- Keep documentation in sync with code

---

## 🔒 Security

### Security Guidelines

- **Never commit secrets**: Use environment variables
- **Validate all inputs**: Both frontend and smart contracts
- **Follow security best practices**: Use established libraries
- **Report vulnerabilities**: Use responsible disclosure

### Security Testing

```bash
# Run security analysis
npx slither .

# Run Mythril analysis
npx mythril analyze contracts/

# Run contract linter
npm run lint:contracts
```

### Reporting Security Issues

- **Do not** create public issues for security vulnerabilities
- Email: security@wayai.app
- Include detailed reproduction steps
- We follow responsible disclosure practices

---

## 🏗️ Architecture Decisions

### Making Architectural Changes

1. **Propose Changes**: Create an ADR (Architecture Decision Record)
2. **Discuss**: Get feedback from maintainers
3. **Implement**: Follow the established patterns
4. **Document**: Update architecture documentation

### Architecture Decision Records (ADRs)

ADRs document significant architectural decisions:

```
docs/adr/
├── 001-blockchain-integration.md
├── 002-ai-agent-system.md
└── 003-multi-tier-staking.md
```

---

## 🤝 Community Guidelines

### Code of Conduct

- Be respectful and inclusive
- Use welcoming and inclusive language
- Be collaborative
- Focus on what is best for the community
- Show empathy towards other community members

### Communication

- Use GitHub issues for bug reports and features
- Use GitHub discussions for questions and ideas
- Be patient with response times
- Provide constructive feedback

### Recognition

Contributors are recognized through:

- GitHub contributor statistics
- Special mentions in release notes
- Contributor spotlights on social media
- Potential maintainer roles for active contributors

---

## 📝 Pull Request Process

### PR Requirements

- [ ] Follows code standards
- [ ] Includes tests
- [ ] Updates documentation
- [ ] Passes all CI checks
- [ ] Has descriptive title and description
- [ ] References related issues

### PR Template

```markdown
## Description

Brief description of changes

## Related Issues

Fixes #123
Closes #456

## Changes Made

- Added new feature X
- Fixed bug Y
- Updated documentation Z

## Testing

- Added unit tests for X
- Updated integration tests for Y
- Manual testing completed

## Screenshots

[Add screenshots if UI changes]

## Checklist

- [ ] Code follows project standards
- [ ] Tests pass
- [ ] Documentation updated
- [ ] No breaking changes
```

---

## 🎯 Contribution Types

### 🐛 Bug Fixes

- Reproduce the issue locally
- Create a failing test case
- Fix the issue
- Ensure test passes
- Update documentation if needed

### ✨ New Features

- Create an issue for discussion
- Design the feature
- Implement the feature
- Add comprehensive tests
- Update documentation
- Create demo if applicable

### 📖 Documentation

- Improve existing documentation
- Add missing documentation
- Fix typos and errors
- Update screenshots
- Improve clarity

### 🎨 UI/UX Improvements

- Follow design system
- Ensure accessibility
- Test on multiple devices
- Get design feedback
- Maintain consistency

---

## 🚫 Common Mistakes to Avoid

- Don't commit large files or binaries
- Don't make breaking changes without discussion
- Don't ignore test failures
- Don't skip code reviews
- Don't commit secrets or API keys
- Don't make changes without testing

---

## 🏆 Recognition Program

### Contribution Levels

- **Contributor**: Submitted first PR
- **Active Contributor**: 5+ merged PRs
- **Core Contributor**: 20+ merged PRs
- **Maintainer**: Invited by existing maintainers

### Rewards

- GitHub star badges
- Special mentions in releases
- Contributor spotlight features
- Potential maintainer roles
- Conference speaking opportunities

---

## 📞 Getting Help

- **Documentation**: [docs.wayai.app](https://docs.wayai.app)
- **GitHub Issues**: [github.com/your-username/wayai/issues](https://github.com/your-username/wayai/issues)
- **Discussions**: [github.com/your-username/wayai/discussions](https://github.com/your-username/wayai/discussions)
- **Discord**: [discord.gg/wayai](https://discord.gg/wayai)
- **Email**: contributors@wayai.app

---

Thank you for contributing to WayAI! Your efforts help make this project better for everyone. 🚀