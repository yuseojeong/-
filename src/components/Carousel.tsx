import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Compass, Users } from "lucide-react";
import { Character, NovelWorld } from "../types";

interface CarouselProps {
  characters: Character[];
  novels: NovelWorld[];
  onSelectNovel: (novel: NovelWorld) => void;
}

export default function Carousel({ characters, novels, onSelectNovel }: CarouselProps) {
  const [currentIndex, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (novels.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % novels.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [novels.length]);

  const nextSlide = () => {
    if (novels.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % novels.length);
  };

  const prevSlide = () => {
    if (novels.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + novels.length) % novels.length);
  };

  const activeNovel = novels[currentIndex];
  if (!activeNovel) return null;

  // Find character objects belonging to this novel
  const novelCharacters = characters.filter((char) =>
    activeNovel.characterIds.includes(char.id)
  );

  return (
    <div className="relative w-full h-[340px] md:h-[440px] overflow-hidden select-none bg-[#070709] rounded-3xl border border-[#222]/40 shadow-2xl">
      {/* Immersive background artwork spanning the entire area */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeNovel.id}
            initial={{ opacity: 0, scale: 1.12 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="absolute inset-0"
          >
            {activeNovel.bgImage ? (
              <img
                src={activeNovel.bgImage}
                alt=""
                className="absolute inset-0 w-full h-full object-cover filter blur-[2px] opacity-75 object-center scale-102"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-tr from-[#14121f] to-[#1e1a3a] filter blur-md opacity-80" />
            )}
            {/* Elegant multi-directional translucent gradient overlays to ensure absolute text premium contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#020202]/95 via-[#020202]/65 to-black/30 z-0" />
            <div className="absolute inset-y-0 left-0 w-full md:w-3/4 bg-gradient-to-r from-[#020202]/90 via-[#020202]/40 to-transparent z-0" />
          </motion.div>
        </AnimatePresence>

        {/* Subtle grid accent design over blurred background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.008)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.008)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
      </div>

      {/* Main slides layout viewport */}
      <div className="relative z-10 w-full h-full flex items-center justify-between px-2 md:px-8">
        
        {/* Left Arrow Controls */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            prevSlide();
          }}
          className="p-2 md:p-3 rounded-full bg-black/50 border border-white/5 hover:bg-black/90 hover:scale-105 active:scale-95 transition-all text-neutral-300 hover:text-white cursor-pointer z-20 shrink-0"
        >
          <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
        </button>

        {/* Core Novel content slot */}
        <div className="flex-1 max-w-[1020px] h-full flex items-center px-1 md:px-6 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeNovel.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.45 }}
              className="w-full h-full py-4 flex flex-col md:flex-row items-center justify-center md:justify-between gap-6 md:gap-14 text-left cursor-pointer group/slide"
              onClick={() => onSelectNovel(activeNovel)}
            >
              
              {/* Left Info Panel: Title & Worldview Descriptions */}
              <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left min-w-0 justify-center">
                {/* Visual indicator badge */}
                <span className="flex items-center gap-1.5 text-[10px] md:text-xs font-black tracking-wider uppercase text-[#a995ff] bg-[#7c6cff]/10 border border-[#7c6cff]/20 px-3 py-1 rounded-full mb-3 select-none">
                  <Compass className="w-3.5 h-3.5" />
                  WORLD DIMENSION
                </span>

                {/* World Title */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight select-none group-hover/slide:text-[#b09dff] transition-colors duration-200">
                  {activeNovel.title}
                </h1>

                {/* Tagline showing core hook */}
                <p className="text-[#cac4ff] font-semibold text-xs sm:text-sm md:text-base mt-2 max-w-[620px] line-clamp-1 leading-relaxed tracking-tight select-none">
                  “{activeNovel.tagline}”
                </p>

                {/* Broad Worldview Summary */}
                <p className="text-neutral-400 font-medium text-[11px] md:text-xs lg:text-[13px] mt-3 max-w-[650px] line-clamp-2 md:line-clamp-3 leading-relaxed tracking-normal select-none hidden sm:block">
                  {activeNovel.synopsis}
                </p>

                {/* Premium Call to Action trigger indicator */}
                <div className="mt-5 flex items-center gap-2 group-hover/slide:translate-x-1.5 transition-transform duration-300">
                  <span className="text-[11px] md:text-xs font-bold text-[#b09dff]">세계관 상세 설정 & 캐스트 보기</span>
                  <ChevronRight className="w-3 md:w-4 h-3 md:h-4 text-[#a995ff]" />
                </div>
              </div>

              {/* Right Cast Panel: Characters belonging to this world */}
              <div className="hidden md:flex flex-col w-[260px] lg:w-[280px] bg-black/40 border border-white/5 backdrop-blur-md rounded-2xl p-4 shrink-0 transition-all duration-300 hover:border-[#7c6cff]/30 hover:bg-black/50 select-none">
                <div className="flex items-center gap-1.5 justify-start mb-3 border-b border-white/5 pb-2">
                  <Users className="w-4 h-4 text-[#a995ff]" />
                  <span className="text-[10px] lg:text-xs font-black text-neutral-300 tracking-tight">등장 캐릭터 캐스팅 ({novelCharacters.length})</span>
                </div>
                
                {/* Vertical Avatar list with inline names */}
                <div className="flex flex-col gap-2.5 max-h-[220px] overflow-y-auto pr-1">
                  {novelCharacters.slice(0, 4).map((char) => (
                    <div key={char.id} className="flex items-center gap-3 group/char text-[#e1e2e7] hover:text-white transition-colors">
                      <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-white/10 group-hover/char:border-[#a995ff]/40 transition-all duration-300">
                        <img
                          src={char.avatar}
                          alt={char.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover/char:scale-108 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex flex-col min-w-0 text-left">
                        <span className="text-xs font-bold leading-tight tracking-tight text-neutral-200 group-hover/char:text-white">{char.name}</span>
                        <span className="text-[9.5px]/none text-neutral-400 truncate mt-0.5 max-w-[190px]">{char.tagline}</span>
                      </div>
                    </div>
                  ))}
                  {novelCharacters.length > 4 && (
                    <div className="text-[10px] text-center text-neutral-500 font-medium py-1">
                      외 {novelCharacters.length - 4}명의 인물 더보기...
                    </div>
                  )}
                </div>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Arrow Controls */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            nextSlide();
          }}
          className="p-2 md:p-3 rounded-full bg-black/50 border border-white/5 hover:bg-black/90 hover:scale-105 active:scale-95 transition-all text-neutral-300 hover:text-white cursor-pointer z-20 shrink-0"
        >
          <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
        </button>

      </div>

      {/* Pagination indicators bottom track slider */}
      <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-1.5">
        {novels.map((novel, idx) => (
          <button
            key={novel.id}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentSlide(idx);
            }}
            className={`w-1.5 md:w-2 h-1.5 md:h-2 rounded-full transition-all duration-300 cursor-pointer ${
              currentIndex === idx ? "w-6 md:w-8 bg-[#7c6cff]" : "bg-neutral-600 hover:bg-neutral-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
