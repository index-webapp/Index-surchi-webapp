import React, { useEffect, useState } from 'react';

interface SurchiSplashScreenProps {
  onComplete: () => void;
}

export default function SurchiSplashScreen({ onComplete }: SurchiSplashScreenProps) {
  const [isDismissing, setIsDismissing] = useState(false);
  const [dotCount, setDotCount] = useState(3);

  useEffect(() => {
    // Interactively cycle loading dots count
    const dotInterval = setInterval(() => {
      setDotCount(prev => (prev % 3) + 1);
    }, 400);

    return () => clearInterval(dotInterval);
  }, []);

  useEffect(() => {
    // Check if the user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    let timer1: NodeJS.Timeout;
    let timer2: NodeJS.Timeout;

    if (prefersReducedMotion) {
      // Respect prefers-reduced-motion: instantly show content, then dismiss after 1 second
      timer1 = setTimeout(() => {
        setIsDismissing(true);
      }, 800);

      timer2 = setTimeout(() => {
        onComplete();
      }, 1000);
    } else {
      // Normal timed loading sequence - delayed slightly for maximum cinematic effect
      // At 5000ms, trigger fade out class
      timer1 = setTimeout(() => {
        setIsDismissing(true);
      }, 5000);

      // At 5400ms, notify completion (transition to main app)
      timer2 = setTimeout(() => {
        onComplete();
      }, 5400);
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 w-screen h-screen bg-[#000000] z-[99999] flex flex-col justify-between items-center select-none overflow-hidden font-mono px-6 py-10 md:py-16 transition-opacity duration-400 ease-out ${
        isDismissing ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Inline styles for custom self-contained animations and font imports */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Share+Tech+Mono&display=swap');

        /* CRT Scanline effect overlay grid */
        .scanlines-overlay {
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            90deg,
            rgba(0, 229, 255, 0.04) 0px,
            rgba(0, 229, 255, 0.04) 1px,
            transparent 1px,
            transparent 10px
          );
          pointer-events: none;
          z-index: 10;
        }

        /* Scanline scrolling glow horizontal bar */
        .scrolling-scanline {
          position: absolute;
          left: 0;
          width: 100%;
          height: 100px;
          background: linear-gradient(to bottom, transparent, rgba(0, 229, 255, 0.015), transparent);
          pointer-events: none;
          z-index: 11;
          animation: scanlineMove 6s linear infinite;
        }

        @keyframes scanlineMove {
          0% { transform: translateY(-100px); }
          100% { transform: translateY(110vh); }
        }

        /* Font Pairings */
        .font-orbitron {
          font-family: 'Orbitron', 'Space Grotesk', sans-serif;
        }

        .font-share-tech {
          font-family: 'Share Tech Mono', 'JetBrains Mono', monospace;
        }

        /* Timed Animation Classes */
        
        /* 1. Top status typewriter */
        .animate-typewriter {
          display: inline-block;
          overflow: hidden;
          white-space: nowrap;
          border-right: 2px solid #00E5FF;
          width: 0;
          animation: 
            typewrite 1.2s steps(27, end) 200ms forwards,
            blinkCursor 0.75s step-end infinite;
        }

        @keyframes typewrite {
          from { width: 0; }
          to { width: 100%; }
        }

        @keyframes blinkCursor {
          from, to { border-color: transparent; }
          50% { border-color: #00E5FF; }
        }

        /* 2. Hero SURCHI fade-in + scale-up */
        .animate-hero {
          opacity: 0;
          transform: scale(0.92);
          animation: heroInit 0.8s cubic-bezier(0.16, 1, 0.3, 1) 700ms forwards;
          filter: drop-shadow(0 0 15px rgba(0, 229, 255, 0.35)) drop-shadow(0 0 30px rgba(124, 58, 237, 0.25));
        }

        @keyframes heroInit {
          from {
            opacity: 0;
            transform: scale(0.92);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* 3. Divider line draw outward */
        .animate-divider {
          transform: scaleX(0);
          transform-origin: center;
          animation: dividerDraw 0.6s cubic-bezier(0.16, 1, 0.3, 1) 1300ms forwards;
        }

        @keyframes dividerDraw {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }

        /* 4. Bottom status fade */
        .animate-bottom-text {
          opacity: 0;
          animation: bottomFade 0.7s cubic-bezier(0.16, 1, 0.3, 1) 1700ms forwards;
        }

        @keyframes bottomFade {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Accessibility: respect prefers-reduced-motion */
        @media (prefers-reduced-motion: reduce) {
          .animate-typewriter {
            width: 100% !important;
            border-right: none !important;
            animation: none !important;
          }
          .animate-hero {
            opacity: 1 !important;
            transform: scale(1) !important;
            animation: none !important;
          }
          .animate-divider {
            transform: scaleX(1) !important;
            animation: none !important;
          }
          .animate-bottom-text {
            opacity: 1 !important;
            transform: translateY(0) !important;
            animation: none !important;
          }
          .scrolling-scanline {
            display: none !important;
          }
        }
      `}</style>

      {/* Retro scanline background texture and light moving bar */}
      <div className="scanlines-overlay" />
      <div className="scrolling-scanline" />

      {/* Top Section: Symmetrical layout spacer matching Bottom height */}
      <div className="w-full h-6 relative z-25" />

      {/* Center Section: Main Branded Typography & Divider & Loader Status */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-25 py-12 md:py-16">
        
        {/* Technical Telemetry Tag brought close, right above the main title */}
        <div className="h-6 flex items-center mb-3">
          <span 
            className="animate-typewriter text-[#00E5FF] font-share-tech font-bold text-[10px] md:text-xs tracking-[0.25em] uppercase text-center"
          >
            ► INITIALIZING SURCHI CORE
          </span>
        </div>

        <h1 
          className="animate-hero font-orbitron font-black text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-[0.14em] pl-[0.14em] text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] via-[#2979FF] to-[#7C3AED] select-none text-center transform transition-transform"
        >
          SURCHI
        </h1>
        
        {/* Neon Gradient Divider Center Outward Drawing */}
        <div className="w-[300px] sm:w-[450px] md:w-[600px] max-w-[85vw] h-[1px] mt-8 mb-6 relative">
          <div 
            className="animate-divider absolute inset-0 bg-gradient-to-r from-[#00E5FF] to-[#7C3AED]"
          />
        </div>

        {/* Loading Status nestled close to the title and divider */}
        <p 
          className="animate-bottom-text font-share-tech text-[#A0AEC0] opacity-80 text-[10px] md:text-xs tracking-[0.3em] uppercase transition-all duration-300"
        >
          NEURAL SYSTEMS LOADING{".".repeat(dotCount)}{" ".repeat(3 - dotCount)}
        </p>
      </div>

      {/* Bottom Section: Symmetrical layout spacer matching Top telemetry height */}
      <div className="w-full h-6 relative z-25" />

    </div>
  );
}
