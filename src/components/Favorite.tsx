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
}

export default function Favorite({ characters, userState, onUpdateUserState, onSelectCharacter, onNavigateHome }: FavoriteProps) {
  
  // Filter favorite characters
  const favoriteItems = characters.filter((c) => userState.favorites.includes(c.id));

  const removeFavorite = (charId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const updated = userState.favorites.filter((id) => id !== charId);
    onUpdateUserState({ ...userState, favorites: updated });
  };

  return (
    <div className="w-full max-w-[1240px] mx-auto px-4 md:px-[20px] py-6 md:py-10 select-none pb-24">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 rounded-xl bg-blue-500/10 text-[#3a5cff]">
          <Star className="w-5 h-5 fill-current animate-spin-slow" />
        </div>
        <div>
          <h1 className="text-lg md:text-2xl font-black text-white tracking-tight">내 즐겨찾기</h1>
          <p className="text-xs md:text-sm text-neutral-400 mt-1">대화를 계속 이어가고 싶거나 애끼는 소중한 AI 파트너 콜렉션</p>
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
              className="group relative cursor-pointer bg-[#141416] rounded-2xl border border-neutral-900 hover:border-[#7c6cff]/30 overflow-hidden flex flex-col justify-end shadow-xl h-[245px] md:h-[290px]"
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

              {/* Combined Row of Badges (19, New, Update, Best, Hot) */}
              <div className="absolute top-2.5 left-2.5 flex items-center gap-1 z-20 flex-wrap">
                {c.isAdult && (
                  <span className="bg-[#ff3a54]/10 text-[#ff4c6a] border border-[#ff3a54]/25 text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm" title="성인 소설 원작 캐릭터">
                    19
                  </span>
                )}

                {c.badgeText && c.badgeText.length > 0 && (
                  <>
                    {c.badgeText.map((tag) => {
                      const upperTag = tag.toUpperCase();
                      let styleClass = "bg-neutral-800/60 text-neutral-300 border border-neutral-700/50";
                      if (upperTag === "NEW") {
                        styleClass = "bg-[#10b981]/10 text-[#34d399] border border-[#10b981]/25";
                      } else if (upperTag === "UPDATE") {
                        styleClass = "bg-[#f59e0b]/10 text-[#fbbf24] border border-[#f59e0b]/25";
                      } else if (upperTag === "BEST") {
                        styleClass = "bg-[#3b82f6]/10 text-[#60a5fa] border border-[#3b82f6]/25";
                      } else if (upperTag === "HOT") {
                        styleClass = "bg-[#ec4899]/10 text-[#f472b6] border border-[#ec4899]/25";
                      }
                      return (
                        <span
                          key={tag}
                          className={`text-[8.5px] font-extrabold px-1.5 py-0.5 rounded shadow-sm ${styleClass}`}
                        >
                          {tag}
                        </span>
                      );
                    })}
                  </>
                )}
              </div>

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
                <div className="mt-1.5 flex flex-wrap gap-1 justify-start">
                  {c.tags && c.tags.length > 0 ? (
                    c.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-[9px] md:text-[12px] font-extrabold tracking-tight text-[#b9adff] bg-[#7c6cff]/12 border border-[#7c6cff]/20 px-1 md:px-2 py-0.5 rounded-full inline-block">
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-[9px] md:text-[12px] font-extrabold tracking-tight text-[#b9adff] bg-[#7c6cff]/12 border border-[#7c6cff]/20 px-1 md:px-2 py-0.5 rounded-full inline-block">
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
