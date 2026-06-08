import React from "react";
import { WORLD_GENRES } from "../data";
import { motion } from "motion/react";
import { Search, X } from "lucide-react";

interface WorldSelectProps {
  onSelectGenre: (genre: string) => void;
  activeGenre: string | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isSearchOpen: boolean;
  onToggleSearch: () => void;
}

export default function WorldSelect({
  onSelectGenre,
  activeGenre,
  searchQuery,
  onSearchChange,
  isSearchOpen,
  onToggleSearch,
}: WorldSelectProps) {
  return (
    <section className="select-none flex flex-col">
      
      {/* Flex container of genre chips */}
      <div className="flex flex-wrap gap-1.5 md:gap-2 items-center">
        {WORLD_GENRES.map((g) => {
          const isActive = activeGenre === g.genre && !isSearchOpen;
          return (
            <motion.button
              key={g.genre}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                onSelectGenre(g.genre);
              }}
              className={`
                px-3 md:px-4.5 py-1.5 md:py-2 rounded-full border text-[11px] md:text-sm font-semibold cursor-pointer transition-all duration-200
                ${isActive 
                  ? "bg-[#7632ff] border-[#7632ff] text-white" 
                  : "bg-[#111112] border-[#222] text-neutral-400 hover:border-[#444] hover:text-white"
                }
              `}
            >
              {g.title.split(' ')[0]}
            </motion.button>
          );
        })}

        {/* Search chip on the far right */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onToggleSearch}
          className={`
            px-3 md:px-4.5 py-1.5 md:py-2 rounded-full border text-[11px] md:text-sm font-semibold cursor-pointer transition-all duration-200 flex items-center gap-1 md:gap-1.5
            ${isSearchOpen 
              ? "bg-[#7632ff] border-[#7632ff] text-white" 
              : "bg-[#111112] border-[#222] text-neutral-400 hover:border-[#444] hover:text-white"
            }
          `}
        >
          <Search className="w-3 md:w-3.5 h-3 md:h-3.5" />
          <span>검색</span>
        </motion.button>
      </div>

      {/* Search Input Field with transition */}
      {isSearchOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className="mt-3 md:mt-4 w-full"
        >
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="캐릭터 이름, 태그, 한 줄 소개 등으로 검색해보세요..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-[#111112] border border-[#222] hover:border-[#444] focus:border-[#7632ff]/60 text-neutral-100 text-xs md:text-sm px-4 py-2 md:py-2.5 pr-10 rounded-xl outline-none transition-all placeholder-neutral-500 font-medium"
              autoFocus
            />
            {searchQuery ? (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-3 text-neutral-500 hover:text-neutral-300 cursor-pointer p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <Search className="absolute right-3.5 text-neutral-600 w-3.5 h-3.5" />
            )}
          </div>
        </motion.div>
      )}
    </section>
  );
}
