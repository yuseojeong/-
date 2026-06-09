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
  novelStats?: {
    author: string;
    views: string;          // e.g., "35.2M"
    recommendations: string;// e.g., "1.2M"
    favorites: string;      // e.g., "180,000"
    chapters: string;       // e.g., "340화 연재중"
    synopsis: string;       // Original synopis
    worldview?: string;     // Worldview summary
    novelpiaUrl: string;    // Novelpia link
  };
}

export interface UserState {
  nickname: string;
  coins: number;
  tickets: number;
  favorites: string[]; // Character IDs
  unlockedAdult: boolean; // Settings switch for general vs. adult mode
  theme: "dark" | "light";
  personas?: string[];     // Multi-persona names list
  activePersona?: string;  // Active/selected persona name
}

export interface Notice {
  id: string;
  text: string;
}
