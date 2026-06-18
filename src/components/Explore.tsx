import React, { useState, useEffect } from "react";
import { Star, StarOff, ArrowLeft, Search, X } from "lucide-react";
import { Character, UserState } from "../types";
import { getAvatarColor, getGenreKorean } from "../utils";
import { motion } from "motion/react";

interface ExploreProps {
  characters: Character[];
  userState: UserState;
  onUpdateUserState: (state: UserState) => void;
  onSelectCharacter: (charId: string) => void;
  onSelectNovel: (character: Character) => void;
  initialGenre?: string;
  initialSearchQuery?: string;
  onBack?: () => void;
}

export default function Explore({
  characters,
  userState,
  onUpdateUserState,
  onSelectCharacter,
  onSelectNovel,
  initialGenre = "ALL",
  initialSearchQuery = "",
  onBack,
}: ExploreProps) {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);

  // Synchronize state changes when parent hands over pre-searched dynamic parameters
  useEffect(() => {
    setSearchQuery(initialSearchQuery);
  }, [initialSearchQuery]);

  // 1. Initial Filtering based on Adult Safe Mode Lock
  let filtered = characters.filter((c) => {
    if (!userState.unlockedAdult && c.isAdult) return false;
    return true;
  });

  // 2. Filter by Search Query
  if (searchQuery.trim() !== "") {
    const q = searchQuery.toLowerCase().trim();
    filtered = filtered.filter((c) => {
      const matchName = c.name.toLowerCase().includes(q);
      const matchTagline = c.tagline.toLowerCase().includes(q);
      const matchDesc = c.description.toLowerCase().includes(q);
      const matchTags = c.tags?.some((t) => t.toLowerCase().includes(q));
      const matchGenre = getGenreKorean(c.genre).toLowerCase().includes(q);
      return matchName || matchTagline || matchDesc || matchTags || matchGenre;
    });
  }

  const toggleFavorite = (charId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Avoid triggering card navigation
    let updatedFavs = [...userState.favorites];
    if (updatedFavs.includes(charId)) {
      updatedFavs = updatedFavs.filter((id) => id !== charId);
    } else {
      updatedFavs.push(charId);
    }
    onUpdateUserState({ ...userState, favorites: updatedFavs });
  };

  return (
    <div className="w-full max-w-[1240px] mx-auto px-4 md:px-[20px] py-4 md:py-6 flex flex-col gap-5 flex-1 select-none animate-in fade-in duration-300">
      
      {/* 1. Clean Integrated Search Bar & Back Navigation at the Absolute Top */}
      <div className="flex items-center gap-2.5 w-full mt-1">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center justify-center w-11 h-11 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white transition-all cursor-pointer active:scale-95 shrink-0 shadow-md"
            title="상세 페이지로 가기"
            id="explore-back-btn"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <div className="relative flex-grow flex items-center">
          <input
            type="text"
            placeholder="캐릭터 이름, 태그, 한 줄 소개 등으로 검색해보세요..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800/80 focus:border-[#7c6cff]/50 text-neutral-100 text-xs md:text-sm px-4 py-3 pr-11 rounded-2xl outline-none transition-all placeholder-neutral-500 font-semibold shadow-inner"
            autoFocus
          />
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 text-neutral-500 hover:text-neutral-300 cursor-pointer p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <Search className="absolute right-4 text-neutral-600 w-4 h-4 pointer-events-none" />
          )}
        </div>
      </div>

      {/* 2. Grid of All Matching Characters */}
      <div className="mt-1">
        <div className="flex items-center justify-between mb-4 px-1.5">
          <h3 className="text-[#eee] font-black text-sm md:text-base tracking-tight leading-none">
            {searchQuery.trim() !== "" ? (
              <span>🔍 검색 결과 <span className="text-[#7632ff] font-extrabold">{filtered.length}</span></span>
            ) : (
              <span>🔥 전체 캐릭터 콜렉션 <span className="text-[#7632ff] font-extrabold">{filtered.length}</span></span>
            )}
          </h3>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 bg-[#111112]/30 border border-neutral-900/30 rounded-2xl text-center">
            <span className="text-neutral-500 text-4xl mb-3">🔍</span>
            <p className="text-sm md:text-base font-bold text-neutral-300">매칭되는 탐색 캐릭터가 없습니다</p>
            <p className="text-xs text-neutral-500 mt-1">성인 락(19+) 설정을 해제하거나 다른 검색어를 입력해보세요.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 md:gap-5">
            {filtered.map((c) => {
              const isFav = userState.favorites.includes(c.id);
              return (
                <motion.div
                  key={c.id}
                  whileHover={{ y: -6, scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  onClick={() => onSelectCharacter(c.id)}
                  className="group relative cursor-pointer bg-[#141416] rounded-2xl border border-neutral-900 hover:border-[#7c6cff]/30 overflow-hidden flex flex-col justify-end shadow-xl aspect-[2/3] w-full"
                >
                  
                  {/* Full Background Image */}
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

                  {/* Dark blur/gradient overlay fading from bottom to top */}
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-transparent backdrop-blur-[0.5px] z-10" />

                  {/* Star Button (즐겨찾기) top right */}
                  <button
                    onClick={(e) => toggleFavorite(c.id, e)}
                    className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/40 text-neutral-300 hover:text-yellow-400 backdrop-blur-sm z-30 transition-all active:scale-90 cursor-pointer"
                  >
                    {isFav ? <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" /> : <StarOff className="w-3.5 h-3.5 text-white/70" />}
                  </button>

                  {/* Overlaid Content Metadata Container */}
                  <div className="relative z-20 p-3.5 md:p-4 flex flex-col justify-end w-full">
                    <div>
                      <h4 className="font-extrabold text-xs md:text-base text-neutral-100 group-hover:text-[#b9adff] transition-colors truncate">
                        {c.name}
                      </h4>
                      
                      <p className="text-[11px] md:text-xs text-neutral-300 line-clamp-2 md:line-clamp-3 leading-relaxed mt-0.5 md:mt-1 font-medium italic">
                        {c.tagline}
                      </p>
                    </div>

                    {/* Concept Chip */}
                    <div className="mt-1.5 flex flex-row flex-nowrap gap-[6px] justify-start items-center overflow-hidden whitespace-nowrap text-ellipsis">
                      {c.tags && c.tags.length > 0 ? (
                        c.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-[10px] md:text-[11.5px] font-bold tracking-tight text-[#b9adff]/90 hover:text-[#c7bdff] transition-colors inline-block shrink-0">
                            {tag.replace("#관계:", "#").replace("#성격:", "#").replace("#특징:", "#")}
                          </span>
                        ))
                      ) : (
                        <span className="text-[10px] md:text-[11.5px] font-bold tracking-tight text-[#b9adff]/90 inline-block shrink-0">
                          #{getGenreKorean(c.genre)}
                        </span>
                      )}
                    </div>
                  </div>

                </motion.div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
