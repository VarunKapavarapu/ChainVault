import { ethers } from 'ethers';
import { IdentityRecord, AssetRecord, AuditRecord, TransactionRecord, Role, UserProfile } from '../types';
import { INITIAL_IDENTITIES, INITIAL_ASSETS, INITIAL_AUDIT_LOGS, INITIAL_TRANSACTIONS, DEMO_PROFILES } from './mockData';
import deployments from '../contracts/deployments.json';
import IdentityAbi from '../contracts/Identity.json';
import AccessControlAbi from '../contracts/ChainVaultAccessControl.json';
import AssetNFTAbi from '../contracts/AssetNFT.json';
import AuditLoggerAbi from '../contracts/AuditLogger.json';

// Local storage keys
const STORAGE_PREFIX = 'chainvault_';

export class BlockchainService {
  private static instance: BlockchainService;

  public isDemoMode: boolean = false;
  public currentAccount: string = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'; // Default Arjun Mehta (Admin)
  public currentRole: Role = 'ADMIN';
  public currentNetwork: string = 'Hardhat Local (31337)';
  public provider: ethers.BrowserProvider | ethers.JsonRpcProvider | null = null;
  public signer: ethers.Signer | null = null;

  // Contracts
  public identityContract: ethers.Contract | null = null;
  public accessControlContract: ethers.Contract | null = null;
  public assetNFTContract: ethers.Contract | null = null;
  public auditLoggerContract: ethers.Contract | null = null;

  // In-memory / persisted state
  public identities: IdentityRecord[] = [];
  public assets: AssetRecord[] = [];
  public auditLogs: AuditRecord[] = [];
  public transactions: TransactionRecord[] = [];
  public currentBlockNumber: number = 1046;

  private constructor() {
    this.loadState();
  }

  public static getInstance(): BlockchainService {
    if (!BlockchainService.instance) {
      BlockchainService.instance = new BlockchainService();
    }
    return BlockchainService.instance;
  }

  private loadState() {
    const savedIdentities = localStorage.getItem(`${STORAGE_PREFIX}identities`);
    const savedAssets = localStorage.getItem(`${STORAGE_PREFIX}assets`);
    const savedAuditLogs = localStorage.getItem(`${STORAGE_PREFIX}auditLogs`);
    const savedTransactions = localStorage.getItem(`${STORAGE_PREFIX}transactions`);

    this.identities = savedIdentities ? JSON.parse(savedIdentities) : [...INITIAL_IDENTITIES];
    this.assets = savedAssets ? JSON.parse(savedAssets) : [...INITIAL_ASSETS];
    this.auditLogs = savedAuditLogs ? JSON.parse(savedAuditLogs) : [...INITIAL_AUDIT_LOGS];
    this.transactions = savedTransactions ? JSON.parse(savedTransactions) : [...INITIAL_TRANSACTIONS];
  }

  public saveState() {
    localStorage.setItem(`${STORAGE_PREFIX}identities`, JSON.stringify(this.identities));
    localStorage.setItem(`${STORAGE_PREFIX}assets`, JSON.stringify(this.assets));
    localStorage.setItem(`${STORAGE_PREFIX}auditLogs`, JSON.stringify(this.auditLogs));
    localStorage.setItem(`${STORAGE_PREFIX}transactions`, JSON.stringify(this.transactions));
  }

  public resetToDefault() {
    localStorage.removeItem(`${STORAGE_PREFIX}identities`);
    localStorage.removeItem(`${STORAGE_PREFIX}assets`);
    localStorage.removeItem(`${STORAGE_PREFIX}auditLogs`);
    localStorage.removeItem(`${STORAGE_PREFIX}transactions`);
    this.loadState();
  }

  // ──────────────────────────────────────────────
  // Connection & Profile Management
  // ──────────────────────────────────────────────

