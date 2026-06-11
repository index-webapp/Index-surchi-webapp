import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Newspaper, 
  Zap, 
  RefreshCw, 
  TrendingUp, 
  ExternalLink, 
  Flame, 
  TrendingDown, 
  Clock, 
  Sliders, 
  AlertCircle,
  HelpCircle,
  ChevronRight,
  ChevronLeft,
  Share2,
  Volume2,
  Play,
  Video,
  Image,
  Tv
} from 'lucide-react';

interface NewsPost {
  id: string;
  title: string;
  url: string;
  sourceName: string;
  publishedAt: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  imageUrl: string;
  summary: string;
  videoUrl?: string;
}

const CATEGORIES = [
  { id: 'breaking', label: '📰 Breaking' },
  { id: 'bitcoin', label: '₿ Bitcoin' },
  { id: 'solana', label: '◎ Solana' },
  { id: 'ethereum', label: 'Ξ Ethereum' },
  { id: 'meme_coins', label: '🐕 Meme Coins' },
  { id: 'ai_tokens', label: '🧬 AI Tokens' },
  { id: 'defi', label: '🌊 DeFi' }
];

const CURATED_NEWS_IMAGES_CLIENT = [
  "https://images.unsplash.com/photo-1621761191319-c6fb62004040?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1634973357973-f2ed255753e1?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1605792657660-596af9009e82?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1622630998477-20aa696ecb05?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1640340434855-6084b1f4901c?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1639762681057-40802193114c?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop"
];

