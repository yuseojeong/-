import React from "react";
import { ArrowLeft, Star, Heart, Share2, ChevronRight, MessageSquare, BookOpen, Image } from "lucide-react";
import { Character, UserState } from "../types";

interface CommentItem {
  id: string;
  author: string;
  time: string;
  body: string;
  likes: number;
  replies: number;
}

const SCENARIOS_DATA: Record<string, string[]> = {
  amelia: [
    "아뜰리에의 비밀 야근 시간",
    "나를 고양이 조수로 만들겠다고?"
  ],
  sooa: [
    "비 내리는 날 밤, 단둘이서...",
    "수아의 비밀 가방 수색 대소동"
  ],
  ohhana: [
    "늦은 밤, 잠긴 하나 방 손잡이",
    "소꿉친구의 기습 무단 외박 작전"
  ],
  commander: [
    "경보 진동 속 사령 지휘실 통제",
    "비전투원인 너를 지키는 법"
  ],
  saebyeok: [
    "방과 후 적막한 미술실 단둘이",
    "비 오는 날 길고양이 비 피해주기"
  ],
  juha: [
    "방과 후 조용한 보건실 침대 뒤",
    "일기장을 인질로 삼은 복종 계약"
  ],
  yuinha: [
    "비좁은 옥탑방에서 굽는 삼겹살",
    "비 오는 새벽의 옥탑방 단칸 동거"
  ],
  sharon: [
    "인간계 세탁기와의 위험천만한 스파크",
    "헤어드라이어를 마도 공학 보구로 오인할 때"
  ],
  seora: [
    "심야의 기립 척추 교정 1:1 밀착 코칭",
    "센터 불 꺼진 VIP 개인 훈련실"
  ]
};

interface MobileCharacterDetailProps {
  character: Character;
  metadata: {
    age: string;
    height: string;
    personality: string;
    mbti: string;
    tags: string[];
    story: string;
    prologueText: string;
    prologueChat: { sender: "character" | "user"; name: string; text: string }[];
  };
  dossier: {
    englishName: string;
    role: string;
    quote: string;
    job: string;
    belong: string;
    profileText: string;
    traits: {
      personality: string;
      strengths: string;
      weaknesses: string;
      habits: string;
      motto: string;
    };
    memoQuote: string;
    signature: string;
    workStyle: string;
    preferences: string[];
  };
  isFavorite: boolean;
  localLikes: number;
  hasLiked: boolean;
  activeTab: "dossier" | "prologue" | "comments";
  localComments: CommentItem[];
  sortType: "new" | "likes";
  commentInput: string;
  onBack: () => void;
  onSelectNovel: (character: Character) => void;
  handleLikeCharacter: () => void;
  handleToggleFavorite: () => void;
  setIsPersonaModalOpen: (open: boolean) => void;
  setActiveTab: (tab: "dossier" | "prologue" | "comments") => void;
  setSortType: (sort: "new" | "likes") => void;
  setLocalComments: (comments: CommentItem[]) => void;
  setCommentInput: (val: string) => void;
  handleAddComment: () => void;
  handleLikeComment: (commentId: string) => void;
  triggerToast: (msg: string) => void;
  getAvatarColor: (id: string) => string;
}

