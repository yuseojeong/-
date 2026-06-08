import React from "react";
import { Menu, Settings, Coins, CreditCard, User, Heart } from "lucide-react";
import { UserState } from "../types";

interface HeaderProps {
  userState: UserState;
  onOpenMenu: () => void;
  onNavigate: (view: "home" | "explore" | "chat" | "ranking" | "favorite" | "myinfo") => void;
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
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate("home")}>
            {/* Novelpia Logo Brand Icon - Purple gradient with custom aesthetic vector */}
            <div className="w-8 h-8 bg-gradient-to-tr from-[#691eff] to-[#9156ff] rounded-[9px] flex items-center justify-center shadow-[0_3px_10px_rgba(118,50,255,0.35)]">
              <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Custom stylized wing icon */}
                <path 
                  d="M17.5 4.5C14.5 4.5 11 7.2 9.5 10.5C9.5 10.5 8 12 7.5 13.5C7.5 11 8.5 8.5 9 6.5C7 7.5 5 10 5 13.5C5 17.5 8 19.5 11.5 19.5C15 19.5 18.5 17 19.5 13C20.5 9 19.5 6 17.5 4.5Z" 
                  fill="currentColor" 
                />
                <path 
                  d="M14.5 9.5C13 11 11.5 12.5 11.5 14C11.5 15 12.2 15.5 13 15.5C14 15.5 15 14.5 15.5 13.5C15.5 14.5 14.5 15.5 14 16C13.2 16.8 11.5 17.5 10.5 16.5C9.8 15.8 9.5 14.5 10 13C10.5 11.5 12.5 9.5 14.5 9.5Z" 
                  fill="currentColor" 
                  className="opacity-75"
                />
              </svg>
            </div>

            {/* Brand Title Row */}
            <div className="flex items-center gap-1.5 ml-1">
              <span className="text-white font-black tracking-tight text-base font-sans">노벨피아</span>
              <span className="text-neutral-700 font-normal text-sm opacity-80 pointer-events-none select-none">|</span>
              <span className="text-[#00e5ff] font-black tracking-tight text-base font-sans">노벨챗</span>
              
              {/* Pointy Speech Bubble 'Chat' Badge */}
              <div className="relative inline-flex items-center ml-1 bg-white text-[#00cbd6] font-black text-[9px] px-2 py-0.5 rounded-[7px] shadow-[0_2px_4px_rgba(0,0,0,0.15)] leading-none select-none">
                <span>Chat</span>
                {/* Speech Bubble Arrow Indicator */}
                <div className="absolute left-[3px] -bottom-[4px] w-0 h-0 border-t-[5px] border-t-white border-r-[5px] border-r-transparent"></div>
              </div>
            </div>
          </div>

          {/* Glowing Gradient Profile Ring Trigger for Mobile */}
          <button
            onClick={onOpenMenu}
            className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-[#3a5cff] via-[#02e2f4] to-[#7632ff] flex items-center justify-center hover:scale-[1.03] active:scale-95 transition-all duration-300"
          >
            <div className="w-full h-full rounded-full bg-[#171719] overflow-hidden flex items-center justify-center">
              <svg className="w-5 h-5 text-neutral-400 fill-current" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          </button>
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

