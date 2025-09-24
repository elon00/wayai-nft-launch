const { ethers } = require("hardhat");

async function main() {
  console.log("🧪 Testing WayAI Contract Interactions...\n");

  // Get the deployer account
  const [deployer, user1, user2] = await ethers.getSigners();
  console.log("Testing with accounts:");
  console.log("Deployer:", deployer.address);
  console.log("User1:", user1.address);
  console.log("User2:", user2.address, "\n");

  // Contract addresses from deployment
  const tokenAddress = "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853";
  const nftAddress = "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6";
  const stakingAddress = "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318";

  // Get contract instances
  const WayAIToken = await ethers.getContractFactory("WayAIToken");
  const WayAINFT = await ethers.getContractFactory("WayAINFT");
  const WayAIStaking = await ethers.getContractFactory("WayAIStaking");

  const tokenContract = WayAIToken.attach(tokenAddress);
  const nftContract = WayAINFT.attach(nftAddress);
  const stakingContract = WayAIStaking.attach(stakingAddress);

  console.log("📋 Test 1: Check Contract Information");
  console.log("Token Name:", await tokenContract.name());
  console.log("Token Symbol:", await tokenContract.symbol());
  console.log("NFT Name:", await nftContract.name());
  console.log("NFT Symbol:", await nftContract.symbol());
  console.log("Total Supply:", ethers.utils.formatEther(await tokenContract.totalSupply()), "\n");

  console.log("📋 Test 2: Mint Tokens to Users");
  const mintAmount = ethers.utils.parseEther("1000");

  // Mint tokens to users
  await tokenContract.mint(user1.address, mintAmount);
  await tokenContract.mint(user2.address, mintAmount);

  console.log("✅ Minted 1000 tokens to User1");
  console.log("✅ Minted 1000 tokens to User2");
  console.log("User1 Balance:", ethers.utils.formatEther(await tokenContract.balanceOf(user1.address)));
  console.log("User2 Balance:", ethers.utils.formatEther(await tokenContract.balanceOf(user2.address)), "\n");

  console.log("📋 Test 3: Approve Staking Contract");
  // Users approve staking contract to spend their tokens
  await tokenContract.connect(user1).approve(stakingAddress, mintAmount);
  await tokenContract.connect(user2).approve(stakingAddress, mintAmount);
  console.log("✅ User1 approved staking contract");
  console.log("✅ User2 approved staking contract\n");

  console.log("📋 Test 4: Stake Tokens");
  const stakeAmount = ethers.utils.parseEther("500");

  // Users stake tokens
  await stakingContract.connect(user1).stake(stakeAmount);
  await stakingContract.connect(user2).stake(stakeAmount);

  console.log("✅ User1 staked 500 tokens");
  console.log("✅ User2 staked 500 tokens");
  console.log("User1 Staking Info:", await stakingContract.getStakingInfo(user1.address));
  console.log("User2 Staking Info:", await stakingContract.getStakingInfo(user2.address), "\n");

  console.log("📋 Test 5: Mint NFTs");
  // Mint NFTs to users
  await nftContract.mintWithAI(user1.address, "https://api.wayai.app/metadata/1", 0); // SciFi category
  await nftContract.mintWithAI(user2.address, "https://api.wayai.app/metadata/2", 1); // Cyberpunk category

  console.log("✅ Minted NFT #1 to User1 (SciFi)");
  console.log("✅ Minted NFT #2 to User2 (Cyberpunk)");
  console.log("User1 NFT Balance:", await nftContract.balanceOf(user1.address));
  console.log("User2 NFT Balance:", await nftContract.balanceOf(user2.address), "\n");

  console.log("📋 Test 6: Check Rewards");
  // Wait a bit for rewards to accumulate (simulate time passing)
  await new Promise(resolve => setTimeout(resolve, 2000));

  const user1Rewards = await stakingContract.calculateRewards(user1.address);
  const user2Rewards = await stakingContract.calculateRewards(user2.address);

  console.log("✅ User1 Rewards:", ethers.utils.formatEther(user1Rewards));
  console.log("✅ User2 Rewards:", ethers.utils.formatEther(user2Rewards), "\n");

  console.log("📋 Test 7: Claim Rewards");
  if (user1Rewards.gt(0)) {
    await stakingContract.connect(user1).claimRewards();
    console.log("✅ User1 claimed rewards");
  }

  if (user2Rewards.gt(0)) {
    await stakingContract.connect(user2).claimRewards();
    console.log("✅ User2 claimed rewards");
  }

  console.log("🎉 All contract interactions completed successfully!");
  console.log("\n📊 Final State:");
  console.log("Total Staked:", ethers.utils.formatEther(await stakingContract.totalStaked()));
  console.log("Total Rewards Distributed:", ethers.utils.formatEther(await stakingContract.totalRewardsDistributed()));
  console.log("User1 Token Balance:", ethers.utils.formatEther(await tokenContract.balanceOf(user1.address)));
  console.log("User2 Token Balance:", ethers.utils.formatEther(await tokenContract.balanceOf(user2.address)));
  console.log("User1 NFT Balance:", await nftContract.balanceOf(user1.address));
  console.log("User2 NFT Balance:", await nftContract.balanceOf(user2.address));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Test failed:", error);
    process.exit(1);
  });