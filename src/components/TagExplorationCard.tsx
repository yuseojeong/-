import React, { useState, useEffect } from "react";
import { Sparkles, Shuffle, ChevronRight, Flame, BarChart3, HeartHandshake, Compass, Star, StarOff } from "lucide-react";
import { Character, UserState } from "../types";
import { getAvatarColor, getGenreKorean } from "../utils";
import { motion, AnimatePresence } from "motion/react";

interface TagItem {
  name: string;
  type: "trend" | "prefer";
}

interface TagExplorationCardProps {
  characters: Character[];
  userState: UserState;
  onUpdateUserState: (state: UserState) => void;
  onSelectCharacter: (charId: string) => void;
  onExploreTag: (tagOrSearch: string) => void;
}

// Highly comprehensive 24-tag preset classifying Trend-driven and Taste-driven genres
const PRESET_TAG_ITEMS: TagItem[] = [
  // 실시간 트렌드 (최근 24시간 동안 유저 챗 & 검색 누적 70% 비중)
  { name: "하렘", type: "trend" },
  { name: "실시간 랭킹", type: "trend" },
  { name: "신작", type: "trend" },
  { name: "츤데레", type: "trend" },
  { name: "동거", type: "trend" },
  { name: "집착", type: "trend" },
  { name: "얀데레", type: "trend" },
  { name: "여사친", type: "trend" },
  { name: "약점잡힘", type: "trend" },
  { name: "러블리", type: "trend" },
  { name: "일진", type: "trend" },
  { name: "금발", type: "trend" },
  { name: "가스라이팅", type: "trend" },

  // 개인 취향 (유저 프로필 리서치 기반 맞춤 설계 30% 비중)
  { name: "로맨스", type: "prefer" },
  { name: "판타지", type: "prefer" },
  { name: "현대물", type: "prefer" },
  { name: "순애", type: "prefer" },
  { name: "참교육", type: "prefer" },
  { name: "코미디", type: "prefer" },
  { name: "액션", type: "prefer" },
  { name: "아카데미", type: "prefer" },
  { name: "아포칼립스", type: "prefer" },
  { name: "양아치", type: "prefer" },
  { name: "마녀", type: "prefer" },
  { name: "세뇌", type: "prefer" },
  { name: "빙의물", type: "prefer" },
];

