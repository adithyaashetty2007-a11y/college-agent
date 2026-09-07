import React, { useState } from 'react';
import { Mic, Sparkles, ChevronRight, ArrowRight, RotateCcw } from 'lucide-react';
import { SUGGESTIONS } from '../data/campusData';
import { SuggestionQuestion } from '../types';
import { JarvisAvatar } from './SJECLogos';

interface JarvisAssistantCardProps {
  onSelectSuggestion: (question: SuggestionQuestion) => void;
  onStartVoice: () => void;
  isVoiceActive?: boolean;
}

const SpeechDotsIcon: React.FC<{ className?: string; isSelected?: boolean }> = ({
  className = 'w-4 h-4',
  isSelected = false,
}) => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M17 9.5C17 13.0899 13.866 16 10 16C8.80517 16 7.68307 15.7271 6.70295 15.2447L3 16.5L4.17937 13.4356C3.43468 12.3168 3 10.9635 3 9.5C3 5.91015 6.13401 3 10 3C13.866 3 17 5.91015 17 9.5Z"
      stroke={isSelected ? '#ffffff' : '#1E5EFF'}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={isSelected ? '#1E5EFF' : 'none'}
    />
    <circle cx="7" cy="9.5" r="1" fill={isSelected ? '#ffffff' : '#1E5EFF'} />
    <circle cx="10" cy="9.5" r="1" fill={isSelected ? '#ffffff' : '#1E5EFF'} />
    <circle cx="13" cy="9.5" r="1" fill={isSelected ? '#ffffff' : '#1E5EFF'} />
  </svg>
);

