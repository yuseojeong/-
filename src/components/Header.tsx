import React from "react";
import { Menu, Settings, Coins, CreditCard, User, Heart, Store } from "lucide-react";
import { UserState } from "../types";

interface HeaderProps {
  userState: UserState;
  onOpenMenu: () => void;
  onNavigate: (view: "home" | "chat" | "ranking" | "search" | "myinfo") => void;
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
    <header className="fixed top-0 left-0 right-0 md:left-[76px] h-[60px] md:h-[90px] bg-[#020202]/95 backdrop-blur-[12px] border-b border-[#222]/50 z-[101] flex justify-center select-none transition-all duration-300">
      <div className="w-full h-full">
        
        {/* MOBILE HEADER (md:hidden) */}
        <div className="flex md:hidden w-full h-full justify-between items-center px-4">
          {/* Hamburger Menu Button on Left */}
          <button
            onClick={onOpenMenu}
            className="p-2 -ml-1 hover:bg-neutral-800/60 active:bg-neutral-800 rounded-xl text-neutral-400 hover:text-white transition-all cursor-pointer active:scale-95 z-50"
            title="상세 메뉴"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Center-Left Brand Title Row (Without '노벨피아' text) */}
          <div className="flex items-center gap-1.5 cursor-pointer ml-1 flex-1 pl-2" onClick={() => onNavigate("home")}>
            <span className="text-[#00e5ff] font-black tracking-tight text-[17px] font-sans">노벨챗</span>
            
            {/* Pointy Speech Bubble 'Chat' Badge */}
            <div className="relative inline-flex items-center ml-0.5 bg-white text-[#00cbd6] font-black text-[8px] px-1.5 py-0.5 rounded-[6px] shadow-sm leading-none select-none">
              <span>Chat</span>
              <div className="absolute left-[3px] -bottom-[3px] w-0 h-0 border-t-[4px] border-t-white border-r-[4px] border-r-transparent"></div>
            </div>
          </div>

          {/* Right Area for Mobile Header (Ticket Pill & Store Icon Button) */}
          <div className="flex items-center gap-2">
            {/* Mobile Chat Ticket Pill */}
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#111] border border-[#222]">
              <img src="//images.novelpia.com/img/new/chat/icon_chat_ticket.svg" alt="챗티켓" className="w-4 h-4 object-contain shrink-0" referrerPolicy="no-referrer" />
              <span className="text-xs font-bold text-white select-none">{userState.tickets}</span>
            </div>

            {/* Shop/Store Button */}
            <button
              onClick={onOpenMenu}
              className="p-1 px-1.5 hover:bg-neutral-800/50 active:bg-neutral-800 rounded-lg text-neutral-400 hover:text-[#00cbd6] transition-colors cursor-pointer active:scale-95 flex items-center justify-center shrink-0"
              title="상점"
            >
              <Store className="w-5 h-5" />
            </button>
          </div>
        </div>


        {/* DESKTOP HEADER (hidden md:flex) */}
        <div className="hidden md:flex w-full h-full justify-between items-center px-8">
          {/* Left Section */}
          <div className="flex items-center gap-3">
            <div className="cursor-pointer flex items-center" onClick={() => onNavigate("home")}>
              <div className="flex items-center gap-2">
                {/* Maintained empty as previously requested, or clean branded logo */}
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3.5">
            <div className="sm:flex items-center gap-3.5 px-4.5 py-1.5 rounded-full bg-[#111] border border-[#222]">
              <div className="flex items-center gap-1.5 text-base text-[#999]">
                <img src="//images.novelpia.com/img/new/chat/sidemenu/icon-coin_.svg" alt="코인" className="w-5 h-5 object-contain" referrerPolicy="no-referrer" />
                <span className="font-semibold text-white">{userState.coins}</span>
                <span className="text-xs text-neutral-400">코인</span>
              </div>
              <span className="w-[1px] h-4 bg-[#333]"></span>
              <div className="flex items-center gap-1.5 text-base text-[#999]">
                <img src="//images.novelpia.com/img/new/chat/icon_chat_ticket.svg" alt="챗티켓" className="w-5 h-5 object-contain" referrerPolicy="no-referrer" />
                <span className="font-semibold text-white">{userState.tickets}</span>
                <span className="text-xs text-neutral-400">티켓</span>
              </div>
            </div>

            <button
              onClick={onOpenMenu}
              className="group relative items-center p-0.5 rounded-full border border-neutral-700/50 hover:border-[#7632ff]/60 transition-all duration-300"
              id="user-profile-trigger"
            >
              <div className="relative w-9 h-9 bg-gradient-to-tr from-[#3a5cff] to-[#28f5b4] p-[1.5px] rounded-full overflow-hidden">
                <div className="w-full h-full bg-[#171717] rounded-full flex items-center justify-center text-white">
                  <User className="w-4 h-4 text-neutral-300 group-hover:text-white transition-colors" />
                </div>
              </div>
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#7632ff] rounded-full ring-1 ring-black animate-pulse"></span>
            </button>
          </div>
        </div>

      </div>
    </header>
  );
}

