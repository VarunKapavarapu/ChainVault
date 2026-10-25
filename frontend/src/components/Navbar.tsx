import React, { useState, useEffect, useRef } from 'react';
import {
  Shield, ChevronDown, Check, Zap, Eye, Terminal, Search,
  RefreshCw, AlertCircle, Menu, X, LayoutDashboard
} from 'lucide-react';
import { Role } from '../types';
import { DEMO_PROFILES } from '../services/mockData';
import { blockchainService } from '../services/blockchain';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  activeRole: Role;
  onRoleChange: (role: Role) => void;
  walletAddress: string;
  isDemoMode: boolean;
  onConnectWallet: () => void;
  onResetData: () => void;
}

const ROLE_COLORS: Record<Role, string> = {
  ADMIN:   'role-admin',
  MANAGER: 'role-manager',
  AUDITOR: 'role-auditor',
  USER:    'role-user',
};

export const Navbar: React.FC<NavbarProps> = ({
  currentView, onNavigate, activeRole, onRoleChange,
  walletAddress, isDemoMode, onConnectWallet, onResetData,
}) => {
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentProfile = blockchainService.getUserProfile(walletAddress);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setRoleDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setMobileMenuOpen(false), [currentView]);

  const navLinks = [
    { id: 'landing',   label: 'Overview',     icon: null },
    { id: 'verify',    label: 'Verifier',      icon: <Search className="h-3.5 w-3.5" /> },
    { id: 'audit',     label: 'Audit Ledger',  icon: <Eye className="h-3.5 w-3.5" /> },
    { id: 'explorer',  label: 'EVM Explorer',  icon: <Terminal className="h-3.5 w-3.5" /> },
  ];

  return (
    <header className="sticky top-0 z-50 w-full" style={{ height: 'var(--navbar-height)' }}>
      {/* Demo Banner (inline, not stacking) */}
      {isDemoMode && (
        <div className="bg-cyber-amber/10 border-b border-cyber-amber/15 px-4 py-1 flex items-center justify-between gap-3 text-[10px] font-mono text-cyber-amber"
             style={{ height: '28px' }}>
          <div className="flex items-center gap-2 truncate">
            <AlertCircle className="h-3 w-3 shrink-0" />
            <span className="hidden sm:inline">
              <strong>DEMO MODE</strong> · Transactions are simulated in-memory on a local EVM fork.
            </span>
            <span className="sm:hidden"><strong>DEMO MODE</strong> · Simulated EVM</span>
          </div>
          <button
            onClick={onResetData}
            className="flex items-center gap-1 rounded bg-cyber-amber/20 px-2 py-0.5 text-[10px] hover:bg-cyber-amber/30 transition-colors shrink-0"
          >
            <RefreshCw className="h-2.5 w-2.5" /> Reset
          </button>
        </div>
      )}

      {/* Main Nav Bar */}
      <div
        className="w-full border-b border-white/[0.06] bg-vault-950/90 backdrop-blur-2xl"
        style={{ height: isDemoMode ? 'calc(var(--navbar-height) - 28px)' : 'var(--navbar-height)' }}
      >
        <div className="mx-auto flex h-full w-full max-w-screen-2xl items-center justify-between px-4 sm:px-6">

          {/* ── LEFT: Brand ── */}
          <div className="flex items-center gap-5">
            <button
              onClick={() => onNavigate('landing')}
              className="flex items-center gap-2.5 group focus:outline-none shrink-0"
            >
              <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-vault-850 border border-vault-700 text-cyber-cyan shadow-cyan-glow group-hover:border-cyber-cyan/50 transition-all">
                <Shield className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-cyan opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyber-cyan" />
                </span>
              </div>
              <div className="hidden sm:block">
                <div className="font-display font-black text-[15px] tracking-tight text-white flex items-center gap-1.5">
                  CHAINVAULT
                  <span className="rounded bg-cyber-cyan/12 px-1.5 py-0.5 text-[9px] font-mono font-bold text-cyber-cyan border border-cyber-cyan/20">
                    ENT
                  </span>
                </div>
                <div className="text-[9px] font-mono text-slate-500 flex items-center gap-1.5">
                  <span className="flex items-center gap-1 text-cyber-emerald">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyber-emerald animate-pulse" />
                    Chain 31337
                  </span>
                  <span>·</span>
                  <span>Solidity 0.8.24</span>
                </div>
              </div>
            </button>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-1 text-[11px] font-medium text-slate-400 border-l border-vault-800 pl-5">
              {navLinks.map(link => (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
                    currentView === link.id
                      ? 'bg-vault-800/80 text-white border border-vault-700'
                      : 'hover:text-white hover:bg-vault-900/60'
                  }`}
                >
                  {link.icon}
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* ── RIGHT: Controls ── */}
          <div className="flex items-center gap-2">

            {/* Role Switcher Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="hidden sm:flex items-center gap-2 rounded-xl bg-vault-900/80 border border-vault-700 px-2.5 py-1.5 text-[11px] text-slate-200 hover:border-vault-600 transition-all"
                title="Switch demo persona"
              >
                <div className={`flex h-6 w-6 items-center justify-center rounded-md text-[9px] font-bold font-mono border ${ROLE_COLORS[activeRole]}`}>
                  {currentProfile.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="hidden md:flex flex-col text-left leading-none">
                  <span className="text-[9px] text-slate-500 uppercase tracking-widest font-mono">Persona</span>
                  <span className="font-semibold text-white text-[11px]">{currentProfile.name.split(' ')[0]}</span>
                </div>
                <span className={`tech-badge px-1.5 py-0.5 rounded border ${ROLE_COLORS[activeRole]}`}>
                  {activeRole}
                </span>
                <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform ${roleDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-72 rounded-2xl border border-vault-700 bg-vault-900/98 p-2 shadow-modal backdrop-blur-2xl z-50 animate-fade-in">
                  <div className="px-3 py-2 text-[10px] font-semibold text-slate-400 font-mono uppercase tracking-wider border-b border-vault-800 mb-1.5 flex justify-between items-center">
                    <span>Switch Stakeholder</span>
                    <span className="text-cyber-cyan">Live Demo</span>
                  </div>
                  {Object.values(DEMO_PROFILES).map((prof) => (
                    <button
                      key={prof.walletAddress}
                      onClick={() => { onRoleChange(prof.role); setRoleDropdownOpen(false); }}
                      className={`w-full flex items-center justify-between rounded-xl p-2.5 text-left text-[11px] transition-colors mb-0.5 ${
                        prof.role === activeRole
                          ? 'bg-vault-800/80 border border-vault-700'
                          : 'hover:bg-vault-800/50'
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-white flex items-center gap-2 mb-0.5">
                          {prof.name}
                          <span className={`tech-badge px-1.5 py-0.5 rounded border ${ROLE_COLORS[prof.role]}`}>
                            {prof.role}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">{prof.department}</div>
                      </div>
                      {prof.role === activeRole && <Check className="h-3.5 w-3.5 text-cyber-cyan shrink-0" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Wallet Badge */}
            <button
              onClick={onConnectWallet}
              className="hidden sm:flex items-center gap-1.5 rounded-xl bg-vault-900/80 border border-vault-700 px-2.5 py-1.5 text-[11px] font-mono text-slate-300 hover:border-vault-600 transition-colors"
              title="Connect MetaMask wallet"
            >
              <div className={`h-2 w-2 rounded-full ${isDemoMode ? 'bg-cyber-amber animate-pulse' : 'bg-cyber-emerald'}`} />
              <span>{walletAddress.slice(0, 6)}···{walletAddress.slice(-4)}</span>
            </button>

            {/* Launch Dashboard */}
            <button
              onClick={() => onNavigate('dashboard')}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[11px] font-bold transition-all ${
                currentView === 'dashboard'
                  ? 'bg-cyber-cyan text-vault-950 shadow-cyan-glow'
                  : 'bg-white text-vault-950 hover:bg-slate-200'
              }`}
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg border border-vault-700 bg-vault-900/80 text-slate-300 hover:text-white hover:border-vault-600 transition-all"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-vault-800 bg-vault-900/98 backdrop-blur-2xl px-4 py-3 space-y-1 animate-fade-in">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={`w-full flex items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs transition-colors ${
                  currentView === link.id
                    ? 'bg-vault-800 text-white border border-vault-700'
                    : 'text-slate-300 hover:text-white hover:bg-vault-800/60'
                }`}
              >
                {link.icon}
                {link.label}
              </button>
            ))}
            {/* Mobile persona switcher */}
            <div className="pt-2 border-t border-vault-800">
              <div className="text-[9px] font-mono text-slate-500 uppercase tracking-wider mb-1.5">Switch Role</div>
              <div className="grid grid-cols-2 gap-1.5">
                {Object.values(DEMO_PROFILES).map(prof => (
                  <button
                    key={prof.role}
                    onClick={() => { onRoleChange(prof.role); setMobileMenuOpen(false); }}
                    className={`flex items-center justify-between rounded-lg px-2.5 py-2 text-[10px] font-mono border transition-colors ${
                      prof.role === activeRole
                        ? ROLE_COLORS[prof.role] + ' border-current'
                        : 'border-vault-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{prof.role}</span>
                    {prof.role === activeRole && <Check className="h-3 w-3" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
