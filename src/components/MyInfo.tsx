import React, { useState } from "react";
import { User, CreditCard, Coins, Check, RefreshCw, Heart, MessageCircle, Star, Terminal } from "lucide-react";
import { UserState } from "../types";
import { motion } from "motion/react";

interface MyInfoProps {
  userState: UserState;
  onUpdateUserState: (state: UserState) => void;
}

export default function MyInfo({ userState, onUpdateUserState }: MyInfoProps) {
  const [nicknameInput, setNicknameInput] = useState(userState.nickname);
  const [successSaved, setSuccessSaved] = useState(false);

  const handleSaveNickname = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nicknameInput.trim()) return;
    onUpdateUserState({
      ...userState,
      nickname: nicknameInput.trim()
    });
    setSuccessSaved(true);
    setTimeout(() => setSuccessSaved(false), 2000);
  };

  const handleChargeFreeCurrency = () => {
    onUpdateUserState({
      ...userState,
      coins: userState.coins + 100,
      tickets: userState.tickets + 100
    });
    alert("🎁 매일 드리는 일일 선물로 100 코인과 100 챗티켓 충전이 완료되었습니다!");
  };

  const handleSafetyToggle = () => {
    onUpdateUserState({
      ...userState,
      unlockedAdult: !userState.unlockedAdult
    });
  };

  return (
    <div className="w-full max-w-[800px] mx-auto px-4 py-6 md:py-10 select-none pb-24 text-white">
      
      {/* Page Title */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 rounded-xl bg-[#7632ff]/10 text-[#7632ff]">
          <User className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight">내 정보 및 설정</h1>
          <p className="text-sm text-neutral-400 mt-1">닉네임 편집, 안전 설정 관리, 충전 잔액 및 보관함을 조율합니다</p>
        </div>
      </div>

      <div className="space-y-6">
        
        {/* Profile Card & Nickname customizer */}
        <div className="bg-[#141416] p-5 md:p-6 rounded-2xl border border-neutral-800/60 shadow-xl">
          <h3 className="font-extrabold text-sm md:text-base text-neutral-200 mb-4">독자 프로필 정보</h3>
          <form onSubmit={handleSaveNickname} className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={nicknameInput}
                onChange={(e) => setNicknameInput(e.target.value)}
                placeholder="새 닉네임을 입력하세요"
                maxLength={10}
                className="w-full h-11 bg-neutral-900 border border-neutral-800 rounded-xl px-4 text-xs md:text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-[#7632ff]"
              />
            </div>
            <button
              type="submit"
              disabled={!nicknameInput.trim() || nicknameInput.trim() === userState.nickname}
              className="h-11 px-5 bg-neutral-800 hover:bg-[#7632ff] hover:text-white text-neutral-300 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-lg active:scale-95 transition-all disabled:opacity-40 disabled:scale-100 disabled:cursor-not-allowed cursor-pointer"
            >
              {successSaved ? <Check className="w-3.5 h-3.5 text-green-400 animate-bounce" /> : null}
              <span>{successSaved ? "저장됨" : "저장"}</span>
            </button>
          </form>
          {successSaved && <p className="text-[10px] text-green-400 mt-1 px-1">닉네임이 성공적으로 반영되었습니다!</p>}
        </div>

        {/* Currency summary card */}
        <div className="bg-[#151518] p-5 md:p-6 rounded-2xl border border-neutral-800/60 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-sm md:text-base text-neutral-200">내 영웅 상점 잔고</h3>
            <span className="text-[10px] text-[#7632ff] font-bold bg-[#7632ff]/10 border border-[#7632ff]/20 px-2 py-0.5 rounded-full uppercase">VIP Balance</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#222]/50 p-4 rounded-xl border border-[#303030]/60 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-neutral-500 block font-medium">유료/충전 자산</span>
                <span className="text-[#3a5cff] font-extrabold text-lg md:text-xl font-mono mt-1 inline-block">{userState.coins}</span>
                <span className="text-xs text-neutral-400 font-semibold ml-1.5">코인</span>
              </div>
              <Coins className="w-6 h-6 text-[#3a5cff]/30" />
            </div>

            <div className="bg-[#222]/50 p-4 rounded-xl border border-[#303030]/60 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-neutral-500 block font-medium">대화 무료 영웅 티켓</span>
                <span className="text-[#7632ff] font-extrabold text-lg md:text-xl font-mono mt-1 inline-block">{userState.tickets}</span>
                <span className="text-xs text-neutral-400 font-semibold ml-1.5">티켓</span>
              </div>
              <CreditCard className="w-6 h-6 text-[#7632ff]/30" />
            </div>
          </div>

          <button
            onClick={handleChargeFreeCurrency}
            className="w-full mt-4 h-12 bg-neutral-900 border border-neutral-800 hover:border-[#7632ff]/30 rounded-xl font-bold text-xs text-[#ccc] hover:text-white flex items-center justify-center gap-1.5 transition-all text-neutral-300 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-neutral-500 animate-spin-slow" />
            <span>지원 보급품 수령 (무료 100 코인 & 티켓 충전)</span>
          </button>
        </div>

        {/* Safety Filter Toggle Card */}
        <div className="bg-[#141416] p-5 md:p-6 rounded-2xl border border-neutral-800/60 shadow-xl flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-sm md:text-base text-neutral-200">성인 소설 컨텐츠 활성화</h3>
            <p className="text-[11px] text-neutral-400 mt-1 max-w-[280px] md:max-w-md">당당하고 수위가 높은 원작 시나리오의 성인 캐릭터 및 19세 웹소설 세계관을 보드에 필터링합니다.</p>
          </div>
          <button
            onClick={handleSafetyToggle}
            className={`relative w-14 h-7 rounded-full p-1 cursor-pointer transition-colors duration-300 ${
              userState.unlockedAdult ? "bg-[#ff3a54]" : "bg-neutral-700"
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                userState.unlockedAdult ? "translate-x-7" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Informative Stats */}
        <div className="bg-[#141416]/50 p-5 md:p-6 rounded-2xl border border-neutral-800/60 shadow-xl">
          <h3 className="font-extrabold text-sm md:text-base text-neutral-200 mb-4">내 활동 기록 분석</h3>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-neutral-900/60 rounded-xl border border-neutral-850">
              <MessageCircle className="w-4 h-4 mx-auto text-[#7632ff] mb-1.5" />
              <span className="text-[10px] text-neutral-500 block font-medium">대화 수</span>
              <span className="text-sm font-bold mt-0.5 inline-block text-neutral-300 font-mono">14건</span>
            </div>
            <div className="p-3 bg-neutral-900/60 rounded-xl border border-neutral-850">
              <Star className="w-4 h-4 mx-auto text-[#3a5cff] mb-1.5" />
              <span className="text-[10px] text-neutral-500 block font-medium">마이 즐겨찾기</span>
              <span className="text-sm font-bold mt-0.5 inline-block text-neutral-300 font-mono">{userState.favorites.length}개</span>
            </div>
            <div className="p-3 bg-neutral-900/60 rounded-xl border border-neutral-850">
              <Heart className="w-4 h-4 mx-auto text-red-500 mb-1.5" />
              <span className="text-[10px] text-neutral-500 block font-medium">인기 호감 추천</span>
              <span className="text-sm font-bold mt-0.5 inline-block text-neutral-300 font-mono">137회</span>
            </div>
          </div>
        </div>

        {/* Disclaimer terms footer */}
        <div className="p-4 bg-neutral-900/10 border border-neutral-900 rounded-xl text-neutral-500 text-[10px] md:text-xs leading-relaxed font-mono flex gap-2">
          <Terminal className="w-4 h-4 text-neutral-600 shrink-0 mt-0.5" />
          <span>
            본 시뮬레이션 클론 웹 서비스는 원 소설 및 작화 저작권을 보유한 메타크래프트(노벨피아) 플랫폼의 인터페이스 레이아웃을 바탕으로 기틀을 마련해 만든 비공식 웹 데모 플랫폼입니다.
          </span>
        </div>

      </div>
    </div>
  );
}