const SIMULATED_TEMPLATES_CLIENT: Record<string, { title: string; sentiment: 'bullish' | 'bearish' | 'neutral'; sourceName: string; summary: string }[]> = {
  bitcoin: [
    {
      title: "Bitcoin Institutional OTC Inventories Drop to Record Lows as Spot Inflow Surges",
      sentiment: "bullish",
      sourceName: "Blockworks",
      summary: "Institutional demand is aggressively drying up available over-the-counter liquidity, signaling strong potential for an upward squeeze."
    },
    {
      title: "Macro Liquidation Event Flushes $310M Leveraged Longs as BTC Tests Key SMA Support",
      sentiment: "bearish",
      sourceName: "CoinDesk",
      summary: "Sustained derivatives positioning triggered a cascade of rapid liquidations, momentarily cooling down over-extended bullish momentum."
    },
    {
      title: "Bitcoin Mining Difficulty and Hashrate Reach Lifetime Peak; Clean Energy Mix Tops 65%",
      sentiment: "bullish",
      sourceName: "CoinTelegraph",
      summary: "The network's security fundamentals are stronger than ever, combined with substantial achievements in sustainable power integration."
    },
    {
      title: "Sovereign Wealth Funds Explore Direct Treasury Allocations Into Bitcoin Index Options",
      sentiment: "bullish",
      sourceName: "Decrypt",
      summary: "Strategic conversations hint at sovereign interest in utilizing scarce digital assets to hedge traditional currency imbalances."
    },
    {
      title: "Bitcoin Taproot Asset Transactions Accelerate, Creating Fee Pressure on Base Ledger",
      sentiment: "neutral",
      sourceName: "Bitcoin Magazine",
      summary: "Inscriptions and asset issuance on Bitcoin L1 are driving significant fee rewards for miners under rising block demand."
    }
  ],
  solana: [
    {
      title: "Firedancer Testnet Performance Validated: Sustaining 980K TPS Under High Stress Loads",
      sentiment: "bullish",
      sourceName: "Solana Intel",
      summary: "Phase-two stress validation of the independent validator client proves extreme scale viability, eliminating single-point-of-failure vulnerabilities."
    },
    {
      title: "Solana Aggregate DEX Volume Surpasses Combined Ethereum Layer-2 Networks and Sidechains",
      sentiment: "bullish",
      sourceName: "Blockworks",
      summary: "Retail liquidity and high-velocity token swaps continue to cluster natively on Solana, driving transaction fees and network efficiency."
    },
    {
      title: "Core Developers Merge Congestion Mitigation Standards into SOL Mainnet-Beta Client",
      sentiment: "bullish",
      summary: "Direct priority fee adjustments and localized fee markets are optimized to stabilize the ledger even during high meme-coin mint volumes.",
      sourceName: "Decrypt"
    },
    {
      title: "Solana DePIN Protocols Reallocate GPU Power Services, Disrupting Cloud Operators",
      sentiment: "bullish",
      summary: "Solana's fast ledger settles real-time compute hardware leases, expanding operational margins for decentralized computational grids.",
      sourceName: "CoinTelegraph"
    }
  ],
  ethereum: [
    {
      title: "Ethereum Blob Fee Caps Optimize Layer-2 Settlement Margins Ahead of Next Upgrade",
      sentiment: "bullish",
      summary: "Implementation of custom EIP gas benchmarks drastically reduces rollups' data publication overheads, bolstering EVM margin efficiency.",
      sourceName: "CoinDesk"
    },
    {
      title: "Secure State Bridges Achieve First Fully Zero-Knowledge Instant Rollup Sync",
      sentiment: "bullish",
      summary: "Direct cryptographic synchronity is achieved across clusters without delayed wait periods, solving fractional layer-2 liquidity issues.",
      sourceName: "L2BEAT"
    },
    {
      title: "Ethereum Validator Staking Count Surpasses 36M ETH; Yield Compounding Accelerates",
      sentiment: "bullish",
      summary: "More than 30% of total Ethereum supply is now actively locked in proof-of-stake hubs, drastically constricting market liquidity.",
      sourceName: "TokenTerminal"
    },
    {
      title: "Gas Consumption Metrics Fall to Historic Lows as L2 Rollup Efficiency Reaches 90%",
      sentiment: "neutral",
      summary: "L2 scaling success shifts the settlement demand away from Layer-1, causing nominal gas burns but maximizing consumer affordability.",
      sourceName: "Decrypt"
    }
  ],
  meme_coins: [
    {
      title: "Dynamic Token Bonding Multipliers Upgrade Automated Liquidity Curve Deployers",
      sentiment: "bullish",
      summary: "New algorithmic contract engines deter early snipe bots by scaling initial cost ratios, giving human retail launch participants a fairer edge.",
      sourceName: "DEX Screener"
    },
    {
      title: "Viral Cultural Sentiment Cohesion Drives Meme Valuations Above High-Cap VC Altcoins",
      sentiment: "neutral",
      summary: "Investors are dumping complex utility projects in favor of hyper-transparent, community-driven token primitives across all smart networks.",
      sourceName: "CoinGecko"
    },
    {
      title: "Meme-Centric Concentrated LP Pools Rebalance Dynamic Fees to Insulate Liquidity Providers",
      sentiment: "bullish",
      summary: "Liquidity routers now adjust fees programmatically up to 5% during insane slippage waves, protecting organic LP backing from toxic arbitrage.",
      sourceName: "Uniswap Labs"
    },
    {
      title: "Over-Leveraged Speculators Flushed in Sudden 20% Memecoin Corrective Downturn",
      sentiment: "bearish",
      summary: "Cascading liquidation triggers wiped millions of highly leveraged collateral positions across volatile dog and cat micro-assets.",
      sourceName: "CoinGlass"
    }
  ],
  ai_tokens: [
    {
      title: "Decentralized GPU Computing Infrastructure Protocol RENDER Announces Core API Expansion",
      sentiment: "bullish",
      summary: "The platform integrates direct containerized pipelines for AI engineers, creating stable institutional utility for active compute tokens.",
      sourceName: "AI Ledger"
    },
    {
      title: "AI Agent Autonomy Protocol Integrates Secure Zero-Knowledge Verification Node Network",
      sentiment: "bullish",
      summary: "AI systems can now independently secure Web3 resources and sign transactions with complete mathematical validation of clean actions.",
      sourceName: "CoinTelegraph"
    },
    {
      title: "Dynamic Resource Incentives Trigger Exploded Expansion of GPU Staking Node Pools",
      sentiment: "bullish",
      summary: "High-yield return margins motivate global server hubs to register spare units into peer-to-peer artificial intelligence clusters.",
      sourceName: "Blockworks"
    },
    {
      title: "Decentralized LLM Models Upgrade Edge nodes to Process Vector Databases on Decentralized Staking",
      sentiment: "neutral",
      summary: "Stakers provide local data indexes, earning fees for answering LLM queries without central datacenter tracking.",
      sourceName: "Decrypt"
    }
  ],
  defi: [
    {
      title: "Yield Aggregators Deploy Advanced AMM Loss-Versus-Rebalancing Safeguards",
      sentiment: "bullish",
      summary: "Next-gen algorithms insulate yield reserves by hedging pool exposure against rapid price moves, minimizing impermanent damage.",
      sourceName: "DefiLlama"
    },
    {
      title: "Multi-Ecosystem Lending Hub Protocol Introduces Instant Peer-to-Peer Loans",
      sentiment: "bullish",
      summary: "Borrowers can lock diverse assets as cross-chain guarantees, bypassing traditional single-chain capital constraints safely.",
      sourceName: "Uniswap Labs"
    },
    {
      title: "DAO-governed Decentralized Stablecoins Exceed $5B Circulating Backed Supply",
      sentiment: "bullish",
      summary: "Interest-rate models adapt automated fees to incentivize stability, securing peg accuracy under heavy stress environments.",
      sourceName: "Decentral Intel"
    },
    {
      title: "Concentrated Liquidity Router Integrates Zero-Knowledge Proofs for Dynamic Trading Privacy",
      sentiment: "neutral",
      summary: "New zero-knowledge integrations allow operators to execute block swaps without exposing raw transaction sizes to sandwich and MEV bots.",
      sourceName: "CryptoSlate"
    }
  ],
  breaking: [
    {
      title: "Supreme Multi-Agency Treasury Committee Finalizes Unified Crypto Operating License Rules",
      sentiment: "neutral",
      summary: "Global institutional hubs receive clear legal frameworks, allowing sovereign banks to house customer digital holdings directly.",
      sourceName: "Reuters Technology"
    },
    {
      title: "Major Venture Conglomerate Establishes $1.5 Billion Early-Stage Web3 Developer Grant Fund",
      sentiment: "bullish",
      summary: "Massive liquidity injection focuses on high-speed consumer applications, AI integration protocols, and gaming networks.",
      sourceName: "Forbes Crypto"
    },
    {
      title: "Security Firm Identifies Zero-Day Smart Contract Bridge Attack Vector; Exploits Prevented",
      sentiment: "bearish",
      summary: "A vulnerability was preemptively patched in leading multi-chain nodes, saving $850M from potential systemic drainage.",
      sourceName: "CyberAlerts"
    },
    {
      title: "Flash Leverage Crunch Triggers Complete Market Long Squeeze, Liquidating $480M",
      sentiment: "bearish",
      summary: "Macro interest rate speculation triggered a sudden re-pricing cascade, clearing leverage margins to establish a cleaner market floor.",
      sourceName: "Bloomberg Crypto"
    }
  ]
};

