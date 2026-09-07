export type NavItemId =
  | 'home'
  | 'ask-jarvis'
  | 'campus-map'
  | 'important-dates'
  | 'fee-payments'
  | 'departments'
  | 'student-services'
  | 'about-sjec';

export interface SuggestionQuestion {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface BuildingLocation {
  id: string;
  name: string;
  code: string;
  xPercent: number; // For map positioning
  yPercent: number;
  description: string;
  category?: 'Academic' | 'Hostel' | 'Sports' | 'Food' | 'Admin' | string;
  departments?: string[];
  hours?: string;
  floors?: string[];
  contact?: string;
  wheelchairAccessible?: boolean;
}

export interface CampusRoute {
  id: string;
  destinationName: string;
  originName: string;
  duration: string;
  distance: string;
  steps: string[];
  pathPoints: { x: number; y: number }[];
}

export interface QuickActionItem {
  id: string;
  title: string;
  description: string;
  badgeColor: string;
  iconType: 'compass' | 'calendar' | 'file' | 'clock' | 'users';
  details: {
    summary: string;
    items: { label: string; value: string }[];
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'jarvis';
  text: string;
  timestamp?: string;
  type?: 'text' | 'map' | 'list';
  mapData?: {
    locationName: string;
    routeDesc?: string;
    targetBuildingCode?: string;
  };
  listItems?: string[];
}

export type DateCategory = 'Exams' | 'Fees' | 'Admissions' | 'Events' | 'Holidays';

export interface ImportantDateItem {
  id: string;
  title: string;
  description: string;
  category: DateCategory;
  date: string; // ISO string e.g. "2025-05-27"
  dayNumber: number; // 27
  monthAbbr: string; // "MAY"
  monthYear: string; // "May 2025"
  isUrgent?: boolean;
  isToday?: boolean;
  location?: string;
  time?: string;
}
