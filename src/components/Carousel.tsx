import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
                className="absolute inset-0 w-full h-full object-cover filter blur-2xl opacity-75 object-center scale-105"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className={`absolute inset-0 bg-gradient-to-tr ${getAvatarColor(activeChar.id)} filter blur-2xl opacity-75`} />
            )}
            {/* Beautiful light and colored translucent gradient overlays to guarantee text legibility without crushing the background artwork */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#020202]/90 via-transparent to-black/10 z-0" />
            <div className="absolute inset-y-0 left-0 w-full md:w-3/4 bg-gradient-to-r from-[#020202]/85 via-[#020202]/30 to-transparent z-0" />
          </motion.div>
        </AnimatePresence>
        
        {/* Subtle grid pattern over blurred wallpaper */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:30px_34px] pointer-events-none"></div>
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
              className="w-full flex flex-col md:flex-row items-center md:justify-between gap-6 md:gap-10 text-left cursor-pointer group/slide"
              onClick={() => onSelectCharacter(activeChar.id)}
            >
              
              {/* Left Column: Text Metadata & Actions */}
              <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left min-w-0">
                {/* Original Work Title Tag */}
                <span className="inline-block text-[11px] md:text-xs font-bold text-[#b9adff] bg-[#7c6cff]/8 border border-[#7c6cff]/15 px-2.5 py-1 rounded-md mb-2 select-none tracking-tight">
                  {activeChar.title}
                </span>

                {/* H1 displays character name */}
                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight select-none group-hover/slide:text-[#b9adff] transition-colors duration-200">
                  {activeChar.name}
                </h1>

                {/* Custom UQX hooking tagline line-clamp */}
                <p className="text-neutral-400 text-sm mt-2.5 px-0.5 max-w-[500px] line-clamp-2 leading-relaxed tracking-tight select-none">
                  {activeChar.tagline}
                </p>
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
