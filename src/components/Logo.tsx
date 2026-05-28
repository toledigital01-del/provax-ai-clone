import React from 'react';
import logoDark from '../assets/images/logo-dark.png';
import logoLight from '../assets/images/logo-light.png';

interface LogoProps {
  variant?: 'compact' | 'full' | 'shield';
  className?: string;
  theme?: 'dark' | 'light';
}

export default function Logo({ variant = 'full', className = '', theme = 'dark' }: LogoProps) {
  const isCompact = variant === 'compact';

  // Core Theme Colors
  const textColor = theme === 'light' ? 'text-slate-900' : 'text-white';
  const logoXColor = theme === 'light' ? '#0F172A' : '#FFFFFF';

  // Variante full: usa a imagem real da logo
  if (variant === 'full') {
    return (
      <img
        src={theme === 'dark' ? logoDark : logoLight}
        alt="ProvaX AI"
        className={`w-auto max-w-xs sm:max-w-sm md:max-w-md object-contain select-none ${className}`}
        draggable="false"
      />
    );
  }

  // SVG icon para variantes compact e shield
  const LogoIcon = (
    <svg
      viewBox="0 0 200 200"
      className={`${isCompact ? 'w-10 h-10' : 'w-28 h-28 sm:w-36 sm:h-36'} filter drop-shadow-md shrink-0`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="owlLogoGold" x1="0%" y1="0%" x2="100%" y2="100%" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFF4D0" />
          <stop offset="30%" stopColor="#E6C485" />
          <stop offset="60%" stopColor="#BE9755" />
          <stop offset="85%" stopColor="#A27E43" />
          <stop offset="100%" stopColor="#E9CA90" />
        </linearGradient>
        <linearGradient id="owlLogoSlate" x1="0%" y1="0%" x2="100%" y2="100%" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="50%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
        <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <g
        stroke={theme === 'light' ? 'url(#owlLogoSlate)' : 'url(#owlLogoGold)'}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M 32,96 C 32,118 42,136 54,148" />
        <path d="M 168,96 C 168,118 158,136 146,148" />
        <path d="M 32,96 C 24,62 16,36 15,16" />
        <path d="M 15,16 C 36,32 60,48 76,56" />
        <path d="M 168,96 C 176,62 184,36 185,16" />
        <path d="M 185,16 C 164,32 140,48 124,56" />
        <path d="M 38,48 C 66,28 134,28 162,48" strokeWidth="1.6" opacity="0.85" />
        <path d="M 15,16 C 45,45 80,72 100,92" strokeWidth="2.8" />
        <path d="M 185,16 C 155,45 120,72 100,92" strokeWidth="2.8" />
        <circle cx="70" cy="94" r="21" strokeWidth="2.2" />
        <circle cx="70" cy="94" r="7" fill={theme === 'light' ? 'url(#owlLogoSlate)' : 'url(#owlLogoGold)'} stroke="none" />
        <circle cx="130" cy="94" r="21" strokeWidth="2.2" />
        <circle cx="130" cy="94" r="7" fill={theme === 'light' ? 'url(#owlLogoSlate)' : 'url(#owlLogoGold)'} stroke="none" />
        <path d="M 100,88 L 109,99 L 100,111 L 91,99 Z" fill={theme === 'light' ? 'url(#owlLogoSlate)' : 'url(#owlLogoGold)'} strokeWidth="1" />
        <line x1="100" y1="140" x2="100" y2="176" strokeWidth="2.8" />
        <path d="M 100,143 C 85,128 58,128 42,138" />
        <path d="M 100,150 C 85,135 58,135 42,145" />
        <path d="M 100,157 C 85,142 58,142 42,152" />
        <path d="M 100,165 C 83,148 54,148 38,159 L 38,149 C 54,138 83,138 100,155 Z" strokeWidth="2" fill={theme === 'light' ? '#0f172a' : '#070a13'} fillOpacity="0.25" />
        <path d="M 100,143 C 115,128 142,128 158,138" />
        <path d="M 100,150 C 115,135 142,135 158,145" />
        <path d="M 100,157 C 115,142 142,142 158,152" />
        <path d="M 100,165 C 117,148 146,148 162,159 L 162,149 C 146,138 117,138 100,155 Z" strokeWidth="2" fill={theme === 'light' ? '#0f172a' : '#070a13'} fillOpacity="0.25" />
      </g>
    </svg>
  );

  if (variant === 'shield') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        {LogoIcon}
      </div>
    );
  }

  // Variante compact
  return (
    <div className={`flex flex-row items-center gap-2.5 sm:gap-3.5 ${className} select-none`}>
      <div className="relative shrink-0">
        {LogoIcon}
        <span className="absolute top-2 right-2 w-2 h-2 bg-[#22C55E] rounded-full border border-slate-950 animate-pulse" />
      </div>
      <div className="flex flex-col text-left select-text">
        <div className="flex items-center gap-1">
          <span className={`font-sans font-black tracking-widest text-base sm:text-lg leading-none ${textColor}`}>
            PROVA
          </span>
          <div className="flex font-extrabold text-[#F59E0B] text-lg sm:text-xl leading-none font-sans select-none items-center">
            <span style={{ color: logoXColor }} className="opacity-95">X</span>
            <span className="text-[#F59E0B] -ml-1">X</span>
          </div>
          <span className="font-extrabold text-[11px] sm:text-xs text-[#EA580C] leading-none font-mono tracking-wider ml-0.5 self-end pb-0.5">
            AI
          </span>
        </div>
        <span className="text-[8px] sm:text-[9.5px] font-sans font-black text-slate-400 tracking-widest leading-none uppercase mt-1">
          OPERAÇÕES PRF
        </span>
      </div>
    </div>
  );
}
