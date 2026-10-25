import React, { useState } from 'react';
import { Search, ShieldCheck, AlertCircle, CheckCircle2, QrCode, ExternalLink, ArrowRight, Clock, User, Hash, Layers } from 'lucide-react';
import { blockchainService } from '../services/blockchain';
import { AssetRecord, UserProfile, AuditRecord } from '../types';
import deployments from '../contracts/deployments.json';

export const PublicVerifyPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('1'); // Default to Token #1
  const [result, setResult] = useState<{
    searched: boolean;
    exists: boolean;
    asset?: AssetRecord;
    ownerProfile?: UserProfile;
    history?: AuditRecord[];
    message?: string;
  }>({
    searched: true,
    ...blockchainService.verifyAssetByIdentifier('1')
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const res = blockchainService.verifyAssetByIdentifier(searchQuery.trim());
    setResult({
      searched: true,
      ...res
    });
  };

  const handleQuickSelect = (query: string) => {
    setSearchQuery(query);
    const res = blockchainService.verifyAssetByIdentifier(query);
    setResult({
      searched: true,
      ...res
    });
  };

  return (
    <div className="py-6 px-0 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-vault-700 bg-vault-900/80 px-4 py-1.5 text-xs font-mono text-cyber-cyan backdrop-blur-md mb-4">
          <ShieldCheck className="h-4 w-4" />
          PUBLIC CRYPTOGRAPHIC VERIFIER
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Verify Blockchain Asset Authenticity
        </h1>
        <p className="mt-3 text-sm text-slate-400 max-w-xl mx-auto">
          Query the distributed ledger to verify digital asset provenance, ownership history, and smart contract issuance without requiring wallet authentication.
        </p>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative flex items-center rounded-2xl border border-vault-700 bg-vault-900/90 shadow-2xl p-2 backdrop-blur-xl">
          <Search className="h-5 w-5 text-slate-400 ml-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter NFT Token ID (e.g. 1), Serial # (e.g. SN-MBP-2026-042), or Tx Hash..."
            className="w-full bg-transparent px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none font-mono"
          />
          <button
            type="submit"
            className="rounded-xl bg-cyber-cyan px-6 py-2.5 text-xs font-semibold text-vault-950 hover:bg-sky-300 transition-colors shrink-0"
          >
            Verify
          </button>
        </div>

        {/* Quick sample buttons */}
        <div className="flex flex-wrap items-center gap-2 mt-3 text-xs font-mono text-slate-500">
          <span>Quick queries:</span>
          <button
            type="button"
            onClick={() => handleQuickSelect('1')}
            className="rounded bg-vault-800 hover:bg-vault-700 px-2 py-1 text-slate-300 transition-colors"
          >
            Token #1 (Laptop)
          </button>
          <button
            type="button"
            onClick={() => handleQuickSelect('SN-MBP-2026-042')}
            className="rounded bg-vault-800 hover:bg-vault-700 px-2 py-1 text-slate-300 transition-colors"
          >
            Serial SN-MBP-2026-042
          </button>
          <button
            type="button"
            onClick={() => handleQuickSelect('2')}
            className="rounded bg-vault-800 hover:bg-vault-700 px-2 py-1 text-slate-300 transition-colors"
          >
            Token #2 (License)
          </button>
          <button
            type="button"
            onClick={() => handleQuickSelect('3')}
            className="rounded bg-vault-800 hover:bg-vault-700 px-2 py-1 text-slate-300 transition-colors"
          >
            Token #3 (Cert)
          </button>
        </div>
      </form>

      {/* Results View */}
      {result.searched && (
        <div>
          {result.exists && result.asset ? (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Verification Header Banner */}
              <div className="rounded-2xl border border-cyber-emerald/40 bg-cyber-emerald/10 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyber-emerald/20 text-cyber-emerald ring-4 ring-cyber-emerald/10">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyber-emerald">
                        VERIFIED ON BLOCKCHAIN
                      </span>
                      <span className="rounded bg-vault-900 border border-vault-700 px-2 py-0.5 text-[10px] font-mono text-slate-300">
                        ERC-721
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-white mt-0.5">{result.asset.assetName}</h2>
                  </div>
                </div>

                <div className="text-right font-mono text-xs text-slate-400">
                  <div>TOKEN ID: <span className="text-white font-bold">#{result.asset.tokenId}</span></div>
                  <div>STATUS: <span className="text-cyber-emerald">ACTIVE & LEGITIMATE</span></div>
                </div>
              </div>

              {/* Main Asset Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left 2 Cols: Details */}
                <div className="md:col-span-2 space-y-6">
                  <div className="rounded-2xl border border-vault-700 bg-vault-900/90 p-6 space-y-4">
                    <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 pb-2 border-b border-vault-800">
                      Asset Specifications & Custody
                    </h3>

                    <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                      <div>
                        <span className="text-slate-500 block mb-1">ASSET CATEGORY</span>
                        <span className="text-white font-medium">{result.asset.assetType}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block mb-1">SERIAL / REFERENCE</span>
                        <span className="text-cyber-cyan font-medium">{result.asset.serialNumber}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block mb-1">MINT TIMESTAMP</span>
                        <span className="text-slate-300 font-medium">
                          {new Date(result.asset.createdAt * 1000).toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block mb-1">ISSUED BY (ADMIN)</span>
                        <span className="text-slate-300 truncate block">
                          {result.asset.createdBy.slice(0, 10)}...{result.asset.createdBy.slice(-4)}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 text-xs">
                      <span className="text-slate-500 font-mono block mb-1">DESCRIPTION</span>
                      <p className="text-slate-300 leading-relaxed bg-vault-950 p-3 rounded-xl border border-vault-800">
                        {result.asset.description}
                      </p>
                    </div>

                    {/* Current Owner Profile */}
                    <div className="pt-3 border-t border-vault-800">
                      <span className="text-slate-500 font-mono text-xs block mb-2">CURRENT CUSTODIAN / OWNER</span>
                      <div className="flex items-center justify-between p-3 rounded-xl bg-vault-950 border border-vault-800">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyber-blue/10 text-cyber-blue font-bold text-xs">
                            {result.ownerProfile?.name.slice(0, 2).toUpperCase() || 'EMP'}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-white">
                              {result.ownerProfile?.name || 'Authorized Holder'}
                            </div>
                            <div className="text-xs text-slate-400">
                              {result.ownerProfile?.employeeId} &bull; {result.ownerProfile?.department}
                            </div>
                          </div>
                        </div>
                        <div className="font-mono text-xs text-cyber-cyan">
                          {result.asset.currentOwner.slice(0, 8)}...{result.asset.currentOwner.slice(-4)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Blockchain Provenance */}
                  <div className="rounded-2xl border border-vault-700 bg-vault-900/90 p-6 space-y-3 font-mono text-xs">
                    <h3 className="font-semibold uppercase tracking-wider text-slate-400 pb-2 border-b border-vault-800">
                      On-Chain Cryptographic Proofs
                    </h3>

                    <div>
                      <span className="text-slate-500 block mb-1">MINT TRANSACTION HASH</span>
                      <div className="p-2.5 rounded-lg bg-vault-950 border border-vault-800 text-cyber-cyan break-all select-all">
                        {result.asset.txHash || '0x7c9a4e8d3b2f1056c84192b0c34e8f1729da03b41e976c5d8a01f42e8b7c3d21'}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-1">
                      <div>
                        <span className="text-slate-500 block mb-1">CONTRACT ADDRESS</span>
                        <div className="text-slate-300 truncate">
                          {deployments?.contracts?.AssetNFT || '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-500 block mb-1">BLOCK CONFIRMATION</span>
                        <div className="text-slate-300">
                          Block #{result.asset.blockNumber || 1042} (12,840 Confirmations)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Col: QR Mockup & Verification Certificate */}
                <div className="space-y-6">
                  {/* QR Card */}
                  <div className="rounded-2xl border border-vault-700 bg-vault-900/90 p-6 text-center">
                    <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-4">
                      Physical Verification Tag
                    </div>
                    <div className="mx-auto w-44 h-44 rounded-xl bg-white p-3 flex flex-col items-center justify-center shadow-lg">
                      {/* Stylized QR mockup */}
                      <div className="w-full h-full border-4 border-vault-950 p-2 flex flex-col justify-between">
                        <div className="flex justify-between">
                          <div className="w-8 h-8 bg-vault-950" />
                          <div className="w-8 h-8 bg-vault-950" />
                        </div>
                        <div className="text-center font-mono font-black text-vault-950 text-[10px] tracking-widest">
                          CVA-NFT#{result.asset.tokenId}
                        </div>
                        <div className="flex justify-between items-end">
                          <div className="w-8 h-8 bg-vault-950" />
                          <div className="w-4 h-4 bg-vault-950" />
                        </div>
                      </div>
                    </div>
                    <p className="mt-4 text-[11px] text-slate-400 leading-normal">
                      Scan to verify this asset on the public registry:
                      <br />
                      <code className="text-cyber-cyan font-mono text-[10px]">
                        /verify/asset/{result.asset.tokenId}
                      </code>
                    </p>
                  </div>

                  {/* Physical Notice */}
                  <div className="rounded-2xl border border-vault-800 bg-vault-950 p-4 text-[11px] text-slate-400 leading-relaxed">
                    <strong className="text-slate-300 block mb-1">Academic Notice:</strong>
                    The NFT certifies ownership of the digital record. External mechanisms (QR, RFID, serial tags, physical inspection) are necessary to ascertain physical existence and condition.
                  </div>
                </div>
              </div>

              {/* Ownership & Event History for this Asset */}
              <div className="rounded-2xl border border-vault-700 bg-vault-900/90 p-6">
                <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 pb-3 border-b border-vault-800 mb-4 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-cyber-cyan" />
                  Asset Ownership & Audit Provenance
                </h3>

                <div className="space-y-4">
                  {result.history && result.history.length > 0 ? (
                    result.history.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-4 p-3 rounded-xl bg-vault-950 border border-vault-800 font-mono text-xs">
                        <div className="h-2 w-2 rounded-full bg-cyber-cyan mt-1.5 shrink-0" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white">{item.eventType}</span>
                            <span className="text-[10px] text-slate-500">
                              {new Date(item.timestamp * 1000).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-slate-400 text-[11px] mt-1">{item.details}</p>
                          <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-3">
                            <span>Actor: {item.actor.slice(0, 8)}...</span>
                            <span>Target: {item.target.slice(0, 8)}...</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-slate-500 font-mono p-4 text-center">
                      Minted into inventory. No subsequent ownership transfers recorded.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-cyber-rose/30 bg-cyber-rose/10 p-8 text-center animate-in fade-in duration-200">
              <AlertCircle className="h-10 w-10 text-cyber-rose mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-2">Asset Not Found On-Chain</h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                {result.message || "Asset could not be verified on the blockchain. Identifier not found."}
              </p>
              <p className="text-[11px] text-slate-400 mt-4">
                Please double check the Token ID, Serial Number, or Transaction Hash and ensure you are searching on the configured network.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
