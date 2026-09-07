import React from 'react';

/**
 * High-fidelity representation of the St Joseph Engineering College (SJEC) Crest / Seal
 */
export const SJECCrest: React.FC<{ className?: string; size?: number }> = ({
  className = 'w-10 h-10',
}) => {
  return (
    <svg
      viewBox="0 0 120 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="SJEC Crest"
    >
      {/* Outer shield boundary */}
      <path
        d="M60 4L110 22V65C110 98 60 124 60 124C60 124 10 98 10 65V22L60 4Z"
        stroke="#ffffff"
        strokeWidth="3.5"
        strokeLinejoin="round"
        fill="#0b1d3a"
      />
      {/* Inner shield border */}
      <path
        d="M60 12L102 27V64C102 91 60 114 60 114C60 114 18 91 18 64V27L60 12Z"
        stroke="#ffffff"
        strokeWidth="1.8"
        strokeDasharray="3 2"
        fill="none"
        opacity="0.9"
      />

      {/* Top radiant cross / star */}
      <path
        d="M60 18V36M51 27H69"
        stroke="#ffffff"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Radiance rays */}
      <line x1="48" y1="18" x2="52" y2="22" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="72" y1="18" x2="68" y2="22" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />

      {/* Open Book of Knowledge in Center */}
      <path
        d="M60 46C52 42 36 43 32 47V72C36 68 52 67 60 71C68 67 84 68 88 72V47C84 43 68 42 60 46Z"
        fill="#ffffff"
        stroke="#0b1d3a"
        strokeWidth="1.5"
      />
      <line x1="60" y1="46" x2="60" y2="71" stroke="#0b1d3a" strokeWidth="1.8" />
      {/* Book page lines */}
      <line x1="38" y1="52" x2="54" y2="51" stroke="#0b1d3a" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="38" y1="58" x2="54" y2="57" stroke="#0b1d3a" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="38" y1="64" x2="52" y2="63" stroke="#0b1d3a" strokeWidth="1.2" strokeLinecap="round" />

      <line x1="66" y1="51" x2="82" y2="52" stroke="#0b1d3a" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="66" y1="57" x2="82" y2="58" stroke="#0b1d3a" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="68" y1="63" x2="82" y2="64" stroke="#0b1d3a" strokeWidth="1.2" strokeLinecap="round" />

      {/* Engineering Gear / Cogwheel lower section */}
      <circle cx="60" cy="88" r="14" stroke="#ffffff" strokeWidth="2.2" fill="#0b1d3a" />
      <circle cx="60" cy="88" r="7" fill="#ffffff" />
      {/* Gear teeth */}
      <path
        d="M60 70V74M60 102V106M42 88H46M74 88H78M47 75L50 78M70 98L73 101M47 101L50 98M70 78L73 75"
        stroke="#ffffff"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Ribbon Banner at bottom */}
      <path
        d="M26 100L40 96L60 99L80 96L94 100V107L80 103L60 106L40 103L26 107V100Z"
        fill="#ffffff"
      />
    </svg>
  );
};

/**
 * Faint white outline illustration of the campus building for the bottom of the sidebar
 */
