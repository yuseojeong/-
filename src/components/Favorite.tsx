import React from "react";
import { Star, Eye, MessageSquare, Play, RefreshCw, Bookmark } from "lucide-react";
import { Character, UserState } from "../types";
import { getAvatarColor, getGenreKorean } from "../utils";
import { motion } from "motion/react";

interface FavoriteProps {
  characters: Character[];
  userState: UserState;
  onUpdateUserState: (state: UserState) => void;
  onSelectCharacter: (charId: string) => void;
  onNavigateHome: () => void;
  onSelectNovel: (character: Character) => void;
}

export default function Favorite({ characters, userState, onUpdateUserState, onSelectCharacter, onNavigateHome, onSelectNovel }: FavoriteProps) {
  
  // Filter favorite characters
  const favoriteItems = characters.filter((c) => userState.favorites.includes(c.id));

  const removeFavorite = (charId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const updated = userState.favorites.filter((id) => id !== charId);
    onUpdateUserState({ ...userState, favorites: updated });
  };

  return (
    <div className="w-full max-w-[1240px] mx-auto px-4 md:px-[20px] py-6 md:py-10 select-none pb-24">
      
      {/* Title & Description Header Text Only */}
      <div className="relative flex flex-col justify-center gap-2 py-2 px-1 mb-8 pb-3 border-b border-neutral-900/40">
        <div className="relative z-10">
          <h2 className="text-[#eee] font-black text-xl md:text-3xl tracking-tight leading-none mb-2">내 즐겨찾기</h2>
        </div>
      </div>

      {/* Empty State Fallback if no favorites exist */}
      {favoriteItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 md:p-20 bg-[#111]/30 border border-neutral-800/60 rounded-3xl text-center max-w-[600px] mx-auto mt-6">
          <Bookmark className="w-12 h-12 text-neutral-600 mb-4 animate-bounce" />
          <h3 className="font-extrabold text-white text-base">아무런 즐겨찾기 캐릭터가 없습니다!</h3>
          <p className="text-xs text-neutral-400 max-w-[360px] leading-relaxed mt-2">
            다양하고 짜릿한 소설 속 인물들의 디테일 카드 오른족 상단 별 모양 버튼을 눌러 피드 즐겨찾기에 등록해 보세요.
          </p>
          <button
            onClick={onNavigateHome}
            className="mt-6 px-5 py-2.5 bg-[#7632ff] hover:opacity-90 rounded-full font-bold text-xs text-white transition-all cursor-pointer shadow-lg shadow-[#7632ff]/10"
          >
            차원 로비에서 탐색하기
          </button>
        </div>
      ) : (
        /* Favorites Grid representation matching home screen (CurationSection) */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 md:gap-5">
          {favoriteItems.map((c) => (
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
                onClick={(e) => removeFavorite(c.id, e)}
                className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/40 text-yellow-400 backdrop-blur-sm z-30 transition-all active:scale-90 cursor-pointer"
                title="즐겨찾기 해제"
              >
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
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
          ))}
        </div>
      )}
    </div>
  );
}
