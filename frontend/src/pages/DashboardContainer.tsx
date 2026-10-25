import React, { useState } from 'react';
import {
  LayoutDashboard, ShieldCheck, Terminal, Box,
  LogOut, ChevronLeft, ChevronRight, AlertCircle,
  Menu, X
} from 'lucide-react';
import { Role, TxStatus } from '../types';
import { blockchainService } from '../services/blockchain';
import { AdminDashboard }   from './dashboards/AdminDashboard';
import { ManagerDashboard } from './dashboards/ManagerDashboard';
import { AuditorDashboard } from './dashboards/AuditorDashboard';
import { UserDashboard }    from './dashboards/UserDashboard';
import { AuditTrailPage }   from './AuditTrailPage';
import { ExplorerPage }     from './ExplorerPage';
import { PublicVerifyPage } from './PublicVerifyPage';
import { TransactionModal } from '../components/TransactionModal';

interface DashboardContainerProps {
  activeRole: Role;
  walletAddress: string;
  onNavigateHome: () => void;
  onRoleChange: (role: Role) => void;
}

type Section = 'console' | 'audit' | 'explorer' | 'verify';

const ROLE_COLORS: Record<Role, { badge: string; dot: string; label: string }> = {
  ADMIN:   { badge: 'role-admin',   dot: 'bg-cyber-rose',    label: 'System Admin'     },
  MANAGER: { badge: 'role-manager', dot: 'bg-cyber-amber',   label: 'Dept. Manager'    },
  AUDITOR: { badge: 'role-auditor', dot: 'bg-cyber-cyan',    label: 'Compliance Audit' },
  USER:    { badge: 'role-user',    dot: 'bg-slate-400',     label: 'Stakeholder'      },
};

const NAV_ITEMS = [
  { id: 'console',  label: 'Workspace',    icon: LayoutDashboard, color: 'text-cyber-cyan' },
  { id: 'audit',    label: 'Audit Ledger', icon: ShieldCheck,     color: 'text-cyber-emerald' },
  { id: 'explorer', label: 'Block Explorer', icon: Terminal,      color: 'text-cyber-indigo' },
  { id: 'verify',   label: 'Asset Verifier', icon: Box,           color: 'text-cyber-amber' },
] as const;

const ROLE_QUICK_SWITCH: { role: Role; label: string }[] = [
  { role: 'ADMIN',   label: 'Admin'   },
  { role: 'MANAGER', label: 'Manager' },
  { role: 'AUDITOR', label: 'Auditor' },
  { role: 'USER',    label: 'User'    },
];

