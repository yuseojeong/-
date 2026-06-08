import { UserState, Message } from "./types";

const LOCAL_STORAGE_KEY = "novelchat_user_state_v1";
const CHAT_HISTORY_PREFIX = "novelchat_chat_v1_";

const DEFAULT_STATE: UserState = {
  nickname: "독자님",
  coins: 45,
  tickets: 100, // Displayed as 챗티켓
  favorites: ["amelia", "sooa", "saebyeok"],
  unlockedAdult: true, // Safety filter: adult themes toggled on by default
  theme: "dark"
};

export function loadUserState(): UserState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure all fields exist
      return { ...DEFAULT_STATE, ...parsed };
    }
  } catch (e) {
    console.error("Failed to load user state", e);
  }
  return DEFAULT_STATE;
}

export function saveUserState(state: UserState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save user state", e);
  }
}

export function loadChatHistory(characterId: string): Message[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(`${CHAT_HISTORY_PREFIX}${characterId}`);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error(`Failed to load chat history for ${characterId}`, e);
  }
  return [];
}

export function saveChatHistory(characterId: string, messages: Message[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${CHAT_HISTORY_PREFIX}${characterId}`, JSON.stringify(messages));
  } catch (e) {
    console.error(`Failed to save chat history for ${characterId}`, e);
  }
}

export function clearChatHistory(characterId: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(`${CHAT_HISTORY_PREFIX}${characterId}`);
  } catch (e) {
    console.error(`Failed to clear chat for ${characterId}`, e);
  }
}

// Simple avatar graphic visual generator based on character initials or name
export function getAvatarColor(charId: string): string {
  const hash = charId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colors = [
    "from-purple-600 to-indigo-800",
    "from-emerald-500 to-teal-700",
    "from-rose-500 to-pink-700",
    "from-blue-600 to-cyan-700",
    "from-orange-500 to-yellow-600",
    "from-red-600 to-rose-800"
  ];
  return colors[hash % colors.length];
}

// Convert genre categories to elegant Korean mappings
export function getGenreKorean(genre: string): string {
  switch (genre?.toUpperCase()) {
    case "FANTASY": return "판타지";
    case "CAMPUS": return "캠퍼스/로맨스";
    case "ACADEMY": return "아카데미";
    case "HYPNOSIS": return "최면/일진";
    case "HORROR": return "미스터리/괴담";
    case "SF": return "SF 미래과학";
    case "COMEDY": return "코미디/일상";
    default: return genre;
  }
}

