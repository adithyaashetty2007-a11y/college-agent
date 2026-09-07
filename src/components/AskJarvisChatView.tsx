import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  Send,
  ArrowLeft,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Calendar,
  Layers,
} from 'lucide-react';
import { JarvisAvatar } from './SJECLogos';
import { EmbeddedMapCard } from './EmbeddedMapCard';
import { ChatMessage } from '../types';
import { BottomTabBar, MobileTabId } from './BottomTabBar';

interface AskJarvisChatViewProps {
  onBackToHome: () => void;
  onOpenMap: () => void;
  onOpenDates: () => void;
  onOpenMore: () => void;
  onStartVoice: () => void;
  onSelectMobileTab?: (tab: MobileTabId) => void;
  pendingQuery?: string;
  onClearPendingQuery?: () => void;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'user',
    text: 'Where is the CSE department?',
    timestamp: '10:24 AM',
  },
  {
    id: 'msg-2',
    sender: 'jarvis',
    text: 'I can help you with department locations, fee deadlines, administrative procedures, and much more. Just ask me anything!',
    timestamp: '10:24 AM',
    type: 'map',
    mapData: {
      locationName: 'CSE Department (Block III)',
      routeDesc: 'Path to the CSE department',
      targetBuildingCode: 'CSE',
    },
  },
  {
    id: 'msg-3',
    sender: 'user',
    text: 'What is the last date for fee payment?',
    timestamp: '10:25 AM',
  },
  {
    id: 'msg-4',
    sender: 'jarvis',
    text: "Here's the fee payment schedule:",
    timestamp: '10:25 AM',
    type: 'list',
    listItems: [
      'Step 1: Log in to the student portal',
      "Step 2: Select 'Fee Payment' from the menu",
      'Step 3: Choose your payment method and confirm',
    ],
  },
];

const QUICK_CHIPS = [
  { id: 'fee', label: 'Fee deadlines', query: 'What is the fee payment deadline?' },
  { id: 'map', label: 'Campus map', query: 'Where is the library?' },
  { id: 'exam', label: 'Exam schedule', query: 'What is the upcoming exam schedule?' },
  { id: 'dept', label: 'Departments', query: 'Where is the Mechanical department?' },
  { id: 'cert', label: 'Bonafide certificate', query: 'How do I apply for a Bonafide certificate?' },
];

