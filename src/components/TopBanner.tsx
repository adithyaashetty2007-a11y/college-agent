import React, { useState, useEffect } from 'react';
import { Globe, ChevronDown, Menu, Check } from 'lucide-react';

interface TopBannerProps {
  onOpenMobileMenu: () => void;
  selectedLanguage: string;
  onSelectLanguage: (lang: string) => void;
}

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'tu', label: 'Tulu', native: 'ತುಳು' },
];

export const TopBanner: React.FC<TopBannerProps> = ({
  onOpenMobileMenu,
  selectedLanguage,
  onSelectLanguage,
}) => {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [timeString, setTimeString] = useState('10:24 AM');
  const [dateString, setDateString] = useState('Tue, 27 May 2025');

  // Realistic live clock with reference fallback
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format time as hh:mm A
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      setTimeString(`${formattedHours}:${formattedMinutes} ${ampm}`);

      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];
      setDateString(
        `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="relative w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-lg mb-6 border border-slate-700/20">
      {/* Background Campus Image with Gradient Overlays */}
      <div className="absolute inset-0 bg-slate-900">
        <img
          src="https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=1800&auto=format&fit=crop"
          alt="SJEC Campus Architecture"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-105 filter brightness-75"
        />
        {/* Dark Navy Blue Vignette Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1D3A]/95 via-[#0B1D3A]/80 to-[#0B1D3A]/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1D3A]/70 via-transparent to-[#0B1D3A]/40" />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 p-4 sm:p-6 md:p-8 lg:px-10">
        {/* Mobile Layout (< md): Date/Time on Top-Left, Language on Top-Right, then Welcome to SJEC below */}
        <div className="md:hidden flex flex-col gap-3">
          {/* Top Row: Date & Time on Left, Language & Menu on Right */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-300 text-[11px] font-medium tracking-wide">
                {dateString}
              </p>
              <p className="text-white text-base font-bold tracking-tight">
                {timeString}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Language Selector Pill */}
              <div className="relative">
                <button
                  id="lang-selector-button-mobile"
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className="bg-[#0B1D3A]/70 hover:bg-[#0B1D3A] text-white border border-white/20 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all shadow-sm backdrop-blur-md cursor-pointer"
                  aria-expanded={isLangOpen}
                >
                  <Globe className="w-3.5 h-3.5 text-blue-300 shrink-0" />
                  <span>{selectedLanguage}</span>
                  <ChevronDown
                    className={`w-3 h-3 text-slate-300 transition-transform duration-200 ${
                      isLangOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isLangOpen && (
                  <div
                    className="absolute right-0 mt-2 w-40 bg-[#0B1D3A] border border-white/15 rounded-xl shadow-xl py-1.5 z-30 backdrop-blur-md"
                    onMouseLeave={() => setIsLangOpen(false)}
                  >
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          onSelectLanguage(lang.label);
                          setIsLangOpen(false);
                        }}
                        className="w-full px-3 py-1.5 text-left text-xs flex items-center justify-between hover:bg-white/10 text-slate-200 hover:text-white transition-colors"
                      >
                        <span>
                          {lang.label} <span className="text-slate-400 text-[10px] font-normal">({lang.native})</span>
                        </span>
                        {selectedLanguage === lang.label && (
                          <Check className="w-3.5 h-3.5 text-blue-400" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile hamburger menu button */}
              <button
                onClick={onOpenMobileMenu}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/10"
                aria-label="Open navigation menu"
              >
                <Menu className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Heading Row */}
          <div>
            <h2 className="text-white text-2xl font-extrabold tracking-tight">
              Welcome to SJEC
            </h2>
            <p className="text-slate-200 text-sm font-normal mt-0.5 tracking-normal">
              How can I help you today?
            </p>
          </div>
        </div>

        {/* Desktop Layout (md: and up): Side-by-side greeting & stats */}
        <div className="hidden md:flex items-center justify-between gap-6">
          {/* Left: Greeting */}
          <div>
            <h2 className="text-white text-3xl lg:text-4xl font-extrabold tracking-tight">
              Welcome to SJEC
            </h2>
            <p className="text-blue-100/90 text-base font-normal mt-1 tracking-wide">
              How can I help you today?
            </p>
          </div>

          {/* Right: Date, Time & Language selector */}
          <div className="flex items-center justify-end gap-6 sm:gap-8">
            {/* Date & Time Block */}
            <div className="text-right">
              <p className="text-slate-300 text-xs sm:text-sm font-medium tracking-wide">
                {dateString}
              </p>
              <p className="text-white text-2xl lg:text-3xl font-bold tracking-tight">
                {timeString}
              </p>
            </div>

            {/* Language Selector Pill */}
            <div className="relative">
              <button
                id="lang-selector-button"
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="bg-[#0B1D3A]/80 hover:bg-[#0B1D3A] text-white border border-white/20 px-3.5 py-2 rounded-full text-xs sm:text-sm font-medium flex items-center gap-2 transition-all shadow-md backdrop-blur-md cursor-pointer"
                aria-expanded={isLangOpen}
              >
                <Globe className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{selectedLanguage}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-300 transition-transform duration-200 ${
                    isLangOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isLangOpen && (
                <div
                  className="absolute right-0 mt-2 w-44 bg-[#0B1D3A] border border-white/15 rounded-xl shadow-xl py-1.5 z-30 backdrop-blur-md"
                  onMouseLeave={() => setIsLangOpen(false)}
                >
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        onSelectLanguage(lang.label);
                        setIsLangOpen(false);
                      }}
                      className="w-full px-3.5 py-2 text-left text-xs sm:text-sm flex items-center justify-between hover:bg-white/10 text-slate-200 hover:text-white transition-colors"
                    >
                      <span>
                        {lang.label} <span className="text-slate-400 text-xs font-normal">({lang.native})</span>
                      </span>
                      {selectedLanguage === lang.label && (
                        <Check className="w-4 h-4 text-blue-400" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
