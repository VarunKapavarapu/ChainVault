// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AuditLogger
 * @notice Immutable on-chain audit trail logger.
 * @dev Records security and operational events (identity, access control, asset lifecycle).
 *      Emits standard blockchain events that the frontend indexing layer can reconstruct
 *      into a chronological, tamper-evident audit timeline.
 */
contract AuditLogger is Ownable {
    // ──────────────────────────────────────────────
    // Types
    // ──────────────────────────────────────────────

    struct AuditRecord {
        uint256 eventId;
        string eventType;      // e.g., "IDENTITY_CREATED", "ROLE_ASSIGNED", "ASSET_TRANSFERRED"
        address actor;          // Who executed the transaction
        address target;         // Wallet or account affected
        string details;        // Context or reference (asset token ID, role name, hash)
        uint256 timestamp;
        bytes32 txHashReference; // Transaction reference or off-chain proof hash
    }

    // ──────────────────────────────────────────────
    // State
    // ──────────────────────────────────────────────

    uint256 private _nextEventId = 1;
    AuditRecord[] private _auditLog;

    mapping(address => bool) public authorizedLoggers;

    // ──────────────────────────────────────────────
    // Events
    // ──────────────────────────────────────────────

    event SecurityEventLogged(
        uint256 indexed eventId,
        string indexed eventType,
        address indexed actor,
        address target,
        string details,
        uint256 timestamp
    );

    // ──────────────────────────────────────────────
    // Modifiers
    // ──────────────────────────────────────────────

    modifier onlyAuthorized() {
        require(
            msg.sender == owner() || authorizedLoggers[msg.sender],
            "AuditLogger: caller is not authorized to log"
        );
        _;
    }

    // ──────────────────────────────────────────────
    // Constructor
    // ──────────────────────────────────────────────

    constructor() Ownable(msg.sender) {}

    // ──────────────────────────────────────────────
    // Admin Controls
    // ──────────────────────────────────────────────

    function setAuthorizedLogger(address logger, bool status) external onlyOwner {
        require(logger != address(0), "AuditLogger: zero address");
        authorizedLoggers[logger] = status;
    }

    // ──────────────────────────────────────────────
    // Logging Operations
    // ──────────────────────────────────────────────

    /**
     * @notice Log an immutable audit record to the blockchain.
     * @param eventType Standardized event identifier
     * @param actor Address initiating the event
     * @param target Address or entity subject to the event
     * @param details Human-readable context / metadata string
     * @param txRef Optional cryptographic reference
     */
    function logEvent(
        string calldata eventType,
        address actor,
        address target,
        string calldata details,
        bytes32 txRef
    ) external onlyAuthorized returns (uint256) {
        uint256 eventId = _nextEventId++;

        AuditRecord memory record = AuditRecord({
            eventId: eventId,
            eventType: eventType,
            actor: actor,
            target: target,
            details: details,
            timestamp: block.timestamp,
            txHashReference: txRef
        });

        _auditLog.push(record);

        emit SecurityEventLogged(eventId, eventType, actor, target, details, block.timestamp);

        return eventId;
    }

    // ──────────────────────────────────────────────
    // View Functions
    // ──────────────────────────────────────────────

    function getTotalEvents() external view returns (uint256) {
        return _auditLog.length;
    }

    function getAuditRecord(uint256 eventId) external view returns (AuditRecord memory) {
        require(eventId > 0 && eventId <= _auditLog.length, "AuditLogger: invalid event ID");
        return _auditLog[eventId - 1];
    }

    /**
     * @notice Fetch paginated recent events for efficient UI display.
     */
    function getRecentEvents(uint256 offset, uint256 limit)
        external
        view
        returns (AuditRecord[] memory)
    {
        uint256 total = _auditLog.length;
        if (offset >= total) {
            return new AuditRecord[](0);
        }

        uint256 end = offset + limit;
        if (end > total) {
            end = total;
        }

        uint256 resultSize = end - offset;
        AuditRecord[] memory result = new AuditRecord[](resultSize);

        for (uint256 i = 0; i < resultSize; i++) {
            // Read in reverse chronological order (newest first)
            result[i] = _auditLog[total - 1 - (offset + i)];
        }

        return result;
    }
}
