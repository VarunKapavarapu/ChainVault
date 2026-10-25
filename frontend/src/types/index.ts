export type Role = 'ADMIN' | 'MANAGER' | 'AUDITOR' | 'USER';

export interface IdentityRecord {
  identityId: number;
  walletAddress: string;
  identityHash: string;
  createdAt: number;
  updatedAt: number;
  verified: boolean;
  active: boolean;
  // Off-chain metadata for presentation (kept off-chain!)
  name?: string;
  email?: string;
  employeeId?: string;
  department?: string;
}

export interface AssetRecord {
  tokenId: number;
  assetName: string;
  assetType: 'Hardware' | 'Digital License' | 'Certificate' | 'Equipment' | 'Document';
  description: string;
  serialNumber: string;
  metadataURI: string;
  currentOwner: string;
  createdBy: string;
  createdAt: number;
  active: boolean;
  txHash?: string;
  blockNumber?: number;
}

export interface AuditRecord {
  eventId: number;
  eventType: 'IDENTITY_REGISTERED' | 'IDENTITY_VERIFIED' | 'IDENTITY_DEACTIVATED' | 'IDENTITY_REACTIVATED' | 'ROLE_ASSIGNED' | 'ROLE_REVOKED' | 'PERMISSION_GRANTED' | 'PERMISSION_REVOKED' | 'ASSET_MINTED' | 'ASSET_ASSIGNED' | 'ASSET_TRANSFERRED' | 'ASSET_DEACTIVATED';
  actor: string;
  target: string;
  details: string;
  timestamp: number;
  txHashReference: string;
}

export interface TransactionRecord {
  hash: string;
  blockNumber: number;
  from: string;
  to: string;
  action: string;
  timestamp: number;
  gasUsed: string;
  status: 'Confirmed' | 'Pending' | 'Failed';
}

export interface UserProfile {
  name: string;
  email: string;
  employeeId: string;
  department: string;
  role: Role;
  walletAddress: string;
  avatarUrl?: string;
}

export type TxStep = 'idle' | 'preparing' | 'wallet_signature' | 'confirming' | 'confirmed' | 'failed';

export interface TxStatus {
  step: TxStep;
  title: string;
  message: string;
  txHash?: string;
  blockNumber?: number;
  error?: string;
}
