import React, { useState, useRef } from 'react';
import * as Icons from 'lucide-react';
import html2canvas from 'html2canvas';

export default function RoadmapDashboard() {
  const roadmapRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!roadmapRef.current) return;
    setIsExporting(true);
    try {
      // Determine theme background color for perfect snapshot styling
      const isLightMode = document.documentElement.classList.contains('light');
      const bColor = isLightMode ? '#f8fafc' : '#070710';

      const canvas = await html2canvas(roadmapRef.current, {
        backgroundColor: bColor,
        scale: 2,
        logging: false,
        useCORS: true,
        onclone: (clonedDoc) => {
          const exportBtn = clonedDoc.querySelector('#export-roadmap-btn');
          if (exportBtn) {
            (exportBtn as HTMLElement).style.display = 'none';
          }
        }
      });

      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgData;
      link.download = 'surchi-ai-roadmap.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const phases = [
    {
      num: 'PHASE 1',
      title: 'Genesis & TGE',
      timeline: 'Q1–Q2 2026',
      icon: <Icons.Sparkles className="w-5 h-5 text-cyber-cyan" />,
      colorClass: 'border-cyber-cyan/35 shadow-[0_0_15px_rgba(0,229,255,0.05)]',
      dotColor: 'bg-cyber-cyan',
      items: [
        '$SURCHI Token Generation Event (TGE) on Solana Mainnet',
        'Public token distribution to presale participants (60% of supply released)',
        'Liquidity deployment on Jupiter and Raydium',
        'Squads multi-sig deployment for treasury protection',
        'DAO treasury initialization & first governance votes',
        'Website, documentation & community infrastructure launch'
      ]
    },
    {
      num: 'PHASE 2',
      title: 'Intelligence Scaling',
      timeline: 'Q3–Q4 2026',
      icon: <Icons.Cpu className="w-5 h-5 text-cyber-cyan" />,
      colorClass: 'border-cyber-cyan/35 shadow-[0_0_15px_rgba(0,229,255,0.05)]',
      dotColor: 'bg-cyber-cyan',
      items: [
        'Sentinel V1 Beta launch (Alpha + Liquidity + Execution agents live)',
        'Sentiment intelligence engine activation (live social data processing)',
        'Liquidity Sentinel deployment across all major Solana DEX pools',
        'Mobile integration with Seeker and Saga devices',
        'Premium staking modules launch',
        'Natural Language Interface (NLI) beta release',
        'Intelligence API alpha access for developers'
      ]
    },
    {
      num: 'PHASE 3',
      title: 'Sovereign Expansion',
      timeline: '2027',
      icon: <Icons.Globe className="w-5 h-5 text-cyber-neon" />,
      colorClass: 'border-cyber-neon/35 shadow-[0_0_15px_rgba(0,255,136,0.05)]',
      dotColor: 'bg-cyber-neon',
      items: [
        'DePIN inference migration → decentralized GPU networks (Render Network & Nosana)',
        'Cross-chain Liquidity Sentinel expansion → Ethereum, Arbitrum, Base, and major L2s',
        'Ethereum and L2 monitoring via Alpha Sentinel',
        'Surchi DAO full governance transition (complete decentralization to $SURCHI holders)',
        'Sentinel Registry governance activation (community can propose new Sentinel types)',
        'Institutional intelligence suite launch (enterprise API & analytics)',
        'Cross-protocol integrations with leading Solana DeFi protocols'
      ]
    },
    {
      num: 'PHASE 4',
      title: 'Singularity & Autonomy',
      timeline: '2028–2030',
      icon: <Icons.Infinity className="w-5 h-5 text-rose-400" />,
      colorClass: 'border-rose-500/35 shadow-[0_0_15px_rgba(244,63,94,0.05)]',
      dotColor: 'bg-rose-500',
      items: [
        'Global AI agent scaling across public blockchain networks with decentralized verification layers',
        'Sovereign data markets with privacy-preserving zero-knowledge proof (ZKIP) execution',
        'Full decentralized autonomy for the Sentinel network via self-executing smart contracts',
        'Next-generation cognitive inference models fine-tuned natively for cross-chain execution',
        'Universal web3 integration SDK serving as the ambient AI layer for external DeFi software'
      ]
    }
  ];

  return (
    <div ref={roadmapRef} className="space-y-6 font-sans p-1 rounded-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyber-border pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-amber-500/10 border border-amber-500/30 text-amber-500 animate-pulse">
            <Icons.Milestone className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-amber-500 tracking-widest uppercase font-black block">SYSTEM PROTOCOLS</span>
            <h2 className="text-white font-display font-black text-lg sm:text-2xl uppercase tracking-wider leading-none">
              ROADMAP & VISION
            </h2>
          </div>
        </div>

        <button
          id="export-roadmap-btn"
          onClick={handleExport}
          disabled={isExporting}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-[10px] font-mono font-black uppercase tracking-widest bg-cyber-cyan/15 hover:bg-cyber-cyan text-cyber-cyan hover:text-black border border-cyber-cyan/35 hover:border-cyber-cyan rounded-lg transition-all duration-300 disabled:opacity-50 select-none cursor-pointer"
        >
          {isExporting ? (
            <>
              <Icons.Loader2 className="w-3.5 h-3.5 animate-spin text-cyber-cyan" />
              <span>EXPORTING SYSTEM MAP...</span>
            </>
          ) : (
            <>
              <Icons.Download className="w-3.5 h-3.5" />
              <span>EXPORT TO PNG</span>
            </>
          )}
        </button>
      </div>

      {/* Main Roadmap Timeline / Bento-Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 relative">
        {phases.map((phase, idx) => (
          <div 
            key={idx}
            className={`border bg-cyber-card rounded-xl p-5 relative flex flex-col justify-between transition-all duration-300 hover:scale-[1.01] hover:bg-cyber-card-light group ${phase.colorClass}`}
          >
            {/* Phase Tag */}
            <div className="flex items-center justify-between gap-2 border-b border-cyber-border pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-cyber-card border border-cyber-border">
                  {phase.icon}
                </span>
                <div>
                  <span className="text-[10px] font-mono font-black text-slate-500 block uppercase tracking-wider">{phase.num}</span>
                  <h3 className="text-white font-display font-black text-xs sm:text-sm uppercase tracking-tight">{phase.title}</h3>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold text-slate-400 bg-cyber-card border border-cyber-border">
                {phase.timeline}
              </span>
            </div>

            {/* Content List Items */}
            <div className="flex-1 space-y-3">
              {phase.items.map((item, idy) => (
                <div key={idy} className="flex items-start gap-2.5 text-slate-300">
                  <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${phase.dotColor}`}></span>
                  <span className="text-[11px] leading-relaxed text-slate-300 font-sans">{item}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Long-Term Vision Panel */}
      <div className="p-5 rounded-xl border border-cyber-border bg-cyber-card space-y-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-cyan/5 blur-3xl rounded-full pointer-events-none"></div>
        <div className="flex items-center gap-2 border-b border-cyber-border pb-2">
          <Icons.Radio className="w-4 h-4 text-cyber-cyan animate-pulse" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Long-Term Vision Summary
          </h4>
        </div>
        <p className="text-[11.5px] text-slate-400 leading-relaxed font-sans max-w-5xl">
          SURCHI aims to become the autonomous AI intelligence layer for sovereign on-chain execution — democratizing access to institutional-grade market intelligence for all DeFi participants. The end state is a fully community-owned, multi-chain, decentralized AI protocol where the Sentinel network operates autonomously 24/7 across all major blockchain ecosystems.
        </p>
        <div className="pt-2 text-center">
          <span className="font-mono text-xs text-amber-500 font-black italic tracking-widest uppercase">
            &ldquo;Decentralized. Secure. Autonomous.&rdquo;
          </span>
        </div>
      </div>
    </div>
  );
}
