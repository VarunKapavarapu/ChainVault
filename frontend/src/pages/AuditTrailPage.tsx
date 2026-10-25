import React, { useState } from 'react';
import { Eye, Shield, Filter, Search, Clock, ArrowRight, CheckCircle2, User, Key, Box, RefreshCw } from 'lucide-react';
import { blockchainService } from '../services/blockchain';
import { AuditRecord } from '../types';

export const AuditTrailPage: React.FC = () => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [auditLogs, setAuditLogs] = useState<AuditRecord[]>(blockchainService.auditLogs);

  const handleRefresh = () => {
    setAuditLogs([...blockchainService.auditLogs]);
  };

  const filteredLogs = auditLogs.filter((log) => {
    const matchesFilter = filterType === 'ALL' || log.eventType === filterType;
    const matchesSearch =
      searchQuery === '' ||
      log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.txHashReference.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getEventBadge = (eventType: string) => {
    if (eventType.startsWith('IDENTITY_')) {
      return 'bg-cyber-blue/10 text-cyber-blue border-cyber-blue/20';
    }
    if (eventType.startsWith('ROLE_') || eventType.startsWith('PERMISSION_')) {
      return 'bg-cyber-indigo/10 text-cyber-indigo border-cyber-indigo/20';
    }
    if (eventType.startsWith('ASSET_')) {
      return 'bg-cyber-emerald/10 text-cyber-emerald border-cyber-emerald/20';
    }
    return 'bg-slate-800 text-slate-300 border-slate-700';
  };

  return (
    <div className="py-6 px-0 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-vault-700 bg-vault-900/80 px-3.5 py-1 text-xs font-mono text-cyber-cyan mb-2">
            <Eye className="h-3.5 w-3.5" /> IMMUTABLE AUDIT LOG (APPEND-ONLY)
          </div>
          <h1 className="font-display text-3xl font-extrabold text-white tracking-tight">
            Security & Governance Audit Trail
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Chronological cryptographic ledger of all identity registrations, role assignments, and asset movements.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          className="inline-flex items-center gap-2 rounded-xl bg-vault-800 hover:bg-vault-700 border border-vault-700 px-4 py-2 text-xs font-semibold text-slate-200 transition-colors self-start md:self-auto"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Sync Ledger
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="md:col-span-2 relative">
          <Search className="h-4 w-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by actor, target wallet, or event description..."
            className="w-full rounded-xl border border-vault-700 bg-vault-900/80 pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyber-cyan font-mono"
          />
        </div>

        <div className="relative">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full rounded-xl border border-vault-700 bg-vault-900/80 px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyber-cyan font-mono"
          >
            <option value="ALL">All Event Types ({auditLogs.length})</option>
            <option value="IDENTITY_REGISTERED">Identity Registered</option>
            <option value="IDENTITY_VERIFIED">Identity Verified</option>
            <option value="ROLE_ASSIGNED">Role Assigned</option>
            <option value="ROLE_REVOKED">Role Revoked</option>
            <option value="ASSET_MINTED">Asset Minted</option>
            <option value="ASSET_TRANSFERRED">Asset Transferred</option>
          </select>
        </div>
      </div>

      {/* Audit Timeline */}
      <div className="relative border-l-2 border-vault-800 ml-4 md:ml-6 space-y-6 pb-12">
        {filteredLogs.map((log) => {
          const date = new Date(log.timestamp * 1000);
          const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          const dateStr = date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });

          return (
            <div key={log.eventId} className="relative pl-6 md:pl-8 group">
              {/* Timeline dot */}
              <div className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full border-2 border-vault-950 bg-cyber-cyan shadow-md shadow-cyber-cyan/50 group-hover:scale-125 transition-transform" />

              {/* Event Card */}
              <div className="rounded-2xl border border-vault-700 bg-vault-900/80 p-5 backdrop-blur-md hover:border-vault-600 transition-colors shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 pb-2 border-b border-vault-800">
                  <div className="flex items-center gap-2">
                    <span className={`rounded-md border px-2 py-0.5 font-mono text-[10px] font-bold ${getEventBadge(log.eventType)}`}>
                      {log.eventType}
                    </span>
                    <span className="font-mono text-xs font-semibold text-white">Event #{log.eventId}</span>
                  </div>
                  <div className="font-mono text-[11px] text-slate-400 flex items-center gap-1.5">
                    <Clock className="h-3 w-3" />
                    <span>{dateStr} &bull; {timeStr}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed font-sans mb-3">
                  {log.details}
                </p>

                {/* Actor & Target */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono bg-vault-950/80 p-3 rounded-xl border border-vault-800">
                  <div>
                    <span className="text-[10px] text-slate-500 block">ACTOR (TRANSACTION INITIATOR)</span>
                    <span className="text-slate-300 select-all">{log.actor}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">TARGET (AFFECTED ENTITY)</span>
                    <span className="text-slate-300 select-all">{log.target}</span>
                  </div>
                </div>

                {/* Tx Reference */}
                <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span className="truncate max-w-sm">Proof Ref: {log.txHashReference}</span>
                  <span className="text-cyber-emerald flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="h-3 w-3" /> Tamper-Evident Confirmed
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {filteredLogs.length === 0 && (
          <div className="rounded-2xl border border-vault-800 bg-vault-900/50 p-8 text-center text-xs text-slate-500 font-mono">
            No events match your search criteria.
          </div>
        )}
      </div>
    </div>
  );
};
