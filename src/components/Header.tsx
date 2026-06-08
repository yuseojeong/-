import React from "react";
import { Menu, Settings, Coins, CreditCard, User, Heart } from "lucide-react";
import { UserState } from "../types";

interface HeaderProps {
  userState: UserState;
  onOpenMenu: () => void;
  onNavigate: (view: "home" | "chat" | "ranking" | "favorite" | "myinfo") => void;
  activeView: string;
  onUpdateUserState: (updated: UserState) => void;
}

export default function Header({ userState, onOpenMenu, onNavigate, activeView, onUpdateUserState }: HeaderProps) {
  const handleToggleAdult = () => {
    onUpdateUserState({
      ...userState,
      unlockedAdult: !userState.unlockedAdult
    });
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-[64px] md:h-[90px] bg-[#020202]/90 backdrop-blur-[10px] border-b border-[#222]/60 z-[101] flex justify-center select-none transition-colors duration-200">
      <div className="w-full max-w-[1240px] h-full flex justify-between items-center px-4 md:px-[20px]">
        {/* Left Section - Logo */}
        <div className="flex items-center gap-3">
          <div className="block cursor-pointer shrink-0" onClick={() => onNavigate("home")}>
            <img
              src="//images.novelpia.com/img/new/chat/chatple_logo.svg"
              alt="메타크래프트 로고"
              draggable="false"
              className="w-[100px] md:w-[124px]"
              onError={(e) => {
                // If CDN image fails, show elegant text logo
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          </div>
          <span className="h-4 w-[1px] bg-[#333] hidden md:inline-block"></span>
          <div className="cursor-pointer flex items-center" onClick={() => onNavigate("home")}>
            <div className="flex items-center gap-1.5 md:gap-2">
              <span className="font-extrabold text-[15px] md:text-xl tracking-wider text-white bg-gradient-to-r from-[#7632ff] to-[#3a5cff] bg-clip-text text-transparent">
                노벨챗
              </span>
              <span className="text-[9px] md:text-[10px] bg-[#7632ff]/20 text-[#7632ff] border border-[#7632ff]/30 px-1.5 py-0.5 rounded-full font-semibold hidden md:inline">
                Beta
              </span>
            </div>
          </div>
        </div>

        {/* Center Navigation Shortcuts for Desktop */}
        <nav className="hidden lg:flex items-center gap-8 text-base font-semibold text-neutral-300">
          <button
            onClick={() => onNavigate("home")}
            className={`cursor-pointer hover:text-white transition-all py-2 ${
              activeView === "home" ? "text-white border-b-2 border-[#7632ff] font-black" : ""
            }`}
          >
            홈
          </button>
          <button
            onClick={() => onNavigate("chat")}
            className={`cursor-pointer hover:text-white transition-all py-2 ${
              activeView === "chat" ? "text-white border-b-2 border-[#7632ff] font-black" : ""
            }`}
          >
            채팅
          </button>
          <button
            onClick={() => onNavigate("ranking")}
            className={`cursor-pointer hover:text-white transition-all py-2 ${
              activeView === "ranking" ? "text-white border-b-2 border-[#7632ff] font-black" : ""
            }`}
          >
            랭킹
          </button>
          <button
            onClick={() => onNavigate("favorite")}
            className={`cursor-pointer hover:text-white transition-all py-2 ${
              activeView === "favorite" ? "text-white border-b-2 border-[#7632ff] font-black" : ""
            }`}
          >
            즐겨찾기
          </button>
        </nav>

        {/* Right Section - Profile and Balance Summary & Menu trigger */}
        <div className="flex items-center gap-2 md:gap-3.5">
          {/* 19+ Adult content toggle */}
          <button
            onClick={handleToggleAdult}
            className={`cursor-pointer rounded-full border px-2.5 md:px-3 py-1 md:py-1.5 flex items-center gap-1.5 transition-all duration-300 ${
              userState.unlockedAdult
                ? "border-[#ff3a54]/40 bg-[#ff3a54]/12 text-[#ff3a54] font-black shadow-[0_0_12px_rgba(255,58,84,0.15)] hover:bg-[#ff3a54]/18"
                : "border-neutral-800 bg-[#141416] text-neutral-400 font-bold hover:text-[#ccc] hover:border-neutral-700 hover:bg-[#1c1c1e]"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full animate-pulse shrink-0 ${
              userState.unlockedAdult ? "bg-[#ff3a54]" : "bg-neutral-500"
            }`}></span>
            <span className="text-xs md:text-sm tracking-tight font-extrabold">
              <span className="hidden sm:inline">성인 </span>19+
            </span>
            <span className={`text-[9px] md:text-[10px] px-1 py-0.2 rounded font-black ${
              userState.unlockedAdult ? "bg-[#ff3a54]/20 text-[#ff3a54]" : "bg-neutral-800 text-neutral-500"
            }`}>
              {userState.unlockedAdult ? "ON" : "OFF"}
            </span>
          </button>

          {/* Quick Balance Summary for Desktop */}
          <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#111] border border-[#222]">
            <div className="flex items-center gap-1 text-xs text-[#999]">
              <Coins className="w-3.5 h-3.5 text-[#3a5cff]" />
              <span className="font-semibold text-white">{userState.coins}</span>
              <span className="text-[10px]">코인</span>
            </div>
            <span className="w-[1px] h-3 bg-[#333]"></span>
            <div className="flex items-center gap-1 text-xs text-[#999]">
              <CreditCard className="w-3.5 h-3.5 text-[#7632ff]" />
              <span className="font-semibold text-white">{userState.tickets}</span>
              <span className="text-[10px]">티켓</span>
            </div>
          </div>

          {/* User Profile Avatar with Slide Menu trigger */}
          <button
            onClick={onOpenMenu}
            className="hidden md:flex group relative items-center p-0.5 rounded-full border border-neutral-700/50 hover:border-[#7632ff]/60 transition-all duration-300"
            id="user-profile-trigger"
          >
            <div className="relative w-8 h-8 md:w-9 md:h-9 bg-gradient-to-tr from-[#3a5cff] to-[#28f5b4] p-[1.5px] rounded-full overflow-hidden">
              <div className="w-full h-full bg-[#171717] rounded-full flex items-center justify-center text-white">
                <User className="w-4 h-4 text-neutral-300 group-hover:text-white transition-colors" />
              </div>
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#7632ff] rounded-full ring-1 ring-black animate-pulse"></span>
          </button>

          {/* Mobile Menu trigger removed as requested */}
        </div>
      </div>
    </header>
  );
}
