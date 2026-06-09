import React from "react";
import { Eye, MessageSquare, Heart, Star, StarOff } from "lucide-react";
import { Character, UserState } from "../types";
import { getAvatarColor, getGenreKorean } from "../utils";
import { motion } from "motion/react";

interface CurationSectionProps {
  title: string;
  characters: Character[];
  category: "all" | "adult" | "non-adult" | "best" | "genre" | string;
  userState: UserState;
  onUpdateUserState: (state: UserState) => void;
  onSelectCharacter: (charId: string) => void;
  onSelectNovel: (character: Character) => void;
  filterGenre?: string;
  searchQuery?: string;
}

export default function CurationSection({
  title,
  characters,
  category,
  userState,
  onUpdateUserState,
  onSelectCharacter,
  onSelectNovel,
  filterGenre,
  searchQuery
}: CurationSectionProps) {
  
  // Filter based on category & adult lock
  let filtered = characters.filter((c) => {
    // If not matching adult mode settings
    if (!userState.unlockedAdult && c.isAdult) return false;
    return true;
  });

  if (category === "search" && searchQuery) {
    const q = searchQuery.toLowerCase().trim();
    filtered = filtered.filter((c) => {
      const matchName = c.name.toLowerCase().includes(q);
      const matchTagline = c.tagline.toLowerCase().includes(q);
      const matchDesc = c.description.toLowerCase().includes(q);
      const matchTags = c.tags?.some((t) => t.toLowerCase().includes(q));
      const matchGenre = getGenreKorean(c.genre).toLowerCase().includes(q);
      return matchName || matchTagline || matchDesc || matchTags || matchGenre;
    });
  } else if (category === "genre" && filterGenre) {
    filtered = filtered.filter((c) => c.genre === filterGenre);
  } else if (category === "best") {
    filtered = filtered.filter((c) => c.badgeText?.includes("BEST"));
  } else if (category === "new") {
    filtered = filtered.filter((c) => c.badgeText?.includes("NEW") || c.badgeText?.includes("UPDATE"));
  } else if (category === "adult_group") {
    filtered = filtered.filter((c) => c.isAdult);
  } else if (category === "general_group") {
    filtered = filtered.filter((c) => !c.isAdult);
  }

  // If no items, do not render this category section to keep negative space tidy
  if (filtered.length === 0) {
    if (category === "search") {
      return (
        <section className="mb-12 md:mb-18 select-none animate-fade-in">
          <div className="flex items-center justify-between mb-3.5 md:mb-6 px-1.5">
            <h2 className="text-[#eee] font-black text-[15px] md:text-2xl tracking-tight bg-gradient-to-r from-white to-neutral-300 bg-clip-text text-transparent">
              {title}
            </h2>
          </div>
          <div className="flex flex-col items-center justify-center py-16 px-4 bg-[#111112]/50 border border-neutral-800/20 rounded-2xl text-center">
            <span className="text-neutral-500 text-3xl md:text-4xl mb-3">🔍</span>
            <p className="text-sm md:text-base font-bold text-neutral-300">검색결과와 매칭되는 활성 캐릭터가 없습니다</p>
            <p className="text-xs text-neutral-500 mt-1">이름, 기획 속성 또는 태그 키워드를 정확히 입력해주세요.</p>
          </div>
        </section>
      );
    }
    return null;
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
    <section className="mb-12 md:mb-18 select-none">
      
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3.5 md:mb-6 px-1.5">
        <h2 className="text-[#eee] font-black text-[15px] md:text-2xl tracking-tight bg-gradient-to-r from-white to-neutral-300 bg-clip-text text-transparent">
          {title}
        </h2>
      </div>

      {/* Characters Grid */}
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

                {/* Concept Chip (Moved from first div) */}
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
    </section>
  );
}
