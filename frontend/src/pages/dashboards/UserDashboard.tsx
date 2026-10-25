import React, { useState } from 'react';
import { User, ShieldCheck, Box, Key, Send, Clock, CheckCircle2, ArrowRight, X } from 'lucide-react';
import { blockchainService } from '../../services/blockchain';
import { AssetRecord, IdentityRecord } from '../../types';

interface UserDashboardProps {
  onExecuteTx: (actionFn: () => Promise<any>, title: string, initialMsg: string) => Promise<void>;
  walletAddress: string;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ onExecuteTx, walletAddress }) => {
  const profile = blockchainService.getUserProfile(walletAddress);
  const myIdentity = blockchainService.identities.find(
    i => i.walletAddress.toLowerCase() === walletAddress.toLowerCase()
  );
  const [myAssets, setMyAssets] = useState<AssetRecord[]>(
    blockchainService.assets.filter(a => a.currentOwner.toLowerCase() === walletAddress.toLowerCase())
  );

  const [selectedAsset, setSelectedAsset] = useState<AssetRecord | null>(null);
  const [transferRecipient, setTransferRecipient] = useState('');

  const refreshState = () => {
    setMyAssets(
      blockchainService.assets.filter(a => a.currentOwner.toLowerCase() === walletAddress.toLowerCase())
    );
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsset || !transferRecipient) return;

    await onExecuteTx(
      () => blockchainService.transferAsset(selectedAsset.tokenId, transferRecipient),
      `Transfer Asset #${selectedAsset.tokenId}`,
      `Signing ERC-721 transfer transaction with personal wallet keypair...`
    );

    setSelectedAsset(null);
    setTransferRecipient('');
    refreshState();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-vault-700 bg-vault-900/80 px-3 py-1 text-xs font-mono text-cyber-cyan mb-2">
          <User className="h-3.5 w-3.5" /> STAKEHOLDER WORKSPACE
        </div>
        <h1 className="font-display text-3xl font-extrabold text-white tracking-tight">
          Welcome back, {profile.name}
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          Manage your verified cryptographic credentials, view your assigned corporate equipment, and review on-chain transactions.
        </p>
      </div>

      {/* Identity Card */}
      <div className="rounded-2xl border border-vault-700 bg-vault-900/80 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-vault-800">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">DECENTRALIZED IDENTITY STATUS</span>
            <div className="text-xl font-bold text-white font-sans mt-0.5">{profile.name}</div>
            <div className="text-xs text-slate-400 font-mono">{profile.employeeId} &bull; {profile.department}</div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-md bg-cyber-emerald/10 border border-cyber-emerald/20 px-2.5 py-1 text-xs font-bold text-cyber-emerald font-mono">
              <CheckCircle2 className="h-3.5 w-3.5" /> Verified by Admin
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div>
            <span className="text-slate-500 block mb-1">CONNECTED WALLET ADDRESS</span>
            <div className="p-2.5 rounded-xl bg-vault-950 border border-vault-800 text-slate-200 select-all">
              {walletAddress}
            </div>
          </div>
          <div>
            <span className="text-slate-500 block mb-1">ON-CHAIN IDENTITY HASH (KECCAK-256)</span>
            <div className="p-2.5 rounded-xl bg-vault-950 border border-vault-800 text-cyber-cyan truncate select-all">
              {myIdentity?.identityHash || '0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321'}
            </div>
          </div>
        </div>
      </div>

      {/* Assets Owned */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2 font-mono">
            <Box className="h-4 w-4 text-cyber-cyan" />
            My Assigned Digital Assets & Hardware ({myAssets.length})
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {myAssets.map((asset) => (
            <div key={asset.tokenId} className="rounded-2xl border border-vault-700 bg-vault-900/80 p-5 space-y-3 font-mono text-xs shadow-lg">
              <div className="flex justify-between items-start pb-2 border-b border-vault-800">
                <div>
                  <span className="text-[10px] text-cyber-cyan font-bold block">TOKEN #{asset.tokenId} &bull; {asset.assetType}</span>
                  <div className="font-bold text-white text-sm font-sans mt-0.5">{asset.assetName}</div>
                </div>
                <span className="rounded bg-cyber-emerald/10 border border-cyber-emerald/20 px-2 py-0.5 text-[10px] font-bold text-cyber-emerald">
                  In Possession
                </span>
              </div>

              <div className="text-slate-400 font-sans text-xs">
                {asset.description}
              </div>

              <div className="p-2.5 rounded-xl bg-vault-950 border border-vault-800 space-y-1 text-[11px]">
                <div><span className="text-slate-500">Serial Ref:</span> <span className="text-slate-200">{asset.serialNumber}</span></div>
                <div className="truncate"><span className="text-slate-500">Tx Hash:</span> <span className="text-cyber-cyan">{asset.txHash || '0x7c9a4e...'}</span></div>
              </div>

              <button
                onClick={() => setSelectedAsset(asset)}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-vault-800 hover:bg-vault-700 border border-vault-700 p-2 text-xs font-semibold text-slate-200 transition-colors"
              >
                <Send className="h-3.5 w-3.5 text-cyber-cyan" /> Transfer Asset to Colleague
              </button>
            </div>
          ))}

          {myAssets.length === 0 && (
            <div className="col-span-2 rounded-2xl border border-vault-800 bg-vault-900/40 p-8 text-center text-xs text-slate-500 font-mono">
              You currently have no hardware or digital assets assigned to your wallet.
            </div>
          )}
        </div>
      </div>

      {/* Transfer Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border border-vault-700 bg-vault-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-vault-800">
              <h3 className="text-lg font-bold text-white">Transfer Asset</h3>
              <button onClick={() => setSelectedAsset(null)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-vault-950 border border-vault-800 text-xs font-mono">
              <div className="text-white font-bold">{selectedAsset.assetName}</div>
              <div className="text-slate-400 text-[11px]">Token #{selectedAsset.tokenId} &bull; {selectedAsset.serialNumber}</div>
            </div>

            <form onSubmit={handleTransfer} className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-slate-400 block mb-1">SELECT COLLEAGUE / WALLET</label>
                <select
                  value={transferRecipient}
                  onChange={(e) => setTransferRecipient(e.target.value)}
                  className="w-full rounded-xl border border-vault-700 bg-vault-950 p-2.5 text-white focus:outline-none focus:border-cyber-cyan"
                >
                  <option value="">Choose a colleague...</option>
                  {blockchainService.identities
                    .filter(i => i.walletAddress.toLowerCase() !== walletAddress.toLowerCase())
                    .map((id) => (
                      <option key={id.walletAddress} value={id.walletAddress}>
                        {id.name} ({id.employeeId}) &bull; {id.department}
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedAsset(null)}
                  className="flex-1 rounded-xl bg-vault-800 p-2.5 font-semibold text-slate-300 hover:bg-vault-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-cyber-cyan p-2.5 font-semibold text-vault-950 hover:bg-sky-300 shadow-md"
                >
                  Sign & Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
