import React from 'react';
import { ChevronRight, MapPin, Navigation2 } from 'lucide-react';
import campusMapImg from '../assets/images/sjec_campus_aerial_map_1788694021011.jpg';

interface EmbeddedMapCardProps {
  locationName: string;
  routeDesc?: string;
  onViewOnMap: () => void;
}

export const EmbeddedMapCard: React.FC<EmbeddedMapCardProps> = ({
  locationName,
  routeDesc = 'Path to the CSE department',
  onViewOnMap,
}) => {
  return (
    <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
      {/* Map Graphic Area */}
      <div className="relative h-40 w-full overflow-hidden bg-[#E7EFE6] select-none">
        {/* Real Aerial/Satellite Campus Underlay with green overlay */}
        <img
          src={campusMapImg}
          alt="SJEC Campus Map"
          className="absolute inset-0 w-full h-full object-cover opacity-60 filter contrast-105"
        />
        <div className="absolute inset-0 bg-[#0c2a1a]/25 mix-blend-multiply" />

        {/* Vector Schematic Path Overlay matching reference image */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 300 160"
          preserveAspectRatio="none"
        >
          {/* Subtle Campus Buildings */}
          <rect x="20" y="30" width="60" height="40" rx="4" fill="#ffffff" fillOpacity="0.8" stroke="#94a3b8" strokeWidth="1" />
          <text x="50" y="54" textAnchor="middle" fontSize="9" fill="#475569" fontWeight="600">Admin Block</text>

          <rect x="170" y="35" width="95" height="55" rx="5" fill="#ffffff" fillOpacity="0.85" stroke="#94a3b8" strokeWidth="1" />
          <text x="217" y="66" textAnchor="middle" fontSize="10" fill="#1e293b" fontWeight="bold">CSE Department</text>

          <rect x="35" y="95" width="70" height="45" rx="4" fill="#ffffff" fillOpacity="0.8" stroke="#94a3b8" strokeWidth="1" />
          <text x="70" y="122" textAnchor="middle" fontSize="9" fill="#475569" fontWeight="600">Main Library</text>

          {/* Path Roads */}
          <path
            d="M -10 135 L 120 135 L 120 70 L 175 70"
            fill="none"
            stroke="#ffffff"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.85"
          />

          {/* Active Navigation Route Line (Blue) */}
          <path
            d="M 25 135 L 120 135 L 120 70 L 175 70"
            fill="none"
            stroke="#1E5EFF"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Origin Starting Point */}
          <circle cx="25" cy="135" r="5.5" fill="#1E5EFF" stroke="#ffffff" strokeWidth="2.5" />
          <circle cx="25" cy="135" r="10" fill="#1E5EFF" fillOpacity="0.2" className="animate-ping" />
        </svg>

        {/* Destination Pin & Speech Box Tooltip */}
        <div className="absolute top-4 right-10 flex flex-col items-center">
          <div className="bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-md shadow-md border border-slate-200 text-[10px] font-semibold text-slate-800 whitespace-nowrap flex items-center gap-1 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1E5EFF]" />
            <span>{routeDesc}</span>
          </div>
          <div className="text-red-500 drop-shadow-md">
            <MapPin className="w-6 h-6 fill-red-500 text-white" />
          </div>
        </div>

        {/* Start Point Tag */}
        <div className="absolute bottom-2 left-2 bg-slate-900/75 backdrop-blur-xs text-white text-[9px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1">
          <Navigation2 className="w-2.5 h-2.5 text-blue-400 rotate-45" />
          <span>You are at Campus Gate</span>
        </div>
      </div>

      {/* Action Footer: "View on Map" link/button */}
      <button
        type="button"
        onClick={onViewOnMap}
        className="w-full py-2.5 px-4 bg-white hover:bg-blue-50/50 text-[#1E5EFF] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border-t border-slate-100"
      >
        <span>View on Map</span>
        <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
      </button>
    </div>
  );
};