export const DashboardContainer: React.FC<DashboardContainerProps> = ({
  activeRole, walletAddress, onNavigateHome, onRoleChange,
}) => {
  const [activeSection, setActiveSection] = useState<Section>('console');
  const [txStatus, setTxStatus] = useState<TxStatus | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const currentProfile = blockchainService.getUserProfile(walletAddress);
  const roleStyle = ROLE_COLORS[activeRole];

  // Centralized transaction execution with animated stages
  const executeBlockchainTx = async (
    actionFn: () => Promise<any>,
    title: string,
    _initialMsg: string
  ) => {
    try {
      setTxStatus({ step: 'preparing', title: `Preparing: ${title}`, message: 'Validating parameters and estimating EVM gas cost...' });
      await new Promise(r => setTimeout(r, 500));

      setTxStatus({ step: 'wallet_signature', title: 'Awaiting Authorization', message: 'Sign the transaction in MetaMask or the simulated keystore...' });
      await new Promise(r => setTimeout(r, 700));

      setTxStatus({ step: 'confirming', title: 'Broadcasting to EVM', message: 'Transaction submitted · awaiting block confirmation...' });
      const txRecord = await actionFn();

      setTxStatus({
        step: 'confirmed',
        title: 'Transaction Confirmed ✓',
        message: `${title} was permanently recorded on-chain.`,
        txHash: txRecord?.hash,
        blockNumber: txRecord?.blockNumber,
      });
    } catch (err: any) {
      setTxStatus({
        step: 'failed',
        title: 'Transaction Reverted',
        message: 'The EVM rejected this transaction.',
        error: err.message || 'Smart contract execution reverted.',
      });
    }
  };

  const handleSectionChange = (section: Section) => {
    setActiveSection(section);
    setMobileSidebarOpen(false);
  };

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <aside
      className={`flex flex-col justify-between border-r border-vault-800 bg-vault-900/70 backdrop-blur-md transition-all duration-200 ${
        mobile
          ? 'fixed inset-y-0 left-0 z-40 w-64 shadow-modal'
          : sidebarCollapsed
            ? 'w-14 shrink-0'
            : 'w-52 shrink-0 hidden md:flex'
      } ${mobile ? 'flex' : ''}`}
      style={{ paddingTop: mobile ? 'var(--navbar-height)' : 0 }}
    >
      <div className="flex flex-col h-full overflow-hidden">
        {/* Identity Badge */}
        <div className={`p-3 border-b border-vault-800 ${sidebarCollapsed && !mobile ? 'flex justify-center' : ''}`}>
          {(!sidebarCollapsed || mobile) ? (
            <div className="rounded-xl border border-vault-700 bg-vault-950/80 p-3 space-y-2">
              <div className="flex items-center gap-2">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold font-mono border ${roleStyle.badge}`}>
                  {currentProfile.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-white truncate">{currentProfile.name}</div>
                  <div className="text-[9px] text-slate-500 font-mono truncate">{currentProfile.employeeId}</div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-1.5 border-t border-vault-800">
                <span className="text-[9px] font-mono text-slate-600 uppercase tracking-wider">Access Level</span>
                <span className={`tech-badge px-1.5 py-0.5 rounded border ${roleStyle.badge}`}>
                  {activeRole}
                </span>
              </div>
            </div>
          ) : (
            <div className={`h-8 w-8 flex items-center justify-center rounded-lg text-[10px] font-bold font-mono border ${roleStyle.badge}`}>
              {currentProfile.name.slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(({ id, label, icon: Icon, color }) => {
            const active = activeSection === id;
            return (
              <button
                key={id}
                onClick={() => handleSectionChange(id as Section)}
                title={sidebarCollapsed && !mobile ? label : undefined}
                className={`w-full flex items-center gap-3 rounded-xl transition-all text-[11px] font-medium ${
                  sidebarCollapsed && !mobile ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5'
                } ${
                  active
                    ? 'bg-vault-800/80 text-white border border-vault-700'
                    : 'text-slate-400 hover:text-white hover:bg-vault-800/40'
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${active ? color : ''}`} />
                {(!sidebarCollapsed || mobile) && <span>{label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Bottom: Role Switcher + Exit */}
        <div className={`border-t border-vault-800 p-2 space-y-2 ${sidebarCollapsed && !mobile ? 'hidden' : 'block'}`}>
          <div className="text-[9px] text-slate-600 uppercase tracking-wider font-mono px-1">Quick Role Switch</div>
          <div className="grid grid-cols-2 gap-1">
            {ROLE_QUICK_SWITCH.map(({ role, label }) => (
              <button
                key={role}
                onClick={() => onRoleChange(role)}
                className={`py-1.5 rounded-lg text-[10px] font-mono font-semibold border transition-colors ${
                  activeRole === role
                    ? ROLE_COLORS[role].badge + ' border-current'
                    : 'border-vault-700 text-slate-500 hover:text-slate-200 hover:bg-vault-800/40'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            onClick={onNavigateHome}
            className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-vault-800/60 hover:bg-vault-700/60 border border-vault-700 py-1.5 text-[10px] font-mono text-slate-400 hover:text-white transition-colors"
          >
            <LogOut className="h-3 w-3" /> Exit Platform
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="flex min-h-screen-nav bg-vault-950 text-slate-100 overflow-hidden" style={{ minHeight: 'calc(100vh - var(--navbar-height))' }}>
      {/* Transaction Modal */}
      <TransactionModal
        status={txStatus}
        onClose={() => setTxStatus(null)}
        onViewExplorer={() => setActiveSection('explorer')}
      />

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <>
          <div className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden" onClick={() => setMobileSidebarOpen(false)} />
          <Sidebar mobile />
        </>
      )}

      {/* Desktop Sidebar */}
      <div className={`hidden md:flex flex-col border-r border-vault-800 bg-vault-900/60 backdrop-blur-md transition-all duration-200 ${sidebarCollapsed ? 'w-14' : 'w-52'}`}>
        {/* Collapse Toggle */}
        <div className="flex justify-end p-2 border-b border-vault-800">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="flex items-center justify-center w-6 h-6 rounded-lg border border-vault-700 bg-vault-950/60 text-slate-500 hover:text-white hover:border-vault-600 transition-all"
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
          </button>
        </div>

        {/* Identity Badge */}
        <div className={`p-2 border-b border-vault-800 ${sidebarCollapsed ? 'flex justify-center' : ''}`}>
          {!sidebarCollapsed ? (
            <div className="rounded-xl border border-vault-700 bg-vault-950/80 p-3 space-y-2">
              <div className="flex items-center gap-2">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold font-mono border ${roleStyle.badge}`}>
                  {currentProfile.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-white truncate">{currentProfile.name}</div>
                  <div className="text-[9px] text-slate-500 font-mono truncate">{currentProfile.employeeId}</div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-1.5 border-t border-vault-800">
                <span className="text-[9px] font-mono text-slate-600 uppercase">Access</span>
                <span className={`tech-badge px-1.5 py-0.5 rounded border ${roleStyle.badge}`}>{activeRole}</span>
              </div>
            </div>
          ) : (
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg text-[10px] font-bold font-mono border ${roleStyle.badge}`}>
              {currentProfile.name.slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-2 space-y-0.5">
          {NAV_ITEMS.map(({ id, label, icon: Icon, color }) => {
            const active = activeSection === id;
            return (
              <button
                key={id}
                onClick={() => handleSectionChange(id as Section)}
                title={sidebarCollapsed ? label : undefined}
                className={`w-full flex items-center gap-2.5 rounded-xl transition-all text-[11px] font-medium ${
                  sidebarCollapsed ? 'justify-center px-0 py-2.5' : 'px-3 py-2.5'
                } ${
                  active
                    ? 'bg-vault-800/80 text-white border border-vault-700'
                    : 'text-slate-400 hover:text-white hover:bg-vault-800/40'
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${active ? color : ''}`} />
                {!sidebarCollapsed && <span>{label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        {!sidebarCollapsed && (
          <div className="border-t border-vault-800 p-2 space-y-2">
            <div className="text-[9px] text-slate-600 uppercase tracking-wider font-mono px-1">Role Switch</div>
            <div className="grid grid-cols-2 gap-1">
              {ROLE_QUICK_SWITCH.map(({ role, label }) => (
                <button
                  key={role}
                  onClick={() => onRoleChange(role)}
                  className={`py-1 rounded-lg text-[9px] font-mono font-bold border transition-colors ${
                    activeRole === role
                      ? ROLE_COLORS[role].badge + ' border-current'
                      : 'border-vault-700 text-slate-500 hover:text-slate-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <button
              onClick={onNavigateHome}
              className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-vault-800/60 hover:bg-vault-700/60 border border-vault-700 py-1.5 text-[10px] font-mono text-slate-400 hover:text-white transition-colors"
            >
              <LogOut className="h-3 w-3" /> Exit
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between px-4 py-2.5 border-b border-vault-800 bg-vault-900/60 sticky top-0 z-20">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="flex items-center gap-2 text-[11px] font-mono text-slate-300"
          >
            <Menu className="h-4 w-4" />
            <span className={`tech-badge px-1.5 py-0.5 rounded border ${roleStyle.badge}`}>{activeRole}</span>
          </button>
          <span className="text-[11px] font-bold text-white">
            {NAV_ITEMS.find(n => n.id === activeSection)?.label}
          </span>
        </div>

        <div className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
          {activeSection === 'console' && (
            <>
              {activeRole === 'ADMIN'   && <AdminDashboard   onExecuteTx={executeBlockchainTx} walletAddress={walletAddress} />}
              {activeRole === 'MANAGER' && <ManagerDashboard onExecuteTx={executeBlockchainTx} walletAddress={walletAddress} />}
              {activeRole === 'AUDITOR' && <AuditorDashboard />}
              {activeRole === 'USER'    && <UserDashboard    onExecuteTx={executeBlockchainTx} walletAddress={walletAddress} />}
            </>
          )}
          {activeSection === 'audit'    && <AuditTrailPage />}
          {activeSection === 'explorer' && <ExplorerPage />}
          {activeSection === 'verify'   && <PublicVerifyPage />}
        </div>
      </main>
    </div>
  );
};