export const AskJarvisChatView: React.FC<AskJarvisChatViewProps> = ({
  onBackToHome,
  onOpenMap,
  onOpenDates,
  onOpenMore,
  onStartVoice,
  onSelectMobileTab,
  pendingQuery,
  onClearPendingQuery,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(true); // Typing indicator below the last message as requested
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (pendingQuery) {
      handleSendMessage(pendingQuery);
      if (onClearPendingQuery) {
        onClearPendingQuery();
      }
    }
  }, [pendingQuery, onClearPendingQuery]);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    // Simulate Jarvis intelligent contextual reply
    setTimeout(() => {
      const lower = text.toLowerCase();
      let reply: ChatMessage;

      if (lower.includes('map') || lower.includes('where') || lower.includes('library') || lower.includes('department') || lower.includes('cse') || lower.includes('mech')) {
        reply = {
          id: `jarvis-${Date.now()}`,
          sender: 'jarvis',
          text: lower.includes('library')
            ? 'The Central Library is situated on the South Lawn, right next to the Academic Courtyard.'
            : 'Here is the direct route and walking path across the campus grounds:',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'map',
          mapData: {
            locationName: lower.includes('library') ? 'Central Library' : 'Mechanical & CSE Block',
            routeDesc: lower.includes('library') ? 'Path to Main Library' : 'Path to the CSE department',
          },
        };
      } else if (lower.includes('exam') || lower.includes('schedule') || lower.includes('time')) {
        reply = {
          id: `jarvis-${Date.now()}`,
          sender: 'jarvis',
          text: "Here are the upcoming Semester Exam timings and instructions:",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'list',
          listItems: [
            'Morning Session: 09:30 AM – 12:30 PM (Entry closes at 09:15 AM)',
            'Afternoon Session: 02:00 PM – 05:00 PM (Entry closes at 01:45 PM)',
            'Mandatory: Bring your valid SJEC ID card and official Hall Ticket',
          ],
        };
      } else if (lower.includes('bonafide') || lower.includes('certificate') || lower.includes('apply')) {
        reply = {
          id: `jarvis-${Date.now()}`,
          sender: 'jarvis',
          text: "To obtain your Bonafide Certificate, follow these procedural steps:",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'list',
          listItems: [
            'Step 1: Download the application form from ERP portal or collect at Admin counter',
            'Step 2: Obtain endorsement signature from your Department HOD',
            'Step 3: Submit at Academic Section (Counter 3) with a ₹50 clearance receipt',
          ],
        };
      } else {
        reply = {
          id: `jarvis-${Date.now()}`,
          sender: 'jarvis',
          text: `I've noted your request regarding "${text}". You can visit the Student Affairs desk in the Admin Block or ask me for step-by-step procedures!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'list',
          listItems: [
            'Step 1: Verify your student credentials on the SJEC Portal',
            'Step 2: Check active administrative deadlines in the Dates tab',
            'Step 3: Reach out to your faculty advisor or proctor if needed',
          ],
        };
      }

      setMessages((prev) => [...prev, reply]);
      setIsTyping(false);
    }, 900);
  };

  const handleChipClick = (query: string) => {
    handleSendMessage(query);
  };

  return (
    <div className="flex flex-col h-screen max-h-screen bg-[#F0F4F9] text-slate-800 font-['Plus_Jakarta_Sans',sans-serif] select-text">
      {/* 1. Header (Fixed Top) */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-2.5 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          {/* Back button for seamless navigation */}
          <button
            onClick={onBackToHome}
            className="p-1.5 -ml-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Back to home"
            title="Back to Home"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Robot mascot avatar icon (left) */}
          <JarvisAvatar className="w-9 h-9 sm:w-10 sm:h-10 shrink-0" />

          {/* Jarvis name in bold blue + Online status */}
          <div className="flex flex-col">
            <h1 className="text-base sm:text-lg font-bold text-[#1E5EFF] tracking-tight leading-tight">
              Jarvis
            </h1>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-semibold text-emerald-600 tracking-wide leading-none">
                Online
              </span>
            </div>
          </div>
        </div>

        {/* Top-Right: Circular light-blue microphone icon button for toggling voice input mode */}
        <button
          id="top-voice-toggle-btn"
          onClick={onStartVoice}
          className="w-9 h-9 rounded-full bg-[#EBF3FF] hover:bg-[#DCEBFF] active:scale-95 text-[#1E5EFF] flex items-center justify-center border border-blue-100 transition-all shadow-xs cursor-pointer"
          aria-label="Toggle voice input"
          title="Voice input mode"
        >
          <Mic className="w-4 h-4 stroke-[2.2]" />
        </button>
      </header>

      {/* 2. Chat Conversation Area (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 max-w-3xl w-full mx-auto">
        {/* Subtle timestamp badge */}
        <div className="flex justify-center my-1">
          <span className="text-[11px] font-medium text-slate-400 bg-slate-200/50 px-2.5 py-0.5 rounded-full">
            Today, 10:24 AM
          </span>
        </div>

        {messages.map((msg) => {
          const isUser = msg.sender === 'user';

          if (isUser) {
            return (
              <div key={msg.id} className="flex justify-end items-end gap-2 group">
                <div className="max-w-[85%] sm:max-w-[75%] bg-[#1E5EFF] text-white rounded-2xl rounded-tr-xs px-4 py-2.5 text-sm font-medium shadow-xs leading-relaxed">
                  <p>{msg.text}</p>
                </div>
              </div>
            );
          }

          // Jarvis Response
          return (
            <div key={msg.id} className="flex items-start gap-2.5 max-w-[90%] sm:max-w-[85%]">
              <JarvisAvatar className="w-8 h-8 shrink-0 mt-0.5 drop-shadow-xs" />

              <div className="flex flex-col flex-1 min-w-0">
                <div className="bg-white rounded-2xl rounded-tl-xs p-4 text-slate-800 text-sm shadow-xs border border-slate-200/80 leading-relaxed">
                  <p className="text-slate-800">{msg.text}</p>

                  {/* Bulleted List Format Support */}
                  {msg.type === 'list' && msg.listItems && (
                    <ul className="mt-3 space-y-2 text-slate-700 text-xs sm:text-[13px]">
                      {msg.listItems.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#1E5EFF] mt-1.5 shrink-0" />
                          <span className="font-medium text-slate-700 leading-snug">{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Map-Embedded Response Support */}
                  {msg.type === 'map' && (
                    <EmbeddedMapCard
                      locationName={msg.mapData?.locationName || 'CSE Department'}
                      routeDesc={msg.mapData?.routeDesc || 'Path to the CSE department'}
                      onViewOnMap={onOpenMap}
                    />
                  )}
                </div>

                {msg.timestamp && (
                  <span className="text-[10px] text-slate-400 mt-1 ml-1">
                    {msg.timestamp}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {/* Typing Indicator (Three animated bouncing dots in a bubble) */}
        {isTyping && (
          <div className="flex items-start gap-2.5">
            <JarvisAvatar className="w-8 h-8 shrink-0 mt-0.5" />
            <div className="bg-white rounded-2xl rounded-tl-xs px-4 py-3 shadow-xs border border-slate-200/80 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#1E5EFF] animate-bounce [animation-delay:-0.3s]" />
              <span className="w-2 h-2 rounded-full bg-[#1E5EFF] animate-bounce [animation-delay:-0.15s]" />
              <span className="w-2 h-2 rounded-full bg-[#1E5EFF] animate-bounce" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 3. Bottom Controls Container: Quick Chips + Input Bar + Bottom Tab Bar */}
      <div className="sticky bottom-0 z-30 bg-white border-t border-slate-200/80 shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
        {/* Quick-reply suggestion chips (Horizontally scrollable row above the input bar) */}
        <div className="px-3 pt-2.5 pb-1 max-w-3xl mx-auto w-full">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scrollbar-none py-0.5">
            {QUICK_CHIPS.map((chip) => (
              <button
                key={chip.id}
                onClick={() => handleChipClick(chip.query)}
                className="bg-[#EBF3FF] hover:bg-[#DCEBFF] active:scale-95 text-[#1E5EFF] text-xs font-semibold px-3.5 py-1.5 rounded-full border border-blue-200/70 shrink-0 whitespace-nowrap transition-all shadow-2xs cursor-pointer"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar (Cleanly anchored at bottom) */}
        <div className="px-3 pb-3 sm:pb-4 pt-1 max-w-3xl mx-auto w-full">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            {/* Microphone icon button (left) for voice input */}
            <button
              type="button"
              id="chat-mic-btn"
              onClick={onStartVoice}
              className="w-10 h-10 rounded-full bg-[#EBF3FF] hover:bg-[#DCEBFF] active:scale-95 text-[#1E5EFF] flex items-center justify-center border border-blue-100 transition-all shrink-0 cursor-pointer shadow-xs"
              aria-label="Voice input"
              title="Speak to Jarvis"
            >
              <Mic className="w-5 h-5 stroke-[2.2]" />
            </button>

            {/* Text input field */}
            <input
              ref={inputRef}
              type="text"
              id="chat-text-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask Jarvis anything..."
              className="flex-1 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-slate-800 placeholder:text-slate-400 text-xs sm:text-sm px-4 py-2.5 rounded-full border border-slate-200 focus:border-[#1E5EFF] focus:ring-2 focus:ring-[#1E5EFF]/20 outline-none transition-all"
            />

            {/* Circular blue send button (right) */}
            <button
              type="submit"
              id="chat-send-btn"
              disabled={!inputValue.trim()}
              className="w-10 h-10 rounded-full bg-[#1E5EFF] hover:bg-blue-600 disabled:opacity-40 disabled:hover:bg-[#1E5EFF] active:scale-95 text-white flex items-center justify-center shadow-md transition-all shrink-0 cursor-pointer"
              aria-label="Send message"
            >
              <Send className="w-4 h-4 translate-x-0.5 -translate-y-0.5" />
            </button>
          </form>
        </div>

        {/* Bottom Tab Bar (Fixed at Very Bottom) */}
        <BottomTabBar
          activeTab="ask-jarvis"
          onSelectTab={(tab) => {
            if (onSelectMobileTab) {
              onSelectMobileTab(tab);
            } else {
              if (tab === 'home') onBackToHome();
              else if (tab === 'map') onOpenMap();
              else if (tab === 'dates') onOpenDates();
              else if (tab === 'more') onOpenMore();
            }
          }}
          isFixed={false}
          className="shrink-0 shadow-[0_-4px_16px_rgba(0,0,0,0.04)]"
        />
      </div>
    </div>
  );
};
