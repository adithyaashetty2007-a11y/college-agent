import React from 'react';

import {
  MapPin,
  Navigation,
  Building2,
  Library,
} from 'lucide-react';

const InteractiveMapCard: React.FC = () => {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-900 shadow-xl">

      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
            <MapPin className="h-5 w-5 text-blue-400" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-white">
              SJEC Campus Map
            </h2>

            <p className="text-xs text-slate-400">
              St Joseph Engineering College
            </p>
          </div>

        </div>

        <button
          type="button"
          className="flex items-center gap-2 rounded-xl border border-blue-400/20 bg-blue-500/10 px-3 py-2 text-xs font-semibold text-blue-300 transition hover:bg-blue-500/20"
        >
          <Navigation className="h-4 w-4" />
          <span>Directions</span>
        </button>

      </div>

      {/* ================= MAP AREA ================= */}
      <div className="relative h-[420px] w-full overflow-hidden bg-[#0B1D3A]">

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* ================= ROADS ================= */}

        <div className="absolute left-[8%] right-[8%] top-1/2 h-8 -translate-y-1/2 rounded-full bg-slate-700/60" />

        <div className="absolute bottom-[8%] left-1/2 top-[8%] w-8 -translate-x-1/2 rounded-full bg-slate-700/60" />

        <div className="absolute left-[15%] top-[25%] h-6 w-[70%] rotate-[18deg] rounded-full bg-slate-700/50" />

        <div className="absolute left-[15%] top-[65%] h-6 w-[70%] -rotate-[15deg] rounded-full bg-slate-700/50" />

        {/* ================= MAIN BLOCK ================= */}
        <button
          type="button"
          className="group absolute left-[12%] top-[15%] rounded-2xl border border-blue-400/30 bg-slate-800/90 p-4 text-left shadow-xl backdrop-blur transition hover:scale-105 hover:border-blue-400"
        >

          <Building2 className="mb-2 h-6 w-6 text-blue-400" />

          <p className="text-sm font-bold text-white">
            Main Block
          </p>

          <p className="text-[10px] text-slate-400">
            Administration
          </p>

        </button>

        {/* ================= LIBRARY ================= */}
        <button
          type="button"
          className="group absolute right-[12%] top-[15%] rounded-2xl border border-purple-400/30 bg-slate-800/90 p-4 text-left shadow-xl backdrop-blur transition hover:scale-105 hover:border-purple-400"
        >

          <Library className="mb-2 h-6 w-6 text-purple-400" />

          <p className="text-sm font-bold text-white">
            Library
          </p>

          <p className="text-[10px] text-slate-400">
            Central Library
          </p>

        </button>

        {/* ================= BLOCK A ================= */}
        <button
          type="button"
          className="group absolute bottom-[15%] left-[12%] rounded-2xl border border-emerald-400/30 bg-slate-800/90 p-4 text-left shadow-xl backdrop-blur transition hover:scale-105 hover:border-emerald-400"
        >

          <Building2 className="mb-2 h-6 w-6 text-emerald-400" />

          <p className="text-sm font-bold text-white">
            Block A
          </p>

          <p className="text-[10px] text-slate-400">
            Engineering
          </p>

        </button>

        {/* ================= BLOCK B ================= */}
        <button
          type="button"
          className="group absolute bottom-[15%] right-[12%] rounded-2xl border border-orange-400/30 bg-slate-800/90 p-4 text-left shadow-xl backdrop-blur transition hover:scale-105 hover:border-orange-400"
        >

          <Building2 className="mb-2 h-6 w-6 text-orange-400" />

          <p className="text-sm font-bold text-white">
            Block B
          </p>

          <p className="text-[10px] text-slate-400">
            Academic Block
          </p>

        </button>

        {/* ================= CURRENT LOCATION ================= */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">

          <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/20">

            <div className="absolute h-5 w-5 animate-ping rounded-full bg-blue-400/40" />

            <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 shadow-lg shadow-blue-500/40">
              <MapPin className="h-4 w-4 text-white" />
            </div>

          </div>

        </div>

        {/* ================= CAMPUS LABEL ================= */}
        <div className="absolute bottom-4 left-4 rounded-xl border border-white/10 bg-slate-900/90 px-4 py-3 shadow-lg backdrop-blur">

          <p className="text-xs font-semibold text-white">
            SJEC Campus
          </p>

          <p className="text-[11px] text-slate-400">
            Mangaluru, Karnataka
          </p>

        </div>

        {/* ================= STATUS ================= */}
        <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full border border-emerald-400/20 bg-slate-900/90 px-3 py-2 backdrop-blur">

          <span className="h-2 w-2 rounded-full bg-emerald-400" />

          <span className="text-xs font-medium text-emerald-300">
            Campus Open
          </span>

        </div>

      </div>

      {/* ================= INFORMATION ================= */}
      <div className="grid grid-cols-2 gap-3 border-t border-white/10 p-4 sm:grid-cols-4">

        <div className="rounded-xl bg-white/5 p-3">

          <p className="text-[10px] uppercase tracking-wide text-slate-500">
            Location
          </p>

          <p className="mt-1 text-xs font-semibold text-white">
            Main Campus
          </p>

        </div>

        <div className="rounded-xl bg-white/5 p-3">

          <p className="text-[10px] uppercase tracking-wide text-slate-500">
            City
          </p>

          <p className="mt-1 text-xs font-semibold text-white">
            Mangaluru
          </p>

        </div>

        <div className="rounded-xl bg-white/5 p-3">

          <p className="text-[10px] uppercase tracking-wide text-slate-500">
            Buildings
          </p>

          <p className="mt-1 text-xs font-semibold text-white">
            4 Blocks
          </p>

        </div>

        <div className="rounded-xl bg-white/5 p-3">

          <p className="text-[10px] uppercase tracking-wide text-slate-500">
            Status
          </p>

          <p className="mt-1 text-xs font-semibold text-emerald-400">
            Open
          </p>

        </div>

      </div>

    </div>
  );
};

export default InteractiveMapCard;