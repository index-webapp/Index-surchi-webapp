import React, { useState } from 'react';
import * as Icons from 'lucide-react';

export default function ProductsDashboard() {
  const [activeSegment, setActiveSegment] = useState<number>(0);

  const segments = [
    {
      id: 0,
      label: 'SEGMENT 1',
      title: 'The Alpha Sentinel',
      tagline: 'Sentiment Intelligence Engine',
      icon: <Icons.BrainCircuit className="w-5 h-5 text-cyber-purple" />,
      description: 'The Alpha Sentinel monitors and analyzes social platforms including X (Twitter), Telegram, Discord, Reddit, Farcaster, and Web3 forums using NLP models fine-tuned for crypto discourse.',
      hasBullets: true,
      bulletTitle: 'Key Functions',
      bullets: [
        'Narrative Trend Detection',
        'Social Sentiment Scoring',
        'Hype Cycle Recognition',
        'Meme Velocity Monitoring',
        'Influencer Signal Weighting',
        'Sector Rotation Analysis',
        'Anomaly Detection'
      ]
    },
    {
      id: 1,
      label: 'SEGMENT 2',
      title: 'The Liquidity Sentinel',
      tagline: 'On-Chain Surveillance',
      icon: <Icons.Eye className="w-5 h-5 text-cyber-cyan" />,
      description: 'Continuously monitors Solana DEX liquidity pools, whale wallets, and token concentration metrics.',
      hasBullets: true,
      bulletTitle: 'Key Functions',
      bullets: [
        'Pool Health Monitoring',
        'Liquidity Fragmentation Detection',
        'Whale Wallet Tracking',
        'Top-Holder Concentration Analysis',
        'Rug-Pull Probability Scoring',
        'Smart Money Flow Tracking',
        'New Token Risk Assessment'
      ]
    },
    {
      id: 2,
      label: 'SEGMENT 3',
      title: 'The Execution Sentinel',
      tagline: 'Smart Routing Layer',
      icon: <Icons.TrendingUp className="w-5 h-5 text-cyber-neon" />,
      description: 'Translates intelligence into live on-chain action, integrated natively with Jupiter (Solana\'s DEX aggregator).',
      hasBullets: true,
      bulletTitle: 'Key Functions',
      bullets: [
        'Smart Order Routing',
        'Slippage Optimization',
        'Intent Execution',
        'Limit Logic Automation',
        'MEV-Aware Order Flow',
        'Transaction Priority Management',
        'Execution Confirmation & Audit'
      ]
    },
    {
      id: 3,
      label: 'SEGMENT 4',
      title: 'Natural Language Interface',
      tagline: 'Plain-English Strategy Engine',
      icon: <Icons.Terminal className="w-5 h-5 text-amber-400" />,
      description: 'Allows users to define complex trading strategies in plain English. No coding required.',
      customElement: (
        <div className="space-y-4">
          <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg space-y-1">
            <span className="text-[9px] font-mono font-bold text-amber-500 uppercase tracking-widest block">Example Plain English Command:</span>
            <p className="text-[11px] text-slate-300 italic font-mono leading-relaxed select-text">
              &ldquo;Sentinel, identify tokens trending in the Solana AI sector. If SOL remains above $150 and the token has over $500k liquidity, allocate 2 SOL. Sell if it reaches 2x or if the top 10 holders reduce 5% of supply.&rdquo;
            </p>
          </div>
          <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 border-t border-cyber-border/40 pt-2.5">
            <span>Intent Parsing System</span>
            <span>&rarr;</span>
            <span>Condition Structuring</span>
            <span>&rarr;</span>
            <span>Execution Deployment</span>
          </div>
        </div>
      )
    },
    {
      id: 4,
      label: 'SEGMENT 5',
      title: 'Secure Hardware Integration',
      tagline: 'Mobile Device Sovereign Guard',
      icon: <Icons.Smartphone className="w-5 h-5 text-cyber-cyan" />,
      description: 'Optimized for Solana Seeker and Saga mobile devices to ensure fully secure enclave protection.',
      hasBullets: true,
      bulletTitle: 'Saga & Seeker Feature Pipeline',
      bullets: [
        'Seed Vault Security (secure enclave signing)',
        'Intent Confirmation Layer',
        'Haptic & Push alerts sync',
        'Mobile Sovereignty (fully decentralized execution from mobile)'
      ]
    },
    {
      id: 5,
      label: 'SEGMENT 6',
      title: '$SURCHI Core Token',
      tagline: 'Protocol Fuel & Governance Hub',
      icon: <Icons.Coins className="w-5 h-5 text-amber-400" />,
      description: 'The governance, utility, and value-capture token of the protocol on Solana.',
      customElement: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 text-[10.5px] font-mono">
            <div className="p-2 border border-cyber-border rounded bg-cyber-card">
              <span className="text-slate-500 block text-[9px]">TOTAL SUPPLY:</span>
              <span className="text-white font-bold">19,897,905 (Fixed)</span>
            </div>
            <div className="p-2 border border-cyber-border rounded bg-cyber-card">
              <span className="text-slate-500 block text-[9px]">NETWORK STANDARDS:</span>
              <span className="text-[#00ff88] font-bold">Solana SPL Standard</span>
            </div>
          </div>
          <div className="space-y-1.5">
            <span className="text-[9.5px] font-mono font-bold text-slate-400 uppercase tracking-wider block">Token Utilities:</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[10px] font-mono text-slate-300">
              <div className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-cyber-purple"></span>
                Governance Voting
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-cyber-purple"></span>
                Access Tiers
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-cyber-purple"></span>
                Staking Rewards
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-cyber-purple"></span>
                Treasury Coordination
              </div>
              <div className="flex items-center gap-1.5 sm:col-span-2">
                <span className="w-1 h-1 rounded-full bg-cyber-purple"></span>
                API & Intel Access
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 6,
      label: 'SEGMENT 7',
      title: 'Deflationary Engine',
      tagline: 'Continuous Volume Buybacks & Burn',
      icon: <Icons.Flame className="w-5 h-5 text-rose-400 animate-pulse" />,
      description: '25% of all protocol revenue is directed to buybacks and permanent token burn (verifiable on-chain).',
      hasBullets: true,
      bulletTitle: 'Primary Protocol Revenue Sources',
      bullets: [
        'Sentinel execution handling fees',
        'Intent-based swap routing fees',
        'Premium analytics tier subscriptions',
        'Automation module trigger access',
        'API & institutional developer subscriptions',
        'Governance proposals placement fees'
      ]
    }
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-cyber-border pb-4 mb-6">
        <div className="p-2 rounded bg-cyber-purple/10 border border-cyber-purple/30 text-cyber-purple animate-pulse">
          <Icons.Layers className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[10px] font-mono text-cyber-purple tracking-widest uppercase font-black block">ECOSYSTEM PRODUCTS</span>
          <h2 className="text-[#ffffff] font-display font-black text-lg sm:text-2xl uppercase tracking-wider leading-none">
            PRODUCTS & CORE COMPONENTS
          </h2>
        </div>
      </div>

      {/* Main product interactive tabs and view block */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Navigation columns */}
        <div className="md:col-span-1 space-y-1.5 max-h-[440px] overflow-y-auto scrollbar-none pr-1">
          {segments.map((seg) => (
            <button
              key={seg.id}
              onClick={() => setActiveSegment(seg.id)}
              className={`w-full text-left p-3 rounded-lg border transition-all cursor-pointer select-none flex items-center justify-between gap-2.5 ${
                activeSegment === seg.id
                  ? 'bg-gradient-to-r from-cyber-purple/15 to-cyber-purple/5 border-cyber-purple text-white shadow-md'
                  : 'bg-cyber-card border-cyber-border hover:border-cyber-purple/40 text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`p-1.5 rounded border ${activeSegment === seg.id ? 'bg-cyber-purple/10 border-cyber-purple/35' : 'bg-cyber-card border-cyber-border'}`}>
                  {seg.icon}
                </span>
                <div>
                  <span className="text-[8.5px] font-mono font-bold block opacity-60 tracking-widest uppercase">{seg.label}</span>
                  <span className="text-[11.5px] font-display font-black tracking-tight uppercase block leading-tight">{seg.title}</span>
                </div>
              </div>
              <Icons.ChevronRight className={`w-3.5 h-3.5 transition-transform ${activeSegment === seg.id ? 'translate-x-0.5 text-cyber-purple' : 'opacity-40'}`} />
            </button>
          ))}
        </div>

        {/* Display core card */}
        <div className="md:col-span-2 p-5 sm:p-6 bg-cyber-card border border-cyber-purple/30 rounded-xl flex flex-col justify-between shadow-[0_0_20px_rgba(110,68,255,0.04)] relative">
          <div className="absolute top-0 right-1/2 translate-x-1/2 w-64 h-32 bg-cyber-purple/5 pointer-events-none rounded-full blur-2xl"></div>

          <div className="space-y-4">
            {/* Header portion */}
            <div className="border-b border-cyber-border pb-3.5">
              <span className="px-2.5 py-0.5 rounded text-[8px] font-mono font-extrabold tracking-widest bg-cyber-purple/15 text-cyber-purple border border-cyber-purple/30 uppercase">
                {segments[activeSegment].label} — ARCHITECTURE
              </span>
              <h3 className="text-white font-display font-black text-sm sm:text-lg uppercase tracking-tight mt-1.5">
                {segments[activeSegment].title}
              </h3>
              <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest leading-none mt-1">
                {segments[activeSegment].tagline}
              </p>
            </div>

            {/* Paragraph view */}
            <p className="text-[11.5px] sm:text-xs text-slate-300 leading-relaxed font-sans select-text">
              {segments[activeSegment].description}
            </p>

            {/* Bullet list / Custom renderer */}
            {segments[activeSegment].hasBullets && segments[activeSegment].bullets && (
              <div className="space-y-2">
                <span className="text-[9.5px] font-mono font-bold text-slate-400 uppercase tracking-widest block">
                  {segments[activeSegment].bulletTitle}:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono text-slate-400">
                  {segments[activeSegment].bullets.map((b, idx) => (
                    <div key={idx} className="flex items-center gap-2 select-text hover:text-white transition-colors">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyber-purple"></span>
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Custom element rendering */}
            {segments[activeSegment].customElement}
          </div>

          <div className="border-t border-cyber-border/40 pt-3 mt-4 flex items-center justify-between text-[8px] font-mono text-slate-500">
            <span>SURCHI PROTOCOL AI COGNITIVE AGENT MODULE</span>
            <span>SECURE SYSTEM ACTIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
}
