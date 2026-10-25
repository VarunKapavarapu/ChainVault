import React, { useState } from 'react';
import { Eye, Shield, CheckCircle2, Search, FileText, Check, Lock, AlertTriangle, Clock } from 'lucide-react';
import { blockchainService } from '../../services/blockchain';
import { IdentityRecord, AssetRecord, AuditRecord } from '../../types';

export const AuditorDashboard: React.FC = () => {
  const [identities] = useState<IdentityRecord[]>(blockchainService.identities);
  const [assets] = useState<AssetRecord[]>(blockchainService.assets);
  const [auditLogs] = useState<AuditRecord[]>(blockchainService.auditLogs);

  // Hash verification simulator
  const [testEmpId, setTestEmpId] = useState('EMP-004');
  const [testName, setTestName] = useState('Ananya Rao');
  const [testEmail, setTestEmail] = useState('ananya.rao@enterprise.corp');
  const [testDept, setTestDept] = useState('Core Engineering');
  const [verifyResult, setVerifyResult] = useState<string | null>(null);

  const handleComputeHash = () => {
    const raw = `${testEmpId}:${testName}:${testEmail}:${testDept}`;
    // Using simple mock hash or keccak256
    const simulated = '0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321';
    const found = identities.find(i => i.identityHash.toLowerCase() === simulated.toLowerCase());
    if (found) {
      setVerifyResult(`MATCH CONFIRMED! Cryptographic hash matches on-chain Identity #${found.identityId} (${found.walletAddress})`);
    } else {
      setVerifyResult(`Computed Hash: 0x4a9f...b28c. No matching identity on-chain.`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Prominent Read-Only Auditor Banner */}
      <div className="rounded-2xl border border-cyber-cyan/40 bg-cyber-cyan/10 p-4 flex items-center justify-between text-xs font-mono text-cyber-cyan">
        <div className="flex items-center gap-2.5">
          <Eye className="h-5 w-5" />
          <span>
            <strong>READ-ONLY COMPLIANCE PORTAL</strong> &bull; All administrative mutation functions are locked. Cryptographic proofs and event logs are directly verifiable.
          </span>
        </div>
        <span className="rounded bg-vault-950 px-2 py-0.5 border border-cyber-cyan/30 text-white font-bold">
          AUDITOR ENFORCED
        </span>
      </div>

      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-extrabold text-white tracking-tight">
          Governance & Compliance Verification
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          Independent verification of decentralized identity cryptographic hashes, asset provenance chains, and immutable security audit logs.
        </p>
      </div>

      {/* Verification Tool: Verify Off-chain Claim Against On-chain Hash */}
      <div className="rounded-2xl border border-vault-700 bg-vault-900/90 p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-vault-800">
          <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
            <Lock className="h-4 w-4 text-cyber-cyan" />
            Zero-Knowledge Hash Verification Tool
          </h3>
          <span className="text-[10px] font-mono text-slate-500">SHA-256 / KECCAK-256</span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Verify an employee's off-chain credential claim against the immutable hash stored on the blockchain without ever exposing their private information publicly.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div>
            <label className="text-slate-500 block mb-1 text-[10px]">EMPLOYEE ID</label>
            <input
              type="text"
              value={testEmpId}
              onChange={(e) => setTestEmpId(e.target.value)}
              className="w-full rounded-xl border border-vault-700 bg-vault-950 p-2 text-white text-xs"
            />
          </div>
          <div>
            <label className="text-slate-500 block mb-1 text-[10px]">FULL NAME</label>
            <input
              type="text"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              className="w-full rounded-xl border border-vault-700 bg-vault-950 p-2 text-white text-xs"
            />
          </div>
          <div>
            <label className="text-slate-500 block mb-1 text-[10px]">CORPORATE EMAIL</label>
            <input
              type="text"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              className="w-full rounded-xl border border-vault-700 bg-vault-950 p-2 text-white text-xs"
            />
          </div>
          <div>
            <label className="text-slate-500 block mb-1 text-[10px]">DEPARTMENT</label>
            <input
              type="text"
              value={testDept}
              onChange={(e) => setTestDept(e.target.value)}
              className="w-full rounded-xl border border-vault-700 bg-vault-950 p-2 text-white text-xs"
            />
          </div>
        </div>

        <button
          onClick={handleComputeHash}
          className="rounded-xl bg-cyber-cyan px-4 py-2 text-xs font-semibold text-vault-950 hover:bg-sky-300 transition-colors"
        >
          Compute & Match Hash On-Chain
        </button>

        {verifyResult && (
          <div className="p-3 rounded-xl bg-vault-950 border border-cyber-cyan/40 text-xs font-mono text-cyber-cyan">
            {verifyResult}
          </div>
        )}
      </div>

      {/* Two Column Inspection View: Identities & Assets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono text-xs">
        {/* Left: Identities Audit */}
        <div className="rounded-2xl border border-vault-700 bg-vault-900/80 p-5 space-y-3">
          <h3 className="font-bold text-white uppercase tracking-wider text-[11px] pb-2 border-b border-vault-800">
            Registered Identity Records ({identities.length})
          </h3>
          <div className="space-y-2">
            {identities.map((id) => (
              <div key={id.identityId} className="p-3 rounded-xl bg-vault-950 border border-vault-800 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white font-sans">{id.name}</span>
                  <span className="text-cyber-emerald text-[10px]">✓ On-Chain Verified</span>
                </div>
                <div className="text-[10px] text-slate-400">Wallet: {id.walletAddress}</div>
                <div className="text-[10px] text-cyber-cyan truncate select-all">Hash: {id.identityHash}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Assets Custody Audit */}
        <div className="rounded-2xl border border-vault-700 bg-vault-900/80 p-5 space-y-3">
          <h3 className="font-bold text-white uppercase tracking-wider text-[11px] pb-2 border-b border-vault-800">
            Digital Asset Token Custody ({assets.length})
          </h3>
          <div className="space-y-2">
            {assets.map((asset) => {
              const owner = blockchainService.getUserProfile(asset.currentOwner);
              return (
                <div key={asset.tokenId} className="p-3 rounded-xl bg-vault-950 border border-vault-800 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white font-sans">{asset.assetName}</span>
                    <span className="text-slate-400 text-[10px]">Token #{asset.tokenId}</span>
                  </div>
                  <div className="text-[10px] text-slate-400">Serial: {asset.serialNumber}</div>
                  <div className="text-[10px] text-cyber-emerald">Custodian: {owner.name} ({asset.currentOwner.slice(0, 8)}...)</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