export default function MobileCharacterDetail({
  character,
  metadata,
  dossier,
  isFavorite,
  localLikes,
  hasLiked,
  activeTab,
  localComments,
  sortType,
  commentInput,
  onBack,
  onSelectNovel,
  handleLikeCharacter,
  handleToggleFavorite,
  setIsPersonaModalOpen,
  setActiveTab,
  setSortType,
  setLocalComments,
  setCommentInput,
  handleAddComment,
  handleLikeComment,
  triggerToast,
  getAvatarColor
}: MobileCharacterDetailProps) {
  const scenarios = SCENARIOS_DATA[character.id] || [
    "오리지널 로맨스 첫 대화 시나리오",
    "숨겨진 수위 극비 밀착 야승"
  ];

  const handleShare = () => {
    // Attempt standard navigator web share or fallback to copy url
    if (navigator.share) {
      navigator.share({
        title: character.name,
        text: character.tagline,
        url: window.location.href,
      }).catch(() => {
        navigator.clipboard.writeText(window.location.href);
        triggerToast("공유 링크가 클립보드에 복사되었습니다! 🔗");
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      triggerToast("공유 링크가 클립보드에 복사되었습니다! 🔗");
    }
  };

  return (
    <div className="flex lg:hidden flex-col w-full bg-[#0a0a0c] text-neutral-200 min-h-screen pb-24 relative select-text">
      
      {/* 1. PORTRAIT VIEW SECTION ( 시원하게 확장된 이미지 비율 ) */}
      <div className="relative w-full h-[66vh] overflow-hidden select-none">
        {character.avatar ? (
          <img
            src={character.avatar}
            alt={character.name}
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover object-top filter brightness-[95%] saturate-[105%]"
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-tr ${getAvatarColor(character.id)} flex items-center justify-center`}>
            <span className="font-extrabold text-[#eee] text-5xl">{character.name.slice(0, 1)}</span>
          </div>
        )}

        {/* Ambient Warm Gradient Filter Overlay on Bottom of Image */}
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/60 to-transparent pointer-events-none z-10" />

        {/* Circular back button overlaying top left */}
        <div className="absolute top-4 left-4 z-30">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-all cursor-pointer border-0 outline-none"
            aria-label="뒤로가기"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Text and stats row overlays bottom part of image exactly like original layout details */}
        <div className="absolute bottom-0 inset-x-0 p-5 pb-6 flex flex-col gap-2.5 z-20">
          <div className="flex items-end justify-between gap-4">
            
            {/* Left Texts container */}
            <div className="flex-grow flex flex-col gap-1 text-left min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-black text-white tracking-tight drop-shadow-md">
                  {character.name}
                </h1>
                
                <span className="w-[1px] h-3.5 bg-neutral-800 self-center block shrink-0 mx-0.5" />

                <button
                  onClick={() => onSelectNovel(character)}
                  className="flex items-center gap-1 text-xs text-stone-300 font-semibold select-none shrink-0 cursor-pointer active:scale-95 transition-all bg-transparent border-0 px-0 py-0"
                  title="원작 소설 상세 메타데이터 상세 열기"
                >
                  <BookOpen className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span><b className="text-[#eee] font-bold">{character.title}</b></span>
                </button>
              </div>

              {/* Tagline / Subtitle */}
              <p className="text-stone-200 text-xs md:text-sm font-semibold max-w-xl text-left leading-relaxed drop-shadow line-clamp-2 pr-2">
                {character.tagline}
              </p>

              {/* Social cumulative metrics dashboard exactly from previous version */}
              <div className="flex flex-row flex-nowrap items-center gap-x-3 mt-1.5 text-neutral-400 overflow-x-auto scrollbar-none py-1 whitespace-nowrap w-full">
                <span className="inline-flex items-center gap-1 text-xs font-semibold shrink-0">
                  <MessageSquare className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <b className="text-[#eee]">{character.chats || "9.9K"}</b>
                </span>

                <span className="inline-flex items-center gap-1 text-xs font-semibold shrink-0">
                  <Image className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <b className="text-[#eee]">71</b>
                </span>

                <button
                  onClick={handleLikeCharacter}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-400 shrink-0 bg-transparent border-0 py-0 px-0 cursor-pointer select-none"
                >
                  <Heart className={`w-3.5 h-3.5 shrink-0 ${hasLiked ? "fill-rose-500 text-rose-500" : ""}`} />
                  <b className={hasLiked ? "text-rose-400" : "text-[#eee]"}>{localLikes.toLocaleString()}</b>
                </button>
              </div>

              {/* Hashtag List with clean textual formatting */}
              <div className="flex flex-wrap gap-x-2.5 gap-y-1 mt-1.5 select-none">
                {metadata.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-bold text-[#b9adff]/95 hover:text-[#c7bdff] transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 2. SOLID SCROLLABLE SECTION BELOW THE VIEWPORT ( bg-[#0a0a0c] ) */}
      <div className="bg-[#0a0a0c] w-full flex flex-col gap-5 px-4 pt-1">
        
        {/* Collection slide shelf */}
        <div className="flex flex-col gap-3 py-1.5 border-t border-neutral-900/60">
          <div className="flex items-center justify-between mt-3">
            <h2 className="text-[15px] font-extrabold text-white select-none">
              컬렉션
            </h2>
            <button 
              onClick={() => triggerToast("에셋 라이브러리 연동 준비 중")}
              className="text-[11px] text-neutral-500 hover:text-white cursor-pointer bg-transparent border-0 outline-none"
            >
              전체보기
            </button>
          </div>
          <p className="text-neutral-400 text-xs leading-relaxed text-left -mt-1.5">
            채팅을 통해 더 특별하고 다채로운 일러스트 컬렉션을 수집해 보세요.
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400 font-medium select-none">
            <span>🔓 수집률 <b>2 / 71</b> 에셋 수집</span>
            <div className="w-[124px] h-1.5 bg-neutral-900 rounded-full overflow-hidden">
              <span className="block h-full w-[15%] bg-gradient-to-r from-[#7c6cff] to-[#4f7cff]" />
            </div>
          </div>

          <div className="flex overflow-x-auto gap-4 pb-3 scrollbar-none select-none">
            <div className="flex-shrink-0 w-[114px] aspect-[3/4] rounded-2xl border border-neutral-900 bg-[#0c0c0e] overflow-hidden relative group cursor-pointer" onClick={() => triggerToast("오하나 - 기본 스쿨수트 에셋")}>
              {character.avatar ? (
                <img src={character.avatar} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className={`w-full h-full bg-gradient-to-tr ${getAvatarColor(character.id)}`} />
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-2 text-center">
                <span className="text-[9.5px] font-black text-[#26eeb7] block leading-none">수집됨</span>
                <span className="text-[11px] font-bold text-white block truncate mt-0.5">기본 일상</span>
              </div>
            </div>

            <div className="flex-shrink-0 w-[114px] aspect-[3/4] rounded-2xl border border-neutral-900 bg-[#0c0c0e] overflow-hidden relative group cursor-pointer" onClick={() => triggerToast("오하나 - 룸메이트 동거 에셋")}>
              {character.avatar ? (
                <img src={character.avatar} alt="" className="w-full h-full object-cover filter brightness-90 saturate-50" referrerPolicy="no-referrer" />
              ) : (
                <div className={`w-full h-full bg-gradient-to-tr ${getAvatarColor(character.id)}`} />
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 to-transparent p-2 text-center">
                <span className="text-[9.5px] font-black text-[#26eeb7] block leading-none">수집됨</span>
                <span className="text-[11px] font-bold text-white block truncate mt-0.5">룸메이트 동거</span>
              </div>
            </div>

            {[1, 2, 3].map((i) => (
              <div key={i} onClick={() => triggerToast("대화를 이어나가 조건 만족 시 잠금 해제됩니다.")} className="flex-shrink-0 w-[114px] aspect-[3/4] rounded-2xl border border-neutral-900 bg-[#0c0c0e] overflow-hidden relative group cursor-pointer">
                <div className="absolute inset-0 bg-[#020205]/45 backdrop-blur-[6px] z-10 flex flex-col items-center justify-center gap-1.5">
                  <div className="w-7 h-7 rounded-full bg-black/45 border border-white/10 flex items-center justify-center shadow">
                    <span className="text-[10px]">🔒</span>
                  </div>
                  <span className="text-[8.5px] font-black text-[#eee]/80 uppercase tracking-wider">잠금상태</span>
                </div>
                {character.avatar ? (
                  <img src={character.avatar} alt="" className="w-full h-full object-cover opacity-35 filter blur-[6px]" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full bg-neutral-950" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Interactive content tab selection */}
        <div className="sticky top-0 z-10 bg-[#0a0a0c] border-b border-neutral-900/60 pt-4 pb-0 flex flex-col">
          <div className="grid grid-cols-3 w-full text-center">
            <button
              onClick={() => setActiveTab("dossier")}
              className={`pb-3 text-[13.5px] font-extrabold transition-all cursor-pointer border-b-2 bg-transparent outline-none ${
                activeTab === "dossier" 
                  ? "text-white border-[#7c6cff] font-black" 
                  : "text-neutral-500 border-transparent hover:text-neutral-300"
              }`}
            >
              상세 정보
            </button>
            <button
              onClick={() => setActiveTab("prologue")}
              className={`pb-3 text-[13.5px] font-extrabold transition-all cursor-pointer border-b-2 bg-transparent outline-none ${
                activeTab === "prologue" 
                  ? "text-white border-[#7c6cff] font-black" 
                  : "text-neutral-500 border-transparent hover:text-neutral-300"
              }`}
            >
              프롤로그
            </button>
            <button
              onClick={() => setActiveTab("comments")}
              className={`pb-3 text-[13.5px] font-extrabold transition-all cursor-pointer border-b-2 bg-transparent outline-none ${
                activeTab === "comments" 
                  ? "text-white border-[#7c6cff] font-black" 
                  : "text-neutral-500 border-transparent hover:text-neutral-300"
              }`}
            >
              댓글 {localComments.length}
            </button>
          </div>
        </div>

        {/* Tab Viewports rendering correctly */}
        <div className="pb-8">
          
          {/* TAB 1: DOSSIER */}
          {activeTab === "dossier" && (
            <div className="flex flex-col gap-4 text-left">
              <div className="flex flex-col gap-0.5 px-0.5 mt-2">
                <span className="text-[9px] text-neutral-500 font-extrabold uppercase tracking-widest font-mono">
                  {dossier.role}
                </span>
                <h3 className="text-lg font-black text-white tracking-tight mt-0.5">
                  {character.name} <span className="text-xs font-normal text-neutral-500 font-sans ml-1">{dossier.englishName}</span>
                </h3>
              </div>

              <div className="py-2.5 px-3.5 bg-[#121215]/50 border-l-2 border-[#7c6cff] rounded-r-xl italic font-serif text-neutral-300 leading-relaxed text-xs">
                {dossier.quote}
              </div>

              <div className="flex flex-col gap-3 text-xs">
                <div className="flex flex-col gap-1 bg-[#121215]/70 p-4 border border-neutral-900 rounded-xl">
                  <h4 className="text-[11px] font-black uppercase tracking-wider text-[#b9adff] flex items-center gap-1.5 mb-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7c6cff]" />
                    기본 정보 (Basic Information)
                  </h4>
                  <div className="flex justify-between py-1 border-b border-neutral-900/40">
                    <span className="text-neutral-500 font-bold">이름</span>
                    <span className="text-neutral-200 font-black">{character.name}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-neutral-900/40">
                    <span className="text-neutral-500 font-bold">나이</span>
                    <span className="text-neutral-200 font-black">{metadata.age}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-neutral-900/40">
                    <span className="text-neutral-500 font-bold">신장 / 체중</span>
                    <span className="text-neutral-200 font-black">{metadata.height}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-neutral-500 font-bold">직업</span>
                    <span className="text-neutral-200 font-black truncate max-w-[170px]">{dossier.job}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1 bg-[#121215]/70 p-4 border border-neutral-900 rounded-xl">
                  <h4 className="text-[11px] font-black uppercase tracking-wider text-[#b9adff] flex items-center gap-1.5 mb-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7c6cff]" />
                    상세 소속 (Details)
                  </h4>
                  <p className="text-xs text-neutral-300 font-black leading-snug">
                    {dossier.belong}
                  </p>
                </div>

                <div className="flex flex-col gap-1 bg-[#121215]/70 p-4 border border-neutral-900 rounded-xl">
                  <h4 className="text-[11px] font-black uppercase tracking-wider text-[#b9adff] flex items-center gap-1.5 mb-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7c6cff]" />
                    프로필 개요 (Profile)
                  </h4>
                  <p className="text-xs text-neutral-300 leading-relaxed font-semibold">
                    {dossier.profileText}
                  </p>
                </div>

                <div className="flex flex-col gap-1 bg-[#121215]/70 p-4 border border-neutral-900 rounded-xl">
                  <h4 className="text-[11px] font-black uppercase tracking-wider text-[#b9adff] flex items-center gap-1.5 mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7c6cff]" />
                    상세 특성 분석 (Traits)
                  </h4>
                  <div className="flex flex-col gap-1.5 text-xs">
                    <div className="flex justify-between py-0.5 border-b border-neutral-900/40">
                      <span className="text-neutral-500 font-bold">성격</span>
                      <span className="text-neutral-200 font-black">{dossier.traits.personality}</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-neutral-900/40">
                      <span className="text-neutral-500 font-bold">강점</span>
                      <span className="text-neutral-200 font-black truncate max-w-[170px]">{dossier.traits.strengths}</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-neutral-900/40">
                      <span className="text-neutral-500 font-bold">약점</span>
                      <span className="text-[#ff8181] font-black truncate max-w-[170px]">{dossier.traits.weaknesses}</span>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span className="text-neutral-500 font-bold">고유 습관</span>
                      <span className="text-neutral-200 font-black truncate max-w-[170px]">{dossier.traits.habits}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#191715] border border-[#2b251a] rounded-xl p-4 relative text-xs text-left mb-2.5">
                  <span className="text-[9px] text-amber-600/70 font-extrabold uppercase block mb-0.5">한 줄 소장 독백</span>
                  <p className="text-[11.5px] font-serif italic text-amber-200/90 leading-relaxed mb-2 pr-6">
                    {dossier.memoQuote}
                  </p>
                  <div className="text-right font-serif text-amber-500/80 font-bold pr-1 text-[11px] select-none">
                    — {dossier.signature}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROLOGUE */}
          {activeTab === "prologue" && (
            <div className="flex flex-col gap-4 text-left mt-2 animate-in fadeIn duration-150">
              <div className="bg-[#131316] border border-neutral-900 rounded-[24px] p-5">
                <div className="text-stone-300 text-[13px] leading-[1.8] whitespace-pre-line text-left tracking-wide pb-4 border-b border-neutral-900/65">
                  {metadata.prologueText}
                </div>

                <div className="flex flex-col gap-6 mt-5">
                  {metadata.prologueChat.map((bubble, idx) => {
                    const isUser = bubble.sender === "user";
                    return (
                      <div key={idx} className={`flex gap-3 items-start ${isUser ? "flex-row-reverse text-right" : "text-left"}`}>
                        <div className="w-10 h-10 rounded-xl overflow-hidden relative border border-neutral-900 bg-neutral-950 flex items-center justify-center shrink-0">
                          {!isUser ? (
                            character.avatar ? (
                              <img src={character.avatar} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              <div className={`w-full h-full bg-gradient-to-tr ${getAvatarColor(character.id)}`} />
                            )
                          ) : (
                            <div className="w-full h-full bg-gradient-to-tr from-[#7c6cff]/40 to-[#b59eff]/40 flex items-center justify-center text-xs">나</div>
                          )}
                        </div>
                        <div className={`flex flex-col gap-1 flex-1 min-w-0 ${isUser ? "items-end" : "items-start"}`}>
                          <span className="text-stone-200 text-xs font-black">{bubble.name}</span>
                          <div className={`px-4 py-3 text-[13px] leading-relaxed break-all inline-block rounded-[18px] border font-semibold ${
                            isUser 
                              ? "bg-[#181622] text-[#e2daff] rounded-tr-sm border-[#7c6cff]/10" 
                              : "bg-black text-stone-200 rounded-tl-sm border-neutral-900/50"
                          }`}>
                            “{bubble.text}”
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: COMMENTS */}
          {activeTab === "comments" && (
            <div className="flex flex-col gap-4 text-left mt-2 animate-in fadeIn duration-150">
              <div className="flex items-center justify-between py-1 select-none">
                <span className="text-[11px] font-bold text-neutral-500">정렬 기준</span>
                <div className="flex items-center gap-2 text-[11px] font-semibold text-neutral-500">
                  <span onClick={() => {
                    setSortType("new");
                    setLocalComments([...localComments].sort((a,b) => b.id.localeCompare(a.id)));
                  }} className={`cursor-pointer ${sortType === "new" ? "text-neutral-200 font-bold" : ""}`}>최신순</span>
                  <span>|</span>
                  <span onClick={() => {
                    setSortType("likes");
                    setLocalComments([...localComments].sort((a,b) => b.likes - a.likes));
                  }} className={`cursor-pointer ${sortType === "likes" ? "text-[#b2a5ff] font-bold" : ""}`}>공감순</span>
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleAddComment(); }}
                  placeholder="감상을 짤막히 적어보세요."
                  className="flex-grow bg-[#111112] border border-neutral-900 rounded-xl px-3 py-2.5 text-xs text-neutral-200 placeholder-neutral-600 outline-none"
                />
                <button onClick={handleAddComment} className="bg-[#7c6cff] hover:bg-[#5f4fd6] text-white font-extrabold text-xs px-4 rounded-xl cursor-pointer">등록</button>
              </div>

              <div className="flex flex-col divide-y divide-neutral-900/50 mt-1">
                {localComments.map((comment) => (
                  <div key={comment.id} className="py-3 flex flex-col gap-1.5 text-xs text-left">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-neutral-900 border border-neutral-850 flex items-center justify-center text-[9px] font-mono select-none">
                        {comment.author.slice(0, 1)}
                      </div>
                      <div>
                        <span className="font-bold text-neutral-300 block">{comment.author}</span>
                        <span className="text-[9px] text-neutral-500 font-medium">{comment.time}</span>
                      </div>
                    </div>
                    <p className="text-neutral-300 pl-8 leading-relaxed font-medium">{comment.body}</p>
                    <div className="flex items-center gap-4 pl-8 mt-0.5 select-none">
                      <button onClick={() => handleLikeComment(comment.id)} className="text-[10px] text-neutral-500 hover:text-rose-400 flex items-center gap-0.5 font-bold cursor-pointer">
                        <span>♡</span>
                        <span>공감 {comment.likes}</span>
                      </button>
                      <button onClick={() => triggerToast("답글 기능 준비 중")} className="text-[10px] text-neutral-500 hover:text-[#b9adff] font-bold cursor-pointer">
                        답글 {comment.replies}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