export default function TagExplorationCard({
  characters,
  userState,
  onUpdateUserState,
  onSelectCharacter,
  onExploreTag
}: TagExplorationCardProps) {
  const [selectedTag, setSelectedTag] = useState<string>("하렘");
  const [displayedTags, setDisplayedTags] = useState<TagItem[]>([]);
  const [shuffleTrigger, setShuffleTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState<"all" | "trend" | "prefer">("all");

  // Generate recommendation cloud based on 70 / 30 weight policy
  useEffect(() => {
    // 70% Trend tags (Take approx 11-12 tags from 'trend' category)
    const trends = PRESET_TAG_ITEMS.filter((t) => t.type === "trend");
    const shuffledTrends = [...trends].sort(() => 0.5 - Math.random()).slice(0, 11);

    // 30% Preference tags (Take approx 5-6 tags from 'prefer' category)
    const prefers = PRESET_TAG_ITEMS.filter((t) => t.type === "prefer");
    const shuffledPrefers = [...prefers].sort(() => 0.5 - Math.random()).slice(0, 5);

    // Join and randomize display order so they mix perfectly inside the cloud
    const fusedTags = [...shuffledTrends, ...shuffledPrefers].sort(() => 0.5 - Math.random());
    setDisplayedTags(fusedTags);

    // Pick first tag as active if selectedTag is not in the newly generated fused list
    if (activeTab === "all") {
      const hasCurrent = fusedTags.some((t) => t.name === selectedTag);
      if (!hasCurrent && fusedTags.length > 0) {
        setSelectedTag(fusedTags[0].name);
      }
    }
  }, [shuffleTrigger]);

  const handleShuffle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShuffleTrigger((prev) => prev + 1);
  };

  const handleTabChange = (tab: "all" | "trend" | "prefer") => {
    setActiveTab(tab);
    const currentTags = tab === "all" 
      ? displayedTags 
      : PRESET_TAG_ITEMS.filter(t => t.type === tab);
      
    const exists = currentTags.some(t => t.name === selectedTag);
    if (!exists && currentTags.length > 0) {
      setSelectedTag(currentTags[0].name);
    }
  };

  // Smart tag matcher for premium grid display
  const getMatchingCharacters = (tag: string) => {
    const formattedTag = tag.trim().replace("#", "");
    
    let matches = characters.filter((c) => {
      // Apply adult mode filtering
      if (!userState.unlockedAdult && c.isAdult) return false;

      // 1. Direct tag matching
      const hasTag = c.tags?.some((t) => t.toLowerCase().includes(formattedTag.toLowerCase()));
      if (hasTag) return true;
      
      // 2. Fallback genre matching
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

    // Fallback if empty
    if (matches.length === 0) {
      matches = characters.filter((c) => !userState.unlockedAdult ? !c.isAdult : true).slice(0, 5);
    }

    return matches.slice(0, 10); // Display a rich list of matching characters
  };

  const activeCharacters = getMatchingCharacters(selectedTag);

  const tagsToRender = (() => {
    if (activeTab === "all") return displayedTags;
    if (activeTab === "trend") return PRESET_TAG_ITEMS.filter(t => t.type === "trend");
    return PRESET_TAG_ITEMS.filter(t => t.type === "prefer");
  })();

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
    <div 
      id="tag-exploration-card"
      className="w-full relative bg-neutral-950 rounded-3xl border border-neutral-900/60 p-6 sm:p-8 flex flex-col gap-6 md:gap-7 shadow-2xl overflow-hidden"
    >
      {/* Background Ambient Glow Decors */}
      <div className="absolute top-[-50px] right-[-50px] w-48 h-48 rounded-full bg-indigo-900/10 blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-[-30px] left-[-30px] w-60 h-60 rounded-full bg-blue-950/15 blur-[120px] pointer-events-none z-0" />

      {/* Header metadata */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] md:text-sm font-black tracking-widest text-[#7c6cff] uppercase flex items-center gap-1.5 leading-none mb-1">
            <Sparkles className="w-3.5 h-3.5" /> SMART RECOMMENDATION POLICIES
          </span>
          <h3 className="text-lg md:text-2xl font-extrabold text-neutral-100 tracking-tight leading-snug">
            원하시는 태그 피드를 클릭해 보세요!
          </h3>
          <p className="text-xs text-neutral-500 font-medium">유저들의 실시간 검색 추이와 관심사 데이터를 정교하게 분류하여 취향별 최적의 대상을 제안합니다.</p>
        </div>

        {/* Dynamic 70% + 30% Policy Indicator */}
        <div className="flex flex-wrap items-center gap-2 shrink-0 select-none">
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-neutral-900/50 border border-neutral-900 text-[10px] font-bold text-neutral-400">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              <span>실시간 트렌드 70%</span>
            </div>
            <span className="text-neutral-800">|</span>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7c6cff]" />
              <span>개인 취향 30%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Segmented Category Filter Tabs Row */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-900/40 pb-4">
        <div className="flex bg-[#0b0b0d] p-1 rounded-xl border border-neutral-900/80 self-start sm:self-auto">
          <button
            onClick={() => handleTabChange("all")}
            className={`px-4 py-2 rounded-lg text-xs font-black tracking-tight cursor-pointer transition-all flex items-center gap-1.5 ${
              activeTab === "all"
                ? "bg-[#18181c] text-white shadow-sm border border-neutral-800"
                : "text-neutral-500 hover:text-neutral-300 border border-transparent"
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>온 에어 추천</span>
          </button>
          <button
            onClick={() => handleTabChange("trend")}
            className={`px-4 py-2 rounded-lg text-xs font-black tracking-tight cursor-pointer transition-all flex items-center gap-1.5 ${
              activeTab === "trend"
                ? "bg-[#18181c] text-white shadow-sm border border-neutral-800"
                : "text-neutral-500 hover:text-neutral-300 border border-transparent"
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-orange-500" />
            <span>실시간 핫</span>
          </button>
          <button
            onClick={() => handleTabChange("prefer")}
            className={`px-4 py-2 rounded-lg text-xs font-black tracking-tight cursor-pointer transition-all flex items-center gap-1.5 ${
              activeTab === "prefer"
                ? "bg-[#18181c] text-white shadow-sm border border-neutral-800"
                : "text-neutral-500 hover:text-neutral-300 border border-transparent"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#a094ff]" />
            <span>취향 맞춤</span>
          </button>
        </div>

        {activeTab === "all" && (
          <button
            onClick={handleShuffle}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1d1d23]/80 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-xs font-black text-neutral-300 hover:text-white transition-all cursor-pointer active:scale-95 shadow-sm self-end sm:self-auto"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>태그 교체</span>
          </button>
        )}
      </div>

      {/* Cloud Cluster of Dynamic Tags */}
      <div className="relative z-10 flex flex-wrap justify-start items-center gap-2 px-1">
        {tagsToRender.map((tagItem) => {
          const isActive = selectedTag === tagItem.name;
          const isTrend = tagItem.type === "trend";

          return (
            <button
              key={tagItem.name}
              onClick={() => setSelectedTag(tagItem.name)}
              className={`group/tag relative px-4 py-2 rounded-full text-xs sm:text-[13px] font-extrabold tracking-tight transition-all cursor-pointer select-none active:scale-95 flex items-center gap-1.5 border ${
                isActive
                  ? "bg-gradient-to-r from-[#691eff]/15 via-[#7a4aff]/15 to-[#00cbd6]/10 border-[#7c6cff]/40 text-[#ffffff] shadow-[0_4px_20px_rgba(118,50,255,0.22)]"
                  : isTrend
                    ? "bg-neutral-900/40 hover:bg-neutral-800/60 border-neutral-900/60 text-neutral-400 hover:text-neutral-100"
                    : "bg-neutral-900/40 hover:bg-neutral-800/60 border-neutral-900/60 text-neutral-400 hover:text-neutral-100"
              }`}
            >
              {/* Hash prefix */}
              {isActive ? (
                <span className="text-[#a89eff]">#</span>
              ) : (
                <span className={`transition-colors duration-200 ${
                  isTrend 
                    ? "text-[#fc5a2a]/50 group-hover/tag:text-[#fc5a2a]" 
                    : "text-[#a094ff]/50 group-hover/tag:text-[#a094ff]"
                }`}>#</span>
              )}

              <span>{tagItem.name}</span>

              {/* Custom micro-indicator light */}
              {isActive ? (
                <span className="inline-block w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,211,238,1)]" />
              ) : (
                <span className={`w-1.5 h-1.5 rounded-full transition-all duration-300 opacity-60 group-hover/tag:scale-150 group-hover/tag:opacity-100 ${
                  isTrend ? "bg-orange-500" : "bg-[#7c6cff]"
                }`} />
              )}
            </button>
          );
        })}
      </div>

      {/* Premium Full Curation Grid Section */}
      <div className="relative z-10 w-full mt-4 flex flex-col gap-5 border-t border-neutral-900/40 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-400 animate-pulse" />
            <h4 className="text-sm md:text-base font-extrabold text-neutral-100 flex items-center gap-1.5">
              <span className="text-[#a094ff] font-black">#{selectedTag}</span> 매칭 핵심 콘텐츠
            </h4>
          </div>

          <button
            onClick={() => onExploreTag(selectedTag)}
            className="text-xs font-black text-[#8e7fff] hover:text-[#aaa0ff] flex items-center gap-1 group/btn transition-colors cursor-pointer"
          >
            <span>이 태그로 전체 탐색</span>
            <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Curation aspect-[2/3] grid mirroring CurationSection.tsx premium standard */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
          <AnimatePresence mode="popLayout">
            {activeCharacters.map((c) => {
              const isFav = userState.favorites.includes(c.id);
              return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  whileHover={{ y: -6, scale: 1.01 }}
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
                    {isFav ? (
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    ) : (
                      <StarOff className="w-3.5 h-3.5 text-white/70" />
                    )}
                  </button>

                  {/* Overlaid Content Metadata Container */}
                  <div className="relative z-20 p-3.5 md:p-4 flex flex-col justify-end w-full">
                    <div>
                      <h4 className="font-extrabold text-xs md:text-base text-neutral-100 group-hover:text-[#b9adff] transition-colors truncate">
                        {c.name}
                      </h4>
                      
                      <p className="text-[11px] md:text-xs text-neutral-300 line-clamp-2 leading-relaxed mt-1 font-medium italic">
                        {c.tagline}
                      </p>
                    </div>

                    {/* Concept Tags list */}
                    <div className="mt-2 flex flex-row flex-nowrap gap-[6px] justify-start items-center overflow-hidden whitespace-nowrap text-ellipsis">
                      {c.tags && c.tags.length > 0 ? (
                        c.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-[10px] md:text-[11px] font-bold tracking-tight text-[#b9adff]/90 hover:text-[#c7bdff] transition-colors inline-block shrink-0">
                            {tag.replace("#관계:", "#").replace("#성격:", "#").replace("#특징:", "#")}
                          </span>
                        ))
                      ) : (
                        <span className="text-[10px] md:text-[11px] font-bold tracking-tight text-[#b9adff]/90 inline-block shrink-0">
                          #{getGenreKorean(c.genre)}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