export const SJECBuildingOutline: React.FC<{ className?: string }> = ({
  className = 'w-full h-auto',
}) => {
  return (
    <svg
      viewBox="0 0 240 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Base baseline */}
      <line x1="10" y1="80" x2="230" y2="80" stroke="#ffffff" strokeWidth="1" opacity="0.35" />
      <line x1="15" y1="83" x2="225" y2="83" stroke="#ffffff" strokeWidth="0.8" opacity="0.25" />

      {/* Central Dome / Tower */}
      <path
        d="M108 40C108 30 114 24 120 20C126 24 132 30 132 40H108Z"
        stroke="#ffffff"
        strokeWidth="1"
        opacity="0.4"
      />
      {/* Dome spire */}
      <line x1="120" y1="12" x2="120" y2="20" stroke="#ffffff" strokeWidth="1.2" opacity="0.45" />
      <circle cx="120" cy="11" r="1.5" fill="#ffffff" opacity="0.4" />

      {/* Central pediment */}
      <path d="M100 44L120 34L140 44H100Z" stroke="#ffffff" strokeWidth="1" opacity="0.4" />
      <rect x="103" y="44" width="34" height="36" stroke="#ffffff" strokeWidth="1" opacity="0.35" />

      {/* Center columns */}
      <line x1="109" y1="48" x2="109" y2="78" stroke="#ffffff" strokeWidth="1" opacity="0.35" />
      <line x1="116" y1="48" x2="116" y2="78" stroke="#ffffff" strokeWidth="1" opacity="0.35" />
      <line x1="124" y1="48" x2="124" y2="78" stroke="#ffffff" strokeWidth="1" opacity="0.35" />
      <line x1="131" y1="48" x2="131" y2="78" stroke="#ffffff" strokeWidth="1" opacity="0.35" />

      {/* Central Arch Portal */}
      <path d="M115 78V66C115 63 125 63 125 66V78" stroke="#ffffff" strokeWidth="1" opacity="0.5" />

      {/* Left Wing */}
      <rect x="25" y="48" width="75" height="32" stroke="#ffffff" strokeWidth="1" opacity="0.35" />
      <line x1="25" y1="48" x2="100" y2="48" stroke="#ffffff" strokeWidth="1.2" opacity="0.4" />
      {/* Left Wing Roof Balustrade */}
      <line x1="22" y1="45" x2="100" y2="45" stroke="#ffffff" strokeWidth="0.8" opacity="0.3" />
      {/* Left Wing Windows */}
      <rect x="32" y="53" width="7" height="10" stroke="#ffffff" strokeWidth="0.8" opacity="0.3" />
      <rect x="46" y="53" width="7" height="10" stroke="#ffffff" strokeWidth="0.8" opacity="0.3" />
      <rect x="60" y="53" width="7" height="10" stroke="#ffffff" strokeWidth="0.8" opacity="0.3" />
      <rect x="74" y="53" width="7" height="10" stroke="#ffffff" strokeWidth="0.8" opacity="0.3" />
      <rect x="88" y="53" width="7" height="10" stroke="#ffffff" strokeWidth="0.8" opacity="0.3" />

      <rect x="32" y="67" width="7" height="9" stroke="#ffffff" strokeWidth="0.8" opacity="0.3" />
      <rect x="46" y="67" width="7" height="9" stroke="#ffffff" strokeWidth="0.8" opacity="0.3" />
      <rect x="60" y="67" width="7" height="9" stroke="#ffffff" strokeWidth="0.8" opacity="0.3" />
      <rect x="74" y="67" width="7" height="9" stroke="#ffffff" strokeWidth="0.8" opacity="0.3" />
      <rect x="88" y="67" width="7" height="9" stroke="#ffffff" strokeWidth="0.8" opacity="0.3" />

      {/* Right Wing */}
      <rect x="140" y="48" width="75" height="32" stroke="#ffffff" strokeWidth="1" opacity="0.35" />
      <line x1="140" y1="48" x2="215" y2="48" stroke="#ffffff" strokeWidth="1.2" opacity="0.4" />
      {/* Right Wing Roof Balustrade */}
      <line x1="140" y1="45" x2="218" y2="45" stroke="#ffffff" strokeWidth="0.8" opacity="0.3" />
      {/* Right Wing Windows */}
      <rect x="146" y="53" width="7" height="10" stroke="#ffffff" strokeWidth="0.8" opacity="0.3" />
      <rect x="160" y="53" width="7" height="10" stroke="#ffffff" strokeWidth="0.8" opacity="0.3" />
      <rect x="174" y="53" width="7" height="10" stroke="#ffffff" strokeWidth="0.8" opacity="0.3" />
      <rect x="188" y="53" width="7" height="10" stroke="#ffffff" strokeWidth="0.8" opacity="0.3" />
      <rect x="202" y="53" width="7" height="10" stroke="#ffffff" strokeWidth="0.8" opacity="0.3" />

      <rect x="146" y="67" width="7" height="9" stroke="#ffffff" strokeWidth="0.8" opacity="0.3" />
      <rect x="160" y="67" width="7" height="9" stroke="#ffffff" strokeWidth="0.8" opacity="0.3" />
      <rect x="174" y="67" width="7" height="9" stroke="#ffffff" strokeWidth="0.8" opacity="0.3" />
      <rect x="188" y="67" width="7" height="9" stroke="#ffffff" strokeWidth="0.8" opacity="0.3" />
      <rect x="202" y="67" width="7" height="9" stroke="#ffffff" strokeWidth="0.8" opacity="0.3" />
    </svg>
  );
};

