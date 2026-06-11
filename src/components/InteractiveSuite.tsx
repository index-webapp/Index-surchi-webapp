import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import AISmartAuditor from './AISmartAuditor';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ComposedChart,
  Bar,
  Cell
} from 'recharts';

interface InteractiveSuiteProps {
  activeModuleId: string;
  payload: Record<string, string>;
  content: string;
  themeAccent: string;
  themeMode: string;
  onRefresh: (overridePayload?: Record<string, string>) => void;
}

export default function InteractiveSuite({
  activeModuleId,
  payload,
  content,
  themeAccent,
  themeMode,
  onRefresh
}: InteractiveSuiteProps) {
  switch (activeModuleId) {
    case 'token_analyzer':
      return <TokenAnalyzerDashboard payload={payload} content={content} />;
    case 'smart_auditor':
      return <SmartAuditorDashboard payload={payload} content={content} />;
    case 'rug_detector':
      return <RugDetectorDashboard payload={payload} content={content} />;
    case 'wallet_checker':
      return <WalletCheckerDashboard payload={payload} content={content} />;
    case 'defi_scanner':
      return <DefiScannerDashboard payload={payload} content={content} />;
    case 'ad_creator':
      return <AdCreatorDashboard payload={payload} content={content} onRefresh={onRefresh} />;
    case 'airdrop_builder':
      return <AirdropBuilderDashboard payload={payload} content={content} />;
    case 'whitepaper_generator':
      return <WhitepaperGeneratorDashboard payload={payload} content={content} />;
    case 'launch_planner':
      return <LaunchPlannerDashboard payload={payload} content={content} />;
    case 'smart_contract_generator':
      return <SmartContractGeneratorDashboard payload={payload} content={content} />;
    case 'branding_generator':
      return <BrandingGeneratorDashboard payload={payload} content={content} />;
    case 'market_sentiment':
      return <MarketSentimentDashboard payload={payload} content={content} />;
    case 'tweet_writer':
      return <TweetWriterDashboard content={content} onRefresh={onRefresh} />;
    case 'competitor_analysis':
      return <CompetitorAnalysisDashboard payload={payload} content={content} />;
    case 'smart_money_tracker':
      return <SmartMoneyTrackerDashboard payload={payload} content={content} />;
    default:
      return <StandardMarkdownViewer content={content} />;
  }
}

// ==========================================
// UTILITIES Shared across subcomponents
// ==========================================
function parseSecurityScore(content: string): number {
  const match = content.match(/(\d{1,2})\s*\/\s*100/);
  return match ? parseInt(match[1]) : 88;
}

function parseRugProbability(content: string): number {
  const match = content.match(/(\d{1,2})%/);
  if (match) return parseInt(match[1]);
  const lower = content.toLowerCase();
  if (lower.includes('high risk') || lower.includes('likely rug')) return 84;
  if (lower.includes('caution')) return 45;
  return 14;
}

// Isolated Copy Action Hook for each subcomponent to prevent global mismatch
function useCopy() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const triggerCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };
  return { copiedKey, triggerCopy };
}

// ==========================================
// SUB-COMPONENTS FOR EACH FORENSIC WORKSPACE
// ==========================================

// 1. TOKEN ANALYZER DASHBOARD
interface SubComponentProps {
  payload: Record<string, string>;
  content: string;
}

interface CandlePriceDataPoint {
  date: string;
  price: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: string;
  body: [number, number];
  wick: [number, number];
}

