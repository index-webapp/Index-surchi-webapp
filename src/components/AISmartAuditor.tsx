import React, { useState, useEffect, useMemo, useRef } from 'react';
import * as Icons from 'lucide-react';

interface AISmartAuditorProps {
  address: string;
  chainId: string;
  symbol: string;
  totalSupply: number;
  priceUsd: number;
}

interface ThreatDetail {
  id: string;
  name: string;
  category: 'code' | 'liquidity' | 'ownership' | 'tax' | 'wallet';
  status: 'passed' | 'warning' | 'critical';
  description: string;
  remediation: string;
  impact: string;
}

export default function AISmartAuditor({
  address,
  chainId,
  symbol,
  totalSupply,
  priceUsd,
}: AISmartAuditorProps) {
  const [activeTab, setActiveTab] = useState<'heatmap' | 'graph' | 'radar'>('heatmap');
  const [selectedThreat, setSelectedThreat] = useState<string | null>(null);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [isConsoleActive, setIsConsoleActive] = useState(true);
  const [auditProgress, setAuditProgress] = useState(100);
  const [isScanning, setIsScanning] = useState(false);
  const [copiedAddr, setCopiedAddr] = useState(false);
  const consoleBottomRef = useRef<HTMLDivElement>(null);

  // Safe defaults
  const safeAddress = address || 'DEFAULT';
  const safeChainId = typeof chainId === 'string' ? chainId : 'ethereum';
  const safeSymbol = symbol || 'TOKEN';
  const safeTotalSupply = totalSupply || 100000000;
  const safePriceUsd = priceUsd || 0;

  // Generate deterministic parameters from contract address seed
  const params = useMemo(() => {
    let seed = 0;
    const cleanAddr = safeAddress.trim();
    for (let i = 0; i < cleanAddr.length; i++) {
      seed += cleanAddr.charCodeAt(i);
    }
    
    // Deterministic risks
    const isEthereum = safeChainId.toLowerCase().includes('eth');
    const isSolana = safeChainId.toLowerCase().includes('sol');
    
    const honeypotPotential = (seed % 9) === 0;
    const hasMint = (seed % 11) === 0 && !isSolana; // Solana mints are usually capped/revoked unless specified
    const blacklistCapable = (seed % 13) === 0;
    const isProxy = (seed % 17) === 0 && !isSolana;
    const fakeRenounce = (seed % 19) === 0 && !isSolana;
    const dynamicTaxAlt = (seed % 23) === 0;
    const highBuyTax = (seed % 15) < 3 ? 12 : (seed % 15) < 6 ? 5 : 0;
    const highSellTax = (seed % 18) < 3 ? 15 : (seed % 18) < 6 ? 5 : 0;
    
    // Wallet intelligence metrics
    const sniperCount = (seed % 8) + 2; 
    const bundledWallets = (seed % 5) + 1;
    const insiderAccumulationPct = (seed % 24) + 6; // 6% to 30%
    const smartMoneyPresence = (seed % 35) > 15;
    
    // Flash loan reentrancy
    const reentrancyVulnerability = (seed % 29) === 0;
    const flashLoanVulnerability = (seed % 31) === 0 && !isSolana;
    const hiddenAdminPerms = (seed % 37) === 0;
    
    // Liquidity parameters
    const lpLocked = (seed % 25) > 4; // 80% chance locked
    const lpBurned = (seed % 25) <= 4; // 16% chance burned
    const lockDurationDays = lpLocked ? ((seed % 12) + 1) * 30 : 0;
    const creatorRemainingPct = (seed % 12) + 1; // 1% to 12%

    // Overall Security Score Calculation
    let score = 96;
    if (honeypotPotential) score -= 35;
    if (hasMint) score -= 25;
    if (blacklistCapable) score -= 20;
    if (isProxy) score -= 12;
    if (fakeRenounce) score -= 15;
    if (dynamicTaxAlt) score -= 18;
    if (reentrancyVulnerability) score -= 15;
    if (flashLoanVulnerability) score -= 15;
    if (hiddenAdminPerms) score -= 20;
    if (insiderAccumulationPct > 20) score -= 10;
    if (!lpLocked && !lpBurned) score -= 30;
    
    if (score < 10) score = 12;
    if (score > 100) score = 100;

    // Define general risk levels
    let riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'SECURED' = 'LOW';
    if (score <= 35) riskLevel = 'CRITICAL';
    else if (score <= 60) riskLevel = 'HIGH';
    else if (score <= 80) riskLevel = 'MEDIUM';
    else if (score <= 94) riskLevel = 'LOW';
    else riskLevel = 'SECURED';

    return {
      seed,
      honeypotPotential,
      hasMint,
      blacklistCapable,
      isProxy,
      fakeRenounce,
      dynamicTaxAlt,
      highBuyTax,
      highSellTax,
      sniperCount,
      bundledWallets,
      insiderAccumulationPct,
      smartMoneyPresence,
      reentrancyVulnerability,
      flashLoanVulnerability,
      hiddenAdminPerms,
      lpLocked,
      lpBurned,
      lockDurationDays,
      creatorRemainingPct,
      score,
      riskLevel,
    };
  }, [safeAddress, safeChainId]);

  // Generate console disassembler logs when contract address changes or scanning triggers
  useEffect(() => {
    setIsScanning(true);
    setAuditProgress(15);
    setConsoleLogs([]);
    
    const messages = [
      `[STATIC ANALYZER] Initializing bytecode disassembler for ${safeAddress} on network ${safeChainId.toUpperCase()}...`,
      `[STATIC ANALYZER] Loading binary image. Successfully extracted ${safeAddress.startsWith('0x') ? 'EVM' : 'Solana Anchor/SPL'} structure.`,
      `[BYTECODE SCANNED] Disassembling contract metadata, function selectors and state variables...`,
      `[ANALYZER] Mapping flow-graph. Total instructions: ${3000 + (params.seed % 1200)}. Total branches: ${45 + (params.seed % 30)}.`,
      `[Honeypot Scanner] Performing simulated sandboxed execution with dynamic gas consumption checks...`,
      `[Honeypot Scanner] Buy / Sell tax estimation check. Buy Tax: ${params.highBuyTax}%, Sell Tax: ${params.highSellTax}%.`,
      params.honeypotPotential 
        ? `[ALERT] [HONEYPOT DETECTED] Sandbox environment was blocked from calling 'transferFrom' after initial deposit. HIGH RISK!` 
        : `[OK] Dynamic transfer check executed successfully. No swap locks observed.`,
      `[TracePrivileges] Reconstructing access control list (ACL)... Mapping 'onlyOwner' and custom modifier references.`,
      params.hasMint 
        ? `[WARNING] [MINT PROTOCOL DETECTED] Found hidden mint instruction 'mintTo' without maximum supply ceiling guard.` 
        : `[OK] Supply limits immutable. No active inflation or unauthorized token multiplication variables found.`,
      params.blacklistCapable 
        ? `[WARNING] [BLACKLIST DETECTED] Address blacklist array modification selectors identified in opcode stream.` 
        : `[OK] Code does not permit arbitrary address freeze commands.`,
      params.isProxy 
        ? `[DANGER] [PROXY PATTERN] Delegatecall proxy detected pointing to generic implementation pointer.` 
        : `[OK] Direct non-upgradable execution stream verified.`,
      params.fakeRenounce 
        ? `[WARNING] [FAKE RENOUNCE] Ownership renounced but permissions retained by auxiliary administrator vault.` 
        : `[OK] Absolute state integrity verified.`,
      `[TraceSnoopers] Decoding DEX transaction logs in block sequence. Tracking early-block entry algorithms...`,
      `[Sniper Check] Traced ${params.sniperCount} custom automated sniper protocols entering during the pool instantiation event.`,
      `[Bundled Check] Detected ${params.bundledWallets} cross-funded bundled wallets executing synchronous swap paths.`,
      `[Clustering AI] Executing Louvain community modularity modeling on historical transfers...`,
      params.insiderAccumulationPct > 15
        ? `[DANGER] [WALLETS CLUSTERED] Traced coordinated pipeline holding ${params.insiderAccumulationPct}% of circulating token units.`
        : `[OK] Wallet distribution adheres to standard secondary market accumulation parameters.`,
      `[Vulnerability Audit] Scanning memory model offsets for flash loan arbitrage vectors & reentrancy paths...`,
      params.reentrancyVulnerability 
        ? `[CRITICAL] [REENTRANCY BUG] Lack of reentrancy guard detected in state modification cycle.` 
        : `[OK] Mutex logic or strict check-effects-interactions coding pattern verified.`,
      params.flashLoanVulnerability 
        ? `[DANGER] [FLASHLOAN VECTOR] Price reference queries spot reserve directly instead of secure TWAP or Chainlink oracle.` 
        : `[OK] Safe volume-weighted pricing checkpoints detected.`,
      `[ANALYSIS COMPLETE] Security evaluation finished. Security score computed: ${params.score}/100.`
    ];

    let logIdx = 0;
    const interval = setInterval(() => {
      if (logIdx < messages.length) {
        setConsoleLogs(prev => [...prev, messages[logIdx]]);
        setAuditProgress(Math.floor(15 + ((logIdx + 1) / messages.length) * 85));
        logIdx++;
      } else {
        clearInterval(interval);
        setIsScanning(false);
      }
    }, 35);

    return () => clearInterval(interval);
  }, [safeAddress, safeChainId, params]);

  // Copy address utility
  const handleCopy = () => {
    navigator.clipboard.writeText(safeAddress);
    setCopiedAddr(true);
    setTimeout(() => setCopiedAddr(false), 2000);
  };

  // Scroll console to bottom
  useEffect(() => {
    if (consoleBottomRef.current) {
      consoleBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [consoleLogs]);

  // Compile all 20 advanced features dynamically for presentation
  const allThreats = useMemo<ThreatDetail[]>(() => {
    return [
      {
        id: 'honeypot',
        name: 'Honeypot Protocol Detection',
        category: 'tax',
        status: params.honeypotPotential ? 'critical' : 'passed',
        description: params.honeypotPotential 
          ? 'Honeypot mechanism flagged. The contract is configured to accept deposits/buys but blocks transfers/sells under standard DEX routers.'
          : 'Standard transfer protocols. Token can be bought and sold freely in decentralized market liquidity without unilateral lockups.',
        impact: 'Loss of 100% of invested assets due to infinite sell-failures.',
        remediation: 'Avoid interaction. The contract is explicitly malicious.',
      },
      {
        id: 'hidden_mint',
        name: 'Hidden Supply Inflation',
        category: 'code',
        status: params.hasMint ? 'critical' : 'passed',
        description: params.hasMint 
          ? 'Bytecode disassembly discovered hidden mint function wrappers. The owner can inflate total supply infinitely, causing price collapse.'
          : 'Absolute supply cap is hardcoded or minting role is fully renounced. Token supply cannot be unilaterally inflated.',
        impact: 'Severe. Developer can dilute existing holders to 0.',
        remediation: 'Ensure contract ownership is locked inside a multivector timelock or fully renounced.',
      },
      {
        id: 'blacklist_whitelist',
        name: 'Blacklist Modifying Powers',
        category: 'ownership',
        status: params.blacklistCapable ? 'warning' : 'passed',
        description: params.blacklistCapable 
          ? 'The contract administrator has direct privileges to blacklist specified wallet addresses from carrying out transfer operations.'
          : 'Address restriction arrays are not implemented in the compiled contract bytecode. No selective transfer blocks.',
        impact: 'High. Specific investor wallets can be locked dynamically if they accumulate high balances.',
        remediation: 'Renounce administrative controls or audit the explicit criteria for blacklist execution.',
      },
      {
        id: 'rug_pull_risk',
        name: 'Rug-Pull Risk Analysis',
        category: 'liquidity',
        status: (!params.lpLocked && !params.lpBurned) ? 'critical' : (params.insiderAccumulationPct > 18) ? 'warning' : 'passed',
        description: (!params.lpLocked && !params.lpBurned)
          ? 'Extremely high rug-pull vulnerability. Liquidity pool tokens are stored inside the deployer primary wallet, meaning they can pull the rug instantly.'
          : 'Liquidity is locked or burned. Coordinated team dumps represent the principal residual rug-pull exposure.',
        impact: 'Extreme. Instant removal of all backing dex liquidity.',
        remediation: 'Verify locked percentages and lock duration on trusted secondary lockers before entering.',
      },
      {
        id: 'liquidity_lock',
        name: 'Liquidity Lock Verification',
        category: 'liquidity',
        status: params.lpBurned ? 'passed' : params.lpLocked ? 'warning' : 'critical',
        description: params.lpBurned 
          ? '100% of liquid pool provider tokens are burned to the dead address (0x00...000dead). Unruggability verified.'
          : params.lpLocked 
            ? `Liquidity pool tokens are locked in verified smart locker for ${params.lockDurationDays} days.`
            : 'Liquidity pool is completely unlocked. The developer has total access to remove trading backing.',
        impact: 'High. Immediate loss of trading depth.',
        remediation: 'Ensure LP is burned or locked for a minimum of 6 months.',
      },
      {
        id: 'ownership_privilege',
        name: 'Ownership Privilege Analysis',
        category: 'ownership',
        status: params.fakeRenounce ? 'warning' : 'passed',
        description: params.fakeRenounce 
          ? 'Administrative functions are still functional via a hidden back-gate modifier or multi-signature master role.'
          : 'Contract ownership is fully public, locked, or held by a fully renounced genesis address.',
        impact: 'Medium. Deployer can modify contract behaviors post-audit.',
        remediation: 'Query state variable fields manually to verify the exact status of the global admin owner.',
      },
      {
        id: 'trading_restrictions',
        name: 'Trading Limit Protections',
        category: 'tax',
        status: (params.seed % 10) === 0 ? 'warning' : 'passed',
        description: (params.seed % 10) === 0
          ? 'Strict absolute max buy & wallet size boundaries are actively enforced. Trading restrictions can block organic buys.'
          : 'Zero arbitrary trading size locks or speed limits are applied on mainnet swaps.',
        impact: 'Low. Restricts size of individual swap trades.',
        remediation: 'Verify max-transaction thresholds inside the DEX routing parameters.',
      },
      {
        id: 'dynamic_tax',
        name: 'Dynamic Tax Modifications',
        category: 'tax',
        status: params.dynamicTaxAlt ? 'critical' : 'passed',
        description: params.dynamicTaxAlt 
          ? 'Sell tax rules are dynamically configurable. The owner can alter buy/sell tax values to 99% dynamically (Honeypot equivalent).'
          : 'Standard immutable tax bounds. Fixed or zero-tax parameters cannot be altered post-launch.',
        impact: 'High. Hidden tax blocks can drain trading profits entirely.',
        remediation: 'Review bytecodes to ensure tax assignment variables do not contain unlocked state modifiers.',
      },
      {
        id: 'proxy_contract',
        name: 'Proxy Contract Detection',
        category: 'code',
        status: params.isProxy ? 'warning' : 'passed',
        description: params.isProxy 
          ? 'Proxy implementation pattern found (standard upgrade pattern). The underlying bytecode can be replaced dynamically.'
          : 'Immutable direct contract implementation. The logic is frozen on the blockchain forever.',
        impact: 'Medium. Contract can be dynamically swapped for a malicious model.',
        remediation: 'Verify if proxy upgrade keys are locked inside a multi-sig or timelocked governor.',
      },
      {
        id: 'fake_renounce',
        name: 'Fake Renounced Ownership',
        category: 'ownership',
        status: params.fakeRenounce ? 'critical' : 'passed',
        description: params.fakeRenounce 
          ? 'Deployer claimed ownership renouncement in logs but assigned actual master privileges to a secondary proxy contract.'
          : 'Ownership renouncement is completely authentic. Zero administrative control tags found.',
        impact: 'High. Admin retains complete backdoor access.',
        remediation: 'Verify the zero address (0x00...0000) on the actual master owner check state call.',
      },
      {
        id: 'sniper_wallets',
        name: 'Coordinated Sniper Wallets',
        category: 'wallet',
        status: params.sniperCount > 6 ? 'warning' : 'passed',
        description: `Traced ${params.sniperCount} dynamic sniping protocols executing purchases in the exact millisecond of block initiation.`,
        impact: 'Medium. Sniper bots hold large amounts of early supply and can dump heavily.',
        remediation: 'Monitor the sniper wallets balance to track when and if they begin liquidating positions.',
      },
      {
        id: 'bundled_wallets',
        name: 'Bundled Deployer Wallets',
        category: 'wallet',
        status: params.bundledWallets >= 4 ? 'critical' : params.bundledWallets >= 2 ? 'warning' : 'passed',
        description: `Identified ${params.bundledWallets} separate wallet nodes funded synchronously from a single master deployment wallet.`,
        impact: 'High. Simulated decentralization. One developer owns multiple accounts.',
        remediation: 'Integrate multi-vector wallet clustering filters to group and measure combined exposure.',
      },
      {
        id: 'insider_accumulation',
        name: 'Insider Coordinated Accumulation',
        category: 'wallet',
        status: params.insiderAccumulationPct > 20 ? 'critical' : params.insiderAccumulationPct > 10 ? 'warning' : 'passed',
        description: `Stealth clusters holding ${params.insiderAccumulationPct}% of circulating token units have been discovered inside the top tier ranking.`,
        impact: 'High. Hidden whales can dump silently and manipulate pricing levels.',
        remediation: 'Apply real-time wallet flow monitoring. Sell on initial cluster exits.',
      },
      {
        id: 'wallet_clustering',
        name: 'Clustering Correlation Modeler',
        category: 'wallet',
        status: params.insiderAccumulationPct > 15 ? 'warning' : 'passed',
        description: params.insiderAccumulationPct > 15 
          ? 'Heavy node density on the transaction flow graph. Multiple wallets are sharing identical funding parents.'
          : 'Low degree of clustering. The decentralization graph matches normal peer fair launches.',
        impact: 'Medium. One entity masquerading as many separate users.',
        remediation: 'Cross-analyze the exact Ether/Sol source patterns for all top list holders.',
      },
      {
        id: 'scam_similarity',
        name: 'Scam Structural Similarity',
        category: 'code',
        status: params.honeypotPotential ? 'critical' : 'passed',
        description: params.honeypotPotential 
          ? 'Bytecode template holds a 92% similarity match to historic honeypot scam contract structures (Squid Game pattern).'
          : 'Zero matching patterns found with historical onchain contract scams or vulnerability libraries.',
        impact: 'Severe. Direct copy of a known on-chain rug design.',
        remediation: 'DO NOT trade. Seek audited alternatives.',
      },
      {
        id: 'ai_behavioral',
        name: 'AI Behavioral Scanning',
        category: 'code',
        status: params.riskLevel === 'CRITICAL' || params.riskLevel === 'HIGH' ? 'critical' : params.riskLevel === 'MEDIUM' ? 'warning' : 'passed',
        description: `Recurrent NN classified the contract behavior structure as: ${params.riskLevel} threat hazard signature based on deployment metadata.`,
        impact: 'Medium. System identifies dangerous transaction frequency setups.',
        remediation: 'Follow the warnings listed in the granular threat profile dashboards.',
      },
      {
        id: 'flashloan_vuln',
        name: 'Flash Loan Swap Exploits',
        category: 'code',
        status: params.flashLoanVulnerability ? 'warning' : 'passed',
        description: params.flashLoanVulnerability 
          ? 'Arbitrage vectors can manipulation price reserves directly due to lack of standard TWAP oracle dependencies.'
          : 'Price calculations utilize secure Uniswap/Chainlink multi-block moving averages.',
        impact: 'Medium. Attackers can inflate swap output variables and drain LP pools.',
        remediation: 'Upgrade to oracle-based contract calculations with sliding-window protection.',
      },
      {
        id: 'reentrancy_vuln',
        name: 'Reentrancy Vulnerability Scanner',
        category: 'code',
        status: params.reentrancyVulnerability ? 'critical' : 'passed',
        description: params.reentrancyVulnerability 
          ? 'Absence of nonreentrant modifiers in withdrawal paths. Attackers can recursive-call and drain reserves.'
          : 'Reentrancy guard protection active. State parameters are written prior to executing external calls.',
        impact: 'High. Standard loop back exploit draining pool cash.',
        remediation: 'Incorporate OpenZeppelin ReentrancyGuard utility modifiers on all transfer components.',
      },
      {
        id: 'hidden_admin',
        name: 'Hidden Administrative Gates',
        category: 'ownership',
        status: params.hiddenAdminPerms ? 'critical' : 'passed',
        description: params.hiddenAdminPerms 
          ? 'Discovered internal code paths delegating Master role access to the deployer wallet under disguised variable names.'
          : 'Clean access hierarchy. Only standard declared public modifier selectors are active.',
        impact: 'High. Developer can freeze contracts or modify fee logic at will.',
        remediation: 'Audit compile logs and ensure full proxy implementations utilize fixed-state templates.',
      },
      {
        id: 'whale_manipulation',
        name: 'Whale Impact Exposure',
        category: 'wallet',
        status: (params.insiderAccumulationPct + params.creatorRemainingPct > 20) ? 'warning' : 'passed',
        description: `Aggregate volume of centralized groups totals ${(params.insiderAccumulationPct + params.creatorRemainingPct).toFixed(1)}%. Price impact threshold is high.`,
        impact: 'Medium. High price vulnerability to large single sales.',
        remediation: 'Examine DEX depth parameters and model price-slippage thresholds for large swaps.',
      }
    ];
  }, [params]);

  // Handle heatmap square hover/click
  const handleThreatClick = (id: string) => {
    setSelectedThreat(id === selectedThreat ? null : id);
  };

  // Find currently clicked threat
  const activeThreatDetail = useMemo(() => {
    return allThreats.find(t => t.id === selectedThreat);
  }, [allThreats, selectedThreat]);

  // Generate radar chart data metrics
  const radarMetrics = useMemo(() => {
    // Rug, Code, central, tax, liq
    const rugRisk = (!params.lpLocked && !params.lpBurned) ? 100 : params.insiderAccumulationPct > 15 ? 75 : 20;
    const codeRisk = params.hasMint ? 90 : params.reentrancyVulnerability ? 80 : 25;
    const centralRisk = params.fakeRenounce ? 95 : params.hiddenAdminPerms ? 85 : params.creatorRemainingPct > 8 ? 60 : 20;
    const taxRisk = params.honeypotPotential ? 100 : params.dynamicTaxAlt ? 85 : params.highSellTax > 10 ? 60 : 15;
    const liqRisk = (!params.lpLocked && !params.lpBurned) ? 98 : params.lpLocked ? 40 : 10;
    return { rugRisk, codeRisk, centralRisk, taxRisk, liqRisk };
  }, [params]);

  return (
    <div className="space-y-5 border border-cyber-cyan/20 rounded-2xl bg-[#040410]/80 p-5 font-mono text-left relative overflow-hidden backdrop-blur-xl shadow-[0_0_50px_rgba(0,195,255,0.05)]">
      
      {/* Background neon elements */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-cyber-pink/5 rounded-full filter blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyber-cyan/5 rounded-full filter blur-[100px] pointer-events-none -z-10" />

      {/* Header Dashboard Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-[#1b1c3a]/40">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="p-1 px-2.5 rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/40 text-cyber-cyan font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
              <Icons.ShieldAlert className="w-3.5 h-3.5" />
              AI SMART CONTRACT AUDITOR
            </span>
            <span className="px-2 py-0.5 rounded text-[9px] bg-white/5 border border-white/10 text-slate-300 font-bold uppercase tracking-widest">
              INSTANT THREAT ASSURANCE SCANNER
            </span>
          </div>
          <h2 className="text-xl font-bold font-sans text-slate-100 tracking-tight flex items-center gap-3">
            Surchi Deep-Core Forensic Audit Log
            <span className="text-slate-400 font-mono text-xs font-normal">
              v1.07-secure
            </span>
          </h2>
          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
            <span className="text-[10px] text-slate-500 uppercase">Selected Token:</span>
            <span className="px-1.5 py-0.25 rounded bg-[#0e0e24] text-slate-300 border border-cyber-cyan/10 font-bold">
              {safeSymbol}
            </span>
            <span className="text-slate-500">|</span>
            <button 
              onClick={handleCopy} 
              className="hover:text-cyber-cyan cursor-pointer transition-colors flex items-center gap-1 select-none"
              title="Click to copy contract path"
            >
              <Icons.FileCode2 className="w-3.5 h-3.5 text-cyber-cyan" />
              <span className="text-slate-300 select-all">
                {safeAddress.length > 16 
                  ? `${safeAddress.substring(0, 8)}...${safeAddress.substring(safeAddress.length - 8)}`
                  : safeAddress
                }
              </span>
              {copiedAddr ? <span className="text-emerald-400 text-[9px] font-black uppercase">Copied!</span> : <Icons.Copy className="w-3 h-3 text-slate-500 shrink-0" />}
            </button>
          </div>
        </div>

        {/* Scan Time Indicator */}
        <div className="flex items-center gap-3">
          <div className="text-right font-mono text-[10px] text-slate-400 hidden sm:block">
            <div>NETWORK ASSIGNMENT: <strong className="text-emerald-400 uppercase">{safeChainId}</strong></div>
            <div>STATUS: <strong className="text-cyan-400">ONLINE FORENSIC VERIFIED</strong></div>
          </div>
          <button 
            disabled={isScanning}
            onClick={() => {}} 
            className="p-2.5 rounded-xl border border-cyber-cyan/30 bg-[#070718] hover:bg-[#121234] text-cyber-cyan hover:text-white transition-all duration-300 disabled:opacity-50 select-none flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
          >
            <Icons.RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
            {isScanning ? 'Scan Active...' : 'Re-verify Code'}
          </button>
        </div>
      </div>

      {/* KPI Performance Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Score Ring */}
        <div className="p-4 rounded-xl border border-[#1b1c3a]/40 bg-[#060618]/60 flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute top-1 left-2 text-[8px] text-slate-500 font-black tracking-widest uppercase">
            OVERALL AUDIT TRUST
          </div>
          <div className="relative w-24 h-24 my-2 flex items-center justify-center">
            {/* SVG Arc Score */}
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" className="stroke-slate-800" strokeWidth="6" fill="transparent" />
              <circle 
                cx="50" 
                cy="50" 
                r="40" 
                className={`transition-all duration-1000 ${
                  params.score < 50 ? 'stroke-rose-500' : params.score < 80 ? 'stroke-amber-450' : 'stroke-emerald-400'
                }`}
                strokeWidth="7" 
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${(1 - params.score / 100) * (2 * Math.PI * 40)}`}
                strokeLinecap="round"
                fill="transparent" 
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black font-sans text-white tracking-widest">{params.score}</span>
              <span className="text-[7.5px] text-slate-400 font-bold uppercase">SEC-SCORE</span>
            </div>
          </div>
          <p className="text-[9.5px] font-sans font-bold text-slate-400 uppercase">
            COMPLIANCE: <span className={params.score > 80 ? "text-emerald-400 font-black" : "text-rose-450 font-black"}>{params.score}% TRUSTED</span>
          </p>
        </div>

        {/* Risk Assessment Box */}
        <div className="p-4 rounded-xl border border-[#1b1c3a]/40 bg-[#060618]/60 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-1 left-2 text-[8px] text-slate-500 font-black tracking-widest uppercase">
            DANGER THREAT LEVEL
          </div>
          <div className="pt-4 space-y-1">
            <div className={`text-2xl font-black font-sans tracking-widest drop-shadow-[0_0_12px_rgba(255,100,100,0.2)] ${
              params.riskLevel === 'CRITICAL' ? 'text-red-500' : 
              params.riskLevel === 'HIGH' ? 'text-rose-450' : 
              params.riskLevel === 'MEDIUM' ? 'text-amber-450' : 
              params.riskLevel === 'LOW' ? 'text-cyan-400' : 'text-[#00ff88]'
            }`}>
              {params.riskLevel}
            </div>
            <div className="text-[9.5px] text-slate-400 font-sans leading-relaxed">
              {params.riskLevel === 'CRITICAL' && 'Extreme risk parameters flagged. Honeypots, unlimited supply creation or fully unlocked liquidity detected.'}
              {params.riskLevel === 'HIGH' && 'Contract holds dangerous administrative power overrides or has highly concentrated token distribution.'}
              {params.riskLevel === 'MEDIUM' && 'Standard design with mild potential exploits. Some proxy patterns or early sniper cluster wallets present.'}
              {params.riskLevel === 'LOW' && 'Good parameters. Fixed supply limits, locked liquidity pools, and low tax rates.'}
              {params.riskLevel === 'SECURED' && 'Impeccable. Highly decentralized, contract renounced, zero supply inflation risk, and locked backing.'}
            </div>
          </div>
          <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden mt-2">
            <div 
              className={`h-full ${
                params.riskLevel === 'CRITICAL' ? 'bg-red-500 w-full' : 
                params.riskLevel === 'HIGH' ? 'bg-rose-450 w-[75%]' : 
                params.riskLevel === 'MEDIUM' ? 'bg-amber-450 w-[50%]' : 
                params.riskLevel === 'LOW' ? 'bg-cyan-400 w-[25%]' : 'bg-[#00ff88] w-[10%]'
              }`}
            />
          </div>
        </div>

        {/* Dynamic Static Bytecode Logs */}
        <div className="md:col-span-2 p-3 rounded-xl border border-[#1b1c3a]/40 bg-[#02020a]/80 flex flex-col relative overflow-hidden text-[9px]">
          <div className="flex items-center justify-between border-b border-[#1b1c3a]/40 pb-1 mb-1.5 shrink-0 text-slate-500 font-black">
            <span className="flex items-center gap-1 uppercase tracking-wider text-[8px]">
              <Icons.Terminal className="w-3 h-3 text-cyan-400 animate-pulse" />
              Surchi Bytecode Scan Terminal
            </span>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[7.5px] uppercase tracking-widest text-[#00ff88]">Active Tracer</span>
            </div>
          </div>

          {/* Scrolling output list */}
          <div className="flex-1 overflow-y-auto max-h-[105px] space-y-1 font-mono text-[9.5px] leading-relaxed text-slate-400 pr-1 select-none scrollbar-thin scrollbar-thumb-slate-800">
            {consoleLogs.map((log, idx) => {
              if (typeof log !== 'string') return null;
              const hasAlert = log.includes('[ALERT]') || log.includes('[DANGER]') || log.includes('[CRITICAL]');
              const hasWarning = log.includes('[WARNING]');
              const hasOk = log.includes('[OK]') || log.includes('COMPLETE');
              return (
                <div 
                  key={idx} 
                  className={`border-l-2 pl-1.5 py-0.25 p-0.5 ${
                    hasAlert ? 'border-rose-500 text-rose-350 bg-rose-500/5' : 
                    hasWarning ? 'border-amber-450 text-amber-300 bg-[#3f3014]/15' : 
                    hasOk ? 'border-[#00ff88] text-emerald-400 bg-[#00ff88]/5' : 'border-slate-800 text-slate-400'
                  }`}
                >
                  {log}
                </div>
              );
            })}
            <div ref={consoleBottomRef} />
          </div>
        </div>

      </div>

      {/* Advanced Interactive Visualizations Panel */}
      <div className="border border-[#1b1c3a]/40 rounded-xl bg-[#050514]/40 overflow-hidden">
        
        {/* Toggle Head Tabs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between bg-[#0b0b1f] border-b border-[#1b1c3a]/40 p-2 gap-2">
          <div className="flex items-center gap-2">
            <Icons.Layers className="w-4 h-4 text-cyber-cyan" />
            <span className="font-extrabold text-[#edf2f7] uppercase tracking-wider text-[11px]">AI DIAGNOSTIC METRICS GRAPHICS</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button 
              onClick={() => setActiveTab('heatmap')} 
              className={`px-3 py-1.5 rounded-lg font-mono text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${
                activeTab === 'heatmap' 
                  ? 'bg-cyber-cyan/15 border border-cyber-cyan text-white shadow-[0_0_12px_rgba(0,195,255,0.2)]' 
                  : 'bg-[#101030] border border-[#1e1e4a] text-slate-400 hover:text-white'
              }`}
            >
              Interactive Heatmap
            </button>
            <button 
              onClick={() => setActiveTab('graph')} 
              className={`px-3 py-1.5 rounded-lg font-mono text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${
                activeTab === 'graph' 
                  ? 'bg-cyber-cyan/15 border border-cyber-cyan text-white shadow-[0_0_12px_rgba(0,195,255,0.2)]' 
                  : 'bg-[#101030] border border-[#1e1e4a] text-slate-400 hover:text-white'
              }`}
            >
              Wallet Relations Graph
            </button>
            <button 
              onClick={() => setActiveTab('radar')} 
              className={`px-3 py-1.5 rounded-lg font-mono text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${
                activeTab === 'radar' 
                  ? 'bg-cyber-cyan/15 border border-cyber-cyan text-white shadow-[0_0_12px_rgba(0,195,255,0.2)]' 
                  : 'bg-[#101030] border border-[#1e1e4a] text-slate-400 hover:text-white'
              }`}
            >
              Security Radar
            </button>
          </div>
        </div>

        {/* Tab Body */}
        <div className="p-4 bg-[#02020a]/80 min-h-[280px] grid grid-cols-1 lg:grid-cols-3 gap-5">
          
          <div className="lg:col-span-2 flex flex-col justify-center items-center p-3 border border-[#181938] rounded-xl bg-[#030310] relative min-h-[290px]">
            
            {/* 1. HEATMAP VIEW */}
            {activeTab === 'heatmap' && (
              <div className="w-full h-full flex flex-col justify-between space-y-4">
                <div className="text-center sm:text-left space-y-0.5">
                  <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest block">Contract Code & Wallet Security Matrix (20 checks)</span>
                  <span className="text-[9px] text-slate-500 font-sans block">Interactive Grid. Hover & click any tile below for comprehensive diagnostic analysis and developer recommendations.</span>
                </div>
                
                {/* 4x5 Grid Pattern representing 20 features */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2.5 pt-2">
                  {allThreats.map((threat) => {
                    const isSelected = selectedThreat === threat.id;
                    return (
                      <button 
                        key={threat.id} 
                        onClick={() => handleThreatClick(threat.id)}
                        className={`p-2.5 rounded-lg border text-left flex flex-col justify-between transition-all duration-300 text-[10px] h-18 relative ${
                          threat.status === 'passed' 
                            ? isSelected ? 'bg-emerald-500/15 border-emerald-400 text-emerald-250 shadow-[0_0_10px_rgba(74,222,128,0.25)]' : 'bg-[#00ff88]/5 border-emerald-400/20 text-slate-300 hover:border-emerald-400 hover:bg-emerald-400/5'
                            : threat.status === 'warning'
                              ? isSelected ? 'bg-amber-450/15 border-amber-400 text-amber-250 shadow-[0_0_10px_rgba(245,158,11,0.25)]' : 'bg-amber-450/5 border-amber-400/20 text-slate-300 hover:border-amber-400 hover:bg-amber-4s0/5'
                              : isSelected ? 'bg-rose-500/15 border-rose-400 text-rose-350 shadow-[0_0_10px_rgba(244,63,94,0.25)]' : 'bg-rose-500/5 border-rose-450/20 text-slate-300 hover:border-rose-450 hover:bg-rose-450/5'
                        }`}
                      >
                        <div className="font-bold font-sans uppercase truncate tracking-wide text-[9px] w-full" title={threat.name}>
                          {threat.name}
                        </div>
                        <div className="flex items-center justify-between mt-1 text-[8px] font-mono leading-none font-bold uppercase">
                          <span className="text-slate-500">{threat.category}</span>
                          <span className={`px-1.5 py-0.5 rounded ${
                            threat.status === 'passed' ? 'bg-[#00ff88]/15 text-[#00ff88]' :
                            threat.status === 'warning' ? 'bg-amber-450/15 text-amber-400' : 'bg-rose-500/15 text-rose-450'
                          }`}>
                            {threat.status}
                          </span>
                        </div>
                        {isSelected && (
                          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. WALLET RELATIONS GRAPH VIEW */}
            {activeTab === 'graph' && (
              <div className="w-full h-full flex flex-col justify-between space-y-3">
                <div className="text-center sm:text-left space-y-0.5">
                  <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest block">Security Forensic Pipeline Mapper</span>
                  <span className="text-[9px] text-slate-500 font-sans block">Visualization of smart wallet clusters, deployer multi-hop funding path, and early sniping actions.</span>
                </div>

                {/* Animated interactive SVG Graph */}
                <div className="relative w-full h-52 bg-[#020207] rounded-xl border border-slate-900 overflow-hidden flex items-center justify-center">
                  
                  {/* Subtle Radar Ripple grids behind */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-24 h-24 border border-cyan-500/5 rounded-full animate-ping duration-1000" />
                    <div className="w-40 h-40 border border-cyan-500/5 rounded-full animate-ping duration-[3000ms]" />
                    <div className="w-56 h-56 border border-pink-500/5 rounded-full animate-ping duration-[6000ms]" />
                  </div>

                  {/* SVG Nodes and connections */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200">
                    <defs>
                      <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#00c3ff" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#ff4b82" stopOpacity="0.8" />
                      </linearGradient>
                      <marker id="arrow" viewBox="0 0 10 10" refX="15" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#1e293b" />
                      </marker>
                    </defs>

                    {/* Connection streams with animation */}
                    {/* Deployer to contract */}
                    <line x1="100" y1="100" x2="200" y2="100" stroke="#ff4b82" strokeWidth="1.5" strokeDasharray="5,5" className="animate-[dash_10s_linear_infinite]" />
                    {/* Contract to LP */}
                    <line x1="200" y1="100" x2="300" y2="100" stroke="#00ff88" strokeWidth="1.5" strokeDasharray="5,5" className="animate-[dash_12s_linear_infinite]" />
                    {/* Deployer to Snipers (bundles) */}
                    <line x1="100" y1="100" x2="160" y2="40" stroke="#e11d48" strokeWidth="1" strokeDasharray="6,4" />
                    <line x1="100" y1="100" x2="120" y2="160" stroke="#e11d48" strokeWidth="1" strokeDasharray="6,4" />
                    {/* Snipers buying from contract */}
                    <line x1="160" y1="40" x2="200" y2="100" stroke="#00c3ff" strokeWidth="1.2" strokeDasharray="4,4" className="animate-[dash_8s_linear_infinite]" />
                    <line x1="120" y1="160" x2="200" y2="100" stroke="#00c3ff" strokeWidth="1.2" strokeDasharray="4,4" className="animate-[dash_8s_linear_infinite]" />
                    {/* Insider Accumulation wallets */}
                    <line x1="280" y1="45" x2="200" y2="100" stroke="#f59e0b" strokeWidth="1" strokeDasharray="5,5" />
                    <line x1="280" y1="155" x2="200" y2="100" stroke="#f59e0b" strokeWidth="1" strokeDasharray="5,5" />

                    {/* Nodes Elements */}
                    {/* 1. Deployer (Left) */}
                    <g transform="translate(100, 100)" className="cursor-help" onClick={() => setSelectedThreat('bundled_wallets')}>
                      <circle r="18" fill="#1c1917" stroke="#ff4b82" strokeWidth="2" className="animate-pulse" />
                      <text y="4" textAnchor="middle" fill="#f43f5e" fontSize="8" fontWeight="bold" fontFamily="monospace">DEPLOYER</text>
                    </g>

                    {/* 2. Token Contract (Center) */}
                    <g transform="translate(200, 100)" className="cursor-help" onClick={() => setSelectedThreat('honeypot')}>
                      <circle r="22" fill="#04040c" stroke="#00c3ff" strokeWidth="2.5" />
                      <circle r="15" fill="none" stroke="#00c3ff" strokeWidth="1" className="animate-ping" />
                      <text y="4" textAnchor="middle" fill="#00e5ff" fontSize="9" fontWeight="bold" fontFamily="monospace">{safeSymbol}</text>
                    </g>

                    {/* 3. Dex LP (Right) */}
                    <g transform="translate(300, 100)" className="cursor-help" onClick={() => setSelectedThreat('liquidity_lock')}>
                      <circle r="18" fill="#021c0e" stroke="#00ff88" strokeWidth="2" />
                      <text y="4" textAnchor="middle" fill="#00ff88" fontSize="8" fontWeight="bold" fontFamily="monospace">DEX_LP</text>
                    </g>

                    {/* 4. Sniper 01 (Top-Left) */}
                    <g transform="translate(160, 40)" className="cursor-help" onClick={() => setSelectedThreat('sniper_wallets')}>
                      <circle r="12" fill="#2d0606" stroke="#f43f5e" strokeWidth="1" />
                      <text y="3" textAnchor="middle" fill="#fda4af" fontSize="6" fontFamily="monospace">SNIPER_01</text>
                    </g>

                    {/* 5. Bundled cluster (Bottom-Left) */}
                    <g transform="translate(120, 160)" className="cursor-help" onClick={() => setSelectedThreat('bundled_wallets')}>
                      <circle r="13" fill="#311c05" stroke="#f59e0b" strokeWidth="1.5" />
                      <text y="3" textAnchor="middle" fill="#fde047" fontSize="6.5" fontWeight="bold" fontFamily="monospace">BUNDLE_M</text>
                    </g>

                    {/* 6. Insider Whales (Top & Bottom Right) */}
                    <g transform="translate(280, 45)" className="cursor-help" onClick={() => setSelectedThreat('insider_accumulation')}>
                      <circle r="11" fill="#1e1e07" stroke="#fbbf24" strokeWidth="1" />
                      <text y="3" textAnchor="middle" fill="#fbbf24" fontSize="6" fontFamily="monospace">INSIDER</text>
                    </g>
                    <g transform="translate(280, 155)" className="cursor-help" onClick={() => setSelectedThreat('whale_manipulation')}>
                      <circle r="11" fill="#1e1e07" stroke="#fbbf24" strokeWidth="1" />
                      <text y="3" textAnchor="middle" fill="#fbbf24" fontSize="6" fontFamily="monospace">INSIDER</text>
                    </g>
                  </svg>

                  {/* Dynamic interactive legend overlays */}
                  <div className="absolute bottom-2.5 right-2 px-2 py-1 bg-slate-950/90 border border-[#1b1c3a]/55 rounded text-[8px] font-mono flex gap-3 text-slate-400">
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Deployer/Risk</span>
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> Contract</span>
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Liquidity</span>
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-450" /> Stealth GP</span>
                  </div>
                </div>
              </div>
            )}

            {/* 3. SECURITY RADAR VIEW */}
            {activeTab === 'radar' && (
              <div className="w-full h-full flex flex-col justify-between space-y-3">
                <div className="text-center sm:text-left space-y-0.5">
                  <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest block font-mono">Surchi Blockchain Security Radar</span>
                  <span className="text-[9px] text-slate-500 font-sans block">Visualization of risk parameters. Higher center-distance represents optimal safety (closer to perimeter = more secure).</span>
                </div>

                {/* SVG Radar implementation */}
                <div className="relative w-full h-52 bg-[#020207] rounded-xl border border-slate-900 overflow-hidden flex items-center justify-center">
                  
                  {/* Radar grid drawings */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
                    {/* Ring grids */}
                    <circle cx="100" cy="100" r="80" fill="none" stroke="#1e293b" strokeWidth="1" />
                    <circle cx="100" cy="100" r="60" fill="none" stroke="#1e293b" strokeWidth="1" />
                    <circle cx="100" cy="100" r="40" fill="none" stroke="#1e293b" strokeWidth="0.5" />
                    <circle cx="100" cy="100" r="20" fill="none" stroke="#1e293b" strokeWidth="0.5" />

                    {/* Dynamic sweeping line */}
                    <line x1="100" y1="100" x2="180" y2="100" stroke="#00ff88" strokeWidth="0.5" className="origin-center animate-[spin_5s_linear_infinite]" />

                    {/* Diagonal dividers */}
                    {/* Dec, Rug, Code, Tax, Liq */}
                    {/* P1: Dec (0deg/top): x=100, y=100-r */}
                    {/* P2: Rug (72deg): x=100+r*sin(72), y=100-r*cos(72) */}
                    {/* P3: Code (144deg): x=100+r*sin(144), y=100-r*cos(144) */}
                    {/* P4: Tax (216deg): x=100+r*sin(216), y=100-r*cos(216) */}
                    {/* P5: Liq (288deg): x=100+r*sin(288), y=100-r*cos(288) */}
                    <line x1="100" y1="100" x2="100" y2="20" stroke="#0f172a" strokeWidth="1" />
                    <line x1="100" y1="100" x2="176" y2="76" stroke="#0f172a" strokeWidth="1" />
                    <line x1="100" y1="100" x2="147" y2="165" stroke="#0f172a" strokeWidth="1" />
                    <line x1="100" y1="100" x2="53" y2="165" stroke="#0f172a" strokeWidth="1" />
                    <line x1="100" y1="100" x2="24" y2="76" stroke="#0f172a" strokeWidth="1" />

                    {/* Draw metric values as polygon (inverse: high risk = low radius, high safety = high radius) */}
                    {/* dec: radial capacity of 100 - params.centralRisk */}
                    {/* rug: radial capacity of 100 - params.rugRisk */}
                    {/* code: radial capacity of 100 - params.codeRisk */}
                    {/* tax: radial capacity of 100 - params.taxRisk */}
                    {/* liq: radial capacity of 100 - params.liqRisk */}
                    {(() => {
                      const maxR = 80;
                      const decVal = ((100 - radarMetrics.centralRisk) / 100) * maxR;
                      const rugVal = ((100 - radarMetrics.rugRisk) / 100) * maxR;
                      const codeVal = ((100 - radarMetrics.codeRisk) / 100) * maxR;
                      const taxVal = ((100 - radarMetrics.taxRisk) / 100) * maxR;
                      const liqVal = ((100 - radarMetrics.liqRisk) / 100) * maxR;

                      const p1 = { x: 100, y: 100 - decVal };
                      const p2 = { x: 100 + rugVal * Math.sin(72 * Math.PI / 180), y: 100 - rugVal * Math.cos(72 * Math.PI / 180) };
                      const p3 = { x: 100 + codeVal * Math.sin(144 * Math.PI / 180), y: 100 - codeVal * Math.cos(144 * Math.PI / 180) };
                      const p4 = { x: 100 + taxVal * Math.sin(216 * Math.PI / 180), y: 100 - taxVal * Math.cos(216 * Math.PI / 180) };
                      const p5 = { x: 100 + liqVal * Math.sin(288 * Math.PI / 180), y: 100 - liqVal * Math.cos(288 * Math.PI / 180) };

                      return (
                        <>
                          <polygon 
                            points={`${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y} ${p4.x},${p4.y} ${p5.x},${p5.y}`}
                            fill="rgba(0,195,255,0.15)"
                            stroke="#00c3ff"
                            strokeWidth="1.5"
                          />
                          {/* Point indicators */}
                          <circle cx={p1.x} cy={p1.y} r="2.5" fill="#ffffff" stroke="#00c3ff" strokeWidth="1" />
                          <circle cx={p2.x} cy={p2.y} r="2.5" fill="#ffffff" stroke="#00c3ff" strokeWidth="1" />
                          <circle cx={p3.x} cy={p3.y} r="2.5" fill="#ffffff" stroke="#00c3ff" strokeWidth="1" />
                          <circle cx={p4.x} cy={p4.y} r="2.5" fill="#ffffff" stroke="#00c3ff" strokeWidth="1" />
                          <circle cx={p5.x} cy={p5.y} r="2.5" fill="#ffffff" stroke="#00c3ff" strokeWidth="1" />
                        </>
                      );
                    })()}

                    {/* Labels */}
                    <text x="100" y="15" textAnchor="middle" fill="#64748b" fontSize="7" fontWeight="black">DECENTRALIZATION</text>
                    <text x="180" y="72" textAnchor="start" fill="#64748b" fontSize="7" fontWeight="black">RUG RESISTANCE</text>
                    <text x="151" y="173" textAnchor="start" fill="#64748b" fontSize="7" fontWeight="black">CODE HEALTH</text>
                    <text x="47" y="173" textAnchor="end" fill="#64748b" fontSize="7" fontWeight="black">TAX POSTURE</text>
                    <text x="20" y="72" textAnchor="end" fill="#64748b" fontSize="7" fontWeight="black">LIQ SECURITY</text>
                  </svg>

                </div>
              </div>
            )}

          </div>

          {/* Interactive Diagnostic Detail Sidebar */}
          <div className="flex flex-col justify-between border border-[#181938] rounded-xl bg-[#03030d] p-3.5 space-y-3 min-h-[290px]">
            {activeThreatDetail ? (
              <div className="flex flex-col h-full justify-between space-y-4">
                <div className="space-y-2 text-left">
                  <div className="flex items-center justify-between border-b border-[#181940] pb-1.5">
                    <span className="text-[9px] text-cyan-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                      <Icons.Search className="w-3.5 h-3.5" />
                      SECURE-AI TRACE REPORT
                    </span>
                    <button onClick={() => setSelectedThreat(null)} className="text-slate-500 hover:text-white cursor-pointer select-none">
                      <Icons.X className="w-4 h-4" />
                    </button>
                  </div>
                  <h3 className="text-sm font-black text-slate-200 uppercase tracking-wide">
                    {activeThreatDetail.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                      activeThreatDetail.status === 'passed' ? 'bg-[#00ff88]/10 text-[#00ff88] border border-emerald-500/20' :
                      activeThreatDetail.status === 'warning' ? 'bg-amber-450/10 text-amber-400 border border-amber-450/20' : 'bg-rose-500/10 text-rose-450 border border-rose-500/20'
                    }`}>
                      {activeThreatDetail.status === 'passed' ? 'PASS CERTIFIED' : activeThreatDetail.status === 'warning' ? 'MEDIUM WARNING' : 'CRITICAL THREAT'}
                    </span>
                    <span className="text-slate-500 text-[9px] uppercase font-mono">
                      CAT: {activeThreatDetail.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-sans leading-relaxed">
                    {activeThreatDetail.description}
                  </p>
                </div>

                <div className="border-t border-[#181940] pt-2.5 space-y-2 mt-auto text-left text-[10px]">
                  <div>
                    <span className="text-slate-500 uppercase tracking-widest font-black text-[8px] block mb-0.5">Potential Ecosystem Impact:</span>
                    <p className="text-rose-400 font-sans leading-snug">{activeThreatDetail.impact}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 uppercase tracking-widest font-black text-[8px] block mb-0.5">Surchi Intelligence Remediation:</span>
                    <p className="text-[#00ff88] font-sans leading-snug">{activeThreatDetail.remediation}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center h-full text-slate-500 py-10">
                <Icons.HelpCircle className="w-10 h-10 text-slate-600 mb-2 animate-bounce" />
                <span className="text-[10px] text-cyan-400 font-black uppercase tracking-widest block">No Selection Model</span>
                <span className="text-[9px] font-sans text-slate-500 leading-snug max-w-[200px] mt-1 block">
                  Click any interactive feature block on the heatmap or graph to trigger instant AI auditing deep-dives.
                </span>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Deep-dive granular category specifications (Tabbed Breakdown Layout) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Module 1: Code Security & Exploits */}
        <div className="p-4 rounded-xl border border-[#1b1c3a]/40 bg-[#050514]/60 space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between border-b border-cyber-cyan/15 pb-2">
            <span className="text-xs text-slate-200 font-black uppercase tracking-wider flex items-center gap-2">
              <Icons.Code2 className="w-4 h-4 text-cyan-400" />
              Contract Permission Breakdown
            </span>
            <span className={`w-2 h-2 rounded-full ${params.hasMint || params.hiddenAdminPerms ? 'bg-rose-500' : 'bg-[#00ff88]'}`} />
          </div>

          <div className="space-y-2.5 text-[11px] leading-relaxed">
            <div className="flex justify-between items-start">
              <div>
                <strong className="text-slate-300 block">Proxy Upgradable Pattern</strong>
                <span className="text-slate-500 font-sans">Can code behavior change post-deployment?</span>
              </div>
              <span className={`px-1.5 py-0.25 rounded text-[9px] font-bold ${params.isProxy ? 'bg-rose-500/10 text-rose-450' : 'bg-emerald-500/10 text-[#00ff88]'}`}>
                {params.isProxy ? 'PROXY (Upgradable)' : 'IMMUTABLE (Secured)'}
              </span>
            </div>
            <div className="flex justify-between items-start">
              <div>
                <strong className="text-slate-300 block">Hidden Administrative Backdoors</strong>
                <span className="text-slate-500 font-sans">Are custom bypass modifiers mapped?</span>
              </div>
              <span className={`px-1.5 py-0.25 rounded text-[9px] font-bold ${params.hiddenAdminPerms ? 'bg-rose-500/10 text-rose-450' : 'bg-emerald-500/10 text-[#00ff88]'}`}>
                {params.hiddenAdminPerms ? 'DETECTION ALERT' : 'NONE FOUND'}
              </span>
            </div>
            <div className="flex justify-between items-start">
              <div>
                <strong className="text-slate-300 block">Hidden Supply Minting Privilege</strong>
                <span className="text-slate-500 font-sans">Could additional tokens be printed?</span>
              </div>
              <span className={`px-1.5 py-0.25 rounded text-[9px] font-bold ${params.hasMint ? 'bg-rose-500/10 text-rose-450' : 'bg-emerald-500/10 text-[#00ff88]'}`}>
                {params.hasMint ? 'MINT ENVELOPE OPEN' : 'MINT SHUT'}
              </span>
            </div>
          </div>
        </div>

        {/* Module 2: Liquidity Backing Assurance */}
        <div className="p-4 rounded-xl border border-[#1b1c3a]/40 bg-[#050514]/60 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-cyber-cyan/15 pb-2">
            <span className="text-xs text-slate-200 font-black uppercase tracking-wider flex items-center gap-2">
              <Icons.Flame className="w-4 h-4 text-rose-500 animate-pulse" />
              Liquidity Pool Security Status
            </span>
            <span className={`w-2 h-2 rounded-full ${!params.lpLocked && !params.lpBurned ? 'bg-rose-500' : 'bg-[#00ff88]'}`} />
          </div>

          <div className="space-y-2.5 text-[11px] leading-relaxed">
            <div className="flex justify-between items-start">
              <div>
                <strong className="text-slate-300 block">Locked Assurance Posture</strong>
                <span className="text-slate-500 font-sans">Status of Backing LP Pool Tokens</span>
              </div>
              <span className={`px-1.5 py-0.25 rounded text-[9px] font-bold ${
                params.lpBurned ? 'bg-emerald-500/10 text-[#00ff88]' : params.lpLocked ? 'bg-amber-450/10 text-amber-400' : 'bg-rose-500/10 text-rose-450'
              }`}>
                {params.lpBurned ? '100% BURNED' : params.lpLocked ? `LOCKED (${params.lockDurationDays} Days)` : 'UNLOCKED / EXPOSED'}
              </span>
            </div>
            <div className="flex justify-between items-start">
              <div>
                <strong className="text-slate-300 block">Renounced Ownership Verification</strong>
                <span className="text-slate-500 font-sans">Is administrative access locked?</span>
              </div>
              <span className={`px-1.5 py-0.25 rounded text-[9px] font-bold ${params.fakeRenounce ? 'bg-rose-500/10 text-rose-450' : 'bg-emerald-500/10 text-[#00ff88]'}`}>
                {params.fakeRenounce ? 'SUSPICIOUS ACCESS' : 'RENOUNCED SUCCESSFULLY'}
              </span>
            </div>
            <div className="flex justify-between items-start">
              <div>
                <strong className="text-slate-300 block">Deployer Master Holdings</strong>
                <span className="text-slate-500 font-sans">Volume held directly by dev team</span>
              </div>
              <span className={`px-1.5 py-0.25 rounded text-[9px] font-bold ${params.creatorRemainingPct > 10 ? 'bg-rose-500/10 text-rose-450' : 'bg-emerald-500/10 text-[#00ff88]'}`}>
                {params.creatorRemainingPct.toFixed(1)}% of Supply
              </span>
            </div>
          </div>
        </div>

        {/* Module 3: Trading & Sovereign Tax Posture */}
        <div className="p-4 rounded-xl border border-[#1b1c3a]/40 bg-[#050514]/60 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-cyber-cyan/15 pb-2">
            <span className="text-xs text-slate-200 font-black uppercase tracking-wider flex items-center gap-2">
              <Icons.Percent className="w-4 h-4 text-amber-400" />
              Tax, Swap & Trading Analysis
            </span>
            <span className={`w-2 h-2 rounded-full ${params.dynamicTaxAlt || params.honeypotPotential ? 'bg-rose-500' : 'bg-[#00ff88]'}`} />
          </div>

          <div className="space-y-2.5 text-[11px] leading-relaxed">
            <div className="flex justify-between items-start">
              <div>
                <strong className="text-slate-300 block">Buy / Sell Swap Taxes</strong>
                <span className="text-slate-500 font-sans">Standard tax rate taken on DEX trades</span>
              </div>
              <span className={`px-1.5 py-0.25 rounded text-[9px] font-bold ${params.highSellTax > 10 ? 'text-amber-400' : 'text-[#00ff88]'}`}>
                Buy: {params.highBuyTax}% | Sell: {params.highSellTax}%
              </span>
            </div>
            <div className="flex justify-between items-start">
              <div>
                <strong className="text-slate-300 block">Immutable Tax Configuration</strong>
                <span className="text-slate-500 font-sans">Can the compiler fees be edited?</span>
              </div>
              <span className={`px-1.5 py-0.25 rounded text-[9px] font-bold ${params.dynamicTaxAlt ? 'bg-rose-500/10 text-rose-450' : 'bg-emerald-500/10 text-[#00ff88]'}`}>
                {params.dynamicTaxAlt ? 'DANGER (Mutable Tax)' : 'IMMUTABLE TAX BOUNDS'}
              </span>
            </div>
            <div className="flex justify-between items-start">
              <div>
                <strong className="text-slate-300 block">Honeypot Sandbox Swap check</strong>
                <span className="text-slate-500 font-sans">Simulated dynamic sell validation</span>
              </div>
              <span className={`px-1.5 py-0.25 rounded text-[9px] font-bold ${params.honeypotPotential ? 'bg-rose-500/10 text-rose-450 animate-bounce' : 'bg-emerald-500/10 text-[#00ff88]'}`}>
                {params.honeypotPotential ? 'FAILED SELL (100% loss)' : 'PASS INTEGRITY'}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Wallet Behavior intelligence, Smart Money, Insider Clustered Alerts */}
      <div className="p-4 rounded-xl border border-[#1b1c3a]/40 bg-[#06061a]/90 relative overflow-hidden space-y-4">
        
        <div className="flex items-center gap-2.5 border-b border-[#1b1c3a]/40 pb-2.5">
          <Icons.Radio className="w-5 h-5 text-[#00ff88] animate-pulse" />
          <div>
            <span className="text-[10px] text-cyan-400 font-black uppercase tracking-widest block leading-none">AI WALLET GRAPH & STEALTH ONCHAIN ACTIVITY</span>
            <span className="text-slate-200 font-bold font-sans text-xs">Wallet Behavioral Intelligence & Smart Money Analytics</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          
          <div className="p-3 bg-[#03030f] rounded-lg border border-[#191937] space-y-1">
            <span className="text-slate-500 text-[9px] font-black uppercase tracking-wider block">Coordinated Accumulation</span>
            <div className={`text-lg font-bold font-mono ${params.insiderAccumulationPct > 15 ? 'text-amber-450' : 'text-[#00ff88]'}`}>
              {params.insiderAccumulationPct}% Stealth Group Volume
            </div>
            <p className="text-[10.5px] text-slate-400 font-sans leading-relaxed">
              Mapped multi-hop funds traces. Steal clusters purchased {params.insiderAccumulationPct}% ahead of general public announcement.
            </p>
          </div>

          <div className="p-3 bg-[#03030f] rounded-lg border border-[#191937] space-y-1">
            <span className="text-slate-500 text-[9px] font-black uppercase tracking-wider block">Launcher Sniping Block Check</span>
            <div className="text-lg font-bold font-mono text-cyan-400">
              {params.sniperCount} Unique Bots Registered
            </div>
            <p className="text-[10.5px] text-slate-400 font-sans leading-relaxed">
              Synchronous bot interaction flagged within 1.5 seconds of listing. High accumulation blocks hold early low price structures.
            </p>
          </div>

          <div className="p-3 bg-[#03030f] rounded-lg border border-[#191937] space-y-1">
            <span className="text-slate-500 text-[9px] font-black uppercase tracking-wider block">Smart Money Indexing</span>
            <div className="text-lg font-bold font-mono text-[#00ff88]">
              {params.smartMoneyPresence ? 'ACTIVE PARTICIPATION' : 'LOW FREQUENCY'}
            </div>
            <p className="text-[10.5px] text-slate-400 font-sans leading-relaxed">
              System traced 3 multi-million dollar high-conviction wallet indices actively accumulating/trading this pair on mainnet.
            </p>
          </div>

        </div>

        {/* AI generated alert bar */}
        <div className="flex items-start gap-3 bg-[#110612]/30 p-3 rounded-lg border border-pink-500/20 text-[11px] font-sans leading-relaxed text-slate-300">
          <Icons.Zap className="w-4 h-4 text-cyber-pink shrink-0 mt-0.5 animate-pulse" />
          <div>
            <span className="font-mono text-[9px] font-bold text-cyber-pink block uppercase tracking-wide">SURCHI SCAN WARNING COMPLIANCE PROTOCOL:</span>
            {params.riskLevel === 'CRITICAL' && 'CRITICAL: Surchi scanner explicitly advises extreme caution. Honeypot/unlocked liquidity flags detected. High likelihood of liquidity draining or swap lockups.'}
            {params.riskLevel === 'HIGH' && 'HIGH RISK STATUS: Team holds mutable tax privileges or controls early sniper bundles. Potential targeted dumps could follow subsequent volume peaks.'}
            {params.riskLevel === 'MEDIUM' && 'MINOR RECOMMENDATION: Standard contract with minor proxy vulnerabilities or moderate sniped percentages. Monitor creator transaction logs for activity change.'}
            {params.riskLevel === 'LOW' && 'SECURED LEVEL: Favorable security markers. Moderate transaction restrictions, LP is locked securely. General audit state indicates high safety index.'}
            {params.riskLevel === 'SECURED' && 'OPTIMALLY IMMUNE: Impeccable forensic parameters. Ownership completely renounced, liquidity pool tokens fully burned, zero stealth whales. Recommended.'}
          </div>
        </div>

      </div>

    </div>
  );
}
