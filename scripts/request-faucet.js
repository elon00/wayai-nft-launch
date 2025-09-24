#!/usr/bin/env node

/**
 * WayAI Faucet Request Script
 * This script automates requesting test ETH from various faucets
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const FAUCETS = {
  sepoliafaucet: {
    name: 'Sepolia Faucet',
    url: 'https://sepoliafaucet.com/api/faucet',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: (address) => JSON.stringify({ address }),
    parseResponse: (data) => {
      const response = JSON.parse(data);
      return {
        success: response.status === 'success',
        message: response.message || 'Request submitted successfully',
        txHash: response.txHash,
        waitTime: response.waitTime || 1440, // 24 hours in minutes
      };
    },
  },
  chainlink: {
    name: 'Chainlink Faucet',
    url: 'https://faucets.chain.link/api/faucet',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: (address) => JSON.stringify({
      address,
      network: 'sepolia',
      captcha: 'automated', // This would need manual captcha in real implementation
    }),
    parseResponse: (data) => {
      const response = JSON.parse(data);
      return {
        success: response.success,
        message: response.message || 'Request submitted to Chainlink faucet',
        amount: response.amount || '0.5',
      };
    },
  },
};

function makeRequest(url, options, data) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const req = protocol.request(url, options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(body);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(data);
    }

    req.end();
  });
}

async function requestFromFaucet(faucet, address) {
  try {
    console.log(`🌐 Requesting from ${faucet.name}...`);

    const response = await makeRequest(
      faucet.url,
      {
        method: faucet.method,
        headers: faucet.headers,
      },
      faucet.body(address)
    );

    const result = faucet.parseResponse(response);
    return result;
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage: node scripts/request-faucet.js <wallet_address>');
    console.log('Example: node scripts/request-faucet.js 0x742d35Cc6c053292a4F5a0d8c0c0E6E0F8f5e5e5');
    process.exit(1);
  }

  const address = args[0];

  // Validate Ethereum address
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    console.error('❌ Invalid Ethereum address format');
    process.exit(1);
  }

  console.log('🚰 WayAI Faucet Request Tool');
  console.log('============================\n');
  console.log(`📝 Requesting test ETH for address: ${address}\n`);

  const results = [];

  // Try each faucet
  for (const [key, faucet] of Object.entries(FAUCETS)) {
    console.log(`\n🔄 Trying ${faucet.name}...`);

    try {
      const result = await requestFromFaucet(faucet, address);

      if (result.success) {
        console.log(`✅ Success! ${result.message}`);
        if (result.txHash) {
          console.log(`🔗 Transaction: https://sepolia.etherscan.io/tx/${result.txHash}`);
        }
        if (result.amount) {
          console.log(`💰 Amount: ${result.amount} ETH`);
        }
        if (result.waitTime) {
          console.log(`⏰ Cooldown: ${result.waitTime} minutes`);
        }
      } else {
        console.log(`❌ Failed: ${result.error || 'Unknown error'}`);
      }

      results.push({
        faucet: faucet.name,
        ...result,
      });

      // Add delay between requests to avoid rate limiting
      if (key !== Object.keys(FAUCETS)[Object.keys(FAUCETS).length - 1]) {
        console.log('⏳ Waiting 2 seconds before next request...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (error) {
      console.log(`❌ Error with ${faucet.name}: ${error.message}`);
      results.push({
        faucet: faucet.name,
        success: false,
        error: error.message,
      });
    }
  }

  // Summary
  console.log('\n📊 Request Summary');
  console.log('==================');

  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  if (successful.length > 0) {
    console.log(`✅ Successful requests: ${successful.length}`);
    successful.forEach(r => {
      console.log(`   - ${r.faucet}: ${r.message}`);
    });
  }

  if (failed.length > 0) {
    console.log(`❌ Failed requests: ${failed.length}`);
    failed.forEach(r => {
      console.log(`   - ${r.faucet}: ${r.error}`);
    });
  }

  console.log('\n💡 Tips:');
  console.log('- Some faucets require manual captcha completion');
  console.log('- Wait a few minutes for transactions to confirm');
  console.log('- Check your wallet balance after confirmation');
  console.log('- Most faucets have 24-hour cooldown periods');

  console.log('\n🎉 Faucet requests completed!');
}

main().catch(console.error);