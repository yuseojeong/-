import React, { useState, useEffect } from "react";
import { Home, Compass, MessageSquare, Star, Trophy, Sparkles, Coins, Gift, MoreVertical, Search } from "lucide-react";
import { Character, UserState } from "../types";
import { loadChatHistory } from "../utils";

interface LeftSidebarProps {
  activeView: string;
  activeCharacterId: string | null;
  onNavigate: (view: "home" | "chat" | "ranking" | "search" | "myinfo") => void;
  onSelectCharacterToChat: (charId: string) => void;
  characters: Character[];
  userState: UserState;
  onOpenStore: () => void;
  triggerToast: (msg: string) => void;
}

export default function LeftSidebar({
  activeView,
  activeCharacterId,
  onNavigate,
  onSelectCharacterToChat,
  characters,
  userState,
  onOpenStore,
  triggerToast
}: LeftSidebarProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLogoMenuOpen, setIsLogoMenuOpen] = useState(false);
  const [recentChats, setRecentChats] = useState<{ character: Character; lastMessage: string }[]>([]);

  // Function to load actual or simulated recent conversations
  useEffect(() => {
    const list: { character: Character; lastMessage: string }[] = [];
    
    // Check local storage for actual chats
    characters.forEach((char) => {
      const history = loadChatHistory(char.id);
      if (history && history.length > 0) {
        const lastMsg = history[history.length - 1].text;
        list.push({
          character: char,
          lastMessage: lastMsg
        });
      }
    });

    // If no real chat history exists yet, seed with simulated interactions to mimic the screenshot's high-fidelity UI
    if (list.length === 0) {
      const seedIds = ["sooa", "saebyeok", "amelia", "commander"];
      seedIds.forEach((id) => {
        const char = characters.find((c) => c.id === id);
        if (char) {
          let mockMsg = "";
          if (id === "sooa") mockMsg = "저... 오늘 밤엔 그냥 모르는 척 옆에...";
          else if (id === "saebyeok") mockMsg = "바보같이 그렇게 영혼 없이 웃지 마...";
          else if (id === "amelia") mockMsg = "너 말이야, 조수 주제에 왜 자꾸 사람...";
          else mockMsg = "이 무너진 방주에서 내가 유일하게 살리고...";

          list.push({
            character: char,
            lastMessage: mockMsg
          });
        }
      });
    }

    setRecentChats(list.slice(0, 5));
  }, [characters, activeCharacterId]);

  const primaryMenuItems = [
    { id: "home" as const, label: "홈", icon: <Home className="w-[18px] h-[18px]" /> },
    { id: "ranking" as const, label: "랭킹", icon: <Trophy className="w-[18px] h-[18px]" /> },
  ];

  const secondaryMenuItems = [
    { id: "chat", label: "채팅목록", icon: <MessageSquare className="w-[18px] h-[18px]" /> },
    { id: "search" as const, label: "검색", icon: <Search className="w-[18px] h-[18px]" /> },
    { id: "studio", label: "스튜디오", icon: <Sparkles className="w-[18px] h-[18px]" /> },
  ];

  const handleMenuClick = (id: string) => {
    if (id === "home" || id === "ranking" || id === "search" || id === "chat") {
      onNavigate(id as any);
    } else if (id === "studio") {
      triggerToast("에셋 스튜디오 & 페르소나 메이커가 곧 연동됩니다.");
    }
  };

  return (
    <>
      {/* Spacer to push main layout grid to the right on desktop */}
      <div className="hidden md:block transition-all duration-300 ease-in-out shrink-0 w-[76px]" />

      {/* Floating Panel Left Sidebar */}
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsLogoMenuOpen(false);
        }}
        className={`fixed left-0 top-0 bottom-0 z-[120] bg-[#020202] border-r border-[#151517] text-white flex flex-col pt-5 pb-6 transition-all duration-300 ease-out select-none hidden md:flex ${
          isHovered ? "w-[245px] shadow-[12px_0_40px_rgba(0,0,0,0.92)]" : "w-[76px]"
        }`}
      >
        {/* TOP COMPACT/EXPANDED LOGO (INTERACTIVE NAVIGATION POPUP) */}
        <div className="relative px-[20px] mb-8">
          <button
            onClick={() => setIsLogoMenuOpen(!isLogoMenuOpen)}
            className="flex items-center gap-3 h-10 w-full overflow-hidden text-left focus:outline-none group/logo cursor-pointer"
          >
            {/* Elegant Novelpia styled Winged Logo element */}
            <div className="w-[36px] h-[36px] bg-gradient-to-tr from-[#1b50ff] via-[#6f3bff] to-[#a026ff] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-600/30 border border-white/10 relative overflow-hidden group-hover/logo:scale-105 duration-200">
               <svg className="w-5.5 h-5.5 text-white" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                 {/* Top feather brush */}
                 <path d="M10.5 4.5C13.5 4.5 17 5.3 19 7.3C15 7.5 12.3 6.4 10.5 4.5Z" />
                 {/* Middle feather brush */}
                 <path d="M8.5 8.5C11.8 8.5 16 9.5 18 12C13.8 12 11 10.5 8.5 8.5Z" />
                 {/* Main bottom wing swoop body */}
                 <path d="M4 15.5C4.8 12 7.3 10 10.5 9.4C9.4 10.4 8.5 11.8 8.2 13.5C10.5 11.8 13.8 10.8 17 10.4C14.2 12.1 11.2 13.8 8.5 14.8C7.1 15.4 5.6 15.8 4 15.5Z" />
               </svg>
            </div>
            
            <span
              className={`font-black text-[15px] md:text-lg text-white tracking-tight duration-200 transition-opacity whitespace-nowrap ${
                isHovered ? "opacity-100 delay-75 animate-fade-in" : "opacity-0 pointer-events-none"
              }`}
            >
              노벨챗
            </span>

            {/* Down arrow marker indicating interactable options menu */}
            {isHovered && (
              <span className="text-[10px] text-neutral-500 group-hover/logo:text-neutral-300 ml-auto transition-colors">
                {isLogoMenuOpen ? "▲" : "▼"}
              </span>
            )}
          </button>

          {/* Popover Action selector list for Logo clicks */}
          {isLogoMenuOpen && isHovered && (
            <div className="absolute top-12 left-5 right-5 z-[210] bg-[#111113]/95 border border-neutral-800 rounded-xl p-1.5 shadow-2xl animate-fade-in select-none backdrop-blur-md">
              <button
                onClick={() => {
                  window.open("https://novelpia.com/", "_blank", "noopener,noreferrer");
                  setIsLogoMenuOpen(false);
                  triggerToast("공식 플랫폼 노벨피아 새 탭을 열었습니다!");
                }}
                className="w-full text-center text-xs font-bold text-[#a277ff] hover:text-white hover:bg-[#7632ff]/20 p-2.5 rounded-lg transition-colors cursor-pointer"
              >
                <span>노벨피아</span>
              </button>
            </div>
          )}
        </div>

        {/* NAVIGATION MENUS WITH CUSTOM ICON CARD WRAPPERS */}
        <nav className="flex flex-col gap-1.5 px-3">
          {primaryMenuItems.map((item) => {
            const isSelected = 
              (item.id === "home" && activeView === "home") ||
              (item.id === "ranking" && activeView === "ranking");

            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className={`w-full flex items-center rounded-xl p-1.5 text-sm font-bold transition-all group duration-200 relative cursor-pointer ${
                  isSelected
                    ? "bg-[#7632ff]/12 border border-[#7632ff]/30 text-white shadow-[0_2px_12px_rgba(118,50,255,0.12)]"
                    : "text-[#85858e] hover:text-white hover:bg-[#111113] border border-transparent"
                }`}
              >
                {/* ADVANCED CUSTOM ICON WRAPPER CARD */}
                <div className={`flex items-center justify-center shrink-0 w-9 h-9 rounded-lg transition-all duration-300 ${
                  isSelected 
                    ? "bg-gradient-to-tr from-[#7632ff] to-[#9256ff] text-white shadow-md shadow-[#7632ff]/30 scale-105 border border-white/10" 
                    : "bg-[#09090b] border border-neutral-900 group-hover:border-neutral-800 text-[#85858e] group-hover:text-white group-hover:scale-105"
                }`}>
                  {item.icon}
                </div>

                {/* LABEL */}
                <span
                  className={`ml-3 tracking-wide font-black duration-205 whitespace-nowrap transition-all text-xs ${
                    isSelected ? "text-[#eee]" : "text-[#85858e] group-hover:text-white"
                  } ${
                    isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 pointer-events-none absolute"
                  }`}
                >
                  {item.label}
                </span>

                {/* RIGHT GLOW BADGE INDICATOR FOR ACTIVE */}
                {isSelected && isHovered && (
                  <span className="ml-auto mr-1.5 w-1.5 h-1.5 bg-[#7632ff] rounded-full animate-pulse shadow-md shadow-[#7632ff]" />
                )}
              </button>
            );
          })}

          {/* DELIBERATE COMPACT DIVIDER STROKE */}
          <div className="my-2 border-t border-neutral-800/80 mx-1.5" />

          {secondaryMenuItems.map((item) => {
            const isSelected = 
              (item.id === "chat" && activeView === "chat" && activeCharacterId === null) ||
              (item.id === "search" && activeView === "search") ||
              (item.id === "studio" && activeView === "studio");

            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className={`w-full flex items-center rounded-xl p-1.5 text-sm font-bold transition-all group duration-200 relative cursor-pointer ${
                  isSelected
                    ? "bg-[#7632ff]/12 border border-[#7632ff]/30 text-white shadow-[0_2px_12px_rgba(118,50,255,0.12)]"
                    : "text-[#85858e] hover:text-white hover:bg-[#111113] border border-transparent"
                }`}
              >
                {/* ADVANCED CUSTOM ICON WRAPPER CARD */}
                <div className={`flex items-center justify-center shrink-0 w-9 h-9 rounded-lg transition-all duration-300 ${
                  isSelected 
                    ? "bg-gradient-to-tr from-[#7632ff] to-[#9256ff] text-white shadow-md shadow-[#7632ff]/30 scale-105 border border-white/10" 
                    : "bg-[#09090b] border border-neutral-900 group-hover:border-neutral-800 text-[#85858e] group-hover:text-white group-hover:scale-105"
                }`}>
                  {item.icon}
                </div>

                {/* LABEL */}
                <span
                  className={`ml-3 tracking-wide font-black duration-205 whitespace-nowrap transition-all text-xs ${
                    isSelected ? "text-[#eee]" : "text-[#85858e] group-hover:text-white"
                  } ${
                    isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 pointer-events-none absolute"
                  }`}
                >
                  {item.label}
                </span>

                {/* RIGHT GLOW BADGE INDICATOR FOR ACTIVE */}
                {isSelected && isHovered && (
                  <span className="ml-auto mr-1.5 w-1.5 h-1.5 bg-[#7632ff] rounded-full animate-pulse shadow-md shadow-[#7632ff]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* RECENT CHAT VIEWS */}
        <div className="mt-6 flex-grow overflow-hidden flex flex-col justify-end">
          <div className="w-full h-[1px] bg-neutral-900/60 px-3 mb-5" />
          
          {/* HEADER (ONLY VISIBLE ON HOVER STATE) */}
          <div className="h-6 flex items-center justify-between px-5 mb-3.5 overflow-hidden">
            <span
              className={`text-[10px] font-extrabold tracking-widest text-neutral-500 uppercase whitespace-nowrap duration-200 transition-opacity ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            >
              최근 나눈 대화
            </span>
            <button
              onClick={() => onNavigate("chat")}
              className={`text-[10px] font-extrabold text-[#b3adff] hover:text-white transition-opacity duration-200 whitespace-nowrap ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            >
              전체보기
            </button>
          </div>

          {/* CHAT ROW LIST (DYNAMIC COMPACT OR DETAILED ROW) */}
          <div className="flex flex-col gap-1.5 px-2.5 overflow-hidden">
            {recentChats.map(({ character, lastMessage }) => (
              <button
                key={character.id}
                onClick={() => onSelectCharacterToChat(character.id)}
                className={`w-full flex items-center rounded-xl p-2.5 transition-all outline-none duration-200 text-left cursor-pointer ${
                  isHovered ? "hover:bg-[#09090b]/80" : "hover:scale-105"
                }`}
              >
                {/* AVATAR CIRCLE */}
                <div className="relative shrink-0">
                  <div className="w-[36px] h-[36px] rounded-full overflow-hidden border border-neutral-800 ring-2 ring-transparent group-hover:ring-[#7632ff]/40 duration-200 shadow-md">
                    <img
                      src={character.avatar}
                      alt={character.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-[2px] ring-[#020202]"></span>
                </div>

                {/* TEXT LAYER FOR HOVER STATE */}
                <div
                  className={`ml-3 flex-grow min-w-0 transition-opacity duration-200 ${
                    isHovered ? "opacity-100" : "opacity-0 pointer-events-none absolute"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white tracking-tight leading-none block truncate w-[100px] select-none">
                      {character.name}
                    </span>
                    <MoreVertical className="w-3 h-3 text-neutral-600 hover:text-white transition-colors" />
                  </div>
                  <span className="text-[10px] text-neutral-400 tracking-tight leading-normal block truncate w-[140px] mt-1 select-none font-medium">
                    {lastMessage}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
