import React, { useState } from 'react';
import * as Icons from 'lucide-react';

interface LiquidityLockerProps {
  onClose: () => void;
  themeMode?: 'dark' | 'light';
}

export default function LiquidityLocker({ onClose, themeMode = 'dark' }: LiquidityLockerProps) {
  const isLight = themeMode === 'light';

  const [lpAddress, setLpAddress] = useState('');
  const [lockDuration, setLockDuration] = useState('365');
  const [percentToLock, setPercentToLock] = useState('100');
  const [status, setStatus] = useState<'idle' | 'locking' | 'success'>('idle');
  const [txHash, setTxHash] = useState('');

  const handleLock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lpAddress) return;

    setStatus('locking');
    setTimeout(() => {
      setStatus('success');
      setTxHash('0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''));
    }, 2500);
  };

  const getLockExplanation = () => {
    const days = parseInt(lockDuration) || 365;
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="space-y-6 animate-fade-in text-left">
      {/* Header section */}
      <div className="space-y-2">
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-widest ${
          isLight
            ? 'bg-indigo-50 border border-indigo-250 text-indigo-750'
            : 'bg-[#14120a]/80 border border-cyber-neon/30 text-cyber-neon shadow-[0_0_8px_rgba(0,255,136,0.05)]'
        }`}>
          <Icons.Lock className="w-3.5 h-3.5 text-cyber-neon animate-pulse" /> liquidity timelock validator
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className={`text-2xl md:text-3xl font-bold tracking-tight font-display flex items-center gap-3 ${
            isLight ? 'text-slate-900 font-extrabold' : 'text-[#ffffff]'
          }`}>
            <Icons.Unlock className="w-7 h-7 text-cyber-neon" fill="none" />
            Surchi Liquidity Lock Engine
          </h2>
          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-2 border rounded-lg text-xs font-bold font-mono transition-all cursor-pointer select-none uppercase w-fit font-semibold ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700 hover:text-slate-900'
                : 'bg-[#0c0c1e] hover:bg-[#1a1a3e] border border-cyber-border text-slate-300 hover:text-white'
            }`}
          >
            &larr; Back to Workspace
          </button>
        </div>
        <p className={`text-xs leading-relaxed max-w-2xl font-mono ${isLight ? 'text-slate-500 font-medium' : 'text-slate-400'}`}>
          Lock your Liquidity Pool (LP) provider tokens in decentralized, multi-sig timelocked vaults to prove long-term security commitments to your holders.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Lock Form */}
        <div className={`md:col-span-7 border rounded-xl p-5 md:p-6 space-y-4 ${
          isLight ? 'bg-white border-slate-200' : 'bg-[#04040a] border-cyber-border'
        }`}>
          <h3 className={`text-xs font-mono font-black uppercase tracking-wider ${isLight ? 'text-slate-850 text-slate-800' : 'text-[#ffffff]'}`}>
            ESTABLISH NEW TIMELOCK COORDINATES
          </h3>

          {status === 'idle' && (
            <form onSubmit={handleLock} className="space-y-4 font-mono text-xs">
              <div className="space-y-1.5 text-left">
                <label className="text-slate-400 font-bold block">LP Token Address Pair (CA)</label>
                <input
                  type="text"
                  required
                  value={lpAddress}
                  onChange={(e) => setLpAddress(e.target.value)}
                  placeholder="e.g., SOL-SURCHI Raydium LP token address..."
                  className={`w-full p-3 rounded-lg border bg-[#060611] text-slate-200 placeholder-slate-500 font-mono text-xs focus:outline-hidden focus:border-cyber-cyan/50 ${
                    isLight ? 'border-slate-300 bg-slate-50' : 'border-cyber-border/80'
                  }`}
                />
                <span className="text-[10px] text-slate-500 leading-normal block">Provide the liquidity pair contract address you wish to freeze.</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 text-left">
                  <label className="text-slate-400 font-bold block">Lock Duration (In Days)</label>
                  <select
                    value={lockDuration}
                    onChange={(e) => setLockDuration(e.target.value)}
                    className={`w-full p-3 rounded-lg border bg-[#060611] text-slate-200 font-mono text-xs focus:outline-hidden focus:border-cyber-cyan/50 ${
                      isLight ? 'border-slate-300 bg-slate-50' : 'border-cyber-border/80'
                    }`}
                  >
                    <option value="30">30 Days (Short-term staking)</option>
                    <option value="90">90 Days (Quarterly Lock)</option>
                    <option value="180">180 Days (Half-year Guard)</option>
                    <option value="365">365 Days (1-Year Core Standard)</option>
                    <option value="730">730 Days (2-Year Institutional)</option>
                  </select>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-slate-400 font-bold block">Lock Ratio (%)</label>
                  <select
                    value={percentToLock}
                    onChange={(e) => setPercentToLock(e.target.value)}
                    className={`w-full p-3 rounded-lg border bg-[#060611] text-slate-200 font-mono text-xs focus:outline-hidden focus:border-cyber-cyan/50 ${
                      isLight ? 'border-slate-300 bg-slate-50' : 'border-cyber-border/80'
                    }`}
                  >
                    <option value="25">25% (Partial Reserve Lift)</option>
                    <option value="50">50% (Symmetrical Vault Guard)</option>
                    <option value="75">75% (Extended Capital Escrow)</option>
                    <option value="100">100% (Complete Sovereign Locked)</option>
                  </select>
                </div>
              </div>

              <div className={`p-3.5 rounded-lg border text-slate-400 flex items-start gap-2.5 leading-normal text-[11px] ${
                isLight ? 'bg-indigo-50/50 border-indigo-150 text-indigo-755' : 'bg-cyber-card-light/20 border-cyber-border/40 text-slate-300'
              }`}>
                <Icons.AlertTriangle className="w-5 h-5 text-cyber-neon shrink-0 animate-bounce" />
                <div>
                  <strong>Irreversible Action warning:</strong> Once locked, LP tokens <strong>absolutely cannot be withdrawn</strong> from Surchi smart contract coordinate lockers until the unlock date of <strong>{getLockExplanation()}</strong> matures.
                </div>
              </div>

              <button
                type="submit"
                className={`w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white rounded-lg font-bold tracking-widest uppercase transition-all select-none shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2`}
              >
                <Icons.Lock className="w-4 h-4" /> LOCK LIQUIDITY POOL TOKENS
              </button>
            </form>
          )}

          {status === 'locking' && (
            <div className="py-12 flex flex-col items-center justify-center gap-4 text-center font-mono">
              <Icons.Loader2 className="w-10 h-10 text-cyber-neon animate-spin" />
              <div>
                <p className="text-sm font-bold text-[#ffffff] dark:text-[#ffffff]">Synchronizing secure smart vault consensus...</p>
                <p className="text-[10px] text-slate-500">Transmitting lock coordinate parameters and establishing cryptographic blocks on-chain.</p>
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="py-6 space-y-6 text-center font-mono animate-fade-in text-xs">
              <div className="w-12 h-12 rounded-full bg-emerald-500/15 mx-auto flex items-center justify-center border border-emerald-500/30">
                <Icons.Check className="w-6 h-6 text-[#00ff88]" />
              </div>
              
              <div className="space-y-1">
                <h4 className="text-sm font-black text-[#ffffff] dark:text-[#ffffff] uppercase">LIQUIDITY FREEZE EXECUTION COMPLETED</h4>
                <p className="text-slate-500">Your LP tokens have been completely nested in Surchi secure escrow contract.</p>
              </div>

              <div className={`p-4 rounded-lg border text-left space-y-2.5 ${
                isLight ? 'bg-slate-50 border-slate-205' : 'bg-[#020205] border-cyber-border text-slate-350'
              }`}>
                <div className="flex justify-between">
                  <span className="text-slate-500">FREEZE FRACTION:</span>
                  <span className="font-bold text-[#ffffff] dark:text-[#ffffff]">{percentToLock}% of LP Supply</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">TIMELOCK MATURATION:</span>
                  <span className="font-bold text-cyber-neon">{getLockExplanation()}</span>
                </div>
                <div className="flex flex-col gap-1 border-t border-cyber-border/40 pt-2 text-[10px]">
                  <span className="text-slate-500 font-bold block">TRANSACTION SIGNATURE:</span>
                  <span className="font-mono text-slate-400 break-all select-all font-semibold">{txHash}</span>
                </div>
              </div>

              <button
                onClick={() => setStatus('idle')}
                className={`px-4 py-2 bg-cyber-card border border-cyber-border rounded-lg text-slate-300 hover:text-[#ffffff] cursor-pointer`}
              >
                Establish Another Lock
              </button>
            </div>
          )}
        </div>

        {/* Benefits Panel */}
        <div className="md:col-span-5 space-y-4">
          <div className={`border rounded-xl p-5 space-y-4 ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#060613]/50 border-cyber-border'
          }`}>
            <h4 className={`text-xs font-mono font-black uppercase tracking-widest ${isLight ? 'text-slate-800' : 'text-cyber-cyan'}`}>
              LOCKED STATUS BADGING
            </h4>
            <p className={`text-[11px] font-mono leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Every pool locked using Surchi timelock contract triggers automatic indicators across the Surchi Intelligence platform:
            </p>

            <div className="space-y-3 font-mono text-[11px]">
              <div className="flex items-start gap-2.5">
                <Icons.Verified className="w-4 h-4 text-emerald-505 text-cyber-neon shrink-0" />
                <div>
                  <strong className="text-slate-200 block">Sovereign Secured Shield</strong>
                  <span className="text-slate-500">Your token gets indexed with an active "Secured" checkmark on general forensic screens.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Icons.ShieldAlert className="w-4 h-4 text-cyber-cyan shrink-0" />
                <div>
                  <strong className="text-slate-200 block">Honeypot Exemption</strong>
                  <span className="text-slate-500">Assures automated audit models that liquidity cannot be drained instantly.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Icons.Share2 className="w-4 h-4 text-cyber-cyan shrink-0" />
                <div>
                  <strong className="text-slate-200 block">Shareable Lock Status PDF</strong>
                  <span className="text-slate-500">Export dynamic, branded visual timelock receipts to post across telegram channels in one click.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
