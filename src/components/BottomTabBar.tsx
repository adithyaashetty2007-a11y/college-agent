import React from 'react';
import { Home, MessageSquare, Map, Calendar, MoreHorizontal } from 'lucide-react';
import { NavItemId } from '../types';

export type MobileTabId = 'home' | 'ask-jarvis' | 'map' | 'dates' | 'more';

interface BottomTabBarProps {
  activeTab: MobileTabId;
  onSelectTab: (tab: MobileTabId) => void;
  className?: string;
  isFixed?: boolean;
  excludeTabIds?: MobileTabId[];
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab,
  onSelectTab,
  className = '',
  isFixed = true,
  excludeTabIds = [],
}) => {
  const allTabs = [
    { id: 'home' as MobileTabId, label: 'Home', icon: Home },
    { id: 'ask-jarvis' as MobileTabId, label: 'Ask Jarvis', icon: MessageSquare },
    { id: 'map' as MobileTabId, label: 'Map', icon: Map },
    { id: 'dates' as MobileTabId, label: 'Dates', icon: Calendar },
    { id: 'more' as MobileTabId, label: 'More', icon: MoreHorizontal },
  ];

  const tabs = allTabs.filter((tab) => !excludeTabIds.includes(tab.id));

  return (
    <nav
      className={`${
        isFixed
          ? 'fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200/90 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]'
          : 'relative z-10 bg-white border-t border-slate-200/90'
      } ${className}`}
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              id={`mobile-tab-${tab.id}`}
              onClick={() => onSelectTab(tab.id)}
              className="relative flex-1 flex flex-col items-center justify-center h-full py-1.5 group cursor-pointer transition-colors"
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Active top indicator bar matching the reference image */}
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] bg-[#1E5EFF] rounded-b-full transition-all duration-300" />
              )}

              <Icon
                className={`w-5 h-5 transition-all duration-200 ${
                  isActive
                    ? 'text-[#1E5EFF] scale-105 stroke-[2.4]'
                    : 'text-slate-500 group-hover:text-slate-700 stroke-[1.8]'
                }`}
              />
              <span
                className={`text-[11px] mt-1 transition-all duration-200 ${
                  isActive
                    ? 'font-semibold text-[#1E5EFF]'
                    : 'font-medium text-slate-500 group-hover:text-slate-700'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
