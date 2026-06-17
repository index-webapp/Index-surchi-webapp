import { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { formatAbbreviatedPrice } from '../utils/priceFormatter';

interface TokenMetrics {
  priceUsd: number;
  marketCap: number;
  volume24h: number;
  priceChange24h: number;
  isListed: boolean;
  pairAddress: string;
  chainId: string;
  dexId: string;
  liquidityUsd?: number;
}

interface SurchiTokenMetricsProps {
  onPriceClick?: () => void;
  onWhatIsSurchiClick?: () => void;
  onMetricsFetched?: (metrics: TokenMetrics) => void;
  themeMode?: 'dark' | 'light';
  hideSocials?: boolean;
}

export function SurchiTokenMetrics({ onPriceClick, onWhatIsSurchiClick, onMetricsFetched, themeMode, hideSocials = false }: SurchiTokenMetricsProps = {}) {
  const [metrics, setMetrics] = useState<TokenMetrics>({
    priceUsd: 0,
    marketCap: 0,
    volume24h: 0,
    priceChange24h: 0,
    isListed: false,
    pairAddress: '',
    chainId: '',
    dexId: '',
    liquidityUsd: 0,
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchSurchiMetrics = async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      // Search DexScreener for SURCHI tokens via cached backend proxy, fallback to direct public endpoint on static hosting
      let response;
      let data;
      try {
        response = await fetch('/api/proxy/dexscreener/search?q=SURCHI');
        const contentType = response?.headers.get("content-type") || "";
        if (!response.ok || !contentType.includes("application/json")) {
          throw new Error('Not a valid json response (proxy offline/redirected)');
        }
        data = await response.json();
      } catch (err) {
        console.info('SurchiTokenMetrics backend proxy offline, falling back directly to public DexScreener API:', err);
        try {
          response = await fetch('https://api.dexscreener.com/latest/dex/search?q=SURCHI');
          const contentType = response?.headers.get("content-type") || "";
          if (response.ok && contentType.includes("application/json")) {
            data = await response.json();
          } else {
            throw new Error('Direct query returned non-JSON response or error status');
          }
        } catch (innerErr) {
          console.warn("Direct public DexScreener fetch failed entirely:", innerErr);
        }
      }

      if (data && data.pairs && data.pairs.length > 0) {
        const surchiPairs = data.pairs.filter((p: any) => {
          return p.baseToken?.symbol?.toUpperCase() === 'SURCHI';
        });

        if (surchiPairs.length > 0) {
          surchiPairs.sort((a: any, b: any) => {
            const liqA = a.liquidity?.usd || 0;
            const liqB = b.liquidity?.usd || 0;
            return liqB - liqA;
          });

          const bestPair = surchiPairs[0];

          const loadedMetrics: TokenMetrics = {
            priceUsd: parseFloat(bestPair.priceUsd || '0'),
            marketCap: bestPair.marketCap || 0,
            volume24h: bestPair.volume?.h24 || 0,
            priceChange24h: bestPair.priceChange?.h24 || 0,
            isListed: true,
            pairAddress: bestPair.pairAddress || '',
            chainId: bestPair.chainId || 'solana',
            dexId: bestPair.dexId || 'raydium',
            liquidityUsd: bestPair.liquidity?.usd || 0,
          };

          setMetrics(loadedMetrics);
          if (onMetricsFetched) {
            onMetricsFetched(loadedMetrics);
          }
        } else {
          // No active valid pairs matching SURCHI found - fallback to beautiful baseline metrics
          const baselineMetrics: TokenMetrics = {
            priceUsd: 0,
            marketCap: 0,
            volume24h: 0,
            priceChange24h: 0,
            isListed: false,
            pairAddress: "9u9surchi_ecosystem_token_placeholder",
            chainId: "solana",
            dexId: "raydium",
            liquidityUsd: 0,
          };
          setMetrics(baselineMetrics);
          if (onMetricsFetched) {
            onMetricsFetched(baselineMetrics);
          }
        }
      } else {
        const baselineMetrics: TokenMetrics = {
          priceUsd: 0,
          marketCap: 0,
          volume24h: 0,
          priceChange24h: 0,
          isListed: false,
          pairAddress: "9u9surchi_ecosystem_token_placeholder",
          chainId: "solana",
          dexId: "raydium",
          liquidityUsd: 0,
        };
        setMetrics(baselineMetrics);
        if (onMetricsFetched) {
          onMetricsFetched(baselineMetrics);
        }
      }
    } catch (error) {
      console.warn('Handling $SURCHI metrics baseline integration gracefully:', error);
      const baselineMetrics: TokenMetrics = {
        priceUsd: 0,
        marketCap: 0,
        volume24h: 0,
        priceChange24h: 0,
        isListed: false,
        pairAddress: "9u9surchi_ecosystem_token_placeholder",
        chainId: "solana",
        dexId: "raydium",
        liquidityUsd: 0,
      };
      setMetrics(baselineMetrics);
      if (onMetricsFetched) {
        onMetricsFetched(baselineMetrics);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLastUpdated(new Date());
    }
  };

  useEffect(() => {
    fetchSurchiMetrics();
    const interval = setInterval(() => {
      fetchSurchiMetrics();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => {
    if (price === 0) return '$0.000';
    return `$${formatAbbreviatedPrice(price)}`;
  };

  const formatLargeNum = (num: number) => {
    if (num === 0) return '$0.000';
    if (num >= 1000000000) return `$${(num / 1000000000).toFixed(3)}B`;
    if (num >= 1000000) return `$${(num / 1000000).toFixed(3)}M`;
    return `$${num.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}`;
  };

  return (
    <div 
      onClick={onPriceClick}
      className={`w-full mx-auto rounded-[15px] border select-none transition-all duration-300 relative group overflow-hidden ${
        onPriceClick ? 'cursor-pointer hover:shadow-lg hover:scale-[1.002] active:scale-[0.998]' : ''
      } ${
        themeMode === 'light'
          ? 'bg-white border-slate-100 shadow-[0_6px_22px_rgba(0,0,0,0.012)]'
          : 'bg-[#06070d] border-[#8b5cf6]/10 shadow-[0_6px_22px_rgba(139,92,246,0.012)]'
      }`}
    >
      <div className="absolute top-2.5 right-2 text-slate-400 md:hidden">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            if (onPriceClick) onPriceClick();
          }}
          className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
            themeMode === 'light'
              ? 'bg-slate-50 border-slate-100 text-slate-400 hover:text-slate-600 hover:bg-slate-100'
              : 'bg-purple-500/5 border-purple-500/10 text-slate-400 hover:text-white hover:bg-purple-500/15'
          }`}
          title="Open Ecosystem Terminal"
        >
          <Icons.MoreVertical className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* MOBILE SCROLL VIEW (<768px) */}
      <div className="md:hidden p-3 sm:p-3.5 space-y-3 sm:space-y-3.5">
        
        {/* HEADER BLOCK - Responsive side-by-side with safety margin for action buttons */}
        <div className="flex items-center justify-between gap-3 px-0 lg:px-2">
          
          {/* Real Surchi Logo & Identity info */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-purple-500/20 shadow-[0_3px_8px_rgba(139,92,246,0.2)] shrink-0 bg-black">
              <img
                src="https://raw.githubusercontent.com/surchiai/surchiai.github.io/refs/heads/main/SURCHI%20logo.jpg"
                alt="SURCHI Logo"
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <div className="flex flex-col text-left justify-center min-w-0">
              <div className="flex items-center gap-1">
                <h3 className={`text-xs sm:text-sm md:text-base lg:text-lg font-black tracking-tight leading-none uppercase truncate ${
                  themeMode === 'light' ? 'text-slate-900' : 'text-white'
                }`}>
                  SURCHI COIN
                </h3>
                <Icons.CheckCircle2 className="w-3.5 h-3.5 sm:w-4 text-[#8b5cf6] shrink-0" />
              </div>
              <p className="text-[10px] sm:text-xs md:text-sm font-mono font-bold text-slate-400 leading-none mt-1">
                $SURCHI
              </p>
            </div>
          </div>

          {/* Price status right: compact column format, secure from 3-dots collision with minimum 40px padding */}
          <div className="flex flex-col items-start text-left gap-0.5 shrink-0 pr-8 lg:pr-10 relative animate-fade-in">
            <span className="text-[10px] sm:text-xs lg:text-sm font-bold text-slate-400 uppercase tracking-widest leading-none">
              Price
            </span>
            <div className={`text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-black tracking-tight font-sans leading-none ${
              themeMode === 'light' ? 'text-slate-900' : 'text-white'
            }`}>
              {metrics.isListed && metrics.priceUsd > 0 ? formatPrice(metrics.priceUsd) : '$0.000'}
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/15 text-[8.5px] sm:text-[10px] font-extrabold tracking-wider text-[#8b5cf6] dark:text-purple-400 uppercase leading-none mt-1">
              PRE-LAUNCH
            </span>
          </div>
        </div>

        {/* METRICS THREE-COL GRID - Perfectly distributed and scaled without stacking or wrapping */}
        <div className={`p-2 sm:p-2.5 rounded-xl border ${
          themeMode === 'light'
            ? 'bg-slate-50/40 border-slate-100 text-slate-800'
            : 'bg-[#030408] border-[#8b5cf6]/5 text-white'
        }`}>
          <div className="grid grid-cols-3 gap-0.5 sm:gap-1 divide-x divide-slate-100/40 dark:divide-purple-500/10">
            
            {/* Market Cap */}
            <div className="flex flex-col items-center justify-center text-center px-0.5 sm:px-1 py-0.5">
              <span className="text-[8px] min-[360px]:text-[8.5px] sm:text-[9.5px] font-bold text-slate-400 tracking-wider uppercase leading-none">
                Mkt Cap
              </span>
              <strong className={`text-[10px] min-[360px]:text-[11px] sm:text-xs md:text-sm font-black font-sans mt-1 leading-none tracking-tight ${
                themeMode === 'light' ? 'text-slate-900' : 'text-white'
              }`}>
                {metrics.isListed && metrics.marketCap > 0 ? formatLargeNum(metrics.marketCap) : '$0.000'}
              </strong>
            </div>
            
            {/* 24H Volume */}
            <div className="flex flex-col items-center justify-center text-center px-0.5 sm:px-1 py-0.5">
              <span className="text-[8px] min-[360px]:text-[8.5px] sm:text-[9.5px] font-bold text-slate-400 tracking-wider uppercase leading-none">
                24H Vol
              </span>
              <strong className={`text-[10px] min-[360px]:text-[11px] sm:text-xs md:text-sm font-black font-sans mt-1 leading-none tracking-tight ${
                themeMode === 'light' ? 'text-slate-900' : 'text-white'
              }`}>
                {metrics.isListed && metrics.volume24h > 0 ? formatLargeNum(metrics.volume24h) : '$0.000'}
              </strong>
            </div>
 
            {/* Liquidity */}
            <div className="flex flex-col items-center justify-center text-center px-0.5 sm:px-1 py-0.5">
              <span className="text-[8px] min-[360px]:text-[8.5px] sm:text-[9.5px] font-bold text-slate-400 tracking-wider uppercase leading-none">
                Liquidity
              </span>
              <strong className={`text-[10px] min-[360px]:text-[11px] sm:text-xs md:text-sm font-black font-sans mt-1 leading-none tracking-tight ${
                themeMode === 'light' ? 'text-slate-900' : 'text-white'
              }`}>
                {metrics.isListed && metrics.liquidityUsd && metrics.liquidityUsd > 0 ? formatLargeNum(metrics.liquidityUsd) : '$0.000'}
              </strong>
            </div>
          </div>
        </div>

        {/* CHART GRID GRAPHICS SECTION - Streamlined fluid background curve and badge */}
        <div className={`rounded-xl border p-2 relative h-14 flex flex-col justify-center items-center overflow-hidden ${
          themeMode === 'light'
            ? 'bg-[#fafafc] border-slate-100'
            : 'bg-[#020306] border-[#8b5cf6]/5'
        }`}>
          {/* Subtle Grid overlay lines */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
            <div className="w-full h-full grid grid-cols-8 grid-rows-4">
              {Array.from({ length: 32 }).map((_, i) => (
                <div key={i} className="border-t border-l border-slate-400"></div>
              ))}
            </div>
          </div>

          {/* Dotted curves in violet - fully fluid responsive */}
          <div className="absolute inset-x-0 bottom-0 top-4 select-none opacity-80 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="photoWaveGradCompactMobile" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M0,70 C15,60 25,75 40,78 C55,80 70,45 85,52 C92,54 96,30 100,32 L100,100 L0,100 Z"
                fill="url(#photoWaveGradCompactMobile)"
              />
              <path
                d="M0,70 C15,60 25,75 40,78 C55,80 70,45 85,52 C92,54 96,30 100,32"
                fill="none"
                stroke="#a855f7"
                strokeWidth="1.2"
                strokeDasharray="3 2"
                strokeLinecap="round"
                className="opacity-60"
              />
              <circle cx="100" cy="32" r="2" fill="#a855f7" />
              <circle cx="100" cy="32" r="4" fill="#a855f7" fillOpacity="0.2" className="animate-ping" />
            </svg>
          </div>

          {/* Text block & badge overlay */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-0.5">
            <div className="p-0.5 rounded-full bg-purple-500/10 border border-purple-500/10 flex items-center justify-center">
              <Icons.TrendingUp className="w-3 h-3 text-purple-500" />
            </div>
            <span className="text-[9px] sm:text-[10px] font-extrabold tracking-wide text-purple-600 dark:text-purple-400 block font-sans">
              Awaiting Exchange Listing
            </span>
          </div>
        </div>

        {/* BOTTOM FOOTER STATUS & SOCIALS */}
        <div className="flex items-center justify-between gap-1.5 pt-2 border-t border-slate-100/30 dark:border-purple-500/10">
          
          {/* Calendar status left - tiny & compact */}
          <div className="flex items-center gap-1 min-w-0">
            <Icons.Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-purple-500 shrink-0" />
            <span className="text-[10px] min-[360px]:text-[11px] sm:text-[12px] font-bold text-slate-400 truncate text-left">
              Launch: <span className="text-purple-500 font-extrabold">TBA</span>
            </span>
          </div>

          {/* Right side consisting of socials and WHAT IS SURCHI inline button */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {!hideSocials && (
              <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-0.5">
                  {/* Website */}
                  <a 
                    href="https://www.surchi.xyz" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-4 h-4 rounded-full bg-purple-500/10 hover:bg-[#8B5CF6] text-purple-500 hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm"
                    title="Website Directory"
                  >
                    <Icons.Globe className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
                  </a>

                  {/* Twitter */}
                  <a 
                    href="https://x.com/surchicoin" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-4 h-4 rounded-full bg-purple-500/10 hover:bg-[#8B5CF6] text-purple-500 hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm"
                    title="Twitter Profile"
                  >
                    <Icons.Twitter className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
                  </a>

                  {/* Instagram */}
                  <a 
                    href="https://www.instagram.com/surchiai?igsh=YXlhY2VkZ2lxam9w" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-4 h-4 rounded-full bg-purple-500/10 hover:bg-[#8B5CF6] text-purple-500 hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm"
                    title="Instagram Channel"
                  >
                    <Icons.Instagram className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
                  </a>

                  {/* Discord */}
                  <a 
                    href="https://discord.gg/YANGvFfvax" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-4 h-4 rounded-full bg-purple-500/10 hover:bg-[#8B5CF6] text-purple-500 hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm"
                    title="Discord Server"
                  >
                    <Icons.MessageSquare className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
                  </a>

                  {/* Github */}
                  <a 
                    href="https://github.com/surchiai" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-4 h-4 rounded-full bg-purple-500/10 hover:bg-[#8B5CF6] text-purple-500 hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm"
                    title="Github Repository"
                  >
                    <Icons.Github className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
                  </a>
                </div>
              </div>
            )}

            {onWhatIsSurchiClick && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onWhatIsSurchiClick();
                }}
                style={{ padding: '6px 14px', fontSize: '11px' }}
                className={`flex items-center justify-center gap-1.5 rounded-lg font-mono font-black tracking-widest uppercase hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer select-none border shadow-sm shrink-0 leading-none ${
                  themeMode === 'light'
                    ? 'bg-purple-500/5 hover:bg-purple-500/10 text-purple-700 border-purple-500/15'
                    : 'text-[#c084fc] hover:text-[#d8b4fe] bg-[#8B5CF6]/10 hover:bg-[#8B5CF6]/15 border border-[#8b5cf6]/20 shadow-[0_2px_8px_rgba(139,92,246,0.1)] hover:shadow-[0_2px_12px_rgba(139,92,246,0.18)]'
                }`}
              >
                <Icons.Cpu className="w-3.5 h-3.5 shrink-0 animate-pulse text-[#8b5cf6]" />
                <span>WHAT IS SURCHI?</span>
                <Icons.ChevronRight className="w-3.5 h-3.5 shrink-0 text-[#8b5cf6]" />
              </button>
            )}
          </div>

        </div>

      </div>

      {/* DESKTOP INTEGRATED HORIZONTAL VIEW (≥768px) */}
      <div className="hidden md:flex md:flex-col p-4.5 space-y-4">
        
        {/* ROW 1: Logo/Identity, Stats, and Chart */}
        <div className="flex items-center justify-between gap-5">
          
          {/* Left Block: Surchi Identity & PRE-LAUNCH Badge */}
          <div className="flex items-center gap-3.5 shrink-0">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-purple-500/20 shadow-[0_3px_8px_rgba(139,92,246,0.2)] shrink-0 bg-black">
              <img
                src="https://raw.githubusercontent.com/surchiai/surchiai.github.io/refs/heads/main/SURCHI%20logo.jpg"
                alt="SURCHI Logo"
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <div className="flex flex-col text-left justify-center">
              <div className="flex items-center gap-1.5">
                <h3 className={`text-base font-black tracking-tight leading-none uppercase ${
                  themeMode === 'light' ? 'text-slate-900' : 'text-white'
                }`}>
                  SURCHI COIN
                </h3>
                <Icons.CheckCircle2 className="w-4 h-4 text-[#8b5cf6] shrink-0" />
              </div>
              <div className="flex items-center gap-2 mt-1.5">
                <p className="text-xs font-mono font-bold text-slate-400 leading-none">
                  $SURCHI
                </p>
                <span className="inline-flex items-center px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/15 text-[9px] font-extrabold tracking-wider text-[#8b5cf6] dark:text-purple-400 uppercase leading-none">
                  PRE-LAUNCH
                </span>
              </div>
            </div>
          </div>

          {/* Center Block: All inline statistics with dividers */}
          <div className={`flex items-center gap-6 px-4 py-2.5 rounded-xl border divide-x divide-slate-150 dark:divide-purple-500/10 grow justify-around ${
            themeMode === 'light'
              ? 'bg-slate-50/45 border-slate-100 text-slate-800'
              : 'bg-[#030408] border-[#8b5cf6]/5 text-white'
          }`}>
            {/* Price */}
            <div className="flex flex-col items-center justify-center text-center px-3 grow">
              <span className="text-[9.5px] lg:text-[10px] font-bold text-slate-400 tracking-wider uppercase leading-none">
                Price
              </span>
              <strong className={`text-xs lg:text-sm font-black font-sans mt-1 leading-none tracking-tight ${
                themeMode === 'light' ? 'text-slate-900' : 'text-white'
              }`}>
                {metrics.isListed && metrics.priceUsd > 0 ? formatPrice(metrics.priceUsd) : '$0.000'}
              </strong>
            </div>

            {/* Market Cap */}
            <div className="flex flex-col items-center justify-center text-center px-3 grow">
              <span className="text-[9.5px] lg:text-[10px] font-bold text-slate-400 tracking-wider uppercase leading-none">
                Mkt Cap
              </span>
              <strong className={`text-xs lg:text-sm font-black font-sans mt-1 leading-none tracking-tight ${
                themeMode === 'light' ? 'text-slate-900' : 'text-white'
              }`}>
                {metrics.isListed && metrics.marketCap > 0 ? formatLargeNum(metrics.marketCap) : '$0.000'}
              </strong>
            </div>
            
            {/* 24H Volume */}
            <div className="flex flex-col items-center justify-center text-center px-3 grow">
              <span className="text-[9.5px] lg:text-[10px] font-bold text-slate-400 tracking-wider uppercase leading-none">
                24H Vol
              </span>
              <strong className={`text-xs lg:text-sm font-black font-sans mt-1 leading-none tracking-tight ${
                themeMode === 'light' ? 'text-slate-900' : 'text-white'
              }`}>
                {metrics.isListed && metrics.volume24h > 0 ? formatLargeNum(metrics.volume24h) : '$0.000'}
              </strong>
            </div>

            {/* Liquidity */}
            <div className="flex flex-col items-center justify-center text-center px-3 grow">
              <span className="text-[9.5px] lg:text-[10px] font-bold text-slate-400 tracking-wider uppercase leading-none">
                Liquidity
              </span>
              <strong className={`text-xs lg:text-sm font-black font-sans mt-1 leading-none tracking-tight ${
                themeMode === 'light' ? 'text-slate-900' : 'text-white'
              }`}>
                {metrics.isListed && metrics.liquidityUsd && metrics.liquidityUsd > 0 ? formatLargeNum(metrics.liquidityUsd) : '$0.000'}
              </strong>
            </div>
          </div>

          {/* Right Block: Chart Area + Three-dot Menu */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Chart Area */}
            <div className={`rounded-xl border p-2 relative h-12 w-44 flex flex-col justify-center items-center overflow-hidden ${
              themeMode === 'light'
                ? 'bg-[#fafafc] border-slate-100'
                : 'bg-[#020306] border-[#8b5cf6]/5'
            }`}>
              {/* Grid overlay */}
              <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
                <div className="w-full h-full grid grid-cols-6 grid-rows-2">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="border-t border-l border-slate-400"></div>
                  ))}
                </div>
              </div>

              {/* SVG Curve */}
              <div className="absolute inset-x-0 bottom-0 top-3 select-none opacity-80 pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="photoWaveGradCompactDesktop" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.08" />
                      <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,70 C15,60 25,75 40,78 C55,80 70,45 85,52 C92,54 96,30 100,32 L100,100 L0,100 Z"
                    fill="url(#photoWaveGradCompactDesktop)"
                  />
                  <path
                    d="M0,70 C15,60 25,75 40,78 C55,80 70,45 85,52 C92,54 96,30 100,32"
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth="1.2"
                    strokeDasharray="3 2"
                    strokeLinecap="round"
                    className="opacity-60"
                  />
                  <circle cx="100" cy="32" r="2" fill="#a855f7" />
                </svg>
              </div>

              {/* Text Badge overlay */}
              <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-0.5">
                <div className="p-0.5 rounded-full bg-purple-500/10 border border-purple-500/10 flex items-center justify-center">
                  <Icons.TrendingUp className="w-2.5 h-2.5 text-purple-500" />
                </div>
                <span className="text-[9px] font-extrabold tracking-wide text-purple-600 dark:text-purple-400 block font-sans leading-none">
                  Awaiting Exchange Listing
                </span>
              </div>
            </div>

            {/* Menu Indicator Button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                if (onPriceClick) onPriceClick();
              }}
              className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all shrink-0 ${
                themeMode === 'light'
                  ? 'bg-slate-50 border-slate-100 text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                  : 'bg-purple-500/5 border-purple-500/10 text-slate-400 hover:text-white hover:bg-purple-500/15'
              }`}
              title="Open Ecosystem Terminal"
            >
              <Icons.MoreVertical className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* ROW 2: Bottom Row: Launch indicator and inline button */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100/30 dark:border-purple-500/10">
          {/* Left: Launch: TBA */}
          <div className="flex items-center gap-1.5">
            <Icons.Calendar className="w-3.5 h-3.5 text-purple-500 shrink-0" />
            <span className="text-xs font-bold text-slate-400">
              Launch: <span className="text-purple-500 font-extrabold">TBA</span>
            </span>
          </div>

          {/* Right: What is Surchi? Button & Social Icons */}
          <div className="flex items-center gap-2">
            {!hideSocials && (
              <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-0.5">
                  <a href="https://www.surchi.xyz" target="_blank" rel="noopener noreferrer" className="w-4.5 h-4.5 rounded-full bg-purple-500/10 hover:bg-[#8B5CF6] text-purple-500 hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm">
                    <Icons.Globe className="w-2.5 h-2.5" />
                  </a>
                  <a href="https://x.com/surchicoin" target="_blank" rel="noopener noreferrer" className="w-4.5 h-4.5 rounded-full bg-purple-500/10 hover:bg-[#8B5CF6] text-purple-500 hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm">
                    <Icons.Twitter className="w-2.5 h-2.5" />
                  </a>
                  <a href="https://www.instagram.com/surchiai?igsh=YXlhY2VkZ2lxam9w" target="_blank" rel="noopener noreferrer" className="w-4.5 h-4.5 rounded-full bg-purple-500/10 hover:bg-[#8B5CF6] text-purple-500 hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm">
                    <Icons.Instagram className="w-2.5 h-2.5" />
                  </a>
                  <a href="https://discord.gg/YANGvFfvax" target="_blank" rel="noopener noreferrer" className="w-4.5 h-4.5 rounded-full bg-purple-500/10 hover:bg-[#8B5CF6] text-purple-500 hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm">
                    <Icons.MessageSquare className="w-2.5 h-2.5" />
                  </a>
                  <a href="https://github.com/surchiai" target="_blank" rel="noopener noreferrer" className="w-4.5 h-4.5 rounded-full bg-purple-500/10 hover:bg-[#8B5CF6] text-purple-500 hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm">
                    <Icons.Github className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            )}

            {onWhatIsSurchiClick && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onWhatIsSurchiClick();
                }}
                style={{ padding: '6px 14px', fontSize: '11px' }}
                className={`flex items-center justify-center gap-1.5 rounded-lg font-mono font-black tracking-widest uppercase hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer select-none border shadow-sm shrink-0 leading-none ${
                  themeMode === 'light'
                    ? 'bg-purple-500/5 hover:bg-purple-500/10 text-purple-700 border-purple-500/15 shadow-purple-50/50'
                    : 'text-[#c084fc] hover:text-[#d8b4fe] bg-[#8B5CF6]/10 hover:bg-[#8B5CF6]/15 border border-[#8b5cf6]/20 shadow-[0_2px_8px_rgba(139,92,246,0.1)] hover:shadow-[0_2px_12px_rgba(139,92,246,0.18)]'
                }`}
              >
                <Icons.Cpu className="w-3.5 h-3.5 shrink-0 animate-pulse text-[#8b5cf6]" />
                <span>WHAT IS SURCHI?</span>
                <Icons.ChevronRight className="w-3.5 h-3.5 shrink-0 text-[#8b5cf6]" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