export const JarvisAssistantCard: React.FC<JarvisAssistantCardProps> = ({
  onSelectSuggestion,
  onStartVoice,
  isVoiceActive = false,
}) => {
  const [activeMessage, setActiveMessage] = useState<string>(
    "Hi! I'm Jarvis 👋\nI can help you with department locations, fee deadlines, administrative procedures, and much more. Just ask me anything!"
  );
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);

  const selectedSuggestion = SUGGESTIONS.find((s) => s.id === selectedQuestionId);

  const handleChipClick = (suggestion: SuggestionQuestion) => {
    setSelectedQuestionId(suggestion.id);
    setActiveMessage(suggestion.answer);
  };

  const handleOpenInChat = (suggestion: SuggestionQuestion) => {
    onSelectSuggestion(suggestion);
  };

  const handleResetChat = () => {
    setSelectedQuestionId(null);
    setActiveMessage(
      "Hi! I'm Jarvis 👋\nI can help you with department locations, fee deadlines, administrative procedures, and much more. Just ask me anything!"
    );
  };

  // Waveform bars data for split audio visualizer
  const leftBars = [7, 12, 18, 14, 25, 19, 11, 6];
  const rightBars = [6, 11, 20, 27, 15, 21, 13, 8];

  return (
    <div className="bg-[#EDF4FA] border border-blue-100/90 rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex flex-col justify-between shadow-xs transition-all">
      {/* Top: Mascot Avatar & Title */}
      <div>
        <div className="flex items-center gap-3.5 mb-3 sm:mb-4">
          <JarvisAvatar className="w-13 h-13 sm:w-15 sm:h-15 shrink-0" isListening={isVoiceActive} />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#1E5EFF] tracking-tight">
                Jarvis
              </h3>
            </div>
            <p className="text-xs sm:text-sm font-medium text-slate-700">
              Your SJEC AI Assistant
            </p>
            <div className="flex items-center gap-1.5 mt-0.5 sm:mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-semibold text-emerald-600 tracking-wide">
                Online
              </span>
            </div>
          </div>
        </div>

        {/* Chat Speech Bubble */}
        <div className="relative bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 mb-3 sm:mb-4">
          {/* Speech bubble pointer notch */}
          <div className="absolute -top-2 left-6 w-3.5 h-3.5 bg-white border-t border-l border-slate-200/80 rotate-45" />

          <p className="text-slate-700 text-xs sm:text-[13px] leading-relaxed whitespace-pre-line relative z-10 font-normal">
            {activeMessage}
          </p>

          {selectedSuggestion && (
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2 relative z-10">
              <button
                type="button"
                onClick={handleResetChat}
                className="text-[11px] font-semibold text-slate-500 hover:text-slate-700 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>

              <button
                type="button"
                onClick={() => handleOpenInChat(selectedSuggestion)}
                className="text-[11px] font-bold text-[#1E5EFF] hover:text-blue-700 flex items-center gap-1 cursor-pointer transition-colors bg-blue-50 hover:bg-blue-100/80 px-2.5 py-1 rounded-full border border-blue-200/60"
              >
                Open in Ask Jarvis chat <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Center: Microphone with Sound Waveform split on both sides */}
        <div className="flex flex-col items-center justify-center my-2 sm:my-3">
          <div className="w-full flex items-center justify-center gap-2 sm:gap-3 px-1">
            {/* Left Sound Waveform */}
            <div
              className="flex-1 flex items-center justify-end gap-1 sm:gap-1.5 max-w-[95px] sm:max-w-[120px] h-9"
              aria-hidden="true"
            >
              {leftBars.map((height, i) => (
                <span
                  key={`left-wave-${i}`}
                  className="w-1 bg-[#2563EB] rounded-full transition-all duration-300"
                  style={{
                    height: isVoiceActive
                      ? `${Math.max(8, (height * 1.3) % 32)}px`
                      : `${height}px`,
                    opacity: 0.55 + (i % 3) * 0.15,
                    animation: isVoiceActive
                      ? `pulse 0.7s ease-in-out infinite alternate ${i * 0.08}s`
                      : 'none',
                  }}
                />
              ))}
            </div>

            {/* Central Circular Mic Button with Concentric Glow */}
            <div className="relative flex items-center justify-center shrink-0">
              {/* Concentric subtle glowing ripple rings */}
              <div
                className={`absolute w-22 h-22 sm:w-26 sm:h-26 rounded-full bg-blue-400/15 transition-all duration-700 ${
                  isVoiceActive ? 'scale-125 animate-ping' : ''
                }`}
              />
              <div className="absolute w-18 h-18 sm:w-22 sm:h-22 rounded-full bg-blue-500/20" />

              <button
                id="jarvis-mic-button"
                onClick={onStartVoice}
                className={`relative z-10 w-16 h-16 sm:w-18 sm:h-18 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 cursor-pointer ${
                  isVoiceActive
                    ? 'bg-gradient-to-tr from-rose-500 to-pink-500 shadow-rose-500/40 scale-105'
                    : 'bg-gradient-to-b from-[#2B72FF] to-[#1450E6] shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-105 active:scale-95'
                }`}
                aria-label={isVoiceActive ? 'Stop listening' : 'Tap to speak'}
              >
                <Mic className={`w-7 h-7 sm:w-8 sm:h-8 ${isVoiceActive ? 'animate-bounce' : ''}`} />
              </button>
            </div>

            {/* Right Sound Waveform */}
            <div
              className="flex-1 flex items-center justify-start gap-1 sm:gap-1.5 max-w-[95px] sm:max-w-[120px] h-9"
              aria-hidden="true"
            >
              {rightBars.map((height, i) => (
                <span
                  key={`right-wave-${i}`}
                  className="w-1 bg-[#2563EB] rounded-full transition-all duration-300"
                  style={{
                    height: isVoiceActive
                      ? `${Math.max(8, (height * 1.3) % 32)}px`
                      : `${height}px`,
                    opacity: 0.55 + (i % 3) * 0.15,
                    animation: isVoiceActive
                      ? `pulse 0.7s ease-in-out infinite alternate ${(7 - i) * 0.08}s`
                      : 'none',
                  }}
                />
              ))}
            </div>
          </div>

          <p className="text-xs font-semibold text-slate-600 mt-2 tracking-wide">
            {isVoiceActive ? 'Listening to your voice...' : 'Tap to speak'}
          </p>
        </div>
      </div>

      {/* Bottom: "Try asking..." Section with 5 Suggestion Chips */}
      <div className="mt-2 pt-2 border-t border-blue-100/70">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold text-slate-700 tracking-wide flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#1E5EFF]" />
            Try asking...
          </h4>
          <span className="text-[10px] font-semibold text-slate-500 bg-white/80 px-2 py-0.5 rounded-full border border-slate-200/60">
            Tap to ask Jarvis
          </span>
        </div>

        {/* Suggestion Chips Container: Clean, fully visible list with NO clipping */}
        <div className="space-y-2">
          {SUGGESTIONS.map((item) => {
            const isSelected = selectedQuestionId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                id={`suggestion-${item.id}`}
                onClick={() => handleChipClick(item)}
                className={`group w-full flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-xl text-left transition-all duration-200 cursor-pointer border ${
                  isSelected
                    ? 'bg-[#1E5EFF] text-white border-[#1E5EFF] shadow-md'
                    : 'bg-white hover:bg-blue-50/70 text-slate-700 hover:text-slate-900 border-slate-200/80 hover:border-blue-300 shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <SpeechDotsIcon
                    className="w-4 h-4 shrink-0"
                    isSelected={isSelected}
                  />
                  <span
                    className={`text-xs sm:text-[13px] font-medium leading-snug break-words ${
                      isSelected ? 'text-white' : 'text-slate-800'
                    }`}
                  >
                    {item.question}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-md transition-colors ${
                      isSelected
                        ? 'bg-white/25 text-white'
                        : 'bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-700'
                    }`}
                  >
                    {item.category}
                  </span>
                  <ChevronRight
                    className={`w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 ${
                      isSelected
                        ? 'text-white'
                        : 'text-slate-400 group-hover:text-blue-600'
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
