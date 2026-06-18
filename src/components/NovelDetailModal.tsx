import React from "react";
import { Character } from "../types";
import { X, BookOpen, Eye, ThumbsUp, Bookmark, Layers, ExternalLink, Users } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { INITIAL_CHARACTERS } from "../data";
import { getAvatarColor } from "../utils";

interface NovelDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  character: Character | null;
  onSelectCharacter?: (charId: string) => void;
}

export default function NovelDetailModal({ isOpen, onClose, character, onSelectCharacter }: NovelDetailModalProps) {
  const [activeTab, setActiveTab] = React.useState<"content" | "characters">("content");

  React.useEffect(() => {
    if (isOpen) {
      setActiveTab("content");
    }
  }, [isOpen, character?.id]);

  if (!isOpen || !character) return null;

  const stats = character.novelStats || {
    author: "작가 정보 없음",
    views: "0",
    recommendations: "0",
    favorites: "0",
    chapters: "정보 없음",
    synopsis: character.description,
    worldview: "세계관 정보가 없습니다.",
    novelpiaUrl: "https://novelpia.com"
  };

  const relatedCharacters = INITIAL_CHARACTERS.filter((c) => c.title === character.title);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#000]/85 backdrop-blur-sm"
        />

        {/* Modal content body */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 18 }}
          transition={{ type: "spring", duration: 0.4, bounce: 0.1 }}
          className="relative w-full max-w-lg bg-[#111112] border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[85vh]"
          style={{ borderTop: `4px solid ${character.bannerColor || "#7c6cff"}` }}
        >
          {/* Header background with gentle gradient */}
          <div className="p-5 md:p-6 pb-4 border-b border-neutral-900/60 flex justify-between items-start">
            <div className="space-y-1 flex-1 pr-6">
              <h2 className="text-base md:text-lg font-black text-white leading-tight tracking-tight">
                {character.title}
              </h2>
              <p className="text-[11px] text-neutral-400 font-bold">
                원작 작가: <span className="text-neutral-200">{stats.author}</span>
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-full transition-all focus:outline-none cursor-pointer"
              aria-label="닫기"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Modal body scroll container */}
          <div className="p-5 md:p-6 overflow-y-auto space-y-5 flex-1 scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent">
            {/* Stats Indicator Grid */}
            <div className="bg-[#0a0a0b]/80 border border-neutral-900/60 rounded-xl p-3.5 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1 text-[9px] md:text-[10px] font-bold text-neutral-500 font-sans">
                  <Eye className="w-3 h-3" />
                  <span>조회수</span>
                </div>
                <p className="text-xs md:text-sm font-black text-white font-mono">{stats.views}</p>
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-1 text-[9px] md:text-[10px] font-bold text-neutral-500 font-sans">
                  <ThumbsUp className="w-3 h-3" />
                  <span>추천수</span>
                </div>
                <p className="text-xs md:text-sm font-black text-white font-mono">{stats.recommendations}</p>
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-1 text-[9px] md:text-[10px] font-bold text-neutral-500 font-sans">
                  <Bookmark className="w-3 h-3" />
                  <span>선작수</span>
                </div>
                <p className="text-xs md:text-sm font-black text-white font-mono">{stats.favorites}</p>
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-1 text-[9px] md:text-[10px] font-bold text-neutral-500 font-sans">
                  <Layers className="w-3 h-3" />
                  <span>연재 정보</span>
                </div>
                <p className="text-xs md:text-sm font-black text-[#7c6cff]">{stats.chapters}</p>
              </div>
            </div>

            {/* Custom Tab Selection Header (내용 vs 캐릭터) */}
            <div className="flex border-b border-neutral-900 mt-2 select-none">
              <button
                onClick={() => setActiveTab("content")}
                className={`flex-1 pb-2.5 text-xs md:text-sm font-extrabold tracking-tight transition-all border-b-2 text-center cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === "content"
                    ? "border-[#7c6cff] text-white"
                    : "border-transparent text-neutral-500 hover:text-neutral-300"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>내용</span>
              </button>
              <button
                onClick={() => setActiveTab("characters")}
                className={`flex-1 pb-2.5 text-xs md:text-sm font-extrabold tracking-tight transition-all border-b-2 text-center cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === "characters"
                    ? "border-[#7c6cff] text-white"
                    : "border-transparent text-neutral-500 hover:text-neutral-300"
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>캐릭터 ({relatedCharacters.length})</span>
              </button>
            </div>

            {/* Tab Contents Area */}
            <div className="min-h-[160px]">
              {activeTab === "content" ? (
                <motion.div
                  key="content-tab"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-2 text-justify"
                >
                  <p className="text-[12px] md:text-[13px] text-neutral-400 font-semibold leading-relaxed whitespace-pre-line">
                    {stats.synopsis}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="characters-tab"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-2.5"
                >
                  {relatedCharacters.length > 0 ? (
                    relatedCharacters.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => {
                          if (onSelectCharacter) {
                            onSelectCharacter(c.id);
                          }
                        }}
                        className={`flex items-center gap-3 p-2 md:p-2.5 rounded-xl border border-neutral-900/80 bg-[#161618]/30 hover:bg-[#1a1a1d] transition-all cursor-pointer group ${
                          c.id === character.id ? "border-[#7c6cff]/40 bg-[#171524]/30" : "hover:border-neutral-800"
                        }`}
                      >
                        {/* Avatar Image or Custom Circle */}
                        <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-neutral-800 bg-[#0d0d0e]">
                          {c.avatar ? (
                            <img
                              src={c.avatar}
                              alt={c.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className={`w-full h-full bg-gradient-to-tr ${getAvatarColor(c.id)}`} />
                          )}
                        </div>

                        {/* Name & Tagline description info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[12px] md:text-[13px] font-black text-neutral-100 group-hover:text-[#b8adff] transition-colors truncate">
                              {c.name}
                            </span>
                            {c.id === character.id && (
                              <span className="text-[8px] font-black text-[#8a72ff] bg-[#8a72ff]/10 py-0.5 px-1.5 rounded-full uppercase tracking-wider">
                                현재 캐릭터
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] md:text-[11px] text-neutral-400 font-bold truncate mt-0.5">
                            {c.tagline}
                          </p>
                        </div>

                        {/* Hover Action prompt */}
                        <div className="shrink-0 text-[#8a72ff] md:opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-[10px] font-extrabold tracking-tight bg-[#8a72ff]/10 px-2 py-1 rounded-lg border border-[#8a72ff]/20">
                            선택
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-neutral-500 text-xs">
                      이 소설에 등록된 다른 캐릭터가 없습니다.
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>

          {/* Footer Action buttons */}
          <div className="p-5 md:p-6 pt-4 border-t border-neutral-900 bg-[#0a0a0b]/40 flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 md:py-3 text-xs font-bold text-neutral-400 hover:text-white bg-neutral-900 hover:bg-neutral-850 rounded-xl transition-all cursor-pointer border border-neutral-800/40 text-center"
            >
              닫기
            </button>
            <a
              href={stats.novelpiaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 md:py-3 bg-[#7632ff] hover:bg-[#8649ff] text-white text-xs font-black rounded-xl transition-all shadow-lg flex items-center justify-center gap-1.5 cursor-pointer text-center"
            >
              <span>원작 소설 보러가기</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
