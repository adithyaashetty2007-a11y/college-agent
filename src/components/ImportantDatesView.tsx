import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  List,
  SlidersHorizontal,
  Bell,
  BellRing,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Check,
  X,
  AlertCircle,
  CalendarCheck,
  Filter,
} from 'lucide-react';
import { IMPORTANT_DATES } from '../data/importantDatesData';
import { DateCategory, ImportantDateItem } from '../types';
import { BottomTabBar, MobileTabId } from './BottomTabBar';

interface ImportantDatesViewProps {
  onBackToHome: () => void;
  onSelectMobileTab: (tab: MobileTabId) => void;
  onAskJarvisAboutDate?: (query: string) => void;
}

type FilterChip = 'All' | DateCategory;

export const ImportantDatesView: React.FC<ImportantDatesViewProps> = ({
  onBackToHome,
  onSelectMobileTab,
  onAskJarvisAboutDate,
}) => {
  // View mode: 'list' | 'calendar'
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  // Category filter: 'All' | 'Exams' | 'Fees' | 'Admissions' | 'Events' | 'Holidays'
  const [selectedCategory, setSelectedCategory] = useState<FilterChip>('All');

  // Filter menu popover state
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [urgentOnly, setUrgentOnly] = useState(false);

  // Reminders state (set of date IDs)
  const [reminders, setReminders] = useState<Set<string>>(
    new Set(['date-may-16-fees', 'date-may-27-fees'])
  );
  const [reminderToast, setReminderToast] = useState<string | null>(null);

  // Calendar view navigation state
  // Currently viewing month: May 2025 (year: 2025, monthIndex: 4 [0-indexed])
  const [calendarYear, setCalendarYear] = useState(2025);
  const [calendarMonth, setCalendarMonth] = useState(4); // 4 = May
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string>('2025-05-16');

  const filterChips: FilterChip[] = ['All', 'Exams', 'Fees', 'Admissions', 'Events', 'Holidays'];

  // Toggle reminder for an item
  const handleToggleReminder = (item: ImportantDateItem) => {
    setReminders((prev) => {
      const next = new Set(prev);
      if (next.has(item.id)) {
        next.delete(item.id);
        setReminderToast(`Reminder removed for ${item.title}`);
      } else {
        next.add(item.id);
        setReminderToast(`Reminder set for ${item.title} (${item.date})`);
      }
      return next;
    });

    setTimeout(() => {
      setReminderToast(null);
    }, 2500);
  };

  // Filtered dates based on category and urgent flag
  const filteredDates = useMemo(() => {
    return IMPORTANT_DATES.filter((item) => {
      const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesUrgent = !urgentOnly || item.isUrgent || item.isToday;
      return matchesCat && matchesUrgent;
    });
  }, [selectedCategory, urgentOnly]);

  // Group filtered dates by monthYear (e.g. "MAY 2025", "JUNE 2025")
  const groupedDates = useMemo(() => {
    const groups: { [key: string]: ImportantDateItem[] } = {};
    filteredDates.forEach((item) => {
      if (!groups[item.monthYear]) {
        groups[item.monthYear] = [];
      }
      groups[item.monthYear].push(item);
    });
    return groups;
  }, [filteredDates]);

  // Color mapping based on category
  const getCategoryStyles = (cat: DateCategory) => {
    switch (cat) {
      case 'Exams':
        return {
          barColor: 'bg-[#1E5EFF]',
          pillBg: 'bg-blue-50 text-[#1E5EFF] border-blue-200/80',
          dotColor: 'bg-[#1E5EFF]',
        };
      case 'Fees':
        return {
          barColor: 'bg-[#F97316]',
          pillBg: 'bg-amber-50 text-amber-700 border-amber-200/80',
          dotColor: 'bg-[#F97316]',
        };
      case 'Events':
        return {
          barColor: 'bg-[#10B981]',
          pillBg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
          dotColor: 'bg-[#10B981]',
        };
      case 'Admissions':
        return {
          barColor: 'bg-[#8B5CF6]',
          pillBg: 'bg-purple-50 text-purple-700 border-purple-200/80',
          dotColor: 'bg-[#8B5CF6]',
        };
      case 'Holidays':
      default:
        return {
          barColor: 'bg-[#64748B]',
          pillBg: 'bg-slate-100 text-slate-700 border-slate-200/80',
          dotColor: 'bg-[#64748B]',
        };
    }
  };

  // Calendar calculations
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentMonthName = monthNames[calendarMonth];
  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const firstDayIndex = new Date(calendarYear, calendarMonth, 1).getDay();

  // Map dates in this month to items
  const datesInMonthMap = useMemo(() => {
    const map = new Map<string, ImportantDateItem[]>();
    IMPORTANT_DATES.forEach((d) => {
      const [y, m] = d.date.split('-').map(Number);
      if (y === calendarYear && m === calendarMonth + 1) {
        if (!map.has(d.date)) {
          map.set(d.date, []);
        }
        map.get(d.date)!.push(d);
      }
    });
    return map;
  }, [calendarYear, calendarMonth]);

  // Handle calendar month navigation
  const handlePrevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear((prev) => prev - 1);
    } else {
      setCalendarMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear((prev) => prev + 1);
    } else {
      setCalendarMonth((prev) => prev + 1);
    }
  };

  // Items for the selected calendar date
  const selectedDateItems = useMemo(() => {
    return IMPORTANT_DATES.filter((item) => item.date === selectedCalendarDate);
  }, [selectedCalendarDate]);

  return (
    <div className="relative flex flex-col h-screen max-h-screen bg-[#F0F4F9] text-slate-800 font-['Plus_Jakarta_Sans',sans-serif] overflow-hidden select-none">
      {/* 1. Header (Fixed Top) */}
      <header className="shrink-0 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs px-4 pt-3 pb-3 z-30 transition-all">
        <div className="max-w-md mx-auto">
          {/* Top Title & Controls Row */}
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl sm:text-2xl font-black text-[#0B1D3A] tracking-tight">
              Important Dates
            </h1>

            <div className="flex items-center gap-2">
              {/* Filter Popover Button */}
              <div className="relative">
                <button
                  type="button"
                  id="dates-filter-btn"
                  onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                  className={`p-2 rounded-xl border transition-all cursor-pointer shadow-2xs ${
                    urgentOnly || isFilterMenuOpen
                      ? 'bg-blue-50 text-[#1E5EFF] border-blue-300'
                      : 'bg-blue-50/60 hover:bg-blue-100 text-[#1E5EFF] border-blue-200/60'
                  }`}
                  title="Filter options"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </button>

                {/* Filter Dropdown Popover */}
                {isFilterMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2.5 z-50 animate-in fade-in zoom-in-95">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5">
                      Filter Dates
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setUrgentOnly(!urgentOnly);
                        setIsFilterMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-500" />
                        Urgent / Today Only
                      </span>
                      {urgentOnly && <Check className="w-3.5 h-3.5 text-[#1E5EFF]" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategory('All');
                        setUrgentOnly(false);
                        setIsFilterMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 mt-1 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-50 cursor-pointer"
                    >
                      <span>Reset Filters</span>
                      <X className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  </div>
                )}
              </div>

              {/* Toggle List / Calendar View Button */}
              <button
                type="button"
                id="toggle-calendar-view-btn"
                onClick={() => setViewMode(viewMode === 'list' ? 'calendar' : 'list')}
                className={`p-2 rounded-xl border transition-all cursor-pointer shadow-2xs ${
                  viewMode === 'calendar'
                    ? 'bg-[#1E5EFF] text-white border-[#1E5EFF]'
                    : 'bg-blue-50/60 hover:bg-blue-100 text-[#1E5EFF] border-blue-200/60'
                }`}
                title={viewMode === 'list' ? 'Switch to Calendar View' : 'Switch to List View'}
              >
                {viewMode === 'list' ? (
                  <CalendarIcon className="w-4 h-4" />
                ) : (
                  <List className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Category Filter Chips (Horizontally Scrollable Row) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
            {filterChips.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  id={`filter-chip-${cat.toLowerCase()}`}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer shrink-0 border ${
                    isActive
                      ? 'bg-[#1E5EFF] text-white border-[#1E5EFF] shadow-xs'
                      : 'bg-slate-100/90 hover:bg-slate-200 text-slate-700 border-slate-200/60'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Floating Toast Notification */}
      {reminderToast && (
        <div className="absolute top-28 left-1/2 -translate-x-1/2 z-40 bg-[#0B1D3A]/95 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg border border-blue-400/30 backdrop-blur-md flex items-center gap-2 animate-in fade-in">
          <BellRing className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />
          <span>{reminderToast}</span>
        </div>
      )}

      {/* 2. Main Scrollable Content (List View vs Calendar View) */}
      <main className="flex-1 overflow-y-auto px-4 py-3 pb-24 scrollbar-thin">
        <div className="max-w-md mx-auto space-y-4">
          {/* Urgent filter active banner */}
          {urgentOnly && (
            <div className="flex items-center justify-between bg-rose-50 border border-rose-200 rounded-xl px-3 py-2 text-xs text-rose-800">
              <div className="flex items-center gap-1.5 font-semibold">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>Showing Urgent & Today deadlines only</span>
              </div>
              <button
                type="button"
                onClick={() => setUrgentOnly(false)}
                className="text-rose-600 hover:text-rose-800 font-bold underline cursor-pointer"
              >
                Clear
              </button>
            </div>
          )}

          {/* VIEW MODE: LIST VIEW (DEFAULT) */}
          {viewMode === 'list' && (
            <div className="space-y-5">
              {Object.keys(groupedDates).length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
                  <CalendarCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <h3 className="text-sm font-bold text-slate-700">No dates found</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    No deadlines or events match the selected &quot;{selectedCategory}&quot; filter.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory('All');
                      setUrgentOnly(false);
                    }}
                    className="mt-3 px-3 py-1.5 text-xs font-bold text-[#1E5EFF] bg-blue-50 rounded-lg hover:bg-blue-100 cursor-pointer"
                  >
                    View all dates
                  </button>
                </div>
              ) : (
                (Object.entries(groupedDates) as [string, ImportantDateItem[]][]).map(([monthLabel, items]) => (
                  <section key={monthLabel} className="space-y-2.5">
                    {/* Month Header Label */}
                    <div className="flex items-center justify-between px-0.5 pt-1">
                      <h2 className="text-xs sm:text-[13px] font-black tracking-wider text-slate-800 uppercase">
                        {monthLabel}
                      </h2>
                      <span className="text-[11px] font-bold text-slate-400">
                        {items.length} {items.length === 1 ? 'item' : 'items'}
                      </span>
                    </div>

                    {/* Cards for this month */}
                    <div className="space-y-2.5">
                      {items.map((item) => {
                        const style = getCategoryStyles(item.category);
                        const hasReminder = reminders.has(item.id);

                        return (
                          <div
                            key={item.id}
                            id={`date-card-${item.id}`}
                            className="bg-white rounded-2xl p-3 sm:p-3.5 shadow-sm hover:shadow-md border border-slate-100/90 relative overflow-hidden flex items-center gap-3 transition-all group"
                          >
                            {/* Colored left-edge accent bar indicating category */}
                            <div
                              className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl ${style.barColor}`}
                            />

                            {/* Bold date badge on the left (rounded dark square) */}
                            <div className="bg-[#0B1D3A] text-white rounded-xl w-12 h-12 sm:w-13 sm:h-13 shrink-0 flex flex-col items-center justify-center shadow-xs pl-0.5">
                              <span className="text-lg sm:text-xl font-black leading-none tracking-tight">
                                {item.dayNumber}
                              </span>
                              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-300 mt-0.5">
                                {item.monthAbbr}
                              </span>
                            </div>

                            {/* Middle content: Title, Description, Category Tag */}
                            <div className="flex-1 min-w-0 pr-1">
                              {/* Top row: Title and optional Urgent/Today badge */}
                              <div className="flex items-start justify-between gap-1.5">
                                <h3 className="text-xs sm:text-[13px] font-extrabold text-[#0B1D3A] leading-snug tracking-tight">
                                  {item.title}
                                </h3>

                                {/* Urgent or Today badge */}
                                {item.isToday ? (
                                  <span className="shrink-0 bg-rose-600 text-white text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-2xs">
                                    Today
                                  </span>
                                ) : item.isUrgent ? (
                                  <span className="shrink-0 bg-rose-600 text-white text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-2xs">
                                    Urgent
                                  </span>
                                ) : null}
                              </div>

                              {/* Short one-line description */}
                              <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-snug line-clamp-1">
                                {item.description}
                              </p>

                              {/* Category tag pill matching accent color & optional location */}
                              <div className="flex items-center gap-2 mt-1.5">
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${style.pillBg}`}
                                >
                                  {item.category}
                                </span>

                                {item.time && (
                                  <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                                    <Clock className="w-2.5 h-2.5" />
                                    {item.time}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Right edge: Bell/reminder toggle icon button */}
                            <button
                              type="button"
                              id={`reminder-btn-${item.id}`}
                              onClick={() => handleToggleReminder(item)}
                              className={`p-2 rounded-xl transition-all cursor-pointer shrink-0 ${
                                hasReminder
                                  ? 'bg-blue-50 text-[#1E5EFF] shadow-2xs'
                                  : 'text-slate-400 hover:text-blue-600 hover:bg-slate-50'
                              }`}
                              title={hasReminder ? 'Reminder is set' : 'Set reminder'}
                              aria-label={hasReminder ? 'Remove reminder' : 'Set reminder'}
                            >
                              {hasReminder ? (
                                <Bell className="w-4 h-4 fill-[#1E5EFF] text-[#1E5EFF]" />
                              ) : (
                                <Bell className="w-4 h-4 stroke-[1.8]" />
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                ))
              )}
            </div>
          )}

          {/* VIEW MODE: CALENDAR VIEW */}
          {viewMode === 'calendar' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Calendar Month Navigation Card */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                {/* Header Month Switcher */}
                <div className="flex items-center justify-between mb-3.5">
                  <h2 className="text-base font-extrabold text-[#0B1D3A]">
                    {currentMonthName} {calendarYear}
                  </h2>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={handlePrevMonth}
                      className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title="Previous Month"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextMonth}
                      className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title="Next Month"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Day of week headers */}
                <div className="grid grid-cols-7 text-center mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                    <span key={d} className="text-[11px] font-bold text-slate-400 uppercase">
                      {d}
                    </span>
                  ))}
                </div>

                {/* Calendar Days Grid */}
                <div className="grid grid-cols-7 gap-1 text-center">
                  {/* Empty cells before 1st day */}
                  {Array.from({ length: firstDayIndex }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-10 sm:h-11" />
                  ))}

                  {/* Day numbers */}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const dayNum = i + 1;
                    const dateString = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                    const itemsOnDay = datesInMonthMap.get(dateString) || [];
                    const isSelected = selectedCalendarDate === dateString;
                    const hasEvents = itemsOnDay.length > 0;

                    return (
                      <button
                        key={dayNum}
                        type="button"
                        onClick={() => setSelectedCalendarDate(dateString)}
                        className={`h-10 sm:h-11 rounded-xl flex flex-col items-center justify-center relative transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#1E5EFF] text-white font-black shadow-md shadow-blue-500/30'
                            : hasEvents
                            ? 'hover:bg-blue-50/70 text-slate-800 font-bold'
                            : 'hover:bg-slate-100 text-slate-600 font-medium'
                        }`}
                      >
                        <span className="text-xs sm:text-sm leading-none">{dayNum}</span>

                        {/* Event Category Dots */}
                        {hasEvents && (
                          <div className="flex items-center gap-0.5 mt-1">
                            {itemsOnDay.slice(0, 3).map((it) => {
                              const st = getCategoryStyles(it.category);
                              return (
                                <span
                                  key={it.id}
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    isSelected ? 'bg-white' : st.dotColor
                                  }`}
                                />
                              );
                            })}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Category Legend */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center flex-wrap gap-3 text-[11px] text-slate-500 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#1E5EFF]" /> Exams
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#F97316]" /> Fees
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#10B981]" /> Events
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#8B5CF6]" /> Admissions
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#64748B]" /> Holidays
                  </span>
                </div>
              </div>

              {/* Selected Day's Events Expandable Panel Below Grid */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="text-xs font-black text-[#0B1D3A] uppercase tracking-wider flex items-center gap-1.5">
                    <CalendarIcon className="w-3.5 h-3.5 text-[#1E5EFF]" />
                    Events for {selectedCalendarDate}
                  </h3>
                  <span className="text-[11px] font-bold text-slate-400">
                    {selectedDateItems.length}{' '}
                    {selectedDateItems.length === 1 ? 'event' : 'events'}
                  </span>
                </div>

                {selectedDateItems.length === 0 ? (
                  <div className="text-center py-4 text-slate-400 text-xs">
                    No deadlines or events scheduled on this date.
                  </div>
                ) : (
                  <div className="space-y-2 pt-1">
                    {selectedDateItems.map((item) => {
                      const style = getCategoryStyles(item.category);
                      const hasReminder = reminders.has(item.id);

                      return (
                        <div
                          key={item.id}
                          className="flex items-start justify-between gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/60"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${style.pillBg}`}
                              >
                                {item.category}
                              </span>
                              {item.isToday && (
                                <span className="bg-rose-600 text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded-full">
                                  Today
                                </span>
                              )}
                            </div>
                            <h4 className="text-xs font-bold text-[#0B1D3A] mt-1">
                              {item.title}
                            </h4>
                            <p className="text-[11px] text-slate-500 mt-0.5">{item.description}</p>
                            {item.location && (
                              <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> {item.location}
                              </p>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => handleToggleReminder(item)}
                            className={`p-1.5 rounded-lg cursor-pointer ${
                              hasReminder
                                ? 'bg-blue-100 text-[#1E5EFF]'
                                : 'text-slate-400 hover:text-blue-600'
                            }`}
                            title={hasReminder ? 'Reminder set' : 'Set reminder'}
                          >
                            {hasReminder ? (
                              <Bell className="w-3.5 h-3.5 fill-[#1E5EFF]" />
                            ) : (
                              <Bell className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* 3. Bottom Tab Bar (Fixed at Very Bottom) */}
      <BottomTabBar
        activeTab="dates"
        onSelectTab={onSelectMobileTab}
        isFixed={false}
        className="z-40 shrink-0 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]"
      />
    </div>
  );
};
