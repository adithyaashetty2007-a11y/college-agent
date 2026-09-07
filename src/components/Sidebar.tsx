import React from 'react';
import {
  Home,
  Mic,
  Map,
  Calendar,
  IndianRupee,
  Building2,
  Users,
  Info,
  X,
} from 'lucide-react';
import { NavItemId } from '../types';
import { SJECCrest, SJECBuildingOutline } from './SJECLogos';

interface SidebarProps {
  activeTab: NavItemId;
  onSelectTab: (tab: NavItemId) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

const NAV_ITEMS: { id: NavItemId; label: string; icon: React.ElementType }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'ask-jarvis', label: 'Ask Jarvis', icon: Mic },
  { id: 'campus-map', label: 'Campus Map', icon: Map },
  { id: 'important-dates', label: 'Important Dates', icon: Calendar },
  { id: 'fee-payments', label: 'Fee & Payments', icon: IndianRupee },
  { id: 'departments', label: 'Departments', icon: Building2 },
  { id: 'student-services', label: 'Student Services', icon: Users },
  { id: 'about-sjec', label: 'About SJEC', icon: Info },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 md:w-72 bg-[#0B1D3A] text-white flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        } border-r border-slate-800/80 select-none shadow-2xl lg:shadow-none`}
      >
        {/* Top Header Section */}
        <div className="p-5 md:p-6 pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <SJECCrest className="w-12 h-14 shrink-0 drop-shadow-md" />
              <div>
                <h1 className="text-white text-[13px] font-extrabold uppercase tracking-wide leading-tight">
                  St Joseph
                </h1>
                <h1 className="text-white text-[13px] font-extrabold uppercase tracking-wide leading-tight">
                  Engineering
                </h1>
                <h1 className="text-white text-[13px] font-extrabold uppercase tracking-wide leading-tight">
                  College
                </h1>
                <p className="text-blue-300/80 text-[11px] font-semibold tracking-wider mt-0.5">
                  (SJEC)
                </p>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg focus:outline-hidden"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav List */}
          <nav className="mt-8 space-y-1.5" aria-label="Main Navigation">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => {
                    onSelectTab(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer text-left ${
                    isActive
                      ? 'bg-[#1E5EFF] text-white shadow-lg shadow-blue-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 shrink-0 ${
                      isActive ? 'text-white' : 'text-slate-300'
                    }`}
                  />
                  <span className="tracking-normal">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Architectural Building Sketch & Tagline */}
        <div className="p-5 md:p-6 pt-0 mt-auto">
          <div className="w-full px-2 mb-3">
            <SJECBuildingOutline className="w-full h-auto opacity-70 hover:opacity-100 transition-opacity" />
          </div>

          <div className="border-t border-white/10 pt-3 text-center">
            <p className="text-xs font-serif italic text-blue-100/90 tracking-widest uppercase">
              Learn <span className="text-blue-400 font-sans mx-1.5">•</span> Grow{' '}
              <span className="text-blue-400 font-sans mx-1.5">•</span> Serve
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
