import { useState } from 'react';
import * as Icons from 'lucide-react';
import { motion } from 'motion/react';

export default function StakingDashboard({ themeMode }: { themeMode?: 'dark' | 'light' }) {
  const [stakeAmount, setStakeAmount] = useState<string>('1000');
  const [stakeDuration, setStakeDuration] = useState<number>(30); // in days
  const isLight = themeMode === 'light';
  // Countdown clock simulator (Temporarily static for now)
  const timeLeft = { days: 4, hours: 14, minutes: 32, seconds: 45 };

  // Calculate yield (7.3% API / APY)
  const apy = 0.073;
  const parsedAmount = parseFloat(stakeAmount) || 0;
  const yearlyReward = parsedAmount * apy;
  const periodReward = (parsedAmount * apy * stakeDuration) / 365;

  return (
    <div id="staking-dashboard" className="space-y-6 text-left animate-fade-in font-sans">
      <div className="space-y-1">
        <h3 className="text-base font-black text-cyber-text font-display border-b border-cyber-border/40 pb-1.5 uppercase flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Icons.Layers className="w-4 h-4 text-cyber-neon" />
            $SURCHI Smart Staking Portals
          </span>
          <span className={`text-[10px] px-2.5 py-0.5 rounded font-mono border normal-case flex items-center gap-1.5 ${
            isLight 
              ? 'bg-emerald-50 border-emerald-250 text-emerald-700 font-semibold' 
              : 'bg-[#051c11]/80 border-cyber-neon/30 text-cyber-neon'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isLight ? 'bg-emerald-600' : 'bg-cyber-neon'}`} />
            Upcoming Live Event: <span className={`font-extrabold ${isLight ? 'text-emerald-800' : 'text-white'}`}>7.3% API / APY</span>
          </span>
        </h3>
      </div>

      {/* STAKING EVENT STATS & COUNTDOWN BANNER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 p-5 bg-cyber-card-light/45 border border-cyber-border/80 rounded-xl flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-[9px] font-mono font-bold uppercase tracking-wider ${
              isLight 
                ? 'border-emerald-250 bg-emerald-50 text-emerald-700' 
                : 'border-cyber-neon/30 bg-[#051c11] text-cyber-neon'
            }`}>
              <span className={`w-1 h-1 rounded-full animate-ping ${isLight ? 'bg-emerald-600' : 'bg-cyber-neon'}`} />
              Consensus Node Yield Staking
            </div>
            <h4 className="text-sm font-bold text-cyber-text font-display">
              Activate $SURCHI Security Nodes & Harvest 7.3% APY
            </h4>
            <p className="text-xs text-cyber-text-muted font-sans leading-relaxed">
              Earn highly secure protocol rewards by locking $SURCHI in decentralized consensus validation pools. Staking guarantees platform governance voting rights, prioritization metrics, and system security benefits with zero pool operation performance fee.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2 font-mono text-[10px]">
            <div className={`p-2.5 rounded border space-y-0.5 ${isLight ? 'bg-slate-100/75 border-slate-200' : 'bg-[#030308]/60 border-cyber-border/40'}`}>
              <span className="text-slate-500 uppercase tracking-wider block">BASE YIELD</span>
              <strong className={`text-xs font-black ${isLight ? 'text-emerald-750 font-extrabold' : 'text-cyber-neon'}`}>7.30% API</strong>
            </div>
            <div className={`p-2.5 rounded border space-y-0.5 ${isLight ? 'bg-slate-100/75 border-slate-200' : 'bg-[#030308]/60 border-cyber-border/40'}`}>
              <span className="text-slate-500 uppercase tracking-wider block">MINIMUM LOCK</span>
              <strong className={`text-xs font-black ${isLight ? 'text-slate-800' : 'text-white'}`}>0 DAYS</strong>
            </div>
            <div className={`p-2.5 rounded border space-y-0.5 ${isLight ? 'bg-slate-100/75 border-slate-205' : 'bg-[#030308]/60 border-cyber-border/40'}`}>
              <span className="text-slate-500 uppercase tracking-wider block">POOL CAPACITY</span>
              <strong className={`text-xs font-black ${isLight ? 'text-indigo-600' : 'text-cyber-cyan'}`}>UNLIMITED</strong>
            </div>
          </div>
        </div>

        {/* RESTART COUNTDOWN BOX */}
        <div className={`lg:col-span-5 p-5 border rounded-xl flex flex-col justify-center items-center text-center space-y-4 shadow-[0_0_15px_rgba(0,255,136,0.03)] transition-all ${
          isLight
            ? 'bg-gradient-to-br from-emerald-50/10 via-slate-50 to-white border-emerald-250/70'
            : 'bg-gradient-to-br from-cyber-neon/5 via-cyber-card-light to-cyber-card border border-cyber-neon/25'
        }`}>
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">EVENT PROTOCOL COMMENCEMENT</span>
            <span className={`text-xs font-bold font-mono uppercase tracking-wider block ${isLight ? 'text-emerald-700' : 'text-cyber-neon'}`}>CONTRACT INITIALIZATION</span>
          </div>

          {/* TIMER GRAPHIC */}
          <div className="flex gap-2">
            <div className={`p-3 rounded-lg min-w-[50px] transition-all border ${
              isLight ? 'bg-emerald-50 border-emerald-150 text-emerald-600' : 'bg-cyber-neon/10 border-cyber-neon/20 text-[#00ff88]'
            }`}>
              <div className="text-lg sm:text-2xl font-black font-mono leading-none">
                {String(timeLeft.days).padStart(2, '0')}
              </div>
              <div className="text-[8px] font-mono uppercase text-slate-500 mt-1">Days</div>
            </div>
            <div className={`p-3 rounded-lg min-w-[50px] transition-all border ${
              isLight ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-cyber-card-light border border-cyber-border text-cyber-text'
            }`}>
              <div className="text-lg sm:text-2xl font-black font-mono leading-none">
                {String(timeLeft.hours).padStart(2, '0')}
              </div>
              <div className="text-[8px] font-mono uppercase text-slate-500 mt-1">Hrs</div>
            </div>
            <div className={`p-3 rounded-lg min-w-[50px] transition-all border ${
              isLight ? 'bg-slate-100 border-slate-200 text-slate-705' : 'bg-cyber-card-light border border-cyber-border text-cyber-text'
            }`}>
              <div className="text-lg sm:text-2xl font-black font-mono leading-none">
                {String(timeLeft.minutes).padStart(2, '0')}
              </div>
              <div className="text-[8px] font-mono uppercase text-slate-500 mt-1">Mins</div>
            </div>
            <div className={`p-3 rounded-lg min-w-[50px] transition-all border ${
              isLight ? 'bg-indigo-50 border-indigo-150 text-indigo-650 font-bold' : 'bg-cyber-card-light border border-cyber-border text-cyber-cyan'
            }`}>
              <div className="text-lg sm:text-2xl font-black font-mono leading-none">
                {String(timeLeft.seconds).padStart(2, '0')}
              </div>
              <div className="text-[8px] font-mono uppercase text-slate-500 mt-1">Secs</div>
            </div>
          </div>

          <div className="w-full">
            <button 
              disabled={true}
              className={`w-full py-2 border rounded-lg text-[10px] font-bold font-mono tracking-widest uppercase cursor-not-allowed ${
                isLight
                  ? 'bg-slate-100 border-slate-200 text-slate-400'
                  : 'bg-cyber-neon/5 border-cyber-neon/20 text-cyber-neon/50'
              }`}
            >
              🔒 Staking Vault Offline
            </button>
          </div>
        </div>
      </div>

      {/* INTERACTIVE APY CALCULATOR */}
      <div className="p-5 bg-cyber-card-light/35 border border-cyber-border rounded-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-cyber-border/30">
          <div className="space-y-0.5">
            <h5 className="text-xs font-bold text-cyber-text font-display flex items-center gap-1">
              <Icons.Calculator className="w-4 h-4 text-cyber-cyan" />
              Flexible Reward Forecaster
            </h5>
            <p className="text-[10px] text-cyber-text-muted font-sans font-medium">
              Plug in your intended hold parameters to compute your projected network emissions yields.
            </p>
          </div>
          <div className={`text-xs font-mono font-bold uppercase px-2.5 py-1 rounded border ${
            isLight
              ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
              : 'bg-cyber-cyan/10 px-2.5 py-1 rounded border border-cyber-cyan/30 text-cyber-cyan'
          }`}>
            Yield Multiplier: 1.00x Base
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          {/* Inputs */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-mono text-slate-500 block">STAKE INTENSITY ($SURCHI)</label>
              <div className="relative">
                <input
                  type="text"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                  className={`w-full border rounded-lg pl-3 pr-16 py-2.5 text-xs font-mono focus:outline-none transition-all ${
                    isLight 
                      ? 'bg-white border-slate-300 text-slate-800 focus:border-indigo-600'
                      : 'bg-[#030308] border border-cyber-border text-white focus:border-cyber-neon focus:shadow-[0_0_8px_rgba(0,255,136,0.1)]'
                  }`}
                />
                <span className={`absolute right-3 top-2.5 text-[10px] font-mono font-black select-none ${isLight ? 'text-emerald-700' : 'text-cyber-neon'}`}>
                  $SURCHI
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-mono text-slate-500 block">LOCK DURATION: {stakeDuration} DAYS</label>
              <div className="flex gap-2">
                {[7, 30, 90, 365].map((d) => (
                  <button
                    key={d}
                    onClick={() => setStakeDuration(d)}
                    className={`flex-1 py-2 text-[10px] font-mono font-bold rounded-lg border transition-all ${
                      stakeDuration === d
                        ? (isLight 
                            ? 'bg-indigo-100 text-indigo-700 border-indigo-500' 
                            : 'bg-cyber-neon/10 text-cyber-neon border-cyber-neon')
                        : (isLight 
                            ? 'bg-white text-slate-600 border-slate-200 hover:border-slate-300' 
                            : 'bg-[#030308] text-slate-500 border-cyber-border hover:border-slate-600')
                    }`}
                  >
                    {d === 365 ? '1 Year' : `${d}D`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Yield Projection Output cards */}
          <div className="lg:col-span-12 md:col-span-5 grid grid-cols-2 gap-3 font-mono text-[11px]">
            <div className={`p-3 border rounded-lg space-y-1 ${
              isLight ? 'bg-indigo-50/40 border-indigo-150 text-slate-800' : 'bg-cyber-card-light border border-cyber-border/60 text-white'
            }`}>
              <span className="text-[8px] text-slate-505 text-slate-500 uppercase tracking-wider block">Est. Return ({stakeDuration}D)</span>
              <strong className={`text-sm font-black block ${isLight ? 'text-emerald-700' : 'text-cyber-neon'}`}>
                {periodReward.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
              </strong>
              <span className={`text-[9px] block ${isLight ? 'text-emerald-600/70' : 'text-[#00ff88]/50'}`}>+$SURCHI Rewards</span>
            </div>

            <div className={`p-3 border rounded-lg space-y-1 ${
              isLight ? 'bg-indigo-50/50 border-indigo-150 text-slate-800' : 'bg-cyber-card-light border border-cyber-border/60 text-white'
            }`}>
              <span className="text-[8px] text-slate-505 text-slate-500 uppercase tracking-wider block">Est. Annual Emissions</span>
              <strong className={`text-sm font-black block ${isLight ? 'text-indigo-700' : 'text-cyber-cyan'}`}>
                {yearlyReward.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
              </strong>
              <span className={`text-[9px] block ${isLight ? 'text-indigo-600/60' : 'text-cyber-cyan/50'}`}>At 7.30% Net APY</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
