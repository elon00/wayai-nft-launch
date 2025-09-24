// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title WayAI NFT Contract
 * @dev ERC-721 NFT contract for AI-generated artworks with royalty support
 * @author Martin Luther
 */
contract WayAINFT is ERC721, ERC721URIStorage, ERC721Royalty, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    using Strings for uint256;

    Counters.Counter private _tokenIdCounter;

    // Contract metadata
    string private _baseTokenURI;
    string public contractURI;

    // NFT Configuration
    uint256 public maxSupply = 10000;
    uint256 public mintPrice = 0.01 ether;
    uint256 public maxMintPerTransaction = 5;
    uint96 public royaltyFee = 500; // 5% royalty

    // AI Agent addresses that can mint
    mapping(address => bool) public authorizedMinters;

    // NFT Categories for organization
    enum Category { SciFi, Cyberpunk, Minimalist, Abstract, Realistic }
    mapping(uint256 => Category) public nftCategories;

    // Events
    event NFTMinted(address indexed to, uint256 indexed tokenId, string tokenURI, Category category);
    event MinterAuthorized(address indexed minter, bool authorized);
    event BaseURIUpdated(string oldURI, string newURI);
    event RoyaltyUpdated(uint96 oldFee, uint96 newFee);

    /**
     * @dev Constructor to initialize the contract
     */
    constructor(
        string memory name,
        string memory symbol,
        string memory baseTokenURI,
        string memory _contractURI
    ) ERC721(name, symbol) {
        _baseTokenURI = baseTokenURI;
        contractURI = _contractURI;

        // Set royalty receiver to contract owner
        _setDefaultRoyalty(msg.sender, royaltyFee);

        // Authorize contract owner as minter
        authorizedMinters[msg.sender] = true;
    }

    /**
     * @dev Modifier to check if caller is authorized to mint
     */
    modifier onlyAuthorizedMinter() {
        require(authorizedMinters[msg.sender] || msg.sender == owner(), "Not authorized to mint");
        _;
    }

    /**
     * @dev Mint NFT with AI-generated metadata
     * @param to Recipient address
     * @param tokenURI Metadata URI
     * @param category NFT category
     */
    function mintWithAI(
        address to,
        string memory tokenURI,
        Category category
    ) external onlyAuthorizedMinter returns (uint256) {
        require(_tokenIdCounter.current() < maxSupply, "Max supply reached");

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        nftCategories[tokenId] = category;

        emit NFTMinted(to, tokenId, tokenURI, category);
        return tokenId;
    }

    /**
     * @dev Batch mint NFTs
     * @param to Recipient address
     * @param tokenURIs Array of metadata URIs
     * @param categories Array of categories
     */
    function batchMintWithAI(
        address to,
        string[] memory tokenURIs,
        Category[] memory categories
    ) external onlyAuthorizedMinter returns (uint256[] memory) {
        require(tokenURIs.length == categories.length, "Arrays length mismatch");
        require(tokenURIs.length <= maxMintPerTransaction, "Exceeds max mint per transaction");
        require(_tokenIdCounter.current() + tokenURIs.length <= maxSupply, "Would exceed max supply");

        uint256[] memory tokenIds = new uint256[](tokenURIs.length);

        for (uint256 i = 0; i < tokenURIs.length; i++) {
            uint256 tokenId = _tokenIdCounter.current();
            _tokenIdCounter.increment();

            _safeMint(to, tokenId);
            _setTokenURI(tokenId, tokenURIs[i]);
            nftCategories[tokenId] = categories[i];

            tokenIds[i] = tokenId;
            emit NFTMinted(to, tokenId, tokenURIs[i], categories[i]);
        }

        return tokenIds;
    }

    /**
     * @dev Public mint function (for users to mint)
     * @param to Recipient address
     * @param category Desired category
     */
    function publicMint(address to, Category category) external payable nonReentrant {
        require(msg.value >= mintPrice, "Insufficient payment");
        require(_tokenIdCounter.current() < maxSupply, "Max supply reached");

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        _safeMint(to, tokenId);

        // Generate token URI based on category
        string memory tokenURI = string(abi.encodePacked(_baseTokenURI, tokenId.toString()));
        _setTokenURI(tokenId, tokenURI);
        nftCategories[tokenId] = category;

        emit NFTMinted(to, tokenId, tokenURI, category);
    }

    /**
     * @dev Authorize or deauthorize a minter
     * @param minter Address to authorize/deauthorize
     * @param authorized True to authorize, false to deauthorize
     */
    function setAuthorizedMinter(address minter, bool authorized) external onlyOwner {
        authorizedMinters[minter] = authorized;
        emit MinterAuthorized(minter, authorized);
    }

    /**
     * @dev Update base token URI
     * @param newBaseURI New base URI
     */
    function setBaseURI(string memory newBaseURI) external onlyOwner {
        string memory oldURI = _baseTokenURI;
        _baseTokenURI = newBaseURI;
        emit BaseURIUpdated(oldURI, newBaseURI);
    }

    /**
     * @dev Update royalty fee
     * @param newRoyaltyFee New royalty fee (in basis points, 500 = 5%)
     */
    function setRoyaltyFee(uint96 newRoyaltyFee) external onlyOwner {
        require(newRoyaltyFee <= 1000, "Royalty fee cannot exceed 10%");
        uint96 oldFee = royaltyFee;
        royaltyFee = newRoyaltyFee;
        _setDefaultRoyalty(owner(), newRoyaltyFee);
        emit RoyaltyUpdated(oldFee, newRoyaltyFee);
    }

    /**
     * @dev Update max supply
     * @param newMaxSupply New maximum supply
     */
    function setMaxSupply(uint256 newMaxSupply) external onlyOwner {
        require(newMaxSupply >= _tokenIdCounter.current(), "Cannot set below current supply");
        maxSupply = newMaxSupply;
    }

    /**
     * @dev Update mint price
     * @param newMintPrice New mint price in wei
     */
    function setMintPrice(uint256 newMintPrice) external onlyOwner {
        mintPrice = newMintPrice;
    }

    /**
     * @dev Update max mint per transaction
     * @param newMaxMint New maximum mint per transaction
     */
    function setMaxMintPerTransaction(uint256 newMaxMint) external onlyOwner {
        maxMintPerTransaction = newMaxMint;
    }

    /**
     * @dev Get NFT category
     * @param tokenId Token ID
     */
    function getCategory(uint256 tokenId) external view returns (Category) {
        require(_exists(tokenId), "Token does not exist");
        return nftCategories[tokenId];
    }

    /**
     * @dev Get tokens by category
     * @param category Category to filter by
     * @param owner Owner address (address(0) for all)
     */
    function getTokensByCategory(Category category, address owner) external view returns (uint256[] memory) {
        uint256 totalSupply = _tokenIdCounter.current();
        uint256[] memory tempTokens = new uint256[](totalSupply);
        uint256 count = 0;

        for (uint256 i = 1; i <= totalSupply; i++) {
            if (nftCategories[i] == category) {
                if (owner == address(0) || ownerOf(i) == owner) {
                    tempTokens[count] = i;
                    count++;
                }
            }
        }

        // Resize array to actual count
        uint256[] memory tokens = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            tokens[i] = tempTokens[i];
        }

        return tokens;
    }

    /**
     * @dev Get total supply by category
     * @param category Category to count
     */
    function getTotalSupplyByCategory(Category category) external view returns (uint256) {
        uint256 totalSupply = _tokenIdCounter.current();
        uint256 count = 0;

        for (uint256 i = 1; i <= totalSupply; i++) {
            if (nftCategories[i] == category) {
                count++;
            }
        }

        return count;
    }

    /**
     * @dev Withdraw contract balance
     */
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");

        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }

    /**
     * @dev Get token URI
     * @param tokenId Token ID
     */
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    /**
     * @dev Get base token URI
     */
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    /**
     * @dev Check if token exists
     * @param tokenId Token ID
     */
    function exists(uint256 tokenId) external view returns (bool) {
        return _exists(tokenId);
    }

    /**
     * @dev Get total minted tokens
     */
    function totalSupply() external view returns (uint256) {
        return _tokenIdCounter.current();
    }

    /**
     * @dev Get remaining supply
     */
    function remainingSupply() external view returns (uint256) {
        return maxSupply - _tokenIdCounter.current();
    }

    /**
     * @dev Burn token
     * @param tokenId Token ID to burn
     */
    function burn(uint256 tokenId) external {
        require(_isApprovedOrOwner(msg.sender, tokenId), "Not approved or owner");
        _burn(tokenId);
    }

    /**
     * @dev Required override for ERC721URIStorage
     */
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage, ERC721Royalty) {
        super._burn(tokenId);
    }

    /**
     * @dev Check if contract supports interface
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage, ERC721Royalty)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}