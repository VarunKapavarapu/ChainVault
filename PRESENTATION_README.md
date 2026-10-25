# ChainVault — Complete Visual Architecture & Operational Flowcharts
### *Blockchain-Based Secure Platform for Decentralized Identity, Role-Based Access Control, and Digital Asset Ownership Using Smart Contracts*

---

## 📑 Table of Contents
1. [Visual System Architecture](#1-visual-system-architecture)
2. [Why Blockchain? Centralized vs Decentralized Comparison](#2-why-blockchain-centralized-vs-decentralized-comparison)
3. [End-to-End Functionality Flowcharts](#3-end-to-end-functionality-flowcharts)
   - [Flowchart 1: Decentralized Identity Registration & Hash Verification](#flowchart-1-decentralized-identity-registration--hash-verification)
   - [Flowchart 2: On-Chain Role-Based Access Control (RBAC) Enforcement](#flowchart-2-on-chain-role-based-access-control-rbac-enforcement)
   - [Flowchart 3: Digital Asset (ERC-721 NFT) Minting & Custody Transfer](#flowchart-3-digital-asset-erc-721-nft-minting--custody-transfer)
   - [Flowchart 4: Public Asset Authenticity Verification (No Wallet Required)](#flowchart-4-public-asset-authenticity-verification-no-wallet-required)
   - [Flowchart 5: Immutable Audit Logging & Event Mining Pipeline](#flowchart-5-immutable-audit-logging--event-mining-pipeline)
   - [Flowchart 6: Real-World Enterprise Scenario (Step-by-Step)](#flowchart-6-real-world-enterprise-scenario-step-by-step)
4. [Smart Contract State Transition Diagrams](#4-smart-contract-state-transition-diagrams)
5. [Security Architecture & Defense-in-Depth](#5-security-architecture--defense-in-depth)
6. [Academic Boundaries & Technical Limitations](#6-academic-boundaries--technical-limitations)
7. [Examiner & Evaluator Viva Q&A Guide](#7-examiner--evaluator-viva-qa-guide)

---

## 📌 Project Problem Statement & Scope

> **Background:**  
> Organizations today rely heavily on centralized identity and access management systems, which create significant security and operational risks. These systems are vulnerable to cyber attacks, identity theft, unauthorized access, and single points of failure. Additionally, digital and physical asset ownership is often managed through disconnected or semi-centralized systems, making verification of authenticity, access rights, and ownership history difficult and unreliable. There is a growing need for a decentralized, tamper-proof system that can securely manage user identities, control access permissions, and ensure transparent ownership of digital assets.

> **Detailed Description:**  
> The system introduces a blockchain-based framework that integrates decentralized identity management, access control, and NFT-based digital asset ownership. Each user is assigned a decentralized identifier authenticated using cryptographic proofs. Digital assets are represented as Non-Fungible Tokens (NFTs), permanently recorded and directly allocated to user identities. Smart contracts govern all operations, allowing only authorized administrators to mint NFTs and assign them to user identities. The system implements Role-Based Access Control (RBAC) with Admin, Manager, Auditor, and User roles enforced by smart contracts. Every activity is immutably recorded on the blockchain, providing a transparent, tamper-proof audit trail.

> **Expected Solution:**  
> A unified, trustless decentralized platform integrating secure digital identity management, NFT-based asset ownership, and access control governed by smart contracts on an immutable blockchain ledger.

---

## 1. Visual System Architecture

The following diagram illustrates how the frontend user interface, wallet key custody, EVM smart contracts, and distributed ledger state communicate in real time:

```mermaid
flowchart TD
    classDef client fill:#0f172a,stroke:#38bdf8,stroke-width:2px,color:#f8fafc;
    classDef rpc fill:#1e1b4b,stroke:#818cf8,stroke-width:2px,color:#f8fafc;
    classDef contract fill:#064e3b,stroke:#34d399,stroke-width:2px,color:#f8fafc;
    classDef ledger fill:#312e81,stroke:#a78bfa,stroke-width:2px,color:#f8fafc;

    subgraph ClientLayer ["1. Client Presentation & Keystore Layer"]
        UI["🖥️ React 19 Frontend\n(Scrolltide Dark Aesthetic, Tailwind CSS)"]:::client
        WALLET["🔑 MetaMask / Web3 Keystore\n(ECDSA secp256k1 Keypair Custody)"]:::client
        ETHERS["⚡ Ethers.js v6 Adapter\n(JsonRpcProvider / BrowserProvider)"]:::client
        UI <-->|User clicks action| WALLET
        WALLET <-->|Sign message / Tx payload| ETHERS
    end

    subgraph TransportLayer ["2. JSON-RPC Communication Layer"]
        RPC["🌐 JSON-RPC 2.0 Interface\n(HTTP/WebSocket Port 8545, Chain ID 31337)"]:::rpc
        ETHERS <-->|eth_sendRawTransaction / eth_call| RPC
    end

    subgraph EVMLayer ["3. Smart Contract EVM Execution Layer (Solidity 0.8.24)"]
        direction TB
        ID_C["🪪 Identity.sol\n- Self-registration with Keccak-256 hash\n- Admin verification & deactivation\n- Zero on-chain PII"]:::contract
        AC_C["🛡️ ChainVaultAccessControl.sol\n- 4 Roles: Admin, Manager, Auditor, User\n- 11 Granular EVM-enforced permissions\n- Modifier revert protection"]:::contract
        NFT_C["📦 AssetNFT.sol (ERC-721)\n- Unique digital asset tokenization\n- Ownership provenance & transfers\n- OpenZeppelin URI storage"]:::contract
        AUDIT_C["📜 AuditLogger.sol\n- Append-only security event logger\n- Cryptographic proof references\n- Paginated reverse queries"]:::contract

        RPC <-->|EVM Opcode Execution| ID_C
        RPC <-->|EVM Opcode Execution| AC_C
        RPC <-->|EVM Opcode Execution| NFT_C
        RPC <-->|EVM Opcode Execution| AUDIT_C

        ID_C -.->|Log verification event| AUDIT_C
        AC_C -.->|Log role delegation| AUDIT_C
        NFT_C -.->|Log mint/transfer event| AUDIT_C
    end

    subgraph LedgerLayer ["4. Distributed Consensus & Immutable Ledger State"]
        STATE["💾 EVM World State Trie\n(Deterministic contract storage slots)"]:::ledger
        RECEIPTS["🧾 Transaction Receipts & Logs\n(Bloom filters, topic indexing)"]:::ledger
        BLOCKS["⛓️ Cryptographic Blocks\n(Merkle Patricia Roots, Cancún Hardfork)"]:::ledger

        ID_C --> STATE
        AC_C --> STATE
        NFT_C --> STATE
        AUDIT_C --> RECEIPTS
        STATE --> BLOCKS
        RECEIPTS --> BLOCKS
    end
```

---

## 2. Why Blockchain? Centralized vs Decentralized Comparison

```mermaid
flowchart LR
    subgraph Centralized ["❌ Centralized Enterprise IT (Vulnerable)"]
        C_USER["User / Attacker"] --> C_DB[("Central SQL Database\n(Active Directory / LDAP)")]
        C_ADMIN["Database Administrator"] -->|Unilateral Access| C_DB
        C_DB -.->|Single Point of Failure| C_RISK["• DB admin can silently modify permissions\n• Personal PII stored in central honeypot\n• Audit logs can be truncated or deleted\n• Unverifiable past asset ownership"]
    end

    subgraph Decentralized ["✅ ChainVault Blockchain Model (Tamper-Evident)"]
        D_USER["User / Stakeholder"] --> D_EVM["EVM Smart Contracts\n(Identity.sol, RBAC.sol, AssetNFT.sol)"]
        D_EVM --> D_CHAIN[("Distributed Ledger State\n(Consensus Node Network)")]
        D_CHAIN -.->|Cryptographic Guarantees| D_BENEFIT["• Zero PII on-chain (Keccak-256 hashes only)\n• Contract modifiers block unauthorized callers\n• Append-only event emission cannot be deleted\n• Unbroken cryptographic chain of custody"]
    end
```

---

## 3. End-to-End Functionality Flowcharts

### Flowchart 1: Decentralized Identity Registration & Hash Verification

How an employee registers their identity without ever exposing sensitive personal information on a public blockchain:

```mermaid
flowchart TD
    START([Employee connects wallet]) --> INPUT[Employee enters off-chain attributes:\nName, Email, Employee ID, Department]
    
    INPUT --> HASH[Off-Chain Client computes cryptographic digest:\nHash = keccak256 EmployeeID : Name : Email : Dept]
    
    HASH --> SUBMIT[Submit registerIdentity Hash to Identity.sol]
    
    SUBMIT --> CHECK_DUP{Is wallet address\nalready registered?}
    CHECK_DUP -- Yes --> REVERT1[Revert: Identity already registered]
    CHECK_DUP -- No --> CHECK_HASH{Is Hash != 0x0?}
    CHECK_HASH -- No --> REVERT2[Revert: Empty identity hash]
    
    CHECK_HASH -- Yes --> STORE[Store record in _identities mapping:\n- identityId = auto-increment\n- walletAddress = msg.sender\n- identityHash = Hash\n- verified = false\n- active = true]
    
    STORE --> EMIT1[Emit IdentityRegistered Event]
    EMIT1 --> NOTIFY[Admin Dashboard receives pending identity]
    
    NOTIFY --> ADMIN_ACTION{Admin reviews proof\nand clicks Verify}
    ADMIN_ACTION --> ADMIN_CHECK{Is caller authorized\nadmin or verifier?}
    ADMIN_CHECK -- No --> REVERT3[Revert: Caller is not authorized]
    ADMIN_CHECK -- Yes --> VERIFY_STATE[Update state in Identity.sol:\nverified = true\nupdatedAt = block.timestamp]
    
    VERIFY_STATE --> EMIT2[Emit IdentityVerified Event]
    EMIT2 --> AUDIT[Append record to AuditLogger.sol]
    AUDIT --> SUCCESS([Identity is now Verified and Active on-chain])
```

---

### Flowchart 2: On-Chain Role-Based Access Control (RBAC) Enforcement

How permissions are validated mathematically by the EVM on every invocation:

```mermaid
flowchart TD
    CALLER([Caller submits transaction]) --> TX_TARGET{Target Function\ne.g., mintAsset or assignRole}
    
    TX_TARGET --> MODIFIER[EVM evaluates modifier:\nonlyAdmin / onlyAuthorizedMinter]
    
    MODIFIER --> QUERY_ROLE[Query AccessControl contract:\nhasRole msg.sender, REQUIRED_ROLE]
    
    QUERY_ROLE --> IS_OWNER{Is msg.sender == contract owner\nOR role granted in _roles mapping?}
    
    IS_OWNER -- False --> REVERT[⛔ EVM Execution Reverts:\n'AccessControl: caller is not authorized'\nGas spent on error, no state changed]
    
    IS_OWNER -- True --> QUERY_PERM{Does role contain\nspecific permission hash?}
    
    QUERY_PERM -- False --> REVERT
    QUERY_PERM -- True --> EXECUTE[✅ Execute State Transition:\n- Mint token / Update custody\n- Update storage slot]
    
    EXECUTE --> LOG[Call AuditLogger.logEvent\nEmit SecurityEventLogged on-chain]
    LOG --> FINALIZE([Transaction Mined into Block])
```

---

### Flowchart 3: Digital Asset (ERC-721 NFT) Minting & Custody Transfer

How corporate hardware (e.g., Laptop LT-042) and digital licenses are minted and transferred between colleagues:

```mermaid
flowchart TD
    subgraph MintingPhase ["Phase 1: Asset Minting (Admin Only)"]
        M_START([Admin opens Mint Asset form]) --> M_INPUT[Enter Asset Details:\nName: Corporate Laptop LT-042\nType: Hardware\nSerial: SN-MBP-2026-042\nRecipient: Employee A Wallet]
        M_INPUT --> M_CALL[Call AssetNFT.mintAsset to, name, type, serial, uri]
        M_CALL --> M_AUTH{Is caller an\nauthorized minter?}
        M_AUTH -- No --> M_REV[Revert: Unauthorized minter]
        M_AUTH -- Yes --> M_MINT[ERC-721 _safeMint to Employee A\nSet tokenURI with metadata\nAssign unique Token ID #1]
        M_MINT --> M_LOG[Emit AssetMinted & log in AuditLogger]
    end

    subgraph TransferPhase ["Phase 2: Custody Transfer (Employee to Colleague)"]
        T_START([Employee A wishes to transfer asset to Employee B]) --> T_INPUT[Select Token #1 and enter Employee B Wallet]
        T_INPUT --> T_CALL[Call AssetNFT.transferAsset tokenId=1, to=Employee B]
        T_CALL --> T_CHECK{Is msg.sender == current owner\nOR approved operator\nOR admin?}
        T_CHECK -- No --> T_REV[Revert: Caller not authorized to transfer]
        T_CHECK -- Yes --> T_ACTIVE{Is asset active?\nactive == true}
        T_ACTIVE -- No --> T_REV_INACT[Revert: Asset is decommissioned]
        T_ACTIVE -- Yes --> T_TRANSFER[ERC-721 _transfer from Employee A to Employee B\nUpdate _assets mapping]
        T_TRANSFER --> T_LOG[Emit AssetTransferred on-chain\nRecord timestamp & txHash in AuditLogger]
        T_LOG --> T_DONE([Employee B is now verified custodian on blockchain])
    end

    MintingPhase --> TransferPhase
```

---

### Flowchart 4: Public Asset Authenticity Verification (No Wallet Required)

How external auditors, employees, or third parties verify genuine ownership without needing MetaMask or gas:

```mermaid
flowchart TD
    START([Visitor opens Public Verifier]) --> INPUT[Enter Asset Identifier:\n- Token ID e.g., 1\n- Serial Number e.g., SN-MBP-2026-042\n- Transaction Hash e.g., 0x7c9a4e...]
    
    INPUT --> QUERY[Execute read-only view call:\nAssetNFT.verifyAsset tokenId]
    
    QUERY --> EXISTS{Does Token ID exist\nand within valid range?}
    
    EXISTS -- No --> NOT_FOUND[Display Red Alert:\n'Asset could not be verified on the blockchain.\nIdentifier not found in registry.']
    
    EXISTS -- Yes --> READ_RECORD[Retrieve on-chain state:\n- Current Owner Address\n- Asset Name & Category\n- Serial Number Reference\n- Mint Block & Creation Timestamp\n- Active / Decommissioned State]
    
    READ_RECORD --> AUDIT_LOOKUP[Query AuditLogger for Token ID event history]
    
    AUDIT_LOOKUP --> DISPLAY[Display Official Authenticity Certificate:\n✅ Verified on Local Ethereum EVM\n- Current Custodian: Name & Department\n- Mint Transaction Hash\n- Complete Historical Transfer Chain\n- Scannable Physical Verification QR Code]
```

---

### Flowchart 5: Immutable Audit Logging & Event Mining Pipeline

How security and governance actions become permanent, tamper-evident audit trails:

```mermaid
flowchart LR
    ACTION["Any Lifecycle Event Occurs\n(Identity Created, Role Granted,\nAsset Minted, Asset Transferred)"] --> LOGGER["AuditLogger.sol\nlogEvent(eventType, actor, target, details, txRef)"]
    
    LOGGER --> AUTH_CHECK{"Is caller an\nauthorized logger?"}
    AUTH_CHECK -- No --> REVERT["Revert: Unauthorized logger"]
    
    AUTH_CHECK -- Yes --> APPEND["Append AuditRecord struct to internal array:\n- eventId (sequential)\n- timestamp = block.timestamp\n- actor address\n- target address\n- cryptographic txRef"]
    
    APPEND --> EVENT["Emit SecurityEventLogged(eventId, eventType, ...)"]
    
    EVENT --> BLOCK["Mined into Ethereum Block\nIncluded in Block Header Bloom Filter"]
    
    BLOCK --> FRONTEND["Frontend Audit Explorer Indexer\n(Reverse-chronological timeline, filter by event type)"]
```

---

### Flowchart 6: Real-World Enterprise Scenario (Step-by-Step)

A complete demonstration scenario showing how the four pre-configured stakeholders interact:

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Arjun Mehta (Security Admin)
    actor Manager as Priya Sharma (IT Manager)
    actor User as Ananya Rao (Software Engineer)
    actor Auditor as Rahul Verma (Compliance Auditor)
    participant BC as ChainVault Smart Contracts

    Note over Admin,BC: Step 1: Identity Registration & Verification
    User->>BC: 1. Self-register identity with Keccak-256 hash
    Admin->>BC: 2. Verify Ananya Rao's identity on-chain
    Admin->>BC: 3. Assign MANAGER role to Priya Sharma

    Note over Admin,BC: Step 2: Digital Asset Issuance (NFT)
    Admin->>BC: 4. Mint Token #1: Corporate Laptop LT-042 to Priya Sharma (IT Dept)
    Admin->>BC: 5. Mint Token #3: ISO/IEC 27001 Security Cert DC-031 to Ananya Rao

    Note over Manager,BC: Step 3: Delegated Custodial Allocation
    Manager->>BC: 6. Reallocate Laptop LT-042 to Ananya Rao (Engineering)
    BC->>BC: 7. Validate Priya's MANAGER_ROLE & execute ERC-721 transfer

    Note over Auditor,BC: Step 4: Independent Audit Verification
    Auditor->>BC: 8. Open Read-Only Auditor Console
    Auditor->>BC: 9. Input Ananya's credentials into Zero-Knowledge Hash Verifier
    BC-->>Auditor: 10. Match Confirmed! Mathematical proof verified with zero PII exposure
    Auditor->>BC: 11. Inspect Laptop LT-042 custody chain: Admin -> Manager -> Ananya Rao
```

---

## 4. Smart Contract State Transition Diagrams

### 4.1 Identity State Machine ([Identity.sol](file:///d:/Varun/BCT/contracts/Identity.sol))
```mermaid
stateDiagram-v2
    [*] --> Unregistered

    Unregistered --> Registered_PendingVerification: registerIdentity(hash)
    Registered_PendingVerification --> Verified_Active: verifyIdentity(wallet) [Admin Only]
    
    Verified_Active --> Deactivated_Inactive: deactivateIdentity(wallet) [Admin Only]
    Deactivated_Inactive --> Verified_Active: reactivateIdentity(wallet) [Admin Only]
    
    Verified_Active --> Verified_Active: updateIdentityHash(newHash) [Owner Only]
```

### 4.2 Asset Custody State Machine ([AssetNFT.sol](file:///d:/Varun/BCT/contracts/AssetNFT.sol))
```mermaid
stateDiagram-v2
    [*] --> Unminted

    Unminted --> Minted_InInventory: mintAsset(to, name, type, serial, uri) [Admin Only]
    Minted_InInventory --> Assigned_InUse: assignAsset(tokenId, recipient) [Admin / Manager]
    Assigned_InUse --> Transferred: transferAsset(tokenId, recipient) [Current Owner / Manager]
    Transferred --> Assigned_InUse: Further Transfers Between Employees

    Assigned_InUse --> Decommissioned: deactivateAsset(tokenId) [Admin Only]
    Decommissioned --> [*]
```

---

## 5. Security Architecture & Defense-in-Depth

| Layer | Threat / Attack Vector | ChainVault Mitigation Mechanism |
| :--- | :--- | :--- |
| **Data Privacy** | Public ledger inspection leaking employee personal data | **Zero PII On-Chain:** Off-chain attributes are passed through `keccak256`. Only the 32-byte digest is committed to `Identity.sol`, ensuring GDPR Article 17 compliance. |
| **Authorization** | Bypassing frontend UI to invoke administrative methods directly | **EVM Modifier Checks:** Methods use `onlyAdmin` and `onlyAuthorizedMinter`. Unauthorized callers revert at the bytecode level, as verified by our 19-test automated test suite. |
| **Reentrancy** | Recursive reentrant calls draining state during transfers | **OpenZeppelin `ReentrancyGuard`:** State-changing methods declare `nonReentrant` following the *Checks-Effects-Interactions* design pattern. |
| **Asset Burning** | Unintentional transfer to zero-address (`0x000...000`) | **Zero-Address Guards:** Explicit `require(to != address(0))` validations before any mint or transfer operation. |
| **Audit Tampering** | Deleting or altering past security logs | **Append-Only Array:** `AuditLogger.sol` provides no deletion or modification functions; records can only be pushed. |

---

## 6. Academic Boundaries & Technical Limitations

When presenting to professors, reviewers, or examiners, explicitly highlight these boundaries to demonstrate technical maturity:

1. **Wallet Keypair ≠ Full W3C DID Standard:**  
   An Ethereum public key acts as an authoritative cryptographic keypair. A full W3C Decentralized Identifier standard requires JSON-LD DID Documents (`did:ethr:...`) and decentralized resolution endpoints.
2. **NFT Ownership ≠ Physical Asset Condition:**  
   The ERC-721 token proves ownership of the organizational digital record. It does not prove that a physical laptop is undamaged or physically present in an office. External mechanisms (QR codes, serial tags, RFID, physical audits) are required.
3. **Private Key Custody Risk:**  
   Decentralized security relies on private key security. If an employee loses access to their private key, their account must be revoked and re-enrolled by an administrator.
4. **Gas & Scalability on Public Networks:**  
   Running enterprise access control on public Ethereum L1 would incur prohibitive gas fees. In commercial production, this architecture is deployed on **private consortium chains** (Hyperledger Besu, Quorum) or **Layer-2 Rollups** (Arbitrum Orbit, Polygon CDK).

---

## 7. Examiner & Evaluator Viva Q&A Guide

### Q1: "Why is a blockchain needed for IAM when relational databases with RBAC already exist?"
> **Answer:** "Centralized databases rely entirely on trusting database administrators and have a single point of failure. If root DB credentials are breached, an attacker can modify permission rows without producing cryptographic evidence. ChainVault turns access control into smart contract execution: permissions are enforced on the EVM, and every change generates an immutable, timestamped transaction proof."

### Q2: "How does ChainVault comply with privacy regulations like GDPR if blockchain records cannot be deleted?"
> **Answer:** "ChainVault enforces a strict **Zero PII on-chain** design. Sensitive details (legal names, personal emails, employee IDs) are hashed locally on the client using Keccak-256. Only the 32-byte hash is stored on-chain. An external observer cannot reverse the hash to recover personal identity, but an authorized auditor can mathematically confirm an identity claim."

### Q3: "What prevents an unauthorized employee from calling `mintAsset` directly via curl or Hardhat?"
> **Answer:** "Security is enforced at the smart contract level, not by hiding buttons in the UI. `AssetNFT.sol` checks `msg.sender` inside the `onlyAuthorizedMinter` modifier. If the caller does not hold the `ADMIN` role in `ChainVaultAccessControl.sol`, the EVM automatically reverts the transaction and burns gas, as proven in our automated test suite."

### Q4: "How does the platform support evaluations if MetaMask is not installed on the evaluator's machine?"
> **Answer:** "ChainVault features a built-in **Interactive Demo Mode** pre-loaded with four enterprise personas (Arjun Mehta as Admin, Priya Sharma as Manager, Rahul Verma as Auditor, Ananya Rao as User). It simulates transactions and state transitions in-memory with full cryptographic hashing, clearly marked by an amber banner: *'DEMO MODE — Blockchain transactions are simulated'*."

---

## 8. Automated Test Suite Proofs

All contract operations and security assertions are validated by a 19-test automated test suite:

```bash
npx hardhat test test/ChainVault.test.js
```

```
  ChainVault Security Platform — Smart Contract Test Suite
    1. Decentralized Identity
      ✔ Should allow a wallet to self-register an identity with a cryptographic hash
      ✔ Should reject duplicate registration for the same wallet
      ✔ Should reject registration with empty identity hash
      ✔ Should allow authorized verifier to verify an identity
      ✔ Should prevent unauthorized wallets from verifying identities
      ✔ Should allow identity owner to update their off-chain identity hash
      ✔ Should allow authorized admin to deactivate and reactivate an identity
    2. On-Chain Role-Based Access Control (RBAC)
      ✔ Deployer has ADMIN role by default
      ✔ Admin can assign roles with granular permissions
      ✔ Non-admin cannot assign roles (Smart Contract enforcement)
      ✔ Admin can revoke roles and their default permissions
      ✔ Admin can grant and revoke bespoke granular permissions
    3. Digital Asset Management (ERC-721 NFT)
      ✔ Authorized minter can mint asset NFT with complete metadata
      ✔ Unauthorized account CANNOT mint asset NFTs
      ✔ Owner or admin can assign / transfer asset to another identity
      ✔ Unauthorized account CANNOT transfer someone else's asset
      ✔ Asset verification returns correct on-chain status
    4. Immutable Audit Logging
      ✔ Authorized logger can record security events
      ✔ Non-authorized caller cannot write to audit logger

  19 passing (2s)
```
