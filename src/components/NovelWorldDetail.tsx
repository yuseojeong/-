import React, { useEffect, useState } from "react";
import { Character, NovelWorld, UserState } from "../types";
import { ChevronLeft, Star, StarOff, BookOpen, Users, Eye, ThumbsUp, Bookmark, ExternalLink, MessageSquare, Heart } from "lucide-react";
import { motion } from "motion/react";
import { getAvatarColor } from "../utils";

interface NovelWorldDetailProps {
  novel: NovelWorld;
  characters: Character[];
  userState: UserState;
  onUpdateUserState: (state: UserState) => void;
  onSelectCharacter: (charId: string) => void;
  onBack: () => void;
}

export default function NovelWorldDetail({
  novel,
  characters,
  userState,
  onUpdateUserState,
  onSelectCharacter,
  onBack,
}: NovelWorldDetailProps) {
  const [activeTab, setActiveTab] = useState<"content" | "characters">("content");

  // Lock body scroll of the parent page when this overlay is active to ensure proper scrolling experience inside the modal
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Filter characters belonging to this novel
  const novelCharacters = characters.filter((c) => novel.characterIds.includes(c.id));

  const toggleFavorite = (charId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    let updatedFavs = [...userState.favorites];
    if (updatedFavs.includes(charId)) {
      updatedFavs = updatedFavs.filter((id) => id !== charId);
    } else {
      updatedFavs.push(charId);
    }
    onUpdateUserState({ ...userState, favorites: updatedFavs });
  };

  const stats = novel.novelStats || {
    author: "공식 작가",
    views: "1.2M",
    recommendations: "45.8K",
    favorites: "12,900",
    chapters: "140화 연재",
    novelpiaUrl: "https://novelpia.com",
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-[150] flex items-center justify-center p-3 sm:p-5 md:p-8 select-none"
      onClick={onBack}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl h-[90vh] md:h-[82vh] bg-[#0c0c0d] border border-neutral-900 rounded-2xl md:rounded-3xl shadow-2xl overflow-y-auto flex flex-col scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent"
      >
        {/* 1. Ambient Hero Header Image with fade gradient to transparent at the bottom */}
        <div className="relative w-full h-[180px] sm:h-[220px] md:h-[260px] overflow-hidden shrink-0">
          {/* Real-time World background illustration representing the setting */}
          <img
            src={novel.bgImage}
            alt={novel.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-45 scale-101 transition-transform duration-700 hover:scale-[1.03]"
          />

          {/* Ambient Overlay Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0d] via-[#0c0c0d]/70 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0c0c0d]/60 via-transparent to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0c0c0d]/30 via-transparent to-[#0c0c0d]/30 z-10" />

          {/* Elegant Top Right Close Action */}
          <button
            onClick={onBack}
            className="absolute top-4 right-4 z-40 p-2 md:p-2.5 rounded-full bg-black/50 hover:bg-neutral-850 text-white/80 hover:text-white transition-all active:scale-95 border border-white/10 cursor-pointer flex items-center justify-center backdrop-blur-sm shadow-lg"
          >
            <svg className="w-4 h-4 md:w-4.5 md:h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Floating Content Overlays */}
          <div className="absolute bottom-4 sm:bottom-5 left-0 right-0 px-4 md:px-8 z-20">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] md:text-xs font-black text-[#8a72ff] tracking-widest uppercase bg-[#8a72ff]/15 border border-[#8a72ff]/25 py-0.5 px-2.5 rounded-full w-fit">
                공식 세계관 오리지널
              </span>

              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-none mt-1">
                {novel.title}
              </h1>

              {novel.tagline && (
                <p className="text-[11px] sm:text-xs md:text-sm text-neutral-300 font-semibold tracking-tight max-w-2xl leading-relaxed mt-0.5 opacity-90 line-clamp-2 md:line-clamp-none">
                  {novel.tagline}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Custom Tab Selection Header (내용 vs 캐릭터) */}
        <div className="flex border-b border-neutral-900 mx-4 md:mx-8 select-none shrink-0 mt-2">
          <button
            onClick={() => setActiveTab("content")}
            className={`pb-3 text-xs sm:text-sm font-extrabold tracking-tight transition-all border-b-2 px-6 cursor-pointer flex items-center gap-1.5 ${
              activeTab === "content"
                ? "border-[#7c6cff] text-white"
                : "border-transparent text-neutral-500 hover:text-neutral-300"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>내용</span>
          </button>
          <button
            onClick={() => setActiveTab("characters")}
            className={`pb-3 text-xs sm:text-sm font-extrabold tracking-tight transition-all border-b-2 px-6 cursor-pointer flex items-center gap-1.5 ${
              activeTab === "characters"
                ? "border-[#7c6cff] text-white"
                : "border-transparent text-neutral-500 hover:text-neutral-300"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>캐릭터 ({novelCharacters.length})</span>
          </button>
        </div>

        {/* 2. Main Content (Tabbed content view) */}
        <div className="p-4 sm:p-5 md:p-8 flex-1">
          {activeTab === "content" ? (
            <motion.div
              key="content-panel"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              <div className="bg-[#111112] border border-neutral-900 rounded-2xl p-5 md:p-6 shadow-xl space-y-3.5">
                <p className="text-sm md:text-base text-neutral-300 font-semibold leading-relaxed whitespace-pre-line text-justify">
                  {novel.synopsis}
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="characters-panel"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              {/* Grid layout mirroring screenshot nicely */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 md:gap-4">
                {novelCharacters.map((c) => {
                  const isFav = userState.favorites.includes(c.id);
                  return (
                    <motion.div
                      key={c.id}
                      whileHover={{ y: -4, scale: 1.01 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      onClick={() => onSelectCharacter(c.id)}
                      className="group relative cursor-pointer bg-[#141416] rounded-xl border border-neutral-900 hover:border-[#7c6cff]/40 overflow-hidden flex flex-col justify-end shadow-xl aspect-[2/3] w-full"
                    >
                      {/* Full Background Image */}
                      {c.avatar ? (
                        <img
                          src={c.avatar}
                          alt={c.name}
                          referrerPolicy="no-referrer"
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-104 transition-transform duration-500 z-0"
                        />
                      ) : (
                        <div className={`absolute inset-0 bg-gradient-to-tr ${getAvatarColor(c.id)} opacity-80 group-hover:scale-104 transition-transform duration-500 z-0`} />
                      )}

                      {/* Dark gradient shadow fading transparent bottom-to-top */}
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/75 to-transparent backdrop-blur-[0.5px] z-10" />

                      {/* Favorite toggle star */}
                      <button
                        onClick={(e) => toggleFavorite(c.id, e)}
                        className="absolute top-2 right-2 p-1 rounded-full bg-black/45 text-neutral-300 hover:text-yellow-400 backdrop-blur-sm z-30 transition-all active:scale-90 cursor-pointer"
                      >
                        {isFav ? <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> : <StarOff className="w-3 h-3 text-white/70" />}
                      </button>

                      {/* Tag badge or character label in the bottom */}
                      <div className="relative z-20 p-3 md:p-3.5 flex flex-col justify-end w-full">
                        <div>
                          <h4 className="font-extrabold text-xs md:text-sm text-neutral-100 group-hover:text-[#b9adff] transition-colors truncate">
                            {c.name}
                          </h4>
                          <p className="text-[9px] md:text-[10px] text-neutral-400 font-bold truncate mt-0.5">
                            {c.title}
                          </p>
                          <p className="text-[10px] md:text-xs text-neutral-300 line-clamp-2 leading-tight mt-1 font-medium">
                            {c.tagline}
                          </p>
                        </div>

                        {/* Meta views counters */}
                        <div className="flex items-center gap-2.5 mt-2 pt-1.5 border-t border-white/5 text-[9px] text-neutral-500 font-sans font-extrabold">
                          <span className="flex items-center gap-1">
                            <Eye className="w-2.5 h-2.5 text-neutral-500" />
                            {c.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-2.5 h-2.5 text-neutral-500" />
                            {c.chats}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-2.5 h-2.5 text-neutral-500" />
                            {c.likes}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>

      </motion.div>
    </div>
  );
}
