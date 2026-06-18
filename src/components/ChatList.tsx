import React, { useState, useEffect } from "react";
import { MessageSquare, Trash2, ChevronRight, Search, PlusCircle, Coins, CreditCard, Sparkles, MessageCircle, AlertCircle, ArrowUpRight, Star, StarOff } from "lucide-react";
import { Character, UserState, Message } from "../types";
import { loadChatHistory, clearChatHistory, getAvatarColor, getGenreKorean } from "../utils";
import { motion } from "motion/react";

interface ChatListProps {
  characters: Character[];
  userState: UserState;
  onUpdateUserState: (state: UserState) => void;
  onSelectCharacter: (charId: string) => void;
  onSelectCharacterToDetail?: (charId: string) => void;
  onNavigateHome: () => void;
}

interface ActiveChatSession {
  character: Character;
  lastMessage: Message;
  totalMessages: number;
}

export default function ChatList({
  characters,
  userState,
  onUpdateUserState,
  onSelectCharacter,
  onSelectCharacterToDetail,
  onNavigateHome
}: ChatListProps) {
  const [subTab, setSubTab] = useState<"chats" | "favorites">("chats");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSessions, setActiveSessions] = useState<ActiveChatSession[]>([]);
  const [showToast, setShowToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 2000);
  };

  // Find characters with valid saved chat history in localStorage
  const loadSessions = () => {
    const sessions: ActiveChatSession[] = [];
    const activePersona = userState.activePersona || "독자님";
    
    characters.forEach((char) => {
      const history = loadChatHistory(char.id, activePersona);
      if (history && history.length > 0) {
        const lastMsg = history[history.length - 1];
        sessions.push({
          character: char,
          lastMessage: lastMsg,
          totalMessages: history.length
        });
      }
    });

    setActiveSessions(sessions);
  };

  useEffect(() => {
    loadSessions();
  }, [characters, userState.activePersona]);

  // Handle clearing/quitting a chat room
  const handleRemoveSession = (e: React.MouseEvent, charId: string, charName: string) => {
    e.stopPropagation(); // Avoid triggering chat room entry
    const activePersona = userState.activePersona || "독자님";
    if (confirm(`[${charName}] 캐릭터와의 모든 대화기록과 소중한 기억을 지우고 방을 나가실 건가요?`)) {
      clearChatHistory(charId, activePersona);
      triggerToast(`🍀 ${charName} 방의 대화가 완전 초기화되었습니다.`);
      loadSessions();
    }
  };

  // Filtered session list based on search bar
  const filteredSessions = activeSessions.filter((session) => {
    const nameMatch = session.character.name.toLowerCase().includes(searchQuery.toLowerCase());
    const titleMatch = session.character.title.toLowerCase().includes(searchQuery.toLowerCase());
    const textMatch = session.lastMessage.text.toLowerCase().includes(searchQuery.toLowerCase());
    return nameMatch || titleMatch || textMatch;
  });

  const favoriteItems = characters.filter((c) => userState.favorites.includes(c.id));
  const filteredFavorites = favoriteItems.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return c.name.toLowerCase().includes(q) || c.title.toLowerCase().includes(q) || c.tagline.toLowerCase().includes(q);
  });

  // Pick some hot characters to recommend if empty or to browse
  const recommendedCharacters = characters
    .filter((c) => !activeSessions.some((s) => s.character.id === c.id))
    .slice(0, 3);

  const toggleFavorite = (charId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    let updatedFavs = [...userState.favorites];
    if (updatedFavs.includes(charId)) {
      updatedFavs = updatedFavs.filter((id) => id !== charId);
    } else {
      updatedFavs.push(charId);
    }
    onUpdateUserState({ ...userState, favorites: updatedFavs });
  };

  return (
    <div className="w-full max-w-[840px] mx-auto px-4 py-6 md:py-10 flex flex-col gap-3 select-none">
      
      {/* Title & Unified subTab toggles */}
      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 px-1 mb-2 pb-3 border-b border-neutral-900/40">
        <div className="relative z-10 font-sans">
          <h2 className="text-[#eee] font-black text-xl md:text-3xl tracking-tight leading-none">대화 목록</h2>
        </div>

        {/* Custom Segmented Tab Picker layout */}
        <div className="flex bg-[#111113] p-1 rounded-xl border border-neutral-800 shrink-0 self-start sm:self-auto select-none">
          <button
            onClick={() => {
              setSubTab("chats");
              setSearchQuery("");
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
              subTab === "chats"
                ? "bg-[#7c6cff] text-white shadow-sm"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>전체 대화 ({activeSessions.length})</span>
          </button>
          <button
            onClick={() => {
              setSubTab("favorites");
              setSearchQuery("");
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
              subTab === "favorites"
                ? "bg-[#7c6cff] text-white shadow-sm"
                : "text-neutral-400 hover:text-[#eee]"
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span>즐겨찾기 ({favoriteItems.length})</span>
          </button>
        </div>
      </div>

      {/* 1.5. Persona Select / Switch Bar on ChatList */}
      <div className="flex flex-col gap-2.5 p-3.5 bg-[#141416]/80 border border-neutral-900 rounded-xl mb-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black text-neutral-500 uppercase tracking-wider">대화용 페르소나 프로필 선택</span>
          <button 
            onClick={() => {
              const newName = prompt("새로운 페르소나 프로필 이름을 입력하세요:");
              if (newName && newName.trim()) {
                const trimmed = newName.trim();
                const currentPersonas = userState.personas || ["독자님"];
                if (currentPersonas.includes(trimmed)) {
                  alert("이미 존재하는 페르소나 이름입니다.");
                  return;
                }
                const updatedPersonas = [...currentPersonas, trimmed];
                onUpdateUserState({
                  ...userState,
                  personas: updatedPersonas,
                  activePersona: trimmed
                });
                triggerToast(`✨ 새 페르소나 [${trimmed}](으)로 활성화되었습니다.`);
              }
            }}
            className="text-[11px] text-[#7c6cff] font-extrabold flex items-center gap-1 hover:underline cursor-pointer bg-transparent border-0"
          >
            + 새 페르소나 추가
          </button>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
          {(userState.personas || ["독자님"]).map((p) => {
            const isActive = (userState.activePersona || "독자님") === p;
            return (
              <button
                key={p}
                onClick={() => {
                  onUpdateUserState({
                    ...userState,
                    activePersona: p
                  });
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
                  isActive 
                    ? "bg-[#7c6cff] text-white border-[#7c6cff] shadow-lg shadow-[#7c6cff]/20" 
                    : "bg-[#0b0a0c] text-neutral-400 hover:text-white border-neutral-900"
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Delicate Search Field (Visible when there is data to search) */}
      {((subTab === "chats" && activeSessions.length > 0) || (subTab === "favorites" && favoriteItems.length > 0)) && (
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            placeholder={
              subTab === "chats"
                ? "상대 이름, 소설명, 대사 키워드로 검색해 보세요..."
                : "즐겨찾기한 캐릭터 이름, 소설명 검색..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#141416] border border-neutral-900 focus:border-[#7c6cff]/40 rounded-xl py-3 pl-10 pr-4 text-xs md:text-sm text-neutral-200 placeholder-neutral-600 outline-none transition-all"
          />
        </div>
      )}

      {/* 3. CONDITIONAL TAB CONTENTS LIST */}
      <div className="flex flex-col gap-3">
        {subTab === "chats" ? (
          activeSessions.length === 0 ? (
            /* EMBELLISHED POLISHED EMPTY STATE */
            <div className="text-center py-14 px-6 bg-[#141416] border border-neutral-900 rounded-2xl flex flex-col items-center">
              <div className="w-14 h-14 rounded-xl bg-neutral-900/60 flex items-center justify-center mb-4">
                <MessageCircle className="w-7 h-7 text-neutral-600 animate-pulse" />
              </div>
              
              <h3 className="text-sm md:text-base font-black text-white">아직 시작된 은밀한 대화가 없습니다</h3>
              <p className="text-xs text-neutral-500 max-w-[400px] leading-relaxed mt-1.5 mx-auto">
                매력 넘치는 츤데레 아멜리아, 자취방의 순수한 수아, 오하나가 귀하의 자상한 메시지를 손꼽아 기다리고 있어요.
              </p>
              
              <button
                onClick={onNavigateHome}
                className="mt-5 bg-[#7c6cff] hover:bg-[#5f4fd6] text-white font-extrabold text-xs px-5 py-3 rounded-lg hover:scale-[1.01] transition-all cursor-pointer flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>지금 대화할 캐릭터 찾으러 가기</span>
              </button>
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="text-center py-10 text-neutral-500 text-xs bg-[#141416] border border-neutral-900 rounded-xl">
              "<b>{searchQuery}</b>" 결과와 일치하는 대화 정보가 없습니다.
            </div>
          ) : (
            /* ACTIVE DIALOGUE ROOMS LIST */
            <div className="flex flex-col gap-2.5">
              {filteredSessions.map((session) => {
                const char = session.character;
                const lastMsg = session.lastMessage;
                const isUser = lastMsg.sender === "user";
                
                return (
                  <div
                    key={char.id}
                    onClick={() => onSelectCharacter(char.id)}
                    className="group relative w-full flex items-start gap-3.5 p-4 rounded-xl bg-[#141416] hover:bg-[#1a1a1d] border border-neutral-900/80 hover:border-[#7c6cff]/30 transition-all cursor-pointer duration-200 animate-in fade-in zoom-in-95 duration-200"
                  >
                    {/* Hover Left Tag Accent strip */}
                    <div className="absolute inset-y-0 left-0 w-[3px] bg-[#7c6cff] rounded-l-xl scale-y-0 group-hover:scale-y-100 transition-transform duration-200" />

                    {/* Left elements: Profile Avatar */}
                    <div className="relative shrink-0 select-none mt-0.5">
                      {/* Circle Avatar Wrapper with smooth border frame (no stark glows) */}
                      <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr ${getAvatarColor(char.id)} p-[1.5px] transition-transform duration-300 group-hover:scale-105`}>
                        <div className="w-full h-full bg-[#111113] rounded-full overflow-hidden">
                          {char.avatar ? (
                            <img
                              src={char.avatar}
                              alt={char.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-black text-xs text-neutral-400 font-mono">
                              {char.name.slice(0, 1)}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Active green breathing glowing dot indicating live persona */}
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#141416] rounded-full animate-pulse shadow-md" />
                    </div>

                    {/* Right contents: Name/Title, dialogue text preview, and actions row */}
                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                      {/* Row 1: Name and source movie/novel title inline */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-base text-neutral-200 group-hover:text-[#b9adff] transition-colors tracking-tight">
                          {char.name}
                        </span>
                        
                        <span className="text-xs text-neutral-500 font-medium truncate max-w-[150px] sm:max-w-[200px] md:max-w-[240px]">
                          {char.title}
                        </span>

                        {char.isAdult && (
                          <span className="bg-[#ff3a54] text-white text-[9px] font-black px-1.5 py-0.5 rounded-sm shadow-sm scale-90">
                            19
                          </span>
                        )}
                      </div>

                      {/* Row 2: Dialogue text (Taking full line width) */}
                      <p className="text-sm text-neutral-400 font-normal truncate max-w-full leading-relaxed group-hover:text-neutral-300">
                        {isUser ? (
                          <span className="text-[#a394ff] font-bold mr-1 bg-[#7c6cff]/10 px-1.2 py-0.1 rounded text-[9.5px]">
                            나
                          </span>
                        ) : null}
                        <span className="align-middle">{lastMsg.text}</span>
                      </p>

                      {/* Row 3: Turn count & Delete action (Aligned to the right) */}
                      <div className="flex items-center justify-end gap-2 mt-1">
                        <span className="text-[9.5px] font-bold bg-[#7c6cff]/10 text-[#a394ff] px-2 py-0.5 rounded-full select-none">
                          {session.totalMessages}턴 대화
                        </span>
                        
                        <button
                          onClick={(e) => handleRemoveSession(e, char.id, char.name)}
                          className="p-1 px-1.5 rounded bg-neutral-900/80 text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer border border-neutral-900/40"
                          title="대화 초기화"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                        
                        <ChevronRight className="w-3.5 h-3.5 text-neutral-600 group-hover:text-[#7c6cff] transition-colors hidden sm:block" />
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )
        ) : (
          /* FAVORITE CHARACTERS GRID LIST */
          favoriteItems.length === 0 ? (
            <div className="text-center py-14 px-6 bg-[#141416] border border-neutral-900 rounded-2xl flex flex-col items-center">
              <Star className="w-12 h-12 text-yellow-500/40 mb-4 animate-bounce" />
              <h3 className="text-sm md:text-base font-black text-white">즐겨찾기한 캐릭터가 없습니다</h3>
              <p className="text-xs text-neutral-500 max-w-[400px] leading-relaxed mt-1.5 mx-auto">
                궁금하거나 대화해보고 싶은 캐릭터 카드의 오른쪽 상단 별 단추를 눌러 즐겨찾기에 추가해보세요.
              </p>
              <button
                onClick={onNavigateHome}
                className="mt-5 bg-[#7c6cff] hover:bg-[#5f4fd6] text-white font-extrabold text-xs px-5 py-3 rounded-lg hover:scale-[1.01] transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>로비에서 캐릭터 구경하기</span>
              </button>
            </div>
          ) : filteredFavorites.length === 0 ? (
            <div className="text-center py-10 text-neutral-500 text-xs bg-[#141416] border border-neutral-900 rounded-xl">
              "<b>{searchQuery}</b>" 결과와 일치하는 캐릭터가 없습니다.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 md:gap-4.5 mt-1 animate-in fade-in zoom-in-95 duration-200">
              {filteredFavorites.map((c) => (
                <motion.div
                  key={c.id}
                  whileHover={{ y: -4, scale: 1.01 }}
                  onClick={() => {
                    if (onSelectCharacterToDetail) {
                      onSelectCharacterToDetail(c.id);
                    } else {
                      onSelectCharacter(c.id);
                    }
                  }}
                  className="group relative cursor-pointer bg-[#141416] rounded-2xl border border-neutral-900 hover:border-[#7c6cff]/30 overflow-hidden flex flex-col justify-end shadow-xl aspect-[2/3] w-full"
                >
                  {/* Full Background Image */}
                  {c.avatar ? (
                    <img
                      src={c.avatar}
                      alt={c.name}
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 z-0"
                    />
                  ) : (
                     <div className={`absolute inset-0 bg-gradient-to-tr ${getAvatarColor(c.id)} opacity-80 group-hover:scale-105 transition-transform duration-500 z-0`} />
                  )}

                  {/* Dark blur/gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-transparent backdrop-blur-[0.5px] z-10" />

                  {/* Star Toggle Button */}
                  <button
                    onClick={(e) => toggleFavorite(c.id, e)}
                    className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/50 text-yellow-400 backdrop-blur-sm z-30 transition-all active:scale-90 cursor-pointer"
                    title="즐겨찾기 해제"
                  >
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  </button>

                  {/* Body Content */}
                  <div className="relative z-20 p-3.5 flex flex-col justify-end w-full">
                    <div>
                      <h4 className="font-extrabold text-xs md:text-sm text-neutral-100 group-hover:text-[#b9adff] transition-colors truncate">
                        {c.name}
                      </h4>
                      <p className="text-[10px] md:text-xs text-neutral-400 truncate mt-0.5">
                        {c.title}
                      </p>
                      <p className="text-[10.5px] text-neutral-300 line-clamp-2 md:line-clamp-3 leading-relaxed mt-1 font-medium">
                        {c.tagline}
                      </p>
                    </div>

                    {/* Meta tag */}
                    <div className="mt-1.5 flex flex-row flex-nowrap overflow-x-auto scrollbar-none gap-1">
                      {c.tags && c.tags.length > 0 ? (
                        c.tags.slice(0, 2).map((tg) => (
                          <span key={tg} className="text-[8.5px] font-black text-[#b9adff] bg-[#7c6cff]/10 px-1.5 py-0.5 rounded-md">
                            {tg}
                          </span>
                        ))
                      ) : (
                        <span className="text-[8.5px] font-black text-[#b1a4ff] bg-[#7c6cff]/10 px-1.5 py-0.5 rounded-md">
                          #{getGenreKorean(c.genre)}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )
        )}
      </div>

      {/* 4. RECOMMENDATION SECTION FOR EXPANDED DISCOVERABILITY */}
      <section className="mt-4 pt-6 border-t border-neutral-900 flex flex-col gap-3.5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm md:text-base font-black uppercase text-[#8c52ff] tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>대화해 볼 만한 추천 캐릭터</span>
            </h2>
            <p className="text-xs md:text-sm text-neutral-400 mt-1">
              독자님과 아직 이야기를 나누지 않은 명 소설의 특별한 페르소나들입니다.
            </p>
          </div>
        </div>

        {/* Curation-style cards grid for Recommended Characters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {recommendedCharacters.map((char) => (
            <motion.div
              key={char.id}
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              onClick={() => onSelectCharacter(char.id)}
              className="group relative cursor-pointer bg-[#141416] rounded-2xl border border-neutral-900 hover:border-[#7c6cff]/30 overflow-hidden flex flex-col justify-end shadow-xl aspect-[2/3] w-full"
            >
              {/* Full Background Image */}
              {char.avatar ? (
                <img
                  src={char.avatar}
                  alt={char.name}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 z-0"
                />
              ) : (
                <div className={`absolute inset-0 bg-gradient-to-tr ${getAvatarColor(char.id)} opacity-80 group-hover:scale-105 transition-transform duration-500 z-0`} />
              )}

              {/* Dark blur/gradient overlay fading from bottom to top */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-transparent backdrop-blur-[0.5px] z-10" />

              {/* Combined Row of Badges (19, New, Update, Best, Hot) */}
              <div className="absolute top-2.5 left-2.5 flex items-center gap-1 z-20 flex-wrap">
                {char.isAdult && (
                  <span className="bg-[#ff3a54]/10 text-[#ff4c6a] border border-[#ff3a54]/25 text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm" title="성인 소설 원작 캐릭터">
                    19
                  </span>
                )}

                {char.badgeText && char.badgeText.length > 0 && (
                  <>
                    {char.badgeText.map((tag) => {
                      const upperTag = tag.toUpperCase();
                      let styleClass = "bg-neutral-800/60 text-neutral-300 border border-neutral-700/50";
                      if (upperTag === "NEW") {
                        styleClass = "bg-[#10b981]/10 text-[#34d399] border border-[#10b981]/25";
                      } else if (upperTag === "UPDATE") {
                        styleClass = "bg-[#f59e0b]/10 text-[#fbbf24] border border-[#f59e0b]/25";
                      } else if (upperTag === "BEST") {
                        styleClass = "bg-[#3b82f6]/10 text-[#60a5fa] border border-[#3b82f6]/25";
                      } else if (upperTag === "HOT") {
                        styleClass = "bg-[#ec4899]/10 text-[#f472b6] border border-[#ec4899]/25";
                      }
                      return (
                        <span
                          key={tag}
                          className={`text-[8.5px] font-extrabold px-1.5 py-0.5 rounded shadow-sm ${styleClass}`}
                        >
                          {tag}
                        </span>
                      );
                    })}
                  </>
                )}
              </div>

              {/* Overlaid Content Metadata Container */}
              <div className="relative z-20 p-3.5 flex flex-col justify-end w-full overflow-hidden">
                <div>
                  <h4 className="font-extrabold text-xs md:text-base text-neutral-100 group-hover:text-[#b9adff] transition-colors truncate">
                    {char.name}
                  </h4>
                  
                  <p className="text-[11px] md:text-sm text-neutral-300 line-clamp-2 leading-relaxed mt-0.5 md:mt-1 font-medium">
                    {char.tagline}
                  </p>
                </div>

                {/* Concept Chip (Moved from first div) */}
                <div className="mt-1.5 flex flex-row flex-nowrap gap-1 justify-start overflow-x-auto scrollbar-none whitespace-nowrap w-full">
                  {char.tags && char.tags.length > 0 ? (
                    char.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-[9px] md:text-[11px] font-extrabold tracking-tight text-[#b9adff] bg-[#7c6cff]/12 border border-[#7c6cff]/20 px-1.5 md:px-2 py-0.5 rounded-full inline-block shrink-0">
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-[9px] md:text-[11px] font-extrabold tracking-tight text-[#b9adff] bg-[#7c6cff]/12 border border-[#7c6cff]/20 px-1.5 md:px-2 py-0.5 rounded-full inline-block shrink-0">
                      #{getGenreKorean(char.genre)}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FLOAT MESSAGE TOAST ALERT */}
      {showToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[300] bg-neutral-900 border border-neutral-800 text-neutral-200 text-xs px-4 py-2 rounded-xl shadow-2xl flex items-center gap-1.5 animate-in slide-in-from-bottom-2 duration-200">
          <span>✨</span>
          <span>{showToast}</span>
        </div>
      )}

    </div>
  );
}
