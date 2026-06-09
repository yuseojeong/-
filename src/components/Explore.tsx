import React, { useState } from "react";
import { Star, StarOff, Compass, ArrowRight } from "lucide-react";
import { Character, UserState } from "../types";
import { getAvatarColor, getGenreKorean } from "../utils";
import { motion } from "motion/react";
import WorldSelect from "./WorldSelect";

interface ExploreProps {
  characters: Character[];
  userState: UserState;
  onUpdateUserState: (state: UserState) => void;
  onSelectCharacter: (charId: string) => void;
  onSelectNovel: (character: Character) => void;
}

export default function Explore({
  characters,
  userState,
  onUpdateUserState,
  onSelectCharacter,
  onSelectNovel,
}: ExploreProps) {
  const [selectedGenre, setSelectedGenre] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // 1. Initial Filtering based on Adult Safe Mode Lock
  let filtered = characters.filter((c) => {
    if (!userState.unlockedAdult && c.isAdult) return false;
    return true;
  });

  // 2. Filter by Genre
  if (selectedGenre !== "ALL" && !isSearchOpen) {
    filtered = filtered.filter((c) => c.genre === selectedGenre);
  }

  // 3. Filter by Search Query
  if (isSearchOpen && searchQuery.trim() !== "") {
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

  const handleSelectGenreInExplore = (genreName: string) => {
    setSelectedGenre(genreName);
    setSearchQuery("");
    setIsSearchOpen(false);
  };

  const handleToggleSearch = () => {
    const nextState = !isSearchOpen;
    setIsSearchOpen(nextState);
    if (!nextState) {
      setSearchQuery("");
    }
  };

  return (
    <div className="w-full max-w-[1240px] mx-auto px-4 md:px-[20px] py-4 md:py-6 flex flex-col gap-4 flex-1 select-none animate-in fade-in duration-300">
      
      {/* Title & Description Header Text Only */}
      <div className="relative flex flex-col justify-center gap-2 py-2 px-1 pb-3 border-b border-neutral-900/40">
        <div className="relative z-10">
          <h2 className="text-[#eee] font-black text-xl md:text-3xl tracking-tight leading-none mb-2">
            다양한 원작 소설 속 차원 속으로
          </h2>
          <p className="text-sm text-neutral-400 tracking-tight leading-relaxed max-w-none">
            노벨피아 독점 소설 세계관 속 캐릭터와 대화를 즐겨보세요!
          </p>
        </div>
      </div>

      {/* Identical Genre Chip & Search Bar Div */}
      <WorldSelect
        onSelectGenre={handleSelectGenreInExplore}
        activeGenre={selectedGenre}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isSearchOpen={isSearchOpen}
        onToggleSearch={handleToggleSearch}
      />

      {/* Grid of All Matching Characters */}
      <div className="mt-2">
        <div className="flex items-center justify-between mb-4 px-1.5">
          <h3 className="text-[#eee] font-black text-base md:text-xl tracking-tight leading-none">
            {isSearchOpen && searchQuery.trim() !== "" ? (
              <span>🔍 검색 결과 <span className="text-[#7632ff] font-extrabold">{filtered.length}</span></span>
            ) : selectedGenre !== "ALL" ? (
              <span>✨ [ {getGenreKorean(selectedGenre)} ] 장르 필터 <span className="text-[#7632ff] font-extrabold">{filtered.length}</span></span>
            ) : (
              <span>🔥 전체 캐릭터 콜렉션 <span className="text-[#7632ff] font-extrabold">{filtered.length}</span></span>
            )}
          </h3>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 bg-[#111112]/50 border border-neutral-800/20 rounded-2xl text-center">
            <span className="text-neutral-500 text-4xl mb-3">🔍</span>
            <p className="text-sm md:text-base font-bold text-neutral-300">매칭되는 탐색 캐릭터가 없습니다</p>
            <p className="text-xs text-neutral-500 mt-1">성인 락(19+) 설정을 해제하거나 다른 검색어/장르를 설정해보세요.</p>
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
                      
                      <p className="text-[11px] md:text-sm text-neutral-300 line-clamp-2 md:line-clamp-3 leading-relaxed mt-0.5 md:mt-1 font-medium">
                        {c.tagline}
                      </p>
                    </div>

                    {/* Concept Chip */}
                    <div className="mt-1.5 flex flex-row flex-nowrap gap-[6px] justify-start items-center overflow-hidden whitespace-nowrap text-ellipsis">
                      {c.tags && c.tags.length > 0 ? (
                        c.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-[10px] md:text-[11.5px] font-bold tracking-tight text-[#b9adff]/90 hover:text-[#c7bdff] transition-colors inline-block shrink-0">
                            {tag}
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
