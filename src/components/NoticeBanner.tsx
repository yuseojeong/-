import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Megaphone, ChevronRight } from "lucide-react";
import { Notice } from "../types";

interface NoticeBannerProps {
  notices: Notice[];
}

export default function NoticeBanner({ notices }: NoticeBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!notices.length) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % notices.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [notices.length]);

  if (!notices.length) return null;

  return (
    <div className="relative w-full h-[40px] md:h-[50px] bg-[#111] hover:bg-[#1a1a1a]/95 rounded-xl border border-[#222] select-none overflow-hidden cursor-pointer transition-colors duration-200">
      <div className="w-full h-full flex items-center justify-between px-4 md:px-7">
        
        {/* Left icon with Label */}
        <div className="flex items-center gap-3 w-full">
          <div className="flex items-center gap-1.5 p-1 rounded bg-[#d7e3ff]/10 text-[#3a5cff] shrink-0">
            <Megaphone className="w-3.5 h-3.5" />
            <span className="text-[10px] md:text-xs font-black tracking-wider uppercase hidden md:inline">Notice</span>
          </div>

          {/* Sliding Text announcements */}
          <div className="relative flex-1 h-[20px] overflow-hidden ml-1">
            <AnimatePresence mode="wait">
              <motion.span
                key={currentIndex}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="absolute inset-0 block text-xs md:text-sm font-semibold text-white/90 truncate leading-[20px]"
              >
                {notices[currentIndex]?.text}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        {/* Right Arrow indicator */}
        <ChevronRight className="w-4 h-4 text-neutral-500" />
      </div>
    </div>
  );
}