/**
 * 3D Robot mascot avatar for "Jarvis", matching the design's cute rounded robot with glowing cyan eyes
 */
export const JarvisAvatar: React.FC<{
  className?: string;
  isListening?: boolean;
  size?: 'sm' | 'md' | 'lg';
}> = ({ className = 'w-16 h-16', isListening = false }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        <defs>
          <linearGradient id="robotHeadGrad" x1="20" y1="10" x2="80" y2="85" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#f0f5ff" />
            <stop offset="100%" stopColor="#d2e0fb" />
          </linearGradient>
          <linearGradient id="visorglow" x1="25" y1="35" x2="75" y2="65" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0a1d37" />
            <stop offset="100%" stopColor="#081427" />
          </linearGradient>
          <linearGradient id="cyanEyes" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
          <radialGradient id="earRing" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="70%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#1e3a8a" />
          </radialGradient>
        </defs>

        {/* Small Antenna on Top */}
        <path d="M50 18V9" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" />
        <circle
          cx="50"
          cy="7"
          r="4"
          fill={isListening ? '#38bdf8' : '#2563eb'}
          className={isListening ? 'animate-pulse' : ''}
        />

        {/* Ear Headphones / Pods */}
        {/* Left Ear */}
        <rect x="8" y="32" width="9" height="26" rx="4.5" fill="url(#earRing)" />
        <circle cx="12" cy="45" r="2.5" fill="#93c5fd" />
        {/* Right Ear */}
        <rect x="83" y="32" width="9" height="26" rx="4.5" fill="url(#earRing)" />
        <circle cx="88" cy="45" r="2.5" fill="#93c5fd" />

        {/* Robot Head Body */}
        <rect
          x="14"
          y="18"
          width="72"
          height="62"
          rx="24"
          fill="url(#robotHeadGrad)"
          stroke="#e2e8f0"
          strokeWidth="1.5"
        />

        {/* Dark Visor Display */}
        <rect
          x="22"
          y="28"
          width="56"
          height="34"
          rx="14"
          fill="url(#visorglow)"
        />

        {/* Smiling Cyan Eyes */}
        {/* Left Eye */}
        <path
          d="M32 46C32 40 42 40 42 46"
          stroke="url(#cyanEyes)"
          strokeWidth="3.5"
          strokeLinecap="round"
          className={isListening ? 'animate-bounce' : ''}
        />
        {/* Right Eye */}
        <path
          d="M58 46C58 40 68 40 68 46"
          stroke="url(#cyanEyes)"
          strokeWidth="3.5"
          strokeLinecap="round"
          className={isListening ? 'animate-bounce' : ''}
        />

        {/* Small subtle smile in center visor when happy */}
        <path
          d="M47 54C48.5 56 51.5 56 53 54"
          stroke="#38bdf8"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.9"
        />

        {/* Neck / Collar */}
        <path
          d="M36 80C36 80 42 85 50 85C58 85 64 80 64 80L68 92H32L36 80Z"
          fill="#dbeafe"
          stroke="#bfdbfe"
          strokeWidth="1"
        />
        <line x1="43" y1="86" x2="57" y2="86" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </div>
  );
};
