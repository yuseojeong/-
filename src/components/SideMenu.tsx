import React from "react";
import { X, Settings, Coins, CreditCard, Heart, Star, Trophy, LogOut, RefreshCw, EyeOff, Eye } from "lucide-react";
import { UserState } from "../types";

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  userState: UserState;
  onUpdateUserState: (state: UserState) => void;
  onNavigate: (view: "home" | "explore" | "chat" | "ranking" | "favorite" | "myinfo") => void;
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
        className="absolute inset-0 bg-black/45 backdrop-blur-[4px] transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Far-Right Dropdown Modal Popup */}
      <div className="absolute top-[72px] right-4 md:top-[96px] md:right-8 w-[calc(100%-32px)] sm:w-full sm:max-w-[380px] bg-[#121214] border border-[#232326] rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.75)] flex flex-col justify-between animate-in fade-in slide-in-from-top-6 duration-250 text-[#eee] p-6 z-[251]">
        
        {/* Header Controls */}
        <div className="flex items-center justify-between pb-4">
          {/* Adult Safe Filter Setting Toggle (19+) pill on Left */}
          <button
            onClick={toggleAdultMode}
            className={`relative px-3.5 py-1.5 rounded-full flex items-center gap-2 transition-all duration-300 font-extrabold text-[12px] cursor-pointer ${
              userState.unlockedAdult
                ? "bg-[#714fff] text-white"
                : "bg-neutral-800 text-neutral-400 border border-neutral-700/60"
            }`}
          >
            <span>성인</span>
            <div className={`w-3.5 h-3.5 rounded-full bg-white transition-all transform shadow ${
              userState.unlockedAdult ? "translate-x-0 bg-white" : "opacity-40"
            }`} />
          </button>

          {/* General Actions on Right (Settings & Close) */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onNavigate("myinfo");
                onClose();
              }}
              className="p-1.5 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white transition-colors cursor-pointer"
              title="내 정보 설정"
            >
              <Settings className="w-[18px] h-[18px]" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Profile Section */}
        <div className="flex items-center gap-3.5 mt-3 px-1">
          <div className="relative w-[68px] h-[68px] rounded-full bg-gradient-to-tr from-[#3a5cff] via-[#6f3bff] to-[#a026ff] p-[2px] shadow-lg flex-shrink-0">
            <div className="w-full h-full bg-[#18181b] rounded-full overflow-hidden flex items-center justify-center border border-white/5">
              <svg className="w-9 h-9 text-neutral-400 mt-1.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          </div>
          <div>
            <h4 className="font-extrabold text-[22px] text-white tracking-tight leading-none font-sans">
              {userState.nickname}
            </h4>
          </div>
        </div>

        {/* Held Currency (코인 / 챗티켓) */}
        <div className="mt-8">
          <div className="text-[11px] font-extrabold text-neutral-400 mb-2.5 px-1 font-sans">보유 재화</div>
          <div className="flex gap-2">
            <div className="flex-1 bg-[#1e1e21] rounded-xl p-3.5 border border-neutral-800/40 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-neutral-300 font-extrabold font-sans">
                <img src="//images.novelpia.com/img/new/chat/sidemenu/icon-coin_.svg" alt="코인" className="w-4 h-4 object-contain" referrerPolicy="no-referrer" />
                <span>코인</span>
              </div>
              <div className="font-extrabold text-[#3a5cff] font-mono text-base">{userState.coins}</div>
            </div>
            <div className="flex-1 bg-[#1e1e21] rounded-xl p-3.5 border border-neutral-800/40 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-neutral-300 font-extrabold font-sans">
                <img src="//images.novelpia.com/img/new/chat/icon_chat_ticket.svg" alt="챗티켓" className="w-4.5 h-4.5 object-contain" referrerPolicy="no-referrer" />
                <span>챗티켓</span>
              </div>
              <div className="font-extrabold text-[#7632ff] font-mono text-base">{userState.tickets}</div>
            </div>
          </div>

          <button
            onClick={rechargeCoins}
            className="w-full mt-3 h-[48px] bg-[#1a284c] hover:bg-[#203464] active:scale-[0.99] transition-all rounded-xl font-bold text-[13px] text-sky-400 flex items-center justify-center cursor-pointer border border-[#1e346b]/40"
          >
            <span>코인 충전하기</span>
          </button>
        </div>



        {/* Logout (Reset) Button */}
        <div className="mt-8 flex justify-center w-full">
          <button
            onClick={handleResetData}
            className="w-full h-11 bg-[#1a1a1c] hover:bg-neutral-800 rounded-xl font-bold text-xs md:text-sm text-neutral-500 hover:text-neutral-300 flex items-center justify-center cursor-pointer transition-colors"
          >
            <span>로그아웃</span>
          </button>
        </div>

      </div>
    </div>
  );
}
