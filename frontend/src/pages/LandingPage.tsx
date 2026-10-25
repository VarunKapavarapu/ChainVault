import React, { useState } from 'react';
import { 
  Shield, Key, Award, FileSpreadsheet, Lock, ArrowRight, CheckCircle2, 
  ExternalLink, Layers, Database, ChevronRight, Cpu, UserCheck, ShieldAlert,
  Server, RefreshCw, Eye, Sparkles, Check, AlertTriangle, GitBranch
} from 'lucide-react';
import { BlockchainNetworkCanvas } from '../components/BlockchainNetworkCanvas';

interface LandingPageProps {
  onEnterPlatform: () => void;
  onExploreArchitecture: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterPlatform, onExploreArchitecture }) => {
  const [activeSolutionPillar, setActiveSolutionPillar] = useState<'identity' | 'access' | 'assets'>('identity');

  return (
    <div className="relative w-full overflow-hidden bg-vault-950 text-slate-100">
      
      {/* ─────────────────────────────────────────────────────────────
          1. HERO SECTION (Cinematic Scrolltide Style)
      ───────────────────────────────────────────────────────────── */}
      <section className="relative flex flex-col justify-center items-center px-4 sm:px-8 lg:px-12 overflow-hidden border-b border-vault-800/80" style={{ minHeight: 'calc(100vh - var(--navbar-height))' }}>
        {/* Background Network Canvas — full opacity */}
        <div className="absolute inset-0 z-0">
          <BlockchainNetworkCanvas />
        </div>

        {/* Multiple ambient glow layers */}
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyber-cyan/8 rounded-full blur-[180px] pointer-events-none" />
        <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-cyber-indigo/6 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute top-[60%] left-[5%] w-[400px] h-[400px] bg-cyber-emerald/5 rounded-full blur-[120px] pointer-events-none" />

        {/* Scanline decoration */}
        <div className="absolute inset-0 z-0 bg-cyber-grid opacity-30 pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-6xl text-center w-full py-12 sm:py-16">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-cyber-cyan/30 bg-vault-900/80 px-5 py-2 text-xs sm:text-sm font-mono text-cyber-cyan backdrop-blur-xl mb-8 sm:mb-10 shadow-xl shadow-cyber-cyan/10 animate-fade-in">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-cyan opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyber-cyan" />
            </span>
            ENTERPRISE DECENTRALIZED IDENTITY & ASSET GOVERNANCE
          </div>

          {/* Main Headline — large and commanding */}
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white leading-[1.05] mb-6 sm:mb-8 animate-slide-up">
            Trust, Identity<br className="hidden sm:block" />{' '}
            <span className="inline sm:hidden">&</span>
            <span className="hidden sm:inline">&</span> Ownership.
            <br />
            <span className="text-gradient-cyan">Secured by Blockchain.</span>
          </h1>

          {/* Subtitle — readable and clear */}
          <p className="mx-auto max-w-3xl text-base sm:text-lg md:text-xl text-slate-300/90 font-normal leading-relaxed mb-10 sm:mb-12">
            A decentralized enterprise security platform replacing brittle centralized databases with
            programmable on-chain access control, cryptographic hash identity references, and verifiable ERC-721 digital asset ownership.
          </p>

          {/* CTAs — larger and more prominent */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 mb-16 sm:mb-20">
            <button
              onClick={onEnterPlatform}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-cyber-cyan px-8 sm:px-10 py-4 text-sm sm:text-base font-bold text-vault-950 hover:bg-sky-300 transition-all shadow-2xl shadow-cyber-cyan/25 group cursor-pointer glow-cyan"
            >
              <span>Enter Platform</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1.5 transition-transform" />
            </button>

            <button
              onClick={onExploreArchitecture}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl glass-panel px-8 sm:px-10 py-4 text-sm sm:text-base font-semibold text-slate-100 hover:text-white hover:border-cyber-cyan/40 transition-all backdrop-blur-xl cursor-pointer"
            >
              <Layers className="h-5 w-5 text-cyber-cyan" />
              <span>Explore Architecture</span>
            </button>
          </div>

          {/* Core Metrics Strip — bigger, with glassmorphism */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5 max-w-5xl mx-auto pt-8 sm:pt-10 border-t border-white/[0.06] font-mono">
            <div className="p-4 sm:p-6 rounded-2xl glass-panel glass-panel-hover text-left card-hover">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/20">
                  <Database className="h-4 w-4 text-cyber-cyan" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white">4</div>
              <div className="text-[11px] sm:text-xs text-slate-400 mt-1">Solidity Smart Contracts</div>
            </div>
            <div className="p-4 sm:p-6 rounded-2xl glass-panel glass-panel-hover text-left card-hover">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/20">
                  <Lock className="h-4 w-4 text-cyber-cyan" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-cyber-cyan">100%</div>
              <div className="text-[11px] sm:text-xs text-slate-400 mt-1">On-Chain RBAC Enforcement</div>
            </div>
            <div className="p-4 sm:p-6 rounded-2xl glass-panel glass-panel-hover text-left card-hover">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/20">
                  <Key className="h-4 w-4 text-cyber-cyan" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white">SHA-256</div>
              <div className="text-[11px] sm:text-xs text-slate-400 mt-1">Off-Chain Hash Privacy</div>
            </div>
            <div className="p-4 sm:p-6 rounded-2xl glass-panel glass-panel-hover text-left card-hover">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyber-emerald/10 border border-cyber-emerald/20">
                  <Award className="h-4 w-4 text-cyber-emerald" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-cyber-emerald">ERC-721</div>
              <div className="text-[11px] sm:text-xs text-slate-400 mt-1">NFT Asset Ownership</div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="mt-12 sm:mt-16 flex flex-col items-center gap-2 animate-float-slow">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Scroll to explore</span>
            <ChevronRight className="h-4 w-4 text-slate-500 rotate-90" />
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. PROBLEM STATEMENT (Editorial Scrolltide Layout)
      ───────────────────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-vault-800 bg-vault-900/30">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14">
            <div className="font-mono text-xs uppercase tracking-wider text-cyber-rose flex items-center gap-2 mb-2">
              <ShieldAlert className="h-4 w-4" /> THE SYSTEMIC FAILURE OF CENTRALIZATION
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
              Single Points of Failure in Modern Enterprise Systems
            </h2>
            <p className="mt-4 max-w-3xl text-sm sm:text-base text-slate-400 leading-relaxed">
              Traditional enterprise IT relies heavily on centralized identity and access management (IAM) silos.
              When the central database is compromised, all trust assumptions collapse simultaneously.
            </p>
          </div>

          {/* 5 Major Risks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="rounded-2xl border border-vault-800 bg-vault-900/80 p-6 backdrop-blur-md">
              <div className="font-mono text-xs text-cyber-cyan font-bold mb-2">01 — CENTRALIZED IDENTITY</div>
              <h3 className="text-lg font-semibold text-white mb-2">Single Point of Compromise</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Central identity providers store passwords and personally identifiable data in vulnerable central repositories. A single root credential breach exposes the entire organization.
              </p>
            </div>

            <div className="rounded-2xl border border-vault-800 bg-vault-900/80 p-6 backdrop-blur-md">
              <div className="font-mono text-xs text-cyber-cyan font-bold mb-2">02 — UNAUTHORIZED PRIVILEGE CREEP</div>
              <h3 className="text-lg font-semibold text-white mb-2">Silent Permission Tampering</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Database administrators or internal attackers can silently alter permission tables without creating tamper-evident cryptographic proofs, bypassing frontend access checks.
              </p>
            </div>

            <div className="rounded-2xl border border-vault-800 bg-vault-900/80 p-6 backdrop-blur-md">
              <div className="font-mono text-xs text-cyber-cyan font-bold mb-2">03 — FRAGMENTED ASSET RECORDS</div>
              <h3 className="text-lg font-semibold text-white mb-2">Siloed Hardware & Licenses</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Asset inventories are split across disjointed ERPs and spreadsheets. When equipment transfers between departments, ownership history is lost or contradicted.
              </p>
            </div>

            <div className="rounded-2xl border border-vault-800 bg-vault-900/80 p-6 backdrop-blur-md md:col-span-2">
              <div className="font-mono text-xs text-cyber-cyan font-bold mb-2">04 — WEAK OWNERSHIP & PROVENANCE VERIFICATION</div>
              <h3 className="text-lg font-semibold text-white mb-2">Unverifiable Historical Custody</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Third-party auditors cannot independently verify historical transfers without trusting internal database backups. There is no mathematical guarantee that past ownership records were not retroactively altered.
              </p>
            </div>

            <div className="rounded-2xl border border-vault-800 bg-vault-900/80 p-6 backdrop-blur-md">
              <div className="font-mono text-xs text-cyber-cyan font-bold mb-2">05 — EPHEMERAL AUDIT LOGS</div>
              <h3 className="text-lg font-semibold text-white mb-2">Mutable Event Traces</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Standard application log files can be purged, truncated, or forged. Without cryptographic consensus, post-incident forensic investigations remain inconclusive.
              </p>
            </div>
          </div>

          {/* Centralized vs Distributed Transition Visual */}
          <div className="rounded-2xl border border-vault-700 bg-vault-950 p-6 sm:p-8">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-6 text-center">
              ARCHITECTURAL PARADIGM SHIFT
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Centralized */}
              <div className="p-6 rounded-xl border border-cyber-rose/20 bg-cyber-rose/5">
                <div className="text-xs font-mono text-cyber-rose font-bold mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" /> CENTRALIZED ARCHITECTURE (VULNERABLE)
                </div>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="text-cyber-rose">&times;</span> Root DB admin has unilateral modification rights
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-cyber-rose">&times;</span> PII stored plaintext/reversible on central servers
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-cyber-rose">&times;</span> Access control enforced only by frontend code
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-cyber-rose">&times;</span> Audit logs can be cleared or altered
                  </div>
                </div>
              </div>

              {/* Distributed */}
              <div className="p-6 rounded-xl border border-cyber-emerald/30 bg-cyber-emerald/5">
                <div className="text-xs font-mono text-cyber-emerald font-bold mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" /> CHAINVAULT BLOCKCHAIN ARCHITECTURE
                </div>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-cyber-emerald" /> Tamper-evident ledger with distributed consensus
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-cyber-emerald" /> Cryptographic hashes only; zero PII stored on-chain
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-cyber-emerald" /> Smart contracts enforce RBAC at EVM execution level
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-cyber-emerald" /> Immutable block timestamps and verifiable audit trails
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. SOLUTION SECTION (3 Core Pillars with Interactive Tabs)
      ───────────────────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-vault-800">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="font-mono text-xs uppercase tracking-wider text-cyber-cyan mb-2">
              THE THREE CORE PILLARS
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-bold text-white tracking-tight">
              Decentralized Trust Architecture
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-slate-400">
              Integrating cryptographic identity hashes, on-chain role enforcement, and ERC-721 tokenized asset ownership.
            </p>

            {/* Pillar Selector Buttons */}
            <div className="mt-8 inline-flex rounded-xl bg-vault-900 p-1 border border-vault-800">
              <button
                onClick={() => setActiveSolutionPillar('identity')}
                className={`rounded-lg px-5 py-2.5 text-xs font-semibold transition-all ${activeSolutionPillar === 'identity' ? 'bg-cyber-cyan text-vault-950 shadow-md' : 'text-slate-300 hover:text-white'}`}
              >
                01. Decentralized Identity
              </button>
              <button
                onClick={() => setActiveSolutionPillar('access')}
                className={`rounded-lg px-5 py-2.5 text-xs font-semibold transition-all ${activeSolutionPillar === 'access' ? 'bg-cyber-cyan text-vault-950 shadow-md' : 'text-slate-300 hover:text-white'}`}
              >
                02. Role-Based Access
              </button>
              <button
                onClick={() => setActiveSolutionPillar('assets')}
                className={`rounded-lg px-5 py-2.5 text-xs font-semibold transition-all ${activeSolutionPillar === 'assets' ? 'bg-cyber-cyan text-vault-950 shadow-md' : 'text-slate-300 hover:text-white'}`}
              >
                03. Digital Asset Ownership
              </button>
            </div>
          </div>

          {/* Interactive Pillar Details */}
          {activeSolutionPillar === 'identity' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center animate-in fade-in duration-300">
              <div className="space-y-6">
                <div className="inline-block rounded-lg bg-cyber-blue/10 border border-cyber-blue/20 px-3 py-1 font-mono text-xs text-cyber-blue">
                  PILLAR 01: IDENTITY
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
                  Privacy-Preserving On-Chain Verification
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Employees retain self-sovereign control of their cryptographic wallet keypair. Sensitive employee credentials (name, email, internal ID) are hashed locally using Keccak-256. Only the immutable cryptographic digest is committed to the <code className="text-cyber-cyan">Identity.sol</code> smart contract.
                </p>
                <div className="space-y-3 font-mono text-xs text-slate-300">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-vault-900 border border-vault-800">
                    <span className="flex h-6 w-6 items-center justify-center rounded bg-cyber-blue/20 text-cyber-blue">1</span>
                    <span>User supplies corporate credentials off-chain</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-vault-900 border border-vault-800">
                    <span className="flex h-6 w-6 items-center justify-center rounded bg-cyber-blue/20 text-cyber-blue">2</span>
                    <span>Keccak-256 produces 32-byte deterministic hash</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-vault-900 border border-vault-800">
                    <span className="flex h-6 w-6 items-center justify-center rounded bg-cyber-blue/20 text-cyber-blue">3</span>
                    <span>Admin verifies cryptographic claim on-chain</span>
                  </div>
                </div>
              </div>

              {/* Diagram */}
              <div className="rounded-2xl border border-vault-700 bg-vault-900/90 p-6 sm:p-8 font-mono text-xs shadow-2xl">
                <div className="text-slate-400 mb-4 pb-2 border-b border-vault-800 flex justify-between items-center">
                  <span>IDENTITY DATA FLOW</span>
                  <span className="text-cyber-cyan">SHA-256 / KECCAK</span>
                </div>
                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-vault-950 border border-vault-800 flex items-center justify-between">
                    <div>
                      <span className="text-slate-500">OFF-CHAIN: </span>
                      <span className="text-white">"EMP-004:Ananya Rao:Engineering"</span>
                    </div>
                    <span className="text-[10px] text-cyber-amber px-2 py-0.5 rounded bg-cyber-amber/10">Private</span>
                  </div>
                  <div className="text-center text-slate-600 text-lg">↓ Keccak-256 Hashing ↓</div>
                  <div className="p-3 rounded-lg bg-vault-950 border border-cyber-cyan/30 text-cyber-cyan break-all">
                    <div className="text-slate-500 text-[10px] mb-1">ON-CHAIN HASH RECORD:</div>
                    0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321
                  </div>
                  <div className="text-center text-slate-600 text-lg">↓ Smart Contract State ↓</div>
                  <div className="p-3 rounded-lg bg-vault-950 border border-vault-800 text-slate-300">
                    <div>verified: <span className="text-cyber-emerald">true</span></div>
                    <div>active: <span className="text-cyber-emerald">true</span></div>
                    <div>registeredAt: <span className="text-slate-400">1712390142 (Block #1042)</span></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSolutionPillar === 'access' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center animate-in fade-in duration-300">
              <div className="space-y-6">
                <div className="inline-block rounded-lg bg-cyber-indigo/10 border border-cyber-indigo/20 px-3 py-1 font-mono text-xs text-cyber-indigo">
                  PILLAR 02: ACCESS CONTROL
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
                  Contract-Enforced Role-Based Access (RBAC)
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Unlike traditional web applications where access controls exist only in frontend UI logic or API middleware, ChainVault enforces 11 granular permissions directly inside Solidity modifier checks. Direct contract calls without the required role automatically revert with explicit error signatures.
                </p>
                <div className="space-y-3 font-mono text-xs text-slate-300">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-vault-900 border border-vault-800">
                    <span className="flex h-6 w-6 items-center justify-center rounded bg-cyber-indigo/20 text-cyber-indigo">A</span>
                    <span>ADMIN: Complete governance, identity, minting & role assignment</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-vault-900 border border-vault-800">
                    <span className="flex h-6 w-6 items-center justify-center rounded bg-cyber-indigo/20 text-cyber-indigo">M</span>
                    <span>MANAGER: Allocate & transfer assigned department equipment</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-vault-900 border border-vault-800">
                    <span className="flex h-6 w-6 items-center justify-center rounded bg-cyber-indigo/20 text-cyber-indigo">AU</span>
                    <span>AUDITOR: Immutable read-only verification & historical analysis</span>
                  </div>
                </div>
              </div>

              {/* Diagram */}
              <div className="rounded-2xl border border-vault-700 bg-vault-900/90 p-6 sm:p-8 font-mono text-xs shadow-2xl">
                <div className="text-slate-400 mb-4 pb-2 border-b border-vault-800 flex justify-between items-center">
                  <span>SMART CONTRACT RBAC PIPELINE</span>
                  <span className="text-cyber-indigo">EVM ENFORCED</span>
                </div>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-vault-950 border border-vault-800 flex items-center justify-between">
                    <span>Identity (Wallet Address)</span>
                    <span className="text-cyber-cyan">0x7099...79C8</span>
                  </div>
                  <div className="text-center text-slate-600">↓ mapped to role ↓</div>
                  <div className="p-3 rounded-lg bg-vault-950 border border-vault-800 flex items-center justify-between">
                    <span>Assigned Role</span>
                    <span className="text-cyber-amber font-bold">MANAGER_ROLE</span>
                  </div>
                  <div className="text-center text-slate-600">↓ resolves permissions ↓</div>
                  <div className="p-3 rounded-lg bg-vault-950 border border-cyber-indigo/40 space-y-1">
                    <div className="text-slate-400 text-[10px]">ACTIVE PERMISSIONS:</div>
                    <div className="text-cyber-emerald">✓ ASSET_ASSIGN</div>
                    <div className="text-cyber-emerald">✓ ASSET_TRANSFER</div>
                    <div className="text-cyber-emerald">✓ AUDIT_VIEW</div>
                    <div className="text-cyber-rose">&times; ROLE_ASSIGN (Access Denied)</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSolutionPillar === 'assets' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center animate-in fade-in duration-300">
              <div className="space-y-6">
                <div className="inline-block rounded-lg bg-cyber-emerald/10 border border-cyber-emerald/20 px-3 py-1 font-mono text-xs text-cyber-emerald">
                  PILLAR 03: ASSETS
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
                  ERC-721 Tokenized Digital Asset Provenance
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Every company asset (corporate laptops, cloud software licenses, digital credentials, hardware security modules) is minted as a distinct ERC-721 Non-Fungible Token. The blockchain serves as the immutable single source of truth for custodial transfers and allocation history.
                </p>
                <div className="space-y-3 font-mono text-xs text-slate-300">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-vault-900 border border-vault-800">
                    <span className="flex h-6 w-6 items-center justify-center rounded bg-cyber-emerald/20 text-cyber-emerald">1</span>
                    <span>Admin mints NFT with verifiable serial # & metadata URI</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-vault-900 border border-vault-800">
                    <span className="flex h-6 w-6 items-center justify-center rounded bg-cyber-emerald/20 text-cyber-emerald">2</span>
                    <span>Asset allocated directly to employee's verified wallet</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-vault-900 border border-vault-800">
                    <span className="flex h-6 w-6 items-center justify-center rounded bg-cyber-emerald/20 text-cyber-emerald">3</span>
                    <span>Cryptographic transfer event recorded into AuditLogger</span>
                  </div>
                </div>
              </div>

              {/* Diagram */}
              <div className="rounded-2xl border border-vault-700 bg-vault-900/90 p-6 sm:p-8 font-mono text-xs shadow-2xl">
                <div className="text-slate-400 mb-4 pb-2 border-b border-vault-800 flex justify-between items-center">
                  <span>ERC-721 TOKEN SPECIFICATION</span>
                  <span className="text-cyber-emerald">STANDARDS COMPLIANT</span>
                </div>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-vault-950 border border-vault-800 flex justify-between">
                    <span className="text-slate-400">Token ID</span>
                    <span className="text-white font-bold">#1042</span>
                  </div>
                  <div className="p-3 rounded-lg bg-vault-950 border border-vault-800 flex justify-between">
                    <span className="text-slate-400">Asset Name</span>
                    <span className="text-white">Corporate Laptop LT-042</span>
                  </div>
                  <div className="p-3 rounded-lg bg-vault-950 border border-vault-800 flex justify-between">
                    <span className="text-slate-400">Serial Ref</span>
                    <span className="text-cyber-cyan">SN-MBP-2026-042</span>
                  </div>
                  <div className="p-3 rounded-lg bg-vault-950 border border-vault-800 flex justify-between">
                    <span className="text-slate-400">Current Owner</span>
                    <span className="text-cyber-emerald font-mono">0x90F7...b906 (Ananya Rao)</span>
                  </div>
                  <div className="p-3 rounded-lg bg-vault-950 border border-cyber-emerald/30 text-center text-cyber-emerald text-[11px]">
                    ✓ Verified on Local Ethereum EVM
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. INTERACTIVE SYSTEM ARCHITECTURE
      ───────────────────────────────────────────────────────────── */}
      <section id="architecture" className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-vault-800 bg-vault-900/20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="font-mono text-xs uppercase tracking-wider text-cyber-cyan mb-2">
              SYSTEM TOPOLOGY
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-bold text-white tracking-tight">
              Modular Smart Contract Infrastructure
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-slate-400">
              High-throughput interaction model separating client presentation, client-side signature generation, and on-chain contract logic.
            </p>
          </div>

          {/* Layered Flow Graphic */}
          <div className="space-y-4 max-w-4xl mx-auto font-mono text-xs">
            {/* Layer 1: Client */}
            <div className="p-5 rounded-2xl border border-vault-700 bg-vault-900/90 shadow-lg">
              <div className="flex items-center justify-between text-slate-400 mb-3 pb-2 border-b border-vault-800">
                <span className="text-cyber-cyan font-bold">LAYER 1: CLIENT PRESENTATION & WALLET</span>
                <span>METAMASK / BROWSER RUNTIME</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-vault-950 border border-vault-800 text-center">
                  <div className="text-white font-semibold mb-1">React 19 Frontend</div>
                  <div className="text-slate-500 text-[10px]">TypeScript / Tailwind CSS</div>
                </div>
                <div className="p-3 rounded-xl bg-vault-950 border border-vault-800 text-center">
                  <div className="text-white font-semibold mb-1">Ethers.js v6</div>
                  <div className="text-slate-500 text-[10px]">JsonRpcProvider / BrowserProvider</div>
                </div>
                <div className="p-3 rounded-xl bg-vault-950 border border-vault-800 text-center">
                  <div className="text-white font-semibold mb-1">MetaMask Key Custody</div>
                  <div className="text-slate-500 text-[10px]">ECDSA Secp256k1 Signatures</div>
                </div>
              </div>
            </div>

            <div className="text-center text-slate-600 font-bold text-sm">↓ JSON-RPC 2.0 WebSockets / HTTP (Port 8545) ↓</div>

            {/* Layer 2: Smart Contract Layer */}
            <div className="p-5 rounded-2xl border border-cyber-cyan/40 bg-vault-900/95 shadow-xl shadow-cyber-cyan/5">
              <div className="flex items-center justify-between text-slate-400 mb-3 pb-2 border-b border-vault-800">
                <span className="text-cyber-cyan font-bold">LAYER 2: SOLIDITY SMART CONTRACT LAYER</span>
                <span>EVM CANCUN (Solidity 0.8.24)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-vault-950 border border-vault-800">
                  <div className="text-cyber-cyan font-semibold mb-1">Identity.sol</div>
                  <div className="text-slate-400 text-[10px] leading-tight">Registers cryptographic hashes, verifications, & deactivations</div>
                </div>
                <div className="p-3 rounded-xl bg-vault-950 border border-vault-800">
                  <div className="text-cyber-indigo font-semibold mb-1">AccessControl.sol</div>
                  <div className="text-slate-400 text-[10px] leading-tight">Enforces 4 roles & 11 granular permissions on EVM</div>
                </div>
                <div className="p-3 rounded-xl bg-vault-950 border border-vault-800">
                  <div className="text-cyber-emerald font-semibold mb-1">AssetNFT.sol</div>
                  <div className="text-slate-400 text-[10px] leading-tight">ERC-721 token minting, assignment & transfers</div>
                </div>
                <div className="p-3 rounded-xl bg-vault-950 border border-vault-800">
                  <div className="text-cyber-amber font-semibold mb-1">AuditLogger.sol</div>
                  <div className="text-slate-400 text-[10px] leading-tight">Append-only security event emission & chronological index</div>
                </div>
              </div>
            </div>

            <div className="text-center text-slate-600 font-bold text-sm">↓ Hardhat Consensus Engine (Chain ID 31337) ↓</div>

            {/* Layer 3: Immutable Blockchain */}
            <div className="p-5 rounded-2xl border border-vault-700 bg-vault-900/90 shadow-lg">
              <div className="flex items-center justify-between text-slate-400 mb-3 pb-2 border-b border-vault-800">
                <span className="text-cyber-emerald font-bold">LAYER 3: IMMUTABLE DISTRIBUTED LEDGER</span>
                <span>TAMPER-EVIDENT REVENUE & AUDIT LOG</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-vault-950 border border-vault-800 text-center">
                  <div className="text-white font-semibold mb-1">Block Cryptographic Hashes</div>
                  <div className="text-slate-500 text-[10px]">Merkle Patricia Trees</div>
                </div>
                <div className="p-3 rounded-xl bg-vault-950 border border-vault-800 text-center">
                  <div className="text-white font-semibold mb-1">State Trie Storage</div>
                  <div className="text-slate-500 text-[10px]">Deterministic contract storage</div>
                </div>
                <div className="p-3 rounded-xl bg-vault-950 border border-vault-800 text-center">
                  <div className="text-white font-semibold mb-1">Event Bloom Filters</div>
                  <div className="text-slate-500 text-[10px]">Fast audit trail query resolution</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. REAL-WORLD CORPORATE USE CASE
      ───────────────────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-vault-800">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14">
            <div className="font-mono text-xs uppercase tracking-wider text-cyber-cyan mb-2">
              APPLIED ENTERPRISE CASE STUDY
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-bold text-white tracking-tight">
              Corporate Governance Demonstration
            </h2>
            <p className="mt-4 max-w-2xl text-sm sm:text-base text-slate-400">
              Review how a multinational technology organization tracks employee lifecycles, role delegations, and high-value hardware custody.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Stakeholder 1 */}
            <div className="rounded-2xl border border-vault-800 bg-vault-900/60 p-5 font-mono text-xs">
              <div className="text-cyber-rose font-bold mb-1">ADMINISTRATOR</div>
              <div className="text-white font-semibold text-sm mb-1">Arjun Mehta</div>
              <div className="text-slate-400 text-[11px] mb-3">EMP-001 &bull; Security Admin</div>
              <div className="p-2.5 rounded-lg bg-vault-950 border border-vault-800 text-[10px] text-slate-400 space-y-1">
                <div>&bull; Verifies employee credentials</div>
                <div>&bull; Configures system RBAC</div>
                <div>&bull; Mints high-value asset NFTs</div>
              </div>
            </div>

            {/* Stakeholder 2 */}
            <div className="rounded-2xl border border-vault-800 bg-vault-900/60 p-5 font-mono text-xs">
              <div className="text-cyber-amber font-bold mb-1">DEPARTMENT MANAGER</div>
              <div className="text-white font-semibold text-sm mb-1">Priya Sharma</div>
              <div className="text-slate-400 text-[11px] mb-3">EMP-002 &bull; IT Asset Operations</div>
              <div className="p-2.5 rounded-lg bg-vault-950 border border-vault-800 text-[10px] text-slate-400 space-y-1">
                <div>&bull; Manages team inventory</div>
                <div>&bull; Allocates corporate laptops</div>
                <div>&bull; Transfers licenses to staff</div>
              </div>
            </div>

            {/* Stakeholder 3 */}
            <div className="rounded-2xl border border-vault-800 bg-vault-900/60 p-5 font-mono text-xs">
              <div className="text-cyber-cyan font-bold mb-1">COMPLIANCE AUDITOR</div>
              <div className="text-white font-semibold text-sm mb-1">Rahul Verma</div>
              <div className="text-slate-400 text-[11px] mb-3">EMP-003 &bull; Governance & Audit</div>
              <div className="p-2.5 rounded-lg bg-vault-950 border border-vault-800 text-[10px] text-slate-400 space-y-1">
                <div>&bull; Read-only audit verification</div>
                <div>&bull; Checks cryptographic hashes</div>
                <div>&bull; Validates historical custody</div>
              </div>
            </div>

            {/* Stakeholder 4 */}
            <div className="rounded-2xl border border-vault-800 bg-vault-900/60 p-5 font-mono text-xs">
              <div className="text-cyber-blue font-bold mb-1">EMPLOYEE (USER)</div>
              <div className="text-white font-semibold text-sm mb-1">Ananya Rao</div>
              <div className="text-slate-400 text-[11px] mb-3">EMP-004 &bull; Core Engineering</div>
              <div className="p-2.5 rounded-lg bg-vault-950 border border-vault-800 text-[10px] text-slate-400 space-y-1">
                <div>&bull; Owns Laptop LT-042 (NFT #1)</div>
                <div>&bull; Holds ISO/IEC Cert DC-031</div>
                <div>&bull; Can initiate permitted transfer</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. UN SUSTAINABLE DEVELOPMENT GOALS (SDG IMPACT)
      ───────────────────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-vault-800 bg-vault-900/30">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="font-mono text-xs uppercase tracking-wider text-cyber-emerald mb-2">
              GLOBAL IMPACT & ALIGNMENT
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-bold text-white tracking-tight">
              United Nations Sustainable Development Goals
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-slate-400">
              Demonstrating how decentralized cryptographic infrastructure contributes to institutional transparency, accountable infrastructure, and secure economic digital assets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* SDG 9 */}
            <div className="rounded-2xl border border-vault-800 bg-vault-900/80 p-6 flex flex-col justify-between">
              <div>
                <div className="inline-block rounded-lg bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 text-[11px] font-mono font-bold text-amber-400 mb-4">
                  PRIMARY &bull; SDG 9
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Industry, Innovation & Infrastructure</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Demonstrates resilient digital infrastructure powered by smart contracts, eliminating single vendor dependencies and fragile centralized bottlenecks.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-vault-800 text-[10px] font-mono text-slate-500">
                Target 9.1: Resilient Infrastructure
              </div>
            </div>

            {/* SDG 16 */}
            <div className="rounded-2xl border border-vault-800 bg-vault-900/80 p-6 flex flex-col justify-between">
              <div>
                <div className="inline-block rounded-lg bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 text-[11px] font-mono font-bold text-blue-400 mb-4">
                  PRIMARY &bull; SDG 16
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Peace, Justice & Strong Institutions</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Promotes institutional accountability through mathematically tamper-evident records, transparent permission logs, and verifiable ownership histories.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-vault-800 text-[10px] font-mono text-slate-500">
                Target 16.6: Accountable Institutions
              </div>
            </div>

            {/* SDG 8 */}
            <div className="rounded-2xl border border-vault-800 bg-vault-900/80 p-6 flex flex-col justify-between">
              <div>
                <div className="inline-block rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-[11px] font-mono font-bold text-emerald-400 mb-4">
                  SECONDARY &bull; SDG 8
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Decent Work & Economic Growth</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Enables secure organizational digital asset tracking, protecting corporate intellectual property and streamlining distributed remote workforce workflows.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-vault-800 text-[10px] font-mono text-slate-500">
                Target 8.2: Economic Productivity
              </div>
            </div>

            {/* SDG 4 */}
            <div className="rounded-2xl border border-vault-800 bg-vault-900/80 p-6 flex flex-col justify-between">
              <div>
                <div className="inline-block rounded-lg bg-red-500/10 border border-red-500/20 px-2.5 py-1 text-[11px] font-mono font-bold text-red-400 mb-4">
                  SECONDARY &bull; SDG 4
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Quality Education</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Provides a tamper-proof credentialing architecture for verifiable digital certificates, diplomas, and technical certifications directly linked to verified identities.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-vault-800 text-[10px] font-mono text-slate-500">
                Target 4.4: Relevant Skills Verification
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. ACADEMIC LIMITATIONS & FUTURE SCOPE
      ───────────────────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-vault-800">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Limitations */}
            <div>
              <div className="font-mono text-xs uppercase tracking-wider text-cyber-amber mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" /> ACADEMIC CREDIBILITY & LIMITATIONS
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-6">
                Technical Demarcations
              </h2>
              <div className="space-y-4 text-xs text-slate-400 leading-relaxed">
                <div className="p-4 rounded-xl bg-vault-900 border border-vault-800">
                  <strong className="text-white">1. Wallet Keypairs vs W3C DIDs:</strong> Raw public wallet keys act as cryptographic handles. They do not constitute full W3C DID specifications (e.g. DID documents, service endpoints) without an interoperable resolution layer.
                </div>
                <div className="p-4 rounded-xl bg-vault-900 border border-vault-800">
                  <strong className="text-white">2. Token vs Physical State:</strong> The NFT certifies ownership of the digital record. External mechanisms (QR, RFID, serial tags, physical inspection) are necessary to ascertain physical existence and condition.
                </div>
                <div className="p-4 rounded-xl bg-vault-900 border border-vault-800">
                  <strong className="text-white">3. Off-Chain Privacy:</strong> Sensitive PII (names, national IDs, salary) must never be written on a public chain. Only unidirectional hashes and cryptographic commitments belong on-chain.
                </div>
                <div className="p-4 rounded-xl bg-vault-900 border border-vault-800">
                  <strong className="text-white">4. Scalability & Gas Costs:</strong> While private enterprise sidechains mitigate fees, public EVM deployments necessitate rollups or Layer-2 state channels to handle high-frequency event volumes.
                </div>
              </div>
            </div>

            {/* Future Scope */}
            <div>
              <div className="font-mono text-xs uppercase tracking-wider text-cyber-cyan mb-2 flex items-center gap-2">
                <GitBranch className="h-4 w-4" /> RESEARCH HORIZON
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-6">
                Future Technical Scope
              </h2>
              <div className="space-y-4 text-xs text-slate-400 leading-relaxed">
                <div className="p-4 rounded-xl bg-vault-900 border border-vault-800">
                  <strong className="text-white">&bull; Zero-Knowledge Proofs (zk-SNARKs):</strong> Allow employees to prove authorization or department affiliation without revealing their wallet address or employee serial number.
                </div>
                <div className="p-4 rounded-xl bg-vault-900 border border-vault-800">
                  <strong className="text-white">&bull; IPFS / Filecoin Integration:</strong> Content-addressed storage for encrypted corporate metadata, warranty documents, and device specifications.
                </div>
                <div className="p-4 rounded-xl bg-vault-900 border border-vault-800">
                  <strong className="text-white">&bull; Hardware Security Modules (HSM):</strong> Native PKI integration enabling YubiKeys and TPM chips to sign blockchain transactions directly.
                </div>
                <div className="p-4 rounded-xl bg-vault-900 border border-vault-800">
                  <strong className="text-white">&bull; Cross-Chain Asset Bridging:</strong> Interoperability across enterprise networks (Hyperledger Besu, Polygon Supernets, Arbitrum Orbit).
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. CALL TO ACTION BANNER
      ───────────────────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-radial-vignette text-center">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
            Experience the Security Architecture in Action
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto mb-8">
            Access the role-based dashboards, mint and transfer ERC-721 digital asset tokens, verify cryptographic hashes, and inspect the real-time audit ledger.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onEnterPlatform}
              className="inline-flex items-center gap-2 rounded-xl bg-cyber-cyan px-8 py-3.5 text-sm font-semibold text-vault-950 hover:bg-sky-300 transition-all shadow-xl shadow-cyber-cyan/20 cursor-pointer"
            >
              <span>Launch Enterprise Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
