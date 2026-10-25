import React, { useState } from 'react';
import { 
  Users, ShieldCheck, Box, Key, Plus, Check, X, ShieldAlert,
  Search, RefreshCw, Send, ArrowRight, Layers, Lock, AlertCircle, FileText
} from 'lucide-react';
import { blockchainService } from '../../services/blockchain';
import { IdentityRecord, AssetRecord, Role, TxStatus } from '../../types';

interface AdminDashboardProps {
  onExecuteTx: (actionFn: () => Promise<any>, title: string, initialMsg: string) => Promise<void>;
  walletAddress: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onExecuteTx, walletAddress }) => {
  const [identities, setIdentities] = useState<IdentityRecord[]>(blockchainService.identities);
  const [assets, setAssets] = useState<AssetRecord[]>(blockchainService.assets);

  // Modals & forms
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showMintModal, setShowMintModal] = useState(false);
  const [showAssignRoleModal, setShowAssignRoleModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedAssetForTransfer, setSelectedAssetForTransfer] = useState<AssetRecord | null>(null);

  // Register identity form state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newEmpId, setNewEmpId] = useState('');
  const [newDept, setNewDept] = useState('');
  const [newWallet, setNewWallet] = useState('');

  // Mint asset form state
  const [assetName, setAssetName] = useState('');
  const [assetType, setAssetType] = useState<AssetRecord['assetType']>('Hardware');
  const [assetDesc, setAssetDesc] = useState('');
  const [assetSerial, setAssetSerial] = useState('');
  const [assetRecipient, setAssetRecipient] = useState('');

  // Role assignment state
  const [roleWallet, setRoleWallet] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role>('MANAGER');

  // Transfer state
  const [transferRecipient, setTransferRecipient] = useState('');

  // Search & tab state
  const [activeTab, setActiveTab] = useState<'overview' | 'identities' | 'roles' | 'assets' | 'matrix'>('overview');
  const [identitySearch, setIdentitySearch] = useState('');
  const [assetSearch, setAssetSearch] = useState('');

  const refreshState = () => {
    setIdentities([...blockchainService.identities]);
    setAssets([...blockchainService.assets]);
  };

  // Handlers
  const handleRegisterIdentity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail || !newEmpId || !newWallet) return;

    await onExecuteTx(
      () => blockchainService.registerIdentity(newName, newEmail, newEmpId, newDept || 'Engineering', newWallet),
      `Register Identity for ${newName}`,
      "Generating Keccak-256 hash and committing cryptographic reference to Identity.sol..."
    );

    setShowRegisterModal(false);
    setNewName('');
    setNewEmail('');
    setNewEmpId('');
    setNewDept('');
    setNewWallet('');
    refreshState();
  };

  const handleVerifyIdentity = async (targetWallet: string, name: string) => {
    await onExecuteTx(
      () => blockchainService.verifyIdentity(targetWallet),
      `Verify Identity: ${name}`,
      "Invoking verifyIdentity() on-chain with authorized administrator signature..."
    );
    refreshState();
  };

  const handleToggleActive = async (targetWallet: string, currentActive: boolean) => {
    const action = currentActive ? 'Deactivate' : 'Reactivate';
    await onExecuteTx(
      () => blockchainService.toggleIdentityStatus(targetWallet, !currentActive),
      `${action} Identity`,
      `Updating identity status flag in Identity.sol contract...`
    );
    refreshState();
  };

  const handleAssignRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleWallet) return;

    await onExecuteTx(
      () => blockchainService.assignRole(roleWallet, selectedRole),
      `Assign ${selectedRole} Role`,
      `Granting on-chain ${selectedRole} role and registering default permission matrix in AccessControl.sol...`
    );

    setShowAssignRoleModal(false);
    setRoleWallet('');
    refreshState();
  };

  const handleMintAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetName || !assetSerial || !assetRecipient) return;

    await onExecuteTx(
      () => blockchainService.mintAsset(assetRecipient, assetName, assetType, assetDesc, assetSerial),
      `Mint Asset NFT: ${assetName}`,
      "Minting ERC-721 token via AssetNFT.sol and recording immutable provenance into AuditLogger.sol..."
    );

    setShowMintModal(false);
    setAssetName('');
    setAssetDesc('');
    setAssetSerial('');
    setAssetRecipient('');
    refreshState();
  };

  const handleTransferAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssetForTransfer || !transferRecipient) return;

    await onExecuteTx(
      () => blockchainService.transferAsset(selectedAssetForTransfer.tokenId, transferRecipient),
      `Transfer Asset #${selectedAssetForTransfer.tokenId}`,
      `Executing ERC-721 safeTransferFrom() on blockchain to update custodian...`
    );

    setShowTransferModal(false);
    setSelectedAssetForTransfer(null);
    setTransferRecipient('');
    refreshState();
  };

  // Metrics
  const totalIdentities = identities.length;
  const verifiedCount = identities.filter(i => i.verified).length;
  const totalAssets = assets.length;
  const activeAssets = assets.filter(a => a.active).length;

  return (
    <div className="space-y-8">
      {/* Top Banner & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyber-rose/20 bg-cyber-rose/10 px-3 py-1 text-xs font-mono text-cyber-rose mb-2">
            <Lock className="h-3.5 w-3.5" /> ROOT ADMINISTRATOR CONSOLE
          </div>
          <h1 className="font-display text-3xl font-extrabold text-white tracking-tight">
            Security Governance & Asset Management
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Smart-contract-enforced administrative powers: Identity verification, role assignments, NFT minting, and system monitoring.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowRegisterModal(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-vault-800 hover:bg-vault-700 border border-vault-700 px-3.5 py-2 text-xs font-semibold text-slate-200 transition-colors"
          >
            <Plus className="h-4 w-4 text-cyber-cyan" /> New Identity
          </button>
          <button
            onClick={() => setShowMintModal(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-cyber-cyan hover:bg-sky-300 px-4 py-2 text-xs font-semibold text-vault-950 transition-colors shadow-lg shadow-cyber-cyan/10"
          >
            <Plus className="h-4 w-4" /> Mint Asset NFT
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
        <div className="rounded-2xl border border-vault-700 bg-vault-900/80 p-5">
          <div className="text-slate-400 mb-1 flex items-center justify-between">
            <span>TOTAL IDENTITIES</span>
            <Users className="h-4 w-4 text-cyber-cyan" />
          </div>
          <div className="text-2xl font-bold text-white">{totalIdentities}</div>
          <div className="text-[10px] text-cyber-cyan mt-1">{verifiedCount} Verified on-chain</div>
        </div>

        <div className="rounded-2xl border border-vault-700 bg-vault-900/80 p-5">
          <div className="text-slate-400 mb-1 flex items-center justify-between">
            <span>DIGITAL ASSETS (NFT)</span>
            <Box className="h-4 w-4 text-cyber-emerald" />
          </div>
          <div className="text-2xl font-bold text-cyber-emerald">{totalAssets}</div>
          <div className="text-[10px] text-slate-400 mt-1">{activeAssets} active inventory items</div>
        </div>

        <div className="rounded-2xl border border-vault-700 bg-vault-900/80 p-5">
          <div className="text-slate-400 mb-1 flex items-center justify-between">
            <span>ON-CHAIN ROLES</span>
            <Key className="h-4 w-4 text-cyber-indigo" />
          </div>
          <div className="text-2xl font-bold text-white">4 Distinct</div>
          <div className="text-[10px] text-cyber-indigo mt-1">11 Granular permissions</div>
        </div>

        <div className="rounded-2xl border border-vault-700 bg-vault-900/80 p-5">
          <div className="text-slate-400 mb-1 flex items-center justify-between">
            <span>AUDIT LEDGER</span>
            <ShieldCheck className="h-4 w-4 text-cyber-amber" />
          </div>
          <div className="text-2xl font-bold text-white">{blockchainService.auditLogs.length}</div>
          <div className="text-[10px] text-slate-400 mt-1">Tamper-evident events</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-vault-800 text-xs font-semibold text-slate-400 gap-4 overflow-x-auto whitespace-nowrap scrollbar-none pb-px">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 shrink-0 transition-colors ${activeTab === 'overview' ? 'border-b-2 border-cyber-cyan text-white' : 'hover:text-slate-200'}`}
        >
          Identities & Verification ({identities.length})
        </button>
        <button
          onClick={() => setActiveTab('assets')}
          className={`pb-3 shrink-0 transition-colors ${activeTab === 'assets' ? 'border-b-2 border-cyber-cyan text-white' : 'hover:text-slate-200'}`}
        >
          Asset Inventory & Minting ({assets.length})
        </button>
        <button
          onClick={() => setActiveTab('matrix')}
          className={`pb-3 shrink-0 transition-colors ${activeTab === 'matrix' ? 'border-b-2 border-cyber-cyan text-white' : 'hover:text-slate-200'}`}
        >
          RBAC Permission Matrix
        </button>
      </div>

      {/* TAB 1: IDENTITIES */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative w-72">
              <Search className="h-3.5 w-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={identitySearch}
                onChange={(e) => setIdentitySearch(e.target.value)}
                placeholder="Search identity by name or wallet..."
                className="w-full rounded-xl border border-vault-700 bg-vault-900/80 pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyber-cyan font-mono"
              />
            </div>
            <button
              onClick={() => setShowAssignRoleModal(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-vault-800 hover:bg-vault-700 border border-vault-700 px-3 py-1.5 text-xs font-semibold text-slate-200"
            >
              <Key className="h-3.5 w-3.5 text-cyber-indigo" /> Assign Stakeholder Role
            </button>
          </div>

          <div className="rounded-2xl border border-vault-700 bg-vault-900/80 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead className="border-b border-vault-800 bg-vault-950/60 text-[11px] text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3">Identity / Employee</th>
                    <th className="px-5 py-3">Wallet Address</th>
                    <th className="px-5 py-3">Cryptographic Hash</th>
                    <th className="px-5 py-3">Role</th>
                    <th className="px-5 py-3">Verification</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-vault-800 text-slate-300">
                  {identities
                    .filter(
                      i =>
                        identitySearch === '' ||
                        i.name?.toLowerCase().includes(identitySearch.toLowerCase()) ||
                        i.walletAddress.toLowerCase().includes(identitySearch.toLowerCase()) ||
                        i.employeeId?.toLowerCase().includes(identitySearch.toLowerCase())
                    )
                    .map((item) => {
                      const userRole = blockchainService.getUserRole(item.walletAddress);
                      return (
                        <tr key={item.identityId} className="hover:bg-vault-800/40 transition-colors">
                          <td className="px-5 py-3.5 font-sans">
                            <div className="font-semibold text-white">{item.name || 'External Signer'}</div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              {item.employeeId} &bull; {item.department}
                            </div>
                          </td>
                          <td className="px-5 py-3.5 select-all">
                            {item.walletAddress.slice(0, 8)}...{item.walletAddress.slice(-4)}
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="text-[10px] text-slate-400 truncate block max-w-[140px] select-all bg-vault-950 p-1 rounded border border-vault-800">
                              {item.identityHash.slice(0, 16)}...
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${userRole === 'ADMIN' ? 'bg-cyber-rose/20 text-cyber-rose' : userRole === 'MANAGER' ? 'bg-cyber-amber/20 text-cyber-amber' : userRole === 'AUDITOR' ? 'bg-cyber-cyan/20 text-cyber-cyan' : 'bg-slate-800 text-slate-300'}`}>
                              {userRole}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            {item.verified ? (
                              <span className="inline-flex items-center gap-1 text-[11px] text-cyber-emerald font-semibold">
                                <Check className="h-3 w-3" /> Verified
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] text-cyber-amber">
                                Pending Verification
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-3.5 text-right space-x-2">
                            {!item.verified && (
                              <button
                                onClick={() => handleVerifyIdentity(item.walletAddress, item.name || 'User')}
                                className="rounded bg-cyber-cyan/10 hover:bg-cyber-cyan/20 border border-cyber-cyan/30 px-2 py-1 text-[10px] font-semibold text-cyber-cyan transition-colors"
                              >
                                Verify
                              </button>
                            )}
                            <button
                              onClick={() => handleToggleActive(item.walletAddress, item.active)}
                              className={`rounded px-2 py-1 text-[10px] font-semibold border transition-colors ${item.active ? 'border-vault-700 bg-vault-950 text-slate-400 hover:text-cyber-rose hover:border-cyber-rose/40' : 'border-cyber-emerald/30 bg-cyber-emerald/10 text-cyber-emerald'}`}
                            >
                              {item.active ? 'Deactivate' : 'Reactivate'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ASSETS */}
      {activeTab === 'assets' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative w-72">
              <Search className="h-3.5 w-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={assetSearch}
                onChange={(e) => setAssetSearch(e.target.value)}
                placeholder="Search asset name, token ID or serial..."
                className="w-full rounded-xl border border-vault-700 bg-vault-900/80 pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyber-cyan font-mono"
              />
            </div>
            <button
              onClick={() => setShowMintModal(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-cyber-cyan hover:bg-sky-300 px-3 py-1.5 text-xs font-semibold text-vault-950 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" /> Mint Asset NFT
            </button>
          </div>

          <div className="rounded-2xl border border-vault-700 bg-vault-900/80 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead className="border-b border-vault-800 bg-vault-950/60 text-[11px] text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3">Token #</th>
                    <th className="px-5 py-3">Asset Name & Type</th>
                    <th className="px-5 py-3">Serial Reference</th>
                    <th className="px-5 py-3">Current Custodian</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-vault-800 text-slate-300">
                  {assets
                    .filter(
                      a =>
                        assetSearch === '' ||
                        a.assetName.toLowerCase().includes(assetSearch.toLowerCase()) ||
                        a.serialNumber.toLowerCase().includes(assetSearch.toLowerCase()) ||
                        a.tokenId.toString() === assetSearch
                    )
                    .map((item) => {
                      const ownerProfile = blockchainService.getUserProfile(item.currentOwner);
                      return (
                        <tr key={item.tokenId} className="hover:bg-vault-800/40 transition-colors">
                          <td className="px-5 py-3.5 font-bold text-white">
                            #{item.tokenId}
                          </td>
                          <td className="px-5 py-3.5 font-sans">
                            <div className="font-semibold text-white">{item.assetName}</div>
                            <div className="text-[11px] text-slate-400 font-mono">{item.assetType}</div>
                          </td>
                          <td className="px-5 py-3.5 text-cyber-cyan select-all">
                            {item.serialNumber}
                          </td>
                          <td className="px-5 py-3.5 font-sans">
                            <div className="font-medium text-white">{ownerProfile.name}</div>
                            <div className="text-[10px] font-mono text-slate-400">
                              {item.currentOwner.slice(0, 8)}...{item.currentOwner.slice(-4)}
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="inline-flex items-center gap-1 rounded bg-cyber-emerald/10 border border-cyber-emerald/20 px-2 py-0.5 text-[10px] font-bold text-cyber-emerald">
                              Active
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <button
                              onClick={() => {
                                setSelectedAssetForTransfer(item);
                                setShowTransferModal(true);
                              }}
                              className="rounded bg-vault-800 hover:bg-vault-700 border border-vault-700 px-2.5 py-1 text-[10px] font-semibold text-slate-200 transition-colors"
                            >
                              Transfer / Reassign
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PERMISSION MATRIX */}
      {activeTab === 'matrix' && (
        <div className="rounded-2xl border border-vault-700 bg-vault-900/80 p-6 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">On-Chain Role & Permission Matrix</h3>
            <p className="text-xs text-slate-400">
              The smart contract <code className="text-cyber-cyan">ChainVaultAccessControl.sol</code> enforces these permissions at execution time.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="border-b border-vault-800 bg-vault-950 text-slate-400 text-[11px]">
                <tr>
                  <th className="px-4 py-3">Permission Identifier</th>
                  <th className="px-4 py-3 text-center text-cyber-rose">ADMIN</th>
                  <th className="px-4 py-3 text-center text-cyber-amber">MANAGER</th>
                  <th className="px-4 py-3 text-center text-cyber-cyan">AUDITOR</th>
                  <th className="px-4 py-3 text-center text-slate-300">USER</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-vault-800 text-slate-300">
                {[
                  { name: 'IDENTITY_VIEW', desc: 'Read registered identity records', admin: true, manager: true, auditor: true, user: true },
                  { name: 'IDENTITY_VERIFY', desc: 'Authorize and verify employee identities', admin: true, manager: false, auditor: true, user: false },
                  { name: 'IDENTITY_MANAGE', desc: 'Deactivate, reactivate, or update hash', admin: true, manager: false, auditor: false, user: false },
                  { name: 'ROLE_ASSIGN', desc: 'Grant system roles to wallet addresses', admin: true, manager: false, auditor: false, user: false },
                  { name: 'ROLE_REVOKE', desc: 'Revoke assigned roles from accounts', admin: true, manager: false, auditor: false, user: false },
                  { name: 'ASSET_CREATE', desc: 'Mint new ERC-721 digital asset tokens', admin: true, manager: false, auditor: false, user: false },
                  { name: 'ASSET_ASSIGN', desc: 'Allocate enterprise assets to identities', admin: true, manager: true, auditor: false, user: false },
                  { name: 'ASSET_TRANSFER', desc: 'Transfer asset custody to another party', admin: true, manager: true, auditor: false, user: true },
                  { name: 'ASSET_VIEW', desc: 'Query asset details and custody status', admin: true, manager: true, auditor: true, user: true },
                  { name: 'AUDIT_VIEW', desc: 'Inspect chronological security audit ledger', admin: true, manager: true, auditor: true, user: false },
                  { name: 'SYSTEM_MANAGE', desc: 'Administer authorization rules and pause', admin: true, manager: false, auditor: false, user: false },
                ].map((perm) => (
                  <tr key={perm.name} className="hover:bg-vault-800/30">
                    <td className="px-4 py-2.5">
                      <div className="font-bold text-white">{perm.name}</div>
                      <div className="text-[10px] text-slate-500 font-sans">{perm.desc}</div>
                    </td>
                    <td className="px-4 py-2.5 text-center">{perm.admin ? <Check className="h-4 w-4 text-cyber-rose mx-auto" /> : <span className="text-slate-700">&times;</span>}</td>
                    <td className="px-4 py-2.5 text-center">{perm.manager ? <Check className="h-4 w-4 text-cyber-amber mx-auto" /> : <span className="text-slate-700">&times;</span>}</td>
                    <td className="px-4 py-2.5 text-center">{perm.auditor ? <Check className="h-4 w-4 text-cyber-cyan mx-auto" /> : <span className="text-slate-700">&times;</span>}</td>
                    <td className="px-4 py-2.5 text-center">{perm.user ? <Check className="h-4 w-4 text-slate-300 mx-auto" /> : <span className="text-slate-700">&times;</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODALS
      ───────────────────────────────────────────────────────────── */}
      
      {/* 1. Register Identity Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl border border-vault-700 bg-vault-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-vault-800">
              <h3 className="text-lg font-bold text-white">Register Decentralized Identity</h3>
              <button onClick={() => setShowRegisterModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterIdentity} className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-slate-400 block mb-1">EMPLOYEE NAME</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Patel"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full rounded-xl border border-vault-700 bg-vault-950 p-2.5 text-white focus:outline-none focus:border-cyber-cyan"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">EMPLOYEE ID</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. EMP-005"
                    value={newEmpId}
                    onChange={(e) => setNewEmpId(e.target.value)}
                    className="w-full rounded-xl border border-vault-700 bg-vault-950 p-2.5 text-white focus:outline-none focus:border-cyber-cyan"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">DEPARTMENT</label>
                  <input
                    type="text"
                    placeholder="e.g. DevOps & Cloud"
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full rounded-xl border border-vault-700 bg-vault-950 p-2.5 text-white focus:outline-none focus:border-cyber-cyan"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">OFFICIAL EMAIL</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. vikram.patel@enterprise.corp"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full rounded-xl border border-vault-700 bg-vault-950 p-2.5 text-white focus:outline-none focus:border-cyber-cyan"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">ETHEREUM WALLET ADDRESS</label>
                <input
                  type="text"
                  required
                  placeholder="0x..."
                  value={newWallet}
                  onChange={(e) => setNewWallet(e.target.value)}
                  className="w-full rounded-xl border border-vault-700 bg-vault-950 p-2.5 text-white focus:outline-none focus:border-cyber-cyan"
                />
              </div>

              <div className="p-3 rounded-xl bg-vault-950 border border-vault-800 text-[11px] text-slate-400 leading-relaxed font-sans">
                <strong className="text-slate-300">Privacy Notice:</strong> These credentials will be hashed using Keccak-256 off-chain. Only the resulting cryptographic hash will be stored on the blockchain.
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="flex-1 rounded-xl bg-vault-800 p-2.5 font-semibold text-slate-300 hover:bg-vault-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-cyber-cyan p-2.5 font-semibold text-vault-950 hover:bg-sky-300 shadow-md"
                >
                  Register on Blockchain
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Mint Asset NFT Modal */}
      {showMintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl border border-vault-700 bg-vault-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-vault-800">
              <h3 className="text-lg font-bold text-white">Mint ERC-721 Digital Asset NFT</h3>
              <button onClick={() => setShowMintModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleMintAsset} className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-slate-400 block mb-1">ASSET NAME</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dell Precision 7680 Workstation"
                  value={assetName}
                  onChange={(e) => setAssetName(e.target.value)}
                  className="w-full rounded-xl border border-vault-700 bg-vault-950 p-2.5 text-white focus:outline-none focus:border-cyber-cyan"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">ASSET TYPE</label>
                  <select
                    value={assetType}
                    onChange={(e) => setAssetType(e.target.value as any)}
                    className="w-full rounded-xl border border-vault-700 bg-vault-950 p-2.5 text-white focus:outline-none focus:border-cyber-cyan"
                  >
                    <option value="Hardware">Hardware</option>
                    <option value="Digital License">Digital License</option>
                    <option value="Certificate">Certificate</option>
                    <option value="Equipment">Equipment</option>
                    <option value="Document">Document</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">SERIAL / REFERENCE #</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SN-DELL-2026-99"
                    value={assetSerial}
                    onChange={(e) => setAssetSerial(e.target.value)}
                    className="w-full rounded-xl border border-vault-700 bg-vault-950 p-2.5 text-white focus:outline-none focus:border-cyber-cyan"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">INITIAL RECIPIENT WALLET</label>
                <input
                  type="text"
                  required
                  placeholder="0x..."
                  value={assetRecipient}
                  onChange={(e) => setAssetRecipient(e.target.value)}
                  className="w-full rounded-xl border border-vault-700 bg-vault-950 p-2.5 text-white focus:outline-none focus:border-cyber-cyan"
                />
                <div className="flex gap-2 mt-1.5">
                  {identities.slice(0, 3).map(i => (
                    <button
                      type="button"
                      key={i.walletAddress}
                      onClick={() => setAssetRecipient(i.walletAddress)}
                      className="text-[10px] text-cyber-cyan hover:underline"
                    >
                      {i.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">DESCRIPTION</label>
                <textarea
                  rows={2}
                  placeholder="Technical hardware specifications or license terms..."
                  value={assetDesc}
                  onChange={(e) => setAssetDesc(e.target.value)}
                  className="w-full rounded-xl border border-vault-700 bg-vault-950 p-2.5 text-white focus:outline-none focus:border-cyber-cyan"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowMintModal(false)}
                  className="flex-1 rounded-xl bg-vault-800 p-2.5 font-semibold text-slate-300 hover:bg-vault-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-cyber-cyan p-2.5 font-semibold text-vault-950 hover:bg-sky-300 shadow-md"
                >
                  Mint NFT on Blockchain
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Assign Role Modal */}
      {showAssignRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border border-vault-700 bg-vault-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-vault-800">
              <h3 className="text-lg font-bold text-white">Assign On-Chain Role</h3>
              <button onClick={() => setShowAssignRoleModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAssignRole} className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-slate-400 block mb-1">SELECT STAKEHOLDER WALLET</label>
                <select
                  value={roleWallet}
                  onChange={(e) => setRoleWallet(e.target.value)}
                  className="w-full rounded-xl border border-vault-700 bg-vault-950 p-2.5 text-white focus:outline-none focus:border-cyber-cyan"
                >
                  <option value="">Choose an employee...</option>
                  {identities.map((id) => (
                    <option key={id.walletAddress} value={id.walletAddress}>
                      {id.name} ({id.employeeId}) &bull; {id.walletAddress.slice(0, 8)}...
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">ROLE LEVEL</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as Role)}
                  className="w-full rounded-xl border border-vault-700 bg-vault-950 p-2.5 text-white focus:outline-none focus:border-cyber-cyan"
                >
                  <option value="ADMIN">ADMIN (Full Governance)</option>
                  <option value="MANAGER">MANAGER (Asset Allocation)</option>
                  <option value="AUDITOR">AUDITOR (Read-Only Inspection)</option>
                  <option value="USER">USER (Standard Employee)</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAssignRoleModal(false)}
                  className="flex-1 rounded-xl bg-vault-800 p-2.5 font-semibold text-slate-300 hover:bg-vault-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-cyber-cyan p-2.5 font-semibold text-vault-950 hover:bg-sky-300 shadow-md"
                >
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Transfer Asset Modal */}
      {showTransferModal && selectedAssetForTransfer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border border-vault-700 bg-vault-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-vault-800">
              <h3 className="text-lg font-bold text-white">Transfer Asset Custody</h3>
              <button onClick={() => setShowTransferModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-vault-950 border border-vault-800 text-xs font-mono">
              <div className="text-white font-bold">{selectedAssetForTransfer.assetName}</div>
              <div className="text-slate-400 text-[11px]">Token #{selectedAssetForTransfer.tokenId} &bull; {selectedAssetForTransfer.serialNumber}</div>
            </div>

            <form onSubmit={handleTransferAsset} className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-slate-400 block mb-1">SELECT NEW CUSTODIAN</label>
                <select
                  value={transferRecipient}
                  onChange={(e) => setTransferRecipient(e.target.value)}
                  className="w-full rounded-xl border border-vault-700 bg-vault-950 p-2.5 text-white focus:outline-none focus:border-cyber-cyan"
                >
                  <option value="">Choose an employee...</option>
                  {identities
                    .filter(i => i.walletAddress.toLowerCase() !== selectedAssetForTransfer.currentOwner.toLowerCase())
                    .map((id) => (
                      <option key={id.walletAddress} value={id.walletAddress}>
                        {id.name} ({id.employeeId})
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTransferModal(false)}
                  className="flex-1 rounded-xl bg-vault-800 p-2.5 font-semibold text-slate-300 hover:bg-vault-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-cyber-cyan p-2.5 font-semibold text-vault-950 hover:bg-sky-300 shadow-md"
                >
                  Execute Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