function getThemedFallbackImageClient(title: string, category: string = "") {
  let hash = 0;
  const str = title + category;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % CURATED_NEWS_IMAGES_CLIENT.length;
  return CURATED_NEWS_IMAGES_CLIENT[index];
}

function generateProceduralSummaryClient(title: string, sentiment: string): string {
  const lower = title.toLowerCase();
  if (lower.includes("bitcoin") || lower.includes("btc")) {
    return "Bitcoin's current market momentum continues to dictate index dynamics, with specialists evaluating technical boundaries.";
  }
  if (lower.includes("solana") || lower.includes("sol")) {
    return "Solana's network efficiency and high validator stakes support active trade depth across key decentralized liquidity pools.";
  }
  if (lower.includes("ethereum") || lower.includes("eth")) {
    return "Ethereum's Layer-2 settling activity continues to lock decentralized collateral under secure smart contracts.";
  }
  return `Market intelligence feeds scan ongoing developer activity and volume streams in real time. Sentiment is rated as ${sentiment}.`;
}

function generateClientSimulatedNews(category: string, search: string, page: number): NewsPost[] {
  const selectedCategory = category || "breaking";
  let templates: { title: string; sentiment: "bullish" | "bearish" | "neutral"; sourceName: string; summary: string }[] = [];

  if (selectedCategory === "breaking") {
    templates = [
      ...SIMULATED_TEMPLATES_CLIENT.breaking,
      ...SIMULATED_TEMPLATES_CLIENT.bitcoin,
      ...SIMULATED_TEMPLATES_CLIENT.solana,
      ...SIMULATED_TEMPLATES_CLIENT.ethereum,
    ];
  } else {
    templates = SIMULATED_TEMPLATES_CLIENT[selectedCategory] || SIMULATED_TEMPLATES_CLIENT.breaking;
  }

  const query = search.toLowerCase().trim();
  if (query) {
    templates = templates.filter(t => 
      t.title.toLowerCase().includes(query) || 
      t.summary.toLowerCase().includes(query) ||
      t.sourceName.toLowerCase().includes(query)
    );
  }

  const result: NewsPost[] = [];
  const baseMinutes = (page - 1) * 30;

  const itemsPerPage = 8;
  for (let i = 0; i < itemsPerPage; i++) {
    const templateIndex = (i + (page - 1) * itemsPerPage) % templates.length;
    const template = templates[templateIndex];
    if (!template) continue;

    const id = `client-sim-${selectedCategory}-${page}-${i}`;
    const minutesAgo = baseMinutes + i * 8 + (i % 3) * 5 + 2;
    const date = new Date(Date.now() - minutesAgo * 60 * 1000);

    let title = template.title;
    if (page > 1) {
      const prefixes = ["REGIONAL UPDATE:", "CORE BREAKOUT:", "ANALYST UPDATE:", "TECH BULLETIN:"];
      title = `${prefixes[i % prefixes.length]} ${title}`;
    }

    let videoUrl: string | undefined = undefined;
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes("otc") || lowerTitle.includes("institutional") || lowerTitle.includes("yield") || lowerTitle.includes("defi")) {
      videoUrl = "https://assets.mixkit.co/videos/preview/mixkit-financial-charts-and-graphs-on-a-monitor-42861-large.mp4";
    } else if (lowerTitle.includes("gpu") || lowerTitle.includes("render") || lowerTitle.includes("ai") || lowerTitle.includes("circuit") || lowerTitle.includes("depin")) {
      videoUrl = "https://assets.mixkit.co/videos/preview/mixkit-digital-circuit-board-with-glowing-signals-44280-large.mp4";
    } else if (lowerTitle.includes("security") || lowerTitle.includes("attack") || lowerTitle.includes("bridge") || lowerTitle.includes("validator")) {
      videoUrl = "https://assets.mixkit.co/videos/preview/mixkit-server-room-infrastructure-42631-large.mp4";
    } else if (lowerTitle.includes("congest") || lowerTitle.includes("developers") || lowerTitle.includes("merge") || lowerTitle.includes("client") || lowerTitle.includes("taproot")) {
      videoUrl = "https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-typing-on-a-computer-42037-large.mp4";
    }

    result.push({
      id,
      title,
      url: "https://cryptopanic.com",
      sourceName: template.sourceName,
      publishedAt: date.toISOString(),
      sentiment: template.sentiment,
      imageUrl: getThemedFallbackImageClient(title, selectedCategory),
      summary: template.summary || generateProceduralSummaryClient(title, template.sentiment),
      videoUrl
    });
  }

  return result;
}

