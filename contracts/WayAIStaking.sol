// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/**
 * @title WayAI Staking Contract
 * @dev Staking contract for WayAI tokens with multiple reward tiers
 * @author Martin Luther
 */
contract WayAIStaking is Ownable, ReentrancyGuard {
    using SafeMath for uint256;

    IERC20 public stakingToken;
    IERC721 public nftContract;

    // Staking configuration
    struct StakeInfo {
        uint256 amount;
        uint256 startTime;
        uint256 endTime;
        uint256 rewardRate;
        uint256 lastRewardUpdate;
        uint256 totalRewardsEarned;
        bool isActive;
        uint256 lockPeriod;
    }

    struct RewardTier {
        uint256 minAmount;
        uint256 maxAmount;
        uint256 rewardRate; // Annual percentage yield in basis points (e.g., 500 = 5%)
        uint256 lockPeriod; // Lock period in days
        bool isActive;
    }

    // State variables
    mapping(address => StakeInfo) public stakes;
    mapping(uint256 => RewardTier) public rewardTiers;
    mapping(address => uint256) public totalStakedByUser;
    mapping(address => uint256) public totalRewardsEarnedByUser;

    uint256 public totalStaked;
    uint256 public totalRewardsDistributed;
    uint256 public constant REWARD_PRECISION = 1e18;
    uint256 public constant BASIS_POINTS = 10000;

    // Events
    event Staked(address indexed user, uint256 amount, uint256 tier);
    event Unstaked(address indexed user, uint256 amount, uint256 rewards);
    event RewardsClaimed(address indexed user, uint256 amount);
    event RewardTierUpdated(uint256 tierId, uint256 rewardRate, uint256 lockPeriod);
    event EmergencyUnstaked(address indexed user, uint256 amount);

    /**
     * @dev Constructor to initialize the staking contract
     * @param _stakingToken Address of the token to stake
     * @param _nftContract Address of the NFT contract for tier benefits
     */
    constructor(address _stakingToken, address _nftContract) {
        stakingToken = IERC20(_stakingToken);
        nftContract = IERC721(_nftContract);

        // Initialize reward tiers
        _initializeRewardTiers();
    }

    /**
     * @dev Initialize default reward tiers
     */
    function _initializeRewardTiers() internal {
        // Tier 1: Basic staking (1-1000 tokens, 5% APY, 30 days lock)
        rewardTiers[1] = RewardTier({
            minAmount: 1 * 10**18,
            maxAmount: 1000 * 10**18,
            rewardRate: 500, // 5% APY
            lockPeriod: 30 days,
            isActive: true
        });

        // Tier 2: Silver staking (1001-10000 tokens, 8% APY, 60 days lock)
        rewardTiers[2] = RewardTier({
            minAmount: 1001 * 10**18,
            maxAmount: 10000 * 10**18,
            rewardRate: 800, // 8% APY
            lockPeriod: 60 days,
            isActive: true
        });

        // Tier 3: Gold staking (10001-100000 tokens, 12% APY, 90 days lock)
        rewardTiers[3] = RewardTier({
            minAmount: 10001 * 10**18,
            maxAmount: 100000 * 10**18,
            rewardRate: 1200, // 12% APY
            lockPeriod: 90 days,
            isActive: true
        });

        // Tier 4: Diamond staking (100001+ tokens, 20% APY, 180 days lock)
        rewardTiers[4] = RewardTier({
            minAmount: 100001 * 10**18,
            maxAmount: type(uint256).max,
            rewardRate: 2000, // 20% APY
            lockPeriod: 180 days,
            isActive: true
        });
    }

    /**
     * @dev Stake tokens for rewards
     * @param amount Amount to stake
     */
    function stake(uint256 amount) external nonReentrant {
        require(amount > 0, "Cannot stake 0 tokens");
        require(stakes[msg.sender].amount == 0, "Already staking, unstake first");

        // Determine reward tier
        uint256 tier = getTierForAmount(amount);
        require(rewardTiers[tier].isActive, "Tier not active");

        // Transfer tokens to contract
        require(stakingToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        // Calculate end time
        uint256 endTime = block.timestamp + rewardTiers[tier].lockPeriod;

        // Create stake info
        stakes[msg.sender] = StakeInfo({
            amount: amount,
            startTime: block.timestamp,
            endTime: endTime,
            rewardRate: rewardTiers[tier].rewardRate,
            lastRewardUpdate: block.timestamp,
            totalRewardsEarned: 0,
            isActive: true,
            lockPeriod: rewardTiers[tier].lockPeriod
        });

        totalStaked += amount;
        totalStakedByUser[msg.sender] += amount;

        emit Staked(msg.sender, amount, tier);
    }

    /**
     * @dev Unstake tokens and claim rewards
     */
    function unstake() external nonReentrant {
        StakeInfo storage stake = stakes[msg.sender];
        require(stake.isActive, "No active stake");
        require(block.timestamp >= stake.endTime, "Lock period not ended");

        uint256 rewards = calculateRewards(msg.sender);
        uint256 totalAmount = stake.amount + rewards;

        // Update state
        stake.isActive = false;
        totalStaked -= stake.amount;
        totalRewardsDistributed += rewards;
        totalRewardsEarnedByUser[msg.sender] += rewards;

        // Transfer tokens back
        require(stakingToken.transfer(msg.sender, totalAmount), "Transfer failed");

        emit Unstaked(msg.sender, stake.amount, rewards);
    }

    /**
     * @dev Claim rewards without unstaking
     */
    function claimRewards() external nonReentrant {
        StakeInfo storage stake = stakes[msg.sender];
        require(stake.isActive, "No active stake");

        uint256 rewards = calculateRewards(msg.sender);
        require(rewards > 0, "No rewards available");

        // Update state
        stake.lastRewardUpdate = block.timestamp;
        stake.totalRewardsEarned += rewards;
        totalRewardsDistributed += rewards;
        totalRewardsEarnedByUser[msg.sender] += rewards;

        // Transfer rewards
        require(stakingToken.transfer(msg.sender, rewards), "Transfer failed");

        emit RewardsClaimed(msg.sender, rewards);
    }

    /**
     * @dev Emergency unstake (penalty applies)
     */
    function emergencyUnstake() external nonReentrant {
        StakeInfo storage stake = stakes[msg.sender];
        require(stake.isActive, "No active stake");

        // 50% penalty for emergency unstake
        uint256 penaltyAmount = stake.amount / 2;
        uint256 returnAmount = stake.amount - penaltyAmount;

        // Update state
        stake.isActive = false;
        totalStaked -= stake.amount;

        // Transfer remaining tokens back (50% penalty)
        require(stakingToken.transfer(msg.sender, returnAmount), "Transfer failed");

        emit EmergencyUnstaked(msg.sender, returnAmount);
    }

    /**
     * @dev Calculate rewards for a user
     * @param user User address
     */
    function calculateRewards(address user) public view returns (uint256) {
        StakeInfo memory stake = stakes[user];
        if (!stake.isActive) return 0;

        uint256 timeElapsed = block.timestamp - stake.lastRewardUpdate;
        uint256 annualReward = (stake.amount * stake.rewardRate) / BASIS_POINTS;
        uint256 dailyReward = annualReward / 365;

        return (dailyReward * timeElapsed) / 1 days;
    }

    /**
     * @dev Get tier for staking amount
     * @param amount Amount to check
     */
    function getTierForAmount(uint256 amount) public view returns (uint256) {
        if (amount >= rewardTiers[4].minAmount) return 4;
        if (amount >= rewardTiers[3].minAmount) return 3;
        if (amount >= rewardTiers[2].minAmount) return 2;
        if (amount >= rewardTiers[1].minAmount) return 1;
        return 0; // No tier
    }

    /**
     * @dev Get staking information for user
     * @param user User address
     */
    function getStakingInfo(address user) external view returns (
        uint256 stakedAmount,
        uint256 rewardsEarned,
        uint256 lockEndTime,
        uint256 tier,
        bool canUnstake,
        bool canClaimRewards
    ) {
        StakeInfo memory stake = stakes[user];
        uint256 currentRewards = calculateRewards(user);

        return (
            stake.amount,
            stake.totalRewardsEarned + currentRewards,
            stake.endTime,
            getTierForAmount(stake.amount),
            block.timestamp >= stake.endTime,
            currentRewards > 0
        );
    }

    /**
     * @dev Update reward tier
     * @param tierId Tier ID to update
     * @param rewardRate New reward rate (basis points)
     * @param lockPeriod New lock period (days)
     */
    function updateRewardTier(uint256 tierId, uint256 rewardRate, uint256 lockPeriod) external onlyOwner {
        require(tierId >= 1 && tierId <= 4, "Invalid tier ID");
        require(rewardRate <= 5000, "Reward rate too high"); // Max 50%

        rewardTiers[tierId].rewardRate = rewardRate;
        rewardTiers[tierId].lockPeriod = lockPeriod * 1 days;

        emit RewardTierUpdated(tierId, rewardRate, lockPeriod);
    }

    /**
     * @dev Add NFT boost to staking rewards
     * @param user User address
     * @param tokenId NFT token ID
     */
    function addNFTBoost(address user, uint256 tokenId) external {
        require(nftContract.ownerOf(tokenId) == user, "User does not own NFT");
        require(stakes[user].isActive, "No active stake");

        // NFT boost logic - could increase reward rate by 10-50%
        // This is a simplified version
        StakeInfo storage stake = stakes[user];
        stake.rewardRate = stake.rewardRate + 200; // +2% boost
    }

    /**
     * @dev Get contract statistics
     */
    function getContractStats() external view returns (
        uint256 totalStakedAmount,
        uint256 totalRewardsDistributed,
        uint256 uniqueStakers,
        uint256 averageStakeAmount
    ) {
        return (
            totalStaked,
            totalRewardsDistributed,
            getUniqueStakersCount(),
            totalStaked / getUniqueStakersCount()
        );
    }

    /**
     * @dev Get unique stakers count (simplified)
     */
    function getUniqueStakersCount() internal view returns (uint256) {
        // In a real implementation, you'd track unique stakers
        // For now, return a placeholder
        return totalStaked / 1000 * 10**18; // Rough estimate
    }

    /**
     * @dev Get all reward tiers
     */
    function getAllTiers() external view returns (
        uint256[] memory minAmounts,
        uint256[] memory maxAmounts,
        uint256[] memory rewardRates,
        uint256[] memory lockPeriods,
        bool[] memory isActive
    ) {
        uint256[] memory mins = new uint256[](4);
        uint256[] memory maxs = new uint256[](4);
        uint256[] memory rates = new uint256[](4);
        uint256[] memory locks = new uint256[](4);
        bool[] memory active = new bool[](4);

        for (uint256 i = 1; i <= 4; i++) {
            mins[i-1] = rewardTiers[i].minAmount;
            maxs[i-1] = rewardTiers[i].maxAmount;
            rates[i-1] = rewardTiers[i].rewardRate;
            locks[i-1] = rewardTiers[i].lockPeriod / 1 days;
            active[i-1] = rewardTiers[i].isActive;
        }

        return (mins, maxs, rates, locks, active);
    }

    /**
     * @dev Emergency withdraw function (owner only)
     * @param token Address of token to withdraw
     * @param amount Amount to withdraw
     */
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        IERC20(token).transfer(owner(), amount);
    }

    /**
     * @dev Check if user can unstake
     * @param user User address
     */
    function canUnstake(address user) external view returns (bool) {
        StakeInfo memory stake = stakes[user];
        return stake.isActive && block.timestamp >= stake.endTime;
    }

    /**
     * @dev Get user's total staking information
     * @param user User address
     */
    function getUserStakingSummary(address user) external view returns (
        uint256 totalStaked,
        uint256 totalRewardsEarned,
        uint256 currentRewards,
        bool hasActiveStake,
        uint256 tier
    ) {
        StakeInfo memory stake = stakes[user];
        uint256 currentRewardsAmount = calculateRewards(user);

        return (
            stake.amount,
            stake.totalRewardsEarned + currentRewardsAmount,
            currentRewardsAmount,
            stake.isActive,
            getTierForAmount(stake.amount)
        );
    }
}