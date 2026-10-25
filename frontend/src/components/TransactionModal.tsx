import React from 'react';
import { TxStatus } from '../types';
import { Loader2, CheckCircle2, AlertTriangle, ExternalLink, X, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TransactionModalProps {
  status: TxStatus | null;
  onClose: () => void;
  onViewExplorer?: (txHash: string) => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({ status, onClose, onViewExplorer }) => {
  if (!status || status.step === 'idle') return null;

  React.useEffect(() => {
    if (status.step === 'confirmed') {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#38bdf8', '#3b82f6', '#10b981'],
        });
      } catch (e) {
        // ignore
      }
    }
  }, [status.step]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-vault-700 bg-vault-900/95 p-6 shadow-2xl">
        {/* Close Button */}
        {(status.step === 'confirmed' || status.step === 'failed') && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-lg p-1.5 text-slate-400 hover:bg-vault-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        <div className="flex flex-col items-center text-center">
          {/* Icon based on state */}
          <div className="mb-4">
            {status.step === 'preparing' && (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cyber-blue/10 text-cyber-blue ring-8 ring-cyber-blue/5">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            )}
            {status.step === 'wallet_signature' && (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cyber-amber/10 text-cyber-amber ring-8 ring-cyber-amber/5">
                <ShieldCheck className="h-8 w-8 animate-pulse" />
              </div>
            )}
            {status.step === 'confirming' && (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cyber-cyan/10 text-cyber-cyan ring-8 ring-cyber-cyan/5">
                <Loader2 className="h-8 w-8 animate-spin text-cyber-cyan" />
              </div>
            )}
            {status.step === 'confirmed' && (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cyber-emerald/10 text-cyber-emerald ring-8 ring-cyber-emerald/5">
                <CheckCircle2 className="h-8 w-8" />
              </div>
            )}
            {status.step === 'failed' && (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cyber-rose/10 text-cyber-rose ring-8 ring-cyber-rose/5">
                <AlertTriangle className="h-8 w-8" />
              </div>
            )}
          </div>

          {/* Title & Message */}
          <h3 className="text-xl font-semibold text-white tracking-tight">{status.title}</h3>
          <p className="mt-2 text-sm text-slate-400 leading-relaxed max-w-sm">{status.message}</p>

          {/* Stepper Progression */}
          <div className="mt-6 w-full rounded-xl bg-vault-950/60 border border-vault-800 p-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className={`flex items-center gap-1.5 ${status.step !== 'failed' ? 'text-cyber-cyan font-medium' : ''}`}>
                1. Authorize
              </span>
              <span className="text-slate-600">→</span>
              <span className={`flex items-center gap-1.5 ${status.step === 'confirming' || status.step === 'confirmed' ? 'text-cyber-cyan font-medium' : ''}`}>
                2. Consensus
              </span>
              <span className="text-slate-600">→</span>
              <span className={`flex items-center gap-1.5 ${status.step === 'confirmed' ? 'text-cyber-emerald font-medium' : ''}`}>
                3. Finalized
              </span>
            </div>
          </div>

          {/* Transaction Hash & Block Info */}
          {status.txHash && (
            <div className="mt-4 w-full rounded-xl bg-vault-950/80 border border-vault-800 p-3 text-left">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-500 font-mono">TRANSACTION HASH</span>
                {status.blockNumber && (
                  <span className="text-slate-400 font-mono">Block #{status.blockNumber}</span>
                )}
              </div>
              <div className="font-mono text-xs text-cyber-cyan break-all select-all bg-vault-900/90 p-2 rounded border border-vault-800">
                {status.txHash}
              </div>
            </div>
          )}

          {/* Error Message */}
          {status.error && (
            <div className="mt-4 w-full rounded-xl bg-cyber-rose/10 border border-cyber-rose/20 p-3 text-left">
              <div className="text-xs font-semibold text-cyber-rose mb-1">EXECUTION ERROR</div>
              <div className="text-xs text-slate-300 leading-normal">{status.error}</div>
            </div>
          )}

          {/* Action buttons */}
          <div className="mt-6 flex w-full gap-3">
            {status.step === 'confirmed' && (
              <>
                {onViewExplorer && status.txHash && (
                  <button
                    onClick={() => {
                      onViewExplorer(status.txHash!);
                      onClose();
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-vault-800 px-4 py-2.5 text-xs font-medium text-slate-200 hover:bg-vault-700 transition-colors border border-vault-700"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    View in Explorer
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="flex-1 rounded-xl bg-cyber-cyan px-4 py-2.5 text-xs font-semibold text-vault-950 hover:bg-sky-300 transition-colors shadow-lg shadow-cyber-cyan/10"
                >
                  Done
                </button>
              </>
            )}
            {status.step === 'failed' && (
              <button
                onClick={onClose}
                className="w-full rounded-xl bg-vault-800 px-4 py-2.5 text-xs font-semibold text-white hover:bg-vault-700 transition-colors border border-vault-700"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
