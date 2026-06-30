import React, { useState, useEffect, useRef } from 'react';
import * as Icons from 'lucide-react';

interface SurchiBuildingStatusProps {
  onComplete?: () => void;
  themeMode?: 'dark' | 'light';
}

export default function SurchiBuildingStatus({ onComplete, themeMode = 'dark' }: SurchiBuildingStatusProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [systemLogs, setSystemLogs] = useState<string[]>([]);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const steps = [
    { label: 'RPC CONNECT', desc: 'Bootstrapping Solana high-speed node channels', tag: 'RPC_OK' },
    { label: 'SEED VAULT', desc: 'Secure Handshake with Seeker Secure Enclave', tag: 'SEC_OK' },
    { label: 'ALPHA CORE', desc: 'Tuning sentiment intelligence NLP models', tag: 'NLP_OK' },
    { label: 'LIQUIDITY MAP', desc: 'Syncing pool surveillance radar matrices', tag: 'MAP_OK' },
    { label: 'EXECUTION AGENT', desc: 'Routing Jupiter swap transaction endpoints', tag: 'ROUT_OK' },
    { label: 'NLI CONTROLLER', desc: 'Initializing Plain-English strategy compiler', tag: 'COMP_OK' },
    { label: 'REVENUE BURN', desc: 'Activating auto-buyback deflationary triggers', tag: 'BURN_OK' },
    { label: 'ORACLE STATUS', desc: 'SURCHI Cognitive Layer fully online ⚡', tag: 'READY' }
  ];

  const STEP_LOGS: Record<number, string[]> = {
    0: [
      "[INFO] Contacting RPC node clusters...",
      "[INFO] Connected to Solana Mainnet RPC endpoint (Helius).",
      "[DEBUG] Latency validated: 14ms (Optimal speed).",
      "[SUCCESS] Genesis hash validated. Node synchronization: 100%."
    ],
    1: [
      "[SEC] Initializing secure handshake with Seeker Secure Enclave...",
      "[SEC] Cryptographic certificate verification: SUCCESS.",
      "[INFO] Key exchange protocols loaded. Device seed vault is secure."
    ],
    2: [
      "[AI-ML] Tuning cognitive sentiment Natural Language Processing models...",
      "[AI-ML] Mapping 10,000 top social channels and Telegram chat streams...",
      "[SUCCESS] Social chatter index synchronized. Alpha Sentiment Core ready."
    ],
    3: [
      "[SURV] Scanning AMM liquidity positions (DEXScreener, Jupiter, Raydium)...",
      "[SURV] Mapping token reserves: SOL, USDC, BONK, and SURCHI...",
      "[SUCCESS] Pool surveillance radar status: SYNCHRONIZED."
    ],
    4: [
      "[EXEC] Querying high-speed transactions route engines...",
      "[EXEC] Jupiter Aggregator API connection established.",
      "[SUCCESS] Dynamic slippage limits optimized. Routing channels established."
    ],
    5: [
      "[COMPILER] Invoking NLI (Natural Language Interface) parsing systems...",
      "[COMPILER] Preloading transformer tokens for conversational prompt interface...",
      "[SUCCESS] Plain-English strategy query compiler fully loaded."
    ],
    6: [
      "[BURN] Connecting to SURCHI smart contract buyback trigger registers...",
      "[BURN] Verifying transaction burn fee schedules (Current: 2.1%).",
      "[SUCCESS] Auto-deflationary burn vaults initialized."
    ],
    7: [
      "[SYS] Synchronizing cognitive feedback registers...",
      "[SYS] Surchi Cognitive Core fully aligned. Terminal diagnostics online.",
      "[SUCCESS] STATUS FLASH: ORACLE IS ONLINE. READY TO RECEIVE INSTRUCTIONS."
    ]
  };

  // Run the sequence automated or paused
  useEffect(() => {
    if (!isRunning) return;

    const totalSteps = steps.length;
    const stepDuration = 2000; // time spent on each step

    const stepInterval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev < totalSteps - 1) {
          return prev + 1;
        } else {
          setIsRunning(false); // Stop when all steps are completed
          return prev;
        }
      });
    }, stepDuration);

    return () => clearInterval(stepInterval);
  }, [isRunning, steps.length]);

  // Ticking progress within the active step
  useEffect(() => {
    setProgress(0);
    if (!isRunning && activeStep === steps.length - 1) {
      setProgress(100);
      return;
    }

    const intervalTime = 80;
    const increment = 100 / (2000 / intervalTime);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 100) return Math.min(100, prev + increment);
        return prev;
      });
    }, intervalTime);

    return () => clearInterval(progressInterval);
  }, [activeStep, isRunning]);

  // Append logs as activeStep progresses
  useEffect(() => {
    const newLogs = STEP_LOGS[activeStep] || [];
    let logDelay = 0;

    newLogs.forEach((log) => {
      setTimeout(() => {
        setSystemLogs((prev) => [...prev, `${new Date().toLocaleTimeString()} ${log}`].slice(-30));
      }, logDelay);
      logDelay += 400; // staggered rendering of steps
    });
  }, [activeStep]);

  // Handle auto-scroll terminal logs
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [systemLogs]);

  const restartTracking = () => {
    setSystemLogs(["[SYSTEM] Re-initializing core ledger checks...", `[SYSTEM] Reset sequence count: 0`]);
    setActiveStep(0);
    setProgress(0);
    setIsRunning(true);
  };

  const isLight = themeMode === 'light';

  const allCompleted = !isRunning && activeStep === steps.length - 1;

  return (
    <div className={`w-full max-w-xl mx-auto p-5 border rounded-xl shadow-lg space-y-5 relative overflow-hidden select-none animate-fade-in text-left ${
      isLight 
        ? 'bg-slate-50 border-slate-200 shadow-slate-200/50' 
        : 'bg-cyber-card border-cyber-border hover:border-[#a855f7]/40 shadow-[0_0_20px_rgba(168,85,247,0.08)]'
    }`}>
      {/* Background radial glow */}
      {!isLight && (
        <div className="absolute top-0 right-0 w-28 h-28 bg-[#a855f7]/5 rounded-full blur-2xl pointer-events-none"></div>
      )}
      
      {/* Loading telemetry banner header */}
      <div className={`flex items-center justify-between text-[11px] font-mono border-b pb-3 ${isLight ? 'border-slate-200' : 'border-cyber-border'}`}>
        <div className="flex items-center gap-1.5 font-bold">
          <Icons.Radio className={`w-4 h-4 animate-pulse ${isLight ? 'text-indigo-600' : 'text-cyber-cyan'}`} />
          <span className={isLight ? 'text-indigo-900' : 'text-cyber-cyan'}>SYSTEM PROTOCOL INITIALIZATION</span>
        </div>
        <div className="flex items-center gap-1.5 font-bold text-slate-500">
          <span className="animate-pulse">STEP {activeStep + 1}/{steps.length}</span>
          <span>&bull;</span>
          <span className={isLight ? 'text-indigo-600' : 'text-[#a855f7]'}>
            {Math.floor(((activeStep + (progress / 100)) / steps.length) * 100)}%
          </span>
        </div>
      </div>

      {/* Checklist Grid containing progressive states */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {steps.map((step, idx) => {
          const isCompleted = idx < activeStep || (allCompleted && idx === steps.length - 1);
          const isActive = idx === activeStep && !allCompleted;
          const isPending = idx > activeStep;

          return (
            <div 
              key={idx} 
              className={`flex items-center justify-between gap-2.5 p-2 rounded-lg border transition-all ${
                isActive 
                  ? isLight
                    ? 'bg-indigo-50/50 border-indigo-300 shadow-sm scale-[1.01]'
                    : 'bg-cyber-cyan/10 border-[#00E5FF]/40 shadow-[0_0_12px_rgba(0,229,255,0.06)] scale-[1.01]' 
                  : isCompleted
                    ? isLight
                      ? 'bg-slate-100 border-slate-200/60 opacity-80'
                      : 'bg-transparent border-cyber-border/40 opacity-75'
                    : 'bg-transparent border-transparent opacity-35'
              }`}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                {/* Checking Indicators */}
                <div className="shrink-0">
                  {isCompleted ? (
                    <span className="flex items-center justify-center w-4 h-4 rounded bg-[#00ff88]/15 border border-[#00ff88]/30 text-[#00ff88] text-[9px] font-mono font-black">
                      <Icons.Check className="w-2.5 h-2.5 text-[#00ff88]" />
                    </span>
                  ) : isActive ? (
                    <span className={`flex items-center justify-center w-4 h-4 rounded text-[9px] font-mono font-black animate-pulse ${
                      isLight ? 'bg-indigo-100 border border-indigo-300' : 'bg-[#a855f7]/15 border border-[#a855f7]/40'
                    }`}>
                      <Icons.Loader2 className={`w-2.5 h-2.5 animate-spin ${isLight ? 'text-indigo-600' : 'text-[#a855f7]'}`} />
                    </span>
                  ) : (
                    <span className={`flex items-center justify-center w-4 h-4 rounded border text-[9px] font-mono font-bold ${
                      isLight ? 'bg-slate-200 border-slate-300 text-slate-500' : 'bg-[#0e0e24] border-cyber-border text-slate-600'
                    }`}>
                      {idx + 1}
                    </span>
                  )}
                </div>

                <div className="min-w-0">
                  <span className={`text-[10px] font-mono font-bold tracking-wider block uppercase truncate ${
                    isActive ? (isLight ? 'text-indigo-900' : 'text-white') : isCompleted ? (isLight ? 'text-slate-700' : 'text-slate-300') : 'text-slate-500'
                  }`}>
                    {step.label}
                  </span>
                </div>
              </div>

              {/* Status Signal Badge */}
              <div className="shrink-0">
                {isCompleted ? (
                  <span className="text-[8px] font-mono font-black text-[#00ff88] bg-[#00ff88]/10 px-1.5 py-0.5 rounded border border-[#00ff88]/25 uppercase tracking-wider">
                    {step.tag}
                  </span>
                ) : isActive ? (
                  <span className={`text-[8px] font-mono font-black px-1.5 py-0.5 rounded border uppercase tracking-wider animate-pulse ${
                    isLight ? 'text-indigo-700 bg-indigo-50 border-indigo-200' : 'text-[#a855f7] bg-[#a855f7]/10 border border-[#a855f7]/25'
                  }`}>
                    ACTIVE
                  </span>
                ) : (
                  <span className="text-[8px] font-mono font-bold text-slate-600 bg-transparent px-1.5 py-0.5 rounded uppercase tracking-wider">
                    PENDING
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* UPGRADED: High-precision real-time Scrolling Terminal Logs Box */}
      <div className={`border p-3 rounded-lg font-mono text-[10px] space-y-1 h-32 overflow-y-auto ${
        isLight 
          ? 'bg-slate-100 border-slate-200 text-slate-700' 
          : 'bg-[#04040a] border-cyber-border text-[#00ff88]/90 shadow-inner'
      }`}>
        <div className="text-[9px] uppercase tracking-wider font-bold text-slate-500 border-b pb-1 mb-1 flex items-center justify-between">
          <span>SURCHI COGNITIVE LOGS FEED</span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span>
            LIVE
          </span>
        </div>
        {systemLogs.length === 0 ? (
          <div className="text-slate-600 italic">Pre-loading kernel pipelines...</div>
        ) : (
          systemLogs.map((log, i) => (
            <div key={i} className="leading-relaxed hover:bg-slate-800/20 px-1 rounded transition-colors break-all">
              {log}
            </div>
          ))
        )}
        <div ref={terminalEndRef} />
      </div>

      {/* SYSTEM CONTROLS & COMPLETION ACTIONS */}
      <div className="pt-2">
        {allCompleted ? (
          <div className="space-y-4 animate-fade-in text-center">
            <div className={`p-4 border rounded-xl space-y-2 text-center relative overflow-hidden ${
              isLight ? 'bg-indigo-50/40 border-indigo-200' : 'bg-gradient-to-r from-[#0d0721] to-[#040410] border-[#a855f7]/30 shadow-[0_0_15px_rgba(168,85,247,0.1)]'
            }`}>
              <div className="flex justify-center mb-1">
                <div className={`p-2 rounded-full ${isLight ? 'bg-indigo-100' : 'bg-[#a855f7]/15'}`}>
                  <Icons.Sparkles className={`w-5 h-5 ${isLight ? 'text-indigo-600' : 'text-[#a855f7] animate-bounce'}`} />
                </div>
              </div>
              <h4 className={`text-xs font-mono font-black uppercase tracking-wider ${isLight ? 'text-indigo-900' : 'text-[#a855f7]'}`}>
                COGNITIVE ENGINE ARMED
              </h4>
              <p className={`text-[11px] font-sans leading-relaxed max-w-sm mx-auto ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                The SURCHI ledger surveillance systems, NLP sentiment analyzers, and smart-contract audit crawlers are synchronised. You can now unlock the forensic analyzer suite.
              </p>
            </div>

            {/* ACTION DIRECTIVE BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={restartTracking}
                className={`py-3 px-4 rounded-xl text-xs font-mono font-bold uppercase transition-all flex items-center justify-center gap-1.5 border cursor-pointer select-none truncate ${
                  isLight
                    ? 'border-slate-300 text-slate-700 hover:bg-slate-100'
                    : 'border-cyber-border text-slate-400 hover:text-white hover:bg-cyber-card-light'
                }`}
              >
                <Icons.RefreshCw className="w-3.5 h-3.5" />
                <span>Re-Initialize</span>
              </button>

              {onComplete && (
                <button
                  type="button"
                  onClick={onComplete}
                  className={`flex-1 py-3 px-6 rounded-xl text-xs font-mono font-black uppercase transition-all tracking-wider flex items-center justify-center gap-2 cursor-pointer select-none text-white bg-gradient-to-r hover:scale-[1.02] active:scale-[0.98] shadow-md ${
                    isLight 
                      ? 'from-cyan-600 to-emerald-600 hover:from-cyan-700 hover:to-emerald-700 shadow-cyan-200' 
                      : 'from-[#00b0ff] to-[#00e5ff] hover:from-[#33bfff] hover:to-[#33ebff] shadow-[0_0_15px_rgba(0,229,255,0.4)]'
                  }`}
                >
                  <Icons.Key className="w-4 h-4 animate-pulse text-white" />
                  <span>PROCEED TO COGNITIVE ANALYZER</span>
                  <Icons.ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${
                isRunning 
                  ? 'bg-yellow-500 animate-ping' 
                  : (isLight ? 'bg-slate-400' : 'bg-slate-600')
              }`} />
              <span className="text-slate-500 uppercase tracking-widest text-[9.5px]">
                {isRunning ? 'PIPELINE RUNNING...' : 'SYSTEM CONSOLE STANDBY'}
              </span>
            </div>

            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase cursor-pointer select-none transition-all flex items-center gap-1.5 ${
                isLight 
                  ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' 
                  : 'bg-cyber-card border-cyber-border text-slate-400 hover:text-white hover:bg-cyber-card-light'
              }`}
            >
              {isRunning ? (
                <>
                  <Icons.Pause className="w-3 h-3" />
                  <span>Pause Node</span>
                </>
              ) : (
                <>
                  <Icons.Play className="w-3 h-3 text-[#00ff88]" />
                  <span>Resume Node</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
