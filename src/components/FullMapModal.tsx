import React, { useState } from 'react';
import { X, MapPin, Footprints, Navigation2, Compass, Layers } from 'lucide-react';
import { CAMPUS_BUILDINGS } from '../data/campusData';
import campusMapImg from '../assets/images/sjec_campus_aerial_map_1788694021011.jpg';

interface FullMapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FullMapModal: React.FC<FullMapModalProps> = ({ isOpen, onClose }) => {
  const [selectedBuilding, setSelectedBuilding] = useState(CAMPUS_BUILDINGS[2]); // Default CSE block
  const [mapFilter, setMapFilter] = useState<'all' | 'academics' | 'admin'>('all');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white text-slate-900 w-full max-w-4xl h-[85vh] rounded-3xl shadow-2xl border border-slate-200 relative flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-50 text-[#1E5EFF]">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                SJEC Interactive Campus Map
              </h3>
              <p className="text-xs text-slate-500">
                St Joseph Engineering College • Vamanjoor, Mangaluru
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200/60 transition-colors cursor-pointer"
              aria-label="Close full map"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body: Map + Sidebar Selector */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Main Map Viewport */}
          <div className="flex-1 relative bg-slate-900 overflow-hidden min-h-[300px]">
            <img
              src={campusMapImg}
              alt="SJEC Campus Aerial Map"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover filter brightness-95 contrast-105"
            />
            <div className="absolute inset-0 bg-[#0c2a1a]/30 mix-blend-multiply" />

            {/* SVG Interactive Walking Path */}
            <svg
              viewBox="0 0 100 70"
              className="absolute inset-0 w-full h-full pointer-events-none"
              preserveAspectRatio="none"
            >
              <path
                d="M 49 58 Q 58 54 55 46 T 52 40 T 57 33 L 67 31"
                fill="none"
                stroke="#1E5EFF"
                strokeWidth="2"
                strokeDasharray="2 2"
                className="animate-dash"
              />
              <circle cx="49" cy="58" r="3" fill="#22c55e" stroke="#fff" strokeWidth="0.8" />
              <circle cx="67" cy="31" r="3.5" fill="#e11d48" stroke="#fff" strokeWidth="1" />
            </svg>

            {/* Pins */}
            {CAMPUS_BUILDINGS.map((b) => {
              const isSelected = selectedBuilding.id === b.id;
              return (
                <button
                  key={b.id}
                  onClick={() => setSelectedBuilding(b)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer focus:outline-hidden"
                  style={{ left: `${b.xPercent}%`, top: `${b.yPercent}%` }}
                >
                  <div
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg border flex items-center gap-1.5 transition-transform ${
                      isSelected
                        ? 'bg-[#1E5EFF] text-white scale-110 border-white'
                        : 'bg-slate-900/90 text-white border-white/20 hover:scale-105'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{b.name}</span>
                  </div>
                </button>
              );
            })}

            {/* Floating Quick Legend */}
            <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-md text-white text-[11px] p-2.5 rounded-xl border border-white/15 flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Start (Gate)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>Destination ({selectedBuilding.name})</span>
              </div>
            </div>
          </div>

          {/* Right Panel: Building Information & Navigation Steps */}
          <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-slate-200 p-5 overflow-y-auto bg-white flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#1E5EFF]">
                Building Profile
              </span>
              <h4 className="text-xl font-extrabold text-slate-900 mt-0.5">
                {selectedBuilding.name}
              </h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {selectedBuilding.description}
              </p>

              {selectedBuilding.departments && (
                <div className="mt-4">
                  <h5 className="text-xs font-bold text-slate-800 mb-2">
                    Departments & Labs:
                  </h5>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedBuilding.departments.map((dept, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-md bg-blue-50 text-[#1E5EFF] text-[11px] font-semibold"
                      >
                        {dept}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Walking Route Details */}
              <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-2">
                  <span className="flex items-center gap-1.5 text-[#1E5EFF]">
                    <Footprints className="w-4 h-4" /> Walking Directions
                  </span>
                  <span>2-3 min (180m)</span>
                </div>
                <ol className="text-xs text-slate-600 space-y-1.5 list-decimal list-inside leading-snug">
                  <li>Start from Main Campus Avenue</li>
                  <li>Follow the paved walkway toward Central Court</li>
                  <li>Enter {selectedBuilding.name} main portal</li>
                </ol>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100">
              <button
                onClick={onClose}
                className="w-full bg-[#1E5EFF] hover:bg-blue-700 text-white py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
