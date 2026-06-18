import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import SideMenu from "./components/SideMenu";
import Carousel from "./components/Carousel";
import NoticeBanner from "./components/NoticeBanner";
import WorldSelect from "./components/WorldSelect";
import CurationSection from "./components/CurationSection";
import ChatRoom from "./components/ChatRoom";
import Ranking from "./components/Ranking";
import Explore from "./components/Explore";
import MyInfo from "./components/MyInfo";
import CharacterDetail from "./components/CharacterDetail";
import ChatList from "./components/ChatList";
import LeftSidebar from "./components/LeftSidebar";
import NovelDetailModal from "./components/NovelDetailModal";
import TagExplorationCard from "./components/TagExplorationCard";
import TagResultsModal from "./components/TagResultsModal";
import NovelWorldDetail from "./components/NovelWorldDetail";
import { motion, AnimatePresence } from "motion/react";

import { Character, UserState, NovelWorld } from "./types";
import { NOTICES, INITIAL_CHARACTERS } from "./data";

const SFW_NOVELS: NovelWorld[] = [
  {
    id: "academy_rune_novel",
    title: "아카데미 사기 룬을 얻었다",
    tagline: "만년 F급 헌터인 내가, 등급을 뛰어넘는 사기급 고유 룬을 소유하게 되었다.",
    description: "만년 F급 헌터인 내가, 등급을 뛰어넘는 사기급 고유 룬을 소유하게 되었다.",
    synopsis: "초능력과 마력이 공존하는 불완전한 이세계 아카데미. 재능 없는 F급 연수생이었던 주인공은 우연히 운명을 거스르는 고유 사기 룬을 획득하게 된다. 각양각색의 성격과 속성을 지닌 붉은 머리 동기 신유나, 모범생 이수미 등 차원이 다른 미소녀 헌터들과 조를 이루어 아카데미 평정기를 헤쳐 나갑니다. 운명을 뒤바꾼 절대적인 룬의 힘과 함께 학원 최고의 헌터로 거듭나는 시원하고 러블리한 판타지 아카데미 성장담.",
    bgImage: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=1200",
    characterIds: ["shin_yuna", "lee_soomi", "kang_juyeon", "mun_gaeun", "academy_rune"],
    novelStats: {
      author: "@ruby_yuna",
      views: "1.2M",
      recommendations: "45.8K",
      favorites: "12,900",
      chapters: "95화 연재중",
      novelpiaUrl: "https://novelpia.com"
    }
  },
  {
    id: "witch_exile_novel",
    title: "마녀의 현세 추방 가이드",
    tagline: "이세계에서 불시착한 수상한 마녀와 마수들을 조련하는 발칙한 현세 적응기.",
    description: "이세계에서 불시착한 수상한 마녀와 마수들을 조련하는 발칙한 현세 적응기.",
    synopsis: "차원 균열을 통해 평온하고 삭막한 현대 한국의 도심 속 한복판으로 추방당한 이세계 대마녀 샤론. 그리고 그녀가 보살피는 신성 마수와 이무기 용용이. 영문도 모른 채 이들의 수상쩍은 보호자가 되어버린 원작 주인공은, 사사건건 기묘한 마법 사고를 일으키는 마녀 크루들의 숨겨진 현세 생존을 기획하고 조련하기 시작합니다. 상상 속 환상이 일상이 되어버린 달콤하고 좌충우돌 라이트 노벨식 로맨틱 코미디 판타지.",
    bgImage: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=1200",
    characterIds: ["sharon", "spandal", "yongyong"],
    novelStats: {
      author: "@silver_witch",
      views: "890K",
      recommendations: "38.5K",
      favorites: "9,420",
      chapters: "120화 연재중",
      novelpiaUrl: "https://novelpia.com"
    }
  },
  {
    id: "normal_bandit_novel",
    title: "안심하세요, 평범한 산적입니다",
    tagline: "강호 최고의 악명 높은 천재 미녀들이 한낱 지방 허접 산적단 대장에게 집착하는 이유.",
    description: "강호 최고의 악명 높은 천재 미녀들이 한낱 지방 허접 산적단 대장에게 집착하는 이유.",
    synopsis: "명색이 산적단 두목이지만 싸움보다는 평화와 안정을 사랑하는 소시민 주인공. 하지만 어느 날부터 강호의 패권을 쥐고 흔들던 천하제일의 절대 고수녀들이 하나둘 산적 산채의 주방과 안마당으로 들이닥친다! 무사태평 산적 두목과 정체를 은닉한 채 살벌한 매력을 뽐내는 천재 자객 당월화, 고고한 비구니 가문 천예서 등 강원도 산골 가짜 산적단에서 펼쳐지는 정통 무협을 유쾌하게 뒤흔든 유일무이의 은밀한 로맨스 슬랩스틱.",
    bgImage: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80&w=1200",
    characterIds: ["normal_bandit", "dang_wolhwa", "cheon_yeseo", "yu_somyeong"],
    novelStats: {
      author: "@mountain_bandit",
      views: "2.1M",
      recommendations: "95.0K",
      favorites: "23,100",
      chapters: "245화 완결",
      novelpiaUrl: "https://novelpia.com"
    }
  },
  {
    id: "bamboo_forest_novel",
    title: "모든 비밀이 폭로되는 대나무숲",
    tagline: "대학 에타 커뮤니티를 폭파시킨 은밀한 고심글… 진짜 나와 엮인 작성자는 누구일까?",
    description: "대학 에타 커뮤니티를 폭파시킨 은밀한 고심글… 진짜 나와 엮인 작성자는 누구일까?",
    synopsis: "익명 대학 커뮤니티 '에브리타임'의 대나무숲 게시판에 하루아침에 업로드된 의문의 폭로글. '아카데미 뒤뜰에서 나와 눈을 질질 맞춘 그 선배… 누군지 다 알고 있어.' 꼬리에 꼬리를 무는 의심과 소문 속에서, 조용한 나의 대학 생활은 마냥 비밀스럽지만은 않다. 매력적인 동기 서예린, 완벽하지만 어딘가 수줍은 선배 최진아를 비롯한 히로인들의 미묘한 시선 교차와 감정선 추적을 다룬 고감도 청춘 커뮤니티 시뮬레이션.",
    bgImage: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1200",
    characterIds: ["bamboo_forest", "seo_yeerin", "choi_jina", "yu_gaeul", "idol_three"],
    novelStats: {
      author: "@campus_bamboo",
      views: "750K",
      recommendations: "31.2K",
      favorites: "8,900",
      chapters: "85화 연재중",
      novelpiaUrl: "https://novelpia.com"
    }
  },
  {
    id: "mystery_horror_novel",
    title: "괴담에 휘말렸다",
    tagline: "“절대 뒤를 돌아보거나 거울에 응답하지 마십시오” — 음산한 규율 속 기괴한 생존 게임.",
    description: "“절대 뒤를 돌아보거나 거울에 응답하지 마십시오” — 음산한 규율 속 기괴한 생존 게임.",
    synopsis: "비틀린 차원의 틈새, 규율과 지침서가 유일한 생명줄이 되는 기괴한 괴담 집합소 '수칙 관리국'. 이곳에 강제 징집된 수치 분석관 주인공은 붉은 안개 속에서 자아를 유지하려는 미스터리 소녀 지아르디, 무자비하게 수칙을 집행하는 특수 사령관 등 어둑하고 음산한 인격체들과 맞선다. 위배 시 즉사하는 절대적 피하고 살아남는 영웅들의 사투와 숨막히는 은밀한 밀당 서스펜스 미스터리 스릴러.",
    bgImage: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&q=80&w=1200",
    characterIds: ["mystery_horror", "jaardi", "commander"],
    novelStats: {
      author: "@horror_master",
      views: "1.5M",
      recommendations: "68.2K",
      favorites: "18,400",
      chapters: "160화 연재중",
      novelpiaUrl: "https://novelpia.com"
    }
  }
];

