import { useState } from 'react';
import * as Icons from 'lucide-react';

interface SurchiLivePortalProps {
  onClose: () => void;
  isTokenLive?: boolean;
  tokenPrice?: number;
  marketCap?: number;
  volume24h?: number;
  themeMode?: 'dark' | 'light';
}

export default function SurchiLivePortal({
  onClose,
  themeMode = 'dark'
}: SurchiLivePortalProps) {
  const [copied, setCopied] = useState(false);
  const [stakeAmount, setStakeAmount] = useState<string>('1000');
  const [stakeDuration, setStakeDuration] = useState<number>(30); // in days
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full flex flex-col pt-4 pb-12 px-4 max-w-4xl mx-auto space-y-8 animate-fade-in select-none">
      
      {/* Portals Control Header Bar */}
      <div className="w-full flex justify-between items-center bg-purple-500/5 p-3 rounded-2xl border border-purple-500/10 backdrop-blur">
        <button
          onClick={onClose}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all border ${
            themeMode === 'light'
              ? 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
              : 'bg-[#0b0c16]/90 border-[#8b5cf6]/20 text-[#c084fc] hover:bg-[#8b5cf6]/20'
          } cursor-pointer`}
        >
          <Icons.ArrowLeft className="w-4 h-4" />
          <span>Exit Live Portal</span>
        </button>

        <h1 className="text-sm font-mono font-black tracking-wider text-purple-400 hidden sm:inline-flex items-center gap-1.5 animate-pulse">
          <span className="w-2 h-2 rounded-full bg-purple-500"></span>
          REAL-TIME TELEMETRY CONNECTED
        </h1>

        <button
          onClick={handleShare}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono transition-all border ${
            themeMode === 'light'
              ? 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
              : 'bg-[#0b0c16]/90 border-[#8b5cf6]/20 text-[#c084fc] hover:bg-[#8b5cf6]/20'
          } cursor-pointer`}
        >
          {copied ? (
            <>
              <Icons.Check className="w-4 h-4 text-emerald-505 text-emerald-400" />
              <span className="text-emerald-405 text-emerald-400">URL Copied!</span>
            </>
          ) : (
            <>
              <Icons.Share2 className="w-4 h-4" />
              <span>Share Dashboard</span>
            </>
          )}
        </button>
      </div>

      {/* PORTAL SCREEN BANNER */}
      <div className="text-left space-y-2">
        <span className="text-[11px] font-mono tracking-widest text-purple-450 uppercase font-bold text-purple-400">
          Intelligent Terminal
        </span>
        <h2 className={`text-2xl sm:text-3xl font-black font-display tracking-tight leading-none ${
          themeMode === 'light' ? 'text-slate-900' : 'text-white'
        }`}>
          $SURCHI Ecosystem Value & Price Ledger
        </h2>
        <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
          Access core on-chain metrics, strategic distribution, contract verification status, and dynamic deflationary mechanics powering the next generation AI analytics suite.
        </p>
      </div>

      {/* THE MAJESTIC CARDS LAYOUT (Full Width Desktop, Highly Responsive) */}
      <div 
        className={`w-full rounded-[24px] border ${
          themeMode === 'light'
            ? 'bg-white border-slate-200 shadow-[0_12px_40px_rgba(0,0,0,0.03)] text-slate-800'
            : 'bg-[#0a0b16] border-[#8b5cf6]/25 shadow-[0_15px_50px_rgba(139,92,246,0.05)] text-white'
        } overflow-hidden`}
      >
        <div className="p-6 sm:p-8 space-y-6 sm:space-y-8">
          
          {/* HEADER ROW */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl overflow-hidden border border-slate-100 shadow-md shrink-0 bg-white p-1">
                <img
                  src="https://raw.githubusercontent.com/surchiai/surchiai.github.io/refs/heads/main/SURCHI%20logo.jpg"
                  alt="SURCHI Token Premium Logo"
                  className="w-full h-full object-cover rounded-xl"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <h3 className={`text-xl md:text-2xl font-black tracking-tight leading-none uppercase ${
                  themeMode === 'light' ? 'text-slate-950' : 'text-white'
                }`}>
                  SURCHI
                </h3>
                <p className="text-xs font-mono font-bold text-slate-400">
                  $SURCHI
                </p>
                <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.75 rounded-full bg-purple-500/10 border border-purple-500/20 text-[9.5px] font-sans font-extrabold tracking-wide text-purple-400">
                    <Icons.CheckCircle className="w-3.5 h-3.5 text-purple-400" />
                    Verified Project
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.75 rounded-full bg-purple-500/5 border border-purple-500/10 text-[9.5px] font-sans font-extrabold tracking-wide text-purple-400">
                    <Icons.Rocket className="w-3.5 h-3.5 text-purple-400 animate-bounce" />
                    Pre-Launch
                  </span>
                </div>
              </div>
            </div>

            {/* Price section */}
            <div className="text-left sm:text-right flex flex-col sm:items-end space-y-1">
              <span className="text-[10px] font-extrabold tracking-widest text-slate-400 font-sans uppercase">
                Price
              </span>
              <div className="flex items-baseline gap-1">
                <span className={`text-3xl md:text-4xl font-extrabold tracking-tight font-sans leading-none ${
                  themeMode === 'light' ? 'text-slate-900' : 'text-white'
                }`}>
                  $0.000
                </span>
                <span className="text-[10px] font-mono text-slate-400 font-semibold uppercase">
                  USD
                </span>
              </div>
              <span className="inline-flex items-center px-3 py-0.5 rounded-full border border-purple-500/30 bg-purple-500/5 text-[9px] font-black tracking-wider text-purple-400 uppercase">
                PRE-LAUNCH ACTIVE
              </span>
            </div>
          </div>

          {/* THREE METRICS GRID */}
          <div className={`grid grid-cols-1 sm:grid-cols-3 gap-6 py-5 border-y ${
            themeMode === 'light' ? 'border-slate-100' : 'border-cyber-border/15'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0 border border-purple-500/20">
                <Icons.PieChart className="w-5 h-5 text-purple-400" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] uppercase font-bold text-slate-400 font-sans tracking-widest leading-none">
                  Market Cap
                </span>
                <strong className={`text-base font-extrabold font-sans mt-0.5 ${
                  themeMode === 'light' ? 'text-slate-800' : 'text-slate-200'
                }`}>
                  $0.000
                </strong>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0 border border-purple-500/20">
                <Icons.BarChart3 className="w-5 h-5 text-purple-400" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] uppercase font-bold text-slate-400 font-sans tracking-widest leading-none">
                  24H Volume
                </span>
                <strong className={`text-base font-extrabold font-sans mt-0.5 ${
                  themeMode === 'light' ? 'text-slate-800' : 'text-slate-200'
                }`}>
                  $0.000
                </strong>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0 border border-purple-500/20">
                <Icons.Droplets className="w-5 h-5 text-purple-400" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] uppercase font-bold text-slate-400 font-sans tracking-widest leading-none">
                  Liquidity
                </span>
                <strong className={`text-base font-extrabold font-sans mt-0.5 ${
                  themeMode === 'light' ? 'text-slate-800' : 'text-slate-200'
                }`}>
                  $0.000
                </strong>
              </div>
            </div>
          </div>

          {/* DECORATIVE CHART SPACE WITH WAVE */}
          <div className={`rounded-2xl border p-6 relative h-48 flex flex-col justify-center items-center overflow-hidden ${
            themeMode === 'light'
              ? 'bg-slate-50/60 border-slate-100'
              : 'bg-[#05060d] border-cyber-border/10'
          }`}>
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="w-full h-full grid grid-cols-8 grid-rows-4">
                {Array.from({ length: 32 }).map((_, i) => (
                  <div key={i} className="border-t border-l border-slate-400"></div>
                ))}
              </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 top-16 select-none opacity-85 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="liveWaveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,60 Q12,48 24,62 T48,68 T72,40 T96,52 L100,52 L100,100 L0,100 Z"
                  fill="url(#liveWaveGrad)"
                />
                <path
                  d="M0,60 Q12,48 24,62 T48,68 T72,40 T96,52 L100,52"
                  fill="none"
                  stroke="#8B5CF6"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <circle cx="100" cy="52" r="3" fill="#8B5CF6" />
                <circle cx="100" cy="52" r="7" fill="#8B5CF6" fillOpacity="0.2" className="animate-ping" />
              </svg>
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-1.5 p-4 max-w-sm">
              <div className="w-9 h-9 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center animate-pulse">
                <Icons.ShieldAlert className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-base font-bold tracking-wide text-purple-500 block font-sans">
                Awaiting Exchange Listing
              </span>
              <p className="text-xs text-slate-400 leading-relaxed max-w-[300px]">
                Ecosystem tokens will be tradeable once listed on prominent exchanges.
              </p>
            </div>
          </div>

          {/* BOTTOM TIMELINE AND RE-LAUNCH INDICATOR */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2">
              <Icons.Calendar className="w-5 h-5 text-purple-400" />
              <span className="text-xs font-bold text-slate-400 font-sans">
                Launch Date: <span className="text-purple-400 uppercase font-mono tracking-wider">TBA</span>
              </span>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-bold text-purple-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-purple-500 opacity-75 animate-ping"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-600"></span>
              </span>
              <span>● PRE-LAUNCH PROGRESS</span>
            </div>
          </div>

        </div>
      </div>

      {/* DETAILED ECOSYSTEM "VALUE INFORMATION" GRID SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
        
        {/* CONTRACT TELEMETRY & SUPPLY PROFILE (Col: 5) */}
        <div className={`lg:col-span-5 p-6 rounded-2xl border space-y-5 flex flex-col justify-between ${
          themeMode === 'light' ? 'bg-white border-slate-200' : 'bg-[#090a14] border-[#8b5cf6]/15'
        }`}>
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <Icons.Cpu className="w-5 h-5 text-purple-400" />
              <h4 className="text-sm font-extrabold uppercase font-mono tracking-wider text-purple-400">
                Official Supply Profile
              </h4>
            </div>

            <div className="divide-y divide-purple-500/5 text-xs space-y-3 font-mono pt-1">
              <div className="flex justify-between items-center py-1.5">
                <span className="text-slate-400">Standard / Chain</span>
                <span className={`font-bold ${themeMode === 'light' ? 'text-slate-800' : 'text-slate-200'}`}>Solana SPL Protocol</span>
              </div>
              
              <div className="flex justify-between items-center py-1.5">
                <span className="text-slate-400">Total supply cap</span>
                <span className={`font-extrabold text-purple-400`}>19,897,905 SURCHI</span>
              </div>

              <div className="flex justify-between items-center py-1.5">
                <span className="text-slate-400">Circulating supply</span>
                <span className={`font-bold ${themeMode === 'light' ? 'text-slate-800' : 'text-slate-200'}`}>17,908,114 SURCHI (90%)</span>
              </div>

              <div className="flex justify-between items-center py-1.5">
                <span className="text-slate-400">Mint Authority</span>
                <span className="text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded text-[10px] uppercase">
                  Revoked / Disabled
                </span>
              </div>

              <div className="flex justify-between items-center py-1.5">
                <span className="text-slate-400 font-bold">Freeze Authority</span>
                <span className="text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded text-[10px] uppercase">
                  Revoked / Disabled
                </span>
              </div>

              <div className="flex justify-between items-center py-1.5">
                <span className="text-slate-400">Contract Address</span>
                <span className="font-extrabold text-[#c084fc] hover:underline cursor-pointer select-all truncate max-w-[140px]" title="Copy contract">
                  9u9surchi_ecosystem_token_placeholder
                </span>
              </div>

              <div className="flex justify-between items-center py-1.5">
                <span className="text-slate-400">Cognitive Shield Score</span>
                <span className="text-purple-400 font-bold flex items-center gap-1">
                  <Icons.ShieldCheck className="w-3.5 h-3.5 text-purple-400" /> 100/100 Safe
                </span>
              </div>
            </div>
          </div>

          {/* Core App / Platform Info */}
          <div className="p-4 bg-purple-500/4 rounded-xl border border-purple-500/10 space-y-2 text-xs">
            <h5 className="font-bold text-purple-400 font-mono text-[11px] uppercase flex items-center gap-1.5 leading-none">
              <Icons.ShieldAlert className="w-4 h-4 text-purple-400" /> Ecosystem Lock status
            </h5>
            <p className="text-slate-404 text-slate-400 leading-relaxed text-[11px]">
              Platform liquidity is 100% time-locked inside automated pool lock frameworks. Development allocations linear-vest monthly to align with community sustainability goals.
            </p>
          </div>
        </div>

        {/* STAKING EVENT CONTROL PORTAL & APY CALCULATOR (Col: 7) */}
        <div className={`lg:col-span-7 p-6 rounded-2xl border space-y-5 ${
          themeMode === 'light' ? 'bg-white border-slate-200' : 'bg-[#090a14] border-[#8b5cf6]/15'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5">
              <Icons.Layers className="w-5 h-5 text-purple-400" />
              <h4 className="text-sm font-extrabold uppercase font-mono tracking-wider text-purple-400">
                $SURCHI Consensus Yield Staking
              </h4>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold leading-none">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
              Yield Active: 7.30% APY
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed font-sans mt-1">
            Participate in platform governance and secure deep database calculation indexes by staking $SURCHI. Active security nodes generate fixed contract rewards paid directly under cryptographic consensus validation rules with zero operation fee.
          </p>

          {/* Staking reward stats cards */}
          <div className="grid grid-cols-3 gap-3 pt-1 text-[10px] font-mono">
            <div className="p-2.5 bg-purple-500/5 border border-purple-500/10 rounded-xl space-y-0.5">
              <span className="text-slate-500 uppercase tracking-wider block leading-none animate-pulse">Base APY</span>
              <strong className="text-xs font-extrabold text-emerald-400">7.30% APY</strong>
            </div>
            <div className="p-2.5 bg-purple-500/5 border border-purple-500/10 rounded-xl space-y-0.5">
              <span className="text-slate-500 uppercase tracking-wider block leading-none">Min Lock</span>
              <strong className="text-xs font-black text-slate-200 font-bold">0 Days</strong>
            </div>
            <div className="p-2.5 bg-purple-500/5 border border-purple-500/10 rounded-xl space-y-0.5">
              <span className="text-slate-500 uppercase tracking-wider block leading-none">Node Pools</span>
              <strong className="text-xs font-black text-purple-400">UNLIMITED</strong>
            </div>
          </div>

          {/* APY Rewards calculator core implementation */}
          <div className="p-4 bg-purple-500/5 border border-purple-500/10 rounded-xl space-y-4 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-sans pb-2 border-b border-purple-500/10">
              <div className="space-y-0.5">
                <h5 className="text-[11px] font-mono font-extrabold text-[#c4b5fd] uppercase tracking-wider flex items-center gap-1 leading-none">
                  <Icons.Calculator className="w-3.5 h-3.5 text-purple-400" /> Yield Forecast Calculator
                </h5>
                <p className="text-[10px] text-slate-500">Estimate your dynamic protocol rewards over hold duration.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Intended Stake Amount</label>
                <div className="relative">
                  <input
                    type="number"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    placeholder="Enter SURCHI amount"
                    className="w-full bg-[#020205] text-white border border-purple-500/20 rounded-lg py-1.5 pl-3 pr-16 text-xs focus:outline-none focus:border-purple-400 font-mono"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-purple-400 font-extrabold">SURCHI</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block flex justify-between">
                  <span>Locked Hold Duration</span>
                  <span className="text-purple-400 font-bold font-mono">{stakeDuration} Days</span>
                </label>
                <input
                  type="range"
                  min="30"
                  max="365"
                  step="30"
                  value={stakeDuration}
                  onChange={(e) => setStakeDuration(Number(e.target.value))}
                  className="w-full h-1 bg-purple-500/10 rounded-lg appearance-none cursor-pointer accent-[#a855f7]"
                />
              </div>
            </div>

            <div className="p-3 bg-[#020205] border border-purple-500/10 rounded-lg flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Projected Reward Yield:</span>
              <strong className="text-emerald-450 text-emerald-400 font-extrabold flex items-center gap-1">
                <span>+ {((parseFloat(stakeAmount) || 0) * 0.073 * stakeDuration / 365).toFixed(3)}</span>
                <span className="text-[10px] font-bold text-emerald-400/80">$SURCHI</span>
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* DYNAMIC TOKENOMICS DIVISION CHART & Legend AREA */}
      <div className={`p-6 sm:p-8 rounded-2xl border space-y-6 text-left ${
        themeMode === 'light' ? 'bg-white border-slate-200' : 'bg-[#090a14] border-[#8b5cf6]/15'
      }`}>
        <div className="flex items-center gap-2.5 border-b border-purple-500/5 pb-3">
          <Icons.PieChart className="w-5 h-5 text-purple-400" />
          <h4 className="text-sm font-extrabold uppercase font-mono tracking-wider text-purple-400">
            Official Distribution Plan & Donut Registry
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Interactive Donut Graph */}
          <div className="md:col-span-5 flex flex-col items-center justify-center p-4 bg-purple-500/5 border border-purple-500/10 rounded-xl relative min-h-[220px]">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                {/* Background Ring Track */}
                <circle
                  cx="60"
                  cy="60"
                  r="45"
                  className="stroke-purple-500/5 fill-none"
                  strokeWidth="10"
                />

                {/* Slices */}
                {/* Presale 60% */}
                <circle
                  cx="60"
                  cy="60"
                  r="45"
                  className="stroke-[#10b981] fill-none transition-all duration-300 cursor-pointer"
                  strokeWidth={activeId === 'presale' ? '13' : '10'}
                  strokeDasharray={`${282.74 * 0.60} 282.74`}
                  strokeDashoffset="0"
                  strokeLinecap="round"
                  onMouseEnter={() => setActiveId('presale')}
                  onMouseLeave={() => setActiveId(null)}
                />

                {/* Liquidity 30% */}
                <circle
                  cx="60"
                  cy="60"
                  r="45"
                  className="stroke-[#06b6d4] fill-none transition-all duration-300 cursor-pointer"
                  strokeWidth={activeId === 'liquidity' ? '13' : '10'}
                  strokeDasharray={`${282.74 * 0.30} 282.74`}
                  strokeDashoffset={-282.74 * 0.60}
                  strokeLinecap="round"
                  onMouseEnter={() => setActiveId('liquidity')}
                  onMouseLeave={() => setActiveId(null)}
                />

                {/* Development 10% */}
                <circle
                  cx="60"
                  cy="60"
                  r="45"
                  className="stroke-[#ec4899] fill-none transition-all duration-300 cursor-pointer"
                  strokeWidth={activeId === 'dev' ? '13' : '10'}
                  strokeDasharray={`${282.74 * 0.10} 282.74`}
                  strokeDashoffset={-282.74 * 0.90}
                  strokeLinecap="round"
                  onMouseEnter={() => setActiveId('dev')}
                  onMouseLeave={() => setActiveId(null)}
                />
              </svg>

              {/* Center Overlay Telemetry Info */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none font-mono">
                <span className="text-[9px] uppercase tracking-wider text-slate-500 leading-none">
                  {activeId === 'presale' ? 'Presale' : activeId === 'liquidity' ? 'LP Pools' : activeId === 'dev' ? 'Ecosystem' : 'All Slices'}
                </span>
                <span className="text-xl font-black text-white leading-none mt-0.5">
                  {activeId === 'presale' ? '60%' : activeId === 'liquidity' ? '30%' : activeId === 'dev' ? '10%' : '100%'}
                </span>
                <span className="text-[8px] text-purple-400 mt-1 uppercase tracking-tight">Verified</span>
              </div>
            </div>
            <span className="text-[9px] font-mono text-slate-500 mt-3 block">Hover slices to unpack direct percentage rates.</span>
          </div>

          {/* Slices Legends List (Col: 7) */}
          <div className="md:col-span-7 space-y-3.5">
            {/* Presale Profile */}
            <div 
              onMouseEnter={() => setActiveId('presale')}
              onMouseLeave={() => setActiveId(null)}
              className={`p-3.5 rounded-xl border transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                activeId === 'presale' 
                  ? 'bg-purple-500/10 border-emerald-500/30' 
                  : themeMode === 'light' ? 'bg-slate-50/70 border-slate-100 hover:bg-slate-100/50' : 'bg-purple-500/5 border-purple-500/5 hover:border-purple-500/15'
              }`}
            >
              <div className="flex gap-3">
                <span className="w-1.5 h-auto rounded-full bg-[#10b981] shrink-0" />
                <div className="space-y-0.5 text-xs text-left">
                  <strong className="block font-bold">Fair Launch Presale Platform (60.00%)</strong>
                  <p className="text-[11px] text-slate-400">Allocated for decentralized launches to foster widespread, community-owned distribution.</p>
                </div>
              </div>
              <div className="font-mono text-right shrink-0 text-xs">
                <strong className="block text-[#10b981] font-extrabold">11,938,743 $SURCHI</strong>
                <span className="text-[9px] text-slate-500 uppercase font-medium">Fair Launch allocation</span>
              </div>
            </div>

            {/* Locked LP pools profile */}
            <div 
              onMouseEnter={() => setActiveId('liquidity')}
              onMouseLeave={() => setActiveId(null)}
              className={`p-3.5 rounded-xl border transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                activeId === 'liquidity' 
                  ? 'bg-purple-500/10 border-cyan-500/30' 
                  : themeMode === 'light' ? 'bg-slate-50/70 border-slate-100 hover:bg-slate-100/50' : 'bg-purple-500/5 border-purple-500/5 hover:border-purple-500/15'
              }`}
            >
              <div className="flex gap-3">
                <span className="w-1.5 h-auto rounded-full bg-[#06b6d4] shrink-0" />
                <div className="space-y-0.5 text-xs text-left">
                  <strong className="block font-bold">Locked Automated Exchange Liquidity (30.00%)</strong>
                  <p className="text-[11px] text-slate-400">Sealed in decentralized liquidity indexes to back consistent, robust platform operation.</p>
                </div>
              </div>
              <div className="font-mono text-right shrink-0 text-xs">
                <strong className="block text-[#06b6d4] font-extrabold">5,969,372 $SURCHI</strong>
                <span className="text-[9px] text-slate-500 uppercase font-medium">100% Locked Protocol</span>
              </div>
            </div>

            {/* Treasury & Core development profile */}
            <div 
              onMouseEnter={() => setActiveId('dev')}
              onMouseLeave={() => setActiveId(null)}
              className={`p-3.5 rounded-xl border transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                activeId === 'dev' 
                  ? 'bg-purple-500/10 border-pink-500/30' 
                  : themeMode === 'light' ? 'bg-slate-50/70 border-slate-100 hover:bg-slate-100/50' : 'bg-purple-500/5 border-purple-500/5 hover:border-purple-500/15'
              }`}
            >
              <div className="flex gap-3">
                <span className="w-1.5 h-auto rounded-full bg-[#ec4899] shrink-0" />
                <div className="space-y-0.5 text-xs text-left">
                  <strong className="block font-bold">Ecosystem, listing & partnership registry (10.00%)</strong>
                  <p className="text-[11px] text-slate-400">Vesting reserves for major indexers, AI calculated storage nodes, security audits, and key partners.</p>
                </div>
              </div>
              <div className="font-mono text-right shrink-0 text-xs">
                <strong className="block text-[#ec4899] font-extrabold">1,989,790 $SURCHI</strong>
                <span className="text-[9px] text-slate-500 uppercase font-medium">Smart linear vesting</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* THE OFFICIAL VERIFIED LINKS DIRECTORY (ONLY CLICKABLE ICONS) */}
      <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left ${
        themeMode === 'light' ? 'bg-white border-slate-100' : 'bg-[#090a14] border-[#8b5cf6]/15'
      }`}>
        <div className="flex items-center gap-2.5">
          <Icons.ExternalLink className="w-5 h-5 text-purple-400 shrink-0" />
          <div className="space-y-0.5">
            <h4 className="text-xs font-extrabold uppercase font-mono tracking-wider text-purple-400 leading-none">
              Ecosystem Verified Channels
            </h4>
            <p className="text-[10px] text-slate-500">Only official, vetted community channels and networks.</p>
          </div>
        </div>

        {/* Well organized social icons row - clean and not consuming excessive space */}
        <div className="flex items-center gap-2">
          {/* Website */}
          <a
            href="https://www.surchi.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full border border-purple-500/15 bg-purple-500/5 hover:bg-[#8B5CF6] hover:text-white text-purple-400 hover:border-transparent flex items-center justify-center transition-all duration-300 shadow-sm"
            title="Official Website"
          >
            <Icons.Globe className="w-4.5 h-4.5" />
          </a>

          {/* Twitter / X */}
          <a
            href="https://x.com/surchicoin"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full border border-purple-500/15 bg-purple-500/5 hover:bg-[#8B5CF6] hover:text-white text-purple-400 hover:border-transparent flex items-center justify-center transition-all duration-300 shadow-sm"
            title="Twitter / X Profile"
          >
            <Icons.Twitter className="w-4.5 h-4.5" />
          </a>

          {/* Instagram */}
          <a
            href="https://www.instagram.com/surchiai?igsh=YXlhY2VkZ2lxam9w"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full border border-purple-500/15 bg-purple-500/5 hover:bg-[#8B5CF6] hover:text-white text-purple-400 hover:border-transparent flex items-center justify-center transition-all duration-300 shadow-sm"
            title="Instagram Channel"
          >
            <Icons.Instagram className="w-4.5 h-4.5" />
          </a>

          {/* Discord */}
          <a
            href="https://discord.gg/YANGvFfvax"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full border border-purple-500/15 bg-purple-500/5 hover:bg-[#8B5CF6] hover:text-white text-purple-400 hover:border-transparent flex items-center justify-center transition-all duration-300 shadow-sm"
            title="Discord Server"
          >
            <Icons.MessageSquare className="w-4.5 h-4.5" />
          </a>

          {/* Github */}
          <a
            href="https://github.com/surchiai"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full border border-purple-500/15 bg-purple-500/5 hover:bg-[#8B5CF6] hover:text-white text-purple-400 hover:border-transparent flex items-center justify-center transition-all duration-300 shadow-sm"
            title="Github Repository"
          >
            <Icons.Github className="w-4.5 h-4.5" />
          </a>
        </div>
      </div>

    </div>
  );
}
