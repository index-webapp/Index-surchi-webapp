import React from 'react';
import * as Icons from 'lucide-react';
import { AnalysisResult } from '../types';

interface IntelligenceArchivesProps {
  historyList: AnalysisResult[];
  activeModuleId: string;
  onReload: (result: AnalysisResult) => void;
  onDelete: (id: string) => void;
  onPurge: () => void;
  onClose: () => void;
  themeMode?: 'dark' | 'light';
}

export default function IntelligenceArchives({
  historyList,
  activeModuleId,
  onReload,
  onDelete,
  onPurge,
  onClose,
  themeMode = 'dark'
}: IntelligenceArchivesProps) {
  const isLight = themeMode === 'light';

  const downloadReportJson = (item: AnalysisResult) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(item, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `surchi-report-${item.moduleId}-${Date.now()}.json`);
    dlAnchorElem.click();
  };

  return (
    <div className="space-y-6 animate-fade-in text-left">
      {/* Header section */}
      <div className="space-y-2">
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-widest ${
          isLight
            ? 'bg-indigo-50 border border-indigo-250 text-indigo-750'
            : 'bg-[#1b0a23] border border-cyber-purple/30 text-cyber-purple shadow-[0_0_8px_rgba(235,0,255,0.05)]'
        }`}>
          <Icons.Archive className="w-3.5 h-3.5 text-cyber-purple animate-pulse" /> security storage unit
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className={`text-2xl md:text-3xl font-bold tracking-tight font-display flex items-center gap-3 ${
            isLight ? 'text-slate-900 font-extrabold' : 'text-[#ffffff]'
          }`}>
            <Icons.FolderOpen className="w-7 h-7 text-cyber-purple" />
            Intelligence Archives Hub
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
          Review and audit all historically compiled tokenomics graphs, smart contract evaluations, and sentiment vectors stored in local diagnostic browser buffers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main List Table */}
        <div className={`lg:col-span-9 border rounded-xl p-5 md:p-6 space-y-4 text-left ${
          isLight ? 'bg-white border-slate-200' : 'bg-[#04040a] border-cyber-border'
        }`}>
          <div className="flex justify-between items-center border-b border-cyber-border/40 pb-2.5">
            <h3 className={`text-xs font-mono font-black uppercase tracking-wider ${isLight ? 'text-slate-800' : 'text-[#ffffff]'}`}>
              ACTIVE INTEL REPORTS VAULT ({historyList.length} SAVED SLOTS)
            </h3>
            {historyList.length > 0 && (
              <button
                onClick={onPurge}
                className="px-2.5 py-1.5 bg-rose-950/20 hover:bg-rose-900/30 text-rose-450 text-rose-400 border border-rose-950/40 rounded text-[9px] font-mono uppercase font-bold animate-pulse"
              >
                Clear Archives
              </button>
            )}
          </div>

          {historyList.length === 0 ? (
            <div className="py-16 text-center space-y-2 max-w-md mx-auto font-mono text-xs">
              <Icons.FolderPlus className="w-12 h-12 text-slate-650 mx-auto" />
              <p className="font-bold text-slate-400">Vault coordinates empty.</p>
              <p className="text-slate-500 text-[11px]">Compile any token analysis or launch planner module to populate secure offline archives slots automatically.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-cyber-border/40 text-slate-500 uppercase font-black text-[9px]">
                    <th className="pb-3 pr-4">Forensic Module</th>
                    <th className="pb-3 pr-4">Details / Parameters</th>
                    <th className="pb-3 pr-4">Saved On</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyber-border/30">
                  {historyList.map((item) => (
                    <tr key={item.id} className="hover:bg-cyber-card/15 group">
                      <td className="py-3.5 pr-4">
                        <div className="flex items-center gap-2">
                          <span className={`p-1 rounded bg-[#01010c] border border-cyber-border/40 text-[#ffffff]`}>
                            {item.moduleId === 'token_analyzer' && <Icons.Activity className="w-3.5 h-3.5 text-cyber-cyan" />}
                            {item.moduleId === 'neural_sentiment_engine' && <Icons.Brain className="w-3.5 h-3.5 text-cyber-purple" />}
                            {item.moduleId === 'smart_money_tracker' && <Icons.Wallet className="w-3.5 h-3.5 text-cyber-cyan" />}
                            {item.moduleId === 'rug_radar' && <Icons.Radio className="w-3.5 h-3.5 text-cyber-green" />}
                            {item.moduleId === 'agent_deployer' && <Icons.Cpu className="w-3.5 h-3.5 text-cyber-purple" />}
                            {!['token_analyzer', 'neural_sentiment_engine', 'smart_money_tracker', 'rug_radar', 'agent_deployer'].includes(item.moduleId) && <Icons.Compass className="w-3.5 h-3.5 text-slate-400" />}
                          </span>
                          <span className="font-bold text-slate-205">{item.moduleName}</span>
                        </div>
                      </td>
                      <td className="py-3.5 pr-4 text-slate-400 max-w-xs truncate">
                        {Object.entries(item.payload).filter(([k]) => k !== 'liveDetails').map(([k, v]) => `${k.toUpperCase()}: ${v}`).join(' | ')}
                      </td>
                      <td className="py-3.5 pr-4 text-[10px] text-slate-500 whitespace-nowrap">
                        {item.timestamp}
                      </td>
                      <td className="py-3.5 text-right whitespace-nowrap">
                        <div className="inline-flex gap-1.5">
                          <button
                            onClick={() => onReload(item)}
                            title="Load Report to Current Workspace"
                            className="p-1 px-2 rounded bg-indigo-650/15 text-indigo-400 border border-indigo-650/30 hover:border-indigo-400 hover:text-[#ffffff] transition-colors cursor-pointer text-[10px] uppercase font-bold"
                          >
                            Read
                          </button>
                          <button
                            onClick={() => downloadReportJson(item)}
                            title="Export Report Ledger in JSON"
                            className="p-1 rounded bg-cyber-card-light/40 text-slate-400 border border-cyber-border/40 hover:border-cyber-cyan hover:text-cyber-cyan transition-colors cursor-pointer"
                          >
                            <Icons.Download className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDelete(item.id)}
                            title="Delete Saved Slot"
                            className="p-1 rounded bg-rose-950/20 text-red-550 border border-transparent hover:border-rose-500 hover:bg-rose-900/30 transition-colors cursor-pointer"
                          >
                            <Icons.Trash className="w-3.5 h-3.5 text-rose-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Info panel */}
        <div className="lg:col-span-3 space-y-4">
          <div className={`border rounded-xl p-5 space-y-4 ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#060613]/55 border-cyber-border'
          }`}>
            <h4 className="text-xs font-mono font-black text-slate-400 uppercase tracking-widest">
              SYSTEM MEMORY MATRIX
            </h4>
            <div className="text-[11px] font-mono leading-relaxed space-y-3">
              <p className="text-slate-500">
                Data persistence is maintained securely in the local browser offline storage cluster. No personal information or smart contracts compiled ever traverse external cloud databases.
              </p>
              <div className="border-t border-cyber-border/40 pt-3 flex flex-col gap-2 text-slate-400">
                <div className="flex justify-between">
                  <span>Saves Limit:</span>
                  <span className="font-bold">100 Slots</span>
                </div>
                <div className="flex justify-between">
                  <span>Encryption:</span>
                  <span className="font-bold text-[#00ff88]">AES-Consensus</span>
                </div>
                <div className="flex justify-between">
                  <span>Cloud Sync:</span>
                  <span className="font-bold text-red-500">DISABLED (Offline)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
