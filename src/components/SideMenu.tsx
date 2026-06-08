import React from "react";
import { X, Settings, Coins, CreditCard, Heart, Star, Trophy, MessageSquare, LogOut, RefreshCw, EyeOff, Eye } from "lucide-react";
import { UserState } from "../types";

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  userState: UserState;
  onUpdateUserState: (state: UserState) => void;
  onNavigate: (view: "home" | "chat" | "ranking" | "favorite" | "myinfo") => void;
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
    <div className="fixed inset-0 z-[200] overflow-hidden select-none">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="absolute top-0 right-0 bottom-0 w-full max-w-[380px] bg-[#171717] border-l border-[#303030] shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-350 ease-out text-[#eee]">
        
        {/* Upper wrapper panel */}
        <div className="p-5 md:p-6 overflow-y-auto flex-1 scroll-none">
          
          {/* Header Controls */}
          <div className="flex items-center justify-end pb-4 border-b border-[#303030]">
            {/* General Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onNavigate("myinfo");
                  onClose();
                }}
                className="p-2 rounded-lg bg-neutral-800 hover:bg-[#222] transition-colors cursor-pointer"
                title="내 정보 설정"
              >
                <Settings className="w-4 h-4 text-neutral-300" />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-lg bg-neutral-800 hover:bg-[#222] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 text-neutral-300" />
              </button>
            </div>
          </div>

          {/* Profile Section */}
          <div className="flex items-center gap-4 mt-6">
            <div className="relative w-[60px] h-[60px] rounded-full bg-gradient-to-tr from-[#3a5cff] to-[#28f5b4] p-0.5 shadow-lg">
              <div className="w-full h-full bg-[#111] rounded-full overflow-hidden flex items-center justify-center">
                <span className="text-xl font-bold text-white">{userState.nickname.slice(0, 1)}</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-lg text-white">{userState.nickname}</h4>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-1.5 py-0.2 rounded-full">
                  플래티넘 독자
                </span>
              </div>
              <p className="text-xs text-[#999] mt-0.5">NovelChat Premium Member</p>
            </div>
          </div>

          {/* Held Currency (코인 / 챗티켓) */}
          <div className="mt-8">
            <div className="text-xs font-semibold text-[#888] mb-2.5">내 보유 자산</div>
            <div className="flex gap-2">
              <div className="flex-1 bg-[#222] rounded-xl p-3 border border-[#303030] flex flex-col justify-between h-[75px]">
                <div className="flex items-center gap-1.5 text-xs text-[#999] font-medium">
                  <Coins className="w-4 h-4 text-[#3a5cff]" />
                  <span>코인</span>
                </div>
                <div className="text-right text-base font-bold text-white">{userState.coins} <span className="text-xs font-normal text-[#999]">코인</span></div>
              </div>
              <div className="flex-1 bg-[#222] rounded-xl p-3 border border-[#303030] flex flex-col justify-between h-[75px]">
                <div className="flex items-center gap-1.5 text-xs text-[#999] font-medium">
                  <CreditCard className="w-4 h-4 text-[#7632ff]" />
                  <span>챗티켓</span>
                </div>
                <div className="text-right text-base font-bold text-white">{userState.tickets} <span className="text-xs font-normal text-[#999]">티켓</span></div>
              </div>
            </div>

            <button
              onClick={rechargeCoins}
              className="w-full mt-4 h-12 bg-gradient-to-r from-[#7632ff] to-[#3a5cff] hover:opacity-95 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-1.5 shadow-lg shadow-[#7632ff]/20 active:scale-[0.98] transition-all cursor-pointer"
            >
              <Coins className="w-4 h-4 animate-bounce" />
              <span>무료 코인 충전하기 (+50C)</span>
            </button>
          </div>

          {/* Menu Links */}
          <div className="mt-8 pt-6 border-t border-[#303030]/55 flex flex-col gap-1">
            <button
              onClick={() => {
                onNavigate("chat");
                onClose();
              }}
              className="w-full flex items-center justify-between p-3.5 hover:bg-[#222]/80 rounded-xl transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3 text-neutral-300">
                <MessageSquare className="w-4.5 h-4.5 text-[#7632ff]" />
                <span className="font-semibold text-sm">보유 중인 채팅방</span>
              </div>
              <span className="text-xs font-semibold text-[#999] bg-[#222] px-2 py-0.5 rounded-full">LIVE</span>
            </button>

            <button
              onClick={() => {
                onNavigate("ranking");
                onClose();
              }}
              className="w-full flex items-center justify-between p-3.5 hover:bg-[#222]/80 rounded-xl transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3 text-neutral-300">
                <Trophy className="w-4.5 h-4.5 text-yellow-500" />
                <span className="font-semibold text-sm">실시간 월드 랭킹</span>
              </div>
            </button>

            <button
              onClick={() => {
                onNavigate("favorite");
                onClose();
              }}
              className="w-full flex items-center justify-between p-3.5 hover:bg-[#222]/80 rounded-xl transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3 text-neutral-300">
                <Star className="w-4.5 h-4.5 text-[#3a5cff]" />
                <span className="font-semibold text-sm">내 즐겨찾기</span>
              </div>
            </button>
          </div>
        </div>

        {/* Bottom wrapper panel */}
        <div className="p-5 md:p-6 bg-[#111] border-t border-[#303030] flex flex-col gap-2.5">
          <button
            onClick={handleResetData}
            className="w-full h-11 bg-neutral-800 hover:bg-neutral-700/80 rounded-xl font-medium text-xs text-neutral-400 flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-neutral-500" />
            <span>임시 데이터 전체 초기화</span>
          </button>
          <div className="text-center text-[10px] text-neutral-600">
            Copyright © 노벨피아 2026. All Rights Reserved.
          </div>
        </div>

      </div>
    </div>
  );
}
