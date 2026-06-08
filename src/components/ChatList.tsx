import React, { useState, useEffect } from "react";
import { MessageSquare, Trash2, ChevronRight, Search, PlusCircle, Coins, CreditCard, Sparkles, MessageCircle, AlertCircle, ArrowUpRight } from "lucide-react";
import { Character, UserState, Message } from "../types";
import { loadChatHistory, clearChatHistory, getAvatarColor, getGenreKorean } from "../utils";
import { motion } from "motion/react";

interface ChatListProps {
  characters: Character[];
  userState: UserState;
  onUpdateUserState: (state: UserState) => void;
  onSelectCharacter: (charId: string) => void;
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
  onNavigateHome
}: ChatListProps) {
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
    
    characters.forEach((char) => {
      const history = loadChatHistory(char.id);
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
  }, [characters]);

  // Handle clearing/quitting a chat room
  const handleRemoveSession = (e: React.MouseEvent, charId: string, charName: string) => {
    e.stopPropagation(); // Avoid triggering chat room entry
    if (confirm(`[${charName}] 캐릭터와의 모든 대화기록과 소중한 기억을 지우고 방을 나가실 건가요?`)) {
      clearChatHistory(charId);
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

  // Pick some hot characters to recommend if empty or to browse
  const recommendedCharacters = characters
    .filter((c) => !activeSessions.some((s) => s.character.id === c.id))
    .slice(0, 3);

  return (
    <div className="w-full max-w-[840px] mx-auto px-4 py-6 md:py-10 flex flex-col gap-6 md:gap-8 select-none">
      
      {/* Title & Description Header Text Only */}
      <div className="relative flex flex-col justify-center gap-2 py-2 px-1 mb-2 pb-3 border-b border-neutral-900/40">
        <div className="relative z-10">
          <h2 className="text-[#eee] font-black text-xl md:text-3xl tracking-tight leading-none mb-2">지금 하고 있는 채팅</h2>
          <p className="text-sm text-neutral-400 tracking-tight leading-relaxed max-w-none">최근 나눈 대화 기록을 모아보고 대화를 이어가거나 초기화할 수 있는 나만의 대화함</p>
        </div>
      </div>

      {/* 2. Delicate Search Field (using soft border-neutral-900 instead of border-neutral-850) */}
      {activeSessions.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            placeholder="상대 이름, 소설명, 대사 키워드로 검색해 보세요..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#141416] border border-neutral-900 focus:border-[#7c6cff]/40 rounded-xl py-3 pl-10 pr-4 text-xs md:text-sm text-neutral-200 placeholder-neutral-600 outline-none transition-all"
          />
        </div>
      )}

      {/* 3. ACTIVE SESSIONS LIST */}
      <div className="flex flex-col gap-3">
        {activeSessions.length === 0 ? (
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
                  className="group relative w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#141416] hover:bg-[#1a1a1d] border border-neutral-900/80 hover:border-[#7c6cff]/30 transition-all cursor-pointer duration-200"
                >
                  {/* Hover Left Tag Accent strip */}
                  <div className="absolute inset-y-0 left-0 w-[3px] bg-[#7c6cff] rounded-l-xl scale-y-0 group-hover:scale-y-100 transition-transform duration-200" />

                  {/* Left elements: Profile Avatar + Title & Last text */}
                  <div className="flex items-center gap-3.5 flex-1 min-w-0">
                    
                    {/* Circle Avatar Wrapper with smooth border frame (no stark glows) */}
                    <div className="relative shrink-0 select-none">
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

                    {/* Metadata column details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-base text-neutral-200 group-hover:text-[#b9adff] transition-colors tracking-tight">
                          {char.name}
                        </span>
                        
                        <span className="text-xs text-neutral-500 font-medium truncate max-w-[150px] md:max-w-[240px]">
                          {char.title}
                        </span>

                        {char.isAdult && (
                          <span className="bg-[#ff3a54] text-white text-[9px] font-black px-1 py-0.2 rounded-sm shadow-sm scale-90">
                            19
                          </span>
                        )}
                        
                        <span className="text-[10px] bg-neutral-900 text-neutral-500 px-1.5 py-0.2 rounded font-medium">
                          {getGenreKorean(char.genre)}
                        </span>
                      </div>

                      {/* Last Message Text Preview (Very soft grey, no heavy contrast) */}
                      <p className="text-sm text-neutral-400 mt-1 font-normal truncate max-w-[260px] sm:max-w-[420px] md:max-w-[480px] leading-relaxed group-hover:text-neutral-300">
                        {isUser ? (
                          <span className="text-[#a394ff] font-bold mr-1 bg-[#7c6cff]/10 px-1.2 py-0.1 rounded text-[9.5px]">
                            나
                          </span>
                        ) : null}
                        <span className="align-middle">{lastMsg.text}</span>
                      </p>
                    </div>
                  </div>

                  {/* Right side alignment: Time, msg count and Clear actions */}
                  <div className="flex items-center sm:items-end justify-between sm:justify-start sm:flex-col gap-2 shrink-0 border-t border-neutral-900/50 pt-2 sm:pt-0 sm:border-0 pl-1">
                    
                    <span className="text-[9.5px] text-neutral-500 font-mono">
                      {lastMsg.timestamp || "최근 대화"}
                    </span>
                    
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <span className="text-[9.5px] font-bold bg-[#7c6cff]/10 text-[#a394ff] px-2 py-0.5 rounded-full">
                        {session.totalMessages}턴 대화
                      </span>
                      
                      <button
                        onClick={(e) => handleRemoveSession(e, char.id, char.name)}
                        className="p-1 px-1.5 rounded bg-neutral-900/80 text-neutral-500 hover:text-rose-400 transition-all cursor-pointer"
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
