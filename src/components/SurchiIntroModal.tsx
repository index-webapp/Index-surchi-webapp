import React, { useState } from 'react';
import * as Icons from 'lucide-react';

import TokenomicsDashboard from './TokenomicsDashboard';
import StakingDashboard from './StakingDashboard';
import RoadmapDashboard from './RoadmapDashboard';
import ProductsDashboard from './ProductsDashboard';
import SurchiBuildingStatus from './SurchiBuildingStatus';

interface SurchiIntroModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeMode?: 'dark' | 'light';
  onProceedToAnalyzer?: () => void;
}

interface PartnerLogoProps {
  src: string;
  fallbackDomain?: string;
  alt: string;
  className?: string;
  fallbackText: string;
  themeColor: string;
  bgColor?: string;
}

function PartnerLogo({ 
  src, 
  fallbackDomain, 
  alt, 
  className = "w-10 h-10", 
  fallbackText, 
  themeColor, 
  bgColor 
}: PartnerLogoProps) {
  const [errorCount, setErrorCount] = useState(0);

  const getSrc = () => {
    if (errorCount === 0) return src;
    if (errorCount === 1 && fallbackDomain) return `https://www.google.com/s2/favicons?sz=128&domain=${fallbackDomain}`;
    if (errorCount === 2 && fallbackDomain) return `https://logo.clearbit.com/${fallbackDomain}`;
    return ''; // pure visual CSS fallback
  };

  const currentSrc = getSrc();

  if (!currentSrc) {
    return (
      <div 
        className={`${className} rounded-lg flex items-center justify-center font-bold text-[11px] tracking-wide font-mono shrink-0 border select-none`}
        style={{ 
          backgroundColor: bgColor || `${themeColor}15`, 
          borderColor: `${themeColor}40`,
          color: themeColor,
          textShadow: `0 0 10px ${themeColor}30`
        }}
      >
        {fallbackText}
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={`${className} rounded-lg object-contain shrink-0 border`}
      style={{
        backgroundColor: bgColor || 'rgba(0, 0, 0, 0.25)',
        borderColor: `${themeColor}22`
      }}
      referrerPolicy="no-referrer"
      onError={() => {
        setErrorCount(prev => prev + 1);
      }}
    />
  );
}

export default function SurchiIntroModal({ isOpen, onClose, themeMode = 'dark', onProceedToAnalyzer }: SurchiIntroModalProps) {
  if (!isOpen) return null;

  const isLight = themeMode === 'light';
  const [activeTab, setActiveTab] = useState<'info' | 'about' | 'products' | 'tokenomics' | 'staking' | 'roadmap' | 'partners'>('info');

  const currentPartners = [
    {
      name: 'PinkSale.finance',
      url: 'https://www.pinksale.finance',
      description: 'The premium protocol launchpad hosting decentralized token distribution and verified liquidity locks.',
      badge: 'Launchpad Host',
      iconTheme: '#ff4b82',
      logo: (
        <PartnerLogo
          src="https://www.google.com/s2/favicons?sz=128&domain=pinksale.finance"
          fallbackDomain="pinksale.finance"
          alt="PinkSale Logo"
          fallbackText="PS"
          themeColor="#ff4b82"
          bgColor="#14020a"
          className="w-10 h-10 p-1 bg-[#14020a]/70"
        />
      )
    },
    {
      name: 'dexview.com',
      url: 'https://www.dexview.com',
      description: 'Ultra-fast decentralized market charting, live security statistics, and transaction ledger stream telemetry.',
      badge: 'Data Oracle',
      iconTheme: '#00e5ff',
      logo: (
        <PartnerLogo
          src="https://www.google.com/s2/favicons?sz=128&domain=dexview.com"
          fallbackDomain="dexview.com"
          alt="Dexview Logo"
          fallbackText="DV"
          themeColor="#00e5ff"
          bgColor="#020d14"
          className="w-10 h-10 p-1 bg-[#020d14]/70"
        />
      )
    },
    {
      name: 'Raydium.io',
      url: 'https://raydium.io',
      description: 'The supreme decentralized automated market maker providing infinite trading depths and liquidity pool tools.',
      badge: 'Primary DEX Pool',
      iconTheme: '#00ff88',
      logo: (
        <PartnerLogo
          src="https://assets.coingecko.com/coins/images/15243/large/raydium.png"
          fallbackDomain="raydium.io"
          alt="Raydium Logo"
          fallbackText="RD"
          themeColor="#00ff88"
          bgColor="#02140a"
          className="w-10 h-10 p-1 bg-[#02140a]/70"
        />
      )
    },
    {
      name: 'jup.ag',
      url: 'https://jup.ag',
      description: 'The premier swap aggregation engine on Solana routing trades across all decentralized exchanges for optimal price execution.',
      badge: 'Solana Swap Route',
      iconTheme: '#a855f7',
      logo: (
        <PartnerLogo
          src="https://assets.coingecko.com/coins/images/34188/large/jup.png"
          fallbackDomain="jup.ag"
          alt="Jupiter Logo"
          fallbackText="JP"
          themeColor="#a855f7"
          bgColor="#0d021c"
          className="w-10 h-10 p-1 bg-[#0d021c]/70"
        />
      )
    },
    {
      name: 'cryptopanic.com',
      url: 'https://cryptopanic.com',
      description: 'The supreme crypto news aggregator offering immediate sentiment signals, breaking alerts, and deep market impact tracking.',
      badge: 'News Aggregator',
      iconTheme: '#ec4899',
      logo: (
        <PartnerLogo
          src="https://cryptopanic.com/static/images/panic-logo-ico.png"
          fallbackDomain="cryptopanic.com"
          alt="CryptoPanic Logo"
          fallbackText="CP"
          themeColor="#ec4899"
          bgColor="#140210"
          className="w-10 h-10 p-1 bg-[#140210]/70"
        />
      )
    }
  ];

  const futurePartners = [
    {
      name: 'Binance',
      url: 'https://www.binance.com?utm_source=chatgpt.com',
      note: 'Targeted listing for Tier-1 global liquidity matching.',
      logo: (
        <PartnerLogo
          src="https://assets.coingecko.com/markets/images/1/large/binance.png"
          fallbackDomain="binance.com"
          alt="Binance Logo"
          fallbackText="BN"
          themeColor="#F3BA2F"
          className="w-8 h-8 p-0.5 bg-slate-900/40 border border-amber-500/20 shrink-0"
        />
      )
    },
    {
      name: 'Bybit',
      url: 'https://www.bybit.com?utm_source=chatgpt.com',
      note: 'Derivatives protocol matching security parameters.',
      logo: (
        <PartnerLogo
          src="https://assets.coingecko.com/markets/images/521/large/bybit-logo.png"
          fallbackDomain="bybit.com"
          alt="Bybit Logo"
          fallbackText="BY"
          themeColor="#38bdf8"
          className="w-8 h-8 p-0.5 bg-slate-900/40 border border-sky-500/20 shrink-0"
        />
      )
    },
    {
      name: 'Bitget',
      url: 'https://www.bitget.com?utm_source=chatgpt.com',
      note: 'Smart copy trading integration candidate.',
      logo: (
        <PartnerLogo
          src="https://assets.coingecko.com/markets/images/1169/large/Bitget_Exchange_Logo.png"
          fallbackDomain="bitget.com"
          alt="Bitget Logo"
          fallbackText="BG"
          themeColor="#00F0FF"
          className="w-8 h-8 p-0.5 bg-slate-900/40 border border-cyan-500/20 shrink-0"
        />
      )
    },
    {
      name: 'Gate.io',
      url: 'https://www.gate.io?utm_source=chatgpt.com',
      note: 'Gateway listing review under preparation.',
      logo: (
        <PartnerLogo
          src="https://assets.coingecko.com/markets/images/302/large/gateio.png"
          fallbackDomain="gate.io"
          alt="Gate.io Logo"
          fallbackText="GT"
          themeColor="#4F46E5"
          className="w-8 h-8 p-0.5 bg-slate-900/40 border border-indigo-500/20 shrink-0"
        />
      )
    },
    {
      name: 'MEXC',
      url: 'https://www.mexc.com?utm_source=chatgpt.com',
      note: 'Pre-listing compliance and liquidity review.',
      logo: (
        <PartnerLogo
          src="https://assets.coingecko.com/markets/images/544/large/mexc-logo.png"
          fallbackDomain="mexc.com"
          alt="MEXC Logo"
          fallbackText="MX"
          themeColor="#16B97A"
          className="w-8 h-8 p-0.5 bg-slate-900/40 border border-emerald-500/20 shrink-0"
        />
      )
    },
    {
      name: 'KuCoin',
      url: 'https://www.kucoin.com?utm_source=chatgpt.com',
      note: 'Consensus builder listing pipeline review.',
      logo: (
        <PartnerLogo
          src="https://assets.coingecko.com/markets/images/311/large/kucoin.png"
          fallbackDomain="kucoin.com"
          alt="KuCoin Logo"
          fallbackText="KC"
          themeColor="#00E676"
          className="w-8 h-8 p-0.5 bg-slate-900/40 border border-emerald-400/20 shrink-0"
        />
      )
    },
    {
      name: 'XT.com',
      url: 'https://www.xt.com?utm_source=chatgpt.com',
      note: 'Global strategic index exposure protocol.',
      logo: (
        <PartnerLogo
          src="https://assets.coingecko.com/markets/images/504/large/XT.png"
          fallbackDomain="xt.com"
          alt="XT.com Logo"
          fallbackText="XT"
          themeColor="#FF9800"
          className="w-8 h-8 p-0.5 bg-slate-900/40 border border-orange-500/20 shrink-0"
        />
      )
    }
  ];

  const aggregatorPartners = [
    {
      name: 'CoinGecko',
      url: 'https://www.coingecko.com',
      description: 'The world\'s largest independent cryptocurrency data aggregator with global valuation telemetry.',
      themeColor: '#8CC63F',
      logo: (
        <PartnerLogo
          src="https://www.google.com/s2/favicons?sz=128&domain=coingecko.com"
          fallbackDomain="coingecko.com"
          alt="CoinGecko Logo"
          fallbackText="CG"
          themeColor="#8CC63F"
          bgColor="#0c140c"
          className="w-8 h-8 p-0.5 bg-slate-900/40 border border-emerald-500/20 shrink-0"
        />
      )
    },
    {
      name: 'CoinMarketCap',
      url: 'https://coinmarketcap.com',
      description: 'The most-referenced price-tracking website for digital assets in the rapidly growing crypto space.',
      themeColor: '#3861fb',
      logo: (
        <PartnerLogo
          src="https://www.google.com/s2/favicons?sz=128&domain=coinmarketcap.com"
          fallbackDomain="coinmarketcap.com"
          alt="CoinMarketCap Logo"
          fallbackText="CMC"
          themeColor="#3861fb"
          bgColor="#05081c"
          className="w-8 h-8 p-0.5 bg-slate-900/40 border border-blue-500/20 shrink-0"
        />
      )
    },
    {
      name: 'Birdeye',
      url: 'https://birdeye.so',
      description: 'Data aggregator for supreme chain-native traders featuring instantaneous price discovery feeds.',
      themeColor: '#1CE687',
      logo: (
        <PartnerLogo
          src="https://www.google.com/s2/favicons?sz=128&domain=birdeye.so"
          fallbackDomain="birdeye.so"
          alt="Birdeye Logo"
          fallbackText="BE"
          themeColor="#1CE687"
          bgColor="#02140a"
          className="w-8 h-8 p-0.5 bg-slate-900/40 border border-green-500/20 shrink-0"
        />
      )
    },
    {
      name: 'DEX Screener',
      url: 'https://dexscreener.com',
      description: 'Real-time charts, trade history, and transaction metrics across deep decentralized networks.',
      themeColor: '#17b6dc',
      logo: (
        <PartnerLogo
          src="https://www.google.com/s2/favicons?sz=128&domain=dexscreener.com"
          fallbackDomain="dexscreener.com"
          alt="DEX Screener Logo"
          fallbackText="DS"
          themeColor="#17b6dc"
          bgColor="#021014"
          className="w-8 h-8 p-0.5 bg-slate-900/40 border border-cyan-500/20 shrink-0"
        />
      )
    },
    {
      name: 'DefiLlama',
      url: 'https://defillama.com',
      description: 'The largest open-source DeFi TVL, volume, yield and liquid protocol statistics aggregator.',
      themeColor: '#FA3B3B',
      logo: (
        <PartnerLogo
          src="https://www.google.com/s2/favicons?sz=128&domain=defillama.com"
          fallbackDomain="defillama.com"
          alt="DefiLlama Logo"
          fallbackText="DL"
          themeColor="#FA3B3B"
          bgColor="#140404"
          className="w-8 h-8 p-0.5 bg-slate-900/40 border border-red-500/20 shrink-0"
        />
      )
    }
  ];

  return (
    <div className={`fixed inset-0 ${isLight ? 'bg-slate-900/60' : 'bg-[#020207]/90'} backdrop-blur-md flex items-center justify-center p-3 sm:p-6 z-[100] animate-fade-in`}>
      <div className={`w-full max-w-4xl rounded-2xl flex flex-col relative max-h-[92vh] overflow-hidden ${
        isLight 
          ? 'bg-white border border-slate-200 shadow-[0_10px_50px_rgba(15,23,42,0.15)] text-slate-800' 
          : 'bg-[#04040d]/98 border border-cyber-cyan/35 shadow-[0_0_60px_rgba(0,229,255,0.18)] text-white'
      }`}>
        
        {/* Header Ambient Glow */}
        {!isLight && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-32 bg-gradient-to-b from-cyber-cyan/15 to-transparent pointer-events-none rounded-full blur-2xl"></div>
        )}

        {/* Modal Header */}
        <div className={`p-4 sm:p-5 flex items-center justify-between shrink-0 ${
          isLight ? 'bg-slate-50 border-b border-slate-200' : 'bg-[#08081a] border-b border-cyber-border'
        }`}>
          <div className="flex items-center gap-2.5 text-left">
            <span className={`p-1.5 rounded border ${
              isLight ? 'bg-cyan-50 border-cyan-200 text-cyan-600' : 'bg-cyber-cyan/15 border-cyber-cyan/30 text-cyber-cyan'
            }`}>
              <Icons.Cpu className="w-5 h-5 animate-pulse" />
            </span>
            <div>
              <span className={`text-[9px] font-mono tracking-widest uppercase font-black block ${
                isLight ? 'text-indigo-600' : 'text-cyber-cyan'
              }`}>SYSTEM EXPLORER & PORTAL</span>
              <h3 className={`text-sm sm:text-base font-black font-display uppercase tracking-tight ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>ABOUT $SURCHI & ECOSYSTEM DIRECTORY</h3>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className={`p-1.5 rounded-lg cursor-pointer transition-all ${
              isLight 
                ? 'bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200' 
                : 'bg-cyber-card hover:bg-rose-950/40 text-slate-400 hover:text-red-400 border border-cyber-border'
            }`}
            title="Deactivate core documentation overlay"
          >
            <Icons.X className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Navigation Tab Bar */}
        <div className={`flex items-center gap-1.5 px-4.5 py-2.5 overflow-x-auto shrink-0 select-none ${
          isLight ? 'bg-slate-100/80 border-b border-indigo-100/80' : 'bg-[#060614] border-b border-cyber-border/80'
        }`}>
          {[
            { id: 'info', label: 'Mission & Vision', icon: Icons.Cpu },
            { id: 'products', label: 'Ecosystem Suite', icon: Icons.Layers },
            { id: 'tokenomics', label: 'Tokenomics', icon: Icons.PieChart },
            { id: 'staking', label: 'Staking Node', icon: Icons.Activity },
            { id: 'roadmap', label: 'Roadmap', icon: Icons.Compass },
            { id: 'partners', label: 'Partnerships', icon: Icons.ShieldCheck },
            { id: 'about', label: 'About Surchi', icon: Icons.Info }
          ].map((tab) => {
            const isSelected = activeTab === tab.id;
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 text-[10px] sm:text-xs font-mono font-bold tracking-wider rounded-lg border whitespace-nowrap cursor-pointer transition-all select-none hover:scale-[1.01] active:scale-[0.99] ${
                  isSelected
                    ? isLight
                      ? 'bg-cyan-600 border-cyan-500 text-white shadow-sm shadow-cyan-200'
                      : 'bg-[#00E5FF] border-[#00E5FF]/80 text-black shadow-[0_0_12px_rgba(0,229,255,0.3)]'
                    : isLight
                      ? 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      : 'bg-cyber-card/60 border-cyber-border hover:bg-cyber-card-light text-slate-400'
                }`}
              >
                <TabIcon className="w-3.5 h-3.5" />
                <span>{tab.label.toUpperCase()}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Content Container */}
        <div className={`flex-1 overflow-y-auto p-5 sm:p-6 md:p-8 ${
          isLight ? 'text-slate-700 bg-white' : 'text-slate-300 bg-[#020206]'
        }`}>
          
          {activeTab === 'info' && (
            <div className="space-y-6 animate-fade-in text-left">
              {/* Helpful section selector alert hint */}
              <div className={`p-4 rounded-xl border flex items-center justify-between gap-4 text-xs font-sans ${
                isLight 
                  ? 'bg-indigo-50/50 border-indigo-200 text-slate-800' 
                  : 'bg-cyber-cyan/8 border-cyber-cyan/20 text-slate-300'
              }`}>
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-lg shrink-0 ${isLight ? 'bg-indigo-100 text-indigo-600' : 'bg-cyber-cyan/20 text-cyber-cyan'}`}>
                    <Icons.Lightbulb className="w-4.5 h-4.5" />
                  </div>
                  <p className="text-[11.5px] leading-relaxed">
                    <strong className={isLight ? 'text-indigo-600' : 'text-cyber-cyan'}>EXPLORE MORE:</strong> Discover the full scope of SURCHI! Select the tabs above to explore the <strong>Ecosystem Suite</strong>, <strong>Tokenomics</strong>, <strong>Staking Node</strong>, <strong>Roadmap</strong>, and <strong>Partnerships</strong>.
                  </p>
                </div>
                <div className={`hidden md:flex items-center gap-1 font-mono text-[9px] font-extrabold uppercase tracking-widest ${
                  isLight ? 'text-indigo-600' : 'text-cyber-cyan'
                } animate-pulse shrink-0`}>
                  <span>Explore Above</span>
                  <Icons.ArrowUp className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Core Statement Card */}
              <div id="surchi-mission-statement" className={`p-5 rounded-xl border relative overflow-hidden ${
                isLight ? 'border-cyan-200 bg-cyan-50/50 text-slate-800' : 'border-cyber-cyan/20 bg-cyber-cyan/5'
              }`}>
                <div className={`absolute top-0 right-0 p-1 font-mono text-[7px] font-bold ${
                  isLight ? 'text-cyan-400' : 'text-cyber-cyan/40'
                }`}>CORE-METRIC-01</div>
                <p className="font-medium leading-relaxed select-text text-sm sm:text-base">
                  <strong className={isLight ? 'text-slate-900' : 'text-white'}>SURCHI</strong> is an AI-powered DeFi ecosystem built on Solana, created to simplify the crypto experience through intelligent tools, AI-driven analytics, automation, and smart blockchain insights.
                </p>
              </div>

              {/* Info Columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className={`p-4.5 rounded-xl border space-y-2 ${
                  isLight ? 'border-slate-150 bg-slate-50/50' : 'border-cyber-border bg-[#070715]/50'
                }`}>
                  <div className={`flex items-center gap-1.5 font-mono font-bold text-[10px] uppercase ${
                    isLight ? 'text-indigo-600' : 'text-cyber-cyan'
                  }`}>
                    <Icons.BrainCircuit className="w-3.5 h-3.5" />
                    Smarter DeFi Layer
                  </div>
                  <p className="text-[11.5px] leading-relaxed font-sans">
                    The core idea behind SURCHI is to make decentralized finance smarter, easier, and more accessible for everyone by combining artificial intelligence with blockchain technology.
                  </p>
                </div>

                <div className={`p-4.5 rounded-xl border space-y-2 ${
                  isLight ? 'border-slate-150 bg-slate-50/50' : 'border-cyber-border bg-[#070715]/50'
                }`}>
                  <div className={`flex items-center gap-1.5 font-mono font-bold text-[10px] uppercase ${
                    isLight ? 'text-emerald-600' : 'text-cyber-neon'
                  }`}>
                    <Icons.Activity className="w-3.5 h-3.5" />
                    Genuine Utility Focus
                  </div>
                  <p className="text-[11.5px] leading-relaxed font-sans">
                    Unlike many projects in the market today, SURCHI is not being built as just another hype-driven crypto token with no real purpose. SURCHI is focused on utility, ecosystem development, and long-term value creation.
                  </p>
                </div>
              </div>

              {/* Ecosystem Utilities Card */}
              <div className={`p-5 rounded-xl border space-y-3 ${
                isLight ? 'border-slate-200 bg-[#faf9fe]' : 'border-cyber-border bg-[#050510]/80'
              }`}>
                <h4 className={`text-xs font-bold uppercase tracking-wider font-mono flex items-center gap-1.5 border-b pb-1.5 ${
                  isLight ? 'text-slate-800 border-slate-200' : 'text-white border-cyber-border'
                }`}>
                  <Icons.Coins className="w-4 h-4 text-amber-500" />
                  Token Core Mechanics & Use Cases
                </h4>
                <p className="text-[11.5px] leading-relaxed font-sans">
                  The SURCHI token is designed to have real use cases within the ecosystem, including premium access, validator node staking, governance voting weights, and specialized AI analytics.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-[10.5px] font-mono">
                  {[
                    'Premium AI Tools', 'Intelligent Analytics', 'Ecosystem Utilities',
                    'Platform Participation', 'Community Rewards', 'Future Integrations'
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isLight ? 'bg-cyan-500' : 'bg-cyber-cyan'}`}></span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Surchi Building Status (Telemetry sequential core) moved to main Analyze page */}

              {/* Ecosystem Migration Protocol Card */}
              <div className="border border-cyber-border bg-cyber-card/30 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-cyber-border pb-2">
                  <div className="flex items-center gap-2">
                    <Icons.Info className="w-4 h-4 text-cyber-cyan animate-pulse" />
                    <h5 className="text-xs font-black font-display uppercase tracking-widest text-cyber-text">
                      Ecosystem Migration Note
                    </h5>
                  </div>
                </div>
                <p className="text-[11.5px] leading-relaxed text-cyber-text-muted">
                  After the presale program ends, the Surchi application will be upgraded into a fully functional decentralized platform.
                  During this upgrade phase, Surchi token utilities, roadmap details, staking dashboards, and statistics reside within this sovereign directory panel to guarantee smooth, fast workspace loading metrics.
                </p>
              </div>

              {/* COMPACT RESOURCE AND DIRECTORY PORTALS */}
              <div className="pt-4 border-t border-cyber-border/10 flex flex-wrap justify-center items-center gap-3">
                {/* About Clickable Button */}
                <button
                  onClick={() => {
                    setActiveTab('about');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-[10px] uppercase font-mono font-bold border transition-all flex items-center gap-1.5 hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-xs ${
                    isLight
                      ? 'bg-cyan-50 hover:bg-cyan-100/80 text-cyan-600 border-cyan-250 border-cyan-200'
                      : 'bg-cyber-cyan/10 hover:bg-cyber-cyan/20 text-[#00E5FF] hover:text-[#52f2ff] border-[#00E5FF]/30'
                  }`}
                >
                  <Icons.Info className="w-3.5 h-3.5" />
                  <span>ABOUT</span>
                </button>

                {/* Read More Clickable Button */}
                <a
                  href="https://drive.google.com/file/d/1qRYj5f4d99Q1JHzKYYQkoiVYT76LeQYO/view?usp=drivesdk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-3 py-1.5 rounded-lg text-[10px] uppercase font-mono font-bold border transition-all flex items-center gap-1.5 hover:scale-[1.01] active:scale-[0.99] no-underline cursor-pointer shadow-xs ${
                    isLight
                      ? 'bg-emerald-50 hover:bg-emerald-100/80 text-emerald-700 border-emerald-200'
                      : 'bg-[#051a10] hover:bg-[#092b1a] text-[#00ff88] hover:text-[#52ffb0] border-[#00ff88]/25'
                  }`}
                >
                  <Icons.BookOpen className="w-3.5 h-3.5" />
                  <span>READ MORE</span>
                  <Icons.ExternalLink className="w-3 h-3 text-current/70" />
                </a>

                {/* Official White Paper Clickable Button */}
                <a
                  href="https://drive.google.com/file/d/1FfFQRwgX4q4WLGG08kWmQYI2z79uloe4/view?usp=drivesdk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-3 py-1.5 rounded-lg text-[10px] uppercase font-mono font-bold border transition-all flex items-center gap-1.5 hover:scale-[1.01] active:scale-[0.99] no-underline cursor-pointer shadow-xs ${
                    isLight
                      ? 'bg-amber-50 hover:bg-amber-100/80 text-amber-700 border-amber-200'
                      : 'bg-[#211505] hover:bg-[#342109] text-[#ffaa00] hover:text-[#ffca55] border-[#ffaa00]/25'
                  }`}
                >
                  <Icons.FileText className="w-3.5 h-3.5" />
                  <span>OFFICIAL WHITEPAPER</span>
                  <Icons.ExternalLink className="w-3 h-3 text-current/70" />
                </a>
              </div>
            </div>
          )}

          {/* Deleted old about block rendering node */}

          {activeTab === 'products' && (
            <div className="animate-fade-in text-left">
              <ProductsDashboard />
            </div>
          )}

          {activeTab === 'tokenomics' && (
            <div className="animate-fade-in text-left">
              <TokenomicsDashboard themeMode={themeMode} />
            </div>
          )}

          {activeTab === 'staking' && (
            <div className="animate-fade-in text-left">
              <StakingDashboard themeMode={themeMode} />
            </div>
          )}

          {activeTab === 'roadmap' && (
            <div className="animate-fade-in text-left">
              <RoadmapDashboard />
            </div>
          )}

          {activeTab === 'partners' && (
            <div className="space-y-6 animate-fade-in">
              {/* Section 1: Strategic Partnerships */}
              <div className="space-y-4 text-left">
                <div className={`flex items-center gap-2 border-b pb-1.5 ${isLight ? 'border-slate-200' : 'border-cyber-border'}`}>
                  <Icons.Award className={`w-4.5 h-4.5 ${isLight ? 'text-indigo-500' : 'text-cyber-neon'}`} />
                  <h4 className={`text-xs sm:text-sm font-bold font-display uppercase tracking-wider ${isLight ? 'text-slate-700' : 'text-cyber-text'}`}>
                    Strategic Partnerships & Core Integrations
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentPartners.map((item, idx) => (
                    <a
                      key={idx}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-4 rounded-xl border transition-all group flex flex-col justify-between h-auto text-left relative no-underline cursor-pointer ${
                        isLight 
                          ? 'border-slate-150 hover:border-indigo-300 bg-slate-50/50 hover:bg-slate-50 shadow-sm' 
                          : 'border-cyber-border hover:border-cyber-cyan/50 bg-[#0d0d22]/45 hover:bg-[#12122e]/60'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          {item.logo}
                          <span className="text-[8px] font-mono font-bold px-2 py-0.5 rounded uppercase border"
                                style={{ borderColor: `${item.iconTheme}40`, backgroundColor: `${item.iconTheme}10`, color: item.iconTheme }}>
                            {item.badge}
                          </span>
                        </div>
                        <div>
                          <h5 className={`text-xs font-black font-display tracking-tight transition-colors ${
                            isLight ? 'text-slate-900 group-hover:text-indigo-600' : 'text-white group-hover:text-cyber-neon'
                          }`}>
                            {item.name}
                          </h5>
                          <p className={`text-[10.5px] leading-relaxed font-sans ${
                            isLight ? 'text-slate-600' : 'text-cyber-text-muted'
                          }`}>
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <div className="pt-2.5 mt-2 border-t border-cyber-border/20 flex items-center justify-between text-[8px] font-mono text-cyber-text-muted">
                        <span>DECENTRALIZED ACTIVE</span>
                        <Icons.ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Section 2: Future Exchange Listings */}
              <div className="space-y-4 text-left">
                <div className={`flex items-center gap-2 border-b pb-1.5 ${isLight ? 'border-slate-200' : 'border-cyber-border'}`}>
                  <Icons.FastForward className={`w-4.5 h-4.5 ${isLight ? 'text-slate-500' : 'text-cyber-cyan animate-pulse'}`} />
                  <h4 className={`text-xs sm:text-sm font-bold font-display uppercase tracking-wider ${isLight ? 'text-slate-700' : 'text-cyber-text'}`}>
                    Future Exchange Listings & Ecosystem Prospects
                  </h4>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {futurePartners.map((item, idx) => (
                    <a
                      key={idx}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-3 rounded-lg border transition-all flex flex-col justify-between text-left h-24 no-underline group ${
                        isLight 
                          ? 'border-slate-200 hover:border-indigo-300 bg-slate-50/50 hover:bg-slate-55' 
                          : 'border-cyber-border/60 hover:border-cyber-cyan bg-[#04040a]/40 hover:bg-[#070719]/65'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {item.logo}
                        <span className={`text-[10px] font-bold font-mono transition-colors truncate ${
                          isLight ? 'text-slate-800' : 'text-white'
                        }`}>
                          {item.name}
                        </span>
                      </div>
                      <p className="text-[8px] leading-tight text-slate-500 line-clamp-2">
                        {item.note}
                      </p>
                    </a>
                  ))}
                </div>
              </div>

              {/* Section 3: Data Aggregators */}
              <div className="space-y-4 text-left">
                <div className={`flex items-center gap-2 border-b pb-1.5 ${isLight ? 'border-slate-200' : 'border-cyber-border'}`}>
                  <Icons.Layers className={`w-4.5 h-4.5 ${isLight ? 'text-slate-500' : 'text-cyber-cyan'}`} />
                  <h4 className={`text-xs sm:text-sm font-bold font-display uppercase tracking-wider ${isLight ? 'text-slate-700' : 'text-cyber-text'}`}>
                    Token Data Aggregators & Indexers
                  </h4>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {aggregatorPartners.map((item, idx) => (
                    <a
                      key={idx}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-3 rounded-lg border transition-all flex items-center gap-3 text-left no-underline group ${
                        isLight 
                          ? 'border-slate-200 hover:border-indigo-300 bg-slate-50/50 hover:bg-slate-55' 
                          : 'border-cyber-border/60 hover:border-cyber-cyan bg-[#04040a]/40 hover:bg-[#070719]/65'
                      }`}
                    >
                      {item.logo}
                      <div className="min-w-0 flex-1">
                        <span className={`text-[10px] font-bold font-mono transition-colors block truncate ${
                          isLight ? 'text-slate-800' : 'text-white'
                        }`}>
                          {item.name}
                        </span>
                        <p className="text-[8.5px] leading-tight text-slate-500 truncate">
                          {item.description}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="space-y-6 animate-fade-in text-left">
              {/* Core Statement Card */}
              <div className={`p-5 rounded-xl border relative overflow-hidden flex flex-col sm:flex-row items-center gap-5 ${
                isLight ? 'border-cyan-200 bg-cyan-50/50 text-slate-850' : 'border-cyber-cyan/20 bg-[#051114]/40 text-slate-300'
              }`}>
                <div className={`w-16 h-16 rounded-2xl border overflow-hidden flex items-center justify-center p-0.5 shrink-0 ${
                  isLight ? 'border-slate-200 bg-slate-50' : 'border-cyber-border bg-[#0d0d1e] shadow-[0_0_20px_rgba(0,255,136,0.12)]'
                }`}>
                  <img
                    src="https://raw.githubusercontent.com/surchiai/surchiai.github.io/refs/heads/main/SURCHI%20logo.jpg"
                    alt="SURCHI Protocol Logo"
                    className="w-full h-full object-cover rounded-[14px]"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="space-y-1 text-center sm:text-left">
                  <h2 className={`text-xl sm:text-2xl font-black tracking-wide uppercase font-display leading-none ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}>
                    SURCHI
                  </h2>
                  <span className={`text-[10px] sm:text-xs font-mono tracking-wide uppercase font-extrabold block ${
                    isLight ? 'text-indigo-600' : 'text-cyber-cyan'
                  }`}>
                    AUTONOMOUS WEB3 INTELLIGENCE PROTOCOL
                  </span>
                </div>
              </div>

              {/* Description Paragraph */}
              <p className={`text-xs sm:text-sm leading-relaxed font-sans ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                <strong className={isLight ? 'text-slate-950' : 'text-white'}>SURCHI</strong> is an advanced web-native autonomous AI engine that transforms sub-second market telemetry into sovereign Web3 execution. Underpinned by ultra-fast decision-making neural layers, SURCHI extracts and acts upon on-chain sentiment flow in real time.
              </p>

              {/* Metric grid card */}
              <div className={`p-4 sm:p-5 rounded-xl space-y-3 font-mono text-xs ${
                isLight ? 'bg-slate-50 border border-slate-200' : 'bg-[#0b0b1a]/55 border border-cyber-border'
              }`}>
                <div className={`flex items-center justify-between pb-2 border-b ${isLight ? 'border-slate-200' : 'border-cyber-border/40'}`}>
                  <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Governance Token</span>
                  <span className={`font-bold ${isLight ? 'text-indigo-600' : 'text-cyber-cyan'}`}>$SURCHI</span>
                </div>
                <div className={`flex items-center justify-between py-1 border-b ${isLight ? 'border-slate-200' : 'border-cyber-border/40'}`}>
                  <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Network Host</span>
                  <span className={`font-bold uppercase text-right ${isLight ? 'text-slate-800' : 'text-white'}`}>SOLANA (SOL) BLOCKCHAIN</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Total Supply</span>
                  <span className={`font-bold ${isLight ? 'text-emerald-600' : 'text-[#00ff88]'}`}>19,897,905 $SURCHI</span>
                </div>
              </div>

              {/* Explanatory italicized label */}
              <p className="text-[10.5px] text-slate-500 italic leading-relaxed font-sans">
                The native utility token <strong>$SURCHI</strong> enables hyper-threaded verification pipelines, distributes cryptographic computation tokens among edge scanning terminals, and secures consensus scoring mechanics.
              </p>

              {/* Raydium Button action link */}
              <a
                href="https://raydium.io/"
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full py-3 rounded-xl cursor-pointer transition-all flex items-center justify-center gap-2 text-xs font-mono font-bold select-none text-center ${
                  isLight
                    ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600 hover:text-emerald-805 border border-emerald-200 shadow-sm'
                    : 'bg-[#10b981]/10 hover:bg-[#10b981]/20 text-[#10b981] hover:text-[#34d399] border border-[#10b981]/20 hover:border-[#10b981]/40 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                } group no-underline`}
              >
                <Icons.Coins className={`w-4 h-4 ${isLight ? 'text-emerald-500' : 'text-[#10b981]'} group-hover:scale-110 transition-transform duration-250`} />
                <span>BUY $SURCHI</span>
                <Icons.ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>

              {/* Social Channels communication block */}
              <div className="space-y-3 pt-2">
                <span className="text-[9.5px] font-mono font-extrabold text-slate-500 tracking-widest uppercase block text-center">OFFICIAL COMMUNICATION CHANNELS</span>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <a 
                    href="https://x.com/surchicoin" 
                    target="_blank" 
                    rel="noreferrer" 
                    title="Twitter / X"
                    className={`w-10 h-10 border rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                      isLight
                        ? 'border-slate-200 hover:border-slate-400 bg-slate-50 hover:bg-slate-100 text-indigo-600 hover:text-indigo-805 shadow-sm'
                        : 'border-cyber-border hover:border-slate-500 bg-[#050512] hover:bg-[#090924] text-cyber-cyan hover:text-white'
                    }`}
                  >
                    <Icons.Twitter className="w-4 h-4" />
                  </a>
                  
                  <a 
                    href="https://t.me/SurchiCommunityChat" 
                    target="_blank" 
                    rel="noreferrer" 
                    title="Telegram Chat"
                    className={`w-10 h-10 border rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                      isLight
                        ? 'border-slate-200 hover:border-slate-400 bg-slate-50 hover:bg-slate-100 text-indigo-650 hover:text-indigo-805 shadow-sm'
                        : 'border-cyber-border hover:border-slate-500 bg-[#050512] hover:bg-[#090924] text-cyber-cyan hover:text-white'
                    }`}
                  >
                    <Icons.Send className="w-4 h-4" />
                  </a>

                  <a 
                    href="https://discord.gg/YANGvFfvax" 
                    target="_blank" 
                    rel="noreferrer" 
                    title="Discord Invite"
                    className={`w-10 h-10 border rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                      isLight
                        ? 'border-slate-200 hover:border-slate-400 bg-slate-50 hover:bg-slate-100 text-indigo-650 hover:text-indigo-805 shadow-sm'
                        : 'border-cyber-border hover:border-slate-500 bg-[#050512] hover:bg-[#090924] text-cyber-cyan hover:text-white'
                    }`}
                  >
                    <Icons.MessageSquare className="w-4 h-4" />
                  </a>

                  <a 
                    href="https://github.com/surchiai" 
                    target="_blank" 
                    rel="noreferrer" 
                    title="GitHub"
                    className={`w-10 h-10 border rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                      isLight
                        ? 'border-slate-200 hover:border-slate-400 bg-slate-50 hover:bg-slate-100 text-indigo-650 hover:text-indigo-805 shadow-sm'
                        : 'border-cyber-border hover:border-slate-500 bg-[#050512] hover:bg-[#090924] text-cyber-cyan hover:text-white'
                    }`}
                  >
                    <Icons.Github className="w-4 h-4" />
                  </a>

                  <a 
                    href="https://www.surchi.xyz" 
                    target="_blank" 
                    rel="noreferrer" 
                    title="Website"
                    className={`w-10 h-10 border rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                      isLight
                        ? 'border-slate-200 hover:border-slate-400 bg-slate-50 hover:bg-slate-100 text-indigo-650 hover:text-indigo-805 shadow-sm'
                        : 'border-cyber-border hover:border-slate-500 bg-[#050512] hover:bg-[#090924] text-cyber-cyan hover:text-white'
                    }`}
                  >
                    <Icons.Globe className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className={`p-4 flex items-center justify-between text-[10px] font-mono shrink-0 ${
          isLight ? 'bg-slate-50 border-t border-slate-200 text-slate-400' : 'bg-[#050510] border-t border-cyber-border text-slate-500'
        }`}>
          <span>SURCHI EXPLORER REV-A3</span>
          <button 
            onClick={onClose}
            className={`px-4 py-2 rounded-lg cursor-pointer transition-all uppercase tracking-wider font-bold select-none text-[10px] ${
              isLight 
                ? 'bg-cyan-100 hover:bg-cyan-200 border border-cyan-200 text-cyan-600 hover:text-cyan-800' 
                : 'bg-cyber-cyan/10 hover:bg-cyber-cyan/25 border border-cyber-cyan/35 text-cyber-cyan hover:text-black'
            }`}
          >
            Acknowledge & Close
          </button>
        </div>

      </div>
    </div>
  );
}
