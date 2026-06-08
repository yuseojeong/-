import React, { useState, useEffect } from "react";
import { Character, UserState } from "../types";
import { Award, Trophy, Eye, MessageSquare, Heart, Play, HelpCircle } from "lucide-react";
import { getAvatarColor, getGenreKorean } from "../utils";
import { motion } from "motion/react";

interface RankingProps {
  characters: Character[];
  userState: UserState;
  onSelectCharacter: (charId: string) => void;
}

export default function Ranking({ characters, userState, onSelectCharacter }: RankingProps) {
  const [sortedCharacters, setSortedCharacters] = useState<Character[]>([]);
  const [activeTab, setActiveTab] = useState<"views" | "chats" | "likes">("chats");
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Parse values to floats for accurate sort
    const parseNumber = (val: string) => {
      let cleaned = val.replace(/K/i, "");
      let parsed = parseFloat(cleaned);
      if (val.toLowerCase().includes("k")) {
        parsed *= 1000;
      }
      return parsed || 0;
    };

    const sorted = [...characters]
      .filter((c) => userState.unlockedAdult || !c.isAdult)
      .sort((a, b) => {
        if (activeTab === "views") return parseNumber(b.views) - parseNumber(a.views);
        if (activeTab === "chats") return parseNumber(b.chats) - parseNumber(a.chats);
        return parseNumber(b.likes) - parseNumber(a.likes);
      });

    setSortedCharacters(sorted);
  }, [characters, activeTab, userState.unlockedAdult]);

  return (
    <div className="w-full max-w-[1240px] mx-auto px-4 md:px-[20px] py-6 md:py-10 select-none pb-24">
      {/* Title & Description Header Text Only */}
      <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-3 border-b border-neutral-900/40">
        <div className="relative z-10 flex flex-col justify-center gap-1">
          <h2 className="text-[#eee] font-black text-xl md:text-3xl tracking-tight leading-none mb-2">실시간 캐릭터 랭킹</h2>
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className="text-sm text-neutral-400 tracking-tight leading-relaxed max-w-none">
              매일 오전 6시에 업데이트됩니다. (5/26~6/8)
            </p>
            <div className="relative inline-block">
              <button
                type="button"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onClick={() => setShowTooltip(!showTooltip)}
                className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all focus:outline-none cursor-pointer"
                aria-label="랭킹 정책 안내"
              >
                <HelpCircle className="w-4 h-4 text-neutral-500 hover:text-[#7632ff] transition-colors" />
              </button>
              
              {showTooltip && (
                <div className="absolute left-0 top-full mt-2 w-72 p-4 bg-[#141416]/95 backdrop-blur border border-neutral-800 rounded-xl shadow-2xl z-50 text-xs text-neutral-300 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="font-extrabold text-[#7632ff] mb-2 flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5" />
                    <span>실시간 랭킹 산정 원칙</span>
                  </div>
                  <ul className="space-y-1.5 leading-relaxed font-medium">
                    <li><strong className="text-white font-semibold">대화 많은 순 :</strong> 캐릭터들과의 대화 로그 수 및 활성 채팅 지수를 반영합니다.</li>
                    <li><strong className="text-white font-semibold">조회 높은 순 :</strong> 상세 정보 방문 횟수 및 탐색 트래픽을 적용합니다.</li>
                    <li><strong className="text-white font-semibold">추천 많은 순 :</strong> 팬분들이 부여한 즐겨찾기(하트) 누적 수를 기반합니다.</li>
                  </ul>
                  <p className="mt-3 pt-2 border-t border-neutral-800/60 text-[10px] text-neutral-500 font-semibold text-right">매일 오전 6시 일괄 갱신처리</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-[#111] border border-neutral-800 p-1 rounded-xl self-start md:self-auto shrink-0">
          <button
            onClick={() => setActiveTab("chats")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "chats" ? "bg-[#7632ff] text-white" : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            대화 많은 순
          </button>
          <button
            onClick={() => setActiveTab("views")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "views" ? "bg-[#7632ff] text-white" : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            조회 높은 순
          </button>
          <button
            onClick={() => setActiveTab("likes")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "likes" ? "bg-[#7632ff] text-white" : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            추천 많은 순
          </button>
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="space-y-3.5">
        {sortedCharacters.map((c, index) => {
          const rank = index + 1;
          const isTop3 = rank <= 3;
          return (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onSelectCharacter(c.id)}
              className="flex items-center justify-between p-3.5 md:p-5 bg-[#141416] hover:bg-[#1a1a1f] border border-neutral-800/60 hover:border-[#7632ff]/20 rounded-2xl cursor-pointer transition-all duration-300"
            >
              
              {/* Rank & Profile details left side */}
              <div className="flex items-center gap-3.5 md:gap-5 flex-1 min-w-0">
                {/* Placement Medal / Number */}
                <div className="w-8 flex items-center justify-center shrink-0">
                  {rank === 1 ? (
                    <span className="text-xl md:text-2.5xl font-black text-yellow-500 font-mono drop-shadow-[0_0_8px_rgba(234,179,8,0.3)]">1</span>
                  ) : rank === 2 ? (
                    <span className="text-xl md:text-2.5xl font-black text-slate-300 font-mono">2</span>
                  ) : rank === 3 ? (
                    <span className="text-lg md:text-2xl font-black text-amber-600 font-mono">3</span>
                  ) : (
                    <span className="text-sm font-extrabold text-neutral-500 font-mono">{rank}</span>
                  )}
                </div>

                {/* Avatar block representation */}
                <div className={`w-11 h-11 md:w-14 md:h-14 rounded-2xl bg-gradient-to-tr ${getAvatarColor(c.id)} overflow-hidden relative shrink-0 p-[1.5px]`}>
                  {c.avatar ? (
                    <img
                      src={c.avatar}
                      alt={c.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#111] rounded-2xl flex items-center justify-center font-extrabold text-sm md:text-base text-neutral-300">
                      {c.name.slice(0, 1)}
                    </div>
                  )}
                </div>

                {/* Persona descriptions */}
                <div className="truncate flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-extrabold text-white text-base group-hover:text-[#a394ff]">{c.name}</span>
                    <span className="text-[10px] bg-neutral-800 text-neutral-300 px-1.5 py-0.2 rounded-md font-semibold font-mono uppercase">{getGenreKorean(c.genre)}</span>
                    {c.isAdult && <span className="text-[8.5px] bg-[#ff3a54] text-white px-1 font-bold rounded-sm">19</span>}
                  </div>
                  <p className="text-sm text-neutral-400 mt-1 line-clamp-1 truncate font-medium">{c.tagline}</p>
                </div>
              </div>

              {/* Engagement Stats right side */}
              <div className="flex items-center gap-4 md:gap-8 shrink-0">
                <div className="hidden sm:flex items-center gap-5 text-xs text-neutral-400 font-medium">
                  <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5 text-[#3a5cff]/80" /> {c.views}</span>
                  <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5 text-[#7632ff]/80" /> {c.chats}</span>
                  <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-red-500/80" /> {c.likes}</span>
                </div>

                {/* Play to chat trigger */}
                <button
                  className="p-2.5 rounded-xl bg-neutral-800 hover:bg-[#7632ff] hover:text-white text-neutral-300 transition-all cursor-pointer hover:scale-105 active:scale-95"
                  title="바로 대화 시작"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>

            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
