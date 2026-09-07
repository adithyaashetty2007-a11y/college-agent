import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Mic,
  Square,
  Sparkles,
  Volume2,
  MessageSquareText,
  RotateCcw,
  Headphones,
} from 'lucide-react';
import { JarvisAvatar } from './SJECLogos';

export type VoiceState = 'listening' | 'thinking' | 'speaking' | 'ready';

interface VoiceModeOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSpokenQuery?: (query: string) => void;
  onSwitchToText?: (query?: string) => void;
}

interface MockScenario {
  question: string;
  answer: string;
}

const SAMPLE_SCENARIOS: MockScenario[] = [
  {
    question: 'Where is the CSE department?',
    answer:
      'The CSE department is located in Academic Block III on the second and third floors. Walk straight past the central courtyard from the main entrance.',
  },
  {
    question: 'What is the last date for fee payment?',
    answer:
      'The deadline for semester fee payment without fine is June 15, 2025. You can pay online via the SJEC ERP portal.',
  },
  {
    question: 'How do I apply for a Bonafide certificate?',
    answer:
      'Download the bonafide request form from the ERP portal, get your HOD signature, and submit it at Academic Counter 3 in the Admin Block.',
  },
  {
    question: 'Where is the Central Library?',
    answer:
      'The Central Library is right across the main lawn next to the Civil Engineering block. It is open from 8:30 AM to 8:00 PM.',
  },
];

