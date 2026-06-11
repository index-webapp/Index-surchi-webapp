import React, { useState } from 'react';
import * as Icons from 'lucide-react';

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

  // Fallback chain: 
  // 0. Primary Src (Static CoinGecko / exact logo)
  // 1. Google Favicon CDN (super reliable & fast)
  // 2. Clearbit Logo CDN
  // 3. Fallback to inline custom monogram (guarantees NO broken image icon)
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

interface PartnershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeMode?: 'dark' | 'light';
}

export default function PartnershipModal({ isOpen, onClose, themeMode = 'dark' }: PartnershipModalProps) {
  if (!isOpen) return null;

  const isLight = themeMode === 'light';

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
      name: 'Blank',
      url: 'https://blank.com?utm_source=chatgpt.com',
      note: 'Privacy-oriented ecosystem smart-wallet support.',
      logo: (
        <PartnerLogo
          src="https://logo.clearbit.com/blockwallet.io"
          fallbackDomain="blockwallet.io"
          alt="Blank Logo"
          fallbackText="BW"
          themeColor="#9CA3AF"
          className="w-8 h-8 p-0.5 bg-slate-900/40 border border-slate-500/20 shrink-0"
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
    },
    {
      name: 'GeckoTerminal',
      url: 'https://www.geckoterminal.com',
      description: 'DEX tracking terminal powered by CoinGecko, covering full multi-chain pool data live logs.',
      themeColor: '#8CC63F',
      logo: (
        <PartnerLogo
          src="https://www.google.com/s2/favicons?sz=128&domain=geckoterminal.com"
          fallbackDomain="geckoterminal.com"
          alt="GeckoTerminal Logo"
          fallbackText="GT"
          themeColor="#8CC63F"
          bgColor="#0c140c"
          className="w-8 h-8 p-0.5 bg-slate-900/40 border border-emerald-500/20 shrink-0"
        />
      )
    },
    {
      name: 'Token Terminal',
      url: 'https://tokenterminal.com',
      description: 'Institutional-grade data aggregator tracking financial metrics on blockchains and dApps.',
      themeColor: '#0052FF',
      logo: (
        <PartnerLogo
          src="https://www.google.com/s2/favicons?sz=128&domain=tokenterminal.com"
          fallbackDomain="tokenterminal.com"
          alt="Token Terminal Logo"
          fallbackText="TT"
          themeColor="#0052FF"
          bgColor="#020814"
          className="w-8 h-8 p-0.5 bg-slate-900/40 border border-indigo-500/20 shrink-0"
        />
      )
    },
    {
      name: 'Dune Analytics',
      url: 'https://dune.com',
      description: 'Community-powered blockchain research queries offering custom dashboard visualizers.',
      themeColor: '#F3752A',
      logo: (
        <PartnerLogo
          src="https://www.google.com/s2/favicons?sz=128&domain=dune.com"
          fallbackDomain="dune.com"
          alt="Dune Logo"
          fallbackText="DN"
          themeColor="#F3752A"
          bgColor="#140802"
          className="w-8 h-8 p-0.5 bg-slate-900/40 border border-orange-500/20 shrink-0"
        />
      )
    },
    {
      name: 'TradingView',
      url: 'https://www.tradingview.com',
      description: 'Advanced charting panel and social network for global technical analysts on standard metrics.',
      themeColor: '#1976D2',
      logo: (
        <PartnerLogo
          src="https://www.google.com/s2/favicons?sz=128&domain=tradingview.com"
          fallbackDomain="tradingview.com"
          alt="TradingView Logo"
          fallbackText="TV"
          themeColor="#1976D2"
          bgColor="#020a14"
          className="w-8 h-8 p-0.5 bg-slate-900/40 border border-blue-500/20 shrink-0"
        />
      )
    }
  ];

  return (
    <div className={`fixed inset-0 ${isLight ? 'bg-slate-900/60' : 'bg-[#020207]/92'} backdrop-blur-md flex items-center justify-center p-3 sm:p-6 z-[100] animate-fade-in select-none`}>
      <div className={`w-full max-w-4xl rounded-2xl flex flex-col relative max-h-[92vh] overflow-y-auto ${
        isLight 
          ? 'bg-white border border-slate-200 shadow-[0_10px_50px_rgba(15,23,42,0.15)] text-slate-800' 
          : 'bg-[#080814]/98 border border-cyber-cyan/35 shadow-[0_0_60px_rgba(0,229,255,0.18)] text-white'
      }`}>
        
        {/* Header decoration */}
        {!isLight && (
          <>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyber-cyan/10 to-transparent pointer-events-none rounded-bl-full animate-pulse-safe"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-cyber-neon/5 to-transparent pointer-events-none rounded-tr-full"></div>
          </>
        )}

        {/* Modal Header */}
        <div className={`p-4 sm:p-5 flex items-center justify-between ${
          isLight ? 'bg-slate-50 border-b border-slate-200' : 'bg-[#0d0d22] border-b border-cyber-border'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded overflow-hidden border flex items-center justify-center shrink-0 ${
              isLight ? 'border-indigo-200 bg-white' : 'border-cyber-neon bg-cyber-card animate-pulse-safe'
            }`}>
              <img
                src="https://images.unsplash.com/photo-1621761191319-c6fb62004040?q=80&w=120&auto=format&fit=crop"
                alt="Surchi Catalyst Logo"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="text-left">
              <span className={`text-[9px] font-mono tracking-widest uppercase font-black block ${
                isLight ? 'text-indigo-600' : 'text-cyber-neon'
              }`}>GLOBAL ALLIANCE PANEL</span>
              <h3 className={`text-sm sm:text-base font-black font-display uppercase tracking-tight ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>$SURCHI Ecosystem Partnerships</h3>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className={`p-1.5 rounded-lg cursor-pointer transition-all ${
              isLight 
                ? 'bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200' 
                : 'bg-cyber-card hover:bg-rose-950/40 text-slate-400 hover:text-red-400 border border-cyber-border'
            }`}
            title="Deactivate and close modal overlay"
          >
            <Icons.X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto">
          
          {/* Section 1: Strategic Partnerships */}
          <div className="space-y-4">
            <div className={`flex items-center gap-2 border-b pb-1.5 ${isLight ? 'border-slate-200' : 'border-cyber-border'}`}>
              <Icons.Award className={`w-4.5 h-4.5 ${isLight ? 'text-indigo-500' : 'text-cyber-neon'}`} />
              <h4 className={`text-xs font-bold font-display uppercase tracking-wider text-left ${isLight ? 'text-slate-700' : 'text-cyber-text'}`}>
                Strategic Partnerships & Core Integrations
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {currentPartners.map((item, idx) => (
                <a
                  key={idx}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-4 rounded-xl border transition-all group flex flex-col justify-between h-auto text-left relative no-underline cursor-pointer ${
                    isLight 
                      ? 'border-slate-150 hover:border-indigo-300 bg-slate-50/50 hover:bg-slate-50 shadow-sm' 
                      : 'border-cyber-border hover:border-cyber-cyan/50 bg-[#0d0d22]/45 hover:bg-[#12122e]/60 shadow-[0_4px_15px_rgba(0,0,0,0.25)]'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      {item.logo}
                      <span className="text-[8px] font-mono font-bold px-2 py-0.5 rounded uppercase border"
                            style={{ borderColor: `${item.iconTheme}40`, backgroundColor: `${item.iconTheme}10`, color: item.iconTheme }}>
                        {item.badge}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h5 className={`text-xs font-black font-display tracking-tight transition-colors select-text ${
                        isLight ? 'text-slate-900 group-hover:text-indigo-600' : 'text-white group-hover:text-cyber-neon'
                      }`}>
                        {item.name}
                      </h5>
                      <p className={`text-[10.5px] leading-relaxed font-sans select-text ${
                        isLight ? 'text-slate-600' : 'text-cyber-text-muted'
                      }`}>
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className={`pt-3.5 mt-2.5 border-t flex items-center justify-between text-[8px] font-mono font-bold ${
                    isLight ? 'border-slate-200 text-slate-400' : 'border-cyber-border/25 text-cyber-text-muted'
                  }`}>
                    <span className={isLight ? 'group-hover:text-slate-700 transition-colors' : 'group-hover:text-white transition-colors'}>DECENTRALIZED ACTIVE</span>
                    <Icons.ExternalLink className={`w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform ${isLight ? 'text-indigo-400' : ''}`} />
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Section 2: Future Partnerships Grid */}
          <div className="space-y-4">
            <div className={`flex items-center gap-2 border-b pb-1.5 ${isLight ? 'border-slate-200' : 'border-cyber-border'}`}>
              <Icons.FastForward className={`w-4.5 h-4.5 ${isLight ? 'text-slate-500' : 'text-cyber-cyan animate-pulse'}`} />
              <h4 className={`text-xs font-bold font-display uppercase tracking-wider text-left ${isLight ? 'text-slate-700' : 'text-cyber-text'}`}>
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
                    <span className={`text-11px font-bold font-mono transition-colors truncate ${
                      isLight ? 'text-slate-800 group-hover:text-indigo-600' : 'text-white group-hover:text-cyber-cyan'
                    }`}>
                      {item.name}
                    </span>
                  </div>
                  <p className={`text-[8px] leading-tight font-sans select-text line-clamp-2 ${
                    isLight ? 'text-slate-500 group-hover:text-slate-700' : 'text-slate-500 group-hover:text-slate-400'
                  }`}>
                    {item.note}
                  </p>
                </a>
              ))}
            </div>
          </div>

          {/* Section 3: Token Data Aggregators */}
          <div className="space-y-4">
            <div className={`flex items-center gap-2 border-b pb-1.5 ${isLight ? 'border-slate-200' : 'border-cyber-border'}`}>
              <Icons.Layers className={`w-4.5 h-4.5 ${isLight ? 'text-slate-500' : 'text-cyber-cyan animate-pulse-safe'}`} />
              <h4 className={`text-xs font-bold font-display uppercase tracking-wider text-left ${isLight ? 'text-slate-700' : 'text-cyber-text'}`}>
                Token Data Aggregators & Indexers
              </h4>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3">
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
                    <span className={`text-[11px] font-bold font-mono transition-colors block truncate ${
                      isLight ? 'text-slate-800 group-hover:text-indigo-600' : 'text-white group-hover:text-cyber-cyan'
                    }`}>
                      {item.name}
                    </span>
                    <p className={`text-[8.5px] leading-tight font-sans select-text line-clamp-1 truncate ${
                      isLight ? 'text-slate-500 group-hover:text-slate-700' : 'text-slate-400 group-hover:text-slate-300'
                    }`}>
                      {item.description}
                    </p>
                  </div>
                  <Icons.ExternalLink className={`w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ${isLight ? 'text-indigo-500' : 'text-cyber-cyan'}`} />
                </a>
              ))}
            </div>
          </div>

          {/* Section 4: Little Short note & things to know */}
          <div className={`p-4 rounded-xl flex items-start gap-3 text-left ${
            isLight 
              ? 'bg-amber-50/60 border border-amber-200 text-slate-705' 
              : 'bg-gradient-to-r from-[#03150d] via-[#050c18] to-[#04040a] border border-cyber-neon/20'
          }`}>
            <span className={`p-2 rounded shrink-0 ${
              isLight 
                ? 'bg-amber-100 border border-amber-200 text-amber-600' 
                : 'bg-cyber-neon/15 border border-cyber-neon/30 text-cyber-neon shrink-0 animate-pulse'
            }`}>
              <Icons.Info className="w-4 h-4" />
            </span>
            <div className="space-y-1">
              <strong className={`text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider block ${
                isLight ? 'text-amber-800' : 'text-[#00ff88]'
              }`}>
                IMPORTANT ADVISORY: FUTURE LIQUIDITY PIPELINE DETAILS
              </strong>
              <p className={`text-[10px] leading-relaxed font-sans max-w-3xl select-text ${
                isLight ? 'text-slate-600' : 'text-cyber-text-muted'
              }`}>
                Future launchpad alignment and exchange listings noted above represent prospective integration roadmap benchmarks. All pipeline proposals go through strict audit assessments, collateral guarantees, and direct community vote consensus before smart contract initialization. Users should verify accurate URL domains securely before engaging in liquidity provision actions.
              </p>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className={`p-4 flex items-center justify-between text-[10px] font-mono ${
          isLight ? 'bg-slate-50 border-t border-slate-200 text-slate-500' : 'bg-[#050510] border-t border-cyber-border text-slate-500'
        }`}>
          <span>SECURE CORE NETWORK SEC-801</span>
          <button 
            onClick={onClose}
            className={`px-4 py-2 rounded-lg cursor-pointer transition-all uppercase tracking-wider font-bold select-none text-[10px] ${
              isLight 
                ? 'bg-slate-200 hover:bg-slate-300 border border-slate-300 text-slate-700 hover:text-slate-900' 
                : 'bg-cyber-neon/10 hover:bg-cyber-neon/20 border border-cyber-neon/30 text-cyber-neon hover:text-white'
            }`}
          >
            Close Panel
          </button>
        </div>

      </div>
    </div>
  );
}
