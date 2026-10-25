// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title Identity
 * @notice Manages decentralized identity registration and verification.
 * @dev Stores only cryptographic identity hashes on-chain. Sensitive personal
 *      information (name, email, employee ID) is kept off-chain. A wallet
 *      address is used as a practical identifier, NOT a fully W3C-compliant DID.
 */
contract Identity is Ownable, ReentrancyGuard {
    // ──────────────────────────────────────────────
    // Types
    // ──────────────────────────────────────────────

    struct IdentityRecord {
        uint256 identityId;
        address walletAddress;
        bytes32 identityHash;    // keccak256 of off-chain identity data
        uint256 createdAt;
        uint256 updatedAt;
        bool verified;
        bool active;
    }

    // ──────────────────────────────────────────────
    // State
    // ──────────────────────────────────────────────

    uint256 private _nextIdentityId = 1;

    /// wallet → identity record
    mapping(address => IdentityRecord) private _identities;

    /// identityId → wallet (reverse look-up)
    mapping(uint256 => address) private _idToWallet;

    /// quick existence check
    mapping(address => bool) public isRegistered;

    uint256 public totalIdentities;
    uint256 public verifiedCount;
    uint256 public activeCount;

    // Authorized verifiers (set by owner / AccessControl contract)
    mapping(address => bool) public authorizedVerifiers;

    // ──────────────────────────────────────────────
    // Events
    // ──────────────────────────────────────────────

    event IdentityRegistered(
        uint256 indexed identityId,
        address indexed wallet,
        bytes32 identityHash,
        uint256 timestamp
    );

    event IdentityVerified(
        uint256 indexed identityId,
        address indexed wallet,
        address indexed verifier,
        uint256 timestamp
    );

    event IdentityUpdated(
        uint256 indexed identityId,
        address indexed wallet,
        bytes32 oldHash,
        bytes32 newHash,
        uint256 timestamp
    );

    event IdentityDeactivated(
        uint256 indexed identityId,
        address indexed wallet,
        address indexed actor,
        uint256 timestamp
    );

    event IdentityReactivated(
        uint256 indexed identityId,
        address indexed wallet,
        address indexed actor,
        uint256 timestamp
    );

    // ──────────────────────────────────────────────
    // Modifiers
    // ──────────────────────────────────────────────

    modifier onlyAuthorized() {
        require(
            msg.sender == owner() || authorizedVerifiers[msg.sender],
            "Identity: caller is not authorized"
        );
        _;
    }

    modifier identityExists(address wallet) {
        require(isRegistered[wallet], "Identity: not registered");
        _;
    }

    // ──────────────────────────────────────────────
    // Constructor
    // ──────────────────────────────────────────────

    constructor() Ownable(msg.sender) {}

    // ──────────────────────────────────────────────
    // Admin helpers
    // ──────────────────────────────────────────────

    function setAuthorizedVerifier(address verifier, bool status) external onlyOwner {
        require(verifier != address(0), "Identity: zero address");
        authorizedVerifiers[verifier] = status;
    }

    // ──────────────────────────────────────────────
    // Identity Registration
    // ──────────────────────────────────────────────

    /**
     * @notice Register a new identity. Any wallet can self-register once.
     * @param identityHash  keccak256 hash representing off-chain identity data.
     */
    function registerIdentity(bytes32 identityHash) external nonReentrant {
        require(!isRegistered[msg.sender], "Identity: already registered");
        require(identityHash != bytes32(0), "Identity: empty hash");

        uint256 id = _nextIdentityId++;

        _identities[msg.sender] = IdentityRecord({
            identityId: id,
            walletAddress: msg.sender,
            identityHash: identityHash,
            createdAt: block.timestamp,
            updatedAt: block.timestamp,
            verified: false,
            active: true
        });

        _idToWallet[id] = msg.sender;
        isRegistered[msg.sender] = true;
        totalIdentities++;
        activeCount++;

        emit IdentityRegistered(id, msg.sender, identityHash, block.timestamp);
    }

    // ──────────────────────────────────────────────
    // Identity Verification
    // ──────────────────────────────────────────────

    function verifyIdentity(address wallet)
        external
        onlyAuthorized
        identityExists(wallet)
    {
        IdentityRecord storage rec = _identities[wallet];
        require(rec.active, "Identity: inactive");
        require(!rec.verified, "Identity: already verified");

        rec.verified = true;
        rec.updatedAt = block.timestamp;
        verifiedCount++;

        emit IdentityVerified(rec.identityId, wallet, msg.sender, block.timestamp);
    }

    // ──────────────────────────────────────────────
    // Identity Updates
    // ──────────────────────────────────────────────

    function updateIdentityHash(bytes32 newHash)
        external
        identityExists(msg.sender)
    {
        require(newHash != bytes32(0), "Identity: empty hash");
        IdentityRecord storage rec = _identities[msg.sender];
        require(rec.active, "Identity: inactive");

        bytes32 oldHash = rec.identityHash;
        rec.identityHash = newHash;
        rec.updatedAt = block.timestamp;

        emit IdentityUpdated(rec.identityId, msg.sender, oldHash, newHash, block.timestamp);
    }

    // ──────────────────────────────────────────────
    // Activate / Deactivate
    // ──────────────────────────────────────────────

    function deactivateIdentity(address wallet)
        external
        onlyAuthorized
        identityExists(wallet)
    {
        IdentityRecord storage rec = _identities[wallet];
        require(rec.active, "Identity: already inactive");

        rec.active = false;
        rec.updatedAt = block.timestamp;
        activeCount--;

        emit IdentityDeactivated(rec.identityId, wallet, msg.sender, block.timestamp);
    }

    function reactivateIdentity(address wallet)
        external
        onlyAuthorized
        identityExists(wallet)
    {
        IdentityRecord storage rec = _identities[wallet];
        require(!rec.active, "Identity: already active");

        rec.active = true;
        rec.updatedAt = block.timestamp;
        activeCount++;

        emit IdentityReactivated(rec.identityId, wallet, msg.sender, block.timestamp);
    }

    // ──────────────────────────────────────────────
    // View helpers
    // ──────────────────────────────────────────────

    function getIdentity(address wallet)
        external
        view
        identityExists(wallet)
        returns (IdentityRecord memory)
    {
        return _identities[wallet];
    }

    function getIdentityById(uint256 identityId)
        external
        view
        returns (IdentityRecord memory)
    {
        address wallet = _idToWallet[identityId];
        require(wallet != address(0), "Identity: id not found");
        return _identities[wallet];
    }

    function isIdentityVerified(address wallet)
        external
        view
        returns (bool)
    {
        if (!isRegistered[wallet]) return false;
        return _identities[wallet].verified;
    }

    function isIdentityActive(address wallet)
        external
        view
        returns (bool)
    {
        if (!isRegistered[wallet]) return false;
        return _identities[wallet].active;
    }
}