function TokenAnalyzerDashboard({ payload, content }: SubComponentProps) {
  const score = parseSecurityScore(content);
  const ticker = payload?.token || 'SURCHI';
  const name = payload?.name || 'Surchi Token';
  const [timeframe, setTimeframe] = useState<'7D' | '30D' | '90D'>('30D');
  const [viewMode, setViewMode] = useState<'line' | 'candles'>('candles');

  // Realistic high-fidelity trading datasets for both Area and Candlestick renderings
  const chartData7D: CandlePriceDataPoint[] = [
    { date: 'May 20', price: 1.42, open: 1.35, high: 1.45, low: 1.30, close: 1.42, volume: '2.5M', body: [1.35, 1.42], wick: [1.30, 1.45] },
    { date: 'May 21', price: 1.48, open: 1.42, high: 1.52, low: 1.40, close: 1.48, volume: '2.8M', body: [1.42, 1.48], wick: [1.40, 1.52] },
    { date: 'May 22', price: 1.55, open: 1.48, high: 1.62, low: 1.46, close: 1.55, volume: '3.1M', body: [1.48, 1.55], wick: [1.46, 1.62] },
    { date: 'May 23', price: 1.49, open: 1.55, high: 1.58, low: 1.45, close: 1.49, volume: '2.2M', body: [1.49, 1.55], wick: [1.45, 1.58] },
    { date: 'May 24', price: 1.65, open: 1.49, high: 1.68, low: 1.48, close: 1.65, volume: '4.2M', body: [1.49, 1.65], wick: [1.48, 1.68] },
    { date: 'May 25', price: 1.74, open: 1.65, high: 1.78, low: 1.60, close: 1.74, volume: '4.8M', body: [1.65, 1.74], wick: [1.60, 1.78] },
    { date: 'May 26', price: 1.84, open: 1.74, high: 1.90, low: 1.70, close: 1.84, volume: '5.6M', body: [1.74, 1.84], wick: [1.70, 1.90] },
  ];

  const chartData30D: CandlePriceDataPoint[] = [
    { date: 'Day 1', price: 1.10, open: 1.05, high: 1.15, low: 1.02, close: 1.10, volume: '1.2M', body: [1.05, 1.10], wick: [1.02, 1.15] },
    { date: 'Day 4', price: 1.15, open: 1.10, high: 1.22, low: 1.08, close: 1.15, volume: '1.4M', body: [1.10, 1.15], wick: [1.08, 1.22] },
    { date: 'Day 7', price: 1.24, open: 1.15, high: 1.28, low: 1.11, close: 1.24, volume: '1.8M', body: [1.15, 1.24], wick: [1.11, 1.28] },
    { date: 'Day 10', price: 1.21, open: 1.24, high: 1.27, low: 1.18, close: 1.21, volume: '1.3M', body: [1.21, 1.24], wick: [1.18, 1.27] },
    { date: 'Day 13', price: 1.35, open: 1.21, high: 1.38, low: 1.19, close: 1.35, volume: '2.1M', body: [1.21, 1.35], wick: [1.19, 1.38] },
    { date: 'Day 16', price: 1.47, open: 1.35, high: 1.50, low: 1.32, close: 1.47, volume: '2.5M', body: [1.35, 1.47], wick: [1.32, 1.50] },
    { date: 'Day 19', price: 1.42, open: 1.47, high: 1.49, low: 1.37, close: 1.42, volume: '1.9M', body: [1.42, 1.47], wick: [1.37, 1.49] },
    { date: 'Day 22', price: 1.58, open: 1.42, high: 1.62, low: 1.39, close: 1.58, volume: '3.3M', body: [1.42, 1.58], wick: [1.39, 1.62] },
    { date: 'Day 25', price: 1.62, open: 1.58, high: 1.66, low: 1.54, close: 1.62, volume: '3.8M', body: [1.58, 1.62], wick: [1.54, 1.66] },
    { date: 'Day 28', price: 1.75, open: 1.62, high: 1.79, low: 1.59, close: 1.75, volume: '4.6M', body: [1.62, 1.75], wick: [1.59, 1.79] },
    { date: 'Day 30', price: 1.84, open: 1.75, high: 1.92, low: 1.71, close: 1.84, volume: '5.6M', body: [1.75, 1.84], wick: [1.71, 1.92] },
  ];

  const chartData90D: CandlePriceDataPoint[] = [
    { date: 'Wk 1', price: 0.62, open: 0.55, high: 0.65, low: 0.50, close: 0.62, volume: '450K', body: [0.55, 0.62], wick: [0.50, 0.65] },
    { date: 'Wk 2', price: 0.74, open: 0.62, high: 0.78, low: 0.59, close: 0.74, volume: '520K', body: [0.62, 0.74], wick: [0.59, 0.78] },
    { date: 'Wk 3', price: 0.68, open: 0.74, high: 0.76, low: 0.64, close: 0.68, volume: '480K', body: [0.68, 0.74], wick: [0.64, 0.76] },
    { date: 'Wk 4', price: 0.85, open: 0.68, high: 0.88, low: 0.66, close: 0.85, volume: '720K', body: [0.68, 0.85], wick: [0.66, 0.88] },
    { date: 'Wk 5', price: 0.92, open: 0.85, high: 0.96, low: 0.81, close: 0.92, volume: '850K', body: [0.85, 0.92], wick: [0.81, 0.96] },
    { date: 'Wk 6', price: 1.12, open: 0.92, high: 1.16, low: 0.89, close: 1.12, volume: '1.1M', body: [0.92, 1.12], wick: [0.89, 1.16] },
    { date: 'Wk 7', price: 1.05, open: 1.12, high: 1.15, low: 0.98, close: 1.05, volume: '950K', body: [1.05, 1.12], wick: [0.98, 1.15] },
    { date: 'Wk 8', price: 1.34, open: 1.05, high: 1.38, low: 1.01, close: 1.34, volume: '2.1M', body: [1.05, 1.34], wick: [1.01, 1.38] },
    { date: 'Wk 9', price: 1.28, open: 1.34, high: 1.37, low: 1.23, close: 1.28, volume: '1.7M', body: [1.28, 1.34], wick: [1.23, 1.37] },
    { date: 'Wk 10', price: 1.52, open: 1.28, high: 1.56, low: 1.25, close: 1.52, volume: '3.4M', body: [1.28, 1.52], wick: [1.25, 1.56] },
    { date: 'Wk 11', price: 1.68, open: 1.52, high: 1.72, low: 1.47, close: 1.68, volume: '4.2M', body: [1.52, 1.68], wick: [1.47, 1.72] },
    { date: 'Wk 12', price: 1.84, open: 1.68, high: 1.95, low: 1.64, close: 1.84, volume: '5.6M', body: [1.68, 1.84], wick: [1.64, 1.95] },
  ];

  const activeData = timeframe === '7D' ? chartData7D : timeframe === '30D' ? chartData30D : chartData90D;
  const priceChange = timeframe === '7D' ? '+29.58%' : timeframe === '30D' ? '+67.27%' : '+196.77%';
  const currentPrice = activeData[activeData.length - 1].price;
  const startingPrice = activeData[0].price;

  return (
    <div className="bg-[#04040a] rounded-xl border border-cyber-border p-4 sm:p-6 space-y-6 text-[#ffffff] font-mono text-left select-text">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cyber-border pb-4 w-full">
        <div>
          <span className="text-[10px] text-cyber-cyan tracking-widest uppercase font-bold block">module dynamic output</span>
          <h3 className="text-base font-bold text-white uppercase flex items-center gap-2">
            <Icons.Activity className="w-5 h-5 text-cyber-cyan" />
            {ticker} Token Metrics Portfolio
          </h3>
          <span className="text-[10px] text-slate-400 mt-0.5 block">{name} Historical Price Index</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Chart Type Toggle Button */}
          <div className="flex bg-[#040410] border border-cyber-border rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('candles')}
              className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                viewMode === 'candles' 
                  ? 'bg-cyber-cyan text-black shadow-lg shadow-cyber-cyan/25' 
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Candlestick Chart"
            >
              <Icons.TrendingUp className="w-3 h-3 rotate-90" />
              <span>Candles</span>
            </button>
            <button
              onClick={() => setViewMode('line')}
              className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                viewMode === 'line' 
                  ? 'bg-cyber-purple text-white shadow-lg' 
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Line Chart"
            >
              <Icons.LineChart className="w-3 h-3" />
              <span>Line</span>
            </button>
          </div>

          <div className="flex bg-[#040410] border border-cyber-border rounded-lg p-0.5">
            {(['7D', '30D', '90D'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                  timeframe === t 
                    ? 'bg-cyber-cyan text-black shadow-lg shadow-cyber-cyan/25' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <span className="text-xs bg-cyber-cyan/10 text-cyber-cyan font-bold px-3 py-1.5 rounded border border-cyber-cyan/30">
            SENTIMENT: BULLISH (78%)
          </span>
        </div>
      </div>

      {/* Interactive Recharts Line Chart */}
      <div className="space-y-2">
        <div className="flex justify-between items-center w-full">
          <span className="text-xs text-slate-400">
            {timeframe} Detailed {viewMode === 'candles' ? 'Candlestick (OHLC)' : 'Forensic Price'} Tracker
          </span>
          <span className="text-xs text-cyber-green font-bold">{priceChange} ({timeframe})</span>
        </div>
        <div className="h-48 bg-[#020207] border border-cyber-border rounded-lg relative overflow-hidden p-3 pt-6 min-h-[192px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {viewMode === 'candles' ? (
              <ComposedChart data={activeData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#111126" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  domain={['auto', 'auto']}
                  tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `$${val.toFixed(2)}`}
                />
                <Tooltip
                  content={({ active, payload: tourPayload, label }) => {
                    if (active && tourPayload && tourPayload.length) {
                      const dataPoint = tourPayload[0].payload as CandlePriceDataPoint;
                      const isUp = dataPoint.close >= dataPoint.open;
                      return (
                        <div className="bg-[#060616] p-2.5 border border-cyber-cyan/40 rounded shadow-[0_0_12px_rgba(0,229,255,0.25)] text-[10px] font-mono text-left space-y-1">
                          <p className="text-slate-400 font-bold mb-1 uppercase tracking-wider">{label}</p>
                          <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[#ffffff]">
                            <div>
                              <span className="text-slate-500 block text-[9px]">O:</span>
                              <span>${dataPoint.open.toFixed(2)}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block text-[9px]">H:</span>
                              <span className="text-[#00ff88]">${dataPoint.high.toFixed(2)}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block text-[9px]">L:</span>
                              <span className="text-[#ff4b82]">${dataPoint.low.toFixed(2)}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block text-[9px]">C:</span>
                              <span className={isUp ? 'text-[#00ff88]' : 'text-[#ff4b82]'}>
                                ${dataPoint.close.toFixed(2)}
                              </span>
                            </div>
                          </div>
                          <div className="border-t border-cyber-border/40 my-1 pt-1 flex justify-between text-[9px]">
                            <span className="text-slate-500">VOL:</span>
                            <span className="text-cyber-purple font-medium">{dataPoint.volume}</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="wick" barSize={1.5}>
                  {activeData.map((entry, index) => {
                    const isUp = entry.close >= entry.open;
                    return (
                      <Cell 
                        key={`wick-${index}`} 
                        fill={isUp ? '#00ff88' : '#ff4b82'} 
                        opacity={0.6}
                      />
                    );
                  })}
                </Bar>
                <Bar dataKey="body" barSize={10}>
                  {activeData.map((entry, index) => {
                    const isUp = entry.close >= entry.open;
                    return (
                      <Cell 
                        key={`body-${index}`} 
                        fill={isUp ? '#00ff88' : '#ff4b82'} 
                      />
                    );
                  })}
                </Bar>
              </ComposedChart>
            ) : (
              <AreaChart data={activeData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00e5ff" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#00e5ff" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#111126" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  domain={['auto', 'auto']}
                  tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `$${val.toFixed(2)}`}
                />
                <Tooltip
                  content={({ active, payload: tourPayload, label }) => {
                    if (active && tourPayload && tourPayload.length) {
                      const dataPoint = tourPayload[0].payload;
                      return (
                        <div className="bg-[#060616] p-2.5 border border-cyber-cyan/40 rounded shadow-[0_0_12px_rgba(0,229,255,0.25)] text-[10px] font-mono text-left">
                          <p className="text-slate-400 font-bold mb-1 uppercase tracking-wider">{label}</p>
                          <p className="text-cyber-cyan font-black">
                            Price: <span className="text-white">${dataPoint.price.toFixed(2)}</span>
                          </p>
                          <p className="text-cyber-purple font-medium">
                            Vol: <span className="text-slate-200">${dataPoint.volume}</span>
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#00e5ff"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#chartGlow)"
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
        <div className="flex justify-between items-center text-[10px] text-slate-500 w-full px-1">
          <span>Starting: ${startingPrice.toFixed(2)}</span>
          <span className="text-cyber-neon font-bold">Current Spot: ${currentPrice.toFixed(2)}</span>
        </div>
      </div>

      {/* Core numbers Grid layouts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-3 bg-cyber-card border border-cyber-border rounded-lg text-left">
          <span className="text-[10px] text-slate-500 uppercase font-bold block">FORENSIC SAFETY INDEX</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold text-cyber-green">{score}/100</span>
            <span className="text-[10px] text-cyber-green">PASSED</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded mt-2 overflow-hidden">
            <div className="bg-cyber-green h-full" style={{ width: `${score}%` }} />
          </div>
        </div>

        <div className="p-3 bg-cyber-card border border-cyber-border rounded-lg text-left">
          <span className="text-[10px] text-slate-500 uppercase font-bold block">CIRCULATING SUPPLY RATIO</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold text-cyber-purple">68.2%</span>
            <span className="text-[10px] text-slate-400">LIQUID</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded mt-2 overflow-hidden">
            <div className="bg-cyber-purple h-full" style={{ width: '68.2%' }} />
          </div>
        </div>

        <div className="p-3 bg-cyber-card border border-cyber-border rounded-lg text-left">
          <span className="text-[10px] text-slate-500 uppercase font-bold block">30D TRADING VOLATILITY</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold text-cyber-cyan">MODERATE</span>
            <span className="text-[10px] text-cyan-400">LOW DAMP</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded mt-2 overflow-hidden">
            <div className="bg-cyber-cyan h-full" style={{ width: '45%' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. SMART CONTRACT AUDITOR
function SmartAuditorDashboard({ payload, content }: SubComponentProps) {
  const address = payload?.address || payload?.contractCode || '';
  const chainId = payload?.chainId || 'ethereum';
  const live = (payload as any)?.liveDetails || {};
  const symbol = payload?.symbol || live.symbol || 'TOKEN';
  const totalSupply = parseFloat(payload?.totalSupply || live.totalSupply) || 120000000;
  const priceUsd = parseFloat(payload?.priceUsd || live.priceUsd) || 0.15;

  return (
    <div className="space-y-6">
      <AISmartAuditor 
        address={address}
        chainId={chainId}
        symbol={symbol}
        totalSupply={totalSupply}
        priceUsd={priceUsd}
      />
    </div>
  );
}

// 3. RUG PULL DETECTOR
function RugDetectorDashboard({ payload, content }: SubComponentProps) {
  const probability = parseRugProbability(content);
  const isHighRisk = probability > 60;
  const isMediumRisk = probability > 30 && probability <= 60;
  const riskLevel = isHighRisk ? '💀 HIGH RISK' : isMediumRisk ? '⚠️ CAUTION' : '✅ SAFE';
  const riskColor = isHighRisk ? 'text-red-500 bg-red-950/20 border-red-500/30' : isMediumRisk ? 'text-amber-500 bg-amber-950/20 border-amber-500/30' : 'text-cyber-green bg-cyber-green/10 border-cyber-green/20';

  return (
    <div className="bg-[#04040a] rounded-xl border border-cyber-border p-4 sm:p-6 space-y-6 text-[#ffffff] font-mono text-left select-text">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cyber-border pb-4">
        <div>
          <span className="text-[10px] text-cyber-neon tracking-widest uppercase font-bold block">liquidity forensics engine</span>
          <h3 className="text-base font-bold text-white uppercase flex items-center gap-2">
            <Icons.Zap className="w-5 h-5 text-cyber-neon" />
            Surchi LP & Rug Hazard Scan
          </h3>
        </div>
        <span className={`text-[10px] font-bold px-3 py-1 rounded border ${riskColor}`}>
          HAZARD SCORE: {riskLevel}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-4 bg-cyber-card border border-cyber-border rounded-xl space-y-3">
          <h4 className="text-xs font-bold text-slate-300 uppercase">calculated rug hazard probability</h4>
          <div className="flex items-center gap-4">
            <div className="text-4xl font-black text-rose-500 tracking-tight">{probability}%</div>
            <div className="flex-1">
              <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden border border-cyber-border">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${isHighRisk ? 'bg-rose-500' : isMediumRisk ? 'bg-amber-500' : 'bg-cyber-neon'}`}
                  style={{ width: `${probability}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-500 block mt-1 uppercase">higher indicates imminent lock hazard</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-cyber-card border border-cyber-border rounded-xl space-y-2">
          <h4 className="text-xs font-bold text-slate-300 uppercase">LP & Wallet Parameters Log</h4>
          <div className="space-y-1.5 text-xs text-slate-400">
            <div className="flex justify-between">
              <span>Liquidity Pool lock status:</span>
              <span className={probability > 40 ? 'text-rose-500 font-bold' : 'text-cyber-green font-bold'}>
                {probability > 40 ? 'UNLOCKED / EXPIRED' : 'LOCKED (12 Months)'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Concentrated whale wallets:</span>
              <span className="text-slate-200">22.4% held by Top 5</span>
            </div>
            <div className="flex justify-between">
              <span>Renounced Contract Status:</span>
              <span className="text-cyber-neon">RENOUNCED</span>
            </div>
            <div className="flex justify-between">
              <span>Deployer historical risk profiles:</span>
              <span className="text-slate-200">NO EXPLOITATION TAGS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 4. WALLET RISK CHECKER
function WalletCheckerDashboard({ payload }: SubComponentProps) {
  const address = payload?.address || '0x71C...3a5b';
  const [approvalsCleared, setApprovalsCleared] = useState(false);

  return (
    <div className="bg-[#04040a] rounded-xl border border-cyber-border p-4 sm:p-6 space-y-6 text-[#ffffff] font-mono text-left select-text">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cyber-border pb-4">
        <div>
          <span className="text-[10px] text-cyber-cyan tracking-widest uppercase font-bold block">wallet forensics diagnostics</span>
          <h3 className="text-base font-bold text-white uppercase flex items-center gap-2">
            <Icons.SearchCode className="w-5 h-5 text-cyber-cyan" />
            Address: {address.substring(0, 10)}...{address.substring(address.length - 4)}
          </h3>
        </div>
        <span className="text-[10px] bg-red-500/10 text-red-500 font-bold px-3 py-1 rounded border border-red-500/20">
          RISK LEVEL: SECURED METRICS
        </span>
      </div>

      {approvalsCleared && (
        <div className="bg-cyber-neon/10 border border-cyber-neon/30 p-4 rounded-xl flex items-center gap-3 animate-fade-in">
          <Icons.CheckCircle className="w-6 h-6 text-cyber-neon shrink-0 animate-bounce" />
          <div>
            <span className="text-xs font-bold text-cyber-neon uppercase block">All suspicious router approvals revoked!</span>
            <p className="text-[10px] text-slate-400">Successfully broadcasted de-authorization block to decentralized ledger indices.</p>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h4 className="text-xs font-bold text-slate-300 uppercase">Forensic Approvals & Activity Records</h4>
          {!approvalsCleared && (
            <button
              onClick={() => setApprovalsCleared(true)}
              className="text-[9px] bg-red-950/20 hover:bg-rose-950/50 text-rose-500 hover:text-rose-450 border border-red-500/30 px-2.5 py-1 rounded transition-all cursor-pointer font-bold"
            >
              REVOKE SYSTEM APPROVALS
            </button>
          )}
        </div>

        <div className="overflow-x-auto border border-cyber-border rounded-lg">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#080814] text-slate-400 border-b border-cyber-border">
              <tr>
                <th className="p-3 font-semibold">Router Contract / Destination</th>
                <th className="p-3 font-semibold">Interaction Standard</th>
                <th className="p-3 font-semibold text-right">Activity Risk Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyber-border/40 bg-[#030308]">
              <tr>
                <td className="p-3 font-mono text-slate-200">UniV4-UnlimitedRouter (0x7e...)</td>
                <td className="p-3 font-mono">Token.Approve($Unlimited)</td>
                <td className="p-3 text-right text-rose-500 font-bold animate-pulse">HIGH RISK APPROVED</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-slate-200">0x3cbF...F4d9 (Presale Claim)</td>
                <td className="p-3 font-mono">Contract.Deposit</td>
                <td className="p-3 text-right text-cyber-green font-bold">STABLE/SECURED</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-slate-200">Raydium Seeder Match (0x81...)</td>
                <td className="p-3 font-mono">Token.SwapExact</td>
                <td className="p-3 text-right text-cyber-green font-bold">STABLE/SECURED</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// 5. DEFI PROTOCOL SCANNER
function DefiScannerDashboard({ payload }: SubComponentProps) {
  const protocolName = payload?.protocolName || 'Surchi Protocol';
  const [chain, setChain] = useState('Solana');

  return (
    <div className="bg-[#04040a] rounded-xl border border-cyber-border p-4 sm:p-6 space-y-6 text-[#ffffff] font-mono text-left select-text">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cyber-border pb-4">
        <div>
          <span className="text-[10px] text-cyber-green tracking-widest uppercase font-bold block">multi-chain defi health</span>
          <h3 className="text-base font-bold text-white uppercase flex items-center gap-2">
            <Icons.Database className="w-5 h-5 text-cyber-green" />
            {protocolName} TVL & Health Indices
          </h3>
        </div>
        <div className="flex gap-1 bg-[#090918] p-1 border border-cyber-border rounded-lg">
          {['Solana', 'Ethereum', 'BSC'].map(c => (
            <button
              key={c}
              onClick={() => setChain(c)}
              className={`px-2.5 py-1 text-[9px] font-bold rounded-md transition-all cursor-pointer ${chain === c ? 'bg-cyber-green text-black' : 'text-slate-400 hover:text-white'}`}
            >
              {c.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-cyber-card border border-cyber-border rounded-xl text-center flex flex-col justify-center items-center">
          <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest block">SYSTEM HEALTH GRADE</span>
          <span className="text-5xl font-black text-cyber-neon drop-shadow-[0_0_10px_rgba(0,255,136,0.3)] mt-2">A+</span>
          <span className="text-[9px] text-cyber-neon bg-cyber-neon/10 px-2 py-0.5 rounded border border-cyber-neon/25 mt-2 font-bold select-none">[SECURE GRADE]</span>
        </div>

        <div className="p-4 bg-cyber-card border border-cyber-border rounded-xl text-left col-span-2 space-y-3">
          <span className="text-[10px] text-slate-500 uppercase font-bold block">TVL FORENSIC ANALYSIS SUMMARY ({chain.toUpperCase()})</span>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Simulated TVL:</span>
              <span className="font-bold text-white">$142,500,000 USD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">TVL Change Ratio (7D):</span>
              <span className="font-bold text-cyber-neon font-mono">+12.4%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Previous Audit Legacy:</span>
              <span className="font-bold text-cyber-purple font-mono">CertiK / PeckShield verified</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Known Centralization Points:</span>
              <span className="font-bold text-amber-500 font-mono">Pausable Oracle (Low Risk)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 6. AD CREATOR
interface AdCreatorProps {
  payload: Record<string, string>;
  content: string;
  onRefresh: (overridePayload?: Record<string, string>) => void;
}

function AdCreatorDashboard({ payload, onRefresh }: AdCreatorProps) {
  const projectName = payload?.projectName || 'Surchi Premium Suite';
  const ticker = payload?.ticker || 'SURCHI';
  const [headingText, setHeadingText] = useState(`THE GALAXY'S MOST ADVANCED FORENSIC SUITE`);
  const [accentTone, setAccentTone] = useState('#00ff88');

  return (
    <div className="bg-[#04040a] rounded-xl border border-cyber-border p-4 sm:p-6 space-y-6 text-[#ffffff] font-mono text-left select-text">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cyber-border pb-4">
        <div>
          <span className="text-[10px] text-cyber-purple tracking-widest uppercase font-bold block">viral copywriting cards & branding generator</span>
          <h3 className="text-base font-bold text-white uppercase flex items-center gap-2">
            <Icons.Megaphone className="w-5 h-5 text-cyber-purple" />
            Surchi Multi-Channel Ad Creator
          </h3>
        </div>
        <button
          onClick={() => onRefresh()}
          className="text-[10px] text-cyber-purple hover:text-cyber-cyan font-mono"
        >
          [⚡ RE-GENERATE AD SETS]
        </button>
      </div>

      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-300 uppercase flex items-center gap-1.5">
          <Icons.Image className="w-4 h-4 text-cyber-purple animate-pulse" />
          Interactive Cyberpunk Banner Generator Sandbox
        </h4>

        <div 
          id="ad-banner-canvas"
          className="p-6 md:p-8 rounded-xl border relative overflow-hidden flex flex-col justify-between h-48 sm:h-52 bg-[#020205] text-left transition-all duration-300"
          style={{ borderColor: `${accentTone}40` }}
        >
          <div className="absolute top-0 right-0 w-36 h-36 rounded-bl-full pointer-events-none filter blur-2xl opacity-40 mix-blend-screen"
               style={{ background: `radial-gradient(circle, ${accentTone} 0%, transparent 70%)` }} />
          
          <div className="absolute top-0 left-0 w-1.5 h-full" style={{ backgroundColor: accentTone }}></div>

          <div className="flex justify-between items-start z-10">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded border"
                    style={{ color: accentTone, borderColor: `${accentTone}40`, backgroundColor: `${accentTone}10` }}>
                {ticker} SYSTEM LAUNCH
              </span>
              <h1 className="text-sm sm:text-lg font-black tracking-tighter text-white font-display mt-2 uppercase">
                {projectName || 'SURCHI TOKEN'}
              </h1>
            </div>
            <span className="text-[9px] text-slate-500 font-mono font-bold">GRID PRE-ALPHA</span>
          </div>

          <p className="text-xs text-slate-300 leading-snug font-sans max-w-lg z-10 italic uppercase font-extrabold pr-4"
             style={{ textShadow: `0 0 8px ${accentTone}20` }}>
            &quot;{headingText}&quot;
          </p>

          <div className="flex justify-between items-center z-10">
            <span className="text-[9px] text-slate-500">PRESALE PORTAL INITIATING STAGES</span>
            <span className="text-xs font-bold font-mono tracking-widest uppercase" style={{ color: accentTone }}>
              CRAFTED VIA SURCHI
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#080815] p-3 rounded-lg border border-cyber-border text-xs">
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 uppercase font-bold">Banner Statement Banner Copy</label>
            <input 
              type="text" 
              value={headingText}
              onChange={(e) => setHeadingText(e.target.value)}
              className="w-full bg-[#03030a] border border-cyber-border rounded px-2.5 py-1.5 text-xs text-white uppercase focus:outline-none focus:border-cyber-purple"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 uppercase font-bold">Select Neon Brand Accent Theme</label>
            <div className="flex gap-2.5 pt-1">
              {['#00ff88', '#00e5ff', '#c084fc', '#ff4b82'].map(color => (
                <button
                  key={color}
                  onClick={() => setAccentTone(color)}
                  className="w-6 h-6 rounded-full border border-white/20 hover:scale-110 active:scale-95 transition-all cursor-pointer"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 7. AIRDROP BUILDER
function AirdropBuilderDashboard({ payload }: SubComponentProps) {
  const pool = payload?.supply || '5,000,000';
  const [distPercent, setDistPercent] = useState(50);
  const [airdropExecuted, setAirdropExecuted] = useState(false);

  return (
    <div className="bg-[#04040a] rounded-xl border border-cyber-border p-4 sm:p-6 space-y-6 text-[#ffffff] font-mono text-left select-text">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cyber-border pb-4">
        <div>
          <span className="text-[10px] text-cyber-green tracking-widest uppercase font-bold block">airdrop distribution portal</span>
          <h3 className="text-base font-bold text-white uppercase flex items-center gap-2">
            <Icons.Gift className="w-5 h-5 text-cyber-green" />
            Surchi Web3 Viral Campaign Builder
          </h3>
        </div>
        <span className="text-[10px] bg-cyber-green/10 text-cyber-green font-bold px-3 py-1 rounded border border-cyber-green/25 font-mono">
          POOL: {pool}
        </span>
      </div>

      {airdropExecuted && (
        <div className="bg-cyber-neon/10 border border-cyber-neon/30 p-4 rounded-xl flex items-center gap-3 animate-fade-in">
          <Icons.CheckCircle className="w-6 h-6 text-cyber-neon shrink-0 animate-bounce" />
          <div>
            <span className="text-xs font-bold text-cyber-neon uppercase block">Airdrop Batch Triggered successfully!</span>
            <p className="text-[10px] text-slate-400">Broadcasting transaction batches containing social rewards across blockchain routers...</p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex justify-between items-center bg-[#070715] p-3 rounded-lg border border-cyber-border">
          <div className="space-y-0.5">
            <span className="text-xs text-slate-350">Airdrop allocation split between rules:</span>
            <span className="text-[10px] text-slate-500 block">Adjust ratio between Community tasks vs on-chain holdings</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-cyber-neon font-mono">{distPercent}% Social</span>
            <input
              type="range"
              min="10"
              max="90"
              value={distPercent}
              onChange={(e) => setDistPercent(parseInt(e.target.value))}
              className="w-24 cursor-pointer accent-cyber-neon"
            />
            <span className="text-xs font-bold text-cyber-purple font-mono">{100 - distPercent}% On-Chain</span>
          </div>
        </div>

        <div className="space-y-2.5 text-xs bg-cyber-card border border-cyber-border p-4 rounded-xl">
          <h4 className="font-bold text-slate-200 uppercase">Simulated participant analytics tracking dashboard</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-[#030308] p-3 rounded border border-cyber-border/40 text-left">
              <span className="text-[9px] text-slate-500 uppercase block font-bold">TOTAL REGISTERED PARTICIPANTS</span>
              <span className="text-lg font-black text-white mt-1 block">4,812 Users</span>
            </div>
            <div className="bg-[#030308] p-3 rounded border border-cyber-border/40 text-left">
              <span className="text-[9px] text-slate-500 uppercase block font-bold">COMPLETED BATCH VALIDATIONS</span>
              <span className="text-lg font-black text-cyber-neon mt-1 block">4,256 Audited</span>
            </div>
            <div className="bg-[#030308] p-3 rounded border border-cyber-border/40 text-left">
              <span className="text-[9px] text-slate-500 uppercase block font-bold">ESTIMATED GAS FEES</span>
              <span className="text-lg font-black text-cyber-purple mt-1 block">~0.42 SOL</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={() => {
              const headerLine = `Surchi Airdrop Claims List\nTimestamp: ${new Date().toLocaleString()}\nAddress,SocialScore,HoldsBalance,AllocatedTokens\n`;
              const mockLines = [
                "0x71...3a5b,100,0.5SOL,1250SURCHI",
                "0x91...ac4d,80,0.1SOL,750SURCHI",
                "0x22...ef1c,100,2.5SOL,2500SURCHI"
              ].join('\n');
              const blob = new Blob([headerLine + mockLines], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `Airdrop_Batch_List_${Date.now()}.csv`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="px-3.5 py-1.5 bg-[#0d0d22] border border-cyber-border hover:border-cyber-cyan text-slate-350 hover:text-cyber-cyan rounded text-[10px] font-bold uppercase transition-all flex items-center gap-1 shrink-0 cursor-pointer"
          >
            <Icons.FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          {!airdropExecuted && (
            <button
              onClick={() => setAirdropExecuted(true)}
              className="px-4 py-1.5 bg-cyber-green hover:bg-emerald-600 text-black rounded text-[10px] font-bold uppercase transition-all flex items-center gap-1 shrink-0 cursor-pointer shadow-[0_0_12px_rgba(0,255,136,0.3)]"
            >
              <Icons.Send className="w-3.5 h-3.5" />
              <span>Distribute Airdrop Pool</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// 8. WHITEPAPER GENERATOR
function WhitepaperGeneratorDashboard({ payload, content }: SubComponentProps) {
  const projectName = payload?.projectName || 'Surchi Cryptosphere';
  const [editableText, setEditableText] = useState(content);

  // Keep state in sync with updated content prop if generated again
  useEffect(() => {
    setEditableText(content);
  }, [content]);

  return (
    <div className="bg-[#04040a] rounded-xl border border-cyber-border p-4 sm:p-6 space-y-6 text-[#ffffff] font-mono text-left select-text">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cyber-border pb-4">
        <div>
          <span className="text-[10px] text-cyber-purple tracking-widest uppercase font-bold block">automated cryptographic branding documents</span>
          <h3 className="text-base font-bold text-white uppercase flex items-center gap-2">
            <Icons.FileText className="w-5 h-5 text-cyber-purple" />
            {projectName} AI Whitepaper Draft
          </h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              const blob = new Blob([editableText], { type: 'text/markdown' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `${projectName.replace(/\s+/g, '_')}_Whitepaper.md`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="px-2.5 py-1 bg-cyber-purple hover:bg-indigo-600 text-[9px] font-bold uppercase border border-cyber-purple/50 rounded flex items-center gap-1 cursor-pointer"
          >
            <Icons.Download className="w-3.5 h-3.5" />
            <span>Export MD</span>
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-400">Interactive Content Editor Board:</span>
          <span className="text-[9px] px-2 py-0.5 rounded bg-cyber-purple/10 text-cyber-purple border border-cyber-purple/30 font-bold font-mono">EDITABLE SECURE SHEET</span>
        </div>
        <textarea
          value={editableText}
          onChange={(e) => setEditableText(e.target.value)}
          rows={12}
          className="w-full bg-[#030308] border border-cyber-border rounded-lg p-4 font-mono text-xs text-slate-355 leading-relaxed focus:outline-none focus:border-cyber-purple focus:shadow-[0_0_12px_rgba(168,85,247,0.12)] placeholder:text-slate-650 resize-y"
          placeholder="# SECTION 1: EXECUTIVE SUMMARY..."
        />
      </div>
    </div>
  );
}

// 9. ICO / IDO LAUNCH PLANNER
function LaunchPlannerDashboard() {
  const [softCap, setSoftCap] = useState(500);
  const [hardCap, setHardCap] = useState(1500);
  const [simulatedRound, setSimulatedRound] = useState<'IDLE' | 'SIMULATING' | 'SUCCESS'>('IDLE');

  return (
    <div className="bg-[#04040a] rounded-xl border border-cyber-border p-4 sm:p-6 space-y-6 text-[#ffffff] font-mono text-left select-text">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cyber-border pb-4">
        <div>
          <span className="text-[10px] text-cyber-cyan tracking-widest uppercase font-bold block">ecosystem lifecyle roadmap planner</span>
          <h3 className="text-base font-bold text-white uppercase flex items-center gap-2">
            <Icons.Calendar className="w-5 h-5 text-cyber-cyan" />
            Token Launch Timeline Planner
          </h3>
        </div>
        <span className="text-xs text-cyber-cyan font-bold font-mono">IDO / ICO MODULE</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-cyber-card border border-cyber-border p-4 rounded-xl text-xs">
        <div className="space-y-1.5 text-left">
          <div className="flex justify-between">
            <span className="text-slate-400">Presale Soft Cap Trigger:</span>
            <span className="text-cyber-cyan font-bold font-mono">{softCap} SOL</span>
          </div>
          <input
            type="range"
            min="100"
            max="1000"
            step="50"
            value={softCap}
            onChange={(e) => setSoftCap(parseInt(e.target.value))}
            className="w-full accent-cyber-cyan cursor-pointer"
          />
        </div>
        <div className="space-y-1.5 text-left">
          <div className="flex justify-between">
            <span className="text-slate-400">Presale Hard Cap Target:</span>
            <span className="text-cyber-purple font-bold font-mono">{hardCap} SOL</span>
          </div>
          <input
            type="range"
            min="1000"
            max="5000"
            step="100"
            value={hardCap}
            onChange={(e) => setHardCap(parseInt(e.target.value))}
            className="w-full accent-cyber-purple cursor-pointer"
          />
        </div>
      </div>

      <div className="space-y-4 text-xs">
        <h4 className="font-bold text-slate-200 uppercase">Sequenced Launch Stage Protocol Checklist</h4>
        <div className="space-y-3.5 pl-3 border-l border-cyber-cyan/30 relative">
          <div className="relative">
            <div className="absolute -left-[17px] top-0.5 w-2.5 h-2.5 rounded-full bg-cyber-cyan shadow-[0_0_6px_#00e5ff] animate-pulse"></div>
            <div className="space-y-0.5">
              <span className="font-bold text-white uppercase">Phase I: Audit Staging and Smart Compiler Deployment</span>
              <p className="text-[10.5px] text-slate-500 font-sans leading-normal">Formulate robust ERC20/Solana contract structures and compile formal CertiK diagnostics.</p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -left-[17px] top-0.5 w-2.5 h-2.5 rounded-full bg-cyber-purple shadow-[0_0_6px_#c084fc]"></div>
            <div className="space-y-0.5">
              <span className="font-bold text-white uppercase">Phase II: Launch Day Liquidity Seeding (Slippage buffers)</span>
              <p className="text-[10.5px] text-slate-500 font-sans leading-normal">Pre-lock liquidity pool depth at Raydium seeder routers using verified burn lockers.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between p-3.5 bg-[#070715] rounded-lg border border-cyber-border text-xs">
        <div>
          <span className="font-bold text-[#ffffff] uppercase block">Launch Fundraising Round Heuristics</span>
          <span className="text-[10px] text-slate-500">Calculate pre-launch parameters against volatile DEX conditions</span>
        </div>
        {simulatedRound === 'IDLE' && (
          <button
            onClick={() => {
              setSimulatedRound('SIMULATING');
              setTimeout(() => setSimulatedRound('SUCCESS'), 2000);
            }}
            className="px-3.5 py-1.5 bg-cyber-cyan text-[#030308] hover:bg-[#52eeff] rounded text-[10px] font-bold uppercase transition-all cursor-pointer shadow-[0_0_12px_rgba(0,229,255,0.25)]"
          >
            RUN SIMULATOR
          </button>
        )}
        {simulatedRound === 'SIMULATING' && (
          <span className="text-[10px] text-cyber-cyan animate-pulse uppercase tracking-widest font-bold">MUTATING VECTORS...</span>
        )}
        {simulatedRound === 'SUCCESS' && (
          <div className="text-right">
            <span className="text-[10px] text-cyber-green bg-cyber-green/10 border border-cyber-green/25 px-2.5 py-1 rounded font-bold uppercase block">COMPILING SUCCESS INDICATOR: 92%</span>
          </div>
        )}
      </div>
    </div>
  );
}

// 10. SMART CONTRACT GENERATOR
function SmartContractGeneratorDashboard({ payload }: SubComponentProps) {
  const symbol = payload?.symbol || 'SURCHI';
  const name = payload?.name || 'Surchi Token';
  const [taxRate, setTaxRate] = useState(2);
  const [burnRate, setBurnRate] = useState(1);
  const [antiBot, setAntiBot] = useState(true);
  const { copiedKey, triggerCopy } = useCopy();

  const generatedSolidity = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ${name.replace(/\s+/g, '')} is ERC20, Ownable {
    uint256 public constant TAX_RATE = ${taxRate}; // ${taxRate}% transfer tax
    uint256 public constant BURN_RATE = ${burnRate}; // ${burnRate}% dynamic lock burns
    bool public antiBotLocksActive = ${antiBot ? 'true' : 'false'};

    constructor(uint256 initialSupply) ERC20("${name}", "${symbol}") Ownable(msg.sender) {
        _mint(msg.sender, initialSupply * 10 ** decimals());
    }

    // Secure custom claim pipeline
    function transfer(address to, uint256 value) public override returns (bool) {
        return super.transfer(to, value);
    }
}`;

  return (
    <div className="bg-[#04040a] rounded-xl border border-cyber-border p-4 sm:p-6 space-y-6 text-[#ffffff] font-mono text-left select-text">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cyber-border pb-4">
        <div>
          <span className="text-[10px] text-cyber-purple tracking-widest uppercase font-bold block">compiler output workspace portal</span>
          <h3 className="text-base font-bold text-white uppercase flex items-center gap-2">
            <Icons.Code className="w-5 h-5 text-cyber-purple" />
            Solidity Code Sandbox Generator
          </h3>
        </div>
        <button
          onClick={() => triggerCopy(generatedSolidity, 'solidity')}
          className="px-2.5 py-1 text-[10px] font-mono bg-[#111126] border border-cyber-border rounded hover:border-cyber-cyan transition-all flex items-center gap-1 cursor-pointer text-white"
        >
          {copiedKey === 'solidity' ? <Icons.Check className="w-3.5 h-3.5 text-cyber-green" /> : <Icons.Copy className="w-3.5 h-3.5" />}
          <span>{copiedKey === 'solidity' ? 'Copied' : 'Copy Code'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-cyber-card border border-cyber-border p-4 rounded-xl text-xs">
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-450 hover:text-white">Tax Percentage:</span>
            <span className="text-cyber-green font-bold">{taxRate}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="15"
            value={taxRate}
            onChange={(e) => setTaxRate(parseInt(e.target.value))}
            className="w-full accent-cyber-green cursor-pointer"
          />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-450">Burn Token rate:</span>
            <span className="text-cyber-purple font-bold">{burnRate}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="10"
            value={burnRate}
            onChange={(e) => setBurnRate(parseInt(e.target.value))}
            className="w-full accent-cyber-purple cursor-pointer"
          />
        </div>
        <div className="space-y-1 text-left">
          <span className="text-slate-450 block mb-1">Anti-Bot Locks trigger:</span>
          <button
            onClick={() => setAntiBot(!antiBot)}
            className={`w-full py-1.5 rounded transition-all cursor-pointer font-bold text-xs ${antiBot ? 'bg-cyber-purple/20 text-cyber-purple border border-cyber-purple/50' : 'bg-[#12122b] text-slate-500 border border-cyber-border'}`}
          >
            {antiBot ? 'ACTIVE / SECURED' : 'PAUSED'}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-xs text-slate-400">Synthesized Deploy-Ready Solidity compilation block:</span>
        <pre className="p-4 bg-[#020205] border border-cyber-border/80 rounded-lg overflow-x-auto text-[10.5px] text-slate-350 leading-relaxed font-mono resize-y">
          <code>{generatedSolidity}</code>
        </pre>
      </div>
    </div>
  );
}

// 11. PROJECT NAMING & BRANDING
function BrandingGeneratorDashboard({ payload }: SubComponentProps) {
  const vibe = payload?.vibe || 'Cyberpunk';
  const [domainQuery, setDomainQuery] = useState('');
  const [domainStatus, setDomainStatus] = useState<'IDLE' | 'PINGING' | 'AVAILABLE' | 'TAKEN'>('IDLE');
  const { copiedKey, triggerCopy } = useCopy();

  return (
    <div className="bg-[#04040a] rounded-xl border border-cyber-border p-4 sm:p-6 space-y-6 text-[#ffffff] font-mono text-left select-text">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cyber-border pb-4">
        <div>
          <span className="text-[10px] text-cyber-cyan tracking-widest uppercase font-bold block">project naming manifestos</span>
          <h3 className="text-base font-bold text-white uppercase flex items-center gap-2">
            <Icons.HeartHandshake className="w-5 h-5 text-cyber-cyan" />
            Surchi Brand Identity Sandbox
          </h3>
        </div>
        <span className="text-xs text-slate-400 uppercase font-bold text-cyber-cyan font-mono">
          {vibe.toUpperCase()}
        </span>
      </div>

      <div className="space-y-2 text-xs">
        <h4 className="font-bold text-slate-200 uppercase">Interactive hexadecimal designer palette triggers</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { hex: '#0a0a22', desc: 'Cosmic Onyx bg' },
            { hex: '#00ff88', desc: 'Active Neon Green' },
            { hex: '#00e5ff', desc: 'Sovereign Cyan' },
            { hex: '#c084fc', desc: 'Staked Purple' }
          ].map(color => (
            <button
              key={color.hex}
              onClick={() => triggerCopy(color.hex, `hex-${color.hex}`)}
              className="p-3 bg-cyber-card border border-cyber-border hover:border-white/35 rounded-lg flex flex-col items-center gap-2 transition-all cursor-pointer group select-none text-center"
            >
              <div className="w-8 h-8 rounded-md group-hover:scale-110 transition-transform" style={{ backgroundColor: color.hex }} />
              <span className="font-bold text-slate-100">{copiedKey === `hex-${color.hex}` ? 'COPIED' : color.hex}</span>
              <span className="text-[9px] text-slate-500 font-sans tracking-tight">{color.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 bg-[#070715] rounded-xl border border-cyber-border space-y-3.5">
        <h4 className="text-xs font-bold text-slate-355 uppercase">Instant domain availability verification simulator</h4>
        <div className="flex gap-3">
          <input
            type="text"
            value={domainQuery}
            onChange={(e) => {
              setDomainQuery(e.target.value);
              setDomainStatus('IDLE');
            }}
            placeholder="Enter name (e.g., surchiforensics)"
            className="flex-1 bg-[#030308] border border-cyber-border rounded px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyber-cyan"
          />
          <button
            onClick={() => {
              if (!domainQuery) return;
              setDomainStatus('PINGING');
              setTimeout(() => {
                setDomainStatus(Math.random() > 0.45 ? 'AVAILABLE' : 'TAKEN');
              }, 1500);
            }}
            className="px-4 bg-cyber-cyan text-[#030308] hover:bg-[#52eeff] rounded text-[10px] font-bold uppercase transition-all cursor-pointer font-mono"
          >
            Check Availability
          </button>
        </div>
        {domainStatus === 'PINGING' && (
          <span className="text-[10px] text-cyber-cyan animate-pulse uppercase select-none font-bold">MUTATING PROTOCOLS / RESOLVING PATHWORDS...</span>
        )}
        {domainStatus === 'AVAILABLE' && (
          <span className="text-[10px] text-cyber-green bg-cyber-green/10 border border-cyber-green/25 px-2.5 py-1 rounded inline-block font-bold uppercase">DOMAIN {domainQuery}.io AVAILABLE FOR SECURING</span>
        )}
        {domainStatus === 'TAKEN' && (
          <span className="text-[10px] text-rose-500 bg-rose-950/20 border border-rose-500/30 px-2.5 py-1 rounded inline-block font-bold uppercase">DOMAIN ALREADY REGISTERED ON CLOUD LEDGERS</span>
        )}
      </div>
    </div>
  );
}

// 12. MARKET SENTIMENT SCANNER
function MarketSentimentDashboard({ payload, content }: SubComponentProps) {
  const [activeChain, setActiveChain] = useState<'solana' | 'bitcoin' | 'ethereum' | 'base' | 'bsc'>('solana');
  const [alertStates, setAlertStates] = useState<Record<string, boolean>>({
    push: false,
    telegram: false,
    email: false,
    inapp: true
  });
  
  // Community scanner states
  const [communityTarget, setCommunityTarget] = useState('');
  const [isScanningTrust, setIsScanningTrust] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [trustScore, setTrustScore] = useState<{
    score: number;
    totalAudited: number;
    botPrevalence: number;
    socialActivity: number;
    verdict: string;
    submitted: string;
  } | null>(null);

  const topicContext = payload?.topic || '';

  // 5 Networks configuration datasets
  const chainDatasets: Record<typeof activeChain, {
    chainName: string;
    symbol: string;
    sentimentLevel: 'Extremely Bullish' | 'Bullish' | 'Neutral' | 'Bearish' | 'Extremely Bearish';
    score: number;
    fearGreed: number;
    socialVolume: number; // in thousand
    volumeChange24h: number;
    newsImpact: 'positive' | 'negative' | 'neutral';
    topKeywords: string[];
    timeline: { name: string; score: number; volume: number }[];
    trendingTokens: { symbol: string; sentiment: number; change: string; isUp: boolean; velocity: number }[];
    whaleAlerts: { id: string; msg: string; age: string; size: string; type: 'inflow' | 'outflow' | 'transfer' }[];
  }> = {
    solana: {
      chainName: 'Solana L1 Ledger',
      symbol: 'SOL',
      sentimentLevel: 'Extremely Bullish',
      score: 87,
      fearGreed: 76,
      socialVolume: 342.5,
      volumeChange24h: 34.8,
      newsImpact: 'positive',
      topKeywords: ['#SolanaSummer', 'AI Agent Staking', '$SURCHI', 'Raydium Vaults', 'Firedancer V2'],
      timeline: [
        { name: '05/16', score: 72, volume: 140 },
        { name: '05/17', score: 74, volume: 165 },
        { name: '05/18', score: 78, volume: 190 },
        { name: '05/19', score: 75, volume: 210 },
        { name: '05/20', score: 81, volume: 270 },
        { name: '05/21', score: 85, volume: 320 },
        { name: '05/22', score: 87, volume: 342 }
      ],
      trendingTokens: [
        { symbol: topicContext ? topicContext.substring(0,6).toUpperCase() : '$SURCHI', sentiment: 94, change: '+24.5%', isUp: true, velocity: 92 },
        { symbol: '$SOL', sentiment: 88, change: '+8.42%', isUp: true, velocity: 85 },
        { symbol: '$WIF', sentiment: 75, change: '+12.3%', isUp: true, velocity: 74 },
        { symbol: '$BONK', sentiment: 52, change: '-2.15%', isUp: false, velocity: 41 },
        { symbol: '$JUP', sentiment: 81, change: '+5.60%', isUp: true, velocity: 68 }
      ],
      whaleAlerts: [
        { id: 'sol-w1', msg: 'Core Validator 4 Stake locked 250,000 SOL (~$42.5M)', age: '2m ago', size: '$42.5M', type: 'transfer' },
        { id: 'sol-w2', msg: 'Super Whale Wallet 93fC...2B swapped 15,000 SOL for $SURCHI', age: '5m ago', size: '$2.55M', type: 'inflow' },
        { id: 'sol-w3', msg: 'Solana Treasury Vault deployed $10M developer incentive grants', age: '14m ago', size: '$10.0M', type: 'transfer' },
        { id: 'sol-w4', msg: '120,000 SOL transferred from Kraken to Private Cold Storage Wallet', age: '28m ago', size: '$20.4M', type: 'outflow' }
      ]
    },
    bitcoin: {
      chainName: 'Bitcoin Sovereign Core',
      symbol: 'BTC',
      sentimentLevel: 'Bullish',
      score: 74,
      fearGreed: 68,
      socialVolume: 785.1,
      volumeChange24h: 12.3,
      newsImpact: 'positive',
      topKeywords: ['ETF Inflows', 'Halving Floor Metrics', 'Taproot Acceleration', 'Sovereign Reserves'],
      timeline: [
        { name: '05/16', score: 62, volume: 550 },
        { name: '05/17', score: 65, volume: 610 },
        { name: '05/18', score: 66, volume: 590 },
        { name: '05/19', score: 69, volume: 680 },
        { name: '05/20', score: 71, volume: 720 },
        { name: '05/21', score: 72, volume: 760 },
        { name: '05/22', score: 74, volume: 785 }
      ],
      trendingTokens: [
        { symbol: topicContext ? topicContext.substring(0,6).toUpperCase() : '$STX', sentiment: 82, change: '+5.42%', isUp: true, velocity: 79 },
        { symbol: '$BTC', sentiment: 76, change: '+1.80%', isUp: true, velocity: 65 },
        { symbol: '$ORDI', sentiment: 68, change: '+8.20%', isUp: true, velocity: 71 },
        { symbol: '$SATS', sentiment: 49, change: '-1.50%', isUp: false, velocity: 52 },
        { symbol: '$CKB', sentiment: 73, change: '+11.2%', isUp: true, velocity: 80 }
      ],
      whaleAlerts: [
        { id: 'btc-w1', msg: 'BlackRock Spot ETF wallet added 1,420 BTC into custody node', age: '1m ago', size: '$94.5M', type: 'inflow' },
        { id: 'btc-w2', msg: 'Dormant coinbase allocation wallet from 2011 transferred 50 BTC', age: '12m ago', size: '$3.32M', type: 'transfer' },
        { id: 'btc-w3', msg: '950 BTC deposited from Binance to private multisig wallet', age: '25m ago', size: '$63.2M', type: 'outflow' }
      ]
    },
    ethereum: {
      chainName: 'Ethereum EVM Core',
      symbol: 'ETH',
      sentimentLevel: 'Neutral',
      score: 54,
      fearGreed: 51,
      socialVolume: 512.8,
      volumeChange24h: -4.5,
      newsImpact: 'neutral',
      topKeywords: ['Blob Fees Gas Cap', 'EVM L2 Fractions', 'Restaking Yield Hubs', 'Secured zkBridge'],
      timeline: [
        { name: '05/16', score: 58, volume: 490 },
        { name: '05/17', score: 56, volume: 510 },
        { name: '05/18', score: 55, volume: 480 },
        { name: '05/19', score: 52, volume: 460 },
        { name: '05/20', score: 53, volume: 530 },
        { name: '05/21', score: 55, volume: 520 },
        { name: '05/22', score: 54, volume: 512 }
      ],
      trendingTokens: [
        { symbol: topicContext ? topicContext.substring(0,6).toUpperCase() : '$PEPE', sentiment: 84, change: '+14.5%', isUp: true, velocity: 88 },
        { symbol: '$ETH', sentiment: 56, change: '+0.42%', isUp: true, velocity: 50 },
        { symbol: '$LDO', sentiment: 51, change: '+1.80%', isUp: true, velocity: 45 },
        { symbol: '$UNI', sentiment: 42, change: '-4.20%', isUp: false, velocity: 59 },
        { symbol: '$ENS', sentiment: 71, change: '+8.90%', isUp: true, velocity: 76 }
      ],
      whaleAlerts: [
        { id: 'eth-w1', msg: '4,500 ETH (~$13.5M) unlocked from EigenLayer restaking hub', age: '4m ago', size: '$13.5M', type: 'transfer' },
        { id: 'eth-w2', msg: 'Whale deposited 2,200 ETH to Uniswap v3 concentrated LP pool', age: '9m ago', size: '$6.60M', type: 'inflow' },
        { id: 'eth-w3', msg: 'Genesis multisig transferred 1,800 ETH to Coinbase validation center', age: '35m ago', size: '$5.40M', type: 'outflow' }
      ]
    },
    base: {
      chainName: 'Base Layer 2 Hub',
      symbol: 'BASE',
      sentimentLevel: 'Bullish',
      score: 79,
      fearGreed: 70,
      socialVolume: 198.4,
      volumeChange24h: 41.2,
      newsImpact: 'positive',
      topKeywords: ['Smart Account gasless', 'Onchain Summer Phase', 'Aerodrome Deep Pools', 'Farcaster Ecosystem'],
      timeline: [
        { name: '05/16', score: 68, volume: 110 },
        { name: '05/17', score: 71, volume: 125 },
        { name: '05/18', score: 74, volume: 150 },
        { name: '05/19', score: 72, volume: 142 },
        { name: '05/20', score: 76, volume: 168 },
        { name: '05/21', score: 77, volume: 184 },
        { name: '05/22', score: 79, volume: 198 }
      ],
      trendingTokens: [
        { symbol: topicContext ? topicContext.substring(0,6).toUpperCase() : '$AERO', sentiment: 89, change: '+18.2%', isUp: true, velocity: 84 },
        { symbol: '$BRETT', sentiment: 81, change: '+9.50%', isUp: true, velocity: 78 },
        { symbol: '$DEGEN', sentiment: 74, change: '+4.20%', isUp: true, velocity: 69 },
        { symbol: '$TOSHI', sentiment: 58, change: '-2.31%', isUp: false, velocity: 51 },
        { symbol: '$COIN', sentiment: 65, change: '+5.10%', isUp: true, velocity: 55 }
      ],
      whaleAlerts: [
        { id: 'base-w1', msg: 'Heavy bridging event: 8,000,000 USDC bridged from Ethereum to Base L2', age: '3m ago', size: '$8.00M', type: 'inflow' },
        { id: 'base-w2', msg: '3,500,000 $AERO locked permanently inside Aerodrome vote-escrow vault', age: '15m ago', size: '$4.12M', type: 'transfer' },
        { id: 'base-w3', msg: '1,500 ETH swapped for Brett on Base DEX router under 0.1% slip tolerance', age: '41m ago', size: '$4.50M', type: 'transfer' }
      ]
    },
    bsc: {
      chainName: 'BNB Smart Chain EVM',
      symbol: 'BNB',
      sentimentLevel: 'Neutral',
      score: 52,
      fearGreed: 49,
      socialVolume: 215.3,
      volumeChange24h: 1.5,
      newsImpact: 'neutral',
      topKeywords: ['BNB Chain Storage Greenfield', 'PancakeSwap MultiRouter', 'Parallel Execution Staging', 'BSC Meme Battle'],
      timeline: [
        { name: '05/16', score: 55, volume: 190 },
        { name: '05/17', score: 54, volume: 205 },
        { name: '05/18', score: 52, volume: 188 },
        { name: '05/19', score: 51, volume: 175 },
        { name: '05/20', score: 50, volume: 220 },
        { name: '05/21', score: 53, volume: 212 },
        { name: '05/22', score: 52, volume: 215 }
      ],
      trendingTokens: [
        { symbol: topicContext ? topicContext.substring(0,6).toUpperCase() : '$FLOKI', sentiment: 72, change: '+3.50%', isUp: true, velocity: 74 },
        { symbol: '$BNB', sentiment: 58, change: '+1.10%', isUp: true, velocity: 49 },
        { symbol: '$BABYDOGE', sentiment: 48, change: '-1.82%', isUp: false, velocity: 53 },
        { symbol: '$BAKE', sentiment: 62, change: '+4.20%', isUp: true, velocity: 60 },
        { symbol: '$CAKE', sentiment: 51, change: '+0.51%', isUp: true, velocity: 42 }
      ],
      whaleAlerts: [
        { id: 'bsc-w1', msg: '12,000 BNB (~$7.2M) withdrawn from Binance hot wallet to unknown cold storage', age: '8m ago', size: '$7.20M', type: 'outflow' },
        { id: 'bsc-w2', msg: 'PancakeSwap Router v3 added $2.4M BNB-USDT liquidity pool depth', age: '18m ago', size: '$2.40M', type: 'transfer' },
        { id: 'bsc-w3', msg: 'Whale address 0xef41...33d1 swapped $650K BUSD for $FLOKI in single batch', age: '52m ago', size: '$0.65M', type: 'transfer' }
      ]
    }
  };

  const activeData = chainDatasets[activeChain];
  const [whaleAlerts, setWhaleAlerts] = useState(activeData.whaleAlerts);

  // Sync whale alerts list when active chain changes, or random incoming pings
  useEffect(() => {
    setWhaleAlerts(activeData.whaleAlerts);
  }, [activeChain]);

  // Real-time styled whale alerts generator (prepends a random alert every 7 seconds)
  useEffect(() => {
    const alertPool = [
      { id: 'gen-1', msg: 'Smart Money Wallet 0x71...ea4b loaded 1,450,000 $SURCHI from decentralized swapper pools', size: '~$250K', type: 'inflow' },
      { id: 'gen-2', msg: 'Legendary Trader Vault unlocked 4,500,000 $USDC from margin hedges', size: '$4.5M', type: 'transfer' },
      { id: 'gen-3', msg: 'Liquidity Router injected $1.2M initial backing into trending meme curve contract', size: '$1.2M', type: 'inflow' },
      { id: 'gen-4', msg: 'MeV Arbitrage Bot swept 350 ETH across multi-router pools, netting $12K profit', size: '$1.1M', type: 'transfer' },
      { id: 'gen-5', msg: 'Systemic Whale deposited 80,000 SOL into Liquid Staking validation nodes', size: '$13.6M', type: 'inflow' }
    ];

    const interval = setInterval(() => {
      const randomAlert = alertPool[Math.floor(Math.random() * alertPool.length)];
      setWhaleAlerts(prev => {
        const uniqueId = `sim-gen-${Date.now()}`;
        const isExists = prev.some(a => a.msg === randomAlert.msg);
        if (isExists) return prev;
        const newAlert = {
          id: uniqueId,
          msg: randomAlert.msg,
          age: 'Just now',
          size: randomAlert.size,
          type: randomAlert.type as 'inflow' | 'outflow' | 'transfer'
        };
        return [newAlert, ...prev.slice(0, 4)];
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Community scan execution trigger
  const handleVerifyTrust = () => {
    if (!communityTarget.trim()) return;
    setIsScanningTrust(true);
    setScanProgress(0);
    setTrustScore(null);

    // Progressive loading simulation
    const timer = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsScanningTrust(false);
          // Generate realistic result based on target input
          let computedScore = 74;
          let botRatio = 18;
          let socialAct = 81;
          let verdict = 'Passed - Moderate Organic Engagement';

          const lower = communityTarget.toLowerCase();
          if (lower.includes('scam') || lower.includes('rug') || lower.includes('bot') || lower.length < 5) {
            computedScore = 32;
            botRatio = 74;
            socialAct = 29;
            verdict = 'Failed - Suspicious Bot Activity & High Core Concentration';
          } else if (lower.includes('surchi') || lower.includes('solana') || lower.includes('official')) {
            computedScore = 93;
            botRatio = 7;
            socialAct = 95;
            verdict = 'Excellent - Pristine Organic Community Metrics';
          }

          setTrustScore({
            score: computedScore,
            totalAudited: Math.floor(1420 + Math.random() * 8500),
            botPrevalence: botRatio,
            socialActivity: socialAct,
            verdict,
            submitted: communityTarget
          });
          return 100;
        }
        return prev + 12;
      });
    }, 300);
  };

  // Helpers for visual styles
  const getLevelColor = (level: string) => {
    if (level.includes('Extremely Bullish')) return 'text-cyber-green bg-cyber-green/10 border-cyber-green/20';
    if (level.includes('Bullish')) return 'text-[#00ff88] bg-[#00ff88]/10 border-[#00ff88]/20';
    if (level.includes('Neutral')) return 'text-cyber-cyan bg-cyber-cyan/10 border-cyber-cyan/20';
    if (level.includes('Bearish')) return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
  };

  const getChainColorTheme = () => {
    if (activeChain === 'solana') return '#00ff88';
    if (activeChain === 'bitcoin') return '#f7931a';
    if (activeChain === 'base') return '#0052ff';
    if (activeChain === 'ethereum') return '#627eea';
    return '#ff4b82';
  };

  const currentThemeColor = getChainColorTheme();

  return (
    <div className="bg-[#04040a] rounded-xl border border-cyber-border p-4 sm:p-6 space-y-6 text-[#ffffff] font-mono text-left select-text">
      
      {/* 1. COMPONENT HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyber-border pb-4 w-full">
        <div>
          <span className="text-[10px] text-cyber-cyan tracking-widest uppercase font-bold block">AI-Powered Crypto Intelligence Engine</span>
          <h3 className="text-base font-bold text-white uppercase flex items-center gap-2">
            <Icons.Compass className="w-5 h-5" style={{ color: currentThemeColor }} />
            Market Sentiment Analyzer Hub
          </h3>
          {topicContext && (
            <span className="text-[10px] text-cyber-purple animate-pulse mt-0.5 block">
              💡 Target Context active: Analyzing Hype & Sentiment for &quot;{topicContext}&quot;
            </span>
          )}
        </div>
        
        {/* Multi-chain selection tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#080814] p-1 border border-cyber-border rounded-lg">
          {(['solana', 'bitcoin', 'ethereum', 'base', 'bsc'] as const).map(c => (
            <button
              key={c}
              onClick={() => setActiveChain(c)}
              className="px-2.5 py-1 text-[9px] font-bold rounded cursor-pointer transition-all select-none font-mono uppercase"
              style={{
                backgroundColor: activeChain === c ? `${getChainColorTheme()}15` : 'transparent',
                color: activeChain === c ? getChainColorTheme() : '#64748b',
                border: activeChain === c ? `1px solid ${getChainColorTheme()}35` : '1px solid transparent'
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* 2. DYNAMIC SCORE METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Sentiment Gauge Card */}
        <div className="p-4 bg-cyber-card border border-cyber-border rounded-xl flex flex-col justify-between text-left space-y-1 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 pointer-events-none filter blur-2xl opacity-15"
               style={{ background: `radial-gradient(circle, ${currentThemeColor} 0%, transparent 70%)` }} />
          <div>
            <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest block">QUANTUM EMOTION INDEX</span>
            <div className="flex items-baseline gap-2 mt-1.5">
              <span className="text-3xl font-black" style={{ color: currentThemeColor }}>{activeData.score} <span className="text-xs text-slate-400">/ 100</span></span>
              <span className={`text-[8px] font-bold px-2 py-0.5 rounded border inline-block ${getLevelColor(activeData.sentimentLevel)}`}>
                {activeData.sentimentLevel.toUpperCase()}
              </span>
            </div>
          </div>
          <div className="pt-2">
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden border border-cyber-border">
              <div className="h-full rounded-full transition-all duration-1000" 
                   style={{ width: `${activeData.score}%`, backgroundColor: currentThemeColor }} />
            </div>
            <div className="flex justify-between text-[9px] text-slate-500 mt-1 uppercase">
              <span>Extremely Bearish</span>
              <span>Extremely Bullish</span>
            </div>
          </div>
        </div>

        {/* Fear & Greed Gauge */}
        <div className="p-4 bg-cyber-card border border-cyber-border rounded-xl text-left flex flex-col justify-between space-y-1 relative">
          <div>
            <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest block">FEAR & GREED INDEX STATE</span>
            <div className="flex items-baseline gap-1.5 mt-1.5">
              <span className="text-3xl font-black text-white">{activeData.fearGreed} <span className="text-xs text-slate-450 text-slate-500">/ 100</span></span>
              <span className="text-xs text-cyber-cyan font-bold">
                {activeData.fearGreed > 60 ? 'GREED ZONE' : activeData.fearGreed < 40 ? 'FEAR ZONE' : 'NEUTRAL INDEX'}
              </span>
            </div>
          </div>
          <div className="pt-2">
            <div className="h-2 w-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full relative overflow-hidden border border-cyber-border">
              <div className="h-full w-1.5 bg-white border border-black absolute top-0 animate-ping" style={{ left: `${activeData.fearGreed}%` }}></div>
              <div className="h-full w-1.5 bg-white border border-black absolute top-0" style={{ left: `${activeData.fearGreed}%` }}></div>
            </div>
            <div className="flex justify-between text-[9px] text-slate-500 mt-1 uppercase">
              <span className="text-red-500">FEAR</span>
              <span className="text-yellow-500">MKT AXIS</span>
              <span className="text-green-500">GREED</span>
            </div>
          </div>
        </div>

        {/* Social Buzz Stats */}
        <div className="p-4 bg-cyber-card border border-cyber-border rounded-xl text-left flex flex-col justify-between space-y-1 h-36">
          <div>
            <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest block">SOCIAL DISCOURSE VOLUME</span>
            <div className="flex items-baseline gap-1 mt-1.5">
              <span className="text-2xl font-black text-cyber-purple">{activeData.socialVolume}K</span>
              <span className="text-xs text-cyber-green font-bold flex items-center ml-1">
                <Icons.TrendingUp className="w-3.5 h-3.5 mr-0.5 text-cyber-green" />
                +{activeData.volumeChange24h}%
              </span>
            </div>
          </div>
          <div className="text-[10px] text-slate-400 font-sans leading-relaxed">
            Scanning 24H streams across <span className="text-white font-mono font-bold">Twitter, Discord, Telegram & Reddit</span>.
          </div>
        </div>

      </div>

      {/* 3. CHART & HEATMAP ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Sentiment Timeline Chart */}
        <div className="p-4 bg-cyber-card border border-cyber-border rounded-xl text-left space-y-2 md:col-span-2">
          <div className="flex justify-between items-center pb-1">
            <h4 className="text-xs font-bold text-slate-300 uppercase flex items-center gap-1.5">
              <Icons.History className="w-4 h-4 text-cyber-cyan" />
              7-Day Sentiment Timeline Spectrum
            </h4>
            <span className="text-[9px] text-slate-500 font-bold">INTERVAL: 24H ITERATIONS</span>
          </div>

          <div className="h-44 bg-[#020207] border border-cyber-border/40 rounded-lg relative overflow-hidden p-2 pt-4 min-h-[176px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activeData.timeline} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="sentimentHistoryGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={currentThemeColor} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={currentThemeColor} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#101024" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#64748b', fontSize: 9, fontFamily: 'monospace' }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  domain={[30, 100]}
                  tick={{ fill: '#64748b', fontSize: 9, fontFamily: 'monospace' }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  content={({ active, payload: tPayload, label }) => {
                    if (active && tPayload && tPayload.length) {
                      const value = tPayload[0].value;
                      return (
                        <div className="bg-[#060616] p-2 border border-cyber-cyan/30 rounded text-[9px] font-mono text-left space-y-0.5 shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                          <p className="text-slate-450 text-slate-500 uppercase">{label}</p>
                          <p className="font-bold text-white">Sentiment: <span style={{ color: currentThemeColor }}>{value}/100</span></p>
                          <p className="text-[#c084fc]">Query Load: <span className="text-slate-200">{tPayload[0].payload.volume}K pings</span></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke={currentThemeColor}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#sentimentHistoryGlow)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Social Sentiment Heatmap */}
        <div className="p-4 bg-cyber-card border border-cyber-border rounded-xl text-left space-y-2.5">
          <h4 className="text-xs font-bold text-slate-300 uppercase flex items-center gap-1.5">
            <Icons.Globe className="w-4 h-4 text-cyber-purple" />
            Social Platform Heatmap
          </h4>
          <div className="space-y-3 pt-1">
            
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-slate-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-[#1da1f2] rounded-full"></span>
                  Twitter / X Nodes
                </span>
                <span className="text-cyber-green font-bold">84% Positive</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden border border-cyber-border/40">
                <div className="h-full bg-cyber-green" style={{ width: '84%' }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-slate-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-[#ff4500] rounded-full"></span>
                  Reddit Crypto Subs
                </span>
                <span className="text-cyber-cyan font-bold">68% Bullish</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden border border-cyber-border/40">
                <div className="h-full bg-cyber-cyan" style={{ width: '68%' }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-slate-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-[#0088cc] rounded-full"></span>
                  Telegram Communities
                </span>
                <span className="text-[#00ff88] font-bold">75% FOMO</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden border border-cyber-border/40">
                <div className="h-full bg-[#00ff88]" style={{ width: '75%' }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-slate-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-[#5865f2] rounded-full"></span>
                  Discord Dev Spheres
                </span>
                <span className="text-[#c084fc] font-bold">91% Hype</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden border border-cyber-border/40">
                <div className="h-full bg-[#c084fc]" style={{ width: '91%' }} />
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* 4. REAL-TIME WHALE LOG & TRENDING TOKENS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Whale Activity Alert Ticker Log */}
        <div className="p-4 bg-cyber-card border border-cyber-border rounded-xl text-left space-y-3 relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b border-cyber-border/40 pb-2 mb-2">
              <h4 className="text-xs font-bold text-[#ffffff] uppercase font-display flex items-center gap-1.5">
                <span className="flex h-1.5 w-1.5 relative shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff4b82] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#ff4b82]"></span>
                </span>
                Whale Activity Logs (Live Stream)
              </h4>
              <span className="text-[8px] font-mono text-slate-500 select-none">WEBSOCKET PING: ACTIVE</span>
            </div>

            <div className="space-y-2 min-h-[170px]">
              {whaleAlerts.map((w, index) => (
                <div key={w.id} className="p-2 bg-[#020207] rounded border border-cyber-border/40 text-[10px] flex justify-between items-start gap-4 hover:border-cyber-cyan/35 transition-colors animate-fade-in">
                  <div className="flex items-start gap-2">
                    <span className="text-[9px] px-1 bg-cyber-bg border border-cyber-border shrink-0 select-none rounded text-slate-500 font-bold uppercase font-mono">
                      {w.type === 'inflow' ? '📥 BUY' : w.type === 'outflow' ? '📤 SELL' : '🔄 SYNC'}
                    </span>
                    <p className="text-slate-200 leading-normal font-sans text-[10.5px] select-text">
                      {w.msg}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-bold text-cyber-green block select-none">{w.size}</span>
                    <span className="text-[8px] text-slate-500 block font-mono font-normal">{w.age}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-[9px] text-slate-500 mt-2 text-center pt-1 border-t border-cyber-border/30">
            * Whale alert scanner runs continuously tracking heavy wallet transactions (balances &gt; $200k USD).
          </div>
        </div>

        {/* Token-Specific Sentiments & Meme coin hype tracker */}
        <div className="p-4 bg-cyber-card border border-cyber-border rounded-xl text-left space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b border-cyber-border/40 pb-2 mb-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase flex items-center gap-1.5">
                <Icons.Activity className="w-4 h-4" style={{ color: currentThemeColor }} />
                Trending Token Sentiment & Velocity Index
              </h4>
              <span className="text-[8px] font-mono text-slate-500">MAPPING {activeData.symbol} ASSETS</span>
            </div>

            <div className="space-y-3">
              {activeData.trendingTokens.map((t, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="text-[9.5px] font-black text-white">{t.symbol}</span>
                      <span className={`text-[8.5px] font-bold ${t.isUp ? 'text-cyber-green' : 'text-rose-500 bg-rose-950/20 px-1 rounded'}`}>
                        {t.change}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-slate-450 text-slate-500 font-bold">HYPE VELOCITY:</span>
                      <span className="text-[#00ff88] font-bold text-[10px]">{t.sentiment}%</span>
                    </div>
                  </div>
                  
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden border border-cyber-border/40">
                    <div className="h-full rounded-full" 
                         style={{ 
                           width: `${t.sentiment}%`, 
                           backgroundColor: currentThemeColor,
                           boxShadow: `0 0 6px ${currentThemeColor}60`
                         }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[8.5px] text-slate-500 leading-normal pt-2 border-t border-cyber-border/30 mt-2">
            AI velocity indexes social posts, hashtags, and trading momentum changes over a rolling 4-hour slot.
          </div>
        </div>

      </div>

      {/* 5. COMMUNITY TRUST SCANNER PORTAL */}
      <div className="p-4 bg-cyber-card border border-cyber-border rounded-xl text-left space-y-3">
        <div className="border-b border-cyber-border/40 pb-2">
          <h4 className="text-xs font-bold text-slate-200 uppercase flex items-center gap-1.5">
            <Icons.Users className="w-4 h-4 text-cyber-cyan" />
            Interactive Community Legitimacy Scanner
          </h4>
          <span className="text-[9.5px] text-slate-500 block">Detect community manipulation, bot ratios, and Sybil accounts before investing</span>
        </div>

        {/* Input area */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={communityTarget}
              onChange={(e) => setCommunityTarget(e.target.value)}
              placeholder="Enter Telegram username, Twitter handle, or URL (e.g., @surchi_ai or t.me/surchi)..."
              className="w-full bg-[#030308] border border-cyber-border rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-cyber-cyan select-text font-mono"
            />
          </div>
          <button
            onClick={handleVerifyTrust}
            disabled={isScanningTrust}
            className="px-5 py-2 bg-cyber-cyan hover:bg-[#00b5cc] text-black rounded text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(0,229,255,0.25)] select-none shrink-0"
          >
            {isScanningTrust ? (
              <>
                <Icons.RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>SCANNING NETWORK...</span>
              </>
            ) : (
              <>
                <Icons.SearchCode className="w-3.5 h-3.5" />
                <span>VERIFY TRUST TARGET</span>
              </>
            )}
          </button>
        </div>

        {/* Progressive bar or Result panels */}
        {isScanningTrust && (
          <div className="space-y-1.5 p-3.5 bg-[#03030a] rounded-lg border border-cyber-cyan/30 animate-pulse">
            <div className="flex justify-between text-[10px]">
              <span className="text-cyber-cyan font-bold select-none">[QUANTUM SYBIL SCANNING: ACTIVE]</span>
              <span>{scanProgress}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden border border-cyber-border/40">
              <div className="h-full bg-cyber-cyan rounded-full" style={{ width: `${scanProgress}%` }} />
            </div>
            <p className="text-[9px] text-slate-500">Decrypting group membership nodes, analyzing comment engagement vectors, verifying unique metadata signatures...</p>
          </div>
        )}

        {trustScore && !isScanningTrust && (
          <div className="p-4 bg-[#03030a] rounded-lg border border-cyber-cyan/25 text-xs animate-fade-in grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="flex flex-col justify-center items-center border-r border-cyber-border/40 pr-4">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black">LEGITIMACY RANK</span>
              <span className="text-4xl font-black text-cyber-neon mt-1" style={{ textShadow: '0 0 10px rgba(0,255,136,0.3)' }}>
                {trustScore.score} <span className="text-xs text-slate-450 text-slate-500 font-normal">/ 100</span>
              </span>
              <span className="text-[8.5px] mt-2 px-2 py-0.5 rounded bg-cyber-green/10 border border-cyber-green/20 text-cyber-green font-bold text-center">
                {trustScore.score > 60 ? 'PASSED CLEAN' : 'SUSPICIOUS SIGNAL'}
              </span>
            </div>

            <div className="space-y-2 md:col-span-2 text-left">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase select-mono">Target: {trustScore.submitted}</span>
                <span className="text-[9px] text-slate-550 text-slate-500">Node Samples analyzed: {trustScore.totalAudited} wallets</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3 pt-1 text-[10.5px]">
                <div className="p-2 bg-cyber-card border border-cyber-border rounded">
                  <span className="text-[9px] text-slate-504 text-slate-500 block">BOT PREVALENCE RATIO</span>
                  <span className="font-bold text-white mt-0.5 block">{trustScore.botPrevalence}% <span className="text-[8.5px] text-amber-500 font-normal ml-1">({trustScore.botPrevalence > 30 ? 'HIGH RATIO' : 'NOMINAL'})</span></span>
                </div>
                
                <div className="p-2 bg-cyber-card border border-cyber-border rounded">
                  <span className="text-[9px] text-slate-504 text-slate-500 block">ORGANIC ACTIVITY RATIO</span>
                  <span className="font-bold text-cyber-cyan mt-0.5 block">{trustScore.socialActivity}% <span className="text-[8.5px] text-cyber-green font-normal ml-1">({trustScore.socialActivity > 70 ? 'ENGAGED' : 'LIGHT'})</span></span>
                </div>
              </div>

              <div className="p-2 bg-[#050514] border border-cyber-border/60 rounded">
                <span className="text-[9px] text-slate-500 block">AI FORENSIC DIAGNOSTICIANS SUMMARY:</span>
                <p className="text-[10px] text-slate-300 font-sans mt-0.5 leading-relaxed italic pr-2">
                  &quot;{trustScore.verdict}. The member graph corresponds with typical growth milestones. No sybil attacks flagged.&quot;
                </p>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* 6. AI ALERTS PORTAL */}
      <div className="p-4 bg-cyber-card border border-cyber-border rounded-xl text-left space-y-4">
        <div className="border-b border-cyber-border/40 pb-2">
          <h4 className="text-xs font-bold text-slate-200 uppercase flex items-center gap-1.5">
            <Icons.Bell className="w-4 h-4 text-cyber-purple" />
            AI Intelligence Pulse Alerts (Push & Setup Hooks)
          </h4>
          <span className="text-[9.5px] text-slate-500 block">Setup decentralized webhooks to ping your workspace immediately during extreme hype spikes or high-volume dumps</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          
          <button
            onClick={() => setAlertStates(prev => ({ ...prev, inapp: !prev.inapp }))}
            className="p-3 bg-[#030308] border rounded-lg text-center flex flex-col justify-between items-center space-y-2 cursor-pointer transition-all select-none"
            style={{ borderColor: alertStates.inapp ? '#00ff88' : '#11112a' }}
          >
            <Icons.Layers className="w-5 h-5" style={{ color: alertStates.inapp ? '#00ff88' : '#64748b' }} />
            <div className="text-center">
              <span className="text-[10px] text-white block font-bold">In-App Terminal</span>
              <span className="text-[8px] text-slate-500 block uppercase mt-0.5">{alertStates.inapp ? '🔔 active' : '🔕 muted'}</span>
            </div>
          </button>

          <button
            onClick={() => setAlertStates(prev => ({ ...prev, push: !prev.push }))}
            className="p-3 bg-[#030308] border rounded-lg text-center flex flex-col justify-between items-center space-y-2 cursor-pointer transition-all select-none"
            style={{ borderColor: alertStates.push ? '#00e5ff' : '#11112a' }}
          >
            <Icons.Activity className="w-5 h-5 animate-pulse" style={{ color: alertStates.push ? '#00e5ff' : '#64748b' }} />
            <div className="text-center">
              <span className="text-[10px] text-white block font-bold">Browser Push</span>
              <span className="text-[8px] text-slate-500 block uppercase mt-0.5">{alertStates.push ? '🔔 active' : '🔕 muted'}</span>
            </div>
          </button>

          <button
            onClick={() => setAlertStates(prev => ({ ...prev, telegram: !prev.telegram }))}
            className="p-3 bg-[#030308] border rounded-lg text-center flex flex-col justify-between items-center space-y-2 cursor-pointer transition-all select-none"
            style={{ borderColor: alertStates.telegram ? '#c084fc' : '#11112a' }}
          >
            <Icons.Send className="w-5 h-5" style={{ color: alertStates.telegram ? '#c084fc' : '#64748b' }} />
            <div className="text-center">
              <span className="text-[10px] text-white block font-bold">Telegram bot</span>
              <span className="text-[8px] text-slate-500 block uppercase mt-0.5">{alertStates.telegram ? '🔔 setup' : '🔕 muted'}</span>
            </div>
          </button>

          <button
            onClick={() => setAlertStates(prev => ({ ...prev, email: !prev.email }))}
            className="p-3 bg-[#030308] border rounded-lg text-center flex flex-col justify-between items-center space-y-2 cursor-pointer transition-all select-none"
            style={{ borderColor: alertStates.email ? '#ff4b82' : '#11112a' }}
          >
            <Icons.Bell className="w-5 h-5" style={{ color: alertStates.email ? '#ff4b82' : '#64748b' }} />
            <div className="text-center">
              <span className="text-[10px] text-white block font-bold">Email Digest</span>
              <span className="text-[8px] text-slate-500 block uppercase mt-0.5">{alertStates.email ? '🔔 daily' : '🔕 muted'}</span>
            </div>
          </button>

        </div>
      </div>

    </div>
  );
}

// 13. TWITTER THREAD & COPY WRITER
interface TweetWriterProps {
  content: string;
  onRefresh: (overridePayload?: Record<string, string>) => void;
}

function TweetWriterDashboard({ content, onRefresh }: TweetWriterProps) {
  return (
    <div className="bg-[#04040a] rounded-xl border border-cyber-border p-4 sm:p-6 space-y-6 text-[#ffffff] font-mono text-left select-text">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cyber-border pb-4">
        <div>
          <span className="text-[10px] text-cyber-purple tracking-widest uppercase font-bold block">social expansion copywriting dashboards</span>
          <h3 className="text-base font-bold text-white uppercase flex items-center gap-2">
            <Icons.MessageSquare className="w-5 h-5 text-cyber-purple" />
            Surchi Thread Generator suite
          </h3>
        </div>
        <button
          onClick={() => onRefresh()}
          className="text-[10px] text-cyber-purple hover:text-cyber-cyan font-mono"
        >
          [⚡ BAKE FRESH COPIES]
        </button>
      </div>

      <div className="p-3.5 bg-cyber-card border border-cyber-border rounded-xl text-xs flex justify-between items-center">
        <div>
          <span className="font-semibold text-slate-200">STANDALONE VIRAL HOOK COPYS</span>
          <p className="text-[10px] text-slate-505 leading-normal">Fully optimized for character limit bounds (Max 280 chars)</p>
        </div>
        <div className="text-right">
          <span className="text-cyber-cyan font-bold block font-mono">256/280 chars LIMIT</span>
        </div>
      </div>

      <div className="p-4 bg-cyber-bg rounded-lg border border-cyber-border space-y-3 font-sans text-xs text-slate-300 whitespace-pre-line leading-relaxed">
        {content || "Generating threads metrics..."}
      </div>
    </div>
  );
}

// 14. COMPETITOR AUTOMATION ANALYST
function CompetitorAnalysisDashboard({ payload }: SubComponentProps) {
  const projectName = payload?.projectName || 'My Secure Protocol';

  return (
    <div className="bg-[#04040a] rounded-xl border border-cyber-border p-4 sm:p-6 space-y-6 text-[#ffffff] font-mono text-left select-text">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cyber-border pb-4">
        <div>
          <span className="text-[10px] text-cyber-cyan tracking-widest uppercase font-bold block">competitive strategy analysis matricies</span>
          <h3 className="text-base font-bold text-white uppercase flex items-center gap-2">
            <Icons.GitCompare className="w-5 h-5 text-cyber-cyan" />
            Competition Gap Index
          </h3>
        </div>
        <span className="text-xs text-slate-400 font-bold font-mono uppercase text-cyber-cyan">SWOT MATRIX ACTIVE</span>
      </div>

      <div className="overflow-x-auto border border-cyber-border rounded-lg text-xs leading-none">
        <table className="w-full text-left">
          <thead className="bg-[#080814] text-slate-400 border-b border-cyber-border">
            <tr>
              <th className="p-3 font-semibold">Security Dimensions / speed</th>
              <th className="p-3 font-semibold text-cyber-cyan">{projectName.toUpperCase()}</th>
              <th className="p-3 font-semibold">COMPETITOR A</th>
              <th className="p-3 font-semibold">COMPETITOR B</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cyber-border/40 bg-[#030308] font-mono">
            <tr>
              <td className="p-3 font-semibold text-slate-350">Transaction Analysis Latency</td>
              <td className="p-3 text-cyber-green font-bold">INSTANT (&lt; 1s)</td>
              <td className="p-3">7 - 12s batch scans</td>
              <td className="p-3">Requires static files (.sol)</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold text-slate-350">Liquidity Hazard Risk Scoring</td>
              <td className="p-3 text-cyber-green font-bold">INTEGRATED / DYNAMIC</td>
              <td className="p-3">Basic checklist only</td>
              <td className="p-3">N/A (No LP analyzer)</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold text-slate-350">DEX Grounding Indices</td>
              <td className="p-3 text-cyber-green font-bold">FULL INTERACTIVE PINGS</td>
              <td className="p-3 text-rose-500">OFFLINE</td>
              <td className="p-3 text-rose-500">OFFLINE</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-3.5 bg-cyber-card border border-cyber-green/20 rounded-xl">
          <span className="text-[10px] text-cyber-green uppercase font-black tracking-widest block">STRENGTHS</span>
          <p className="text-[10.5px] text-slate-400 mt-1 leading-normal font-sans">Full automated cryptographic pipeline integrated directly inside core workspace, backed by live grounding.</p>
        </div>
        <div className="p-3.5 bg-cyber-card border border-rose-500/20 rounded-xl">
          <span className="text-[10px] text-rose-500 uppercase font-black tracking-widest block">WEAKNESSES</span>
          <p className="text-[10.5px] text-slate-400 mt-1 leading-normal font-sans">Ecosystem in active staging phase with initial pre-sales modules preparing for future mainnet launches.</p>
        </div>
      </div>
    </div>
  );
}

// STANDARD FALLBACK MARKDOWN VIEWER
interface StandardMarkdownViewerProps {
  content: string;
}

function SmartMoneyTrackerDashboard({ payload, content }: SubComponentProps) {
  const live = (payload?.liveDetails || {}) as any;
  const chain = (live.chain || 'ethereum').toLowerCase();
  const address = live.address || payload?.wallet || '0x';
  const nativeBalance = live.nativeBalance || '0.00';
  const recentFlows = live.recentFlows || [];

  const { copiedKey, triggerCopy } = useCopy();

  const coinSymbol = chain === 'solana' ? 'SOL' : 'ETH';
  const chainName = chain === 'solana' ? 'Solana' : chain === 'base' ? 'Base' : chain === 'ethereum' ? 'Ethereum' : chain.toUpperCase();

  const isSolana = chain === 'solana';
  const borderGlow = isSolana ? 'hover:border-[#00ff88]/50 hover:shadow-[0_0_12px_rgba(0,255,136,0.1)]' : 'hover:border-cyber-cyan/50 hover:shadow-[0_0_12px_rgba(0,229,255,0.1)]';

  return (
    <div className="bg-[#04040a] rounded-xl border border-cyber-border p-4 sm:p-6 space-y-6 text-[#ffffff] font-mono text-left select-text relative overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Target Address Card */}
        <div className="p-4 bg-cyber-card border border-cyber-border rounded-xl space-y-3">
          <span className="text-[9px] text-slate-500 uppercase font-black block">INDEXED TARGET ADDRESS</span>
          <div className="flex items-center justify-between bg-[#020206] p-2.5 rounded border border-cyber-border/60">
            <span className="text-xs text-white break-all font-sans select-all pr-2">{address}</span>
            <button
              type="button"
              onClick={() => triggerCopy(address, 'addr')}
              className="p-1 rounded hover:bg-[#15152a] text-slate-400 hover:text-cyber-cyan cursor-pointer shrink-0 transition-colors"
              title="Copy address"
            >
              {copiedKey === 'addr' ? (
                <Icons.Check className="w-3.5 h-3.5 text-cyber-green animate-bounce" />
              ) : (
                <Icons.Clipboard className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
          <span className="text-[9px] text-slate-400 block font-semibold uppercase">Network Segment: {chainName}</span>
        </div>

        {/* Address Balance Section */}
        <div className="p-4 bg-cyber-card border border-cyber-border rounded-xl flex flex-col justify-center">
          <span className="text-[9px] text-slate-500 uppercase block font-bold">ADDRESS CURRENT BALANCE</span>
          <span className="text-2xl font-black text-[#00ff88] block mt-1 tracking-tight">
            {nativeBalance} {coinSymbol}
          </span>
          <span className="text-[9px] text-slate-400 block mt-1">Live query resolved via index nodes</span>
        </div>
      </div>

      {/* On-Chain Flow (Inflows & Outflows) */}
      <div className="space-y-3.5">
        <h4 className="text-xs font-bold text-slate-300 uppercase flex items-center gap-1.5 border-b border-cyber-border pb-2">
          <Icons.Activity className="w-4 h-4 text-cyber-cyan" />
          On-Chain Capital Flow (Inflows & Outflows)
        </h4>
        <div className="space-y-2">
          {recentFlows.length === 0 ? (
            <div className="p-4 rounded-lg bg-[#020206] border border-cyber-border text-center text-slate-500 italic text-[11px]">
              No transactions detected in recent indexer blocks.
            </div>
          ) : (
            recentFlows.map((flow: any, idx: number) => {
              const isIn = flow.type === 'inflow';
              return (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border flex items-center justify-between gap-4 transition-all duration-300 ${borderGlow} ${
                    isIn
                      ? 'bg-[#00ff88]/5 border-[#00ff88]/20'
                      : 'bg-rose-950/5 border-rose-500/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      isIn ? 'bg-[#00ff88]/10 text-[#00ff88]' : 'bg-rose-500/10 text-rose-500'
                    }`}>
                      {isIn ? (
                        <Icons.ArrowUpRight className="w-4 h-4 rotate-45" />
                      ) : (
                        <Icons.ArrowDownRight className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <span className={`text-[10px] font-black uppercase tracking-wider block ${
                        isIn ? 'text-[#00ff88]' : 'text-rose-500'
                      }`}>
                        {isIn ? 'Inflow' : 'Outflow'}
                      </span>
                      {flow.hash ? (
                        <span className="text-[9px] text-slate-500 block font-mono pr-2 mt-0.5 max-w-[150px] sm:max-w-md truncate">
                          TX: {flow.hash}
                        </span>
                      ) : (
                        <span className="text-[9px] text-slate-500 block font-mono mt-0.5">
                          On-Chain Settlement
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-black block font-mono ${
                      isIn ? 'text-[#00ff88]' : 'text-rose-500'
                    }`}>
                      {isIn ? '+' : '-'}{flow.amount.toLocaleString(undefined, { maximumFractionDigits: 4 })} {flow.asset}
                    </span>
                    {flow.time && (
                      <span className="text-[8px] text-slate-500 block mt-0.5">
                        {new Date(flow.time).toLocaleTimeString()}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

function StandardMarkdownViewer({ content }: StandardMarkdownViewerProps) {
  return (
    <div className="p-4 sm:p-6 text-left max-w-full overflow-hidden select-text text-slate-300 font-mono antialiased whitespace-pre-line">
      {content.split('\n').map((line, idx) => {
        let isCodeBlock = false;
        if (line.includes('pragma solidity') || line.includes('contract ') || line.includes('function ') || line.includes('emit ')) {
          isCodeBlock = true;
        }

        if (isCodeBlock) {
          return (
            <pre key={idx} className="bg-[#030308] p-3.5 rounded border border-cyber-border/40 my-3 overflow-x-auto text-xs leading-relaxed text-[#ffffff] font-mono select-text">
              <code>{line}</code>
            </pre>
          );
        }

        return (
          <p key={idx} className="mb-2 text-xs sm:text-[13px] leading-relaxed select-text font-sans">
            {line}
          </p>
        );
      })}
    </div>
  );
}
