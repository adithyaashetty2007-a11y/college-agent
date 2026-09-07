import React from 'react';
import { Zap, Globe, Map, ShieldCheck } from 'lucide-react';
import { SJECCrest } from './SJECLogos';

export const BottomFeatureStrip: React.FC = () => {
  const features = [
    {
      icon: Zap,
      title: 'Real-time Answers',
      description: 'Get accurate information in under 2 seconds',
    },
    {
      icon: Globe,
      title: 'Multilingual',
      description: 'Supports English, Kannada, Hindi & more',
    },
    {
      icon: Map,
      title: 'Interactive Map',
      description: 'Visual walking routes across campus',
    },
    {
      icon: ShieldCheck,
      title: 'RAG Powered',
      description: 'Grounded in verified SJEC documents',
    },
  ];

  return (
    <section className="mt-6 mb-2" aria-label="Campus AI Features">
      {/* 4-Column Feature Strip */}
      <div className="bg-white/80 backdrop-blur-xs border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {features.map((feat, index) => {
          const Icon = feat.icon;
          return (
            <div
              key={index}
              className="flex items-center gap-3.5 p-1 transition-transform hover:translate-y-[-1px]"
            >
              {/* Circular light blue icon badge */}
              <div className="w-10 h-10 rounded-full bg-blue-50/80 border border-blue-100 flex items-center justify-center text-[#1E5EFF] shrink-0 shadow-xs">
                <Icon className="w-5 h-5" />
              </div>

              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                  {feat.title}
                </h4>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-snug">
                  {feat.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <footer className="mt-5 pb-4 text-center">
        <div className="inline-flex items-center justify-center gap-2 text-slate-500 text-xs font-medium">
          <SJECCrest className="w-4 h-5 inline-block opacity-70" />
          <span>SJEC</span>
          <span className="text-slate-300">|</span>
          <span>Powered by Jarvis — Your Campus. Smarter.</span>
        </div>
      </footer>
    </section>
  );
};
