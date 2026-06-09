import React from "react";
import { Character } from "../types";
import { X, BookOpen, Eye, ThumbsUp, Bookmark, Layers, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface NovelDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  character: Character | null;
}

export default function NovelDetailModal({ isOpen, onClose, character }: NovelDetailModalProps) {
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

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#000]/80 backdrop-blur-sm"
        />

        {/* Modal content body */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.4 }}
          className="relative w-full max-w-lg bg-[#111112] border border-neutral-800/80 rounded-2xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[85vh]"
          style={{ borderTop: `4px solid ${character.bannerColor || "#7c6cff"}` }}
        >
          {/* Header background with gentle gradient */}
          <div className="p-5 md:p-6 pb-4 border-b border-neutral-900 flex justify-between items-start">
            <div className="space-y-1.5 flex-1 pr-6">
              <h2 className="text-lg md:text-xl font-black text-white leading-tight tracking-tight">
                {character.title}
              </h2>
              <p className="text-xs text-neutral-400 font-bold">
                원작 작가: <span className="text-[#eee]">{stats.author}</span>
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-full transition-all focus:outline-none cursor-pointer"
              aria-label="닫기"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal body scroll container */}
          <div className="p-5 md:p-6 overflow-y-auto space-y-6 flex-1 scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent">
            {/* Stats Indicator Grid */}
            <div className="bg-[#0a0a0b] border border-neutral-900/60 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-[10px] font-bold text-neutral-500 font-sans">
                  <Eye className="w-3.5 h-3.5" />
                  <span>조회수</span>
                </div>
                <p className="text-sm font-black text-white font-mono">{stats.views}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1 text-[10px] font-bold text-neutral-500 font-sans">
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>추천수</span>
                </div>
                <p className="text-sm font-black text-white font-mono">{stats.recommendations}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1 text-[10px] font-bold text-neutral-500 font-sans">
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>선작수</span>
                </div>
                <p className="text-sm font-black text-white font-mono">{stats.favorites}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1 text-[10px] font-bold text-neutral-500 font-sans">
                  <Layers className="w-3.5 h-3.5" />
                  <span>연재 정보</span>
                </div>
                <p className="text-sm font-black text-[#7c6cff]">{stats.chapters}</p>
              </div>
            </div>

            {/* Synopsis Section */}
            <div className="space-y-2">
              <h3 className="text-xs md:text-sm font-extrabold text-neutral-300 flex items-center gap-1.5 pr-2 border-b border-neutral-900 pb-1.5">
                <BookOpen className="w-4 h-4 text-[#7c6cff]" />
                <span>줄거리 요약</span>
              </h3>
              <p className="text-xs md:text-sm text-neutral-400 font-semibold leading-relaxed whitespace-pre-line text-justify">
                {stats.synopsis}
              </p>
            </div>
          </div>

          {/* Footer Action buttons */}
          <div className="p-5 md:p-6 pt-4 border-t border-neutral-900 bg-[#0a0a0b]/40 flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 text-xs font-bold text-neutral-400 hover:text-white bg-neutral-900 hover:bg-neutral-850 rounded-xl transition-all cursor-pointer border border-neutral-800/40 text-center"
            >
              닫기
            </button>
            <a
              href={stats.novelpiaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 bg-[#7632ff] hover:bg-[#8649ff] text-white text-xs font-black rounded-xl transition-all shadow-lg flex items-center justify-center gap-1.5 cursor-pointer text-center"
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
