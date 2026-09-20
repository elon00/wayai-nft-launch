const assert = require("node:assert/strict");
const { ethers } = require("hardhat");

describe("WayAI contracts", function () {
  async function deployFixture() {
    const [owner, user] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("WayAIToken");
    const token = await Token.deploy(
      "WayAI Token",
      "WAYAI",
      owner.address,
      owner.address,
      owner.address
    );
    await token.waitForDeployment();

    const NFT = await ethers.getContractFactory("WayAINFT");
    const nft = await NFT.deploy(
      "WayAI NFT",
      "WNFT",
      "ipfs://base/",
      "ipfs://contract"
    );
    await nft.waitForDeployment();

    const Staking = await ethers.getContractFactory("WayAIStaking");
    const staking = await Staking.deploy(
      await token.getAddress(),
      await nft.getAddress()
    );
    await staking.waitForDeployment();

    return { owner, user, token, nft, staking };
  }

  it("deploys the token with the configured initial supply", async function () {
    const { owner, token } = await deployFixture();
    const initialSupply = await token.INITIAL_SUPPLY();
    assert.equal(await token.totalSupply(), initialSupply);
    assert.equal(await token.balanceOf(owner.address), initialSupply);
  });

  it("enforces the token minter role", async function () {
    const { owner, user, token } = await deployFixture();
    const amount = ethers.parseEther("10");

    await assert.rejects(
      token.connect(user).mint(user.address, amount),
      /AccessControl/
    );

    await token.mint(user.address, amount);
    assert.equal(await token.balanceOf(user.address), amount);
    assert.equal(await token.hasRole(await token.MINTER_ROLE(), owner.address), true);
  });

  it("mints NFTs only through an authorized minter", async function () {
    const { owner, user, nft } = await deployFixture();

    await nft.mintWithAI(user.address, "ipfs://metadata/1", 0);
    assert.equal(await nft.balanceOf(user.address), 1n);
    assert.equal(await nft.ownerOf(0), user.address);
    assert.equal(await nft.tokenURI(0), "ipfs://metadata/1");

    await assert.rejects(
      nft.connect(user).mintWithAI(user.address, "ipfs://metadata/2", 1),
      /Not authorized to mint/
    );

    assert.equal(await nft.authorizedMinters(owner.address), true);
  });

  it("stakes tokens, calculates rewards after time advances, and prevents premature unstaking", async function () {
    const { owner, user, token, staking } = await deployFixture();
    const amount = ethers.parseEther("100");

    await token.mint(user.address, amount);
    await token.connect(user).approve(await staking.getAddress(), amount);
    await staking.connect(user).stake(amount);

    assert.equal(await staking.totalStaked(), amount);

    await assert.rejects(
      staking.connect(user).unstake(),
      /Lock period not ended/
    );

    await ethers.provider.send("evm_increaseTime", [30 * 24 * 60 * 60]);
    await ethers.provider.send("evm_mine", []);

    const rewards = await staking.calculateRewards(user.address);
    assert.ok(rewards > 0n);

    await staking.connect(user).unstake();
    assert.equal(await staking.totalStaked(), 0n);
    assert.equal(await staking.stakes(user.address).then((s) => s.isActive), false);

    assert.equal(await token.balanceOf(owner.address) > 0n, true);
  });

  it("does not allow arbitrary callers to repeatedly boost another user's rewards", async function () {
    const { owner, user, token, nft, staking } = await deployFixture();
    const amount = ethers.parseEther("100");

    await token.mint(user.address, amount);
    await token.connect(user).approve(await staking.getAddress(), amount);
    await staking.connect(user).stake(amount);
    await nft.mintWithAI(user.address, "ipfs://metadata/1", 0);

    await assert.rejects(
      staking.connect(user).addNFTBoost(user.address, 0),
      /Ownable/
    );

    await staking.addNFTBoost(user.address, 0);
    const stake = await staking.stakes(user.address);
    assert.equal(stake.rewardRate, 700n);
    assert.equal(owner.address !== ethers.ZeroAddress, true);
  });
});
