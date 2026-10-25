// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title AssetNFT
 * @notice ERC-721 digital asset ownership. Each NFT is an organizational
 *         record of an asset (laptop, license, certificate, etc.).
 * @dev    The NFT represents the organization's digital record of the asset,
 *         NOT proof of physical possession. External mechanisms (QR, RFID,
 *         serial numbers) are needed for physical verification.
 */
contract AssetNFT is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable, ReentrancyGuard {
    // ──────────────────────────────────────────────
    // Types
    // ──────────────────────────────────────────────

    struct AssetDetails {
        uint256 tokenId;
        string assetName;
        string assetType;       // e.g. "Laptop", "Software License", "Certificate"
        string description;
        string serialNumber;    // reference ID or serial
        address createdBy;
        uint256 createdAt;
        bool active;
    }

    // ──────────────────────────────────────────────
    // State
    // ──────────────────────────────────────────────

    uint256 private _nextTokenId = 1;

    /// tokenId → asset details
    mapping(uint256 => AssetDetails) private _assets;

    /// authorized minters / managers
    mapping(address => bool) public authorizedMinters;

    uint256 public totalAssets;
    uint256 public activeAssets;

    // ──────────────────────────────────────────────
    // Events
    // ──────────────────────────────────────────────

    event AssetMinted(
        uint256 indexed tokenId,
        address indexed owner,
        string assetName,
        string assetType,
        address indexed creator,
        uint256 timestamp
    );

    event AssetAssigned(
        uint256 indexed tokenId,
        address indexed from,
        address indexed to,
        uint256 timestamp
    );

    event AssetTransferred(
        uint256 indexed tokenId,
        address indexed from,
        address indexed to,
        uint256 timestamp
    );

    event AssetDeactivated(
        uint256 indexed tokenId,
        address indexed actor,
        uint256 timestamp
    );

    // ──────────────────────────────────────────────
    // Modifiers
    // ──────────────────────────────────────────────

    modifier onlyAuthorizedMinter() {
        require(
            msg.sender == owner() || authorizedMinters[msg.sender],
            "AssetNFT: caller not authorized to mint"
        );
        _;
    }

    // ──────────────────────────────────────────────
    // Constructor
    // ──────────────────────────────────────────────

    constructor() ERC721("ChainVault Asset", "CVA") Ownable(msg.sender) {}

    // ──────────────────────────────────────────────
    // Admin
    // ──────────────────────────────────────────────

    function setAuthorizedMinter(address minter, bool status) external onlyOwner {
        require(minter != address(0), "AssetNFT: zero address");
        authorizedMinters[minter] = status;
    }

    // ──────────────────────────────────────────────
    // Minting
    // ──────────────────────────────────────────────

    /**
     * @notice Mint a new digital asset NFT.
     * @param to           Initial owner.
     * @param assetName    Human-readable asset name.
     * @param assetType    Category string.
     * @param description  Asset description.
     * @param serialNumber Organizational serial / reference.
     * @param metadataURI  Off-chain metadata URI.
     */
    function mintAsset(
        address to,
        string calldata assetName,
        string calldata assetType,
        string calldata description,
        string calldata serialNumber,
        string calldata metadataURI
    ) external onlyAuthorizedMinter nonReentrant returns (uint256) {
        require(to != address(0), "AssetNFT: mint to zero address");
        require(bytes(assetName).length > 0, "AssetNFT: empty name");

        uint256 tokenId = _nextTokenId++;

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, metadataURI);

        _assets[tokenId] = AssetDetails({
            tokenId: tokenId,
            assetName: assetName,
            assetType: assetType,
            description: description,
            serialNumber: serialNumber,
            createdBy: msg.sender,
            createdAt: block.timestamp,
            active: true
        });

        totalAssets++;
        activeAssets++;

        emit AssetMinted(tokenId, to, assetName, assetType, msg.sender, block.timestamp);

        return tokenId;
    }

    // ──────────────────────────────────────────────
    // Assignment & Transfer
    // ──────────────────────────────────────────────

    /**
     * @notice Assign (transfer) an asset from current owner to another address.
     *         Can be called by owner of the token or an authorized minter (admin).
     */
    function assignAsset(uint256 tokenId, address to) external nonReentrant {
        require(to != address(0), "AssetNFT: assign to zero address");
        address currentOwner = ownerOf(tokenId);
        require(
            msg.sender == currentOwner || msg.sender == owner() || authorizedMinters[msg.sender],
            "AssetNFT: caller not authorized"
        );
        require(_assets[tokenId].active, "AssetNFT: asset inactive");

        _transfer(currentOwner, to, tokenId);

        emit AssetAssigned(tokenId, currentOwner, to, block.timestamp);
    }

    /**
     * @notice Transfer an asset between two parties. Caller must be the
     *         current owner or an approved operator.
     */
    function transferAsset(uint256 tokenId, address to) external nonReentrant {
        require(to != address(0), "AssetNFT: transfer to zero address");
        address currentOwner = ownerOf(tokenId);
        require(
            msg.sender == currentOwner ||
            getApproved(tokenId) == msg.sender ||
            isApprovedForAll(currentOwner, msg.sender) ||
            msg.sender == owner() ||
            authorizedMinters[msg.sender],
            "AssetNFT: caller not authorized to transfer"
        );
        require(_assets[tokenId].active, "AssetNFT: asset inactive");

        _transfer(currentOwner, to, tokenId);

        emit AssetTransferred(tokenId, currentOwner, to, block.timestamp);
    }

    // ──────────────────────────────────────────────
    // Deactivate
    // ──────────────────────────────────────────────

    function deactivateAsset(uint256 tokenId) external {
        require(
            msg.sender == owner() || authorizedMinters[msg.sender],
            "AssetNFT: not authorized"
        );
        require(_assets[tokenId].active, "AssetNFT: already inactive");

        _assets[tokenId].active = false;
        activeAssets--;

        emit AssetDeactivated(tokenId, msg.sender, block.timestamp);
    }

    // ──────────────────────────────────────────────
    // View helpers
    // ──────────────────────────────────────────────

    function getAssetDetails(uint256 tokenId) external view returns (AssetDetails memory) {
        require(tokenId > 0 && tokenId < _nextTokenId, "AssetNFT: invalid token");
        return _assets[tokenId];
    }

    function getAssetOwner(uint256 tokenId) external view returns (address) {
        return ownerOf(tokenId);
    }

    function verifyAsset(uint256 tokenId) external view returns (
        bool exists,
        address currentOwner,
        string memory assetName,
        string memory assetType,
        uint256 createdAt,
        bool active
    ) {
        if (tokenId == 0 || tokenId >= _nextTokenId) {
            return (false, address(0), "", "", 0, false);
        }
        AssetDetails memory a = _assets[tokenId];
        return (true, ownerOf(tokenId), a.assetName, a.assetType, a.createdAt, a.active);
    }

    function getNextTokenId() external view returns (uint256) {
        return _nextTokenId;
    }

    // ──────────────────────────────────────────────
    // Overrides required by Solidity
    // ──────────────────────────────────────────────

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
