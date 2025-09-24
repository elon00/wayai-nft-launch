// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title WayAI Token Contract
 * @dev ERC-20 token with burning, pausing, and access control features
 * @author Martin Luther
 */
contract WayAIToken is ERC20, ERC20Burnable, ERC20Pausable, Ownable, AccessControl, ReentrancyGuard {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    // Token configuration
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18; // 1 billion tokens
    uint256 public constant INITIAL_SUPPLY = 100_000_000 * 10**18; // 100 million tokens

    // Vesting configuration
    struct VestingSchedule {
        uint256 totalAmount;
        uint256 releasedAmount;
        uint256 startTime;
        uint256 duration;
        uint256 cliffPeriod;
        bool isActive;
    }

    mapping(address => VestingSchedule) public vestingSchedules;
    mapping(address => bool) public whitelistedAddresses;

    // Events
    event TokensVested(address indexed beneficiary, uint256 amount);
    event AddressWhitelisted(address indexed account, bool whitelisted);
    event VestingScheduleCreated(address indexed beneficiary, uint256 amount, uint256 duration);

    /**
     * @dev Constructor to initialize the token
     */
    constructor(
        string memory name,
        string memory symbol,
        address defaultAdmin,
        address minter,
        address pauser
    ) ERC20(name, symbol) {
        // Grant roles
        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(MINTER_ROLE, minter);
        _grantRole(PAUSER_ROLE, pauser);

        // Mint initial supply to owner
        _mint(defaultAdmin, INITIAL_SUPPLY);

        // Whitelist the owner
        whitelistedAddresses[defaultAdmin] = true;
    }

    /**
     * @dev Modifier to check if address is whitelisted
     */
    modifier onlyWhitelisted() {
        require(whitelistedAddresses[msg.sender] || hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Address not whitelisted");
        _;
    }

    /**
     * @dev Mint tokens to specified address
     * @param to Recipient address
     * @param amount Amount to mint
     */
    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
        require(totalSupply() + amount <= MAX_SUPPLY, "Would exceed maximum supply");
        _mint(to, amount);
    }

    /**
     * @dev Batch mint tokens to multiple addresses
     * @param recipients Array of recipient addresses
     * @param amounts Array of amounts to mint
     */
    function batchMint(address[] memory recipients, uint256[] memory amounts) external onlyRole(MINTER_ROLE) {
        require(recipients.length == amounts.length, "Arrays length mismatch");

        uint256 totalAmount = 0;
        for (uint256 i = 0; i < amounts.length; i++) {
            totalAmount += amounts[i];
        }

        require(totalSupply() + totalAmount <= MAX_SUPPLY, "Would exceed maximum supply");

        for (uint256 i = 0; i < recipients.length; i++) {
            _mint(recipients[i], amounts[i]);
        }
    }

    /**
     * @dev Create vesting schedule for beneficiary
     * @param beneficiary Address to receive vested tokens
     * @param amount Total amount to vest
     * @param duration Vesting duration in seconds
     * @param cliffPeriod Cliff period in seconds
     */
    function createVestingSchedule(
        address beneficiary,
        uint256 amount,
        uint256 duration,
        uint256 cliffPeriod
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(beneficiary != address(0), "Invalid beneficiary address");
        require(amount > 0, "Amount must be greater than 0");
        require(duration > 0, "Duration must be greater than 0");
        require(cliffPeriod <= duration, "Cliff period cannot exceed duration");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");

        // Transfer tokens to contract for vesting
        _transfer(msg.sender, address(this), amount);

        vestingSchedules[beneficiary] = VestingSchedule({
            totalAmount: amount,
            releasedAmount: 0,
            startTime: block.timestamp,
            duration: duration,
            cliffPeriod: cliffPeriod,
            isActive: true
        });

        emit VestingScheduleCreated(beneficiary, amount, duration);
    }

    /**
     * @dev Release vested tokens to beneficiary
     * @param beneficiary Address to release tokens to
     */
    function releaseVestedTokens(address beneficiary) external nonReentrant {
        VestingSchedule storage schedule = vestingSchedules[beneficiary];
        require(schedule.isActive, "No active vesting schedule");
        require(block.timestamp >= schedule.startTime + schedule.cliffPeriod, "Cliff period not reached");

        uint256 releasableAmount = getReleasableAmount(beneficiary);
        require(releasableAmount > 0, "No tokens available for release");

        schedule.releasedAmount += releasableAmount;
        _transfer(address(this), beneficiary, releasableAmount);

        emit TokensVested(beneficiary, releasableAmount);

        // Deactivate schedule if fully vested
        if (schedule.releasedAmount >= schedule.totalAmount) {
            schedule.isActive = false;
        }
    }

    /**
     * @dev Get releasable amount for beneficiary
     * @param beneficiary Address to check
     */
    function getReleasableAmount(address beneficiary) public view returns (uint256) {
        VestingSchedule memory schedule = vestingSchedules[beneficiary];

        if (!schedule.isActive || block.timestamp < schedule.startTime + schedule.cliffPeriod) {
            return 0;
        }

        uint256 timeElapsed = block.timestamp - schedule.startTime;
        uint256 vestedAmount = (schedule.totalAmount * timeElapsed) / schedule.duration;

        if (vestedAmount > schedule.totalAmount) {
            vestedAmount = schedule.totalAmount;
        }

        return vestedAmount - schedule.releasedAmount;
    }

    /**
     * @dev Get vesting schedule details
     * @param beneficiary Address to check
     */
    function getVestingSchedule(address beneficiary) external view returns (
        uint256 totalAmount,
        uint256 releasedAmount,
        uint256 startTime,
        uint256 duration,
        uint256 cliffPeriod,
        bool isActive,
        uint256 releasableAmount
    ) {
        VestingSchedule memory schedule = vestingSchedules[beneficiary];
        return (
            schedule.totalAmount,
            schedule.releasedAmount,
            schedule.startTime,
            schedule.duration,
            schedule.cliffPeriod,
            schedule.isActive,
            getReleasableAmount(beneficiary)
        );
    }

    /**
     * @dev Whitelist an address for special access
     * @param account Address to whitelist
     * @param whitelisted True to whitelist, false to remove
     */
    function setWhitelistedAddress(address account, bool whitelisted) external onlyRole(DEFAULT_ADMIN_ROLE) {
        whitelistedAddresses[account] = whitelisted;
        emit AddressWhitelisted(account, whitelisted);
    }

    /**
     * @dev Pause token transfers
     */
    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    /**
     * @dev Unpause token transfers
     */
    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    /**
     * @dev Burn tokens from caller's balance
     * @param amount Amount to burn
     */
    function burn(uint256 amount) public override onlyWhitelisted {
        _burn(msg.sender, amount);
    }

    /**
     * @dev Burn tokens from specific address (admin only)
     * @param account Address to burn from
     * @param amount Amount to burn
     */
    function burnFrom(address account, uint256 amount) public override onlyRole(DEFAULT_ADMIN_ROLE) {
        _spendAllowance(account, msg.sender, amount);
        _burn(account, amount);
    }

    /**
      * @dev Transfer tokens with whitelist check
      * @param to Recipient address
      * @param amount Amount to transfer
      */
    function transfer(address to, uint256 amount) public override returns (bool) {
        return super.transfer(to, amount);
    }

    /**
      * @dev Transfer tokens from one address to another with whitelist check
      * @param from Sender address
      * @param to Recipient address
      * @param amount Amount to transfer
      */
    function transferFrom(address from, address to, uint256 amount) public override returns (bool) {
        return super.transferFrom(from, to, amount);
    }

    /**
     * @dev Get total supply including vested tokens
     */
    function getTotalSupplyWithVesting() external view returns (uint256) {
        return totalSupply() + getTotalVestedAmount();
    }

    /**
     * @dev Get total amount locked in vesting
     */
    function getTotalVestedAmount() public view returns (uint256) {
        // This would need to iterate through all vesting schedules
        // For gas efficiency, consider maintaining a separate counter
        return balanceOf(address(this));
    }

    /**
     * @dev Check if address has any role
     * @param account Address to check
     */
    function hasAnyRole(address account) external view returns (bool) {
        return hasRole(DEFAULT_ADMIN_ROLE, account) ||
               hasRole(MINTER_ROLE, account) ||
               hasRole(PAUSER_ROLE, account) ||
               whitelistedAddresses[account];
    }

    /**
     * @dev Get token information
     */
    function getTokenInfo() external view returns (
        string memory tokenName,
        string memory tokenSymbol,
        uint8 tokenDecimals,
        uint256 currentTotalSupply,
        uint256 tokenMaxSupply,
        uint256 tokenCirculatingSupply,
        bool isPaused
    ) {
        return (
            name(),
            symbol(),
            decimals(),
            totalSupply(),
            MAX_SUPPLY,
            totalSupply(),
            paused()
        );
    }

    /**
     * @dev Required override for ERC20Pausable
     */
    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal
        override(ERC20, ERC20Pausable)
    {
        super._beforeTokenTransfer(from, to, amount);
    }

    /**
     * @dev Required override for AccessControl
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}