import React, { useState } from 'react';
import * as Icons from 'lucide-react';

interface AlertsManagerProps {
  onClose: () => void;
  themeMode?: 'dark' | 'light';
}

export default function AlertsManager({ onClose, themeMode = 'dark' }: AlertsManagerProps) {
  const isLight = themeMode === 'light';

  const [webhookUrl, setWebhookUrl] = useState('');
  const [platform, setPlatform] = useState('discord');
  const [targetToken, setTargetToken] = useState('SURCHI');
  const [riskThreshold, setRiskThreshold] = useState('75');
  const [vestingTrigger, setVestingTrigger] = useState(true);
  const [status, setStatus] = useState<'idle' | 'saving' | 'success'>('idle');

  // Simulated alert feed
  const [feed, setFeed] = useState([
    { id: 1, type: 'CRITICAL', msg: 'Rug Radar triggered: Contract 0x71cA...blacklist checks compiled modified.', time: '13:04:12 UTC', asset: 'BONK_COIN' },
    { id: 2, type: 'WARNING', msg: 'Sentiment score dropped 12 points within 15M socials aggregate.', time: '12:45:22 UTC', asset: 'SOLANA' },
    { id: 3, type: 'INFO', msg: 'Smart Money Tracker: Whale wallet 8Bno... added 450,000 SURCHI.', time: '11:15:02 UTC', asset: 'SURCHI' }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('saving');
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => setStatus('idle'), 2000);
      
      // Prepend an alert that simulation is initialized
      setFeed(prev => [
        {
          id: Date.now(),
          type: 'INFO',
          msg: `A-Sentinel connection established: Target ${targetToken} monitored, push status: STABLE.`,
          time: new Date().toLocaleTimeString() + ' UTC',
          asset: targetToken
        },
        ...prev
      ]);
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-fade-in text-left">
      {/* Header section */}
      <div className="space-y-2">
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-widest ${
          isLight
            ? 'bg-indigo-50 border border-indigo-250 text-indigo-750'
            : 'bg-[#0f1d14]/75 border border-cyber-cyan/35 text-[#00ff88] shadow-[0_0_8px_rgba(0,255,136,0.05)]'
        }`}>
          <Icons.Bell className="w-3.5 h-3.5 text-cyber-neon animate-pulse" /> security alert sentinel controller
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className={`text-2xl md:text-3xl font-bold tracking-tight font-display flex items-center gap-3 ${
            isLight ? 'text-slate-900 font-extrabold' : 'text-[#ffffff]'
          }`}>
            <Icons.Radio className="w-7 h-7 text-cyber-neon" fill="none" />
            AI-Sentinel Discord & Webhook Hub
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
          Configure automatic AI-driven discord channels, telegram push notifications, or custom server webhook triggers for new honeypot alerts and large whale transfers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Setup Form */}
        <div className={`lg:col-span-7 border rounded-xl p-5 md:p-6 space-y-4 text-left ${
          isLight ? 'bg-white border-slate-200' : 'bg-[#04040a] border-cyber-border'
        }`}>
          <h3 className={`text-xs font-mono font-black uppercase tracking-wider ${isLight ? 'text-slate-800' : 'text-[#ffffff]'}`}>
            CONSTRUCT Sentinel ALERTS ROUTER
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-slate-400 font-bold block">Webhook Platform Type</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className={`w-full p-3 rounded-lg border bg-[#060611] text-slate-200 font-mono text-xs focus:outline-hidden focus:border-cyber-cyan/50 ${
                    isLight ? 'border-slate-300 bg-slate-50' : 'border-cyber-border/85'
                  }`}
                >
                  <option value="discord">👾 Discord Webhook Channel</option>
                  <option value="telegram">✈️ Telegram Bot Channel</option>
                  <option value="custom">🌐 Custom REST API Webhook</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400 font-bold block">Monitoring Target Ticker / CA</label>
                <input
                  type="text"
                  required
                  value={targetToken}
                  onChange={(e) => setTargetToken(e.target.value)}
                  placeholder="e.g., BONK, SURCHI, SOL..."
                  className={`w-full p-3 rounded-lg border bg-[#060611] text-slate-200 font-mono text-xs focus:outline-hidden focus:border-cyber-cyan/50 ${
                    isLight ? 'border-slate-300 bg-slate-50' : 'border-cyber-border/85'
                  }`}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-400 font-bold block">Webhook Endpoint Server URL</label>
              <input
                type="url"
                required
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://discord.com/api/webhooks/your-channel-token..."
                className={`w-full p-3 rounded-lg border bg-[#060611] text-slate-200 font-mono text-xs focus:outline-hidden focus:border-cyber-cyan/50 ${
                  isLight ? 'border-slate-300 bg-slate-50' : 'border-cyber-border/85'
                }`}
              />
            </div>

            <div className="space-y-3 border-t border-cyber-border/40 pt-3">
              <span className="text-slate-400 font-bold block mb-1">AI SENTINEL ROUTING CONDITIONS</span>
              
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span>Trigger alert if Risk Score exceeds</span>
                  <select
                    value={riskThreshold}
                    onChange={(e) => setRiskThreshold(e.target.value)}
                    className="p-1 px-2 border border-cyber-border/80 bg-[#060611] text-slate-250 text-xs font-bold select-none text-slate-200"
                  >
                    <option value="50">50% (High sensitivity)</option>
                    <option value="75">75% (Security standard)</option>
                    <option value="90">90% (Catastrophic only)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <span>Alert on heavy vesting locks transfers</span>
                  <input
                    type="checkbox"
                    checked={vestingTrigger}
                    onChange={(e) => setVestingTrigger(e.target.checked)}
                    className="w-4 h-4 accent-cyber-neon"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={status === 'saving'}
              className="w-full py-3 bg-gradient-to-r from-cyan-600 to-indigo-650 hover:from-cyan-500 hover:to-indigo-550 text-white rounded-lg font-bold tracking-widest uppercase transition-all shadow-md select-none cursor-pointer flex items-center justify-center gap-2"
            >
              {status === 'saving' ? (
                <>
                  <Icons.Loader2 className="w-4 h-4 animate-spin text-white" />
                  CONNECTING COORDINATES...
                </>
              ) : status === 'success' ? (
                <>
                  <Icons.Check className="w-4 h-4 text-emerald-400 animate-bounce" />
                  SENTINEL GRID ONLINE!
                </>
              ) : (
                <>
                  <Icons.Activity className="w-4 h-4 text-[#00ff88]" />
                  LAUNCH ACTIVE ALERT WEBHOOK
                </>
              )}
            </button>
          </form>
        </div>

        {/* Live Logs monitoring Feed */}
        <div className="lg:col-span-5 space-y-4">
          <div className={`border rounded-xl p-5 space-y-4 text-left flex flex-col h-full justify-between ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#060611] border-cyber-border/70'
          }`}>
            <div>
              <div className="flex items-center justify-between border-b border-cyber-border/40 pb-2 mb-3">
                <span className="text-[10px] font-mono font-black uppercase tracking-widest text-[#00ff88]">
                  ● Live Alert Sentinel Feed
                </span>
                <span className="text-[8px] font-mono text-slate-500 uppercase">STREAM STABLE</span>
              </div>

              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {feed.map((log) => (
                  <div key={log.id} className="p-2 bg-[#020206] rounded border border-cyber-border/40 font-mono text-[10px] leading-relaxed space-y-1 relative">
                    <div className="flex items-center justify-between">
                      <span className={`font-black uppercase tracking-widest text-[8px] px-1 py-0.5 rounded leading-none ${
                        log.type === 'CRITICAL' ? 'bg-red-950/20 text-red-400' : log.type === 'WARNING' ? 'bg-amber-955/20 text-amber-400' : 'bg-cyan-955/20 text-cyber-cyan'
                      }`}>
                        {log.type}
                      </span>
                      <span className="text-slate-500 text-[8px]">{log.time}</span>
                    </div>
                    <p className="text-slate-350">{log.msg}</p>
                    <span className="absolute bottom-1 right-2 text-[8px] font-bold text-slate-600">[{log.asset}]</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-[10px] font-mono text-slate-550 border-t border-cyber-border/30 pt-3 flex items-center justify-between mt-3">
              <span>ACTIVE HOOK CONSOLE</span>
              <span className="animate-pulse text-[#00ff88]">● STANDBY_GATEWAY</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
