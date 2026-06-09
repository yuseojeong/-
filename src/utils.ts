import { UserState, Message } from "./types";

const LOCAL_STORAGE_KEY = "novelchat_user_state_v1";
const CHAT_HISTORY_PREFIX = "novelchat_chat_v1_";

const DEFAULT_STATE: UserState = {
  nickname: "독자님",
  coins: 45,
  tickets: 100, // Displayed as 챗티켓
  favorites: ["amelia", "sooa", "saebyeok"],
  unlockedAdult: true, // Safety filter: adult themes toggled on by default
  theme: "dark",
  personas: ["독자님"],
  activePersona: "독자님"
};

export function loadUserState(): UserState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Clean fallback if persona data doesn't exist
      const nickname = parsed.nickname || DEFAULT_STATE.nickname;
      const personas = parsed.personas && parsed.personas.length > 0 
        ? parsed.personas 
        : [nickname];
      const activePersona = parsed.activePersona || nickname || DEFAULT_STATE.activePersona;

      return { 
        ...DEFAULT_STATE, 
        ...parsed,
        personas,
        activePersona
      };
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

export function loadChatHistory(characterId: string, personaName: string = "독자님"): Message[] {
  if (typeof window === "undefined") return [];
  try {
    const key = `${CHAT_HISTORY_PREFIX}${characterId}_${personaName}`;
    const oldKey = `${CHAT_HISTORY_PREFIX}${characterId}`;
    
    let saved = localStorage.getItem(key);
    // Legacy mapping: migration fallback if no persona history is found for DEFAULT persona
    if (!saved && (personaName === "독자님" || personaName === "")) {
      const oldSaved = localStorage.getItem(oldKey);
      if (oldSaved) {
        localStorage.setItem(key, oldSaved);
        saved = oldSaved;
      }
    }
    
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error(`Failed to load chat history for ${characterId} for persona ${personaName}`, e);
  }
  return [];
}

export function saveChatHistory(characterId: string, messages: Message[], personaName: string = "독자님"): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${CHAT_HISTORY_PREFIX}${characterId}_${personaName}`, JSON.stringify(messages));
  } catch (e) {
    console.error(`Failed to save chat history for ${characterId} for persona ${personaName}`, e);
  }
}

export function clearChatHistory(characterId: string, personaName: string = "독자님"): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(`${CHAT_HISTORY_PREFIX}${characterId}_${personaName}`);
  } catch (e) {
    console.error(`Failed to clear chat for ${characterId} for persona ${personaName}`, e);
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

