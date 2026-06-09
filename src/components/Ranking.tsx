import React, { useState, useEffect } from "react";
import { Character, UserState } from "../types";
import { Award, Trophy, Eye, MessageSquare, Heart, Play, HelpCircle } from "lucide-react";
import { getAvatarColor, getGenreKorean } from "../utils";
import { motion } from "motion/react";

interface RankingProps {
  characters: Character[];
  userState: UserState;
  onSelectCharacter: (charId: string) => void;
  onSelectNovel: (character: Character) => void;
}

// Map custom aesthetic handles, trends, and author credits for the leaderboard
const getMockRankMeta = (id: string, index: number) => {
  const meta: Record<string, { author: string; diff: string; diffType: "up" | "down" | "same" }> = {
    amelia: { author: "@lp", diff: "1", diffType: "same" },
    sooa: { author: "@joy_haha030", diff: "1", diffType: "up" },
    ohhana: { author: "@naturalstupid", diff: "115", diffType: "up" },
    commander: { author: "@ddaeng", diff: "18", diffType: "up" },
    saebyeok: { author: "@kimi", diff: "1", diffType: "up" },
    juha: { author: "@0m3lette", diff: "2", diffType: "down" },
    yuinha: { author: "@tamestshout2382", diff: "3", diffType: "up" },
    sharon: { author: "@len_kaneri", diff: "4", diffType: "up" },
    seora: { author: "@fit_queen", diff: "1", diffType: "down" },
  };

  return meta[id] || { author: `@user_${index + 1}`, diff: "1", diffType: "up" };
};

