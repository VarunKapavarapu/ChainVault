import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { DashboardContainer } from './pages/DashboardContainer';
import { PublicVerifyPage } from './pages/PublicVerifyPage';
import { AuditTrailPage } from './pages/AuditTrailPage';
import { ExplorerPage } from './pages/ExplorerPage';
import { blockchainService } from './services/blockchain';
import { Role } from './types';

export function App() {
  const [currentView, setCurrentView] = useState<string>('landing');
  const [activeRole, setActiveRole] = useState<Role>(blockchainService.currentRole);
  const [walletAddress, setWalletAddress] = useState<string>(blockchainService.currentAccount);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(blockchainService.isDemoMode);

  const handleRoleChange = (newRole: Role) => {
    setActiveRole(newRole);
    blockchainService.switchDemoAccount(newRole);
    setWalletAddress(blockchainService.currentAccount);
  };

  const handleConnectWallet = async () => {
    try {
      const { address, role } = await blockchainService.connectMetaMask();
      setWalletAddress(address);
      setActiveRole(role);
      setIsDemoMode(blockchainService.isDemoMode);
    } catch (err: any) {
      alert(err.message || 'Failed to connect wallet');
    }
  };

  const handleResetData = () => {
    if (confirm('Reset simulated blockchain state to factory demo values?')) {
      blockchainService.resetToDefault();
      setWalletAddress(blockchainService.currentAccount);
      setActiveRole(blockchainService.currentRole);
      window.location.reload();
    }
  };

  // Standalone page views (with footer)
  const standaloneViews = ['landing', 'verify', 'audit', 'explorer'];

  return (
    <div className="min-h-screen flex flex-col bg-vault-950 text-slate-100 font-sans selection:bg-cyber-cyan/20 selection:text-white">
      {/* Navbar — always visible */}
      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
        activeRole={activeRole}
        onRoleChange={handleRoleChange}
        walletAddress={walletAddress}
        isDemoMode={isDemoMode}
        onConnectWallet={handleConnectWallet}
        onResetData={handleResetData}
      />

      {/* Main Content Router */}
      <div className="flex-1 flex flex-col">
        {/* Landing Page */}
        {currentView === 'landing' && (
          <LandingPage
            onEnterPlatform={() => setCurrentView('dashboard')}
            onExploreArchitecture={() => {
              const el = document.getElementById('architecture');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        )}

        {/* Dashboard — full-height, no footer */}
        {currentView === 'dashboard' && (
          <DashboardContainer
            activeRole={activeRole}
            walletAddress={walletAddress}
            onNavigateHome={() => setCurrentView('landing')}
            onRoleChange={handleRoleChange}
          />
        )}

        {/* Standalone pages with consistent wrapper */}
        {(currentView === 'verify' || currentView === 'audit' || currentView === 'explorer') && (
          <div className="flex-1">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
              {currentView === 'verify'   && <PublicVerifyPage />}
              {currentView === 'audit'    && <AuditTrailPage />}
              {currentView === 'explorer' && <ExplorerPage />}
            </div>
          </div>
        )}
      </div>

      {/* Footer — only on non-dashboard views */}
      {currentView !== 'dashboard' && (
        <Footer onNavigate={setCurrentView} />
      )}
    </div>
  );
}

export default App;
