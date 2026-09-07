import React from 'react';
import { X, ArrowRight, CheckCircle2, Building, Clock, FileCheck } from 'lucide-react';
import { QuickActionItem } from '../types';

interface QuickActionModalProps {
  action: QuickActionItem | null;
  onClose: () => void;
  onAskJarvis: (query: string) => void;
}

export const QuickActionModal: React.FC<QuickActionModalProps> = ({
  action,
  onClose,
  onAskJarvis,
}) => {
  if (!action) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white text-slate-800 w-full max-w-lg rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-blue-50 text-[#1E5EFF]">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              SJEC Campus Portal
            </span>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              {action.title}
            </h3>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 mt-2 mb-5 leading-relaxed">
          {action.details.summary}
        </p>

        {/* Items List */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 divide-y divide-slate-200/80 space-y-3">
          {action.details.items.map((item, idx) => (
            <div
              key={idx}
              className={`flex items-start justify-between gap-3 text-xs ${
                idx !== 0 ? 'pt-3' : ''
              }`}
            >
              <div className="flex items-center gap-2 font-semibold text-slate-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>{item.label}</span>
              </div>
              <div className="text-right text-slate-600 font-medium shrink-0 max-w-[55%]">
                {item.value}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <button
            onClick={() => {
              onAskJarvis(`Tell me more about ${action.title}`);
              onClose();
            }}
            className="text-xs font-bold text-[#1E5EFF] hover:text-blue-700 flex items-center gap-1.5 cursor-pointer"
          >
            <span>Ask Jarvis about this</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
