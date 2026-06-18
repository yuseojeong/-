import React from "react";
import { X, Settings, Coins, CreditCard, Heart, Star, Trophy, LogOut, RefreshCw, EyeOff, Eye } from "lucide-react";
import { UserState } from "../types";

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  userState: UserState;
  onUpdateUserState: (state: UserState) => void;
  onNavigate: (view: "home" | "chat" | "ranking" | "search" | "myinfo") => void;
}

export default function SideMenu({ isOpen, onClose, userState, onUpdateUserState, onNavigate }: SideMenuProps) {
  const toggleAdultMode = () => {
    onUpdateUserState({
      ...userState,
      unlockedAdult: !userState.unlockedAdult
    });
  };

  const rechargeCoins = () => {
    const updated = {
      ...userState,
      coins: userState.coins + 50,
      tickets: userState.tickets + 20
    };
    onUpdateUserState(updated);
    alert("🎉 50 코인과 20 챗티켓 충전이 완료되었습니다!");
  };

  const handleResetData = () => {
    if (confirm("정말 전체 데이터를 초기화하시겠습니까? (설정, 코인 및 채팅 기록이 초기화됩니다)")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[250] overflow-hidden select-none">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-[4px] transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Slide-in Drawer from Left */}
      <div className="absolute top-0 left-0 bottom-0 w-[82%] sm:w-[320px] bg-[#0d0d0f]/98 border-r border-[#1a1a1e] shadow-[12px_0_50px_rgba(0,0,0,0.85)] flex flex-col justify-between animate-in slide-in-from-left duration-300 text-[#eee] p-5 pb-8 z-[251] overflow-y-auto scrollbar-none">
        
        <div className="flex flex-col gap-6">
          {/* Header Controls */}
          <div className="flex items-center justify-between border-b border-neutral-900/60 pb-3">
            <span className="text-[10px] font-black tracking-widest text-[#7c6cff] uppercase">
              NOVELPIA NAVIGATOR
            </span>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Section 1: 내 프로필 (My Profile) */}
          <div className="flex flex-col gap-3.5 bg-neutral-950/40 border border-neutral-900/50 rounded-2xl p-4">
            <span className="text-[10px] font-black tracking-wider text-neutral-400">👤 내 프로필</span>
            
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full bg-gradient-to-tr from-[#3a5cff] via-[#6f3bff] to-[#a026ff] p-[1.5px] shadow-md flex-shrink-0">
                <div className="w-full h-full bg-[#18181b] rounded-full overflow-hidden flex items-center justify-center border border-white/5">
                  <svg className="w-7 h-7 text-neutral-400 mt-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-extrabold text-[15px] text-white truncate font-sans">
                  {userState.nickname}
                </h4>
                <p className="text-[10px] text-neutral-500 mt-0.5">인공지능 대화 플랫폼 멤버</p>
              </div>
            </div>

            <button
              onClick={() => {
                onNavigate("myinfo");
                onClose();
              }}
              className="w-full mt-1.5 h-9 bg-neutral-900 hover:bg-neutral-800 active:scale-[0.98] transition-all rounded-lg text-[11.5px] font-black text-neutral-300 hover:text-white flex items-center justify-center gap-1.5 border border-neutral-800"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>프로필 및 설정 편집</span>
            </button>
          </div>

          {/* Section 2: 노벨피아 바로가기 (Novelpia shortcut brand banner) */}
          <a
            href="https://novelpia.com"
            target="_blank"
            rel="noopener noreferrer"
            referrerPolicy="no-referrer"
            onClick={onClose}
            className="group relative flex flex-col gap-1.5 bg-gradient-to-r from-[#170a30] to-[#0a122c] border border-[#7d6cff]/20 hover:border-[#7d6cff]/40 rounded-2xl p-4 shadow-xl transition-all hover:-translate-y-0.5 duration-200 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-tr from-[#691eff] to-[#9156ff] rounded-[6px] flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path 
                      d="M17.5 4.5C14.5 4.5 11 7.2 9.5 10.5C9.5 10.5 8 12 7.5 13.5C7.5 11 8.5 8.5 9 6.5C7 7.5 5 10 5 13.5C5 17.5 8 19.5 11.5 19.5C15 19.5 18.5 17 19.5 13C20.5 9 19.5 6 17.5 4.5Z" 
                      fill="currentColor" 
                    />
                  </svg>
                </div>
                <span className="text-xs font-black text-white group-hover:text-[#a094ff] transition-colors">
                  노벨피아 공식 웹사이트
                </span>
              </div>
              <span className="text-[10px] text-neutral-500 font-bold group-hover:text-neutral-300 transition-colors">바로가기 ↗</span>
            </div>
            <p className="text-[10.5px] text-neutral-400 font-medium leading-normal">
              다양한 오리지널 웹소설과 독점 연재작을 감상하고 다른 차원의 문을 열어보세요.
            </p>
          </a>

          {/* Held Currency / Settings Settings */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-black tracking-wider text-neutral-400 px-1 font-sans">💎 내 재화 설정</span>
            <div className="flex gap-2">
              <div className="flex-1 bg-[#121215] rounded-xl p-3 border border-neutral-900/60 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 font-extrabold font-sans">
                  <img src="//images.novelpia.com/img/new/chat/sidemenu/icon-coin_.svg" alt="코인" className="w-3.5 h-3.5 object-contain" referrerPolicy="no-referrer" />
                  <span>코인</span>
                </div>
                <div className="font-extrabold text-[#3a5cff] font-mono text-xs">{userState.coins}</div>
              </div>
              <div className="flex-1 bg-[#121215] rounded-xl p-3 border border-neutral-900/60 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 font-extrabold font-sans">
                  <img src="//images.novelpia.com/img/new/chat/icon_chat_ticket.svg" alt="챗티켓" className="w-3.5 h-3.5 object-contain" referrerPolicy="no-referrer" />
                  <span>티켓</span>
                </div>
                <div className="font-extrabold text-[#7632ff] font-mono text-xs">{userState.tickets}</div>
              </div>
            </div>

            <button
              onClick={rechargeCoins}
              className="w-full h-[40px] bg-[#131b33] hover:bg-[#1a2546] active:scale-[0.99] transition-all rounded-xl font-bold text-xs text-sky-400 flex items-center justify-center cursor-pointer border border-[#1a2d5e]/40"
            >
              <span>맛보기 재화 충전하기</span>
            </button>
          </div>

          {/* Section 3: Safe Filter Safety Settings */}
          <div className="flex flex-col gap-2 bg-neutral-950/20 border border-neutral-900/40 rounded-xl p-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black tracking-wider text-neutral-400 font-sans">🔞 필터링 설정</span>
              <button
                onClick={toggleAdultMode}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all font-black text-[11px] cursor-pointer ${
                  userState.unlockedAdult
                    ? "bg-[#6d4aff] text-white"
                    : "bg-neutral-900 text-neutral-400 border border-neutral-800"
                }`}
              >
                <span>성인 전용 해제</span>
                <div className={`w-2 h-2 rounded-full ${userState.unlockedAdult ? "bg-emerald-400 animate-pulse" : "bg-neutral-600"}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Logout (Reset) Button */}
        <div className="mt-8 pt-4 border-t border-neutral-900/40 w-full flex justify-center">
          <button
            onClick={handleResetData}
            className="w-full h-[38px] bg-neutral-950/40 hover:bg-rose-950/10 hover:text-rose-400 border border-transparent hover:border-rose-950/40 rounded-xl font-bold text-xs text-neutral-500 flex items-center justify-center cursor-pointer transition-colors"
          >
            <span>전체 데이터 초기화</span>
          </button>
        </div>

      </div>
    </div>
  );
}
