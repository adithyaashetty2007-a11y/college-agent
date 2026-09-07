import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Layers,
  MapPin,
  Navigation,
  Plus,
  Minus,
  Crosshair,
  Footprints,
  Clock,
  Building2,
  Phone,
  Mail,
  ChevronUp,
  ChevronDown,
  X,
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { CAMPUS_BUILDINGS, DEFAULT_ROUTE } from '../data/campusData';
import { BuildingLocation, CampusRoute } from '../types';
import { BottomTabBar, MobileTabId } from './BottomTabBar';
import campusMapImg from '../assets/images/sjec_campus_aerial_map_1788694021011.jpg';

interface CampusMapViewProps {
  onBackToHome: () => void;
  onSelectMobileTab: (tab: MobileTabId) => void;
  onAskJarvisAboutLocation?: (locationName: string) => void;
}

type CategoryFilter = 'All' | 'Academic' | 'Hostel' | 'Sports' | 'Food' | 'Admin';

export const CampusMapView: React.FC<CampusMapViewProps> = ({
  onBackToHome,
  onSelectMobileTab,
  onAskJarvisAboutLocation,
}) => {
  // State for search and filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');
  const [isLayerMenuOpen, setIsLayerMenuOpen] = useState(false);
  const [showWalkingPath, setShowWalkingPath] = useState(true);
  const [mapLayerMode, setMapLayerMode] = useState<'satellite' | 'hybrid'>('satellite');

  // Selected building (default: CSE Block)
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingLocation>(
    CAMPUS_BUILDINGS.find((b) => b.id === 'cse-block') || CAMPUS_BUILDINGS[0]
  );

  // Map zoom and pan
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isLocateMeActive, setIsLocateMeActive] = useState(false);
  const [locateToast, setLocateToast] = useState<string | null>(null);

  // Bottom sheet state: 'collapsed' | 'expanded'
  const [isSheetExpanded, setIsSheetExpanded] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  // Drag interaction refs
  const dragStartY = useRef<number | null>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  // Categories list
  const categories: CategoryFilter[] = ['All', 'Academic', 'Hostel', 'Sports', 'Food', 'Admin'];

  // Filter buildings by category and search text
  const filteredBuildings = CAMPUS_BUILDINGS.filter((b) => {
    const matchesCategory =
      selectedCategory === 'All' || b.category?.toLowerCase() === selectedCategory.toLowerCase();

    const matchesSearch =
      searchQuery.trim() === '' ||
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.departments?.some((d) => d.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  // Zoom handlers
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.2, 1.8));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.2, 0.85));
  };

  const handleLocateMe = () => {
    setIsLocateMeActive(true);
    setZoomLevel(1.15);
    setPanOffset({ x: 0, y: 0 });
    setLocateToast('GPS signal locked • Live at SJEC Main Entrance');
    setTimeout(() => {
      setLocateToast(null);
      setIsLocateMeActive(false);
    }, 2800);
  };

  const handleSelectBuilding = (b: BuildingLocation) => {
    setSelectedBuilding(b);
    setIsNavigating(false);
  };

  const handleGetDirections = () => {
    setIsNavigating(true);
    setShowWalkingPath(true);
    setLocateToast(`Navigating to ${selectedBuilding.name} (2 min walk)`);
    setTimeout(() => setLocateToast(null), 2500);
  };

  // Touch drag handlers for bottom sheet
  const handleTouchStart = (e: React.TouchEvent) => {
    dragStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (dragStartY.current === null) return;
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - dragStartY.current;

    // If dragged upward by more than 45px -> expand
    if (deltaY < -45 && !isSheetExpanded) {
      setIsSheetExpanded(true);
      dragStartY.current = null;
    }
    // If dragged downward by more than 45px -> collapse
    else if (deltaY > 45 && isSheetExpanded) {
      setIsSheetExpanded(false);
      dragStartY.current = null;
    }
  };

  const handleTouchEnd = () => {
    dragStartY.current = null;
  };

  // Mouse drag handlers for desktop preview
  const handleMouseDown = (e: React.MouseEvent) => {
    dragStartY.current = e.clientY;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragStartY.current === null) return;
    const deltaY = e.clientY - dragStartY.current;
    if (deltaY < -40 && !isSheetExpanded) {
      setIsSheetExpanded(true);
      dragStartY.current = null;
    } else if (deltaY > 40 && isSheetExpanded) {
      setIsSheetExpanded(false);
      dragStartY.current = null;
    }
  };

  const handleMouseUp = () => {
    dragStartY.current = null;
  };

  // Dynamic route calculation from Gate to selected building
  const routeOrigin = { x: 50, y: 62 }; // Main Gate
  const destination = { x: selectedBuilding.xPercent, y: selectedBuilding.yPercent };

  // Calculate an organic intermediate curve for the walking path
  const midX = (routeOrigin.x + destination.x) / 2 + (destination.x > 50 ? -4 : 6);
  const midY = (routeOrigin.y + destination.y) / 2 + 3;

  // Live walking position point along the curve (~40% of way)
  const walkerPoint = {
    x: routeOrigin.x * 0.55 + destination.x * 0.45,
    y: routeOrigin.y * 0.55 + destination.y * 0.45,
  };

  return (
    <div className="relative flex flex-col h-screen max-h-screen bg-[#0B1D3A] text-slate-800 font-['Plus_Jakarta_Sans',sans-serif] overflow-hidden select-none">
      {/* 1. Header (Fixed Top) */}
      <header className="absolute top-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs px-4 pt-3 pb-3 transition-all">
        <div className="max-w-md mx-auto">
          {/* Top Title Row */}
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onBackToHome}
                className="p-1 -ml-1 text-[#0B1D3A] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                title="Back to Home"
              >
                <Compass className="w-5 h-5 text-[#1E5EFF]" />
              </button>
              <h1 className="text-lg sm:text-xl font-extrabold text-[#0B1D3A] tracking-tight">
                Campus Map
              </h1>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Vamanjoor Campus
              </span>
            </div>
          </div>

          {/* Search Bar Row with Layers Button */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search buildings, departments..."
                className="w-full pl-9 pr-8 py-2 bg-slate-100/90 focus:bg-white border border-slate-200 focus:border-[#1E5EFF] rounded-xl text-xs sm:text-[13px] text-slate-800 placeholder-slate-400 focus:outline-hidden transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter / Layers Button */}
            <div className="relative">
              <button
                id="map-layers-toggle"
                type="button"
                onClick={() => setIsLayerMenuOpen(!isLayerMenuOpen)}
                className={`p-2 rounded-xl border transition-all cursor-pointer shadow-xs ${
                  isLayerMenuOpen
                    ? 'bg-[#1E5EFF] text-white border-[#1E5EFF]'
                    : 'bg-white text-slate-700 hover:text-[#1E5EFF] border-slate-200/90 hover:bg-blue-50'
                }`}
                title="Toggle Layers"
              >
                <Layers className="w-4 h-4" />
              </button>

              {/* Layers Dropdown Menu */}
              {isLayerMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 p-2.5 z-40 animate-in fade-in zoom-in-95">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5">
                    Map Layers
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setMapLayerMode(mapLayerMode === 'satellite' ? 'hybrid' : 'satellite');
                      setIsLayerMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    <span>Satellite View</span>
                    {mapLayerMode === 'satellite' && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#1E5EFF]" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowWalkingPath(!showWalkingPath);
                      setIsLayerMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    <span>Walking Paths</span>
                    {showWalkingPath && <CheckCircle2 className="w-3.5 h-3.5 text-[#1E5EFF]" />}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Floating GPS Toast */}
      {locateToast && (
        <div className="absolute top-28 left-1/2 -translate-x-1/2 z-40 bg-[#0B1D3A]/90 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg border border-blue-400/30 backdrop-blur-md flex items-center gap-2 animate-fade-in">
          <Navigation className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>{locateToast}</span>
        </div>
      )}

      {/* 2. Map Area (Fills Most of the Screen) */}
      <div className="relative flex-1 w-full h-full overflow-hidden bg-slate-950">
        {/* Full-width Satellite Campus Map Image with Smooth Zoom */}
        <div
          className="absolute inset-0 w-full h-full transition-transform duration-300 ease-out origin-center"
          style={{
            transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
          }}
        >
          <img
            src={campusMapImg}
            alt="SJEC Campus Aerial View"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover filter brightness-[0.92] contrast-[1.08] select-none"
          />

          {/* Semi-transparent tactical aerial gradient overlay */}
          <div
            className={`absolute inset-0 pointer-events-none transition-opacity ${
              mapLayerMode === 'hybrid'
                ? 'bg-[#0B1D3A]/25 mix-blend-multiply'
                : 'bg-black/15 mix-blend-overlay'
            }`}
          />

          {/* SVG Dotted Walking Path Overlay */}
          {showWalkingPath && (
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-0 w-full h-full pointer-events-none"
              preserveAspectRatio="none"
            >
              {/* Route Glow Line */}
              <path
                d={`M ${routeOrigin.x} ${routeOrigin.y} Q ${midX} ${midY} ${destination.x} ${destination.y}`}
                fill="none"
                stroke="#1E5EFF"
                strokeWidth="2.8"
                strokeOpacity="0.4"
                strokeLinecap="round"
              />

              {/* Blue Dotted Walking Path */}
              <path
                d={`M ${routeOrigin.x} ${routeOrigin.y} Q ${midX} ${midY} ${destination.x} ${destination.y}`}
                fill="none"
                stroke="#2563EB"
                strokeWidth="1.8"
                strokeDasharray="2.5 2.5"
                strokeLinecap="round"
                className="animate-dash"
              />

              {/* Origin Marker (Gate / Live Start) */}
              <circle
                cx={routeOrigin.x}
                cy={routeOrigin.y}
                r="1.8"
                fill="#10B981"
                stroke="#FFFFFF"
                strokeWidth="0.8"
              />
            </svg>
          )}

          {/* Live Walking Position Indicator (Circular walking-person marker with pulsing radar) */}
          {showWalkingPath && (
            <div
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
              style={{
                left: `${walkerPoint.x}%`,
                top: `${walkerPoint.y}%`,
              }}
            >
              <div className="relative flex items-center justify-center">
                {/* Pulsing Radar Ring */}
                <div className="absolute w-8 h-8 rounded-full bg-blue-500/30 animate-ping" />
                <div className="absolute w-6 h-6 rounded-full bg-blue-500/40" />

                {/* Blue Circular Walking Person Live Marker */}
                <div className="relative z-10 w-5 h-5 rounded-full bg-[#1E5EFF] border-2 border-white shadow-md flex items-center justify-center text-white">
                  <Footprints className="w-2.5 h-2.5 stroke-[2.5]" />
                </div>
              </div>
            </div>
          )}

          {/* Destination Pin Marker at Endpoint */}
          {showWalkingPath && (
            <div
              className="absolute -translate-x-1/2 -translate-y-full z-25 pointer-events-none"
              style={{
                left: `${destination.x}%`,
                top: `${destination.y}%`,
              }}
            >
              <div className="relative flex flex-col items-center animate-bounce">
                <div className="w-7 h-7 rounded-full bg-rose-600 border-2 border-white shadow-xl flex items-center justify-center text-white">
                  <MapPin className="w-4 h-4 fill-white" />
                </div>
                <div className="w-1.5 h-1.5 bg-rose-600 rounded-full -mt-0.5 shadow-xs" />
              </div>
            </div>
          )}

          {/* Labeled Pin Markers for Key Locations (Rounded Pills with Pin Icon) */}
          {filteredBuildings.map((b) => {
            const isSelected = selectedBuilding.id === b.id;
            return (
              <button
                key={b.id}
                id={`map-pin-${b.id}`}
                type="button"
                onClick={() => handleSelectBuilding(b)}
                className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer transition-all duration-200 focus:outline-hidden ${
                  isSelected ? 'scale-110 z-30' : 'hover:scale-105'
                }`}
                style={{ left: `${b.xPercent}%`, top: `${b.yPercent}%` }}
              >
                <div
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold shadow-lg border transition-all ${
                    isSelected
                      ? 'bg-[#1E5EFF] text-white border-white ring-4 ring-blue-500/30 shadow-blue-500/40'
                      : 'bg-slate-900/90 hover:bg-slate-900 text-white border-white/30 backdrop-blur-xs'
                  }`}
                >
                  <MapPin
                    className={`w-3.5 h-3.5 shrink-0 ${
                      isSelected ? 'fill-white text-white' : 'text-blue-400'
                    }`}
                  />
                  <span className="whitespace-nowrap tracking-tight">{b.name}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Floating Controls on Right Edge */}
        <div className="absolute right-3.5 top-36 z-25 flex flex-col items-center gap-2">
          {/* Zoom Buttons Stacked Vertically */}
          <div className="flex flex-col bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200/80 overflow-hidden">
            <button
              type="button"
              onClick={handleZoomIn}
              className="p-2.5 text-slate-700 hover:text-[#1E5EFF] hover:bg-blue-50 transition-colors border-b border-slate-100 cursor-pointer active:scale-95"
              title="Zoom In"
              aria-label="Zoom in"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleZoomOut}
              className="p-2.5 text-slate-700 hover:text-[#1E5EFF] hover:bg-blue-50 transition-colors cursor-pointer active:scale-95"
              title="Zoom Out"
              aria-label="Zoom out"
            >
              <Minus className="w-4 h-4" />
            </button>
          </div>

          {/* Separate Locate-Me (GPS / Crosshair) Icon Button */}
          <button
            type="button"
            onClick={handleLocateMe}
            className={`p-2.5 rounded-2xl shadow-lg border transition-all cursor-pointer active:scale-95 ${
              isLocateMeActive
                ? 'bg-[#1E5EFF] text-white border-[#1E5EFF] ring-4 ring-blue-400/40'
                : 'bg-white/95 text-slate-700 hover:text-[#1E5EFF] hover:bg-blue-50 border-slate-200/80'
            }`}
            title="Locate My Position"
            aria-label="Locate me"
          >
            <Crosshair className={`w-4 h-4 ${isLocateMeActive ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 3. Bottom Sheet Panel (Draggable, Slides Up from Bottom Third of Screen) */}
      <div
        ref={sheetRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className={`absolute left-0 right-0 z-35 bg-white rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.18)] border-t border-slate-200 transition-all duration-300 ease-out flex flex-col ${
          isSheetExpanded
            ? 'bottom-16 top-24 max-h-[calc(100vh-160px)]'
            : 'bottom-16 max-h-[300px]'
        }`}
      >
        {/* Horizontal Drag Handle Bar */}
        <div
          onClick={() => setIsSheetExpanded(!isSheetExpanded)}
          className="w-full pt-2.5 pb-1.5 flex flex-col items-center justify-center cursor-pointer group"
        >
          <div className="w-10 h-1.5 bg-slate-300 group-hover:bg-slate-400 rounded-full transition-colors" />
          <div className="flex items-center gap-1 mt-1 text-[10px] font-semibold text-slate-400 group-hover:text-slate-600">
            {isSheetExpanded ? (
              <>
                <ChevronDown className="w-3 h-3" /> Swipe down to minimize
              </>
            ) : (
              <>
                <ChevronUp className="w-3 h-3" /> Swipe up for building details
              </>
            )}
          </div>
        </div>

        {/* Scrollable Container Inside Bottom Sheet */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 scrollbar-thin">
          <div className="max-w-md mx-auto">
            {/* Header of Selected Building */}
            <div className="flex items-start justify-between gap-3 mb-1">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-extrabold text-[#0B1D3A] tracking-tight leading-snug">
                    {selectedBuilding.name}
                  </h2>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-[#1E5EFF] border border-blue-200/60 uppercase tracking-wide">
                    {selectedBuilding.category || 'Academic Block'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 leading-normal">
                  {selectedBuilding.description}
                </p>
              </div>

              {/* Code Badge */}
              <span className="shrink-0 text-xs font-extrabold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200">
                {selectedBuilding.code}
              </span>
            </div>

            {/* Navigation ETA Status Strip */}
            {isNavigating && (
              <div className="my-2.5 p-2.5 bg-blue-50 rounded-xl border border-blue-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-blue-900 font-semibold">
                  <Footprints className="w-4 h-4 text-[#1E5EFF]" />
                  <span>2 min walk • 150 meters</span>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Fastest Route
                </span>
              </div>
            )}

            {/* Full-width Blue "Get Directions" Button */}
            <div className="my-3">
              <button
                type="button"
                id="get-directions-btn"
                onClick={handleGetDirections}
                className="w-full py-3 px-4 bg-[#1E5EFF] hover:bg-blue-600 active:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 text-xs sm:text-sm transition-all cursor-pointer"
              >
                <Navigation className="w-4 h-4 fill-white" />
                {isNavigating ? 'Recalculate Walking Directions' : 'Get Directions'}
              </button>
            </div>

            {/* Horizontally Scrollable Category Filter Chips */}
            <div className="mb-3">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Filter Campus Locations
              </p>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {categories.map((cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border shrink-0 ${
                        isActive
                          ? 'bg-[#0B1D3A] text-white border-[#0B1D3A] shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200/80'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Expanded Detailed Information (Visible upon swipe up or click) */}
            {isSheetExpanded && (
              <div className="pt-2 border-t border-slate-100 space-y-3.5 animate-in fade-in duration-200">
                {/* Hours & Status */}
                {selectedBuilding.hours && (
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                    <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">Operational Hours</h4>
                      <p className="text-xs text-slate-600 mt-0.5">{selectedBuilding.hours}</p>
                    </div>
                  </div>
                )}

                {/* Floor Breakdown */}
                {selectedBuilding.floors && selectedBuilding.floors.length > 0 && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                    <h4 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-blue-600" />
                      Floor Directory
                    </h4>
                    <ul className="space-y-1.5">
                      {selectedBuilding.floors.map((floor, idx) => (
                        <li key={idx} className="text-xs text-slate-600 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#1E5EFF] shrink-0 mt-1.5" />
                          <span>{floor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Departments & Contacts */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                  <h4 className="text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-blue-600" />
                    Department Contact & Office
                  </h4>
                  <p className="text-xs text-slate-600">{selectedBuilding.contact}</p>

                  {/* Accessibility */}
                  <div className="mt-2 pt-2 border-t border-slate-200 flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Ramp & Wheelchair Accessible</span>
                  </div>
                </div>

                {/* Ask Jarvis About this Building */}
                <button
                  type="button"
                  onClick={() => {
                    if (onAskJarvisAboutLocation) {
                      onAskJarvisAboutLocation(`Where is ${selectedBuilding.name}?`);
                    } else {
                      onSelectMobileTab('ask-jarvis');
                    }
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#1E5EFF] font-bold text-xs flex items-center justify-center gap-1.5 border border-blue-200 transition-colors cursor-pointer"
                >
                  <span>Ask Jarvis for more information</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. Bottom Tab Bar (Docked at Very Bottom of Screen) */}
      <BottomTabBar
        activeTab="map"
        onSelectTab={onSelectMobileTab}
        isFixed={false}
        className="z-40 shrink-0 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]"
      />
    </div>
  );
};
