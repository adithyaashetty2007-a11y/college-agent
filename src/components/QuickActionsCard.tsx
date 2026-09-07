import React from 'react';
import {
  Compass,
  Calendar,
  FileText,
  Clock,
  Users,
  ChevronRight,
  Mic,
} from 'lucide-react';
import { QUICK_ACTIONS } from '../data/campusData';
import { QuickActionItem } from '../types';
import { JarvisAvatar } from './SJECLogos';

interface QuickActionsCardProps {
  onSelectAction: (action: QuickActionItem) => void;
  onStartVoice: () => void;
}

export const QuickActionsCard: React.FC<QuickActionsCardProps> = ({
  onSelectAction,
  onStartVoice,
}) => {
  const getBadgeStyle = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-blue-50 border-blue-100 text-[#1E5EFF]',
          icon: Compass,
        };
      case 'purple':
        return {
          bg: 'bg-purple-50 border-purple-100 text-purple-600',
          icon: Calendar,
        };
      case 'emerald':
        return {
          bg: 'bg-emerald-50 border-emerald-100 text-emerald-600',
          icon: FileText,
        };
      case 'amber':
        return {
          bg: 'bg-amber-50 border-amber-100 text-amber-600',
          icon: Clock,
        };
      case 'rose':
      default:
        return {
          bg: 'bg-rose-50 border-rose-100 text-rose-600',
          icon: Users,
        };
    }
  };

  return (
    <div className="flex flex-col justify-between h-full gap-5">
      {/* Quick Actions List Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 tracking-tight mb-4">
          Quick Actions
        </h3>

        <div className="space-y-2.5">
          {QUICK_ACTIONS.map((item) => {
            const badge = getBadgeStyle(item.badgeColor);
            const Icon = badge.icon;

            return (
              <button
                key={item.id}
                id={`quick-action-${item.id}`}
                onClick={() => onSelectAction(item)}
                className="w-full group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200/70 transition-all duration-200 cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  {/* Colored Icon Badge */}
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 ${badge.bg}`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                      {item.title}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-none">
                      {item.description}
                    </p>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
              </button>
            );
          })}
        </div>
      </div>

      {/* "Need more help?" Navy Card */}
      <div className="bg-[#0B1D3A] text-white rounded-2xl p-5 shadow-lg border border-slate-800 relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start gap-3.5 mb-3.5 relative z-10">
          <JarvisAvatar className="w-12 h-12 shrink-0" />
          <div>
            <h4 className="text-sm sm:text-base font-bold text-white tracking-tight">
              Need more help?
            </h4>
            <p className="text-xs text-slate-300 mt-1 leading-snug">
              Talk to Jarvis anytime, anywhere on campus.
            </p>
          </div>
        </div>

        <button
          id="btn-voice-chat-action"
          onClick={onStartVoice}
          className="w-full border border-white/40 hover:border-white hover:bg-white/10 text-white rounded-xl py-2.5 px-4 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer active:scale-98 relative z-10 shadow-xs"
        >
          <Mic className="w-4 h-4 text-blue-400" />
          <span>Start a Voice Chat</span>
        </button>
      </div>
    </div>
  );
};