export default function Ranking({ characters, userState, onSelectCharacter, onSelectNovel }: RankingProps) {
  const [sortedCharacters, setSortedCharacters] = useState<Character[]>([]);
  const [activeTab, setActiveTab] = useState<"views" | "chats" | "likes">("chats");
  const [timeTab, setTimeTab] = useState<"실시간" | "일간" | "주간" | "월간">("실시간");
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
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
      
      {/* 2. Headline with precise description & last update dynamic status */}
      <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-4 mb-0 pb-3 border-b border-neutral-900/40">
        <div className="relative z-10 flex flex-col justify-center gap-0.5">
          <h2 className="text-white font-black text-xl md:text-3xl tracking-tight leading-none mb-1.5">
            {timeTab} 랭킹 캐릭터
          </h2>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[12px] text-neutral-500 font-extrabold tracking-tight">
              마지막 업데이트: 1분 전
            </span>
            <span className="text-neutral-700 select-none text-xs">|</span>
            <button
              type="button"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onClick={() => setShowTooltip(!showTooltip)}
              className="p-1 rounded-full text-neutral-500 hover:text-[#7632ff] transition-all focus:outline-none cursor-pointer"
              aria-label="랭킹 정책 안내"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>

            {showTooltip && (
              <div className="absolute left-0 top-full mt-2 w-72 p-4 bg-[#141416]/98 backdrop-blur border border-neutral-800 rounded-xl shadow-2xl z-50 text-xs text-neutral-300 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="font-extrabold text-[#3a5cff] mb-2 flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5" />
                  <span>실시간 랭킹 산정 원칙</span>
                </div>
                <ul className="space-y-1.5 leading-relaxed font-semibold">
                  <li><strong className="text-white">대화 많은 순:</strong> 캐릭터 대화 건수 및 활성 채팅 지수를 반영합니다.</li>
                  <li><strong className="text-white">조회 높은 순:</strong> 프로필 클릭 횟수 및 방문 트래픽 수치를 적용합니다.</li>
                  <li><strong className="text-white">추천 많은 순:</strong> 즐겨찾기(하트) 등록 누적 수를 기반으로 합니다.</li>
                </ul>
                <p className="mt-3 pt-2 border-t border-neutral-800/60 text-[10px] text-neutral-500 font-bold text-right">매시간 정각 일괄 갱신처리</p>
              </div>
            )}
          </div>
        </div>


      </div>

      {/* 1. Time selection chips block */}
      <div className="flex flex-wrap gap-1.5 md:gap-2 items-center py-0 md:py-4">
        {(["실시간", "일간", "주간", "월간"] as const).map((tab) => {
          const isActive = timeTab === tab;
          return (
            <motion.button
              key={tab}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setTimeTab(tab)}
              className={`
                px-3 md:px-4.5 py-1.5 md:py-2 rounded-full border text-[11px] md:text-sm font-semibold cursor-pointer transition-all duration-200
                ${isActive 
                  ? "bg-[#7632ff] border-[#7632ff] text-white" 
                  : "bg-[#111112] border-[#222] text-neutral-400 hover:border-[#444] hover:text-white"
                }
              `}
            >
              {tab}
            </motion.button>
          );
        })}
      </div>

      {/* 3. Redesigned List Leaderboard with fine dividing lines, categorized vertically side-by-side */}
      {(() => {
        const midPoint = Math.ceil(sortedCharacters.length / 2);
        const leftCharacters = sortedCharacters.slice(0, midPoint);
        const rightCharacters = sortedCharacters.slice(midPoint);

        const getRankColorClass = (rank: number) => {
          if (rank === 1) return "text-white opacity-100 drop-shadow-[0_2px_10px_rgba(255,255,255,0.25)]";
          if (rank === 2) return "text-white opacity-80 drop-shadow-[0_2px_8px_rgba(255,255,255,0.15)]";
          if (rank === 3) return "text-white opacity-60 drop-shadow-[0_2px_6px_rgba(255,255,255,0.1)]";
          return "text-neutral-600 group-hover:text-neutral-400";
        };

        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-14 gap-y-0">
            {/* Left Column (Ranks 1 to 5) */}
            <div className="flex flex-col">
              {leftCharacters.map((c, idx) => {
                const rank = idx + 1;
                const mockMeta = getMockRankMeta(c.id, idx);

                return (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    onClick={() => onSelectCharacter(c.id)}
                    className="flex items-center gap-[10px] md:gap-4 bg-transparent hover:bg-neutral-900/10 border-b border-neutral-900 last:border-b-0 lg:last:border-b lg:border-b-neutral-900/60 cursor-pointer transition-all duration-300 py-5.5 relative group"
                  >
                    {/* Giant Rank Number Graphic */}
                    <div className="w-8 md:w-16 flex items-center justify-center shrink-0">
                      <span className={`text-4xl md:text-5xl font-black italic select-none block tracking-tighter leading-none font-sans group-hover:scale-105 transition-all ${getRankColorClass(rank)}`}>
                        {rank}
                      </span>
                    </div>

                    {/* Large Portrait Image Frame with Rounded Bounds */}
                    <div className="relative w-[103px] h-[155px] md:w-28 md:h-28 rounded-2xl bg-neutral-900 border border-neutral-850 shrink-0 overflow-hidden group-hover:scale-[1.02] transition-transform duration-300 -ml-3 md:ml-0">
                      {c.avatar ? (
                        <img
                          src={c.avatar}
                          alt={c.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover rounded-2xl"
                        />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-tr ${getAvatarColor(c.id)} flex items-center justify-center font-black text-xl text-white`}>
                          {c.name.slice(0, 1)}
                        </div>
                      )}

                      {/* Floating Translucent overlay */}
                      <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 bg-[#020202]/85 backdrop-blur-[3px] py-1 px-2.5 rounded-full text-[9px] font-black text-neutral-200 flex items-center gap-2 whitespace-nowrap border border-white/5 select-none leading-none shadow-md">
                        <span className="flex items-center gap-0.5">💬 {c.chats}</span>
                        <span className="flex items-center gap-0.5">♡ {c.likes}</span>
                      </div>
                    </div>

                    {/* Detailed Character Metadata */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center py-1">
                      {/* Ranking trend */}
                      <div className="flex items-center gap-1 leading-none mb-1">
                        {mockMeta.diffType === "up" ? (
                          <span className="text-[10px] md:text-[11px] font-extrabold text-[#ff4f7a] flex items-center gap-0.5">
                            ▲ {mockMeta.diff}
                          </span>
                        ) : mockMeta.diffType === "down" ? (
                          <span className="text-[10px] md:text-[11px] font-extrabold text-blue-400 flex items-center gap-0.5">
                            ▼ {mockMeta.diff}
                          </span>
                        ) : (
                          <span className="text-[10px] md:text-[11px] font-extrabold text-neutral-500 leading-none">
                            -
                          </span>
                        )}
                      </div>

                      {/* Name & Badge tags */}
                      <h3 className="font-extrabold text-white text-[15.5px] md:text-lg tracking-tight truncate flex items-center gap-1.5 leading-snug">
                        <span>{c.name}</span>
                        {c.isAdult && (
                          <span className="text-[8px] md:text-[9.5px] bg-[#ff3a54] text-white px-1 py-0.5 font-black rounded select-none leading-none tracking-normal">
                            19
                          </span>
                        )}
                      </h3>

                      {/* Tagline sentence */}
                      <p className="text-neutral-400 text-xs md:text-[13px] font-medium leading-relaxed mt-1 mb-1.5 line-clamp-2 md:line-clamp-1">
                        {c.tagline}
                      </p>

                      {/* Character category list tags */}
                      <div className="mt-1.5 flex flex-row flex-nowrap gap-[6px] justify-start items-center overflow-hidden whitespace-nowrap text-ellipsis">
                        {c.tags?.slice(0, 3).map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[10px] md:text-[11.5px] font-bold tracking-tight text-[#b9adff]/90 hover:text-[#c7bdff] transition-colors inline-block shrink-0"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                  </motion.div>
                );
              })}
            </div>

            {/* Right Column (Ranks 6 to 10) */}
            <div className="flex flex-col">
              {rightCharacters.map((c, idx) => {
                const actualIdx = midPoint + idx;
                const rank = actualIdx + 1;
                const mockMeta = getMockRankMeta(c.id, actualIdx);

                return (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: actualIdx * 0.04 }}
                    onClick={() => onSelectCharacter(c.id)}
                    className="flex items-center gap-[10px] md:gap-4 bg-transparent hover:bg-neutral-900/10 border-b border-neutral-900 last:border-b-0 cursor-pointer transition-all duration-300 py-5.5 relative group"
                  >
                    {/* Giant Rank Number Graphic */}
                    <div className="w-8 md:w-16 flex items-center justify-center shrink-0">
                      <span className={`text-4xl md:text-5xl font-black italic select-none block tracking-tighter leading-none font-sans group-hover:scale-105 transition-all ${getRankColorClass(rank)}`}>
                        {rank}
                      </span>
                    </div>

                    {/* Large Portrait Image Frame with Rounded Bounds */}
                    <div className="relative w-[103px] h-[155px] md:w-28 md:h-28 rounded-2xl bg-neutral-900 border border-neutral-850 shrink-0 overflow-hidden group-hover:scale-[1.02] transition-transform duration-300 -ml-3 md:ml-0">
                      {c.avatar ? (
                        <img
                          src={c.avatar}
                          alt={c.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover rounded-2xl"
                        />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-tr ${getAvatarColor(c.id)} flex items-center justify-center font-black text-xl text-white`}>
                          {c.name.slice(0, 1)}
                        </div>
                      )}

                      {/* Floating Translucent overlay */}
                      <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 bg-[#020202]/85 backdrop-blur-[3px] py-1 px-2.5 rounded-full text-[9px] font-black text-neutral-200 flex items-center gap-2 whitespace-nowrap border border-white/5 select-none leading-none shadow-md">
                        <span className="flex items-center gap-0.5">💬 {c.chats}</span>
                        <span className="flex items-center gap-0.5">♡ {c.likes}</span>
                      </div>
                    </div>

                    {/* Detailed Character Metadata */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center py-1">
                      {/* Ranking trend */}
                      <div className="flex items-center gap-1 leading-none mb-1">
                        {mockMeta.diffType === "up" ? (
                          <span className="text-[10px] md:text-[11px] font-extrabold text-[#ff4f7a] flex items-center gap-0.5">
                            ▲ {mockMeta.diff}
                          </span>
                        ) : mockMeta.diffType === "down" ? (
                          <span className="text-[10px] md:text-[11px] font-extrabold text-blue-400 flex items-center gap-0.5">
                            ▼ {mockMeta.diff}
                          </span>
                        ) : (
                          <span className="text-[10px] md:text-[11px] font-extrabold text-neutral-500 leading-none">
                            -
                          </span>
                        )}
                      </div>

                      {/* Name & Badge tags */}
                      <h3 className="font-extrabold text-white text-[15.5px] md:text-lg tracking-tight truncate flex items-center gap-1.5 leading-snug">
                        <span>{c.name}</span>
                        {c.isAdult && (
                          <span className="text-[8px] md:text-[9.5px] bg-[#ff3a54] text-white px-1 py-0.5 font-black rounded select-none leading-none tracking-normal">
                            19
                          </span>
                        )}
                      </h3>

                      {/* Tagline sentence */}
                      <p className="text-neutral-400 text-xs md:text-[13px] font-medium leading-relaxed mt-1 mb-1.5 line-clamp-2 md:line-clamp-1">
                        {c.tagline}
                      </p>

                      {/* Character category list tags */}
                      <div className="mt-1.5 flex flex-row flex-nowrap gap-[6px] justify-start items-center overflow-hidden whitespace-nowrap text-ellipsis">
                        {c.tags?.slice(0, 3).map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[10px] md:text-[11.5px] font-bold tracking-tight text-[#b9adff]/90 hover:text-[#c7bdff] transition-colors inline-block shrink-0"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>


                    </div>

                  </motion.div>
                );
              })}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
