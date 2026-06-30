import React, { useState, useRef } from 'react';
import * as Icons from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SurchiTermsModalProps {
  isOpen: boolean;
  onAccept: () => void;
  themeMode?: 'dark' | 'light';
}

export default function SurchiTermsModal({ isOpen, onAccept, themeMode = 'dark' }: SurchiTermsModalProps) {
  const [isChecked, setIsChecked] = useState(false);
  const [isDeclined, setIsDeclined] = useState(false);
  const [showSupportToast, setShowSupportToast] = useState(false);
  
  const contentRef = useRef<HTMLDivElement | null>(null);
  
  // Section refs within scroll container
  const sec1Ref = useRef<HTMLDivElement | null>(null);
  const sec3Ref = useRef<HTMLDivElement | null>(null);
  const sec9Ref = useRef<HTMLDivElement | null>(null);
  const sec10Ref = useRef<HTMLDivElement | null>(null);

  if (!isOpen) return null;

  const isLight = themeMode === 'light';

  // Smooth scroll handler
  const scrollToRef = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current && contentRef.current) {
      const topPos = ref.current.offsetTop - 10;
      contentRef.current.scrollTo({
        top: topPos,
        behavior: 'smooth'
      });
    }
  };

  const handleAgreeAndContinue = () => {
    if (!isChecked) return;
    
    // Save state in persistent storage
    localStorage.setItem('surchi_terms_accepted', 'true');
    localStorage.setItem('surchi_terms_accepted_timestamp', new Date().toISOString());
    localStorage.setItem('surchi_terms_accepted_version', '1.0');
    
    onAccept();
  };

  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center p-3 sm:p-6 z-[9999] select-none pointer-events-auto">
      {/* Impregnable dark backdrop with high blur */}
      <div className={`absolute inset-0 transition-opacity duration-300 ${
        isLight ? 'bg-slate-900/75' : 'bg-black/90'
      } backdrop-blur-xl`} />

      <AnimatePresence mode="wait">
        {!isDeclined ? (
          /* MAIN TERMS OVERLAY SCREEN */
          <motion.div
            key="terms-dialog"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -15 }}
            transition={{ type: 'spring', duration: 0.5, bounce: 0.15 }}
            className={`w-full max-w-2xl rounded-2xl flex flex-col relative max-h-[92vh] overflow-hidden border ${
              isLight 
                ? 'bg-white border-slate-200 shadow-[0_20px_50px_rgba(15,23,42,0.22)] text-slate-800' 
                : 'bg-[#04040d]/98 border-indigo-950 shadow-[0_0_80px_rgba(99,102,241,0.2)] text-white'
            }`}
          >
            {/* Upper Glow Border */}
            {!isLight && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-32 bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none rounded-full blur-2xl z-0" />
            )}

            {/* Header Area */}
            <div className={`p-4 sm:p-5 flex flex-col relative z-10 border-b shrink-0 ${
              isLight ? 'bg-slate-50 border-slate-200/80' : 'bg-[#060614]/90 border-indigo-950/50'
            }`}>
              <div className="flex items-center gap-2.5 text-left">
                <span className={`p-2 rounded-xl border shrink-0 ${
                  isLight ? 'bg-indigo-50 border-indigo-100 text-indigo-600' : 'bg-indigo-950/40 border-indigo-500/20 text-indigo-400'
                }`}>
                  <Icons.ShieldCheck className="w-5 h-5 animate-pulse" />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between flex-wrap gap-x-2 gap-y-1">
                    <span className={`text-[9px] font-mono tracking-widest uppercase font-black ${
                      isLight ? 'text-indigo-600' : 'text-indigo-400'
                    }`}>SECURE COMPLIANCE gateway</span>
                    <div className="flex items-center gap-2 font-mono text-[8px] font-bold shrink-0">
                      <span className={`px-2 py-0.5 rounded border uppercase ${
                        isLight ? 'bg-indigo-50 border-indigo-100 text-indigo-700' : 'bg-indigo-950/55 border-indigo-400/20 text-[#00e5ff]'
                      }`}>Version 1.0</span>
                      <span className={isLight ? 'text-slate-400' : 'text-slate-500'}>June 2026</span>
                    </div>
                  </div>
                  <h3 className={`text-sm sm:text-base font-black font-display uppercase tracking-tight leading-tight mt-1 truncate ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}>
                    SURCHI Terms, Risk & Disclaimer
                  </h3>
                </div>
              </div>

              <p className={`text-[11px] leading-relaxed mt-2.5 text-left font-sans ${
                isLight ? 'text-slate-600' : 'text-slate-400'
              }`}>
                Please review and accept these terms before accessing the SURCHI ecosystem, analytics tools, blockchain services, wallet integrations, staking features, swap services, and platform functionality.
              </p>
            </div>

            {/* Scrollable Document Content Box */}
            <div 
              ref={contentRef}
              className={`p-5 overflow-y-auto max-h-[46vh] sm:max-h-[50vh] text-left text-xs leading-relaxed space-y-4 font-sans select-text scroll-smooth customize-scrollbar border-b ${
                isLight 
                  ? 'bg-slate-50/50 text-slate-700 border-slate-200/80' 
                  : 'bg-[#030309]/80 text-slate-300 border-indigo-950/40'
              }`}
              style={{ scrollbarWidth: 'thin' }}
            >
              <div className={`p-4 rounded-xl border leading-relaxed mb-4 ${
                isLight ? 'border-indigo-100 bg-indigo-50/30 text-slate-800' : 'border-indigo-500/10 bg-indigo-500/5'
              }`}>
                <h4 className={`text-xs font-black font-mono mb-1 flex items-center gap-1.5 uppercase ${
                  isLight ? 'text-indigo-700' : 'text-indigo-400'
                }`}>
                  <Icons.Sparkles className="w-4 h-4 shrink-0 text-amber-500" />
                  Welcome to SURCHI
                </h4>
                <p className="font-medium text-[11.5px]">
                  This website-hosted user interface ("Interface") provides access to the SURCHI ecosystem, a decentralized blockchain-powered platform consisting of smart contracts, analytics tools, market intelligence systems, staking services, swap functionality, wallet integrations, community features, and related blockchain technologies (collectively referred to as the "SURCHI Protocol").
                </p>
                <p className="mt-2 text-[11px] opacity-90">
                  The Interface may be maintained by SURCHI contributors, developers, community members, service providers, or affiliated entities. However, all blockchain interactions are executed through decentralized smart contracts and public blockchain networks.
                </p>
                <p className="mt-1.5 text-[11px] opacity-90">
                  Because the SURCHI Protocol is decentralized and open-source, third parties may independently create websites, applications, wallets, software, or services that interact with the SURCHI Protocol without authorization, endorsement, or control by SURCHI.
                </p>
                <p className="mt-1.5 text-[11.5px] font-bold text-rose-500">
                  By accessing or using the Interface, SURCHI Protocol, smart contracts, applications, analytics tools, or related services, you acknowledge that you have read, understood, and agreed to these Terms.
                </p>
              </div>

              {/* Section 1 */}
              <div ref={sec1Ref} className="space-y-1.5 pt-1.5">
                <h4 className={`text-xs font-black font-mono uppercase border-b pb-1 flex items-center gap-1.5 ${
                  isLight ? 'text-indigo-700 border-slate-200' : 'text-[#00e5ff] border-indigo-950/50'
                }`}>
                  <span className="text-[10px] bg-indigo-500/10 px-1 rounded font-mono">1</span>
                  Decentralized Nature
                </h4>
                <p className="text-[11px] opacity-90">
                  The SURCHI Protocol operates through blockchain technology and autonomous smart contracts.
                </p>
                <p className="text-[11px] font-semibold">
                  SURCHI, its contributors, developers, advisors, affiliates, community members, partners, and service providers do not:
                </p>
                <ul className="list-disc pl-5 text-[11px] space-y-1 opacity-85">
                  <li>Control blockchain networks.</li>
                  <li>Control user wallets.</li>
                  <li>Custody user funds or assets.</li>
                  <li>Guarantee transaction execution.</li>
                  <li>Reverse completed transactions.</li>
                  <li>Guarantee uninterrupted service.</li>
                  <li>Guarantee availability of features.</li>
                  <li>Guarantee network performance.</li>
                </ul>
                <p className="text-[11px] italic opacity-85">
                  All blockchain transactions are final and irreversible once confirmed on the underlying network.
                </p>
              </div>

              {/* Section 2 */}
              <div className="space-y-1.5 pt-3">
                <h4 className={`text-xs font-black font-mono uppercase border-b pb-1 flex items-center gap-1.5 ${
                  isLight ? 'text-indigo-700 border-slate-200' : 'text-[#00e5ff] border-indigo-950/50'
                }`}>
                  <span className="text-[10px] bg-indigo-500/10 px-1 rounded font-mono">2</span>
                  No Financial, Legal, or Tax Advice
                </h4>
                <p className="text-[11px] opacity-90">
                  All content, analytics, market information, educational resources, documentation, communications, and ecosystem services are provided solely for informational and educational purposes.
                </p>
                <p className="text-[11px] font-semibold">
                  Nothing available through SURCHI constitutes:
                </p>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] pl-2 opacity-85 font-semibold font-mono">
                  <div className="flex items-center gap-1">
                    <Icons.Dot className="w-4 h-4 text-indigo-500 shrink-0" /> Financial advice
                  </div>
                  <div className="flex items-center gap-1">
                    <Icons.Dot className="w-4 h-4 text-indigo-500 shrink-0" /> Investment advice
                  </div>
                  <div className="flex items-center gap-1">
                    <Icons.Dot className="w-4 h-4 text-indigo-500 shrink-0" /> Legal advice
                  </div>
                  <div className="flex items-center gap-1">
                    <Icons.Dot className="w-4 h-4 text-indigo-500 shrink-0" /> Tax advice
                  </div>
                  <div className="flex items-center gap-1">
                    <Icons.Dot className="w-4 h-4 text-indigo-500 shrink-0" /> Accounting advice
                  </div>
                  <div className="flex items-center gap-1">
                    <Icons.Dot className="w-4 h-4 text-indigo-500 shrink-0" /> Trading recommendations
                  </div>
                </div>
                <p className="text-[11px] opacity-90">
                  Users are solely responsible for conducting their own research and obtaining professional advice before making decisions related to digital assets, blockchain services, or financial activities.
                </p>
              </div>

              {/* Section 3 */}
              <div ref={sec3Ref} className="space-y-1.5 pt-3">
                <h4 className={`text-xs font-black font-mono uppercase border-b pb-1 flex items-center gap-1.5 ${
                  isLight ? 'text-indigo-700 border-slate-200' : 'text-[#00e5ff] border-indigo-950/50'
                }`}>
                  <span className="text-[10px] bg-indigo-500/10 px-1 rounded font-mono">3</span>
                  Risk Disclosure
                </h4>
                <p className="text-[11px] opacity-90">
                  Blockchain technology and decentralized systems involve substantial risks.
                </p>
                
                <div className="space-y-2 mt-1 pl-1">
                  <div className={`p-2.5 rounded-lg border ${isLight ? 'bg-slate-100/70 border-slate-200' : 'bg-white/5 border-white/5'}`}>
                    <span className="font-bold text-[10.5px] uppercase font-mono block text-rose-500">Market Risks</span>
                    <p className="text-[10.5px] opacity-80">Price volatility, liquidity shortages, extreme market fluctuations, and unexpected financial losses.</p>
                  </div>
                  <div className={`p-2.5 rounded-lg border ${isLight ? 'bg-slate-100/70 border-slate-200' : 'bg-white/5 border-white/5'}`}>
                    <span className="font-bold text-[10.5px] uppercase font-mono block text-amber-500">Technical Risks</span>
                    <p className="text-[10.5px] opacity-80">Smart contract vulnerabilities, software bugs, protocol exploits, hardware or cloud infrastructure outages, and oracle failures.</p>
                  </div>
                  <div className={`p-2.5 rounded-lg border ${isLight ? 'bg-slate-100/70 border-slate-200' : 'bg-white/5 border-white/5'}`}>
                    <span className="font-bold text-[10.5px] uppercase font-mono block text-indigo-500">Blockchain Risks</span>
                    <p className="text-[10.5px] opacity-80">Network congestion, blockchain hard forks, distributed consensus failures, validator uptime issues, and delayed transaction confirmations.</p>
                  </div>
                  <div className={`p-2.5 rounded-lg border ${isLight ? 'bg-slate-100/70 border-slate-200' : 'bg-white/5 border-white/5'}`}>
                    <span className="font-bold text-[10.5px] uppercase font-mono block text-[#00E5FF]">Security Risks</span>
                    <p className="text-[10.5px] opacity-80">Wallet compromise, private key or seed phrase loss, phishing attacks, malware, unauthorized account access, and host hacks.</p>
                  </div>
                  <div className={`p-2.5 rounded-lg border ${isLight ? 'bg-slate-100/70 border-slate-200' : 'bg-white/5 border-white/5'}`}>
                    <span className="font-bold text-[10.5px] uppercase font-mono block text-[#00ff88]">Regulatory Risks</span>
                    <p className="text-[10.5px] opacity-80">Sudden regulatory changes, severe tax obligations, retroactive legal restrictions, or targeted compliance requirements.</p>
                  </div>
                </div>
                <p className="text-[11px] font-bold text-rose-500">
                  Users accept full responsibility for all risks associated with blockchain technology and decentralized applications.
                </p>
              </div>

              {/* Section 4 */}
              <div className="space-y-1.5 pt-3">
                <h4 className={`text-xs font-black font-mono uppercase border-b pb-1 flex items-center gap-1.5 ${
                  isLight ? 'text-indigo-700 border-slate-200' : 'text-[#00e5ff] border-indigo-950/50'
                }`}>
                  <span className="text-[10px] bg-indigo-500/10 px-1 rounded font-mono">4</span>
                  No Guarantees
                </h4>
                <p className="text-[11px] opacity-90">
                  SURCHI makes no guarantees regarding: availability of services, platform uptime, accuracy of analytics, future functionality, ecosystem growth, user adoption, network performance, integration availability, or third-party service reliability.
                </p>
                <p className="text-[11px] font-mono font-bold uppercase p-1.5 rounded text-center bg-amber-500/10 text-amber-500 border border-amber-500/10">
                  All services are provided on an "AS IS" and "AS AVAILABLE" basis.
                </p>
              </div>

              {/* Section 5 */}
              <div className="space-y-1.5 pt-3">
                <h4 className={`text-xs font-black font-mono uppercase border-b pb-1 flex items-center gap-1.5 ${
                  isLight ? 'text-indigo-700 border-slate-200' : 'text-[#00e5ff] border-indigo-950/50'
                }`}>
                  <span className="text-[10px] bg-indigo-500/10 px-1 rounded font-mono">5</span>
                  User Responsibilities
                </h4>
                <p className="text-[11px] opacity-90">
                  Users are solely responsible for: securing personal wallets, protecting private keys & seed phrases, verifying transaction details prior to signing, fully understanding blockchain risks, complying with all local/national laws, and meeting tax obligations where required.
                </p>
                <p className="text-[11px] font-extrabold text-red-500">
                  WARNING: SURCHI cannot recover lost passwords, private keys, seed phrases, wallets, or digital assets.
                </p>
              </div>

              {/* Section 6 */}
              <div className="space-y-1.5 pt-3">
                <h4 className={`text-xs font-black font-mono uppercase border-b pb-1 flex items-center gap-1.5 ${
                  isLight ? 'text-indigo-700 border-slate-200' : 'text-[#00e5ff] border-indigo-950/50'
                }`}>
                  <span className="text-[10px] bg-indigo-500/10 px-1 rounded font-mono">6</span>
                  Third-Party Services
                </h4>
                <p className="text-[11px] opacity-90">
                  The Interface may integrate with or provide access to: standard wallet providers, decentralized blockchain networks, exchanges, market data feeds, liquidity pools, decentralized oracle services, external APIs, and developer node infrastructure.
                </p>
                <p className="text-[11px] opacity-90">
                  SURCHI does not own, operate, or control these third-party services and is not responsible for their availability, security, accuracy, functionality, or performance. Use of third-party services is entirely at your own risk.
                </p>
              </div>

              {/* Section 7 */}
              <div className="space-y-1.5 pt-3">
                <h4 className={`text-xs font-black font-mono uppercase border-b pb-1 flex items-center gap-1.5 ${
                  isLight ? 'text-indigo-700 border-slate-200' : 'text-[#00e5ff] border-indigo-950/50'
                }`}>
                  <span className="text-[10px] bg-indigo-500/10 px-1 rounded font-mono">7</span>
                  Limitation of Liability
                </h4>
                <p className="text-[11.5px] font-extrabold font-mono uppercase leading-normal">
                  To the fullest extent permitted by applicable law, SURCHI and its contributors, developers, affiliates, advisors, partners, community members, and service providers shall not be liable for any direct, indirect, incidental, consequential, special, or punitive damages, including loss of profits, revenue, opportunity, data, digital assets, or business interruption.
                </p>
              </div>

              {/* Section 8 */}
              <div className="space-y-1.5 pt-3">
                <h4 className={`text-xs font-black font-mono uppercase border-b pb-1 flex items-center gap-1.5 ${
                  isLight ? 'text-indigo-700 border-slate-200' : 'text-[#00e5ff] border-indigo-950/50'
                }`}>
                  <span className="text-[10px] bg-indigo-500/10 px-1 rounded font-mono">8</span>
                  Indemnification
                </h4>
                <p className="text-[11px] opacity-90">
                  You agree to indemnify, defend, and hold harmless SURCHI and its contributors, developers, advisors, affiliates, partners, and community members from any claims, liabilities, damages, losses, costs, or expenses arising from: your use of the Interface, your violation of these Terms, your violation of applicable laws, your misuse of the Protocol, or your interactions with third-party software.
                </p>
              </div>

              {/* Section 9 */}
              <div ref={sec9Ref} className="space-y-1.5 pt-3">
                <h4 className={`text-xs font-black font-mono uppercase border-b pb-1 flex items-center gap-1.5 ${
                  isLight ? 'text-indigo-700 border-slate-200' : 'text-[#00e5ff] border-indigo-950/50'
                }`}>
                  <span className="text-[10px] bg-indigo-500/10 px-1 rounded font-mono">9</span>
                  Restricted Jurisdictions
                </h4>
                <p className="text-[11px] opacity-90">
                  The SURCHI Protocol may not be available in jurisdictions where access or use would violate applicable laws or regional sandbox regulations.
                </p>
                <p className="text-[11.5px] font-bold">
                  By using SURCHI, you represent and warrant that:
                </p>
                <ul className="list-disc pl-5 text-[11px] space-y-1 opacity-85">
                  <li>You are not located in a restricted jurisdiction (including the USA, sanctioned regions, etc.).</li>
                  <li>You are not subject to standard civil sanctions or international trade blocks.</li>
                  <li>You are not listed on any prohibited or restricted parties list maintained by governmental or international authorities.</li>
                  <li>Your use of SURCHI complies with all applicable regional laws and compliance policies.</li>
                </ul>
                <p className="text-[11px] italic opacity-85">
                  SURCHI reserves the right to restrict Access where required by national law.
                </p>
              </div>

              {/* Section 10 */}
              <div ref={sec10Ref} className="space-y-1.5 pt-3">
                <h4 className={`text-xs font-black font-mono uppercase border-b pb-1 flex items-center gap-1.5 ${
                  isLight ? 'text-indigo-700 border-slate-200' : 'text-[#00e5ff] border-indigo-950/50'
                }`}>
                  <span className="text-[10px] bg-indigo-500/10 px-1 rounded font-mono">10</span>
                  Privacy
                </h4>
                <p className="text-[11px] opacity-90">
                  Blockchain transactions are publicly visible and permanently recorded on public ledgers. Users acknowledge that complete privacy cannot be guaranteed when interacting with blockchain systems or decentralized applications.
                </p>
              </div>

              {/* Section 11 */}
              <div className="space-y-1.5 pt-3">
                <h4 className={`text-xs font-black font-mono uppercase border-b pb-1 flex items-center gap-1.5 ${
                  isLight ? 'text-indigo-700 border-slate-200' : 'text-[#00e5ff] border-indigo-950/50'
                }`}>
                  <span className="text-[10px] bg-indigo-500/10 px-1 rounded font-mono">11</span>
                  Modifications
                </h4>
                <p className="text-[11px] opacity-90">
                  SURCHI reserves the right to modify, update, suspend, replace, or discontinue any feature, service, documentation, content, or functionality at any time without prior notice. Continued use of the Interface constitutes acceptance of any updates or modifications.
                </p>
              </div>

              {/* Section 12 */}
              <div className="space-y-1.5 pt-3 pb-4">
                <h4 className={`text-xs font-black font-mono uppercase border-b pb-1 flex items-center gap-1.5 ${
                  isLight ? 'text-indigo-700 border-slate-200' : 'text-[#00e5ff] border-indigo-950/50'
                }`}>
                  <span className="text-[10px] bg-indigo-500/10 px-1 rounded font-mono">12</span>
                  Acknowledgement
                </h4>
                <p className="text-[11px] font-black uppercase text-rose-500 leading-normal">
                  BY ACCESING OR USING THE SURCHI PLATFORM, YOU ACKNOWLEDGE THAT AND CONFIRM YOU HAVE READ THESE TERMS, FULLY UNDERSTAND THE RISKS OF BLOCKCHAIN OPERATIONS, ACCEPT SOLE LIABILITY FOR YOUR ACTIONS, ACKNOWLEDGE TRANSACTION IRREVERSIBILITY, AND ACCEPT ALL RISKS ASSOCIATED WITH USING THE SURCHI ECOSYSTEM.
                </p>
                <p className="text-[11.5px] font-bold text-center border p-2 rounded border-red-500/35 bg-red-500/5 mt-2">
                  IF YOU DO NOT AGREE TO THESE TERMS, YOU ARE FORBIDDEN FROM ACCESSING OR USING THE SURCHI PLATFORM.
                </p>
              </div>
            </div>

            {/* Checkbox Agreement Section */}
            <div className={`p-4 sm:p-5 shrink-0 ${
              isLight ? 'bg-slate-50/70 border-b border-slate-200' : 'bg-[#06060c] border-b border-indigo-950/40'
            }`}>
              <label className="flex items-start gap-3 cursor-pointer select-none text-left">
                <input 
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) => setIsChecked(e.target.checked)}
                  className={`mt-1 h-4.5 w-4.5 rounded border transition-all cursor-pointer accent-indigo-600 shrink-0 ${
                    isLight ? 'border-slate-350' : 'border-indigo-800'
                  }`}
                />
                <span className={`text-[10.5px] sm:text-[11px] font-medium leading-normal select-text ${
                  isLight ? 'text-slate-650' : 'text-slate-300'
                }`}>
                  I have read, understood, and agree to the <span className="font-bold underline">SURCHI Terms of Use</span>, <span className="font-bold underline">Risk Disclosure</span>, <span className="font-bold underline">Privacy Policy</span>, and <span className="font-bold underline font-mono">Disclaimer</span>.
                </span>
              </label>
            </div>

            {/* Bottom Controls / Action Buttons */}
            <div className={`p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 relative z-20 ${
              isLight ? 'bg-slate-100 border-t border-slate-205' : 'bg-[#04040a]/90'
            }`}>
              
              {/* Footer navigation links */}
              <div className="flex items-center gap-3 font-mono text-[9px] font-semibold text-slate-500 shrink-0">
                <button 
                  onClick={() => scrollToRef(sec10Ref)} 
                  className={`hover:underline cursor-pointer ${isLight ? 'hover:text-slate-900' : 'hover:text-white'}`}
                >
                  Privacy Policy
                </button>
                <span>&bull;</span>
                <button 
                  onClick={() => scrollToRef(sec1Ref)} 
                  className={`hover:underline cursor-pointer ${isLight ? 'hover:text-slate-900' : 'hover:text-white'}`}
                >
                  Terms of Use
                </button>
                <span>&bull;</span>
                <button 
                  onClick={() => scrollToRef(sec3Ref)} 
                  className={`hover:underline cursor-pointer ${isLight ? 'hover:text-slate-900' : 'hover:text-white'}`}
                >
                  Risk Disclosure
                </button>
                <span>&bull;</span>
                <button 
                  onClick={() => setShowSupportToast(true)} 
                  className={`hover:underline cursor-pointer ${isLight ? 'hover:text-slate-900' : 'hover:text-white'}`}
                >
                  Contact Support
                </button>
              </div>

              {/* Core Execution Commands */}
              <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0 justify-end">
                <button
                  type="button"
                  onClick={() => setIsDeclined(true)}
                  className={`px-4 py-2 w-full sm:w-auto text-[10px] font-mono font-bold uppercase tracking-wider rounded-lg border transition-all cursor-pointer ${
                    isLight 
                      ? 'bg-slate-200 text-slate-600 hover:bg-slate-300 border-slate-300' 
                      : 'bg-[#080816] hover:bg-rose-950/20 text-slate-400 hover:text-red-400 border-indigo-950 hover:border-red-500/25'
                  }`}
                >
                  Decline
                </button>

                <button
                  type="button"
                  onClick={handleAgreeAndContinue}
                  disabled={!isChecked}
                  className={`px-5 py-2 w-full sm:w-auto text-[10px] font-mono font-black uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    isChecked
                      ? isLight
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer shadow-md'
                        : 'bg-indigo-500 hover:bg-indigo-400 text-white cursor-pointer shadow-[0_0_15px_rgba(99,102,241,0.45)]'
                      : isLight 
                        ? 'bg-slate-200 border border-slate-300 text-slate-400 cursor-not-allowed'
                        : 'bg-[#0c0c1b] border border-indigo-950 text-slate-650 cursor-not-allowed'
                  }`}
                >
                  <Icons.CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  Agree & Continue
                </button>
              </div>
            </div>

            {/* Support Overlay Information Toast */}
            <AnimatePresence>
              {showSupportToast && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className={`absolute bottom-16 sm:bottom-20 left-4 right-4 p-4 border rounded-xl flex items-start gap-2.5 z-50 text-left ${
                    isLight 
                      ? 'bg-slate-100 hover:bg-white text-slate-800 border-indigo-100 shadow-[0_4px_24px_rgba(15,23,42,0.1)]' 
                      : 'bg-[#080814]/95 border-indigo-500/30 text-white shadow-2xl shadow-black/80'
                  }`}
                >
                  <Icons.Mail className={`w-4.5 h-4.5 mt-0.5 shrink-0 ${isLight ? 'text-indigo-600' : 'text-[#00e5ff]'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-extrabold uppercase font-mono tracking-wider">Official Surchi Support Ledger</p>
                    <p className="text-[10px] opacity-80 mt-0.5">Please address official platform inquiries or system audit reviews to:</p>
                    <p className="text-[10.5px] font-black tracking-wide font-mono text-indigo-505 dark:text-cyber-cyan select-all mt-1">support@surchi.io</p>
                  </div>
                  <button 
                    onClick={() => setShowSupportToast(false)}
                    className="p-1 cursor-pointer rounded hover:bg-slate-500/15"
                  >
                    <Icons.X className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* REDIRECT ACCESS RESTRICTION SCREEN */
          <motion.div
            key="restriction-dialog"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`w-full max-w-md rounded-2xl p-6 border text-center font-sans space-y-4 shadow-2xl relative ${
              isLight 
                ? 'bg-white border-rose-150 shadow-[0_15px_40px_rgba(244,63,94,0.12)] text-slate-800' 
                : 'bg-[#050105]/98 border-rose-500/30 shadow-[0_0_50px_rgba(244,63,94,0.15)] text-white'
            }`}
          >
            {/* Pulsing alert shield inside overlay */}
            <div className="flex justify-center">
              <div className={`p-4 rounded-2xl border animate-bounce ${
                isLight ? 'bg-rose-50 border-rose-100 text-rose-600' : 'bg-rose-950/20 border-rose-500/30 text-rose-500'
              }`}>
                <Icons.ShieldAlert className="w-10 h-10" />
              </div>
            </div>

            <div className="space-y-1.5 select-text">
              <span className={`text-[9px] font-mono font-black tracking-widest uppercase px-2 py-0.5 rounded border inline-block ${
                isLight ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-rose-950/30 border-rose-500/20 text-rose-450'
              }`}>
                GATEWAY BLOCKED
              </span>
              <h3 className={`text-base sm:text-lg font-black font-display uppercase tracking-tight mt-1 ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>
                Compliance Requirement Not Met
              </h3>
              <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600 font-medium' : 'text-slate-300 font-medium'}`}>
                Access to SURCHI requires acceptance of the Terms of Use and Risk Disclosure.
              </p>
              <p className={`text-[10px] leading-relaxed opacity-70 italic ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                Decentralized operations require all platform triggers, token analytics, staking modules, and smart contract connections to execute under standard legal and risk disclosures.
              </p>
            </div>

            <div className="pt-3">
              <button
                type="button"
                onClick={() => setIsDeclined(false)}
                className={`py-2 px-5 w-full text-[10.5px] font-mono font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  isLight 
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md' 
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)]'
                }`}
              >
                <Icons.ArrowLeft className="w-3.5 h-3.5 shrink-0" />
                Return to Homepage
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
