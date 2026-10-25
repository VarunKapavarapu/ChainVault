import React, { useState } from 'react';
import { Box, Send, Users, ShieldAlert, Check, Search, Clock, ArrowRight, X } from 'lucide-react';
import { blockchainService } from '../../services/blockchain';
import { AssetRecord, IdentityRecord } from '../../types';

interface ManagerDashboardProps {
  onExecuteTx: (actionFn: () => Promise<any>, title: string, initialMsg: string) => Promise<void>;
  walletAddress: string;
}

export const ManagerDashboard: React.FC<ManagerDashboardProps> = ({ onExecuteTx, walletAddress }) => {
  const [assets, setAssets] = useState<AssetRecord[]>(blockchainService.assets);
  const [identities] = useState<IdentityRecord[]>(blockchainService.identities);

  // Transfer modal
  const [selectedAsset, setSelectedAsset] = useState<AssetRecord | null>(null);
  const [transferRecipient, setTransferRecipient] = useState('');
  const [search, setSearch] = useState('');

  const refreshState = () => {
    setAssets([...blockchainService.assets]);
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsset || !transferRecipient) return;

    await onExecuteTx(
      () => blockchainService.transferAsset(selectedAsset.tokenId, transferRecipient),
      `Transfer Asset #${selectedAsset.tokenId}`,
      `Executing department asset allocation via AssetNFT.sol...`
    );

    setSelectedAsset(null);
    setTransferRecipient('');
    refreshState();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-cyber-amber/20 bg-cyber-amber/10 px-3 py-1 text-xs font-mono text-cyber-amber mb-2">
          <Box className="h-3.5 w-3.5" /> DEPARTMENT MANAGER CONSOLE
        </div>
        <h1 className="font-display text-3xl font-extrabold text-white tracking-tight">
          IT Asset Allocation & Team Custody
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          Allocate hardware, reassign enterprise software licenses, and monitor team equipment custody under delegated manager permissions.
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
        <div className="rounded-2xl border border-vault-700 bg-vault-900/80 p-5">
          <div className="text-slate-400 mb-1">TOTAL ASSETS ACCESSIBLE</div>
          <div className="text-2xl font-bold text-white">{assets.length}</div>
          <div className="text-[10px] text-cyber-amber mt-1">Delegated allocation privileges</div>
        </div>
        <div className="rounded-2xl border border-vault-700 bg-vault-900/80 p-5">
          <div className="text-slate-400 mb-1">TEAM IDENTITIES</div>
          <div className="text-2xl font-bold text-cyber-cyan">{identities.length}</div>
          <div className="text-[10px] text-slate-400 mt-1">Verified organizational wallets</div>
        </div>
        <div className="rounded-2xl border border-vault-700 bg-vault-900/80 p-5">
          <div className="text-slate-400 mb-1">PERMITTED ACTIONS</div>
          <div className="text-2xl font-bold text-cyber-emerald">ASSET_ASSIGN</div>
          <div className="text-[10px] text-slate-400 mt-1">NFT Minting restricted to Admin</div>
        </div>
      </div>

      {/* Assets Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Department Asset Inventory</h3>
          <div className="relative w-64">
            <Search className="h-3.5 w-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search assets..."
              className="w-full rounded-xl border border-vault-700 bg-vault-900/80 pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyber-cyan font-mono"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-vault-700 bg-vault-900/80 overflow-hidden shadow-xl">
          <table className="w-full text-left font-mono text-xs">
            <thead className="border-b border-vault-800 bg-vault-950/60 text-[11px] text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3">Token #</th>
                <th className="px-5 py-3">Asset Description</th>
                <th className="px-5 py-3">Serial Reference</th>
                <th className="px-5 py-3">Current Holder</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-vault-800 text-slate-300">
              {assets
                .filter(
                  a =>
                    search === '' ||
                    a.assetName.toLowerCase().includes(search.toLowerCase()) ||
                    a.serialNumber.toLowerCase().includes(search.toLowerCase())
                )
                .map((asset) => {
                  const owner = blockchainService.getUserProfile(asset.currentOwner);
                  return (
                    <tr key={asset.tokenId} className="hover:bg-vault-800/40">
                      <td className="px-5 py-3.5 font-bold text-white">#{asset.tokenId}</td>
                      <td className="px-5 py-3.5 font-sans">
                        <div className="font-semibold text-white">{asset.assetName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{asset.assetType}</div>
                      </td>
                      <td className="px-5 py-3.5 text-cyber-cyan select-all">{asset.serialNumber}</td>
                      <td className="px-5 py-3.5 font-sans">
                        <div className="font-medium text-white">{owner.name}</div>
                        <div className="text-[10px] font-mono text-slate-400">
                          {asset.currentOwner.slice(0, 8)}...
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => setSelectedAsset(asset)}
                          className="rounded bg-cyber-amber/10 hover:bg-cyber-amber/20 border border-cyber-amber/30 px-3 py-1 text-xs font-semibold text-cyber-amber transition-colors"
                        >
                          Reassign Asset
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transfer Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border border-vault-700 bg-vault-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-vault-800">
              <h3 className="text-lg font-bold text-white">Reallocate Asset</h3>
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
                <label className="text-slate-400 block mb-1">SELECT TEAM MEMBER</label>
                <select
                  value={transferRecipient}
                  onChange={(e) => setTransferRecipient(e.target.value)}
                  className="w-full rounded-xl border border-vault-700 bg-vault-950 p-2.5 text-white focus:outline-none focus:border-cyber-cyan"
                >
                  <option value="">Choose an employee...</option>
                  {identities
                    .filter(i => i.walletAddress.toLowerCase() !== selectedAsset.currentOwner.toLowerCase())
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
                  className="flex-1 rounded-xl bg-cyber-amber p-2.5 font-semibold text-vault-950 hover:bg-amber-300 shadow-md"
                >
                  Confirm Reallocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