export default function LiveCryptoNews({ themeMode }: { themeMode?: 'dark' | 'light' }) {
  const isLight = themeMode === 'light';
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [category, setCategory] = useState<string>('breaking');
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [isSimulated, setIsSimulated] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [expandedVideoId, setExpandedVideoId] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(30);
  const [carouselIndex, setCarouselIndex] = useState<number>(0);
  const [voiceActiveId, setVoiceActiveId] = useState<string | null>(null);

  // Search debounce ref
  const debounceTimer = useRef<any>(null);

  // Swipe / pull down refresh state simulations
  const [startY, setStartY] = useState<number>(0);
  const [isPulling, setIsPulling] = useState<boolean>(false);
  const [pullProgress, setPullProgress] = useState<number>(0);

  // Refs for infinite scroll (optional secondary)
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch News from Backend Proxy
  const fetchNews = async (catId: string, searchVal: string, pageNum: number, append = false) => {
    if (pageNum === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    setErrorMessage('');

    try {
      const url = `/api/crypto-news?category=${catId}&search=${encodeURIComponent(searchVal)}&page=${pageNum}`;
      const res = await fetch(url);
      const contentType = res.headers.get("content-type") || "";
      if (!res.ok || !contentType.includes("application/json")) {
        throw new Error(`Proxy interface offline or non-JSON (html/routing) returned`);
      }
      const data = await res.json();
      if (data.success && Array.isArray(data.posts)) {
        if (append) {
          setPosts(prev => {
            const combined = [...prev, ...data.posts];
            // Filter duplicates by unique ID
            return combined.filter((val, idx, self) => self.findIndex(t => t.id === val.id) === idx);
          });
        } else {
          setPosts(data.posts);
        }
        setIsSimulated(!!data.isSimulated);
      } else {
        throw new Error("Invalid posts schema received from the secure proxy");
      }
    } catch (err: any) {
      console.warn(`SURCHI NEWS: Secure proxy offline or static environment detected (${err.message || err}). Initializing client-side high-fidelity simulation stream.`);
      
      const simPosts = generateClientSimulatedNews(catId, searchVal, pageNum);
      if (append) {
        setPosts(prev => {
          const combined = [...prev, ...simPosts];
          return combined.filter((val, idx, self) => self.findIndex(t => t.id === val.id) === idx);
        });
      } else {
        setPosts(simPosts);
      }
      setIsSimulated(true);
      // Clear error message since we recovered perfectly with client-side simulation
      setErrorMessage('');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Poll for live news updates every 30 seconds
  useEffect(() => {
    fetchNews(category, search, 1, false);
    setPage(1);
    setCountdown(30);
  }, [category, search]);

  // Handle countdown interval
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          // Trigger automatic silent update
          fetchNews(category, search, 1, false);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [category, search]);

  // Carousel auto rotate interval (6 seconds)
  useEffect(() => {
    const count = posts.filter(p => p.sentiment === 'bullish' || p.sentiment === 'neutral').slice(0, 4).length;
    if (count === 0) return;
    const interval = setInterval(() => {
      setCarouselIndex(prev => (prev + 1) % count);
    }, 6000);
    return () => clearInterval(interval);
  }, [posts]);

  // Handle Manual Refresh click
  const handleManualRefresh = () => {
    setCountdown(30);
    fetchNews(category, search, 1, false);
    setPage(1);
  };

  // Handle Load More
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNews(category, search, nextPage, true);
  };

  // Search Input Handler (Debounced to protect rate limits)
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    
    debounceTimer.current = setTimeout(() => {
      // Input state is bound, triggering category reload
      setPage(1);
    }, 500);
  };

  // Touch handlers for mobile swipe-to-refresh
  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      setStartY(e.touches[0].clientY);
      setIsPulling(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPulling) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY;
    if (diff > 0) {
      // Only drag down
      const progress = Math.min(diff / 150, 1.0); // full at 150px drag
      setPullProgress(progress);
    }
  };

  const handleTouchEnd = () => {
    if (!isPulling) return;
    setIsPulling(false);
    if (pullProgress >= 0.8) {
      handleManualRefresh();
    }
    setPullProgress(0);
  };

  // Text-To-Speech (Voice reading) Feature
  const handleVoiceRead = (post: NewsPost) => {
    if ('speechSynthesis' in window) {
      if (voiceActiveId === post.id) {
        window.speechSynthesis.cancel();
        setVoiceActiveId(null);
        return;
      }
      window.speechSynthesis.cancel(); // Stop playing anything else
      
      const utterance = new SpeechSynthesisUtterance(`${post.title}. Analysis summary: ${post.summary}`);
      utterance.onend = () => {
        setVoiceActiveId(null);
      };
      utterance.onerror = () => {
        setVoiceActiveId(null);
      };
      setVoiceActiveId(post.id);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech option not fully supported in this browser version.");
    }
  };

  // Calculate Time Ago helper
  const formatTimeAgo = (isoString: string) => {
    const now = new Date("2026-05-22T23:20:46Z"); // Base anchor time
    const past = new Date(isoString);
    const msDiff = now.getTime() - past.getTime();
    const mins = Math.floor(msDiff / 60000);
    const hours = Math.floor(mins / 60);

    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return past.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  // Helper styles for sentiments
  const getSentimentStyles = (sent: string) => {
    if (sent === 'bullish') return { text: 'text-[#00ff88]', bg: 'bg-[#00ff881a]', border: 'border-[#00ff8833]', label: '🟢 BULLISH IMPACT' };
    if (sent === 'bearish') return { text: 'text-[#ff4b82]', bg: 'bg-[#ff4b821a]', border: 'border-[#ff4b8233]', label: '🔴 BEARISH IMPACT' };
    return { text: 'text-[#00e5ff]', bg: 'bg-[#00e5ff1a]', border: 'border-[#00e5ff33]', label: '🔵 NEUTRAL SIGNAL' };
  };

  // Top trending carousel subset from current posts
  const trendingPosts = posts.filter(p => p.sentiment === 'bullish' || p.sentiment === 'neutral').slice(0, 4);

  return (
    <div 
      id="live-crypto-news-module"
      className="w-full max-w-7xl mx-auto mt-4 font-sans transition-all select-none space-y-3 animate-fade-in"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Inline styles container for continuous marquee loop */}
      <style>{`
        @keyframes ticker-marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker-marquee {
          display: inline-flex;
          animation: ticker-marquee 32s linear infinite;
        }
        .animate-ticker-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
 
      {/* Touch refresh pull-bar simulator indicator */}
      {pullProgress > 0 && (
        <div 
          className="flex items-center justify-center p-1.5 text-cyber-cyan text-xs font-mono transition-transform"
          style={{ transform: `scale(${pullProgress})` }}
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-1.5 text-cyber-cyan ${pullProgress >= 0.8 ? 'animate-spin' : ''}`} />
          <span className="text-[10px]">{pullProgress >= 0.8 ? 'Release with confidence...' : 'Pull down to refresh'}</span>
        </div>
      )}
 
      {/* SLIM MINIMIZED BANNER HEADER */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 border rounded-lg shadow-sm ${
        isLight ? 'bg-white border-slate-200' : 'bg-[#070817] border-[#00e5ff33] shadow-[0_0_15px_rgba(0,229,255,0.04)]'
      }`}>
        {/* News logo and live info */}
        <div className="flex items-center gap-2 text-left">
          <div className="p-1 px-1.5 bg-gradient-to-br from-cyber-cyan to-cyber-purple text-[#050510] rounded text-xs select-none">
            <Newspaper className="w-3.5 h-3.5" />
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-1.5 w-1.5 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isLight ? 'bg-emerald-650 bg-emerald-500' : 'bg-[#00ff88]'}`}></span>
              <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${isLight ? 'bg-emerald-600' : 'bg-[#00ff88]'}`}></span>
            </span>
            <h2 className={`font-display font-black text-xs sm:text-sm uppercase tracking-wider ${isLight ? 'text-slate-800' : 'text-white'}`}>
              NEWS FEED ORACLE
            </h2>
            <span className="text-[8px] font-mono text-slate-500 uppercase hidden md:inline">
              &bull; Secure Tunnel Syncing
            </span>
          </div>
        </div>
 
        {/* Live Refresh Counter & Network Switch */}
        <div className="flex items-center justify-between sm:justify-end gap-2 text-[9px] font-mono">
          <div className={`flex items-center gap-1.5 px-2 py-0.5 border rounded ${
            isLight ? 'bg-slate-50 border-slate-200 text-slate-600 font-medium' : 'bg-[#0b0b1e] border-cyber-border text-slate-300'
          }`}>
            <span className="text-slate-500">CYCLE:</span>
            <span className="text-cyber-cyan font-bold">{countdown}s</span>
          </div>
          <button
            onClick={handleManualRefresh}
            disabled={loading}
            className={`px-2.5 py-1 rounded cursor-pointer transition-all flex items-center gap-1.5 font-bold border ${
              isLight 
                ? 'bg-indigo-50 hover:bg-slate-50 text-indigo-700 border-indigo-200 hover:border-indigo-400' 
                : 'bg-[#10102b] hover:bg-[#7c3aed33] text-cyber-cyan border-[#00e5ff4d] hover:border-[#00e5ff80]'
            }`}
          >
            <RefreshCw className={`w-3 h-3 text-cyber-cyan ${loading ? 'animate-spin' : ''}`} />
            <span>SYNC NOW</span>
          </button>
        </div>
      </div>
 
      {/* CONTINUOUS BREAKING NEWS TICKER */}
      {posts.length > 0 && (
        <div className={`py-1.5 px-3 rounded-lg flex items-center gap-2.5 overflow-hidden text-[10px] select-none border ${
          isLight ? 'bg-rose-50 border-rose-100 text-rose-800' : 'bg-[#0b0509] border-[#f43f5e26] text-rose-300'
        }`}>
          <span className={`shrink-0 flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider animate-pulse font-mono font-black ${
            isLight ? 'bg-rose-600 text-white' : 'bg-[#ff4b82] text-[#050510]'
          }`}>
            <Flame className="w-3 h-3 scale-90" />
            LIVE TICKER
          </span>
          <div className="relative flex-1 overflow-hidden h-3.5">
            <div className={`animate-ticker-marquee flex gap-10 text-[10px] font-mono ${isLight ? 'text-rose-700' : 'text-rose-300'}`}>
              <div className="flex gap-10 whitespace-nowrap">
                {posts.map(p => (
                  <span key={p.id} className="cursor-pointer hover:underline" onClick={() => window.open(p.url, '_blank')}>
                    &bull; {p.title.toUpperCase()} — {p.sourceName.toUpperCase()}
                  </span>
                ))}
              </div>
              <div className="flex gap-10 whitespace-nowrap">
                {posts.map(p => (
                  <span key={`${p.id}-dup`} className="cursor-pointer hover:underline" onClick={() => window.open(p.url, '_blank')}>
                    &bull; {p.title.toUpperCase()} — {p.sourceName.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
 
      {/* FILTER CONTROL PANEL */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2">
        {/* Navigation Category Select tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none max-w-full">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setCategory(cat.id);
                setPage(1);
              }}
              className={`px-2.5 py-1 text-[10px] font-mono font-bold uppercase border rounded cursor-pointer transition-all select-none shrink-0 ${
                category === cat.id
                  ? (isLight
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm font-semibold'
                      : 'bg-cyber-purple border-cyber-purple text-white shadow-[0_0_8px_rgba(124,58,237,0.25)]')
                  : (isLight
                      ? 'bg-white border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-350'
                      : 'bg-[#050511] border-cyber-border text-slate-400 hover:text-white hover:border-[#00e5ff4d]')
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
 
        {/* Keyword Search Input */}
        <div className={`relative w-full md:max-w-[200px] shrink-0 rounded border transition-all ${
          isLight ? 'bg-white border-slate-300 focus-within:border-indigo-500' : 'bg-[#03030b] border-cyber-border focus-within:border-[#00e5ff73]'
        }`}>
          <span className="absolute left-2.5 top-1.5 text-slate-500">
            <Search className="w-3.5 h-3.5" />
          </span>
          <input 
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search feed keywords..."
            className={`w-full bg-transparent pl-8 pr-3 py-1 text-[10px] font-mono focus:outline-none block ${
              isLight ? 'text-slate-805 text-slate-800 placeholder:text-slate-400' : 'text-white placeholder:text-slate-600'
            }`}
          />
          {search && (
            <button 
              onClick={() => { setSearch(''); setPage(1); }} 
              className="absolute right-2 top-0.5 text-slate-500 hover:text-white text-[11px]"
            >
              &times;
            </button>
          )}
        </div>
      </div>
 
      {/* COMPACT FEED LIST */}
      <div className="space-y-1.5">
        {/* Loading Matrix indicator state */}
        {loading && (
          <div className="space-y-1.5">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div 
                key={idx} 
                className="bg-[#0b0c2280] border border-cyber-border rounded-lg p-3 animate-pulse flex items-center justify-between h-14"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="h-2.5 w-1/4 bg-[#161730] rounded"></div>
                  <div className="h-3 w-3/4 bg-[#161730] rounded"></div>
                </div>
                <div className="h-3.5 w-10 bg-[#161730] rounded"></div>
              </div>
            ))}
          </div>
        )}
 
        {/* Failed fetch matrix fallbacks alert */}
        {!loading && errorMessage && posts.length === 0 && (
          <div className="p-4 bg-rose-950/15 border border-rose-500/20 rounded-lg text-center space-y-2 max-w-md mx-auto">
            <AlertCircle className="w-5 h-5 text-[#ff4b82] mx-auto" />
            <h4 className="text-xs font-bold uppercase text-white font-mono">DEX News Grid Offline</h4>
            <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
              Encountered direct network latency syncing the latest node updates.
            </p>
            <button 
              onClick={handleManualRefresh}
              className="px-3 py-1 bg-[#ff4b82]/10 border border-[#ff4b82]/30 text-[#ff4b82] hover:bg-[#ff4b82]/20 rounded text-[9px] font-mono transition-colors"
            >
              RETREAD COGNITIVE TUNNEL
            </button>
          </div>
        )}
 
        {/* Empty Search / Empty news results */}
        {!loading && posts.length === 0 && !errorMessage && (
          <div className="p-6 text-center bg-[#04040a] border border-cyber-border/40 rounded-lg space-y-2 max-w-sm mx-auto flex flex-col items-center justify-center">
            <HelpCircle className="w-6 h-6 text-slate-600 animate-pulse" />
            <div className="space-y-1 text-center">
              <h4 className="text-xs font-black text-white font-mono uppercase">Unresolved News Coordinates</h4>
              <p className="text-[10px] text-slate-500 font-sans leading-relaxed">
                No active matching articles found in category or search results.
              </p>
            </div>
          </div>
        )}
 
        {/* Compact list rows representing active news posts */}
        {!loading && posts.length > 0 && (
          <div className="space-y-3">
            {posts.map((post) => {
              const semStyle = getSentimentStyles(post.sentiment);
              const hasVideo = !!post.videoUrl;
              const isVideoExpanded = expandedVideoId === post.id;

              return (
                <article 
                  key={post.id}
                  className="bg-[#050512]/92 border border-cyber-cyan/15 hover:border-cyber-cyan/50 hover:bg-[#07071d]/98 rounded-lg p-3 sm:p-4 flex flex-col transition-all text-left group"
                >
                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    {/* Media Thumbnail Block */}
                    <div className="w-full sm:w-36 md:w-44 shrink-0">
                      <div 
                        onClick={() => {
                          if (hasVideo) {
                            setExpandedVideoId(isVideoExpanded ? null : post.id);
                          } else {
                            window.open(post.url, '_blank');
                          }
                        }}
                        className={`aspect-video sm:aspect-auto sm:h-24 w-full rounded-lg overflow-hidden relative bg-[#04040a] border ${hasVideo ? 'border-[#00ff88]/30 hover:border-[#00ff88]/60 cursor-pointer' : 'border-cyber-cyan/10 hover:border-cyber-cyan/30 cursor-pointer'} transition-all`}
                      >
                        <img 
                          src={post.imageUrl} 
                          alt={post.title} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                        />
                        
                        {/* Sentiment Badge Overlay */}
                        <div className="absolute top-1.5 left-1.5 z-10 scale-90 origin-top-left">
                          <span className={`px-1.5 py-0.5 rounded text-[7px] font-mono font-bold uppercase tracking-wider ${semStyle.text} ${semStyle.bg} backdrop-blur-md border ${semStyle.border}`}>
                            {post.sentiment.toUpperCase()}
                          </span>
                        </div>

                        {/* Video / Photo Overlay indicator */}
                        {hasVideo ? (
                          <div className="absolute inset-0 bg-black/40 hover:bg-black/25 flex items-center justify-center transition-all">
                            <div className="p-2 rounded-full bg-[#000000]/80 border border-[#00ff88]/40 shadow-[0_0_12px_rgba(0,255,136,0.25)] flex items-center justify-center">
                              <Play className="w-3.5 h-3.5 text-[#00ff88] fill-[#00ff88]" />
                            </div>
                            <span className="absolute bottom-1 bg-black/70 text-[7.5px] font-black font-mono tracking-widest text-[#00ff88] px-1 py-0.25 rounded uppercase">
                              VIDEO FEED
                            </span>
                          </div>
                        ) : (
                          <div className="absolute bottom-1 right-1.5 bg-black/60 px-1 rounded text-slate-400 flex items-center gap-0.5 text-[7px] font-mono">
                            <Image className="w-2 h-2 text-slate-400" />
                            <span>IMAGE</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Content Detail Segment */}
                    <div className="flex-1 space-y-1.5 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 text-[8.5px] font-mono text-slate-500">
                        <span className="font-extrabold text-cyber-cyan tracking-wider">{post.sourceName.toUpperCase()}</span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-0.5 font-semibold text-slate-400">
                          <Clock className="w-2.5 h-2.5 text-slate-500 shrink-0" />
                          {formatTimeAgo(post.publishedAt)}
                        </span>
                        {hasVideo && (
                          <>
                            <span>&bull;</span>
                            <span className="text-[#00ff88] font-bold flex items-center gap-0.5">
                              <Tv className="w-2.5 h-2.5" /> VIDEO ANALYSIS
                            </span>
                          </>
                        )}
                      </div>
   
                      <h3 
                        onClick={() => window.open(post.url, '_blank')}
                        className="text-white hover:text-cyber-cyan text-xs sm:text-sm font-bold leading-snug cursor-pointer select-text transition-colors block text-left"
                      >
                        {post.title}
                      </h3>
                      
                      <p className="text-[10px] sm:text-[11px] text-slate-400 font-sans leading-relaxed select-text italic text-left line-clamp-3">
                        {post.summary}
                      </p>

                      {/* Video status and quick watch trigger buttons */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        {hasVideo && (
                          <button
                            type="button"
                            onClick={() => setExpandedVideoId(isVideoExpanded ? null : post.id)}
                            className={`px-2 py-1 rounded text-[8.5px] font-bold font-mono transition-all flex items-center gap-1 cursor-pointer ${
                              isVideoExpanded 
                                ? 'bg-[#ff4b82]/10 border border-[#ff4b82]/30 text-[#ff4b82]' 
                                : 'bg-[#00ff88]/10 hover:bg-[#00ff88]/20 border border-[#00ff88]/30 hover:border-[#00ff88]/50 text-[#00ff88]'
                            }`}
                          >
                            <Video className="w-2.5 h-2.5 shrink-0" />
                            <span>{isVideoExpanded ? 'HIDE ANALYSIS FEED' : 'WATCH ANALYSIS LOOP'}</span>
                          </button>
                        )}

                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-black uppercase text-slate-400 bg-cyber-bg/40 border border-cyber-border/30`}>
                          {semStyle.label}
                        </span>
                      </div>
                    </div>

                    {/* Compact Action Panel (Voice and Source Link) */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start w-full sm:w-auto gap-2 pt-2 sm:pt-0 shrink-0 border-t border-cyber-border/20 sm:border-t-0">
                      <div className="text-[8.5px] font-mono text-slate-500 sm:text-right">
                        <span>POST ID:</span> <span className="text-slate-400 font-bold">{post.id.split('-').pop()}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleVoiceRead(post)}
                          className={`p-1.5 rounded ${voiceActiveId === post.id ? 'bg-[#ff4b82] text-[#050510]' : 'bg-[#0f0f22] text-slate-400 hover:text-white border border-cyber-border'} transition-all`}
                          title="Read news details aloud"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                        
                        <a
                          href={post.url}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1.5 bg-[#0b0c1e] hover:bg-cyber-cyan/10 border border-cyber-cyan/25 hover:border-cyber-cyan rounded flex items-center gap-1 text-[8.5px] font-mono font-bold text-cyber-cyan hover:text-white transition-all no-underline"
                        >
                          <span>OPEN SOURCE</span>
                          <ExternalLink className="w-3 h-3 text-cyber-cyan shrink-0" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Inline Expanded Video Section */}
                  {isVideoExpanded && post.videoUrl && (
                    <div className="mt-4 p-1.5 bg-[#030308] border border-[#00ff88]/30 rounded-lg overflow-hidden animate-fade-in relative shadow-[0_0_15px_rgba(0,255,136,0.06)]">
                      <div className="absolute top-3 right-3 z-10 flex gap-1.5">
                        <span className="px-2 py-0.5 bg-[#00ff88]/20 border border-[#00ff88]/40 text-[#00ff88] text-[7.5px] font-mono font-extrabold rounded uppercase tracking-wider animate-pulse flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88]"></span> Secured Stream Link
                        </span>
                        <button 
                          onClick={() => setExpandedVideoId(null)}
                          className="px-2 py-0.5 bg-black/60 hover:bg-black/90 text-white hover:text-rose-500 font-mono text-[8px] font-bold rounded border border-white/10 uppercase cursor-pointer"
                        >
                          CLOSE
                        </button>
                      </div>
                      <video 
                        src={post.videoUrl} 
                        autoPlay 
                        loop 
                        muted 
                        playsInline 
                        controls
                        className="w-full h-[180px] sm:h-[300px] md:h-[360px] object-cover rounded"
                      />
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
 
        {/* Load More Trigger */}
        {!loading && posts.length > 0 && (
          <div className="pt-2 text-center select-none">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="px-5 py-1.5 bg-[#070715] hover:bg-[#0c0c26] border border-cyber-cyan/20 hover:border-cyber-cyan shadow-sm text-cyber-cyan hover:text-white rounded text-[10px] font-bold font-mono tracking-wider cursor-pointer transition-all disabled:opacity-50 inline-flex items-center gap-1.5 uppercase"
            >
              {loadingMore ? (
                <>
                  <RefreshCw className="w-3 h-3 text-cyber-cyan animate-spin" />
                  <span>SYNCING...</span>
                </>
              ) : (
                <>
                  <span>LOAD NEXT SECURE DATASETS</span>
                  <ChevronRight className="w-3 h-3 text-cyber-cyan" />
                </>
              )}
            </button>
          </div>
        )}
 
      </div>

    </div>
  );
}
