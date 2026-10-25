import React, { useState } from 'react';
import { Terminal, Box, ArrowRight, CheckCircle2, Search, ExternalLink, RefreshCw, Layers } from 'lucide-react';
import { blockchainService } from '../services/blockchain';
import { TransactionRecord } from '../types';
import deployments from '../contracts/deployments.json';

export const ExplorerPage: React.FC = () => {
  const [transactions, setTransactions] = useState<TransactionRecord[]>(blockchainService.transactions);
  const [searchQuery, setSearchQuery] = useState('');

  const handleRefresh = () => {
    setTransactions([...blockchainService.transactions]);
  };

  const filteredTxs = transactions.filter((tx) => {
    return (
      searchQuery === '' ||
      tx.hash.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.to.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.blockNumber.toString().includes(searchQuery)
    );
  });

  return (
    <div className="py-6 px-0 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-vault-700 bg-vault-900/80 px-3.5 py-1 text-xs font-mono text-cyber-cyan mb-2">
            <Terminal className="h-3.5 w-3.5" /> INTERNAL BLOCKCHAIN EXPLORER
          </div>
          <h1 className="font-display text-3xl font-extrabold text-white tracking-tight">
            EVM Consensus & Transaction Ledger
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Real-time ledger state, gas consumption metrics, and block confirmations for ChainVault contracts.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          className="inline-flex items-center gap-2 rounded-xl bg-vault-800 hover:bg-vault-700 border border-vault-700 px-4 py-2 text-xs font-semibold text-slate-200 transition-colors self-start md:self-auto"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Refresh Blocks
        </button>
      </div>

      {/* Network Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 font-mono text-xs">
        <div className="p-4 rounded-2xl border border-vault-700 bg-vault-900/80">
          <span className="text-slate-500 block mb-1 text-[11px]">CHAIN ID</span>
          <span className="text-lg font-bold text-white">31337</span>
          <span className="text-[10px] text-cyber-cyan block mt-0.5">Local Hardhat EVM</span>
        </div>
        <div className="p-4 rounded-2xl border border-vault-700 bg-vault-900/80">
          <span className="text-slate-500 block mb-1 text-[11px]">LATEST BLOCK</span>
          <span className="text-lg font-bold text-cyber-cyan">#{blockchainService.currentBlockNumber}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Finalized</span>
        </div>
        <div className="p-4 rounded-2xl border border-vault-700 bg-vault-900/80">
          <span className="text-slate-500 block mb-1 text-[11px]">RECORDED TRANSACTIONS</span>
          <span className="text-lg font-bold text-white">{transactions.length}</span>
          <span className="text-[10px] text-cyber-emerald block mt-0.5">100% Success Rate</span>
        </div>
        <div className="p-4 rounded-2xl border border-vault-700 bg-vault-900/80">
          <span className="text-slate-500 block mb-1 text-[11px]">DEPLOYED CONTRACTS</span>
          <span className="text-lg font-bold text-white">4</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">All Verified</span>
        </div>
      </div>

      {/* Search Input */}
      <div className="mb-6 relative">
        <Search className="h-4 w-4 text-slate-500 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter transactions by hash, block #, sender address, or smart contract function..."
          className="w-full rounded-xl border border-vault-700 bg-vault-900/80 pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyber-cyan font-mono"
        />
      </div>

      {/* Transactions Table */}
      <div className="rounded-2xl border border-vault-700 bg-vault-900/80 overflow-hidden shadow-2xl backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="border-b border-vault-800 bg-vault-950/60 text-[11px] text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Tx Hash</th>
                <th className="px-5 py-3.5">Block</th>
                <th className="px-5 py-3.5">Function Invocation</th>
                <th className="px-5 py-3.5">From</th>
                <th className="px-5 py-3.5">Gas Used</th>
                <th className="px-5 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-vault-800/80 text-slate-300">
              {filteredTxs.map((tx) => (
                <tr key={tx.hash} className="hover:bg-vault-800/40 transition-colors">
                  <td className="px-5 py-3.5">
                    <span className="text-cyber-cyan font-semibold select-all">
                      {tx.hash.slice(0, 10)}...{tx.hash.slice(-6)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="rounded bg-vault-950 border border-vault-800 px-2 py-0.5 text-slate-300">
                      #{tx.blockNumber}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-sans font-medium text-white">
                    {tx.action}
                  </td>
                  <td className="px-5 py-3.5 text-slate-400 select-all">
                    {tx.from.slice(0, 8)}...{tx.from.slice(-4)}
                  </td>
                  <td className="px-5 py-3.5 text-slate-400">
                    {tx.gasUsed}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center gap-1 rounded-md bg-cyber-emerald/10 border border-cyber-emerald/20 px-2 py-0.5 text-[10px] font-bold text-cyber-emerald">
                      <CheckCircle2 className="h-3 w-3" /> Confirmed
                    </span>
                  </td>
                </tr>
              ))}
              {filteredTxs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-500">
                    No matching blockchain transactions recorded.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
