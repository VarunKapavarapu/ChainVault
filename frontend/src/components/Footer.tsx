import React from 'react';
import { Shield, ExternalLink, Code2, Globe, FileText, CheckCircle2 } from 'lucide-react';
import deployments from '../contracts/deployments.json';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-vault-800 bg-vault-950 text-slate-400 text-xs">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand & Purpose */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-vault-800 border border-vault-700 text-cyber-cyan">
                <Shield className="h-4 w-4" />
              </div>
              <span className="font-display font-bold text-sm tracking-tight text-white">
                CHAINVAULT SECURITY PLATFORM
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-md text-xs">
              A decentralized framework for enterprise identity, role-based access control, and digital asset
              ownership governed by Solidity smart contracts and verifiable on an immutable ledger.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="rounded bg-vault-900 border border-vault-800 px-2 py-1 font-mono text-[10px] text-slate-300">
                Solidity 0.8.24
              </span>
              <span className="rounded bg-vault-900 border border-vault-800 px-2 py-1 font-mono text-[10px] text-slate-300">
                ERC-721
              </span>
              <span className="rounded bg-vault-900 border border-vault-800 px-2 py-1 font-mono text-[10px] text-slate-300">
                Ethers.js v6
              </span>
              <span className="rounded bg-vault-900 border border-vault-800 px-2 py-1 font-mono text-[10px] text-slate-300">
                OpenZeppelin 5.0
              </span>
            </div>
          </div>

          {/* Quick Platform Views */}
          <div>
            <h4 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Application Modules
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-white transition-colors">
                  Role-Based Dashboards
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('verify')} className="hover:text-white transition-colors">
                  Public Asset Authenticator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('audit')} className="hover:text-white transition-colors">
                  Immutable Audit Log
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('explorer')} className="hover:text-white transition-colors">
                  Transaction Ledger Explorer
                </button>
              </li>
            </ul>
          </div>

          {/* Deployed Smart Contracts */}
          <div>
            <h4 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Smart Contracts (Localhost)
            </h4>
            <ul className="space-y-1.5 font-mono text-[11px]">
              <li className="flex flex-col">
                <span className="text-slate-500">Identity.sol</span>
                <span className="text-slate-300 truncate">
                  {deployments?.contracts?.Identity || '0x5FbDB2315678afecb367f032d93F642f64180aa3'}
                </span>
              </li>
              <li className="flex flex-col pt-1">
                <span className="text-slate-500">AccessControl.sol</span>
                <span className="text-slate-300 truncate">
                  {deployments?.contracts?.ChainVaultAccessControl || '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'}
                </span>
              </li>
              <li className="flex flex-col pt-1">
                <span className="text-slate-500">AssetNFT.sol (ERC-721)</span>
                <span className="text-slate-300 truncate">
                  {deployments?.contracts?.AssetNFT || '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'}
                </span>
              </li>
              <li className="flex flex-col pt-1">
                <span className="text-slate-500">AuditLogger.sol</span>
                <span className="text-slate-300 truncate">
                  {deployments?.contracts?.AuditLogger || '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9'}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Academic Integrity & Limitations Notice */}
        <div className="rounded-xl border border-vault-800 bg-vault-900/60 p-4 mb-8">
          <div className="flex items-center gap-2 text-cyber-cyan font-mono text-[11px] font-semibold uppercase tracking-wider mb-2">
            <CheckCircle2 className="h-4 w-4" /> Academic Integrity & Technical Limitations Notice
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] text-slate-400 leading-relaxed">
            <div>
              <strong className="text-slate-300">1. Decentralized Identity:</strong> A raw Ethereum wallet address is used as an authorized cryptographic keypair, not an authoritative W3C Decentralized Identifier (DID). Sensitive personal data is strictly off-chain.
            </div>
            <div>
              <strong className="text-slate-300">2. Asset Demarcation:</strong> The ERC-721 NFT represents the organization's immutable digital record of an asset, not proof of physical possession or condition.
            </div>
            <div>
              <strong className="text-slate-300">3. Verification Mechanism:</strong> Physical asset verification requires external mechanisms such as serial tags, QR codes, or hardware attestations.
            </div>
            <div>
              <strong className="text-slate-300">4. Key Custody:</strong> Loss or compromise of cryptographic private keys leads to loss of account authorization.
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-vault-900 pt-6 text-[11px] text-slate-500">
          <div>
            ChainVault Academic Research & Demonstration Platform &bull; Built with Hardhat, Solidity, Ethers.js & React
          </div>
          <div className="flex items-center gap-4">
            <span>SDG 9 &bull; SDG 16 &bull; SDG 8 &bull; SDG 4</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
