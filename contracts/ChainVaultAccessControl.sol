// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ChainVaultAccessControl
 * @notice On-chain Role-Based Access Control with granular permissions.
 * @dev Every permission check is enforced at the contract level so that
 *      callers who bypass the frontend UI still cannot perform unauthorized
 *      operations.
 */
contract ChainVaultAccessControl is Ownable {
    // ──────────────────────────────────────────────
    // Role & Permission Constants
    // ──────────────────────────────────────────────

    bytes32 public constant ADMIN_ROLE     = keccak256("ADMIN");
    bytes32 public constant MANAGER_ROLE   = keccak256("MANAGER");
    bytes32 public constant AUDITOR_ROLE   = keccak256("AUDITOR");
    bytes32 public constant USER_ROLE      = keccak256("USER");

    // Permissions
    bytes32 public constant IDENTITY_VIEW     = keccak256("IDENTITY_VIEW");
    bytes32 public constant IDENTITY_VERIFY   = keccak256("IDENTITY_VERIFY");
    bytes32 public constant IDENTITY_MANAGE   = keccak256("IDENTITY_MANAGE");
    bytes32 public constant ROLE_ASSIGN       = keccak256("ROLE_ASSIGN");
    bytes32 public constant ROLE_REVOKE       = keccak256("ROLE_REVOKE");
    bytes32 public constant ASSET_CREATE      = keccak256("ASSET_CREATE");
    bytes32 public constant ASSET_ASSIGN      = keccak256("ASSET_ASSIGN");
    bytes32 public constant ASSET_TRANSFER    = keccak256("ASSET_TRANSFER");
    bytes32 public constant ASSET_VIEW        = keccak256("ASSET_VIEW");
    bytes32 public constant AUDIT_VIEW        = keccak256("AUDIT_VIEW");
    bytes32 public constant SYSTEM_MANAGE     = keccak256("SYSTEM_MANAGE");

    // ──────────────────────────────────────────────
    // State
    // ──────────────────────────────────────────────

    /// wallet → role → assigned?
    mapping(address => mapping(bytes32 => bool)) private _roles;

    /// wallet → permission → granted?
    mapping(address => mapping(bytes32 => bool)) private _permissions;

    /// wallet → list of assigned role keys
    mapping(address => bytes32[]) private _userRoles;

    /// wallet → list of granted permission keys
    mapping(address => bytes32[]) private _userPermissions;

    uint256 public totalRoleAssignments;

    // ──────────────────────────────────────────────
    // Events
    // ──────────────────────────────────────────────

    event RoleAssigned(
        address indexed account,
        bytes32 indexed role,
        address indexed assigner,
        uint256 timestamp
    );

    event RoleRemoved(
        address indexed account,
        bytes32 indexed role,
        address indexed remover,
        uint256 timestamp
    );

    event PermissionGranted(
        address indexed account,
        bytes32 indexed permission,
        address indexed granter,
        uint256 timestamp
    );

    event PermissionRevoked(
        address indexed account,
        bytes32 indexed permission,
        address indexed revoker,
        uint256 timestamp
    );

    // ──────────────────────────────────────────────
    // Modifiers
    // ──────────────────────────────────────────────

    modifier onlyAdmin() {
        require(
            msg.sender == owner() || _roles[msg.sender][ADMIN_ROLE],
            "AccessControl: caller is not admin"
        );
        _;
    }

    // ──────────────────────────────────────────────
    // Constructor
    // ──────────────────────────────────────────────

    constructor() Ownable(msg.sender) {
        // Grant deployer the ADMIN role and all permissions
        _assignRole(msg.sender, ADMIN_ROLE);
        _grantAllAdminPermissions(msg.sender);
    }

    // ──────────────────────────────────────────────
    // Role Management
    // ──────────────────────────────────────────────

    function assignRole(address account, bytes32 role) external onlyAdmin {
        require(account != address(0), "AccessControl: zero address");
        require(!_roles[account][role], "AccessControl: role already assigned");

        _assignRole(account, role);
        _grantDefaultPermissions(account, role);

        emit RoleAssigned(account, role, msg.sender, block.timestamp);
    }

    function removeRole(address account, bytes32 role) external onlyAdmin {
        require(account != address(0), "AccessControl: zero address");
        require(_roles[account][role], "AccessControl: role not assigned");

        _roles[account][role] = false;
        _removeFromArray(_userRoles[account], role);
        totalRoleAssignments--;

        // Revoke default permissions for that role
        _revokeDefaultPermissions(account, role);

        emit RoleRemoved(account, role, msg.sender, block.timestamp);
    }

    // ──────────────────────────────────────────────
    // Permission Management
    // ──────────────────────────────────────────────

    function grantPermission(address account, bytes32 permission) external onlyAdmin {
        require(account != address(0), "AccessControl: zero address");
        require(!_permissions[account][permission], "AccessControl: permission already granted");

        _permissions[account][permission] = true;
        _userPermissions[account].push(permission);

        emit PermissionGranted(account, permission, msg.sender, block.timestamp);
    }

    function revokePermission(address account, bytes32 permission) external onlyAdmin {
        require(account != address(0), "AccessControl: zero address");
        require(_permissions[account][permission], "AccessControl: permission not granted");

        _permissions[account][permission] = false;
        _removeFromArray(_userPermissions[account], permission);

        emit PermissionRevoked(account, permission, msg.sender, block.timestamp);
    }

    // ──────────────────────────────────────────────
    // View helpers
    // ──────────────────────────────────────────────

    function hasRole(address account, bytes32 role) external view returns (bool) {
        return _roles[account][role] || (role == ADMIN_ROLE && account == owner());
    }

    function hasPermission(address account, bytes32 permission) external view returns (bool) {
        // Owner always has all permissions
        if (account == owner()) return true;
        return _permissions[account][permission];
    }

    function getUserRoles(address account) external view returns (bytes32[] memory) {
        return _userRoles[account];
    }

    function getUserPermissions(address account) external view returns (bytes32[] memory) {
        return _userPermissions[account];
    }

    // ──────────────────────────────────────────────
    // Internal helpers
    // ──────────────────────────────────────────────

    function _assignRole(address account, bytes32 role) internal {
        _roles[account][role] = true;
        _userRoles[account].push(role);
        totalRoleAssignments++;
    }

    function _grantAllAdminPermissions(address account) internal {
        bytes32[11] memory perms = [
            IDENTITY_VIEW, IDENTITY_VERIFY, IDENTITY_MANAGE,
            ROLE_ASSIGN, ROLE_REVOKE,
            ASSET_CREATE, ASSET_ASSIGN, ASSET_TRANSFER, ASSET_VIEW,
            AUDIT_VIEW, SYSTEM_MANAGE
        ];
        for (uint256 i = 0; i < perms.length; i++) {
            _permissions[account][perms[i]] = true;
            _userPermissions[account].push(perms[i]);
        }
    }

    function _grantDefaultPermissions(address account, bytes32 role) internal {
        if (role == ADMIN_ROLE) {
            _grantAllAdminPermissions(account);
        } else if (role == MANAGER_ROLE) {
            bytes32[5] memory perms = [
                IDENTITY_VIEW, ASSET_VIEW, ASSET_ASSIGN, ASSET_TRANSFER, AUDIT_VIEW
            ];
            for (uint256 i = 0; i < perms.length; i++) {
                if (!_permissions[account][perms[i]]) {
                    _permissions[account][perms[i]] = true;
                    _userPermissions[account].push(perms[i]);
                }
            }
        } else if (role == AUDITOR_ROLE) {
            bytes32[4] memory perms = [
                IDENTITY_VIEW, ASSET_VIEW, AUDIT_VIEW, IDENTITY_VERIFY
            ];
            for (uint256 i = 0; i < perms.length; i++) {
                if (!_permissions[account][perms[i]]) {
                    _permissions[account][perms[i]] = true;
                    _userPermissions[account].push(perms[i]);
                }
            }
        } else if (role == USER_ROLE) {
            bytes32[2] memory perms = [IDENTITY_VIEW, ASSET_VIEW];
            for (uint256 i = 0; i < perms.length; i++) {
                if (!_permissions[account][perms[i]]) {
                    _permissions[account][perms[i]] = true;
                    _userPermissions[account].push(perms[i]);
                }
            }
        }
    }

    function _revokeDefaultPermissions(address account, bytes32 role) internal {
        if (role == MANAGER_ROLE) {
            bytes32[5] memory perms = [
                IDENTITY_VIEW, ASSET_VIEW, ASSET_ASSIGN, ASSET_TRANSFER, AUDIT_VIEW
            ];
            for (uint256 i = 0; i < perms.length; i++) {
                if (_permissions[account][perms[i]]) {
                    _permissions[account][perms[i]] = false;
                    _removeFromArray(_userPermissions[account], perms[i]);
                }
            }
        } else if (role == AUDITOR_ROLE) {
            bytes32[4] memory perms = [
                IDENTITY_VIEW, ASSET_VIEW, AUDIT_VIEW, IDENTITY_VERIFY
            ];
            for (uint256 i = 0; i < perms.length; i++) {
                if (_permissions[account][perms[i]]) {
                    _permissions[account][perms[i]] = false;
                    _removeFromArray(_userPermissions[account], perms[i]);
                }
            }
        } else if (role == USER_ROLE) {
            bytes32[2] memory perms = [IDENTITY_VIEW, ASSET_VIEW];
            for (uint256 i = 0; i < perms.length; i++) {
                if (_permissions[account][perms[i]]) {
                    _permissions[account][perms[i]] = false;
                    _removeFromArray(_userPermissions[account], perms[i]);
                }
            }
        }
    }

    function _removeFromArray(bytes32[] storage arr, bytes32 value) internal {
        for (uint256 i = 0; i < arr.length; i++) {
            if (arr[i] == value) {
                arr[i] = arr[arr.length - 1];
                arr.pop();
                return;
            }
        }
    }
}