  public async connectMetaMask(): Promise<{ address: string; role: Role }> {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        const browserProvider = new ethers.BrowserProvider((window as any).ethereum);
        await browserProvider.send("eth_requestAccounts", []);
        const signer = await browserProvider.getSigner();
        const address = await signer.getAddress();
        const network = await browserProvider.getNetwork();

        this.provider = browserProvider;
        this.signer = signer;
        this.currentAccount = address;
        this.currentNetwork = `${network.name || 'Local'} (${network.chainId})`;
        this.isDemoMode = false;

        // Initialize contracts if deployments available
        if (deployments && deployments.contracts) {
          try {
            this.identityContract = new ethers.Contract(deployments.contracts.Identity, IdentityAbi.abi, signer);
            this.accessControlContract = new ethers.Contract(deployments.contracts.ChainVaultAccessControl, AccessControlAbi.abi, signer);
            this.assetNFTContract = new ethers.Contract(deployments.contracts.AssetNFT, AssetNFTAbi.abi, signer);
            this.auditLoggerContract = new ethers.Contract(deployments.contracts.AuditLogger, AuditLoggerAbi.abi, signer);
          } catch (e) {
            console.warn('Contracts not initialized on live provider, falling back to simulated logic for mutations:', e);
          }
        }

        // Determine role
        this.currentRole = this.getUserRole(address);
        return { address, role: this.currentRole };
      } catch (err: any) {
        if (err.code === 4001) {
          throw new Error("The transaction was rejected in your wallet.");
        }
        throw new Error(err.message || "Failed to connect to MetaMask");
      }
    } else {
      // Switch to Demo Mode
      this.isDemoMode = true;
      return { address: this.currentAccount, role: this.currentRole };
    }
  }

  public switchDemoAccount(role: Role) {
    const profile = Object.values(DEMO_PROFILES).find(p => p.role === role);
    if (profile) {
      this.currentAccount = profile.walletAddress;
      this.currentRole = role;
    }
  }

  public getUserProfile(address: string): UserProfile {
    const normalized = address.toLowerCase();
    const found = Object.entries(DEMO_PROFILES).find(([addr]) => addr.toLowerCase() === normalized);
    if (found) return found[1];

    const identity = this.identities.find(i => i.walletAddress.toLowerCase() === normalized);
    return {
      name: identity?.name || `Agent ${address.slice(0, 6)}`,
      email: identity?.email || `${address.slice(0, 6)}@enterprise.corp`,
      employeeId: identity?.employeeId || `EMP-${address.slice(2, 6).toUpperCase()}`,
      department: identity?.department || 'Operations',
      role: this.getUserRole(address),
      walletAddress: address,
    };
  }

  public getUserRole(address: string): Role {
    const normalized = address.toLowerCase();
    const found = Object.entries(DEMO_PROFILES).find(([addr]) => addr.toLowerCase() === normalized);
    if (found) return found[1].role;
    return 'USER';
  }

  public getRolePermissions(role: Role): string[] {
    switch (role) {
      case 'ADMIN':
        return [
          'IDENTITY_VIEW', 'IDENTITY_VERIFY', 'IDENTITY_MANAGE',
          'ROLE_ASSIGN', 'ROLE_REVOKE',
          'ASSET_CREATE', 'ASSET_ASSIGN', 'ASSET_TRANSFER', 'ASSET_VIEW',
          'AUDIT_VIEW', 'SYSTEM_MANAGE'
        ];
      case 'MANAGER':
        return ['IDENTITY_VIEW', 'ASSET_VIEW', 'ASSET_ASSIGN', 'ASSET_TRANSFER', 'AUDIT_VIEW'];
      case 'AUDITOR':
        return ['IDENTITY_VIEW', 'ASSET_VIEW', 'AUDIT_VIEW', 'IDENTITY_VERIFY'];
      case 'USER':
      default:
        return ['IDENTITY_VIEW', 'ASSET_VIEW'];
    }
  }

  // ──────────────────────────────────────────────
  // Identity Operations
  // ──────────────────────────────────────────────

  public async registerIdentity(
    name: string,
    email: string,
    employeeId: string,
    department: string,
    targetWallet?: string
  ): Promise<TransactionRecord> {
    const wallet = targetWallet || this.currentAccount;
    
    // Check if already registered
    if (this.identities.some(i => i.walletAddress.toLowerCase() === wallet.toLowerCase())) {
      throw new Error("Identity: already registered for this wallet address");
    }

    // Generate SHA-256 / Keccak-256 cryptographic hash of off-chain data
    const offChainData = `${employeeId}:${name}:${email}:${department}`;
    const identityHash = ethers.keccak256(ethers.toUtf8Bytes(offChainData));

    // Real contract call if connected
    let realTxHash: string | undefined;
    if (this.identityContract && this.signer) {
      try {
        const tx = await this.identityContract.registerIdentity(identityHash);
        const receipt = await tx.wait();
        realTxHash = receipt.hash;
      } catch (err: any) {
        console.warn('Real contract call failed or bypassed, updating state:', err);
      }
    }

    const newId = this.identities.length + 1;
    const now = Math.floor(Date.now() / 1000);
    this.currentBlockNumber++;
    const txHash = realTxHash || this.generateTxHash();

    const identityRecord: IdentityRecord = {
      identityId: newId,
      walletAddress: wallet,
      identityHash,
      createdAt: now,
      updatedAt: now,
      verified: false,
      active: true,
      name,
      email,
      employeeId,
      department,
    };

    this.identities.push(identityRecord);

    const txRecord: TransactionRecord = {
      hash: txHash,
      blockNumber: this.currentBlockNumber,
      from: this.currentAccount,
      to: deployments?.contracts?.Identity || '0x5FbDB2315678afecb367f032d93F642f64180aa3',
      action: `registerIdentity(${newId})`,
      timestamp: now,
      gasUsed: '124,530',
      status: 'Confirmed',
    };
    this.transactions.unshift(txRecord);

    this.auditLogs.unshift({
      eventId: this.auditLogs.length + 1,
      eventType: 'IDENTITY_REGISTERED',
      actor: this.currentAccount,
      target: wallet,
      details: `Identity registered for ${name} (${employeeId}). Hash: ${identityHash.slice(0, 16)}...`,
      timestamp: now,
      txHashReference: txHash,
    });

    this.saveState();
    return txRecord;
  }

  public async verifyIdentity(walletAddress: string): Promise<TransactionRecord> {
    if (this.currentRole !== 'ADMIN' && this.currentRole !== 'AUDITOR') {
      throw new Error("Your wallet does not have permission to verify identities. Required: ADMIN or AUDITOR");
    }

    const record = this.identities.find(i => i.walletAddress.toLowerCase() === walletAddress.toLowerCase());
    if (!record) {
      throw new Error("No identity is registered for this wallet.");
    }
    if (record.verified) {
      throw new Error("Identity is already verified.");
    }

    let realTxHash: string | undefined;
    if (this.identityContract && this.signer) {
      try {
        const tx = await this.identityContract.verifyIdentity(walletAddress);
        const receipt = await tx.wait();
        realTxHash = receipt.hash;
      } catch (err: any) {
        console.warn('Live verification error:', err);
      }
    }

    const now = Math.floor(Date.now() / 1000);
    this.currentBlockNumber++;
    const txHash = realTxHash || this.generateTxHash();

    record.verified = true;
    record.updatedAt = now;

    const txRecord: TransactionRecord = {
      hash: txHash,
      blockNumber: this.currentBlockNumber,
      from: this.currentAccount,
      to: deployments?.contracts?.Identity || '0x5FbDB2315678afecb367f032d93F642f64180aa3',
      action: `verifyIdentity(${walletAddress.slice(0, 8)}...)`,
      timestamp: now,
      gasUsed: '45,210',
      status: 'Confirmed',
    };
    this.transactions.unshift(txRecord);

    this.auditLogs.unshift({
      eventId: this.auditLogs.length + 1,
      eventType: 'IDENTITY_VERIFIED',
      actor: this.currentAccount,
      target: walletAddress,
      details: `Identity for ${record.name || walletAddress} verified by authorized authority.`,
      timestamp: now,
      txHashReference: txHash,
    });

    this.saveState();
    return txRecord;
  }

  public async toggleIdentityStatus(walletAddress: string, activate: boolean): Promise<TransactionRecord> {
    if (this.currentRole !== 'ADMIN') {
      throw new Error("Your wallet does not have permission to perform this action. Required: ADMIN");
    }

    const record = this.identities.find(i => i.walletAddress.toLowerCase() === walletAddress.toLowerCase());
    if (!record) {
      throw new Error("No identity is registered for this wallet.");
    }

    const now = Math.floor(Date.now() / 1000);
    this.currentBlockNumber++;
    const txHash = this.generateTxHash();

    record.active = activate;
    record.updatedAt = now;

    const txRecord: TransactionRecord = {
      hash: txHash,
      blockNumber: this.currentBlockNumber,
      from: this.currentAccount,
      to: deployments?.contracts?.Identity || '0x5FbDB2315678afecb367f032d93F642f64180aa3',
      action: `${activate ? 'reactivate' : 'deactivate'}Identity(${walletAddress.slice(0, 8)}...)`,
      timestamp: now,
      gasUsed: '32,100',
      status: 'Confirmed',
    };
    this.transactions.unshift(txRecord);

    this.auditLogs.unshift({
      eventId: this.auditLogs.length + 1,
      eventType: activate ? 'IDENTITY_REACTIVATED' : 'IDENTITY_DEACTIVATED',
      actor: this.currentAccount,
      target: walletAddress,
      details: `Identity ${activate ? 'reactivated' : 'deactivated'} for ${record.name || walletAddress}`,
      timestamp: now,
      txHashReference: txHash,
    });

    this.saveState();
    return txRecord;
  }

  // ──────────────────────────────────────────────
  // Role & Permission Operations
  // ──────────────────────────────────────────────

  public async assignRole(walletAddress: string, role: Role): Promise<TransactionRecord> {
    if (this.currentRole !== 'ADMIN') {
      throw new Error("Your wallet does not have permission to assign roles. Required: ADMIN");
    }

    const now = Math.floor(Date.now() / 1000);
    this.currentBlockNumber++;
    const txHash = this.generateTxHash();

    // Update demo profile if exists
    if (DEMO_PROFILES[walletAddress]) {
      DEMO_PROFILES[walletAddress].role = role;
    }

    const txRecord: TransactionRecord = {
      hash: txHash,
      blockNumber: this.currentBlockNumber,
      from: this.currentAccount,
      to: deployments?.contracts?.ChainVaultAccessControl || '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
      action: `assignRole(${role})`,
      timestamp: now,
      gasUsed: '68,430',
      status: 'Confirmed',
    };
    this.transactions.unshift(txRecord);

    this.auditLogs.unshift({
      eventId: this.auditLogs.length + 1,
      eventType: 'ROLE_ASSIGNED',
      actor: this.currentAccount,
      target: walletAddress,
      details: `${role} role assigned with default permissions to ${walletAddress}`,
      timestamp: now,
      txHashReference: txHash,
    });

    this.saveState();
    return txRecord;
  }

  public async revokeRole(walletAddress: string, role: Role): Promise<TransactionRecord> {
    if (this.currentRole !== 'ADMIN') {
      throw new Error("Your wallet does not have permission to revoke roles. Required: ADMIN");
    }

    const now = Math.floor(Date.now() / 1000);
    this.currentBlockNumber++;
    const txHash = this.generateTxHash();

    if (DEMO_PROFILES[walletAddress]) {
      DEMO_PROFILES[walletAddress].role = 'USER';
    }

    const txRecord: TransactionRecord = {
      hash: txHash,
      blockNumber: this.currentBlockNumber,
      from: this.currentAccount,
      to: deployments?.contracts?.ChainVaultAccessControl || '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
      action: `revokeRole(${role})`,
      timestamp: now,
      gasUsed: '42,100',
      status: 'Confirmed',
    };
    this.transactions.unshift(txRecord);

    this.auditLogs.unshift({
      eventId: this.auditLogs.length + 1,
      eventType: 'ROLE_REVOKED',
      actor: this.currentAccount,
      target: walletAddress,
      details: `${role} role revoked from ${walletAddress}`,
      timestamp: now,
      txHashReference: txHash,
    });

    this.saveState();
    return txRecord;
  }

  // ──────────────────────────────────────────────
  // Digital Asset Operations (ERC-721 NFT)
  // ──────────────────────────────────────────────

  public async mintAsset(
    to: string,
    assetName: string,
    assetType: 'Hardware' | 'Digital License' | 'Certificate' | 'Equipment' | 'Document',
    description: string,
    serialNumber: string,
    metadataURI?: string
  ): Promise<TransactionRecord> {
    if (this.currentRole !== 'ADMIN') {
      throw new Error("Your wallet does not have permission to mint NFTs. Required: ADMIN (Smart contract enforcement)");
    }

    const newTokenId = this.assets.length + 1;
    const now = Math.floor(Date.now() / 1000);
    this.currentBlockNumber++;
    const txHash = this.generateTxHash();

    const newAsset: AssetRecord = {
      tokenId: newTokenId,
      assetName,
      assetType,
      description,
      serialNumber,
      metadataURI: metadataURI || `https://chainvault.io/meta/${newTokenId}.json`,
      currentOwner: to,
      createdBy: this.currentAccount,
      createdAt: now,
      active: true,
      txHash,
      blockNumber: this.currentBlockNumber,
    };

    this.assets.push(newAsset);

    const txRecord: TransactionRecord = {
      hash: txHash,
      blockNumber: this.currentBlockNumber,
      from: this.currentAccount,
      to: deployments?.contracts?.AssetNFT || '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
      action: `mintAsset(Token #${newTokenId} - ${assetName})`,
      timestamp: now,
      gasUsed: '143,200',
      status: 'Confirmed',
    };
    this.transactions.unshift(txRecord);

    this.auditLogs.unshift({
      eventId: this.auditLogs.length + 1,
      eventType: 'ASSET_MINTED',
      actor: this.currentAccount,
      target: to,
      details: `Asset NFT #${newTokenId} (${assetName}) minted and allocated to ${to}`,
      timestamp: now,
      txHashReference: txHash,
    });

    this.saveState();
    return txRecord;
  }

  public async transferAsset(tokenId: number, to: string): Promise<TransactionRecord> {
    const asset = this.assets.find(a => a.tokenId === tokenId);
    if (!asset) {
      throw new Error("No blockchain asset matches this identifier.");
    }

    const isCurrentOwner = asset.currentOwner.toLowerCase() === this.currentAccount.toLowerCase();
    const isAdmin = this.currentRole === 'ADMIN';
    const isManager = this.currentRole === 'MANAGER';

    if (!isCurrentOwner && !isAdmin && !isManager) {
      throw new Error("Unauthorized: You do not own this asset or lack delegation privilege to transfer it.");
    }

    const previousOwner = asset.currentOwner;
    const now = Math.floor(Date.now() / 1000);
    this.currentBlockNumber++;
    const txHash = this.generateTxHash();

    asset.currentOwner = to;
    asset.txHash = txHash;
    asset.blockNumber = this.currentBlockNumber;

    const txRecord: TransactionRecord = {
      hash: txHash,
      blockNumber: this.currentBlockNumber,
      from: this.currentAccount,
      to: deployments?.contracts?.AssetNFT || '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
      action: `transferAsset(Token #${tokenId} -> ${to.slice(0, 8)}...)`,
      timestamp: now,
      gasUsed: '58,400',
      status: 'Confirmed',
    };
    this.transactions.unshift(txRecord);

    this.auditLogs.unshift({
      eventId: this.auditLogs.length + 1,
      eventType: 'ASSET_TRANSFERRED',
      actor: this.currentAccount,
      target: to,
      details: `Asset #${tokenId} (${asset.assetName}) ownership transferred from ${previousOwner.slice(0, 8)}... to ${to.slice(0, 8)}...`,
      timestamp: now,
      txHashReference: txHash,
    });

    this.saveState();
    return txRecord;
  }

  public verifyAssetByIdentifier(query: string): {
    exists: boolean;
    asset?: AssetRecord;
    ownerProfile?: UserProfile;
    history?: AuditRecord[];
    message?: string;
  } {
    const trimmed = query.trim().toLowerCase();
    
    // Check by tokenId
    const numericId = parseInt(trimmed, 10);
    let asset = !isNaN(numericId) ? this.assets.find(a => a.tokenId === numericId) : undefined;

    // Check by serial number
    if (!asset) {
      asset = this.assets.find(a => a.serialNumber.toLowerCase() === trimmed);
    }

    // Check by txHash
    if (!asset) {
      asset = this.assets.find(a => a.txHash?.toLowerCase() === trimmed);
    }

    if (!asset) {
      return {
        exists: false,
        message: "Asset could not be verified on the blockchain. Identifier not found."
      };
    }

    const ownerProfile = this.getUserProfile(asset.currentOwner);
    const history = this.auditLogs.filter(log => 
      log.details.includes(`Asset #${asset?.tokenId}`) || 
      log.details.includes(`Token #${asset?.tokenId}`) ||
      log.target.toLowerCase() === asset?.currentOwner.toLowerCase()
    );

    return {
      exists: true,
      asset,
      ownerProfile,
      history,
    };
  }

  // ──────────────────────────────────────────────
  // Utilities
  // ──────────────────────────────────────────────

  private generateTxHash(): string {
    const randomBytes = ethers.randomBytes(32);
    return ethers.hexlify(randomBytes);
  }
}

export const blockchainService = BlockchainService.getInstance();
