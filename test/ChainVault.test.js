const { expect } = require("chai");
const hre = require("hardhat");

describe("ChainVault Security Platform — Smart Contract Test Suite", function () {
  let identity, accessControl, assetNFT, auditLogger;
  let owner, manager, auditor, user1, user2, unauthorizedUser;

  // Role hashes
  const ADMIN_ROLE = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("ADMIN"));
  const MANAGER_ROLE = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("MANAGER"));
  const AUDITOR_ROLE = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("AUDITOR"));
  const USER_ROLE = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("USER"));

  // Permission hashes
  const IDENTITY_VERIFY = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("IDENTITY_VERIFY"));
  const ASSET_CREATE = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("ASSET_CREATE"));
  const ASSET_ASSIGN = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("ASSET_ASSIGN"));
  const ASSET_TRANSFER = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("ASSET_TRANSFER"));

  beforeEach(async function () {
    [owner, manager, auditor, user1, user2, unauthorizedUser] = await hre.ethers.getSigners();

    // 1. Deploy Identity
    const Identity = await hre.ethers.getContractFactory("Identity");
    identity = await Identity.deploy();
    await identity.waitForDeployment();

    // 2. Deploy AccessControl
    const AccessControl = await hre.ethers.getContractFactory("ChainVaultAccessControl");
    accessControl = await AccessControl.deploy();
    await accessControl.waitForDeployment();

    // 3. Deploy AssetNFT
    const AssetNFT = await hre.ethers.getContractFactory("AssetNFT");
    assetNFT = await AssetNFT.deploy();
    await assetNFT.waitForDeployment();

    // 4. Deploy AuditLogger
    const AuditLogger = await hre.ethers.getContractFactory("AuditLogger");
    auditLogger = await AuditLogger.deploy();
    await auditLogger.waitForDeployment();

    // Permissions wiring
    await identity.setAuthorizedVerifier(owner.address, true);
    await assetNFT.setAuthorizedMinter(owner.address, true);
    await auditLogger.setAuthorizedLogger(owner.address, true);
  });

  // ──────────────────────────────────────────────
  // 1. Identity Contract Tests
  // ──────────────────────────────────────────────
  describe("1. Decentralized Identity", function () {
    const dummyHash = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("EMP-1024:Ananya:Engineer"));

    it("Should allow a wallet to self-register an identity with a cryptographic hash", async function () {
      await expect(identity.connect(user1).registerIdentity(dummyHash))
        .to.emit(identity, "IdentityRegistered")
        .withArgs(1, user1.address, dummyHash, (await hre.ethers.provider.getBlock("latest")).timestamp + 1);

      const record = await identity.getIdentity(user1.address);
      expect(record.identityId).to.equal(1n);
      expect(record.walletAddress).to.equal(user1.address);
      expect(record.identityHash).to.equal(dummyHash);
      expect(record.verified).to.be.false;
      expect(record.active).to.be.true;
      expect(await identity.isRegistered(user1.address)).to.be.true;
    });

    it("Should reject duplicate registration for the same wallet", async function () {
      await identity.connect(user1).registerIdentity(dummyHash);
      await expect(identity.connect(user1).registerIdentity(dummyHash))
        .to.be.revertedWith("Identity: already registered");
    });

    it("Should reject registration with empty identity hash", async function () {
      await expect(identity.connect(user1).registerIdentity(hre.ethers.ZeroHash))
        .to.be.revertedWith("Identity: empty hash");
    });

    it("Should allow authorized verifier to verify an identity", async function () {
      await identity.connect(user1).registerIdentity(dummyHash);
      await expect(identity.connect(owner).verifyIdentity(user1.address))
        .to.emit(identity, "IdentityVerified");

      expect(await identity.isIdentityVerified(user1.address)).to.be.true;
    });

    it("Should prevent unauthorized wallets from verifying identities", async function () {
      await identity.connect(user1).registerIdentity(dummyHash);
      await expect(identity.connect(unauthorizedUser).verifyIdentity(user1.address))
        .to.be.revertedWith("Identity: caller is not authorized");
    });

    it("Should allow identity owner to update their off-chain identity hash", async function () {
      await identity.connect(user1).registerIdentity(dummyHash);
      const newHash = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("EMP-1024:Ananya:Senior Engineer"));

      await expect(identity.connect(user1).updateIdentityHash(newHash))
        .to.emit(identity, "IdentityUpdated");

      const record = await identity.getIdentity(user1.address);
      expect(record.identityHash).to.equal(newHash);
    });

    it("Should allow authorized admin to deactivate and reactivate an identity", async function () {
      await identity.connect(user1).registerIdentity(dummyHash);
      await identity.connect(owner).deactivateIdentity(user1.address);
      expect(await identity.isIdentityActive(user1.address)).to.be.false;

      await identity.connect(owner).reactivateIdentity(user1.address);
      expect(await identity.isIdentityActive(user1.address)).to.be.true;
    });
  });

  // ──────────────────────────────────────────────
  // 2. Role-Based Access Control Tests
  // ──────────────────────────────────────────────
  describe("2. On-Chain Role-Based Access Control (RBAC)", function () {
    it("Deployer has ADMIN role by default", async function () {
      expect(await accessControl.hasRole(owner.address, ADMIN_ROLE)).to.be.true;
    });

    it("Admin can assign roles with granular permissions", async function () {
      await expect(accessControl.connect(owner).assignRole(manager.address, MANAGER_ROLE))
        .to.emit(accessControl, "RoleAssigned");

      expect(await accessControl.hasRole(manager.address, MANAGER_ROLE)).to.be.true;
      expect(await accessControl.hasPermission(manager.address, ASSET_ASSIGN)).to.be.true;
    });

    it("Non-admin cannot assign roles (Smart Contract enforcement)", async function () {
      await expect(accessControl.connect(unauthorizedUser).assignRole(user1.address, MANAGER_ROLE))
        .to.be.revertedWith("AccessControl: caller is not admin");
    });

    it("Admin can revoke roles and their default permissions", async function () {
      await accessControl.connect(owner).assignRole(manager.address, MANAGER_ROLE);
      expect(await accessControl.hasRole(manager.address, MANAGER_ROLE)).to.be.true;

      await expect(accessControl.connect(owner).removeRole(manager.address, MANAGER_ROLE))
        .to.emit(accessControl, "RoleRemoved");

      expect(await accessControl.hasRole(manager.address, MANAGER_ROLE)).to.be.false;
      expect(await accessControl.hasPermission(manager.address, ASSET_ASSIGN)).to.be.false;
    });

    it("Admin can grant and revoke bespoke granular permissions", async function () {
      await expect(accessControl.connect(owner).grantPermission(user1.address, IDENTITY_VERIFY))
        .to.emit(accessControl, "PermissionGranted");

      expect(await accessControl.hasPermission(user1.address, IDENTITY_VERIFY)).to.be.true;

      await expect(accessControl.connect(owner).revokePermission(user1.address, IDENTITY_VERIFY))
        .to.emit(accessControl, "PermissionRevoked");

      expect(await accessControl.hasPermission(user1.address, IDENTITY_VERIFY)).to.be.false;
    });
  });

  // ──────────────────────────────────────────────
  // 3. NFT Asset Management & Transfers
  // ──────────────────────────────────────────────
  describe("3. Digital Asset Management (ERC-721 NFT)", function () {
    it("Authorized minter can mint asset NFT with complete metadata", async function () {
      const tx = await assetNFT.connect(owner).mintAsset(
        user1.address,
        "Corporate Laptop LT-042",
        "Hardware",
        "MacBook Pro 16-inch M3 Max",
        "SN-MBP-2026-042",
        "https://chainvault.io/meta/lt-042.json"
      );

      await expect(tx).to.emit(assetNFT, "AssetMinted");
      expect(await assetNFT.ownerOf(1)).to.equal(user1.address);

      const details = await assetNFT.getAssetDetails(1);
      expect(details.assetName).to.equal("Corporate Laptop LT-042");
      expect(details.assetType).to.equal("Hardware");
      expect(details.serialNumber).to.equal("SN-MBP-2026-042");
      expect(details.active).to.be.true;
    });

    it("Unauthorized account CANNOT mint asset NFTs", async function () {
      await expect(
        assetNFT.connect(unauthorizedUser).mintAsset(
          unauthorizedUser.address,
          "Fraudulent Asset",
          "Hardware",
          "Description",
          "FAKE-001",
          "https://fake.url"
        )
      ).to.be.revertedWith("AssetNFT: caller not authorized to mint");
    });

    it("Owner or admin can assign / transfer asset to another identity", async function () {
      await assetNFT.connect(owner).mintAsset(
        user1.address,
        "Corporate Laptop LT-042",
        "Hardware",
        "MacBook Pro",
        "SN-042",
        "https://chainvault.io/meta/1"
      );

      // user1 transfers to user2
      await expect(assetNFT.connect(user1).transferAsset(1, user2.address))
        .to.emit(assetNFT, "AssetTransferred")
        .withArgs(1, user1.address, user2.address, (await hre.ethers.provider.getBlock("latest")).timestamp + 1);

      expect(await assetNFT.ownerOf(1)).to.equal(user2.address);
    });

    it("Unauthorized account CANNOT transfer someone else's asset", async function () {
      await assetNFT.connect(owner).mintAsset(
        user1.address,
        "Corporate Laptop LT-042",
        "Hardware",
        "MacBook Pro",
        "SN-042",
        "https://chainvault.io/meta/1"
      );

      await expect(assetNFT.connect(unauthorizedUser).transferAsset(1, unauthorizedUser.address))
        .to.be.revertedWith("AssetNFT: caller not authorized to transfer");
    });

    it("Asset verification returns correct on-chain status", async function () {
      await assetNFT.connect(owner).mintAsset(
        user1.address,
        "Software License SL-108",
        "Software",
        "Enterprise License",
        "LIC-108",
        "https://chainvault.io/meta/2"
      );

      const [exists, currentOwner, assetName, assetType, createdAt, active] =
        await assetNFT.verifyAsset(1);

      expect(exists).to.be.true;
      expect(currentOwner).to.equal(user1.address);
      expect(assetName).to.equal("Software License SL-108");
      expect(assetType).to.equal("Software");
      expect(active).to.be.true;

      // Verify non-existent asset
      const [nonExists] = await assetNFT.verifyAsset(999);
      expect(nonExists).to.be.false;
    });
  });

  // ──────────────────────────────────────────────
  // 4. Immutable Audit Logger Tests
  // ──────────────────────────────────────────────
  describe("4. Immutable Audit Logging", function () {
    it("Authorized logger can record security events", async function () {
      const txRef = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("tx-reference-proof-001"));
      await expect(
        auditLogger.connect(owner).logEvent(
          "ASSET_TRANSFERRED",
          user1.address,
          user2.address,
          "Token ID #1 Laptop LT-042 ownership transferred",
          txRef
        )
      ).to.emit(auditLogger, "SecurityEventLogged");

      expect(await auditLogger.getTotalEvents()).to.equal(1n);

      const record = await auditLogger.getAuditRecord(1);
      expect(record.eventType).to.equal("ASSET_TRANSFERRED");
      expect(record.actor).to.equal(user1.address);
      expect(record.target).to.equal(user2.address);
      expect(record.txHashReference).to.equal(txRef);
    });

    it("Non-authorized caller cannot write to audit logger", async function () {
      await expect(
        auditLogger.connect(unauthorizedUser).logEvent(
          "TAMPER_ATTEMPT",
          unauthorizedUser.address,
          user1.address,
          "Fake entry",
          hre.ethers.ZeroHash
        )
      ).to.be.revertedWith("AuditLogger: caller is not authorized to log");
    });
  });
});
