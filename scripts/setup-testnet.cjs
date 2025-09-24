#!/usr/bin/env node

/**
 * WayAI Testnet Setup Script
 * Helps users get ready for Sepolia deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 WayAI Testnet Setup Guide');
console.log('==============================\n');

// Check if .env exists
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env file not found. Please create one from .env.example\n');
  process.exit(1);
}

console.log('✅ .env file found\n');

// Read current .env
const envContent = fs.readFileSync(envPath, 'utf8');
const lines = envContent.split('\n');

console.log('📋 Current Configuration Status:');
console.log('--------------------------------');

// Check each required field
const requiredFields = [
  { key: 'INFURA_PROJECT_ID', description: 'Infura Project ID' },
  { key: 'PRIVATE_KEY', description: 'Wallet Private Key' },
  { key: 'ETHERSCAN_API_KEY', description: 'Etherscan API Key' },
];

let allConfigured = true;

requiredFields.forEach(field => {
  const line = lines.find(l => l.startsWith(`${field.key}=`));
  if (line && !line.includes('your_') && !line.includes('YOUR_')) {
    console.log(`✅ ${field.description}: Configured`);
  } else {
    console.log(`❌ ${field.description}: Not configured`);
    allConfigured = false;
  }
});

console.log('\n🔧 Setup Instructions:');
console.log('======================');

if (!allConfigured) {
  console.log('\n1. Get Infura Project ID:');
  console.log('   - Go to https://infura.io');
  console.log('   - Create a free account');
  console.log('   - Create a new project');
  console.log('   - Copy the Project ID\n');

  console.log('2. Get Wallet Private Key:');
  console.log('   - Open MetaMask or your preferred wallet');
  console.log('   - Create a new account for testing');
  console.log('   - Export the private key (Account Details > Export Private Key)');
  console.log('   - ⚠️  Never use your main wallet private key!\n');

  console.log('3. Get Etherscan API Key:');
  console.log('   - Go to https://etherscan.io');
  console.log('   - Create a free account');
  console.log('   - Go to API Keys section');
  console.log('   - Create a new API key\n');

  console.log('4. Get Sepolia Testnet ETH:');
  console.log('   - Visit: https://sepoliafaucet.com');
  console.log('   - Enter your wallet address');
  console.log('   - Request 0.1 ETH (may take a few minutes)\n');

  console.log('5. Update your .env file with the values above\n');

  console.log('6. Run deployment:');
  console.log('   npx hardhat run scripts/deploy.cjs --network sepolia\n');
} else {
  console.log('🎉 All configuration looks good!');
  console.log('\nNext steps:');
  console.log('1. Make sure you have Sepolia ETH in your wallet');
  console.log('2. Run: npx hardhat run scripts/deploy.cjs --network sepolia');
}

console.log('\n📚 Useful Links:');
console.log('================');
console.log('• Infura: https://infura.io');
console.log('• Etherscan: https://etherscan.io');
console.log('• Sepolia Faucet: https://sepoliafaucet.com');
console.log('• Chainlink Faucet: https://faucets.chain.link/sepolia');
console.log('• Alchemy Faucet: https://faucet.alchemy.com\n');

console.log('💡 Need help? Check the README.md file for detailed instructions.');