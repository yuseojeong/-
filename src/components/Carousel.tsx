import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Play, Eye, MessageSquare } from "lucide-react";
import { Character } from "../types";
import { getAvatarColor } from "../utils";

interface CarouselProps {
  characters: Character[];
  onSelectCharacter: (charId: string) => void;
}

export default function Carousel({ characters, onSelectCharacter }: CarouselProps) {
  // Select top characters for the carousel
  const carouselItems = characters.filter((c) =>
    ["amelia", "sooa", "ohhana", "saebyeok", "commander"].includes(c.id)
  );

  const [currentIndex, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [carouselItems.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
  };

  // Function to provide concept hashtag tags for carousel items
  const getConceptTags = (id: string): string[] => {
    switch (id) {
      case "amelia":
        return ["마녀도시", "금발마녀", "츤데레", "판타지", "마녀조수"];
      case "sooa":
        return ["원룸패밀리", "거유순둥이", "동거로맨스", "로맨스", "가출녀"];
      case "ohhana":
        return ["동거하우스", "금발미녀", "폭풍에너지", "두근두근", "하렘"];
      case "saebyeok":
        return ["문담피고교", "츤데레녀", "츤데레", "고교일상", "일진"];
      case "commander":
        return ["아포칼립스", "유일한인간", "지휘관", "SF미래", "생존기"];
      default:
        return ["인기캐릭터", "AI챗", "서브컬처", "가상연애"];
    }
  };

  const activeChar = carouselItems[currentIndex];
  if (!activeChar) return null;

  return (
    <div className="relative w-full h-[320px] md:h-[450px] overflow-hidden select-none bg-[#0a0a0c] rounded-3xl border border-[#222]/50 shadow-2xl">
      {/* Blurred background corresponding to the current character card or artwork */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeChar.id}
            initial={{ opacity: 0, scale: 1.15 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            {activeChar.avatar ? (
              <img
                src={activeChar.avatar}
                alt=""
                className="absolute inset-0 w-full h-full object-cover filter blur-xl opacity-30 object-center scale-105"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className={`absolute inset-0 bg-gradient-to-tr ${getAvatarColor(activeChar.id)} filter blur-2xl opacity-40`} />
            )}
            {/* Dark vignette gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-[#020202]/30 to-[#020202]/80 z-0" />
            <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-[#020202]/90 to-transparent z-0 hidden md:block" />
          </motion.div>
        </AnimatePresence>
        
        {/* Subtle grid pattern over blurred wallpaper */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:30px_34px] pointer-events-none"></div>
      </div>

      {/* Main Slideshow viewport */}
      <div className="relative z-10 w-full h-full flex items-center justify-between px-2 md:px-[40px]">
        
        {/* Left Arrow */}
        <button
          onClick={prevSlide}
          className="p-1.5 md:p-3 rounded-full bg-black/40 border border-white/5 hover:bg-black/80 hover:scale-105 active:scale-95 transition-all text-neutral-300 hover:text-white cursor-pointer z-20 shrink-0"
        >
          <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
        </button>

        {/* Carousel Content Container (Two-column layout on Desktop, Centered stack on Mobile) */}
        <div className="flex-1 max-w-[1040px] h-full flex items-center px-1 md:px-8 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeChar.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full flex flex-col md:flex-row items-center md:justify-between gap-6 md:gap-10 text-left"
            >
              
              {/* Left Column: Text Metadata & Actions */}
              <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left min-w-0">
                {/* Badges - restricted strictly to status (BEST, NEW, HOT, UPDATE) */}
                <div className="flex flex-wrap gap-1.5 justify-center md:justify-start mb-2 md:mb-3.5">
                  {activeChar.badgeText?.map((b) => (
                    <span
                      key={b}
                      className={`text-[9px] md:text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full ${
                        b === "BEST"
                          ? "bg-[#3a5cff] text-white"
                          : b === "NEW"
                          ? "bg-[#5c9d1a] text-white"
                          : "bg-[#ff3a54] text-white"
                      }`}
                    >
                      {b}
                    </span>
                  ))}
                </div>

                {/* H1 displays character name */}
                <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight leading-tight line-clamp-1">
                  {activeChar.name}
                </h1>
                <p className="text-neutral-300 text-sm md:text-base font-medium mt-1.5 px-1 max-w-[520px] line-clamp-1 opacity-95">
                  {activeChar.tagline}
                </p>

                {/* Concept hashtags mapping - strictly limited to top 3 */}
                <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
                  {getConceptTags(activeChar.id).slice(0, 3).map((tag) => (
                    <span 
                      key={tag} 
                      className="text-xs md:text-sm font-semibold text-neutral-300 bg-neutral-800/60 border border-neutral-700/40 px-2.5 py-0.5 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Accumulation stats */}
                <div className="flex gap-4 mt-3 text-neutral-400 text-[10px] md:text-xs hidden sm:flex">
                  <span className="flex items-center gap-1.5"><Eye className="w-3 md:w-3.5 h-3 md:h-3.5 text-neutral-500" /> 누적 조회 {activeChar.views?.toLocaleString()}</span>
                  <span className="flex items-center gap-1.5"><MessageSquare className="w-3 md:w-3.5 h-3 md:h-3.5 text-neutral-500" /> 누적 대화 {activeChar.chats?.toLocaleString()}</span>
                </div>

                {/* Chat action button */}
                <button
                  onClick={() => onSelectCharacter(activeChar.id)}
                  className="mt-4 md:mt-6 px-5 md:px-[25px] py-2 md:py-3 bg-white text-black font-extrabold text-xs md:text-sm rounded-full flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/50 hover:bg-neutral-100 cursor-pointer"
                >
                  <Play className="w-3 h-3 fill-black text-black" />
                  <span>대화 시작하기</span>
                </button>
              </div>

              {/* Right Column: Character Portrait Card (Responsive size, Desktop featured element) */}
              <div className="w-[140px] sm:w-[180px] md:w-[600px] md:h-[330px] aspect-[4/5] md:aspect-auto shrink-0 rounded-2xl overflow-hidden border-2 border-white/10 hover:border-[#7632ff]/40 shadow-2xl relative group transition-all duration-300 hidden md:block">
                {activeChar.avatar ? (
                  <img
                    src={activeChar.avatar}
                    alt={activeChar.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-fill scale-100 group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-tr ${getAvatarColor(activeChar.id)} flex items-center justify-center`}>
                    <span className="font-extrabold text-4xl text-neutral-300">{activeChar.name.slice(0, 1)}</span>
                  </div>
                )}
                {/* Visual gradient overlay banner inside character portrait card */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-3 right-3 leading-none">
                  <span className="text-[10px] font-black text-[#26eeb7] uppercase tracking-widest block mb-1.5">{activeChar.name}</span>
                  <span className="text-sm font-black text-white block truncate drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{activeChar.title}</span>
                </div>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Arrow */}
        <button
          onClick={nextSlide}
          className="p-1.5 md:p-3 rounded-full bg-black/40 border border-white/5 hover:bg-black/80 hover:scale-105 active:scale-95 transition-all text-neutral-300 hover:text-white cursor-pointer z-20 shrink-0"
        >
          <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
        </button>

      </div>

      {/* Pagination bullets tracking bottom track */}
      <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-1.5">
        {carouselItems.map((item, idx) => (
          <button
            key={item.id}
            onClick={() => setCurrentSlide(idx)}
            className={`w-1.5 md:w-2 h-1.5 md:h-2 rounded-full transition-all duration-300 cursor-pointer ${
              currentIndex === idx ? "w-6 md:w-8 bg-[#7632ff]" : "bg-neutral-600 hover:bg-neutral-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