export const VoiceModeOverlay: React.FC<VoiceModeOverlayProps> = ({
  isOpen,
  onClose,
  onSpokenQuery,
  onSwitchToText,
}) => {
  const [voiceState, setVoiceState] = useState<VoiceState>('listening');
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [displayedUserText, setDisplayedUserText] = useState('');
  const [displayedJarvisText, setDisplayedJarvisText] = useState('');
  const [waveformHeights, setWaveformHeights] = useState<number[]>(Array(24).fill(8));

  // Audio synthesis reference (optional natural voice)
  const isMountedRef = useRef(true);
  const streamIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const stateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const waveformIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentScenario = SAMPLE_SCENARIOS[scenarioIndex % SAMPLE_SCENARIOS.length];

  // Clear all timers helper
  const clearAllTimers = () => {
    if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
    if (stateTimeoutRef.current) clearTimeout(stateTimeoutRef.current);
    if (waveformIntervalRef.current) clearInterval(waveformIntervalRef.current);
  };

  // Start voice sequence from listening
  const startListeningSequence = (newScenarioIdx?: number) => {
    clearAllTimers();
    const idx = newScenarioIdx !== undefined ? newScenarioIdx : scenarioIndex;
    if (newScenarioIdx !== undefined) {
      setScenarioIndex(newScenarioIdx);
    }

    const targetScenario = SAMPLE_SCENARIOS[idx % SAMPLE_SCENARIOS.length];
    setVoiceState('listening');
    setDisplayedUserText('');
    setDisplayedJarvisText('');

    // Stream words one-by-one to simulate real-time live transcription
    const words = targetScenario.question.split(' ');
    let currentWordIdx = 0;

    // Small delay before user starts speaking
    stateTimeoutRef.current = setTimeout(() => {
      streamIntervalRef.current = setInterval(() => {
        if (currentWordIdx < words.length) {
          const partial = words.slice(0, currentWordIdx + 1).join(' ');
          setDisplayedUserText(partial);
          currentWordIdx++;
        } else {
          // Finished speaking
          if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
          // Transition to thinking after user pauses
          stateTimeoutRef.current = setTimeout(() => {
            handleFinishedListening(targetScenario);
          }, 800);
        }
      }, 320);
    }, 600);
  };

  // Transition from listening to thinking, then speaking
  const handleFinishedListening = (scenario: MockScenario) => {
    clearAllTimers();
    setDisplayedUserText(scenario.question);
    setVoiceState('thinking');

    // Thinking delay
    stateTimeoutRef.current = setTimeout(() => {
      setVoiceState('speaking');

      // Stream Jarvis response text
      const jarvisWords = scenario.answer.split(' ');
      let jarvisWordIdx = 0;

      streamIntervalRef.current = setInterval(() => {
        if (jarvisWordIdx < jarvisWords.length) {
          const partial = jarvisWords.slice(0, jarvisWordIdx + 1).join(' ');
          setDisplayedJarvisText(partial);
          jarvisWordIdx++;
        } else {
          if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
          // Transition to ready / tap to speak again
          stateTimeoutRef.current = setTimeout(() => {
            setVoiceState('ready');
            if (onSpokenQuery) {
              onSpokenQuery(scenario.question);
            }
          }, 1200);
        }
      }, 160);
    }, 1400);
  };

  // Stop listening manually (via Stop button)
  const handleStopListening = () => {
    if (voiceState === 'listening') {
      clearAllTimers();
      // If user hasn't finished full question yet, complete it or take current
      const q = displayedUserText || currentScenario.question;
      setDisplayedUserText(q);
      handleFinishedListening(currentScenario);
    }
  };

  // Waveform animation engine based on active state
  useEffect(() => {
    if (!isOpen) return;

    waveformIntervalRef.current = setInterval(() => {
      setWaveformHeights(() => {
        return Array.from({ length: 24 }, (_, i) => {
          if (voiceState === 'listening') {
            // Highly dynamic, reacting to live microphone voice input
            const centerFactor = 1 - Math.abs(i - 11.5) / 12;
            const randomJitter = Math.random() * 26 + 6;
            return Math.min(38, Math.max(6, randomJitter * (centerFactor * 0.9 + 0.4)));
          } else if (voiceState === 'speaking') {
            // Calmer, smooth harmonic sine wave
            const time = Date.now() / 180;
            const sineWave = Math.sin(time + i * 0.45) * 12 + 16;
            return Math.min(32, Math.max(8, sineWave));
          } else if (voiceState === 'thinking') {
            // Gentle breathing wave
            const time = Date.now() / 400;
            const wave = Math.sin(time + i * 0.3) * 6 + 10;
            return wave;
          } else {
            // Ready / idle
            return 6;
          }
        });
      });
    }, 80);

    return () => {
      if (waveformIntervalRef.current) clearInterval(waveformIntervalRef.current);
    };
  }, [isOpen, voiceState]);

  // Trigger start sequence when modal opens
  useEffect(() => {
    if (isOpen) {
      startListeningSequence(0);
    } else {
      clearAllTimers();
    }
    return () => {
      clearAllTimers();
    };
  }, [isOpen]);

  // Handle ESC key to exit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-between bg-[#070E1E] text-white overflow-hidden select-none transition-opacity duration-300 animate-fade-in"
      style={{
        backgroundImage: `
          radial-gradient(circle at 50% 32%, rgba(30, 94, 255, 0.22) 0%, rgba(14, 165, 233, 0.08) 40%, rgba(7, 14, 30, 0.98) 75%),
          linear-gradient(180deg, #09152B 0%, #060B17 100%)
        `,
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Jarvis Voice Mode"
    >
      {/* Subtle Top Ambient Glow Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 bg-blue-500/10 blur-3xl pointer-events-none" />

      {/* 1. Header (Fixed Top) */}
      <header className="relative z-10 w-full px-5 py-4 flex items-center justify-between border-b border-white/10 max-w-xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#38bdf8]" />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white tracking-wide">
              Jarvis <span className="text-cyan-400 font-medium text-xs">Voice Mode</span>
            </span>
            <span className="text-[10px] text-slate-400">
              SJEC Campus Assistant
            </span>
          </div>
        </div>

        {/* Small "X" close icon in top-right corner to exit voice mode */}
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-white/10"
          aria-label="Close voice mode and return to chat"
          title="Exit voice mode (Esc)"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      {/* 2. Main Center Body: Avatar + Status + Live Transcript */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-5 max-w-md w-full mx-auto text-center my-auto">
        {/* Centered Large Animated Mascot Avatar with soft pulsing glow/rings */}
        <div className="relative flex items-center justify-center my-2">
          {/* Animated Glow Rings for Listening State */}
          {voiceState === 'listening' && (
            <>
              <div className="absolute w-52 h-52 rounded-full border border-cyan-400/30 animate-ping opacity-60" />
              <div className="absolute w-44 h-44 rounded-full bg-blue-500/20 animate-pulse blur-sm" />
              <div className="absolute w-36 h-36 rounded-full bg-cyan-400/25 blur-md" />
            </>
          )}

          {/* Animated Glow Rings for Thinking State */}
          {voiceState === 'thinking' && (
            <>
              <div className="absolute w-44 h-44 rounded-full border-2 border-dashed border-blue-400/40 animate-spin" />
              <div className="absolute w-36 h-36 rounded-full bg-indigo-500/25 blur-lg animate-pulse" />
            </>
          )}

          {/* Animated Glow Rings for Speaking State */}
          {voiceState === 'speaking' && (
            <>
              <div className="absolute w-48 h-48 rounded-full border border-blue-400/40 animate-pulse" />
              <div className="absolute w-40 h-40 rounded-full bg-[#1E5EFF]/25 blur-md animate-pulse" />
            </>
          )}

          {/* Ambient idle glow for Ready state */}
          {voiceState === 'ready' && (
            <div className="absolute w-36 h-36 rounded-full bg-blue-600/15 blur-md" />
          )}

          {/* Large Robot Avatar Container */}
          <div className="relative z-10 p-2 rounded-full bg-gradient-to-b from-white/10 to-transparent border border-white/15 backdrop-blur-xs shadow-2xl transition-transform duration-300 hover:scale-105">
            <JarvisAvatar
              className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-[0_10px_25px_rgba(30,94,255,0.4)]"
              isListening={voiceState === 'listening'}
            />
          </div>
        </div>

        {/* Status Text below Avatar */}
        <div className="mt-4 mb-2 flex items-center justify-center gap-2">
          {voiceState === 'listening' && (
            <div className="flex items-center gap-2 text-cyan-400 font-semibold text-base sm:text-lg tracking-wide">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <span>Listening...</span>
            </div>
          )}

          {voiceState === 'thinking' && (
            <div className="flex items-center gap-2 text-blue-300 font-semibold text-base sm:text-lg tracking-wide">
              <Sparkles className="w-4 h-4 text-blue-400 animate-spin" />
              <span>Thinking...</span>
            </div>
          )}

          {voiceState === 'speaking' && (
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-base sm:text-lg tracking-wide">
              <Volume2 className="w-4 h-4 text-emerald-400 animate-bounce" />
              <span>Speaking...</span>
            </div>
          )}

          {voiceState === 'ready' && (
            <div className="flex items-center gap-2 text-slate-300 font-semibold text-sm sm:text-base tracking-wide">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span>Response complete</span>
            </div>
          )}
        </div>

        {/* Live Transcript Area below Status Text */}
        <div className="w-full mt-2 min-h-[110px] flex flex-col items-center justify-center px-2">
          {/* User Spoken Text (Streaming real-time) */}
          <div className="text-base sm:text-lg font-medium text-slate-100 leading-snug max-w-sm">
            {displayedUserText ? (
              <p className="inline">
                &ldquo;{displayedUserText}&rdquo;
                {voiceState === 'listening' && (
                  <span className="inline-block w-1.5 h-4 ml-1 bg-cyan-400 animate-pulse align-middle" />
                )}
              </p>
            ) : (
              <p className="text-slate-400 text-sm italic">
                Speak now... try asking about CSE block, library, or fees
              </p>
            )}
          </div>

          {/* Jarvis Spoken Response Box (Appears during Speaking / Ready) */}
          {(voiceState === 'speaking' || voiceState === 'ready') && displayedJarvisText && (
            <div className="mt-3.5 p-3.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 text-left text-xs sm:text-sm text-slate-200 shadow-lg animate-fade-in w-full">
              <div className="flex items-center gap-1.5 text-cyan-300 font-bold text-[11px] mb-1 uppercase tracking-wider">
                <JarvisAvatar className="w-4 h-4 inline" />
                <span>Jarvis</span>
              </div>
              <p className="leading-relaxed font-normal">{displayedJarvisText}</p>
            </div>
          )}
        </div>

        {/* Quick Sample Voice Prompts (For interactive demonstration) */}
        <div className="mt-3 flex items-center justify-center gap-1.5 flex-wrap">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block w-full mb-0.5">
            Or try a quick question:
          </span>
          {SAMPLE_SCENARIOS.map((scenario, idx) => (
            <button
              key={idx}
              onClick={() => startListeningSequence(idx)}
              className={`text-[11px] px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                scenarioIndex === idx
                  ? 'bg-blue-600/30 border-cyan-400/60 text-cyan-200'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
              }`}
            >
              {scenario.question.replace('?', '')}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Bottom Controls Area: Waveform + Large Action Button + Switch to Text */}
      <footer className="relative z-10 w-full max-w-md mx-auto px-5 pb-6 pt-2 flex flex-col items-center">
        {/* Animated Sound Waveform Bar at Bottom-Center */}
        <div className="flex items-center justify-center gap-1 h-12 w-full max-w-xs mb-3">
          {waveformHeights.map((h, i) => (
            <span
              key={i}
              className={`w-1 rounded-full transition-all duration-75 ${
                voiceState === 'listening'
                  ? 'bg-gradient-to-t from-cyan-400 to-blue-500'
                  : voiceState === 'speaking'
                  ? 'bg-gradient-to-t from-emerald-400 to-cyan-400'
                  : voiceState === 'thinking'
                  ? 'bg-blue-400/60'
                  : 'bg-slate-600/40'
              }`}
              style={{
                height: `${h}px`,
                opacity: voiceState === 'ready' ? 0.35 : 0.9,
              }}
            />
          ))}
        </div>

        {/* Large Circular Action Button at the very bottom */}
        <div className="flex flex-col items-center justify-center gap-2 mb-2">
          {voiceState === 'listening' ? (
            // Red Stop Button while Listening
            <button
              id="voice-stop-btn"
              onClick={handleStopListening}
              className="relative group w-18 h-18 rounded-full bg-gradient-to-tr from-red-600 to-rose-500 text-white flex items-center justify-center shadow-[0_0_24px_rgba(239,68,68,0.5)] active:scale-95 transition-all cursor-pointer border border-red-400/40"
              aria-label="Stop listening"
              title="Stop listening"
            >
              <div className="absolute inset-0 rounded-full bg-rose-500 animate-ping opacity-25" />
              <Square className="w-7 h-7 fill-white stroke-none group-hover:scale-90 transition-transform" />
            </button>
          ) : (
            // Blue Mic Button once Jarvis finishes or when ready
            <button
              id="voice-speak-again-btn"
              onClick={() => startListeningSequence()}
              className="relative group w-18 h-18 rounded-full bg-gradient-to-tr from-[#1E5EFF] to-cyan-500 text-white flex items-center justify-center shadow-[0_0_24px_rgba(30,94,255,0.55)] active:scale-95 transition-all cursor-pointer border border-cyan-300/40"
              aria-label="Tap to speak again"
              title="Tap to speak again"
            >
              <div className="absolute inset-0 rounded-full bg-cyan-400 animate-pulse opacity-30" />
              <Mic className="w-8 h-8 group-hover:scale-110 transition-transform stroke-[2.2]" />
            </button>
          )}

          {/* Action Button Sub-Label */}
          <span className="text-xs font-semibold text-slate-300 tracking-wide">
            {voiceState === 'listening'
              ? 'Tap to stop'
              : voiceState === 'thinking'
              ? 'Processing speech...'
              : voiceState === 'speaking'
              ? 'Jarvis is speaking'
              : 'Tap to speak again'}
          </span>
        </div>

        {/* "Switch to Text" text link near the bottom */}
        <div className="mt-1">
          <button
            onClick={() => {
              if (onSwitchToText) {
                onSwitchToText(displayedUserText);
              } else {
                onClose();
              }
            }}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-cyan-400 transition-colors py-1 px-3 rounded-full hover:bg-white/5 cursor-pointer"
            aria-label="Switch to typed chat mode"
          >
            <MessageSquareText className="w-3.5 h-3.5" />
            <span>Switch to Text</span>
          </button>
        </div>
      </footer>
    </div>
  );
};
