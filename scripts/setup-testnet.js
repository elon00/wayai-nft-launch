#!/usr/bin/env node

/**
 * WayAI Testnet Setup Script
 * This script helps users set up their MetaMask wallet for Sepolia testnet
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise(resolve => rl.question(query, resolve));

console.log('🚀 WayAI Testnet Setup Script');
console.log('=============================\n');

console.log('This script will help you:');
console.log('1. Configure MetaMask for Sepolia testnet');
console.log('2. Set up environment variables');
console.log('3. Request test ETH from faucets');
console.log('4. Test your wallet connection\n');

async function setupTestnet() {
  try {
    // Check if .env exists
    const envPath = path.join(__dirname, '..', '.env');
    const envExamplePath = path.join(__dirname, '..', '.env.example');

    if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
      console.log('📝 Creating .env file from template...');
      fs.copyFileSync(envExamplePath, envPath);
      console.log('✅ .env file created successfully!\n');
    }

    // Get user input for API keys
    console.log('🔑 API Key Setup');
    console.log('You can get these API keys for free:');
    console.log('- Infura: https://infura.io');
    console.log('- Alchemy: https://alchemy.com');
    console.log('- WalletConnect: https://cloud.walletconnect.com\n');

    const infuraKey = await question('Enter your Infura Project ID (or press Enter to skip): ');
    const alchemyKey = await question('Enter your Alchemy API Key (or press Enter to skip): ');
    const walletConnectId = await question('Enter your WalletConnect Project ID (or press Enter to skip): ');

    // Update .env file if keys provided
    if (infuraKey || alchemyKey || walletConnectId) {
      let envContent = fs.readFileSync(envPath, 'utf8');

      if (infuraKey) {
        envContent = envContent.replace(
          /VITE_INFURA_PROJECT_ID=.*/,
          `VITE_INFURA_PROJECT_ID=${infuraKey}`
        );
      }

      if (alchemyKey) {
        envContent = envContent.replace(
          /VITE_ALCHEMY_API_KEY=.*/,
          `VITE_ALCHEMY_API_KEY=${alchemyKey}`
        );
      }

      if (walletConnectId) {
        envContent = envContent.replace(
          /VITE_WALLET_CONNECT_PROJECT_ID=.*/,
          `VITE_WALLET_CONNECT_PROJECT_ID=${walletConnectId}`
        );
      }

      fs.writeFileSync(envPath, envContent);
      console.log('✅ Environment variables updated!\n');
    }

    // Network configuration
    console.log('🌐 Network Configuration');
    console.log('Recommended testnet: Sepolia (Most stable and widely supported)');
    console.log('Chain ID: 11155111');
    console.log('RPC URL: https://sepolia.infura.io/v3/YOUR_PROJECT_ID\n');

    const useSepolia = await question('Do you want to use Sepolia testnet? (y/n): ');

    if (useSepolia.toLowerCase() === 'y' || useSepolia.toLowerCase() === 'yes') {
      console.log('\n📋 MetaMask Setup Instructions:');
      console.log('1. Open MetaMask browser extension');
      console.log('2. Click the network dropdown (top of the app)');
      console.log('3. Click "Add Network"');
      console.log('4. Enter the following details:');
      console.log('   - Network Name: Sepolia Testnet');
      console.log('   - New RPC URL: https://sepolia.infura.io/v3/' + (infuraKey || 'YOUR_PROJECT_ID'));
      console.log('   - Chain ID: 11155111');
      console.log('   - Currency Symbol: SepoliaETH');
      console.log('   - Block Explorer URL: https://sepolia.etherscan.io');
      console.log('5. Click "Save"');

      const metamaskConfigured = await question('\nHave you configured MetaMask for Sepolia? (y/n): ');

      if (metamaskConfigured.toLowerCase() === 'y' || metamaskConfigured.toLowerCase() === 'yes') {
        console.log('\n💰 Faucet Information');
        console.log('You need test ETH to interact with the platform.');
        console.log('Recommended faucets for Sepolia:');
        console.log('1. https://sepoliafaucet.com (Fastest)');
        console.log('2. https://faucets.chain.link/sepolia (Includes test LINK)');
        console.log('3. https://faucet.sepolia.dev (Google Cloud)');

        const requestFaucet = await question('\nDo you want to visit a faucet now? (y/n): ');

        if (requestFaucet.toLowerCase() === 'y' || requestFaucet.toLowerCase() === 'yes') {
          console.log('\n🔗 Opening Sepolia faucet...');
          console.log('Please visit: https://sepoliafaucet.com');
          console.log('Enter your wallet address and complete the captcha.');
          console.log('You should receive 0.5-1.0 SepoliaETH within a few minutes.');
        }
      }
    }

    console.log('\n✅ Testnet setup complete!');
    console.log('\nNext steps:');
    console.log('1. Start the development server: npm run dev');
    console.log('2. Open http://localhost:3000');
    console.log('3. Connect your MetaMask wallet');
    console.log('4. Generate your first AI-powered NFT!');

    console.log('\n🎉 Happy testing with WayAI!');

  } catch (error) {
    console.error('❌ Error during setup:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

setupTestnet();