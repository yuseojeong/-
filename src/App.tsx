import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import SideMenu from "./components/SideMenu";
import Carousel from "./components/Carousel";
import NoticeBanner from "./components/NoticeBanner";
import WorldSelect from "./components/WorldSelect";
import CurationSection from "./components/CurationSection";
import ChatRoom from "./components/ChatRoom";
import Ranking from "./components/Ranking";
import Favorite from "./components/Favorite";
import MyInfo from "./components/MyInfo";
import CharacterDetail from "./components/CharacterDetail";
import ChatList from "./components/ChatList";
import LeftSidebar from "./components/LeftSidebar";
import Explore from "./components/Explore";
import NovelDetailModal from "./components/NovelDetailModal";
import { motion, AnimatePresence } from "motion/react";

import { Character, UserState } from "./types";
import { NOTICES, INITIAL_CHARACTERS } from "./data";
import { loadUserState, saveUserState } from "./utils";
import { Home, Trophy, MessageSquare, User, Instagram, Youtube, Heart, Coins, Compass, Star } from "lucide-react";

export default function App() {
  // Sync state
  const [userState, setUserState] = useState<UserState>(() => loadUserState());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeView, setActiveView] = useState<"home" | "explore" | "chat" | "ranking" | "favorite" | "myinfo" | "detail">("home");
  const [activeCharacterId, setActiveCharacterId] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedNovelCharacter, setSelectedNovelCharacter] = useState<Character | null>(null);
  const [isNovelModalOpen, setIsNovelModalOpen] = useState(false);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Always scroll to the top of the viewport when changing views, characters, or genres
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Scroll any potentially scrolling panels (like the main container or other scroll containers)
    const scrollContainers = document.querySelectorAll(".overflow-y-auto, main");
    scrollContainers.forEach((container) => {
      container.scrollTop = 0;
    });
  }, [activeView, activeCharacterId, selectedGenre]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
  };

  // Sync back to localStorage as state coordinates update
  useEffect(() => {
    saveUserState(userState);
  }, [userState]);

  const handleUpdateUserState = (updated: UserState) => {
    setUserState(updated);
  };

  const handleOpenNovelModalByChar = (char: Character) => {
    setSelectedNovelCharacter(char);
    setIsNovelModalOpen(true);
  };

  const handleSelectCharacterToDetail = (charId: string) => {
    setActiveCharacterId(charId);
    setActiveView("detail");
  };

  const handleSelectCharacterToChat = (charId: string) => {
    setActiveCharacterId(charId);
    setActiveView("chat");
  };

  const handleSelectGenreInCuration = (genreName: string) => {
    setSelectedGenre(genreName);
    setSearchQuery("");
    setIsSearchOpen(false);
  };

  const handleToggleSearch = () => {
    const nextState = !isSearchOpen;
    setIsSearchOpen(nextState);
    if (!nextState) {
      setSearchQuery("");
    }
  };

  const isChatRoomFullscreen = activeView === "chat" && activeCharacterId !== null;

  return (
    <div className={`min-h-screen bg-[#020202] text-[#e1e1e1] flex flex-col font-sans transition-all duration-300 ${isChatRoomFullscreen || activeView === "detail" ? "pb-0" : "pb-20 md:pb-0"}`}>
      {/* 1. Nav header */}
      {!isChatRoomFullscreen && (
        <div className={activeView === "detail" ? "hidden md:block w-full" : "w-full"}>
          <Header
            userState={userState}
            onOpenMenu={() => setIsMenuOpen(true)}
            onNavigate={(view) => {
              setActiveView(view);
              setActiveCharacterId(null);
            }}
            activeView={activeView}
            onUpdateUserState={handleUpdateUserState}
          />
        </div>
      )}

      {/* 2. Slide Drawer Menu Panel */}
      <SideMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        userState={userState}
        onUpdateUserState={handleUpdateUserState}
        onNavigate={(view) => {
          setActiveView(view);
          setActiveCharacterId(null);
        }}
      />

      {/* Main layout horizontal flow */}
      <div className="flex flex-row flex-grow w-full min-h-0">
        {/* Left Sidebar navigation rail */}
        {!isChatRoomFullscreen && (
          <LeftSidebar
            activeView={activeView}
            activeCharacterId={activeCharacterId}
            onNavigate={(view) => {
              setActiveView(view);
              setActiveCharacterId(null);
            }}
            onSelectCharacterToChat={handleSelectCharacterToChat}
            characters={INITIAL_CHARACTERS}
            userState={userState}
            onOpenStore={() => {
              setIsMenuOpen(true);
              setTimeout(() => {
                triggerToast("상점 및 코인 충전 메뉴가 활성화되었습니다.");
              }, 300);
            }}
            triggerToast={triggerToast}
          />
        )}

        {/* 3. Main Dashboard Frame Viewports */}
        <main className={`flex-grow flex flex-col min-w-0 ${isChatRoomFullscreen ? "pt-0 pb-0 h-screen overflow-hidden" : activeView === "detail" ? "pt-0 pb-0 md:pt-[90px]" : "pt-[64px] md:pt-[90px]"}`}>
        {activeView === "home" && (
          <div className="w-full max-w-[1240px] mx-auto px-4 md:px-[20px] py-4 md:py-6 flex flex-col gap-10 md:gap-14 flex-1">
            {/* Featured banner Carousel */}
            <Carousel
              characters={INITIAL_CHARACTERS}
              onSelectCharacter={handleSelectCharacterToDetail}
            />

            {/* Rotating top notice slider bar */}
            <NoticeBanner notices={NOTICES} />

            {/* Curated character lists for home view */}
            <div className="flex flex-col gap-10 md:gap-14">
              {/* 1. New update world curation grid block */}
              <CurationSection
                title="신규 차원 캐릭터 업데이트"
                characters={INITIAL_CHARACTERS}
                category="new"
                userState={userState}
                onUpdateUserState={handleUpdateUserState}
                onSelectCharacter={handleSelectCharacterToDetail}
                onSelectNovel={handleOpenNovelModalByChar}
              />

              {/* 2. Best rating world curation block */}
              <CurationSection
                title="지금 가장 핫한 인기 캐릭터 부스"
                characters={INITIAL_CHARACTERS}
                category="best"
                userState={userState}
                onUpdateUserState={handleUpdateUserState}
                onSelectCharacter={handleSelectCharacterToDetail}
                onSelectNovel={handleOpenNovelModalByChar}
              />

              {/* 3. General list curation block */}
              <CurationSection
                title="대학교 러블리 여사친 동거 섹션"
                characters={INITIAL_CHARACTERS}
                category="genre"
                filterGenre="CAMPUS"
                userState={userState}
                onUpdateUserState={handleUpdateUserState}
                onSelectCharacter={handleSelectCharacterToDetail}
                onSelectNovel={handleOpenNovelModalByChar}
              />

              {/* 4. Alternate block */}
              <CurationSection
                title="최면과 일진들의 흔들거리는 지배 관계"
                characters={INITIAL_CHARACTERS}
                category="genre"
                filterGenre="HYPNOSIS"
                userState={userState}
                onUpdateUserState={handleUpdateUserState}
                onSelectCharacter={handleSelectCharacterToDetail}
                onSelectNovel={handleOpenNovelModalByChar}
              />
            </div>
          </div>
        )}

        {activeView === "explore" && (
          <Explore
            characters={INITIAL_CHARACTERS}
            userState={userState}
            onUpdateUserState={handleUpdateUserState}
            onSelectCharacter={handleSelectCharacterToDetail}
            onSelectNovel={handleOpenNovelModalByChar}
          />
        )}

        {activeView === "detail" && activeCharacterId && (
          <CharacterDetail
            charId={activeCharacterId}
            characters={INITIAL_CHARACTERS}
            userState={userState}
            onUpdateUserState={handleUpdateUserState}
            onStartChat={handleSelectCharacterToChat}
            onBack={() => {
              setActiveView("home");
              setActiveCharacterId(null);
            }}
            onSelectNovel={handleOpenNovelModalByChar}
          />
        )}

        {activeView === "chat" && (
          activeCharacterId ? (
            <ChatRoom
              characters={INITIAL_CHARACTERS}
              userState={userState}
              onUpdateUserState={handleUpdateUserState}
              activeCharacterId={activeCharacterId}
              onSelectCharacter={handleSelectCharacterToChat}
              onBackToHome={() => {
                setActiveCharacterId(null);
              }}
            />
          ) : (
            <ChatList
              characters={INITIAL_CHARACTERS}
              userState={userState}
              onUpdateUserState={handleUpdateUserState}
              onSelectCharacter={handleSelectCharacterToChat}
              onNavigateHome={() => setActiveView("home")}
            />
          )
        )}

        {activeView === "ranking" && (
          <Ranking
            characters={INITIAL_CHARACTERS}
            userState={userState}
            onSelectCharacter={handleSelectCharacterToDetail}
            onSelectNovel={handleOpenNovelModalByChar}
          />
        )}

        {activeView === "favorite" && (
          <Favorite
            characters={INITIAL_CHARACTERS}
            userState={userState}
            onUpdateUserState={handleUpdateUserState}
            onSelectCharacter={handleSelectCharacterToDetail}
            onNavigateHome={() => setActiveView("home")}
            onSelectNovel={handleOpenNovelModalByChar}
          />
        )}

        {activeView === "myinfo" && (
          <MyInfo
            userState={userState}
            onUpdateUserState={handleUpdateUserState}
          />
        )}
      </main>
    </div>

      {/* 4. Mobile Bottom Navigation Drawer (Visible on narrow viewports) */}
      {!isChatRoomFullscreen && activeView !== "detail" && (
        <div className="fixed bottom-0 left-0 right-0 h-[58px] bg-[#1a1a1c]/95 backdrop-blur-md border-t border-[#303030]/60 flex items-center md:hidden z-[100] select-none text-[10px] text-neutral-400">
          <button
            onClick={() => {
              setActiveView("home");
              setActiveCharacterId(null);
            }}
            className={`flex-1 flex flex-col items-center gap-1 cursor-pointer transition-colors ${
              activeView === "home" ? "text-[#7632ff] font-bold" : "hover:text-neutral-200"
            }`}
          >
            <Home className="w-5 h-5" />
            <span>홈</span>
          </button>

          <button
            onClick={() => {
              setActiveView("ranking");
              setActiveCharacterId(null);
            }}
            className={`flex-1 flex flex-col items-center gap-1 cursor-pointer transition-colors ${
              activeView === "ranking" ? "text-[#7632ff] font-bold" : "hover:text-neutral-200"
            }`}
          >
            <Trophy className="w-5 h-5" />
            <span>랭킹</span>
          </button>

          <button
            onClick={() => {
              setActiveView("explore");
              setActiveCharacterId(null);
            }}
            className={`flex-1 flex flex-col items-center gap-1 cursor-pointer transition-colors ${
              activeView === "explore" ? "text-[#7632ff] font-bold" : "hover:text-neutral-200"
            }`}
          >
            <Compass className="w-5 h-5" />
            <span>탐색</span>
          </button>

          <button
            onClick={() => {
              setActiveView("favorite");
              setActiveCharacterId(null);
            }}
            className={`flex-1 flex flex-col items-center gap-1 cursor-pointer transition-colors ${
              activeView === "favorite" ? "text-[#7632ff] font-bold" : "hover:text-neutral-200"
            }`}
          >
            <Star className="w-5 h-5" />
            <span>즐찾</span>
          </button>

          <button
            onClick={() => {
              setActiveView("chat");
              setActiveCharacterId(null);
            }}
            className={`relative flex-1 flex flex-col items-center gap-1 cursor-pointer transition-colors ${
              activeView === "chat" ? "text-[#7632ff] font-bold" : "hover:text-neutral-200"
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span>대화</span>
            {userState.tickets > 0 && (
              <span className="absolute top-0 right-7 bg-[#7632ff] w-2 h-2 rounded-full animate-pulse"></span>
            )}
          </button>
        </div>
      )}

      {/* Toast Notification Container */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 md:bottom-8 right-6 z-[200] max-w-sm bg-neutral-900/95 border border-neutral-800 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-md"
          >
            <div className="w-2.5 h-2.5 bg-gradient-to-tr from-[#7632ff] to-[#9256ff] rounded-full animate-ping" />
            <span className="text-xs font-black tracking-tight leading-tight">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. Company info corporate Footer (Shown only if view is not chat fullscreen) */}
      {activeView !== "chat" && (
        <footer className={`bg-[#111112] border-t border-[#222]/80 mt-auto py-8 px-4 md:px-8 select-none text-[11px] md:text-xs text-neutral-500 font-sans ${activeView === "detail" ? "hidden md:block" : ""}`}>
          <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row justify-between gap-8 py-3">
            
            {/* MetaCraft company details */}
            <div className="space-y-3 max-w-[650px]">
              {/* Utility Terms shortcuts */}
              <div className="flex flex-wrap gap-4 text-xs font-semibold text-neutral-400">
                <a href="https://novelpia.com/page/terms_of_use" target="_blank" className="hover:text-white transition-colors">이용약관</a>
                <a href="https://novelpia.com/page/privacy_policy" target="_blank" className="hover:text-white font-bold transition-colors">개인정보 처리방침</a>
                <a href="https://novelpia.com/page/youth_policy" target="_blank" className="hover:text-white transition-colors">청소년 보호정책</a>
                <a href="http://we.novelpia.com" target="_blank" className="hover:text-white transition-colors">회사소개</a>
                <a href="https://novelpia.com/page/partner" target="_blank" className="hover:text-white transition-colors">제휴안내</a>
              </div>

              <div className="space-y-1 font-medium leading-relaxed">
                <p>주식회사 메타크래프트 • 대표이사 유정석 • 사업자등록번호 210-81-79781</p>
                <p>통신판매업 제2022-서울구로-2494호 • 주소 서울특별시 구로구 디지털로31길 12, (구로동, TP타워) 9층</p>
                <p>고객센터: 1588-3644 • 이메일: <a href="mailto:help@novelpia.com" className="underline hover:text-neutral-300">help@novelpia.com</a> (운영시간 평일 AM 10:00 ~ PM 07:00 • 휴게시간 PM 12:50 ~ 02:10)</p>
              </div>

              <p className="text-[10px] text-neutral-600">
                주의! 본 사이트에 등록된 컨텐츠는 NovelChat 클론 데모이며 가상 인공지능 프롬프트 테스트 목적으로 제공됩니다. 복제 및 무단 도용은 법적 규제를 유발할 수 있습니다.
              </p>
            </div>

            {/* Social channels display list */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="p-2 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-full cursor-pointer text-neutral-400 hover:text-white transition-all">
                <Instagram className="w-4 h-4" />
              </span>
              <span className="p-2 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-full cursor-pointer text-neutral-400 hover:text-white transition-all">
                <Youtube className="w-4 h-4" />
              </span>
              <div className="text-right">
                <p className="font-bold text-[#eee] text-xs">Copyright © 메타크래프트 2026.</p>
                <p className="text-[10px] text-neutral-600 mt-0.5">Novelpia Novelchat platform duplication model.</p>
              </div>
            </div>

          </div>
        </footer>
      )}
      {/* Novel Detail Modal */}
      <NovelDetailModal
        isOpen={isNovelModalOpen}
        onClose={() => setIsNovelModalOpen(false)}
        character={selectedNovelCharacter}
      />
    </div>
  );
}