import { loadUserState, saveUserState } from "./utils";
import { Home, Trophy, MessageSquare, User, Instagram, Youtube, Heart, Coins, Compass, Star, Search } from "lucide-react";

export default function App() {
  // Sync state
  const [userState, setUserState] = useState<UserState>(() => loadUserState());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeView, setActiveView] = useState<"home" | "chat" | "ranking" | "search" | "myinfo" | "detail" | "novel_detail">("home");
  const [activeCharacterId, setActiveCharacterId] = useState<string | null>(null);
  const [selectedNovel, setSelectedNovel] = useState<NovelWorld | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedNovelCharacter, setSelectedNovelCharacter] = useState<Character | null>(null);
  const [isNovelModalOpen, setIsNovelModalOpen] = useState(false);

  // States for dynamic inline tag popup discovery
  const [selectedExploreTag, setSelectedExploreTag] = useState<string | null>(null);
  const [visitedDetailCharacterId, setVisitedDetailCharacterId] = useState<string | null>(null);

  const handleExploreTag = (tagName: string) => {
    if (activeView === "detail" && activeCharacterId) {
      setVisitedDetailCharacterId(activeCharacterId);
    } else {
      setVisitedDetailCharacterId(null);
    }
    setSearchQuery(tagName);
    setActiveView("search");
    setActiveCharacterId(null);
  };

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

  const handleNavigate = (view: "home" | "chat" | "ranking" | "search" | "myinfo" | "detail" | "novel_detail") => {
    setActiveView(view);
    setActiveCharacterId(null);
    setVisitedDetailCharacterId(null);
    setSelectedNovel(null);
    if (view !== "search") {
      setSearchQuery("");
    }
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
    <div className={`min-h-screen bg-[#020202] text-[#e1e1e1] flex flex-col font-sans transition-all duration-300 ${isChatRoomFullscreen || activeView === "detail" || activeView === "novel_detail" ? "pb-0" : "pb-20 md:pb-0"}`}>
      {/* 1. Nav header */}
      {!isChatRoomFullscreen && (
        <div className={activeView === "detail" || activeView === "novel_detail" ? "hidden md:block w-full" : "w-full"}>
          <Header
            userState={userState}
            onOpenMenu={() => setIsMenuOpen(true)}
            onNavigate={handleNavigate}
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
        onNavigate={handleNavigate}
      />

      {/* Main layout horizontal flow */}
      <div className="flex flex-row flex-grow w-full min-h-0">
        {/* Left Sidebar navigation rail */}
        {!isChatRoomFullscreen && (
          <LeftSidebar
            activeView={activeView}
            activeCharacterId={activeCharacterId}
            onNavigate={handleNavigate}
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
          <div className="w-full max-w-[1240px] mx-auto px-4 md:px-[20px] py-4 md:py-6 flex flex-col gap-6 md:gap-8 flex-1">
            {/* Worldview Discovery Header */}
            <div className="flex flex-col gap-1 sm:gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2 md:w-2.5 h-2 md:h-2.5 rounded-full bg-[#7c6cff] animate-pulse shadow-[0_0_8px_#7c6cff]" />
                <h2 className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-tight">어떤 세계관에 들어가볼까요?</h2>
              </div>
              <p className="text-xs sm:text-sm text-neutral-400">매력적인 스토리가 가득한 대작 가상 차원들을 둘러보고, 등장인물들의 비하인드 세계와 연합 챗을 나눠보세요.</p>
            </div>

            {/* Worldview Banner Carousel */}
            <Carousel
              characters={INITIAL_CHARACTERS}
              novels={SFW_NOVELS}
              onSelectNovel={setSelectedNovel}
            />

            {/* Curated character lists for home view */}
            <div className="flex flex-col gap-10 md:gap-14">
              {/* === ALL-AGES / NON-ADULT SECTIONS (At the top, grouped by novel titles) === */}
              
              {/* 1. 아카데미 사기 룬을 얻었다 */}
              <CurationSection
                title="아카데미 사기 룬을 얻었다 #아카데미"
                description="만년 F급 헌터인 내가, 등급을 뛰어넘는 사기급 고유 룬을 소유하게 되었다."
                characters={INITIAL_CHARACTERS}
                category="character-ids"
                characterIds={["shin_yuna", "lee_soomi", "kang_juyeon", "mun_gaeun", "academy_rune"]}
                userState={userState}
                onUpdateUserState={handleUpdateUserState}
                onSelectCharacter={handleSelectCharacterToDetail}
                onSelectNovel={handleOpenNovelModalByChar}
                onViewMore={() => {
                  setSelectedNovel(SFW_NOVELS[0]);
                }}
              />

              {/* 2. 마녀의 현세 추방 가이드 */}
              <CurationSection
                title="마녀의 현세 추방 가이드 #판타지"
                description="이세계에서 불시착한 수상한 마녀와 마수들을 조련하는 발칙한 현세 적응기."
                characters={INITIAL_CHARACTERS}
                category="character-ids"
                characterIds={["sharon", "spandal", "yongyong"]}
                userState={userState}
                onUpdateUserState={handleUpdateUserState}
                onSelectCharacter={handleSelectCharacterToDetail}
                onSelectNovel={handleOpenNovelModalByChar}
                onViewMore={() => {
                  setSelectedNovel(SFW_NOVELS[1]);
                }}
              />

              {/* 3. 안심하세요, 평범한 산적입니다 */}
              <CurationSection
                title="안심하세요, 평범한 산적입니다 #무협"
                description="강호 최고의 악명 높은 천재 미녀들이 한낱 지방 허접 산적단 대장에게 집착하는 이유."
                characters={INITIAL_CHARACTERS}
                category="character-ids"
                characterIds={["normal_bandit", "dang_wolhwa", "cheon_yeseo", "yu_somyeong"]}
                userState={userState}
                onUpdateUserState={handleUpdateUserState}
                onSelectCharacter={handleSelectCharacterToDetail}
                onSelectNovel={handleOpenNovelModalByChar}
                onViewMore={() => {
                  setSelectedNovel(SFW_NOVELS[2]);
                }}
              />

              {/* 4. 모든 비밀이 폭로되는 대나무숲 */}
              <CurationSection
                title="모든 비밀이 폭로되는 대나무숲 #캠퍼스"
                description="대학 에타 커뮤니티를 폭파시킨 은밀한 고심글… 진짜 나와 엮인 작성자는 누구일까?"
                characters={INITIAL_CHARACTERS}
                category="character-ids"
                characterIds={["bamboo_forest", "seo_yeerin", "choi_jina", "yu_gaeul", "idol_three"]}
                userState={userState}
                onUpdateUserState={handleUpdateUserState}
                onSelectCharacter={handleSelectCharacterToDetail}
                onSelectNovel={handleOpenNovelModalByChar}
                onViewMore={() => {
                  setSelectedNovel(SFW_NOVELS[3]);
                }}
              />

              {/* 5. 괴담에 휘말렸다 */}
              <CurationSection
                title="괴담에 휘말렸다 & 수칙 관리국 #미스터리"
                description="“절대 뒤를 돌아보거나 거울에 응답하지 마십시오” — 음산한 규율 속 기괴한 생존 게임."
                characters={INITIAL_CHARACTERS}
                category="character-ids"
                characterIds={["mystery_horror", "jaardi", "commander"]}
                userState={userState}
                onUpdateUserState={handleUpdateUserState}
                onSelectCharacter={handleSelectCharacterToDetail}
                onSelectNovel={handleOpenNovelModalByChar}
                onViewMore={() => {
                  setSelectedNovel(SFW_NOVELS[4]);
                }}
              />

              {/* === ADULT SECTIONS (At the bottom, only rendered if adult mode is unlocked) === */}
              {userState.unlockedAdult && (
                <CurationSection
                  title="성인 전용 소설 인기 캐릭터 (19+)"
                  description="아슬아슬한 선을 넘나드는 은밀하고 농밀한 금단의 오감 훈련 시뮬레이터."
                  characters={INITIAL_CHARACTERS}
                  category="adult_group"
                  userState={userState}
                  onUpdateUserState={handleUpdateUserState}
                  onSelectCharacter={handleSelectCharacterToDetail}
                  onSelectNovel={handleOpenNovelModalByChar}
                />
              )}
            </div>
          </div>
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
            onExploreTag={handleExploreTag}
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
              onSelectCharacterToDetail={handleSelectCharacterToDetail}
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

        {activeView === "search" && (
          <Explore
            characters={INITIAL_CHARACTERS}
            userState={userState}
            onUpdateUserState={handleUpdateUserState}
            onSelectCharacter={handleSelectCharacterToDetail}
            onSelectNovel={handleOpenNovelModalByChar}
            initialSearchQuery={searchQuery}
            onBack={visitedDetailCharacterId ? () => {
              setActiveCharacterId(visitedDetailCharacterId);
              setActiveView("detail");
              setVisitedDetailCharacterId(null);
            } : undefined}
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
      {!isChatRoomFullscreen && activeView !== "detail" && activeView !== "novel_detail" && (
        <div className="fixed bottom-0 left-0 right-0 h-[58px] bg-[#1a1a1c]/95 backdrop-blur-md border-t border-[#303030]/60 flex items-center md:hidden z-[100] select-none text-[10px] text-neutral-400">
          <button
            onClick={() => handleNavigate("home")}
            className={`flex-1 flex flex-col items-center gap-1 cursor-pointer transition-colors ${
              activeView === "home" ? "text-[#7632ff] font-bold" : "hover:text-neutral-200"
            }`}
          >
            <Home className="w-5 h-5" />
            <span>홈</span>
          </button>

          <button
            onClick={() => handleNavigate("ranking")}
            className={`flex-1 flex flex-col items-center gap-1 cursor-pointer transition-colors ${
              activeView === "ranking" ? "text-[#7632ff] font-bold" : "hover:text-neutral-200"
            }`}
          >
            <Trophy className="w-5 h-5" />
            <span>랭킹</span>
          </button>

          <button
            onClick={() => handleNavigate("search")}
            className={`flex-1 flex flex-col items-center gap-1 cursor-pointer transition-colors ${
              activeView === "search" ? "text-[#7632ff] font-bold" : "hover:text-neutral-200"
            }`}
          >
            <Search className="w-5 h-5" />
            <span>검색</span>
          </button>

          <button
            onClick={() => handleNavigate("chat")}
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
      {activeView !== "chat" && activeView !== "novel_detail" && (
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
      {/* Dynamic Tag Results Modal */}
      <AnimatePresence>
        {selectedExploreTag && (
          <TagResultsModal
            isOpen={!!selectedExploreTag}
            onClose={() => setSelectedExploreTag(null)}
            tag={selectedExploreTag}
            characters={INITIAL_CHARACTERS}
            userState={userState}
            onUpdateUserState={handleUpdateUserState}
            onSelectCharacter={handleSelectCharacterToDetail}
            onSelectNovel={handleOpenNovelModalByChar}
          />
        )}
      </AnimatePresence>

      {/* Novel World Detail Fullscreen Overlay Modal */}
      <AnimatePresence>
        {selectedNovel && (
          <NovelWorldDetail
            novel={selectedNovel}
            characters={INITIAL_CHARACTERS}
            userState={userState}
            onUpdateUserState={handleUpdateUserState}
            onSelectCharacter={(charId) => {
              handleSelectCharacterToDetail(charId);
              setSelectedNovel(null);
            }}
            onBack={() => {
              setSelectedNovel(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Novel Detail Modal */}
      <NovelDetailModal
        isOpen={isNovelModalOpen}
        onClose={() => setIsNovelModalOpen(false)}
        character={selectedNovelCharacter}
        onSelectCharacter={(charId) => {
          handleSelectCharacterToDetail(charId);
          setIsNovelModalOpen(false);
        }}
      />
    </div>
  );
}
