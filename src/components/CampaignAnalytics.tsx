import React, { useState } from 'react';
import * as Icons from 'lucide-react';

interface CampaignAnalyticsProps {
  onClose: () => void;
  themeMode?: 'dark' | 'light';
}

export default function CampaignAnalytics({ onClose, themeMode = 'dark' }: CampaignAnalyticsProps) {
  const isLight = themeMode === 'light';

  const [activeTab, setActiveTab] = useState<'overview' | 'channels' | 'roi'>('overview');

  const stats = [
    { label: 'Total Engagement ROI', value: '2.45x', change: '+14.2%', profit: true, icon: Icons.TrendingUp, color: 'text-[#00ff88]' },
    { label: 'Aggregated Impressions', value: '354,203', change: '+28.5%', profit: true, icon: Icons.Eye, color: 'text-cyber-cyan' },
    { label: 'Click-Through Rate (CTR)', value: '4.82%', change: '+1.12%', profit: true, icon: Icons.MousePointerClick, color: 'text-cyber-cyan' },
    { label: 'Active Budget Spent', value: '$1,250 / $5,000', change: '25% Burnt', profit: false, icon: Icons.Coins, color: 'text-amber-400' }
  ];

  const channelsData = [
    { name: 'DexScreener Premium Banner', impressions: '142,500', clicks: '6,412', ctr: '4.50%', spent: '$450', status: 'ACTIVE' },
    { name: 'CoinGecko Top Banner Ad', impressions: '110,203', clicks: '5,510', ctr: '5.00%', spent: '$500', status: 'ACTIVE' },
    { name: 'Solana Alpha Telegram Shills', impressions: '54,000', clicks: '2,916', ctr: '5.40%', spent: '$150', status: 'ACTIVE' },
    { name: 'X (Twitter) KOL Wave 1', impressions: '47,500', clicks: '2,232', ctr: '4.70%', spent: '$150', status: 'PAUSED' }
  ];

  return (
    <div className="space-y-6 animate-fade-in text-left">
      {/* Header section */}
      <div className="space-y-2">
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-widest ${
          isLight
            ? 'bg-indigo-50 border border-indigo-250 text-indigo-750'
            : 'bg-[#0f0f2d] border border-cyber-cyan/30 text-cyber-cyan shadow-[0_0_8px_rgba(0,229,255,0.05)]'
        }`}>
          <Icons.Megaphone className="w-3.5 h-3.5 text-cyber-cyan animate-pulse" /> campaign management terminal
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className={`text-2xl md:text-3xl font-bold tracking-tight font-display flex items-center gap-3 ${
            isLight ? 'text-slate-900 font-extrabold' : 'text-[#ffffff]'
          }`}>
            <Icons.BarChart3 className="w-7 h-7 text-cyber-cyan" />
            Ad Campaign Analytics & ROI Monitor
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
          Measure direct blockchain conversion statistics, click logs, budget emissions, and community acquisition growth curves relative to active ad placements.
        </p>
      </div>

      {/* Grid of Key Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const IconComp = stat.icon;
          return (
            <div
              key={i}
              className={`p-4 rounded-xl border text-left flex flex-col justify-between space-y-3 shadow-sm ${
                isLight
                  ? 'bg-white border-slate-200'
                  : 'bg-[#0a0a1f] border-cyber-border/80 hover:border-cyber-cyan/35'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-mono uppercase font-bold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  {stat.label}
                </span>
                <IconComp className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div className="flex items-baseline justify-between">
                <span className={`text-xl font-bold font-display ${isLight ? 'text-slate-900' : 'text-[#ffffff]'}`}>
                  {stat.value}
                </span>
                <span className={`text-[9px] font-extrabold font-mono px-1.5 py-0.5 rounded leading-none ${
                  stat.profit 
                    ? 'bg-emerald-500/10 text-[#00ff88]'
                    : isLight ? 'bg-slate-100 text-slate-500' : 'bg-cyber-card-light text-slate-400'
                }`}>
                  {stat.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-cyber-border/40 gap-4">
        {(['overview', 'channels', 'roi'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2.5 px-1 text-xs font-bold font-mono uppercase tracking-wider relative cursor-pointer ${
              activeTab === tab
                ? isLight ? 'text-indigo-650' : 'text-cyber-cyan'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                isLight ? 'bg-indigo-600' : 'bg-cyber-cyan shadow-[0_0_6px_var(--color-cyber-cyan)]'
              }`}></span>
            )}
          </button>
        ))}
      </div>

      {/* Main Panel Content */}
      <div className={`p-5 rounded-xl border ${
        isLight ? 'bg-white border-slate-200' : 'bg-[#04040a] border-cyber-border'
      }`}>
        {activeTab === 'overview' && (
          <div className="space-y-5">
            <h4 className={`text-xs font-mono font-black uppercase tracking-widest ${isLight ? 'text-slate-800' : 'text-cyber-cyan'}`}>
              AUTOMATED AI AD CTR BOOST FEEDBACK
            </h4>
            <div className={`p-4 rounded-lg border leading-relaxed text-xs space-y-3 font-mono ${
              isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-cyber-card/30 border-cyber-border/40 text-slate-300'
            }`}>
              <div className="flex items-center gap-2 text-[#00ff88] font-bold">
                <Icons.Sparkles className="w-4 h-4 text-[#00ff88] animate-spin" />
                <span>AI SENTINEL AUDIT DETECTED HEAVY SHIFT</span>
              </div>
              <p>
                Our quantum feedback loop indicates that swapping the background token visuals from <strong>"Laser Cyan" to "Quantum Emerald Theme"</strong> on continuous ad rotators in DEXScreener increased aggregate CTR from <strong>3.2% to 4.82%</strong> (+33.5% conversion increase).
              </p>
              <div className="text-[10px] text-slate-550 border-t border-cyber-border/30 pt-2 flex items-center justify-between">
                <span>SUGGESTION: Lock background templates to Emerald parameters immediately.</span>
                <span className="text-[#00ff88] font-bold">STABLE ACTION RESERVED</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className={`p-3 border rounded-lg ${isLight ? 'border-indigo-100 bg-slate-50/55' : 'border-cyber-border/40 bg-cyber-card/25'}`}>
                <span className="font-bold text-[#ffffff] dark:text-[#ffffff] block mb-1">🎯 Core Demographic Focus</span>
                <span className="text-[11px] text-slate-400">Solana retail memecoin swap traders, active L1 protocol yield nodes, and professional NFT stackers.</span>
              </div>
              <div className={`p-3 border rounded-lg ${isLight ? 'border-slate-200 bg-slate-50/55' : 'border-cyber-border/40 bg-cyber-card/25'}`}>
                <span className="font-bold text-[#ffffff] dark:text-[#ffffff] block mb-1">📊 Budget Distribution Priority</span>
                <span className="text-[11px] text-slate-400">75% allocated to high-yield instant click banners, 25% to decentralized community shill systems.</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'channels' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-cyber-border/60 text-slate-500 uppercase font-black text-[10px]">
                  <th className="pb-3 pr-4">Channel Placement Source</th>
                  <th className="pb-3 pr-4">Impressions</th>
                  <th className="pb-3 pr-4">Clicks</th>
                  <th className="pb-3 pr-4">CTR</th>
                  <th className="pb-3 pr-4">Spent</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyber-border/35">
                {channelsData.map((channel, idx) => (
                  <tr key={idx} className="hover:bg-cyber-card/10">
                    <td className="py-3.5 pr-4 font-bold text-slate-250 text-slate-200">{channel.name}</td>
                    <td className="py-3.5 pr-4 text-slate-400">{channel.impressions}</td>
                    <td className="py-3.5 pr-4 text-slate-400">{channel.clicks}</td>
                    <td className="py-3.5 pr-4 font-bold text-cyber-cyan">{channel.ctr}</td>
                    <td className="py-3.5 pr-4 text-slate-200">{channel.spent}</td>
                    <td className="py-3.5 text-right">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded leading-none ${
                        channel.status === 'ACTIVE' 
                          ? 'bg-[#00ff88]/15 text-[#00ff88] animate-pulse border border-[#00ff88]/30'
                          : 'bg-slate-500/10 text-slate-400 border border-slate-550'
                      }`}>
                        {channel.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'roi' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className={`text-xs font-mono font-black uppercase tracking-widest ${isLight ? 'text-slate-800' : 'text-cyber-cyan'}`}>
                CAPITAL RE-ACQUISITION MATRIX (ROI SCALE)
              </h4>
              <span className="text-[10px] text-slate-500 font-mono">DETERMINED BY TIGHT CONVERSION TRAGETS</span>
            </div>
            
            <div className="space-y-4 font-mono text-xs text-slate-400">
              <div className="space-y-1">
                <div className="flex justify-between font-bold text-slate-300">
                  <span>Placements Direct ROI Conversion Target</span>
                  <span className="text-[#00ff88]">2.45x / 3.00x Goal</span>
                </div>
                <div className="w-full bg-cyber-card-light/40 h-2 rounded-full overflow-hidden border border-cyber-border/30">
                  <div className="bg-[#00ff88] h-full shadow-[0_0_8px_#00ff88]" style={{ width: '81%' }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-bold text-slate-300">
                  <span>Community Retention Index</span>
                  <span className="text-cyber-cyan">94% Retention</span>
                </div>
                <div className="w-full bg-cyber-card-light/40 h-2 rounded-full overflow-hidden border border-cyber-border/30">
                  <div className="bg-cyber-cyan h-full shadow-[0_0_8px_var(--color-cyber-cyan)]" style={{ width: '94%' }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-bold text-slate-300">
                  <span>CPC Cost-Reduction Target</span>
                  <span className="text-cyber-cyan">$0.18 / $0.15 Goal</span>
                </div>
                <div className="w-full bg-cyber-card-light/40 h-2 rounded-full overflow-hidden border border-cyber-border/30">
                  <div className="bg-cyber-cyan h-full shadow-[0_0_8px_var(--color-cyber-cyan)]" style={{ width: '70%' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
