const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("=================================================");
  console.log("   ChainVault — Contract Deployment Pipeline     ");
  console.log("=================================================\n");

  const [deployer, manager, auditor, user1, user2] = await hre.ethers.getSigners();
  console.log(`Deployer address: ${deployer.address}`);
  console.log(`Manager address:  ${manager ? manager.address : "N/A"}`);
  console.log(`Auditor address:  ${auditor ? auditor.address : "N/A"}`);
  console.log(`User1 address:    ${user1 ? user1.address : "N/A"}\n`);

  // 1. Deploy Identity Contract
  console.log("1. Deploying Identity contract...");
  const Identity = await hre.ethers.getContractFactory("Identity");
  const identity = await Identity.deploy();
  await identity.waitForDeployment();
  const identityAddress = await identity.getAddress();
  console.log(`   ✓ Identity deployed to: ${identityAddress}`);

  // 2. Deploy AccessControl Contract
  console.log("2. Deploying ChainVaultAccessControl contract...");
  const AccessControl = await hre.ethers.getContractFactory("ChainVaultAccessControl");
  const accessControl = await AccessControl.deploy();
  await accessControl.waitForDeployment();
  const accessControlAddress = await accessControl.getAddress();
  console.log(`   ✓ AccessControl deployed to: ${accessControlAddress}`);

  // 3. Deploy AssetNFT Contract
  console.log("3. Deploying AssetNFT contract...");
  const AssetNFT = await hre.ethers.getContractFactory("AssetNFT");
  const assetNFT = await AssetNFT.deploy();
  await assetNFT.waitForDeployment();
  const assetNFTAddress = await assetNFT.getAddress();
  console.log(`   ✓ AssetNFT deployed to: ${assetNFTAddress}`);

  // 4. Deploy AuditLogger Contract
  console.log("4. Deploying AuditLogger contract...");
  const AuditLogger = await hre.ethers.getContractFactory("AuditLogger");
  const auditLogger = await AuditLogger.deploy();
  await auditLogger.waitForDeployment();
  const auditLoggerAddress = await auditLogger.getAddress();
  console.log(`   ✓ AuditLogger deployed to: ${auditLoggerAddress}\n`);

  // 5. Authorize cross-contract operations
  console.log("5. Configuring contract authorizations...");
  // Allow deployer & access control to verify identities
  await identity.setAuthorizedVerifier(deployer.address, true);
  console.log("   ✓ Deployer authorized as verifier on Identity contract");

  // Allow deployer & access control to mint & manage assets
  await assetNFT.setAuthorizedMinter(deployer.address, true);
  console.log("   ✓ Deployer authorized as minter on AssetNFT contract");

  // Allow deployer to log events
  await auditLogger.setAuthorizedLogger(deployer.address, true);
  console.log("   ✓ Deployer authorized as logger on AuditLogger contract\n");

  // 6. Seed Demo Data if test signers available
  if (manager && auditor && user1) {
    console.log("6. Seeding realistic enterprise demonstration data...");

    // Roles hashes
    const MANAGER_ROLE = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("MANAGER"));
    const AUDITOR_ROLE = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("AUDITOR"));
    const USER_ROLE = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("USER"));

    // Assign roles in AccessControl
    await accessControl.assignRole(manager.address, MANAGER_ROLE);
    await accessControl.assignRole(auditor.address, AUDITOR_ROLE);
    await accessControl.assignRole(user1.address, USER_ROLE);
    console.log("   ✓ Roles assigned: Manager, Auditor, User1");

    // Register identities
    const adminHash = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("EMP-001:Arjun Mehta:Security Admin"));
    const managerHash = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("EMP-002:Priya Sharma:IT Operations Manager"));
    const auditorHash = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("EMP-003:Rahul Verma:Compliance Auditor"));
    const user1Hash = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("EMP-004:Ananya Rao:Software Engineer"));

    await identity.connect(deployer).registerIdentity(adminHash);
    await identity.connect(manager).registerIdentity(managerHash);
    await identity.connect(auditor).registerIdentity(auditorHash);
    await identity.connect(user1).registerIdentity(user1Hash);

    // Verify Admin, Manager, User1
    await identity.verifyIdentity(deployer.address);
    await identity.verifyIdentity(manager.address);
    await identity.verifyIdentity(user1.address);
    console.log("   ✓ Identities registered and verified on-chain");

    // Mint realistic demo assets
    console.log("   Minting enterprise demo assets (NFTs)...");
    const tx1 = await assetNFT.mintAsset(
      user1.address,
      "Corporate Laptop LT-042",
      "Hardware",
      "MacBook Pro 16-inch M3 Max (36GB RAM / 1TB SSD) - Enterprise Encrypted",
      "SN-MBP-2026-042",
      "https://chainvault.io/metadata/laptop-lt-042.json"
    );
    await tx1.wait();

    const tx2 = await assetNFT.mintAsset(
      manager.address,
      "Software License SL-108",
      "Digital License",
      "Enterprise AWS Cloud Architect Pro Annual Multi-Seat Seat License",
      "LIC-AWS-ENT-8841",
      "https://chainvault.io/metadata/license-sl-108.json"
    );
    await tx2.wait();

    const tx3 = await assetNFT.mintAsset(
      user1.address,
      "Digital Certificate DC-031",
      "Certificate",
      "ISO/IEC 27001 Certified Lead Security Architect Credential",
      "CERT-ISO-27001-992",
      "https://chainvault.io/metadata/cert-dc-031.json"
    );
    await tx3.wait();

    const tx4 = await assetNFT.mintAsset(
      deployer.address,
      "Engineering Equipment EQ-204",
      "Hardware",
      "Hardware Security Module (HSM) YubiHSM 2 Enterprise Node",
      "HSM-DEV-90214",
      "https://chainvault.io/metadata/equipment-eq-204.json"
    );
    await tx4.wait();
    console.log("   ✓ 4 Demo NFTs minted to stakeholders");

    // Log corresponding audit events
    await auditLogger.logEvent("IDENTITY_REGISTERED", deployer.address, deployer.address, "Admin Arjun Mehta registered identity", hre.ethers.ZeroHash);
    await auditLogger.logEvent("IDENTITY_VERIFIED", deployer.address, deployer.address, "Admin identity verified by root authority", hre.ethers.ZeroHash);
    await auditLogger.logEvent("ROLE_ASSIGNED", deployer.address, manager.address, "MANAGER role assigned to Priya Sharma", hre.ethers.ZeroHash);
    await auditLogger.logEvent("ROLE_ASSIGNED", deployer.address, auditor.address, "AUDITOR role assigned to Rahul Verma", hre.ethers.ZeroHash);
    await auditLogger.logEvent("ASSET_MINTED", deployer.address, user1.address, "Token #1 (Laptop LT-042) minted & assigned to Ananya Rao", hre.ethers.ZeroHash);
    await auditLogger.logEvent("ASSET_MINTED", deployer.address, manager.address, "Token #2 (License SL-108) minted & assigned to Priya Sharma", hre.ethers.ZeroHash);
    await auditLogger.logEvent("ASSET_MINTED", deployer.address, user1.address, "Token #3 (Cert DC-031) minted & assigned to Ananya Rao", hre.ethers.ZeroHash);
    console.log("   ✓ Immutable audit events logged to blockchain\n");
  }

  // 7. Save deployment configuration for frontend
  const deploymentInfo = {
    network: hre.network.name,
    chainId: hre.network.config.chainId || 31337,
    deployedAt: new Date().toISOString(),
    contracts: {
      Identity: identityAddress,
      ChainVaultAccessControl: accessControlAddress,
      AssetNFT: assetNFTAddress,
      AuditLogger: auditLoggerAddress,
    },
  };

  const outputDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(outputDir, "localhost.json"),
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("=================================================");
  console.log("Deployment summary written to /deployments/localhost.json");
  console.log("=================================================");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
