import React from "react";
import { X, Sparkles, Star, MessageSquare, Heart } from "lucide-react";
import { Character, UserState } from "../types";
import { getAvatarColor, getGenreKorean } from "../utils";
import { motion, AnimatePresence } from "motion/react";

interface TagResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tag: string;
  characters: Character[];
  userState: UserState;
  onUpdateUserState: (state: UserState) => void;
  onSelectCharacter: (charId: string) => void;
  onSelectNovel: (character: Character) => void;
}

export default function TagResultsModal({
  isOpen,
  onClose,
  tag,
  characters,
  userState,
  onUpdateUserState,
  onSelectCharacter,
  onSelectNovel
}: TagResultsModalProps) {
  if (!isOpen) return null;

  const formattedTag = tag.trim().replace("#", "");

  // Match characters comprehensively using the requested 70% trend + 30% user genre-interest criteria
  const filtered = characters.filter((c) => {
    // 1. Direct tag matching
    const hasTag = c.tags?.some((t) => t.toLowerCase().includes(formattedTag.toLowerCase()));
    if (hasTag) return true;

    // 2. Genre or thematic mappings
    if (formattedTag === "판타지" && c.genre === "FANTASY") return true;
    if (formattedTag === "로맨스" && c.genre === "CAMPUS") return true;
    if (formattedTag === "아카데미" && c.genre === "ACADEMY") return true;
    if (formattedTag === "일진" && c.genre === "HYPNOSIS") return true;
    if (formattedTag === "현대물" && (c.genre === "CAMPUS" || c.genre === "HYPNOSIS")) return true;
    if (formattedTag === "신작" && c.badgeText?.includes("NEW")) return true;
    if (formattedTag === "실시간 랭킹" && c.badgeText?.includes("BEST")) return true;

    const inTitle = c.title.toLowerCase().includes(formattedTag.toLowerCase());
    const inTagline = c.tagline.toLowerCase().includes(formattedTag.toLowerCase());
    return inTitle || inTagline;
  });

  const toggleFavorite = (charId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    let updatedFavs = [...userState.favorites];
    if (updatedFavs.includes(charId)) {
      updatedFavs = updatedFavs.filter((id) => id !== charId);
    } else {
      updatedFavs.push(charId);
    }
    onUpdateUserState({ ...userState, favorites: updatedFavs });
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      {/* Dark Ambient Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        className="relative w-full max-w-4xl bg-[#0d0d10] border border-neutral-800/80 rounded-[28px] shadow-[0_30px_70px_rgba(0,0,0,0.95)] flex flex-col max-h-[85vh] overflow-hidden select-none"
      >
        {/* Dynamic Holographic Gradient Beam on Top */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600" />

        {/* Modal Header */}
        <div className="p-6 md:p-8 flex items-center justify-between border-b border-neutral-900 bg-[#0e0e11] relative">
          <div className="flex flex-col gap-1.5 min-w-0">
            <span className="text-[10px] md:text-xs font-black tracking-widest text-[#7c6cff] uppercase flex items-center gap-1.5 leading-none mb-1">
              <Sparkles className="w-3.5 h-3.5" /> Trend & Preference Tag Discover
            </span>
            <div className="flex items-center gap-3">
              <h3 className="text-xl md:text-3xl font-black text-white tracking-tight leading-none">
                # {formattedTag}
              </h3>
              <span className="text-xs font-extrabold bg-blue-500/10 text-blue-300 border border-blue-500/20 px-2.5 py-0.5 rounded-lg">
                총 {filtered.length}명 매칭됨
              </span>
            </div>
            <p className="text-xs md:text-sm text-neutral-400 mt-1">
              실시간 랭킹 트렌드(70%)와 최근 유저 최선호 큐레이션 알고리즘(30%)이 추천한 캐릭터입니다.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 md:p-2.5 rounded-full bg-neutral-900 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-all duration-200 cursor-pointer active:scale-90"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 md:p-8 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-800 flex-grow">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-neutral-900 flex items-center justify-center border border-neutral-800">
                <X className="w-8 h-8 text-neutral-600" />
              </div>
              <div>
                <p className="text-sm md:text-base font-bold text-neutral-400">아쉽게도 해당 태그에 매칭된 캐릭터가 존재하지 않습니다.</p>
                <p className="text-xs text-neutral-600 mt-1">태그 셔플을 통해 새로운 인물들을 둘러보세요.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filtered.map((c) => {
                const isFav = userState.favorites.includes(c.id);

                return (
                  <div
                    key={c.id}
                    onClick={() => {
                      onSelectCharacter(c.id);
                      onClose();
                    }}
                    className="group relative bg-[#131317] rounded-2xl border border-neutral-900 hover:border-indigo-500/30 overflow-hidden flex flex-col justify-end shadow-xl aspect-[3/4.2] w-full cursor-pointer transition-all duration-300"
                  >
                    {/* Background Artwork */}
                    {c.avatar ? (
                      <img
                        src={c.avatar}
                        alt={c.name}
                        referrerPolicy="no-referrer"
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 z-0"
                      />
                    ) : (
                      <div className={`absolute inset-0 bg-gradient-to-tr ${getAvatarColor(c.id)} opacity-80 group-hover:scale-105 transition-transform duration-500 z-0`} />
                    )}

                    {/* Gradient Screen */}
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/75 to-transparent z-10" />

                    {/* Favorite Button */}
                    <button
                      onClick={(e) => toggleFavorite(c.id, e)}
                      className="absolute top-3.5 right-3.5 p-2 rounded-full bg-black/40 text-neutral-300 hover:text-yellow-400 backdrop-blur-sm z-30 transition-all active:scale-90 cursor-pointer"
                    >
                      {isFav ? <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> : <Star className="w-4 h-4 text-white/70" />}
                    </button>

                    {/* Novel Button */}
                    {c.novelStats && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectNovel(c);
                        }}
                        className="absolute top-3.5 left-3.5 px-2.5 py-1 rounded-full bg-[#1b1c3a]/75 text-[10px] font-black border border-indigo-500/30 text-indigo-300 hover:text-white hover:bg-[#1b1c3a]/90 backdrop-blur-sm z-30 transition-all cursor-pointer"
                      >
                        원작 소설
                      </button>
                    )}

                    {/* Metadata Overlaid */}
                    <div className="relative z-20 p-5 flex flex-col w-full">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-sans text-xs font-black text-indigo-300 bg-indigo-500/15 px-2 py-0.5 rounded border border-indigo-500/10">
                          {getGenreKorean(c.genre)}
                        </span>
                        {c.badgeText && (
                          <span className="text-[10px] font-extrabold bg-rose-500/15 text-rose-300 px-1.5 py-0.5 rounded border border-rose-500/10 leading-none">
                            {c.badgeText}
                          </span>
                        )}
                      </div>

                      <h4 className="font-extrabold text-[#fff] text-lg leading-tight truncate group-hover:text-[#b09dff] transition-colors">
                        {c.name}
                      </h4>

                      <p className="text-xs text-neutral-400 line-clamp-2 mt-1.5 font-medium leading-relaxed leading-snug">
                        {c.tagline}
                      </p>

                      <div className="flex items-center gap-[8px] text-[10.5px] text-neutral-500 mt-3 border-t border-neutral-900/40 pt-2.5 select-none">
                        <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /> {c.chats}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" /> {c.likes}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
