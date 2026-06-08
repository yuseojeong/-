export interface Message {
  id: string;
  sender: "user" | "character";
  text: string;
  timestamp: string;
}

export interface Character {
  id: string;
  name: string;
  title: string;
  tagline: string;
  gender: "female" | "male";
  avatar: string;
  bannerColor: string; // Background color for active carousel / world theme
  textColor: string;   // Accent text color matching their identity
  badgeText?: string[]; // "NEW", "HOT", "BEST", "UPDATE"
  genre: string;       // e.g. "FANTASY", "CAMPUS", "ACADEMY", "HYPNOSIS"
  isAdult: boolean;    // Novelpia's adult toggle classification
  views: string;       // e.g., "101K"
  chats: string;       // e.g., "3.9K"
  likes: string;       // e.g., "320"
  description: string;
  systemPrompt: string; // Used by Gemini proxy to set character personality
  tags?: string[];      // Creative tags like #일진, #츤데레, #혐관
}

export interface UserState {
  nickname: string;
  coins: number;
  tickets: number;
  favorites: string[]; // Character IDs
  unlockedAdult: boolean; // Settings switch for general vs. adult mode
  theme: "dark" | "light";
}

export interface Notice {
  id: string;
  text: string;
}
