const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting WayAI Contract Deployment...\n");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString(), "\n");

  // Contract deployment parameters
  const NAME = "WayAI NFT";
  const SYMBOL = "WAYAI";
  const BASE_URI = "https://api.wayai.app/metadata/";
  const CONTRACT_URI = "https://api.wayai.app/contract";

  const TOKEN_NAME = "WayAI Token";
  const TOKEN_SYMBOL = "WAI";

  // Deploy WayAI Token first
  console.log("📝 Deploying WayAI Token...");
  const WayAIToken = await ethers.getContractFactory("WayAIToken");
  const wayAIToken = await WayAIToken.deploy(
    TOKEN_NAME,
    TOKEN_SYMBOL,
    deployer.address, // default admin
    deployer.address, // minter
    deployer.address  // pauser
  );
  await wayAIToken.deployed();
  console.log("✅ WayAI Token deployed to:", wayAIToken.address, "\n");

  // Deploy WayAI NFT
  console.log("🎨 Deploying WayAI NFT...");
  const WayAINFT = await ethers.getContractFactory("WayAINFT");
  const wayAINFT = await WayAINFT.deploy(
    NAME,
    SYMBOL,
    BASE_URI,
    CONTRACT_URI
  );
  await wayAINFT.deployed();
  console.log("✅ WayAI NFT deployed to:", wayAINFT.address, "\n");

  // Deploy WayAI Staking
  console.log("🏦 Deploying WayAI Staking...");
  const WayAIStaking = await ethers.getContractFactory("WayAIStaking");
  const wayAIStaking = await WayAIStaking.deploy(
    wayAIToken.address, // staking token
    wayAINFT.address    // NFT contract
  );
  await wayAIStaking.deployed();
  console.log("✅ WayAI Staking deployed to:", wayAIStaking.address, "\n");

  // Setup contract permissions and configurations
  console.log("⚙️ Setting up contract permissions...");

  // Set staking contract as authorized minter for NFT
  await wayAINFT.setAuthorizedMinter(wayAIStaking.address, true);
  console.log("✅ Staking contract authorized as NFT minter");

  // Transfer some tokens to staking contract for rewards
  const rewardAmount = ethers.utils.parseEther("1000000"); // 1M tokens for rewards
  await wayAIToken.mint(wayAIStaking.address, rewardAmount);
  console.log("✅ Transferred 1M tokens to staking contract for rewards");

  // Update environment file with deployed addresses
  const envPath = ".env";
  let envContent = "";

  try {
    const fs = require("fs");
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, "utf8");
    }
  } catch (error) {
    console.log("ℹ️ .env file not found, will create deployment summary");
  }

  // Add or update contract addresses
  const networkName = network.name;
  const deploymentInfo = `
# WayAI Contract Deployment - ${networkName.toUpperCase()}
# Deployed by: ${deployer.address}
# Deployment Time: ${new Date().toISOString()}

# Contract Addresses
VITE_NFT_CONTRACT_ADDRESS=${wayAINFT.address}
VITE_TOKEN_CONTRACT_ADDRESS=${wayAIToken.address}
VITE_STAKING_CONTRACT_ADDRESS=${wayAIStaking.address}

# Contract ABIs (for frontend integration)
# NFT Contract ABI: ${wayAINFT.interface.format('json')}
# Token Contract ABI: ${wayAIToken.interface.format('json')}
# Staking Contract ABI: ${wayAIStaking.interface.format('json')}
`;

  if (envContent.includes("VITE_NFT_CONTRACT_ADDRESS")) {
    // Update existing addresses
    envContent = envContent.replace(
      /VITE_NFT_CONTRACT_ADDRESS=.*/,
      `VITE_NFT_CONTRACT_ADDRESS=${wayAINFT.address}`
    );
    envContent = envContent.replace(
      /VITE_TOKEN_CONTRACT_ADDRESS=.*/,
      `VITE_TOKEN_CONTRACT_ADDRESS=${wayAIToken.address}`
    );
    envContent = envContent.replace(
      /VITE_STAKING_CONTRACT_ADDRESS=.*/,
      `VITE_STAKING_CONTRACT_ADDRESS=${wayAIStaking.address}`
    );
  } else {
    // Add new addresses
    envContent += deploymentInfo;
  }

  try {
    const fs = require("fs");
    fs.writeFileSync(envPath, envContent);
    console.log("✅ Updated .env file with contract addresses");
  } catch (error) {
    console.log("⚠️ Could not update .env file:", error.message);
    console.log("📋 Please manually add these addresses to your .env file:");
    console.log(deploymentInfo);
  }

  // Verify contracts on Etherscan (if API key is provided)
  if (process.env.ETHERSCAN_API_KEY) {
    console.log("\n🔍 Verifying contracts on Etherscan...");

    try {
      await hre.run("verify:verify", {
        address: wayAINFT.address,
        constructorArguments: [NAME, SYMBOL, BASE_URI, CONTRACT_URI],
      });
      console.log("✅ NFT Contract verified on Etherscan");
    } catch (error) {
      console.log("⚠️ NFT Contract verification failed:", error.message);
    }

    try {
      await hre.run("verify:verify", {
        address: wayAIToken.address,
        constructorArguments: [TOKEN_NAME, TOKEN_SYMBOL, deployer.address, deployer.address, deployer.address],
      });
      console.log("✅ Token Contract verified on Etherscan");
    } catch (error) {
      console.log("⚠️ Token Contract verification failed:", error.message);
    }

    try {
      await hre.run("verify:verify", {
        address: wayAIStaking.address,
        constructorArguments: [wayAIToken.address, wayAINFT.address],
      });
      console.log("✅ Staking Contract verified on Etherscan");
    } catch (error) {
      console.log("⚠️ Staking Contract verification failed:", error.message);
    }
  }

  // Display deployment summary
  console.log("\n🎉 Deployment Summary");
  console.log("====================");
  console.log(`📱 Frontend Application: Deploy to Vercel/Netlify`);
  console.log(`⛓️ NFT Contract: ${wayAINFT.address}`);
  console.log(`🪙 Token Contract: ${wayAIToken.address}`);
  console.log(`🏦 Staking Contract: ${wayAIStaking.address}`);
  console.log(`🌐 Network: ${networkName}`);
  console.log(`💰 Deployer: ${deployer.address}`);

  console.log("\n📋 Next Steps:");
  console.log("1. Update your .env file with the contract addresses above");
  console.log("2. Deploy your frontend to Vercel/Netlify");
  console.log("3. Test the contract interactions");
  console.log("4. Set up automated faucets for testnet users");

  console.log("\n🚀 WayAI platform is ready for blockchain deployment!");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });