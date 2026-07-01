import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ComposedChart, Bar, Cell, ReferenceLine, Label } from 'recharts';

interface Comment {
  id: string;
  avatar: string;
  username: string;
  text: string;
  timestamp: string;
  coinId?: string;
  coin?: string;
}

interface PredictionCoin {
  id: string;
  symbol: string;
  name: string;
  logo: string;
  price: number;
  change: number;
  bullishVotes: number;
  bearishVotes: number;
  comments: Comment[];
  sparkline: { value: number }[];
  chartData: { time: string; price: number }[];
}

interface PredictionsDashboardProps {
  onClose: () => void;
  themeMode?: 'dark' | 'light';
}

export default function PredictionsDashboard({ onClose, themeMode = 'dark' }: PredictionsDashboardProps) {
  const [coins, setCoins] = useState<PredictionCoin[]>([]);
  const [candleCache, setCandleCache] = useState<Record<string, any[]>>({});
  const [secondsTicker, setSecondsTicker] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCoinId, setSelectedCoinId] = useState<string | null>(null);

  useEffect(() => {
    const t = setInterval(() => {
      setSecondsTicker(prev => prev + 1);
    }, 1000);
    return () => clearInterval(t);
  }, []);

  // Comment input states
  const [newCommentText, setNewCommentText] = useState('');
  const [username, setUsername] = useState(() => {
    return localStorage.getItem('surchi_username') || `SurchiTrader_${Math.floor(1000 + Math.random() * 9000)}`;
  });
  const [isEditingUsername, setIsEditingUsername] = useState(false);

  // Staking & rewards custom state variables
  const [userBalance, setUserBalance] = useState<number>(100000.0);
  const [userHistory, setUserHistory] = useState<any[]>([]);
  const [stakeAmount, setStakeAmount] = useState<string>('500');
  const [stakeError, setStakeError] = useState<string | null>(null);
  const [isStaking, setIsStaking] = useState(false);
  const [isSettling, setIsSettling] = useState<string | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<any | null>(null);

  // Local vote memory to prevent multiple rapid vote clicks
  const [hasVoted, setHasVoted] = useState<Record<string, 'bullish' | 'bearish'>>(() => {
    try {
      const stored = localStorage.getItem('surchi_user_votes');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const [fallbackMode, setFallbackMode] = useState(false);

  // Fallback prediction coins generator
  const getFallbackCoins = (): PredictionCoin[] => {
    const coinsConfig = [
      { id: 'surchi', symbol: 'SURCHIUSDT', name: 'SURCHI', logo: 'https://raw.githubusercontent.com/surchiai/surchiai.github.io/refs/heads/main/SURCHI%20logo.jpg', defaultPrice: 0.0452, defaultChange: 4.8 },
      { id: 'bitcoin', symbol: 'BTCUSDT', name: 'Bitcoin', logo: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png', defaultPrice: 65120.0, defaultChange: 1.2 },
      { id: 'ethereum', symbol: 'ETHUSDT', name: 'Ethereum', logo: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png', defaultPrice: 3450.5, defaultChange: -0.8 },
      { id: 'binancecoin', symbol: 'BNBUSDT', name: 'BNB', logo: 'https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png', defaultPrice: 585.2, defaultChange: 2.1 },
      { id: 'solana', symbol: 'SOLUSDT', name: 'Solana', logo: 'https://assets.coingecko.com/coins/images/4128/large/solana.png', defaultPrice: 148.75, defaultChange: -3.4 },
      { id: 'tether-gold', symbol: 'XAUTUSDT', name: 'XAUT', logo: 'https://assets.coingecko.com/coins/images/10481/large/tether-gold.png', defaultPrice: 2342.1, defaultChange: 0.15 }
    ];

    return coinsConfig.map(coin => {
      const sparkline: { value: number }[] = [];
      const chartData: { time: string; price: number }[] = [];
      
      let basePrice = coin.defaultPrice / (1 + (coin.defaultChange / 100));
      const priceDelta = coin.defaultPrice - basePrice;
      
      for (let i = 0; i < 12; i++) {
        const progress = i / 11;
        const wave = Math.sin(i * 1.8) * 0.4 + Math.cos(i * 1.1) * 0.2;
        const stepPrice = basePrice + (priceDelta * progress) + (basePrice * (coin.defaultChange / 100) * 0.1 * wave);
        sparkline.push({ value: parseFloat(stepPrice.toFixed(coin.defaultPrice > 1000 ? 2 : 5)) });
      }

      for (let i = 0; i <= 24; i++) {
        const progress = i / 24;
        const wave = Math.sin(i * 1.5) * 0.5 + Math.cos(i * 0.8) * 0.25;
        const stepPrice = basePrice + (priceDelta * progress) + (basePrice * (coin.defaultChange / 100) * 0.15 * wave);
        const d = new Date(Date.now() - (24 - i) * 3600000);
        const label = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        chartData.push({ time: label, price: parseFloat(stepPrice.toFixed(coin.defaultPrice > 1000 ? 2 : 5)) });
      }

      return {
        id: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        logo: coin.logo,
        price: coin.defaultPrice,
        change: coin.defaultChange,
        bullishVotes: 1024,
        bearishVotes: 980,
        comments: [
          {
            id: `fallback-c-1-${coin.id}`,
            avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=cryptoking`,
            username: "CryptoForensicPro",
            text: `Analyzing ${coin.name} structural supports. Looks extremely poised for a break here.`,
            timestamp: new Date(Date.now() - 3600000).toISOString()
          }
        ],
        sparkline,
        chartData
      };
    });
  };

  // Load predictions on mount
  const fetchPredictions = async () => {
    try {
      const res = await fetch('/api/predictions');
      if (!res.ok) {
        let bodyText = '';
        try {
          bodyText = await res.text();
        } catch (_) {}
        const truncatedBody = bodyText ? bodyText.slice(0, 200) : 'No body';
        throw new Error(`Server returned status ${res.status} (${res.statusText}): ${truncatedBody}`);
      }
      const data = await res.json();
      if (data.success && Array.isArray(data.predictions) && data.predictions.length > 0) {
        setCoins(data.predictions);
        setFallbackMode(false);
        setError(null);

        // Update candleCache state
        setCandleCache(prev => {
          const next = { ...prev };
          data.predictions.forEach((coin: any) => {
            const coinId = coin.id;
            const existingCandles = next[coinId];
            if (!existingCandles || existingCandles.length === 0) {
              // Generate initial candles
              next[coinId] = generateCandlesForCoin(coin.price, coin.change, coin.id);
            } else if (coin.price !== null && coin.change !== null) {
              // Update the very last candle in-place
              const updatedCandles = [...existingCandles];
              const lastIndex = updatedCandles.length - 1;
              if (lastIndex >= 0) {
                const lastCandle = { ...updatedCandles[lastIndex] };
                const prevCandle = lastIndex > 0 ? updatedCandles[lastIndex - 1] : null;
                
                const openVal = prevCandle ? prevCandle.close : lastCandle.open;
                const closeVal = coin.price;
                
                let highVal = Math.max(lastCandle.high, openVal, closeVal);
                let lowVal = Math.min(lastCandle.low, openVal, closeVal);
                if (lowVal <= 0) lowVal = Math.min(openVal, closeVal) * 0.99;

                lastCandle.open = openVal;
                lastCandle.close = closeVal;
                lastCandle.price = closeVal;
                lastCandle.high = highVal;
                lastCandle.low = lowVal;
                lastCandle.body = [Math.min(openVal, closeVal), Math.max(openVal, closeVal)];
                lastCandle.wick = [lowVal, highVal];
                
                updatedCandles[lastIndex] = lastCandle;
              }
              next[coinId] = updatedCandles;
            }
          });
          return next;
        });

      } else {
        throw new Error(data.error || 'Invalid API data payload format');
      }
    } catch (err: any) {
      console.warn("[PredictionsDashboard] fetchPredictions failed, activating live backup sync:", err);
      const fallbackData = getFallbackCoins();
      setCoins(fallbackData);
      setFallbackMode(true);
      setError(null); // Clear blocking error state to allow fallback simulation rendering

      // Update candleCache state with fallback values
      setCandleCache(prev => {
        const next = { ...prev };
        fallbackData.forEach((coin: any) => {
          const coinId = coin.id;
          const existingCandles = next[coinId];
          if (!existingCandles || existingCandles.length === 0) {
            next[coinId] = generateCandlesForCoin(coin.price, coin.change, coin.id);
          }
        });
        return next;
      });
    } finally {
      setLoading(false);
    }
  };

  // Synchronize user profile (persistent $SURCHI balances and round logs)
  const fetchUserProfile = async () => {
    if (!username) return;
    try {
      const res = await fetch(`/api/predictions/user?username=${encodeURIComponent(username)}`);
      const data = await res.json();
      if (data.success && data.user) {
        setUserBalance(data.user.balance);
        setUserHistory(data.user.history || []);
      }
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
    }
  };

  useEffect(() => {
    fetchPredictions();
    fetchUserProfile();
    // Poll every 3 seconds to keep live price indices, comments, and profile synchronized
    const interval = setInterval(() => {
      fetchPredictions();
      fetchUserProfile();
    }, 3000);
    return () => clearInterval(interval);
  }, [username]);

  // Save votes to localStorage
  const recordVoteInLocal = (coinId: string, type: 'bullish' | 'bearish') => {
    const nextVotes = { ...hasVoted, [coinId]: type };
    setHasVoted(nextVotes);
    localStorage.setItem('surchi_user_votes', JSON.stringify(nextVotes));
  };

  // Claim Faucet Tokens
  const handleFaucetClaim = async () => {
    try {
      const res = await fetch('/api/predictions/faucet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUserBalance(data.user.balance);
        setUserHistory(data.user.history || []);
      }
    } catch (err) {
      console.error('Faucet request failed:', err);
    }
  };

  // Stake transaction handler
  const handleStake = async (coinId: string, voteType: 'bullish' | 'bearish', customAmount?: number) => {
    const finalAmount = customAmount !== undefined ? customAmount : parseFloat(stakeAmount);
    if (isNaN(finalAmount) || finalAmount <= 0) {
      setStakeError("Please enter a valid $SURCHI stake amount.");
      return;
    }
    if (finalAmount > 5000) {
      setStakeError("Maximum stake is 5,000 $SURCHI.");
      return;
    }
    if (finalAmount > userBalance) {
      setStakeError("Stake amount exceeds your available $SURCHI balance.");
      return;
    }

    setStakeError(null);
    setIsStaking(true);

    try {
      const currentCoin = coins.find(c => c.id === coinId);
      const entryPrice = currentCoin ? currentCoin.price : 1.0;

      const res = await fetch('/api/predictions/stake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          coinId,
          voteType,
          stakeAmount: finalAmount,
          entryPrice
        })
      });
      const data = await res.json();
      if (data.success) {
        setUserBalance(data.user.balance);
        setUserHistory(data.user.history || []);
        recordVoteInLocal(coinId, voteType);
        fetchPredictions();
      } else {
        setStakeError(data.error || "Staking transaction rejected.");
      }
    } catch (err) {
      console.error(err);
      setStakeError("Staking connection failed.");
    } finally {
      setIsStaking(false);
    }
  };

  // Quick Vote handler from listing cards (Quick-stake 500 SURCHI or remaining balance)
  const handleVote = async (coinId: string, voteType: 'bullish' | 'bearish') => {
    if (hasVoted[coinId]) return;
    const autoAmount = Math.min(500, userBalance > 0 ? userBalance : 100);
    await handleStake(coinId, voteType, autoAmount);
  };

  // Prediction settlement round processor
  const handleSettlePrediction = async (predictionId: string, coinId: string) => {
    const targetCoin = coins.find(c => c.id === coinId);
    if (!targetCoin) return;

    setIsSettling(predictionId);
    try {
      const res = await fetch('/api/predictions/settle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          predictionId,
          currentPrice: targetCoin.price
        })
      });
      const data = await res.json();
      if (data.success) {
        setUserBalance(data.user.balance);
        setUserHistory(data.user.history || []);
        
        // Remove from local vote limiter to allow forecasting on this coin again!
        const nextVotes = { ...hasVoted };
        delete nextVotes[coinId];
        setHasVoted(nextVotes);
        localStorage.setItem('surchi_user_votes', JSON.stringify(nextVotes));
        fetchPredictions();
      }
    } catch (err) {
      console.error("Failed to settle prediction round:", err);
    } finally {
      setIsSettling(null);
    }
  };

  // Post Comment handler
  const handlePostComment = async (coinId: string) => {
    if (!newCommentText.trim() || !username.trim()) return;

    try {
      // Save username preference
      localStorage.setItem('surchi_username', username);

      const res = await fetch('/api/predictions/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coinId,
          username,
          text: newCommentText.trim(),
          avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${username}`
        })
      });
      const data = await res.json();
      if (data.success) {
        setNewCommentText('');
        // Refresh comments list
        fetchPredictions();
      }
    } catch (err) {
      console.error('Comment post failed:', err);
    }
  };

  const selectedCoin = coins.find(c => c.id === selectedCoinId);

  // Participant details mapping for visual overlap row
  const getParticipantAvatars = (coinId: string) => {
    const seeds = ['Aiden', 'Nora', 'Leo', 'Felix', 'Zoe', 'Oliver', 'Mia', 'Lucas', 'Luna', 'Maya'];
    // pick 3 seeds based on length/character values
    const hash = coinId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return [
      `https://api.dicebear.com/7.x/pixel-art/svg?seed=${seeds[hash % seeds.length]}`,
      `https://api.dicebear.com/7.x/pixel-art/svg?seed=${seeds[(hash + 1) % seeds.length]}`,
      `https://api.dicebear.com/7.x/pixel-art/svg?seed=${seeds[(hash + 2) % seeds.length]}`,
    ];
  };

  const formatPrice = (p: number) => {
    if (p < 0.001) return `$${p.toFixed(6)}`;
    if (p < 1) return `$${p.toFixed(4)}`;
    return `$${p.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const generateCandlesForCoin = (price: number, change: number, coinId: string) => {
    const pointsCount = 30;
    const seed = coinId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const points: any[] = [];
    
    // Overall price change multiplier
    const initialPrice = price / (1 + change / 100);
    let currentPrice = initialPrice;
    const drift = (change / 100) / pointsCount;
    const volatility = Math.max(0.005, Math.abs(change / 100) * 0.15);

    const now = new Date();
    
    for (let i = 0; i < pointsCount; i++) {
      const d = new Date(now.getTime() - (pointsCount - 1 - i) * 30 * 60 * 1000); // 30 min intervals
      const hh = String(d.getHours()).padStart(2, '0');
      const mm = String(d.getMinutes()).padStart(2, '0');
      const label = `${hh}:${mm}`;

      const noiseSeed = seed + i * 17.3;
      const rnd = Math.sin(noiseSeed) * 0.6 + Math.cos(noiseSeed * 2.3) * 0.4;
      
      const stepReturn = drift + rnd * volatility;
      const openVal = currentPrice;
      let closeVal = i === pointsCount - 1 ? price : currentPrice * (1 + stepReturn);
      if (closeVal <= 0.000001) closeVal = openVal * 0.95;

      const maxOC = Math.max(openVal, closeVal);
      const minOC = Math.min(openVal, closeVal);
      
      const highMult = 1 + Math.abs(Math.sin(noiseSeed * 5.4)) * volatility * 0.5;
      const lowMult = 1 - Math.abs(Math.cos(noiseSeed * 6.2)) * volatility * 0.5;
      
      let highVal = maxOC * highMult;
      let lowVal = Math.max(0.000001, minOC * lowMult);

      // Make sure high and low contain open/close
      highVal = Math.max(highVal, openVal, closeVal);
      lowVal = Math.min(lowVal, openVal, closeVal);

      points.push({
        label,
        price: closeVal,
        open: openVal,
        high: highVal,
        low: lowVal,
        close: closeVal,
        body: [Math.min(openVal, closeVal), Math.max(openVal, closeVal)],
        wick: [lowVal, highVal]
      });

      currentPrice = closeVal;
    }

    return points;
  };

  return (
    <div id="predictions_feature_container" className="min-h-screen bg-black text-[#ffffff] font-sans">
      {/* Background ambient aesthetic light source */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-cyber-cyan/5 rounded-full filter blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-cyber-neon/5 rounded-full filter blur-[120px] pointer-events-none"></div>

      {/* Header section */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-zinc-800 pb-6">
          <div className="space-y-1.5 text-left">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-zinc-900 border border-cyber-cyan/30 text-cyber-cyan text-[10px] font-mono font-bold uppercase tracking-widest shadow-[0_0_8px_rgba(0,229,255,0.05)]">
                <Icons.Compass className="w-3.5 h-3.5 text-cyber-cyan animate-spin" style={{ animationDuration: '6s' }} /> Surchi Oracle Engine
              </div>
              {fallbackMode && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-zinc-950 border border-amber-500/40 text-amber-400 text-[10px] font-mono font-bold uppercase tracking-widest animate-pulse">
                  <Icons.AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Smart Offline Backup Sync Active
                </div>
              )}
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight font-display flex items-center gap-3">
              <Icons.TrendingUp className="w-7 h-7 text-cyber-cyan" />
              Ecosystem Predictions Portal
            </h2>
            <p className="text-zinc-400 text-xs leading-relaxed max-w-xl font-mono">
              Participate in live 24-hour prediction rounds for the world's leading consensus assets. Vote on market sentiment and join the active Web3 discourse.
            </p>
          </div>
          <button
            id="back_to_workspace_btn"
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-lg text-zinc-350 hover:text-white text-xs font-bold font-mono transition-all cursor-pointer select-none uppercase w-fit"
          >
            &larr; Back to Workspace
          </button>
        </div>

        {loading ? (
          <div className="py-24 text-center space-y-4 font-mono">
            <Icons.Loader2 className="w-10 h-10 mx-auto text-cyber-cyan animate-spin" />
            <p className="text-sm text-zinc-500 animate-pulse">Establishing synchronization loop with nodes...</p>
          </div>
        ) : error ? (
          <div className="py-16 text-center space-y-4 max-w-md mx-auto">
            <div className="p-3 bg-red-950/25 border border-red-900/40 rounded-xl">
              <Icons.AlertOctagon className="w-8 h-8 text-rose-500 mx-auto mb-2" />
              <p className="text-xs text-rose-300 font-mono">{error}</p>
            </div>
            <button
              onClick={() => { setLoading(true); fetchPredictions(); }}
              className="px-4 py-1.5 text-xs bg-zinc-900 border border-zinc-800 rounded font-mono font-bold hover:bg-zinc-800 text-white"
            >
              Retry Connection
            </button>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {!selectedCoinId ? (
              /* =======================================================
                 COIN LISTING SCREEN (Grid list of cards)
                 ======================================================= */
              <motion.div
                key="list"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {coins.map((coin) => {
                  const totalVotes = coin.bullishVotes + coin.bearishVotes;
                  const isUp = coin.change >= 0;
                  const votedFor = hasVoted[coin.id];
                  const userAvatarUrls = getParticipantAvatars(coin.id);

                  const isPriceOffline = coin.price === null || coin.priceError;

                  if (isPriceOffline) {
                    return (
                      <div
                        key={coin.id}
                        id={`coin-card-${coin.id}`}
                        className="group bg-[#0A0A0C] border border-zinc-850 rounded-[22px] p-5 flex flex-col justify-between transition-all duration-300 shadow-[0_4px_24px_rgba(0,0,0,0.4)] min-h-[300px]"
                      >
                        <div className="flex justify-between items-start gap-4 mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-850 flex items-center justify-center shrink-0 animate-pulse">
                              <Icons.Loader2 className="w-4 h-4 text-zinc-650 animate-spin" />
                            </div>
                            <div className="text-left space-y-1.5">
                              <div className="w-16 h-3 bg-zinc-900 rounded animate-pulse"></div>
                              <div className="w-10 h-2 bg-zinc-950 rounded animate-pulse"></div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1.5">
                            <div className="w-10 h-3 bg-zinc-900 rounded animate-pulse"></div>
                            <div className="w-[100px] h-[28px] bg-zinc-950 rounded-md border border-zinc-900/60 animate-pulse"></div>
                          </div>
                        </div>

                        {/* Index price warning box */}
                        <div className="text-left mb-3 bg-zinc-950/50 p-3 rounded-lg border border-zinc-900/80 animate-pulse">
                          <div className="text-[9px] font-mono text-zinc-550 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                            <Icons.Radio className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                            Live Price Feed
                          </div>
                          <div className="text-[11px] font-bold text-amber-400 font-mono tracking-tight flex items-center gap-1.5">
                            Reconnecting to price feed...
                          </div>
                        </div>

                        <div className="space-y-2 mb-5">
                          <div className="text-left font-bold text-xs text-zinc-650 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-800 animate-pulse"></span>
                            Price feed offline
                          </div>
                          <div className="w-24 h-3 bg-zinc-900 rounded animate-pulse"></div>
                        </div>

                        {/* Disabled buttons */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            disabled
                            className="flex-1 py-2.5 rounded-xl font-bold font-mono text-xs bg-zinc-950 border border-zinc-900 text-zinc-600 opacity-40 cursor-not-allowed flex items-center justify-center gap-1"
                          >
                            Bullish
                          </button>
                          <button
                            type="button"
                            disabled
                            className="flex-1 py-2.5 rounded-xl font-bold font-mono text-xs bg-zinc-950 border border-zinc-900 text-zinc-600 opacity-40 cursor-not-allowed flex items-center justify-center gap-1"
                          >
                            Bearish
                          </button>
                        </div>
                      </div>
                    );
                  }

                  // Make sparkline min-max bounded for proper Recharts scaling
                  const sparkData = coin.sparkline.map((s, idx) => ({ idx, value: s.value }));
                  
                  // Formulate short participant strings (e.g. 10.3M or 5.4K)
                  const formatParticipantsCount = (votes: number) => {
                    const baseParticipants = Math.floor(votes * 1.5);
                    if (baseParticipants >= 1000000) {
                      return `${(baseParticipants / 1000000).toFixed(1)}M participants`;
                    }
                    if (baseParticipants >= 1000) {
                      return `${(baseParticipants / 1000).toFixed(1)}K participants`;
                    }
                    return `${baseParticipants} participants`;
                  };

                  return (
                    <div
                      key={coin.id}
                      id={`coin-card-${coin.id}`}
                      className="group bg-[#0A0A0C] border border-zinc-850 hover:border-zinc-700/80 rounded-[22px] p-5 flex flex-col justify-between transition-all duration-300 shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
                    >
                      {/* Top Row: Info and Sparkline */}
                      <div className="flex justify-between items-start gap-4 mb-4 relative">
                        {/* Coin branding and info */}
                        <div
                          className="flex items-center gap-3 cursor-pointer select-none"
                          onClick={() => setSelectedCoinId(coin.id)}
                        >
                          <img
                            src={coin.logo}
                            alt={coin.name}
                            className="w-10 h-10 rounded-full border border-zinc-800 object-cover shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="text-left">
                            <div className="font-bold text-sm tracking-wide text-white group-hover:text-cyber-cyan transition-colors">
                              {coin.symbol}
                            </div>
                            <div className="text-[10px] text-zinc-500 font-mono uppercase">{coin.name}</div>
                          </div>
                        </div>

                        {/* Sparkline and 24h percentage badge */}
                        <div className="flex flex-col items-end gap-1.5">
                          <span
                            className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-mono font-black ${
                              isUp ? 'text-[#1FD980] bg-[#1FD980]/5' : 'text-[#FF4B82] bg-[#FF4B82]/5'
                            }`}
                          >
                            {isUp ? '+' : ''}{coin.change.toFixed(2)}%
                          </span>

                          {/* Sparkline Canvas */}
                          <div className="w-[105px] h-[28px] overflow-hidden pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={sparkData} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
                                <defs>
                                  <linearGradient id={`grad-${coin.id}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={isUp ? '#1FD980' : '#FF4B82'} stopOpacity={0.4} />
                                    <stop offset="100%" stopColor={isUp ? '#1FD980' : '#FF4B82'} stopOpacity={0.0} />
                                  </linearGradient>
                                </defs>
                                <Area
                                  type="monotone"
                                  dataKey="value"
                                  stroke={isUp ? '#1FD980' : '#FF4B82'}
                                  strokeWidth={1.5}
                                  fill={`url(#grad-${coin.id})`}
                                  dot={false}
                                />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>

                      {/* Main Center Price section */}
                      <div className="text-left mb-3">
                        <div className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Index Price</div>
                        <div className="text-lg font-black font-mono text-white tracking-tight">
                          {formatPrice(coin.price)}
                        </div>
                      </div>

                      {/* Horizontal Participant and Live Indicator section */}
                      <div className="space-y-2 mb-5">
                        <div className="text-left font-bold text-xs text-white flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          Predictions are live
                        </div>

                        <div className="flex items-center gap-2.5">
                          {/* Avatar Overlap Row */}
                          <div className="flex -space-x-2 overflow-hidden">
                            {userAvatarUrls.map((url, i) => (
                              <img
                                key={i}
                                className="inline-block h-5 w-5 rounded-full ring-2 ring-black"
                                src={url}
                                alt="avatar"
                                referrerPolicy="no-referrer"
                              />
                            ))}
                          </div>
                          
                          {/* Participant badge */}
                          <span className="inline-flex items-center gap-1 bg-[#121214] border border-zinc-800 rounded px-1.5 py-0.5 text-[9px] font-mono text-zinc-400">
                            <Icons.BarChart3 className="w-3 h-3 text-cyber-cyan" />
                            {formatParticipantsCount(totalVotes)}
                          </span>
                        </div>
                      </div>

                      {/* Interactive Voting Pill Action Row */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={!!votedFor}
                          onClick={() => handleVote(coin.id, 'bullish')}
                          className={`flex-1 py-2.5 rounded-xl font-bold font-mono text-xs transition-all flex items-center justify-center gap-1 border cursor-pointer select-none ${
                            votedFor === 'bullish'
                              ? 'bg-[#1FD980]/20 border-[#1FD980] text-[#1FD980]'
                              : votedFor === 'bearish'
                              ? 'bg-zinc-900 border-zinc-800 text-zinc-650 opacity-40 cursor-not-allowed'
                              : 'bg-[#1FD980]/10 border-[#1FD980]/20 hover:border-[#1FD980]/40 text-[#1FD980] hover:bg-[#1FD980]/15'
                          }`}
                        >
                          <Icons.TrendingUp className="w-3.5 h-3.5" />
                          Bullish
                        </button>

                        <button
                          type="button"
                          disabled={!!votedFor}
                          onClick={() => handleVote(coin.id, 'bearish')}
                          className={`flex-1 py-2.5 rounded-xl font-bold font-mono text-xs transition-all flex items-center justify-center gap-1 border cursor-pointer select-none ${
                            votedFor === 'bearish'
                              ? 'bg-[#FF4B82]/20 border-[#FF4B82] text-[#FF4B82]'
                              : votedFor === 'bullish'
                              ? 'bg-zinc-900 border-zinc-800 text-zinc-650 opacity-40 cursor-not-allowed'
                              : 'bg-[#FF4B82]/10 border-[#FF4B82]/20 hover:border-[#FF4B82]/40 text-[#FF4B82] hover:bg-[#FF4B82]/15'
                          }`}
                        >
                          <Icons.TrendingDown className="w-3.5 h-3.5" />
                          Bearish
                        </button>
                      </div>

                      {/* Quick clickthrough to detail view */}
                      <button
                        type="button"
                        onClick={() => setSelectedCoinId(coin.id)}
                        className="mt-3.5 pt-2 border-t border-zinc-900 w-full text-center text-[10px] font-mono text-zinc-500 hover:text-cyber-cyan font-bold transition-colors flex items-center justify-center gap-1 group/btn"
                      >
                        Launch Detailed analysis
                        <Icons.ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  );
                })}
              </motion.div>
            ) : (
              /* =======================================================
                 COIN DETAIL SCREEN (Sentiment split, chart, live discussions)
                 ======================================================= */
              <motion.div
                key="detail"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {/* Top Navigating Header */}
                <div className="flex justify-between items-center bg-[#09090C] border border-zinc-850 rounded-[20px] p-4 font-mono text-xs">
                  <button
                    onClick={() => setSelectedCoinId(null)}
                    className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer select-none font-bold uppercase"
                  >
                    <Icons.ArrowLeft className="w-4 h-4 text-cyber-cyan" /> Back to predictions list
                  </button>
                  <span className="text-zinc-500">Live Forecast Active</span>
                </div>

                {/* Sweep Progress Banner */}
                {selectedCoin && (() => {
                  const activePredictions = userHistory.filter((p: any) => p.status === 'pending');
                  const uniqueActiveCoins = Array.from(new Set(activePredictions.map((p: any) => p.coinId)));
                  const activePredictedCount = uniqueActiveCoins.length;
                  return activePredictedCount >= 1 ? (
                    <div className="bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-cyan-500/10 border border-amber-500/20 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left animate-fadeIn">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
                          <Icons.Flame className="w-4 h-4 text-amber-400 animate-pulse" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-amber-200 font-mono">
                            {activePredictedCount} of 6 predicted in this round
                          </div>
                          <p className="text-[10px] text-zinc-400 leading-normal">
                            Get all 6 right for an epic <strong className="text-amber-400">6x perfect sweep bonus</strong>!
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-1">
                        {['surchi', 'bitcoin', 'ethereum', 'binancecoin', 'solana', 'tether-gold'].map((coinId) => {
                          const hasPrediction = uniqueActiveCoins.includes(coinId);
                          return (
                            <div
                              key={coinId}
                              className={`w-10 h-6 rounded-md border flex items-center justify-center text-[9px] font-bold font-mono transition-all ${
                                hasPrediction
                                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.3)]'
                                  : 'bg-zinc-950/60 border-zinc-850 text-zinc-600'
                              }`}
                              title={coinId.toUpperCase()}
                            >
                              {coinId === 'binancecoin' ? 'BNB' : coinId === 'tether-gold' ? 'XAUT' : coinId.substring(0, 3).toUpperCase()}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : null;
                })()}

                {selectedCoin && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    {/* LEFT COLUMN: Main Chart & Interactive Forecast Controls */}
                    <div className="lg:col-span-2 space-y-6">
                      <div className="bg-[#0A0A0C] border border-zinc-850 rounded-[22px] p-6 shadow-2xl relative overflow-hidden">
                        
                        {/* Token Banner Header */}
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 border-b border-zinc-900 pb-5">
                          <div className="flex items-center gap-3.5 text-left">
                            <img
                              src={selectedCoin.logo}
                              alt={selectedCoin.name}
                              className="w-12 h-12 rounded-full border border-zinc-800 object-cover"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <h3 className="text-lg font-black tracking-wide text-white">{selectedCoin.symbol}</h3>
                              <p className="text-xs text-zinc-500 font-mono uppercase">{selectedCoin.name} / Tether Gold Indices</p>
                            </div>
                          </div>

                          <div className="text-left sm:text-right">
                            <div className="text-2xl font-black font-mono text-white tracking-tight">
                              {formatPrice(selectedCoin.price)}
                            </div>
                            <span
                              className={`inline-flex items-center gap-0.5 px-2.5 py-0.5 rounded text-xs font-mono font-black ${
                                selectedCoin.change >= 0 ? 'text-[#1FD980] bg-[#1FD980]/5' : 'text-[#FF4B82] bg-[#FF4B82]/5'
                              }`}
                            >
                              {selectedCoin.change >= 0 ? '+' : ''}{selectedCoin.change.toFixed(2)}%
                            </span>
                          </div>
                        </div>

                        {/* Custom Candlestick Chart header */}
                        <div className="text-left mb-4 flex flex-col gap-3">
                          <div>
                            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest bg-zinc-950/80 px-2 py-1 border border-zinc-850 rounded inline-flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                              24-Hour Forensic Candlestick Index
                            </span>
                          </div>

                          {(selectedCoin.priceError || selectedCoin.price === null) && (
                            <div className="text-left bg-amber-950/25 border border-amber-900/40 p-4 rounded-xl flex items-center gap-3">
                              <Icons.AlertTriangle className="w-5 h-5 text-amber-500 animate-pulse shrink-0" />
                              <div className="space-y-0.5">
                                <h5 className="text-xs font-bold text-amber-200 font-mono">Live Pricing Temporarily Offline</h5>
                                <p className="text-[10px] text-zinc-400 leading-normal font-mono">
                                  Reconnecting to decentralized node indices. Staking and round settlement are temporarily locked until live feed synchronization is established.
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        {(() => {
                          const candlesData = candleCache[selectedCoin.id] || generateCandlesForCoin(selectedCoin.price || 1.0, selectedCoin.change || 0, selectedCoin.id);
                          const candlePrices = candlesData.map((d: any) => d.close);
                          const maxPrice = candlePrices.length > 0 ? Math.max(...candlePrices) * 1.015 : (selectedCoin.price || 1.0) * 1.05;
                          const minPrice = candlePrices.length > 0 ? Math.min(...candlePrices) * 0.985 : (selectedCoin.price || 1.0) * 0.95;

                          const activeHUD = hoveredPoint || (candlesData.length > 0 ? candlesData[candlesData.length - 1] : null);
                          const activeChangePct = activeHUD 
                            ? activeHUD.open > 0 
                              ? ((activeHUD.close - activeHUD.open) / activeHUD.open) * 100 
                              : 0
                            : 0;
                          const isUpHUD = activeHUD ? activeHUD.close >= activeHUD.open : true;

                          return (
                            <div className="h-[280px] w-full relative">
                              {/* Real-time Floating HUD */}
                              {activeHUD && (
                                <div className="absolute top-1.5 left-2 z-20 flex flex-wrap items-center gap-x-2 text-[8.5px] font-mono pointer-events-none shadow-md px-2 py-1 rounded backdrop-blur-md border border-zinc-800/80 bg-black/60 text-zinc-400">
                                  <span className="text-zinc-200 font-bold uppercase">{selectedCoin.symbol}</span>
                                  <span>O:</span>
                                  <span className="text-zinc-200">{formatPrice(activeHUD.open)}</span>
                                  <span>H:</span>
                                  <span className="text-[#26a69a] font-bold">{formatPrice(activeHUD.high)}</span>
                                  <span>L:</span>
                                  <span className="text-[#e8563f] font-bold">{formatPrice(activeHUD.low)}</span>
                                  <span>C:</span>
                                  <span className={isUpHUD ? "text-[#26a69a] font-bold" : "text-[#e8563f] font-bold"}>
                                    {formatPrice(activeHUD.close)}
                                  </span>
                                  <span className={`font-bold ${isUpHUD ? "text-[#26a69a]" : "text-[#e8563f]"}`}>
                                    {activeChangePct >= 0 ? '+' : ''}{activeChangePct.toFixed(2)}%
                                  </span>
                                </div>
                              )}

                              <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart 
                                  data={candlesData} 
                                  margin={{ top: 25, right: 10, left: -10, bottom: 0 }}
                                  onMouseMove={(state: any) => {
                                    if (state && state.activePayload && state.activePayload.length) {
                                      setHoveredPoint(state.activePayload[0].payload);
                                    } else {
                                      setHoveredPoint(null);
                                    }
                                  }}
                                  onMouseLeave={() => setHoveredPoint(null)}
                                >
                                  <CartesianGrid strokeDasharray="3 3" stroke="#1F1F24" vertical={false} opacity={0.35} />
                                  <XAxis 
                                    dataKey="label" 
                                    stroke="#52525B"
                                    fontSize={9}
                                    fontFamily="monospace"
                                    tickLine={false}
                                    axisLine={false}
                                  />
                                  <YAxis 
                                    domain={[minPrice, maxPrice]}
                                    stroke="#52525B"
                                    fontSize={9}
                                    fontFamily="monospace"
                                    orientation="right"
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(val) => formatPrice(val)}
                                  />
                                  <Tooltip
                                    cursor={{ 
                                      stroke: '#4a4a4e', 
                                      strokeWidth: 0.8, 
                                      strokeDasharray: '4 4' 
                                    }}
                                    content={() => null}
                                  />

                                  {/* Candle Wicks */}
                                  <Bar dataKey="wick" barSize={2} isAnimationActive={false}>
                                    {candlesData.map((entry: any, index: number) => {
                                      const isUpCandle = entry.close >= entry.open;
                                      return (
                                        <Cell 
                                          key={`wick-${index}`} 
                                          fill={isUpCandle ? '#26a69a' : '#e8563f'} 
                                        />
                                      );
                                    })}
                                  </Bar>
                                  
                                  {/* Robust Hollow Candlestick Body Renderer */}
                                  <Bar dataKey="body" barSize={8} isAnimationActive={false}>
                                    {candlesData.map((entry: any, index: number) => {
                                      const isUpCandle = entry.close >= entry.open;
                                      return (
                                        <Cell 
                                          key={`body-${index}`} 
                                          fill={isUpCandle ? 'transparent' : '#e8563f'} 
                                          stroke={isUpCandle ? '#26a69a' : '#e8563f'}
                                          strokeWidth={1.2}
                                        />
                                      );
                                    })}
                                  </Bar>

                                  {/* Live spot price dashed horizontal line */}
                                  {selectedCoin.price !== null && (
                                    <ReferenceLine
                                      y={selectedCoin.price}
                                      stroke={selectedCoin.change >= 0 ? '#26a69a' : '#e8563f'}
                                      strokeDasharray="3 3"
                                      strokeWidth={1}
                                      isFront={true}
                                    />
                                  )}
                                </ComposedChart>
                              </ResponsiveContainer>
                            </div>
                          );
                        })()}
                      </div>

                      {/* Sentiment split bar and controls */}
                      <div className="bg-[#0A0A0C] border border-zinc-850 rounded-[22px] p-6 shadow-2xl space-y-5">
                        <div className="flex justify-between items-center">
                          <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-400 font-extrabold text-left pl-1">
                            Current Round Sentiment
                          </h4>
                          <span className="text-[10px] font-mono text-zinc-500 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-850">
                            {selectedCoin.bullishVotes + selectedCoin.bearishVotes} total forecasts
                          </span>
                        </div>

                        {/* Sentiment Split Bar Component */}
                        {(() => {
                          const total = selectedCoin.bullishVotes + selectedCoin.bearishVotes;
                          const bPercent = total > 0 ? Math.round((selectedCoin.bullishVotes / total) * 100) : 50;
                          const bearPercent = 100 - bPercent;

                          return (
                            <div className="space-y-2.5">
                              {/* Horizontal Visual bar */}
                              <div className="h-6 w-full rounded-full overflow-hidden flex font-mono font-black text-[10px] leading-6 select-none shadow-[0_0_12px_rgba(31,217,128,0.04)]">
                                <div
                                  style={{ width: `${bPercent}%` }}
                                  className="bg-gradient-to-r from-emerald-600 to-[#1FD980] text-emerald-950 text-left pl-3 shrink-0"
                                >
                                  {bPercent >= 15 ? `${bPercent}% Bullish` : ''}
                                </div>
                                <div
                                  style={{ width: `${bearPercent}%` }}
                                  className="bg-gradient-to-r from-[#FF4B82] to-rose-600 text-rose-950 text-right pr-3 shrink-0 flex-1"
                                >
                                  {bearPercent >= 15 ? `${bearPercent}% Bearish` : ''}
                                </div>
                              </div>
                              <p className="text-[10px] font-mono text-zinc-500 text-center uppercase tracking-wider">
                                Consensus: {bPercent > 50 ? 'bullish majority split' : bPercent < 50 ? 'bearish majority split' : 'equal split'}
                              </p>
                            </div>
                          );
                        })()}

                        {/* Staking and Forecast Input / Settle Module */}
                        <div className="bg-[#0A0A0C] border border-zinc-850 rounded-[22px] p-6 shadow-2xl space-y-5">
                          {(() => {
                            const pendingPrediction = userHistory.find(
                              (p: any) => p.coinId === selectedCoin.id && p.status === 'pending'
                            );

                            if (pendingPrediction) {
                              const entry = parseFloat(pendingPrediction.entryPrice);
                              const current = selectedCoin.price;
                              const isBullish = pendingPrediction.directionPredicted === 'bullish';
                              const pctDiff = ((current - entry) / entry) * 100;
                              const isWinning = (isBullish && current >= entry) || (!isBullish && current <= entry);
                              const estimatedPayout = isWinning ? (pendingPrediction.stakeAmount * 2) : 0;

                              const timeLimit = new Date(pendingPrediction.timestamp).getTime() + 24 * 60 * 60 * 1000;
                              const timeRemainingMs = Math.max(0, timeLimit - Date.now());
                              const canSettle = timeRemainingMs === 0;

                              const hoursLeft = Math.floor(timeRemainingMs / (60 * 60 * 1000));
                              const minsLeft = Math.floor((timeRemainingMs % (60 * 60 * 1000)) / (60 * 1000));
                              const secsLeft = Math.floor((timeRemainingMs % (1000 * 60)) / 1000);
                              const countdownStr = `${hoursLeft.toString().padStart(2, '0')}:${minsLeft.toString().padStart(2, '0')}:${secsLeft.toString().padStart(2, '0')}`;

                              return (
                                <div className="space-y-4">
                                  <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                                    <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-400 font-extrabold text-left pl-1">
                                      Your Active Forecast Position
                                    </h4>
                                    <span className="text-[9px] text-cyan-400 bg-cyan-950/60 border border-cyan-900 px-2 py-0.5 rounded font-mono font-black animate-pulse uppercase">
                                      PENDING RESOLUTION
                                    </span>
                                  </div>

                                  <div className="p-4 rounded-xl border border-zinc-850 bg-[#121214]/40 font-mono text-xs space-y-3 text-left">
                                    <div className="flex justify-between">
                                      <span className="text-zinc-500">Predicted Outlook</span>
                                      <span className={`font-black flex items-center gap-1 uppercase ${isBullish ? 'text-[#1FD980]' : 'text-[#FF4B82]'}`}>
                                        {isBullish ? <Icons.ArrowUpRight className="w-3.5 h-3.5" /> : <Icons.ArrowDownRight className="w-3.5 h-3.5" />}
                                        {pendingPrediction.directionPredicted}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-zinc-500">Staked Capital</span>
                                      <span className="font-extrabold text-white">
                                        {pendingPrediction.stakeAmount.toLocaleString()} $SURCHI
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-zinc-500">Entry Index Price</span>
                                      <span className="font-semibold text-zinc-200">
                                        ${entry.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-zinc-500">Live Index Price</span>
                                      <span className="font-bold text-cyber-cyan">
                                        ${current.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                      </span>
                                    </div>
                                    <div className="flex justify-between border-t border-zinc-900 pt-2">
                                      <span className="text-zinc-500">Live Outcome State</span>
                                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${isWinning ? 'bg-emerald-950/60 border border-emerald-900 text-[#1FD980]' : 'bg-rose-950/60 border border-rose-900 text-[#FF4B82]'}`}>
                                        {isWinning ? "WINNING" : "LOSING / FORFEIT"} ({pctDiff >= 0 ? '+' : ''}{pctDiff.toFixed(3)}%)
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-zinc-500">Est. Win Multiplier</span>
                                      <span className={`font-black ${isWinning ? 'text-[#1FD980]' : 'text-zinc-500'}`}>
                                        {isWinning ? '2.00x' : '0x'}
                                      </span>
                                    </div>
                                    <div className="flex justify-between border-t border-zinc-900 pt-2 text-sm">
                                      <span className="text-zinc-400 font-semibold">Live Payout Claim</span>
                                      <span className={`font-extrabold ${isWinning ? 'text-[#1FD980]' : 'text-zinc-500'}`}>
                                        {estimatedPayout.toLocaleString(undefined, { maximumFractionDigits: 2 })} $SURCHI
                                      </span>
                                    </div>
                                  </div>

                                  {!canSettle && (
                                    <div className="p-3 bg-zinc-950/80 rounded-xl border border-zinc-900 text-center font-mono text-xs">
                                      <span className="text-zinc-500 block text-[10px] uppercase tracking-wider mb-1">Settlement Window Closes In</span>
                                      <strong className="text-amber-400 text-sm font-black tracking-widest">{countdownStr}</strong>
                                    </div>
                                  )}

                                  <button
                                    type="button"
                                    onClick={() => handleSettlePrediction(pendingPrediction.id, selectedCoin.id)}
                                    disabled={isSettling === pendingPrediction.id || !canSettle}
                                    className={`w-full py-3.5 font-extrabold font-mono rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 select-none ${
                                      canSettle 
                                        ? 'bg-gradient-to-r from-cyan-500 via-cyan-400 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-black shadow-[0_0_15px_rgba(0,245,255,0.2)] hover:shadow-[0_0_20px_rgba(0,245,255,0.45)]' 
                                        : 'bg-zinc-900/50 border border-zinc-850 text-zinc-500 cursor-not-allowed'
                                    }`}
                                  >
                                    {isSettling === pendingPrediction.id ? (
                                      <>
                                        <Icons.Loader2 className="w-4 h-4 animate-spin text-zinc-550" />
                                        COMMITTING SETTLEMENT...
                                      </>
                                    ) : !canSettle ? (
                                      <>
                                        <Icons.Clock className="w-4 h-4 text-zinc-650" />
                                        PREDICTION LOCKED (24H WINDOW)
                                      </>
                                    ) : (
                                      <>
                                        <Icons.CheckSquare className="w-4 h-4 text-black" />
                                        SETTLE PREDICTION ROUND NOW
                                      </>
                                    )}
                                  </button>
                                  <p className="text-[9px] font-mono text-zinc-500 text-center leading-relaxed">
                                    * Predictions run on a strict 24-hour settlement lock. Once the countdown completes, live on-chain or external API indices determine your final round outcome. No early cancellation allowed.
                                  </p>
                                </div>
                              );
                            }

                            // STAKING INPUT FORM (when no pending position exists)
                            return (
                              <div className="space-y-4">
                                <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                                  <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-400 font-extrabold text-left pl-1">
                                    Participate in Staking
                                  </h4>
                                  <div className="flex items-center gap-1">
                                    <span className="text-[10px] font-mono text-zinc-500">Available:</span>
                                    <strong className="text-xs text-cyber-cyan font-mono">
                                      {userBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} $SURCHI
                                    </strong>
                                    {userBalance < 1000 && (
                                      <button
                                        type="button"
                                        onClick={handleFaucetClaim}
                                        className="text-[9px] bg-cyan-950 text-cyber-cyan hover:bg-cyber-cyan hover:text-black border border-cyber-cyan/30 rounded px-1 font-bold tracking-wider py-0.5 ml-1 select-none transition-all uppercase"
                                      >
                                        Claim Faucet (+50K)
                                      </button>
                                    )}
                                  </div>
                                </div>

                                {/* Stake input field */}
                                <div className="space-y-2">
                                  <div className="relative">
                                    <input
                                      type="number"
                                      value={stakeAmount}
                                      onChange={(e) => {
                                        setStakeAmount(e.target.value);
                                        setStakeError(null);
                                      }}
                                      placeholder="0.00"
                                      className="w-full bg-[#121214] border border-zinc-850 hover:border-zinc-800 focus:border-zinc-750 text-white rounded-xl py-3 pl-3 pr-16 text-sm font-mono focus:outline-none transition-colors"
                                    />
                                    <span className="absolute right-3.5 top-3.5 text-xs text-zinc-500 font-bold font-mono">
                                      $SURCHI
                                    </span>
                                  </div>

                                  {/* Quick Select percentage ratios */}
                                  <div className="grid grid-cols-4 gap-2">
                                    {[0.25, 0.50, 0.75, 1.0].map((ratio) => {
                                      const label = ratio === 1.0 ? 'MAX' : `${ratio * 100}%`;
                                      return (
                                        <button
                                          key={ratio}
                                          type="button"
                                          onClick={() => {
                                            let amt = Math.floor(userBalance * ratio);
                                            if (ratio === 1.0) {
                                              amt = Math.min(5000, Math.floor(userBalance));
                                            }
                                            setStakeAmount(amt.toString());
                                            setStakeError(null);
                                          }}
                                          className="py-1 bg-zinc-950 hover:bg-zinc-900 border border-zinc-850 text-[10px] font-mono text-zinc-400 hover:text-white rounded-lg transition-colors cursor-pointer font-bold select-none"
                                        >
                                          {label}
                                        </button>
                                      );
                                    })}
                                  </div>

                                  {/* Potential payout live updates */}
                                  {(() => {
                                    const val = parseFloat(stakeAmount);
                                    if (isNaN(val) || val <= 0) return null;
                                    return (
                                      <div className="space-y-2">
                                        <div className="p-3 bg-zinc-950/45 rounded-lg border border-zinc-900 text-left font-mono text-[10px] space-y-1">
                                          <div className="flex justify-between text-zinc-500">
                                            <span>Potential win (2x):</span>
                                            <strong className="text-[#1FD980]">{(val * 2).toLocaleString()} $SURCHI</strong>
                                          </div>
                                          <p className="text-[8px] text-zinc-650 leading-relaxed pt-1 border-t border-zinc-900/40">
                                            * Earn a flat 2x payout on a correct prediction. Predict on all 6 coins within the same 24h round and get all 6 correct for a 6x sweep bonus!
                                          </p>
                                        </div>
                                        {val > 5000 && (
                                          <p className="text-[10px] text-[#FF4B82] font-mono text-left animate-pulse">
                                            Maximum stake is 5,000 $SURCHI
                                          </p>
                                        )}
                                      </div>
                                    );
                                  })()}

                                  {stakeError && (
                                    <p className="text-[10px] text-[#FF4B82] font-mono text-left animate-pulse">
                                      {stakeError}
                                    </p>
                                  )}
                                </div>

                                {/* Sentiment Voting action controls */}
                                <div className="space-y-2.5 pt-2 border-t border-zinc-900">
                                  <div className="text-left font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
                                    Commit Stake Outlook
                                  </div>
                                  
                                  <div className="flex items-center gap-3">
                                    <button
                                      type="button"
                                      disabled={isStaking || isNaN(parseFloat(stakeAmount)) || parseFloat(stakeAmount) <= 0 || parseFloat(stakeAmount) > userBalance || parseFloat(stakeAmount) > 5000 || selectedCoin.priceError || selectedCoin.price === null}
                                      onClick={() => handleStake(selectedCoin.id, 'bullish')}
                                      className="flex-1 py-3 bg-emerald-950/20 hover:bg-emerald-950/30 border border-emerald-900/60 hover:border-emerald-700 text-[#1FD980] disabled:opacity-30 disabled:hover:bg-emerald-950/20 disabled:border-emerald-900/60 disabled:cursor-not-allowed rounded-xl font-bold font-mono text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer select-none"
                                    >
                                      {isStaking ? (
                                        <Icons.Loader2 className="w-4 h-4 animate-spin text-[#1FD980]" />
                                      ) : (
                                        <Icons.TrendingUp className="w-4 h-4" />
                                      )}
                                      Predict Bullish
                                    </button>

                                    <button
                                      type="button"
                                      disabled={isStaking || isNaN(parseFloat(stakeAmount)) || parseFloat(stakeAmount) <= 0 || parseFloat(stakeAmount) > userBalance || parseFloat(stakeAmount) > 5000 || selectedCoin.priceError || selectedCoin.price === null}
                                      onClick={() => handleStake(selectedCoin.id, 'bearish')}
                                      className="flex-1 py-3 bg-rose-950/20 hover:bg-rose-950/30 border border-[#FF4B82]/30 hover:border-[#FF4B82]/60 text-[#FF4B82] disabled:opacity-30 disabled:hover:bg-rose-950/20 disabled:border-[#FF4B82]/30 disabled:cursor-not-allowed rounded-xl font-bold font-mono text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer select-none"
                                    >
                                      {isStaking ? (
                                        <Icons.Loader2 className="w-4 h-4 animate-spin text-[#FF4B82]" />
                                      ) : (
                                        <Icons.TrendingDown className="w-4 h-4" />
                                      )}
                                      Predict Bearish
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })()}
                        </div>

                        {/* Prediction History Logs */}
                        <div className="bg-[#0A0A0C] border border-zinc-850 rounded-[22px] p-6 shadow-2xl space-y-4">
                          <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                            <div className="flex items-center gap-2">
                              <Icons.History className="w-4 h-4 text-cyber-cyan" />
                              <h4 className="text-xs font-mono uppercase tracking-widest text-white font-extrabold text-left pl-1">
                                My Prediction History
                              </h4>
                            </div>
                            <span className="text-[10px] bg-zinc-950 px-2 py-0.5 rounded border border-zinc-850 font-mono text-zinc-500">
                              {userHistory.length} ROUNDS
                            </span>
                          </div>

                          <div className="max-h-[300px] overflow-y-auto space-y-3 pr-1 text-left">
                            {userHistory.length === 0 ? (
                              <div className="py-12 text-center text-[10px] font-mono text-zinc-650 space-y-1">
                                <Icons.Inbox className="w-6 h-6 mx-auto text-zinc-700" />
                                <span>No previous prediction logs. Place your first stake!</span>
                              </div>
                            ) : (
                              userHistory.map((pred) => {
                                const isPending = pred.status === 'pending';
                                const isWin = pred.outcome === 'win';
                                const formattedTime = new Date(pred.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
                                
                                return (
                                  <div key={pred.id} className={`p-3.5 rounded-xl border font-mono text-[11px] transition-all ${
                                    isPending 
                                      ? 'bg-zinc-950/45 border-zinc-850/60 shadow-[inset_0_1px_5px_rgba(0,245,255,0.02)]' 
                                      : isWin 
                                        ? 'bg-emerald-950/10 border-emerald-900/30' 
                                        : 'bg-rose-950/10 border-rose-900/30'
                                  }`}>
                                    <div className="flex justify-between items-center mb-2">
                                      <span className="font-bold text-white uppercase">
                                        {pred.isSweepBonus ? "🏆 PERFECT SWEEP BONUS" : `${pred.coinId} Forecast`}
                                      </span>
                                      {isPending ? (
                                        <span className="text-[9px] text-cyan-400 bg-cyan-950/60 border border-cyan-900 px-1.5 py-0.5 rounded uppercase font-black animate-pulse">PENDING</span>
                                      ) : isWin ? (
                                        <span className="text-[9px] text-[#1FD980] bg-emerald-950/60 border border-emerald-900 px-1.5 py-0.5 rounded uppercase font-black">{pred.isSweepBonus ? "BONUS UNLOCKED" : "WIN"}</span>
                                      ) : (
                                        <span className="text-[9px] text-[#FF4B82] bg-rose-950/60 border border-rose-900 px-1.5 py-0.5 rounded uppercase font-black">FORFEIT</span>
                                      )}
                                    </div>

                                    {pred.isSweepBonus ? (
                                      <div className="grid grid-cols-2 gap-y-1.5 text-zinc-400 text-[10px]">
                                        <div>Total Staked (6 coins): <strong className="text-white">{pred.stakeAmount.toLocaleString()} $SURCHI</strong></div>
                                        <div>Round Type: <span className="text-amber-400 font-bold uppercase">6/6 SWEEP</span></div>
                                        <div>Multiplier: <strong className="text-[#1FD980]">{pred.multiplierApplied}x</strong></div>
                                        <div>Bonus Payout: <strong className="text-[#1FD980]">{pred.finalPayout.toLocaleString()} $SURCHI</strong></div>
                                      </div>
                                    ) : (
                                      <div className="grid grid-cols-2 gap-y-1.5 text-zinc-400 text-[10px]">
                                        <div>Staked amount: <strong className="text-white">{pred.stakeAmount.toLocaleString()} $SURCHI</strong></div>
                                        <div>Direction: <span className={pred.directionPredicted === 'bullish' ? 'text-[#1FD980] font-black' : 'text-[#FF4B82]'}>{pred.directionPredicted.toUpperCase()}</span></div>
                                        <div>Entry price: <span className="text-zinc-300 font-bold">${parseFloat(pred.entryPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</span></div>
                                        {!isPending && (
                                          <>
                                            <div>Resolution: <span className="text-zinc-350 font-bold">${parseFloat(pred.resolutionPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</span></div>
                                            <div>Multiplier: <strong className={isWin ? 'text-[#1FD980]' : 'text-zinc-500'}>{pred.multiplierApplied}x</strong></div>
                                            <div>Payout: <strong className={isWin ? 'text-[#1FD980]' : 'text-zinc-500'}>{pred.finalPayout.toLocaleString()} $SURCHI</strong></div>
                                          </>
                                        )}
                                      </div>
                                    )}
                                    <div className="text-[9px] text-zinc-500 mt-2 border-t border-zinc-900/40 pt-1.5 flex justify-between items-center">
                                      <span>Placed: {formattedTime}</span>
                                      {isPending && (() => {
                                        const tLimit = new Date(pred.timestamp).getTime() + 24 * 60 * 60 * 1000;
                                        const remainingMs = Math.max(0, tLimit - Date.now());
                                        const canSettleNow = remainingMs === 0;

                                        if (!canSettleNow) {
                                          const hLeft = Math.floor(remainingMs / (60 * 60 * 1000));
                                          const mLeft = Math.floor((remainingMs % (60 * 60 * 1000)) / (60 * 1000));
                                          const sLeft = Math.floor((remainingMs % (1000 * 60)) / 1000);
                                          const itemTimer = `${hLeft.toString().padStart(2, '0')}:${mLeft.toString().padStart(2, '0')}:${sLeft.toString().padStart(2, '0')}`;
                                          return (
                                            <span className="text-[9px] text-amber-500 font-mono font-bold flex items-center gap-1 bg-amber-950/20 border border-amber-900/40 px-1.5 py-0.5 rounded">
                                              <Icons.Clock className="w-2.5 h-2.5 text-amber-500/80 animate-pulse" />
                                              Locked ({itemTimer})
                                            </span>
                                          );
                                        }

                                        return (
                                          <button
                                            onClick={() => handleSettlePrediction(pred.id, pred.coinId)}
                                            disabled={isSettling === pred.id}
                                            className="text-cyan-400 hover:text-white font-extrabold uppercase text-[9px] transition-colors bg-zinc-900 hover:bg-cyan-950 px-2 py-0.5 rounded border border-cyan-900 cursor-pointer"
                                          >
                                            {isSettling === pred.id ? "Settling..." : "Settle Live"}
                                          </button>
                                        );
                                      })()}
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT COLUMN: Dedicated Comments Thread section */}
                    <div className="bg-[#0A0A0C] border border-zinc-850 rounded-[22px] p-5 shadow-2xl flex flex-col h-[585px]">
                      
                      {/* Section Title Header */}
                      <div className="flex items-center justify-between border-b border-zinc-900 pb-3.5 mb-4">
                        <div className="flex items-center gap-2">
                          <Icons.MessageSquare className="w-4 h-4 text-cyber-cyan" />
                          <h4 className="text-xs font-mono uppercase tracking-widest text-white font-extrabold">
                            Live Round Discussion
                          </h4>
                        </div>
                        <span className="text-[9px] bg-cyan-950/60 border border-cyan-850 text-cyber-cyan px-1.5 py-0.5 rounded font-mono font-black scale-90">
                          {selectedCoin.comments.length} CHATS
                        </span>
                      </div>

                      {/* Quick Profile Modifier component */}
                      <div className="mb-4 bg-zinc-950/80 p-2.5 rounded-lg border border-zinc-850 flex items-center justify-between gap-2.5 text-left font-mono">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <img
                            src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${username}`}
                            className="w-7 h-7 rounded-full bg-zinc-900 ring-1 ring-zinc-800 shrink-0"
                            alt="Your avatar"
                            referrerPolicy="no-referrer"
                          />
                          {isEditingUsername ? (
                            <input
                              type="text"
                              maxLength={22}
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              className="bg-black border border-zinc-800 rounded px-1.5 py-0.5 text-xs text-white max-w-[120px] focus:outline-none focus:border-cyber-cyan"
                            />
                          ) : (
                            <span className="text-xs text-zinc-300 truncate shrink font-semibold">@{username}</span>
                          )}
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => setIsEditingUsername(!isEditingUsername)}
                          className="text-[9px] uppercase font-bold text-cyber-cyan hover:text-white transition-colors"
                        >
                          {isEditingUsername ? 'Save' : 'Edit profile'}
                        </button>
                      </div>

                      {/* Comment inputs */}
                      <div className="mb-4">
                        <div className="relative">
                          <textarea
                            rows={3}
                            maxLength={280}
                            placeholder="Add to the token discussion..."
                            value={newCommentText}
                            onChange={(e) => setNewCommentText(e.target.value)}
                            className="w-full bg-[#121214] border border-zinc-850 rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700 font-sans resize-none text-left"
                          />
                          <button
                            type="button"
                            onClick={() => handlePostComment(selectedCoin.id)}
                            disabled={!newCommentText.trim()}
                            className="absolute bottom-3 right-3 p-1.5 rounded-lg bg-cyber-cyan hover:bg-cyber-cyan/95 text-black disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                          >
                            <Icons.Send className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Comments stream */}
                      <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 text-left">
                        {selectedCoin.comments.length === 0 ? (
                          <div className="py-12 text-center text-[10px] font-mono text-zinc-650 space-y-1.5">
                            <Icons.MessageSquareX className="w-6 h-6 mx-auto text-zinc-700" />
                            <span>No discussions posted yet in this round. Be the first!</span>
                          </div>
                        ) : (
                          selectedCoin.comments.map((comment) => {
                            const formattedTime = () => {
                              try {
                                const diffMs = Date.now() - new Date(comment.timestamp).getTime();
                                const diffMins = Math.floor(diffMs / 60000);
                                if (diffMins < 1) return 'just now';
                                if (diffMins < 60) return `${diffMins}m ago`;
                                const diffHrs = Math.floor(diffMins / 60);
                                if (diffHrs < 24) return `${diffHrs}h ago`;
                                return new Date(comment.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' });
                              } catch {
                                return 'some time ago';
                              }
                            };

                            return (
                              <div
                                key={comment.id}
                                className="bg-[#121214]/40 border border-zinc-900/60 p-3 rounded-xl space-y-1 hover:bg-[#121214]/60 transition-all font-sans text-xs"
                              >
                                <div className="flex items-center gap-2 mb-1.5 font-mono">
                                  <img
                                    src={comment.avatar}
                                    className="w-5.5 h-5.5 rounded-full ring-1 ring-zinc-800 object-cover bg-zinc-950 shrink-0"
                                    alt="User"
                                    referrerPolicy="no-referrer"
                                  />
                                  <span className="font-bold text-zinc-250 truncate text-[11px]">@{comment.username}</span>
                                  <span className="text-[9px] text-zinc-500 ml-auto shrink-0 font-normal">{formattedTime()}</span>
                                </div>
                                <p className="text-zinc-300 leading-relaxed break-words font-medium text-left pl-1">
                                  {comment.text}
                                </p>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
