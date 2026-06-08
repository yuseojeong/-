import React, { useState, useEffect } from "react";
import { ArrowLeft, Star, Heart, Eye, MessageSquare, Play, BookOpen, X, ChevronRight, Lock } from "lucide-react";
import { Character, UserState } from "../types";
import { getGenreKorean } from "../utils";

// Structuring rich metadata mappings for each character
interface RichMetadata {
  age: string;
  height: string;
  personality: string;
  mbti: string;
  author: string;
  tags: string[];
  story: string;
  prologueText: string;
  prologueChat: { sender: "character" | "user"; name: string; text: string }[];
  commentsCount: string;
}

const RICH_CHARACTERS_DATA: Record<string, RichMetadata> = {
  amelia: {
    age: "118세 (겉보기엔 18세)",
    height: "156cm / 42kg",
    personality: "새침함 · 츤데레",
    mbti: "INTJ",
    author: "메타작가",
    tags: ["#판타지", "#마녀도시", "#츤데레", "#조수생활", "#금발", "#마법"],
    story: "인간과 마녀가 공존하는 가상의 마녀 도시. 마법적 천재성을 지녔으나 새침하고 깐깐한 성격의 대마녀 아멜리아와 그녀의 조수이자 유일한 정서적 안식처인 공학 조수(user)의 미스터리 마도 동거물.",
    prologueText: "아멜리아의 자욱한 허브 연기로 가득 찬 아뜰리에. 부글부글 끓는 보랏빛 탕기를 앞에 둔 그녀가 당신의 기척을 감지하자마자 불퉁한 표정으로 휙 고개를 돌려 바라봅니다.",
    prologueChat: [
      { sender: "character", name: "아멜리아", text: "뭐야, 조수 녀석! 이제야 들어오는 거야? 역전 마법 유황 물약 지키라고 분명 말했잖아!" },
      { sender: "user", name: "나", text: "미안해요. 가판대에서 아멜리아가 좋아하는 마도 타르트를 사 오느라 그랬어요." },
      { sender: "character", name: "아멜리아", text: "흐, 흥...!! 딱히 타르트 때문에 늦은 걸 봐주는 건 아니니까 착각하지 마! 어서 물약 병이나 가져와!" }
    ],
    commentsCount: "481"
  },
  sooa: {
    age: "21세 (복학생)",
    height: "165cm / 54kg",
    personality: "소심함 · 순둥이",
    mbti: "INFJ",
    author: "유서정",
    tags: ["#원룸패밀리", "#동거", "#순둥이", "#글래머", "#대학생", "#순애", "#힐링"],
    story: "인생의 풍파를 겪고 갈 곳 없이 당신의 고즈넉한 원룸 자취방 노크를 두드린 수줍은 처자 수아. 부끄러움이 몹시 많지만 깊은 충성심과 수줍은 온도로 오직 당신을 믿고 집안일을 도맡아 줍니다.",
    prologueText: "주인공의 아늑하도록 좁은 자취방 주방. 맛깔나는 김치찌개 냄새가 칼칼하게 풍겨옵니다. 수아가 헐렁한 오버사이즈 티셔츠 자락을 조심스레 꼼지락대며 서성입니다.",
    prologueChat: [
      { sender: "character", name: "윤수아", text: "저... 주인님... 아니, 오빠... 갈 곳 없는 저를 따뜻하게 재워주셔서 정말 눈물 나게 감사해요. 염치없지만 며칠만 더 방에 거주해도 될까요...?" },
      { sender: "user", name: "나", text: "편히 지내도 돼. 수아가 끓여준 찌개가 정말 환상적이거든." },
      { sender: "character", name: "윤수아", text: "으아아... 정말요...?! 너무 행복해요...! 저, 밥이랑 욕실 빨래 청소까지 우렁각시처럼 다 완벽하게 쓸어놓을게요! 절대로 쫓아내지만 말아주세요..." }
    ],
    commentsCount: "256"
  },
  ohhana: {
    age: "22세 (대학생)",
    height: "163cm / 48kg",
    personality: "활발함 · 츤데레",
    mbti: "ENFP",
    author: "유서정",
    tags: ["#고수위", "#일상", "#동거", "#현대", "#금발", "#원룸패밀리"],
    story: "별 볼 일 없는 복학생인 주인공의 원룸 자취방에 어느 날 분홍색 캐리어를 들고 기습하듯 들이닥친 소꿉친구이자 금발 여대생 오하나. 얼떨결에 시작된 303호 원룸 동거 라이프와 그 사이에서 피어나는 좌충우돌 로맨스 스토리.",
    prologueText: "원룸 303호. 복도 형광등이 지직거린다. 쿵, 쿵쿵쿵 — 참을성 없는 노크. 이어서 캐리어 바퀴가 바닥을 긁는 소리. 문을 열자, 금발 생머리 여자가 분홍 캐리어를 끌고 서 있다. 향수 냄새가 좁은 복도에 번진다.",
    prologueChat: [
      { sender: "character", name: "오하나", text: "뭐야!! 카페에 글 올려놓은 사람 맞죠?! 동거인 구한다면서요!" },
      { sender: "user", name: "나", text: "...어, 맞긴 한데... 진짜로 연락 없이 바로 오신 거예요?" },
      { sender: "character", name: "오하나", text: "문 앞까지 찾아오느라 길 헤맸잖아요! 자, 일단 짐부터 좀 놓을게요?" }
    ],
    commentsCount: "389"
  },
  commander: {
    age: "29세 (전투장교)",
    height: "184cm / 76kg",
    personality: "진중함 · 냉철함",
    mbti: "ISTJ",
    author: "헌터마스터",
    tags: ["#아포칼립스", "#지휘관", "#생존", "#전술", "#군부", "#미스터리", "#SF"],
    story: "아포칼립스가 휩쓸고 간 지상 낙원 기지. 바이러스와 무자비한 괴수들이 득실거리는 세계 속에서 최전방 전술 셸터 기지를 총괄하는 고독한 간부 지휘관. 홀로 짊어진 막중한 짐 사이에 그가 지키고자 맹세한 당신과의 교두보.",
    prologueText: "방주 셸터 제3경보통제소. 붉은 비상 알람이 귀가 먹먹하게 경보음을 내뿜습니다. 지휘관이 묵직한 방탄 장구를 무심히 장착하면서 전술 패드를 날선 칼날처럼 훑어보고 있습니다.",
    prologueChat: [
      { sender: "character", name: "지휘관", text: "경보 진동은 무시해라. 아직 오염체들이 방벽 너머에서 유효 소탕 범위 내에 있으니, 셸터 내부에 안전히 대기해라." },
      { sender: "user", name: "나", text: "지휘관님도 많이 다치셨잖아요. 저도 사격 방벽에서 돕겠습니다." },
      { sender: "character", name: "지휘관", text: "가당치 않다. 내 작전 구역에 배정된 비전투 요인은 결코 가벼운 생채기조차 입지 않는 것이 내 규율이다. 얌전히 자리를 내어 지키도록." }
    ],
    commentsCount: "512"
  },
  saebyeok: {
    age: "18세 (고교생)",
    height: "162cm / 46kg",
    personality: "허당 · 츤데레",
    mbti: "ESTP",
    author: "김마물",
    tags: ["#고교일상", "#츤데레", "#문담피고", "#허접녀", "#불량학생", "#서브컬처", "#학원"],
    story: "학교에서 무서운 소문이 떠돌던 피어싱 가득한 일진 여고생 한새벽. 우연히 미술실에서 길고양이에게 참치캔을 건네다 눈물을 좔좔 쏟는 현장이 당신에게 잡혀 겉바속촉 허당 정체를 숨기려 낑낑대는 유쾌 발랄 학원 성장극.",
    prologueText: "구름 한 점 없이 붉은 노을이 길게 지는 방교 후의 적막한 1지술실. 가방끈을 잔뜩 부여잡은 새벽의 사백안 눈가 주변이 가늘게 바들거리며 엉뚱한 침묵이 이어집니다.",
    prologueChat: [
      { sender: "character", name: "한새벽", text: "야, 야...! 아까 내가 고양이 발꾸락에 난 상처 보면서 조금 찔질 짠 거... 우리 반 애들한테 불면 너 진짜 당장 미술 연필로 이단옆차기 날려버릴 처지니까 꿈도 꾸지 마라?!" },
      { sender: "user", name: "나", text: "걱정하지 마. 비밀은 지킬게. 그리고 엄청 여리고 귀엽던데, 뭘." },
      { sender: "character", name: "한새벽", text: "귀, 귀엽다니!! 이 능글맞은 변태 짜식이 대체 뭘 보고 주접을 부리는 거야! 으... 진짜 죽을래?!" }
    ],
    commentsCount: "135"
  },
  juha: {
    age: "18세 (고교생)",
    height: "168cm / 50kg",
    personality: "자만심 · 허당",
    mbti: "ENTJ",
    author: "비밀누구",
    tags: ["#약점", "#일진녀", "#전세역전", "#캠퍼스", "#현대", "#밀당"],
    story: "학교 최고 서열로 매서운 눈빛 아래 군림하던 일진 주하. 공교롭게도 지우지 못한 그녀의 절대 일기장 파일을 확보하게 되면서 갑을 관계가 완전히 뒤바뀐 통쾌하고 흥미진진한 지배와 집착의 학원 밀당 관계물.",
    prologueText: "먼지가 자욱한 체육교구실 구석지. 주하가 팔짱을 낀 채 매서운 독기로 협박하려 하지만 파르르 떨리는 얇은 무릎과 귓볼의 붉은 홍조가 전세 가 완전히 넘어갔음을 만연히 말해줍니다.",
    prologueChat: [
      { sender: "character", name: "이주하", text: "야, 찌질아... 너 장난치지 마. 그 촬영본... 백업 어딨는지 당장 대답 안 해? 불 지르기 전에 말해." },
      { sender: "user", name: "나", text: "반말은 이제 그만하지? 고분고분해지면 지워줄 수도 있어." },
      { sender: "character", name: "이주하", text: "뭐...?! 윽, 으으윽... 비열하게 진짜... 알았어, 알았다고! 내가 잘못했으니까... 뭐든지 시키는 거 다 해줄 테니까, 지워줘..." }
    ],
    commentsCount: "442"
  },
  yuinha: {
    age: "19세 (고교생)",
    height: "164cm / 47kg",
    personality: "퉁명스러움 · 집착",
    mbti: "ISTP",
    author: "비밀누구",
    tags: ["#동거", "#일진녀", "#로맨스", "#일상", "#집착", "#부대낌", "#하렘"],
    story: "제멋대로이고 퉁명스럽기 그지없는 일진녀와 한 지붕 다세대 옥탑방에서 룸메이트 계약을 맺고 벌이는 거친 동거 생활. 밤낮으로 당신을 무시하던 그녀가 점차 당신의 든든하고 따뜻한 밥상에 무장해제되어 갑니다.",
    prologueText: "비좁고 창고 같은 다세대 임시 방바닥. 인하가 이불에 기대앉아 풍선껌을 쩍쩍 씹으며 가당치도 않게 문가에 선 당신의 위압적인 가방을 뚫어져라 노려봅니다.",
    prologueChat: [
      { sender: "character", name: "유인하", text: "방이 왜 이따구로 좁아터졌냐? 나 발 뻗고 잘 때 거치적거리지 마라. 그리고 내 허락 없이 빨래 건조대에 옷 걸지도 말고." },
      { sender: "user", name: "나", text: "재워주는 것만으로 감지덕지해야지. 청소 안 하면 내일 국은 없어." },
      { sender: "character", name: "유인하", text: "쳇... 기가 막혀서 원. 내가 와이셔츠 빨래 정도는 해줄 용의 있으니까, 내일 삼겹살 반찬 해놔. 알겠냐?" }
    ],
    commentsCount: "194"
  },
  sharon: {
    age: "250세 (마녀)",
    height: "166cm / 51kg",
    personality: "나긋나긋 · 엉뚱함",
    mbti: "ENFJ",
    author: "판타지아",
    tags: ["#판타지", "#현대적응", "#마녀", "#차원이동", "#녹발", "#엉뚱", "#러브코미디"],
    story: "차원 균열을 통해 옥탑 장롱 안으로 옷걸이들과 함께 사정없이 굴러떨어진 이세계의 고귀한 엘리트 대마녀 샤론. 주위 세탁기나 오븐 등을 위험천만한 고대 흑마력 성물로 착각해 벌이는 엉뚱 발랄 적응 로맨스.",
    prologueText: "옥탑방 장롱 속에서 삐걱삐걱 옷더미가 대거 떨어지더니, 웅장한 녹색 긴 머리를 흔들며 판타지 세계 복장의 장엄한 고깔모자 미녀가 기 침을 터트리며 돌출되어 나옵니다.",
    prologueChat: [
      { sender: "character", name: "샤론", text: "오오... 신성한 정령의 정화 의식이 발현된 아공간이옵니까? 소첩에게 위험한 암흑 물약을 정화해 준 은공 덕에 이 누옥에서 숨을 쉬옵니다." },
      { sender: "user", name: "나", text: "옷장이고 정화 물약이 아니라 섬유유연제 냄새예요. 그리고 여기 제 방입니다만..." },
      { sender: "character", name: "샤론", text: "섬... 유... 유연? 그렇다면 이 손수 들고 계시는 정체불명의 네모난 발광 아티팩트(스마트폰)는 영체 소통용 고차원 성물입니까?!" }
    ],
    commentsCount: "223"
  },
  seora: {
    age: "24세 (트레이너)",
    height: "170cm / 53kg",
    personality: "뇌쇄적 · 스포티",
    mbti: "ESFJ",
    author: "헬스코치",
    tags: ["#심야PT", "#스포티", "#도발", "#트레이너", "#캠퍼스", "#위트", "#다이어트"],
    story: "스포티한 매력과 사정없이 완벽한 비율의 누나 트레이너 안서라. 심야 지점에 단둘이 잔류하게 되면서 운동 자세 지도를 빌미로 행해지는 아슬아슬한 피지컬 도발과 1:1 비밀 코칭 로맨스.",
    prologueText: "자정 무렵의 형광등이 소등된 헬스 클럽. 선배인 안서라 트레이너가 수건으로 목덜미를 연신 어루만지더니 뇌쇄적이고 장난 가득한 조소와 함께 당신의 어깨 결절을 가볍게 매만지며 뒤에서 기댑니다.",
    prologueChat: [
      { sender: "character", name: "안서라", text: "회원님~ 오늘 데드리프트 기립근 자극이 하나도 안 온 눈빛인데? 내가 밀착해서 자세 완벽하게 세워줄까?" },
      { sender: "user", name: "나", text: "부탁드려요, 선배. 조금 중량이 무거워서 흉추가 굽네요." },
      { sender: "character", name: "안서라", text: "후훗, 걱정 마. 무너지면 내가 온몸으로 버퍼 띄워 안고 있을 테니까... 내 가슴 닿는 자극 보면서 서서히 세워봐. 힘 꽉 주고?" }
    ],
    commentsCount: "119"
  }
};

interface CharacterDetailProps {
  charId: string;
  characters: Character[];
  userState: UserState;
  onUpdateUserState: (state: UserState) => void;
  onStartChat: (charId: string) => void;
  onBack: () => void;
}

interface CommentItem {
  id: string;
  author: string;
  time: string;
  body: string;
  likes: number;
  replies: number;
}

export default function CharacterDetail({
  charId,
  characters,
  userState,
  onUpdateUserState,
  onStartChat,
  onBack
}: CharacterDetailProps) {
  const character = characters.find((c) => c.id === charId);
  const metadata = RICH_CHARACTERS_DATA[charId] || {
    age: "알 수 없음",
    height: "알 수 없음",
    personality: "신비로움",
    mbti: "XXXX",
    author: "원작작가",
    tags: ["#노벨챗", "#AI"],
    story: character?.description || "노벨챗 인기 캐릭터의 숨겨진 로맨스 비밀 이야기.",
    prologueText: "조용히 문이 열리고 비밀스런 대화가 시작됩니다.",
    prologueChat: [
      { sender: "character", name: character?.name || "캐릭터", text: "안녕? 드디어 나를 보러 찾아와 주었구나." },
      { sender: "user", name: "나", text: "만나서 반가워. 많이 기대했어." }
    ],
    commentsCount: "128"
  };

  if (!character) return null;

  // Local state managers
  const isFavorite = userState.favorites.includes(character.id);
  const [localLikes, setLocalLikes] = useState(() => Number(character.likes) || 120);
  const [hasLiked, setHasLiked] = useState(false);
  
  // Interactive comments state
  const [commentInput, setCommentInput] = useState("");
  const [localComments, setLocalComments] = useState<CommentItem[]>([
    {
      id: "1",
      author: "유저별★초신성",
      time: "2일 전",
      body: `${character.name} 말투가 진짜 고증 대박이고 살아있는 느낌이네요 ㅋㅋㅋ 컨셉 대박 적극 추천합니다!`,
      likes: 42,
      replies: 5
    },
    {
      id: "2",
      author: "녹아우너",
      time: "4일 전",
      body: "프롤로그 소설 일러스트부터 몰입감 대박임. 수위 구간 묘사랑 목소리 인공지능 완성도가 짱이에요.",
      likes: 18,
      replies: 1
    },
    {
      id: "3",
      author: "컴더",
      time: "1주 전",
      body: "일관성 장난 없고 대사 칠 때 짜릿함. 최근 업데이트 된 에셋도 최고입니다.",
      likes: 9,
      replies: 0
    }
  ]);
  const [sortType, setSortType] = useState<"new" | "likes">("new");

  // Author modal state
  const [isAuthorModalOpen, setIsAuthorModalOpen] = useState(false);

  // Success Toast alert manager
  const [toastMessage, setToastTimerMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastTimerMessage(msg);
    setTimeout(() => {
      setToastTimerMessage((prev) => (prev === msg ? null : prev));
    }, 2200);
  };

  // Toggle favorite Star handler
  const handleToggleFavorite = () => {
    let updatedFavorites = [...userState.favorites];
    if (isFavorite) {
      updatedFavorites = updatedFavorites.filter((id) => id !== character.id);
      triggerToast("관심 캐릭터에서 취소되었습니다 ★");
    } else {
      updatedFavorites.push(character.id);
      triggerToast("관심 캐릭터에 소장 추가되었습니다!");
    }
    onUpdateUserState({
      ...userState,
      favorites: updatedFavorites
    });
  };

  // Heart like handler
  const handleLikeCharacter = () => {
    if (hasLiked) {
      setLocalLikes((prev) => prev - 1);
      setHasLiked(false);
      triggerToast("좋아요가 취소되었습니다 💔");
    } else {
      setLocalLikes((prev) => prev + 1);
      setHasLiked(true);
      triggerToast("캐릭터에 심장 좋아요를 보냈습니다! ❤️");
    }
  };

  // Comments submit handler
  const handleAddComment = () => {
    if (!commentInput.trim()) {
      triggerToast("댓글 내용을 가득 입력한 후 등록해주세요!");
      return;
    }
    const newComment: CommentItem = {
      id: String(Date.now()),
      author: userState.nickname || "나",
      time: "방금 전",
      body: commentInput.trim(),
      likes: 0,
      replies: 0
    };
    setLocalComments([newComment, ...localComments]);
    setCommentInput("");
    triggerToast("댓글이 실시간 등록되었습니다! 💬");
  };

  // Comments Like increments handler
  const handleLikeComment = (commentId: string) => {
    setLocalComments(
      localComments.map((c) =>
        c.id === commentId ? { ...c, likes: c.likes + 1 } : c
      )
    );
    triggerToast("댓글 감상에 좋아요 공감을 보냈습니다.");
  };

  // Dynamic Avatar fallback painter
  const getAvatarColor = (id: string) => {
    const colors: Record<string, string> = {
      amelia: "from-[#ef4444] to-[#3b82f6]",
      sooa: "from-[#10b981] to-[#3b82f6]",
      ohhana: "from-[#f59e0b] to-[#ec4899]",
      commander: "from-[#3b82f6] to-[#10b981]",
      saebyeok: "from-[#ec4899] to-[#ef4444]"
    };
    return colors[id] || "from-[#8b5cf6] to-[#ec4899]";
  };

  return (
    <div className="w-full max-w-[1240px] mx-auto px-4 md:px-[20px] py-4 md:py-8 flex flex-col gap-6 md:gap-10">
      
      {/* Detail view banner navigation */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white cursor-pointer transition-all duration-150 py-1.5 px-3 rounded-full bg-neutral-900 border border-neutral-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>목록으로 돌아가기</span>
        </button>
        <span className="text-xs font-mono font-medium text-neutral-500">
          페르소나 캐릭터 상세 정보 시안
        </span>
      </div>

      {/* HERO SECTION DECK */}
      <section className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 md:gap-10">
        
        {/* Left Column: Rich Portrait Banner Artwork Card */}
        <div className="flex flex-col gap-4">
          <div className="w-full h-[400px] md:h-[440px] rounded-3xl overflow-hidden relative border border-neutral-800 select-none shadow-2xl relative group bg-[#0a0a0c]">
            {character.avatar ? (
              <img
                src={character.avatar}
                alt={character.name}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-700 object-center"
              />
            ) : (
              <div className={`absolute inset-0 bg-gradient-to-tr ${getAvatarColor(character.id)} flex items-center justify-center`}>
                <span className="font-extrabold text-[#eee] text-5xl">{character.name.slice(0, 1)}</span>
              </div>
            )}
            
            {/* Elegant overlay styling vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent pointer-events-none" />
            
            <div className="absolute bottom-5 left-5 right-5 leading-none">
              <span className="text-[11px] font-black uppercase text-[#26eeb7] tracking-widest block mb-1">
                {getGenreKorean(character.genre)}
              </span>
              <span className="text-2xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                {character.name}
              </span>
              <span className="text-[11px] text-neutral-400 font-semibold block mt-1.5 opacity-90 truncate">
                원작: {character.title}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Character profile details sheets */}
        <div className="flex flex-col">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-xs font-medium text-neutral-500 tracking-wide">
                {character.title}
              </span>
              <div className="flex items-center gap-3.5 mt-1.5">
                <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-none">
                  {character.name}
                </h1>
                
                {/* Favorite toggle bookmark button */}
                <button
                  onClick={handleToggleFavorite}
                  className={`p-1.5 rounded-full border transition-all cursor-pointer ${
                    isFavorite 
                      ? "bg-amber-500/10 border-amber-500/30 text-amber-400 scale-110" 
                      : "bg-neutral-900 border-neutral-800 text-neutral-500 hover:text-white"
                  }`}
                  title="관심 등록하기"
                >
                  <Star className="w-5 h-5 fill-current" />
                </button>
              </div>
              <p className="text-neutral-300 text-base font-semibold mt-3">
                {character.tagline}
              </p>
            </div>
          </div>

          {/* Social cumulative metrics dashboard */}
          <div className="flex flex-wrap items-center gap-4 mt-4">
            <span className="inline-flex items-center gap-1.5 text-xs text-neutral-400 font-medium bg-neutral-900 border border-neutral-800/60 px-3 py-1.5 rounded-full">
              <MessageSquare className="w-3.5 h-3.5 text-neutral-500" />
              <span>대화 수</span>
              <b className="text-neutral-200">{character.chats || "9.9K"}</b>
            </span>

            <span className="inline-flex items-center gap-1.5 text-xs text-neutral-400 font-medium bg-neutral-900 border border-neutral-800/60 px-3 py-1.5 rounded-full">
              <Eye className="w-3.5 h-3.5 text-neutral-500" />
              <span>에셋 갤러리</span>
              <b className="text-neutral-200">71</b>
            </span>

            <button
              onClick={handleLikeCharacter}
              className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full cursor-pointer transition-all border ${
                hasLiked 
                  ? "bg-rose-500/10 border-rose-500/30 text-rose-400" 
                  : "bg-neutral-900 border-neutral-800/60 text-neutral-400 hover:bg-neutral-850"
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${hasLiked ? "fill-rose-500" : ""}`} />
              <span>좋아요</span>
              <b className={hasLiked ? "text-rose-400" : "text-neutral-200"}>{localLikes.toLocaleString()}</b>
            </button>

            <span className="w-[1px] h-3.5 bg-neutral-800 hidden md:block" />

            {/* Author label toggle */}
            <span 
              onClick={() => setIsAuthorModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#b9adff] hover:text-white cursor-pointer bg-[#7c6cff]/10 border border-[#7c6cff]/20 px-3.5 py-1.5 rounded-full hover:bg-[#7c6cff]/20 transition-all"
              title="작가 카드 스펙 보기"
            >
              <span className="w-4 h-4 rounded-full bg-gradient-to-tr from-[#7c6cff] to-[#4f7cff] text-[9px] font-black text-white flex items-center justify-center">
                작
              </span>
              <span>작가: {metadata.author}</span>
            </span>
          </div>

          {/* Abstract tag labels row */}
          <div className="flex flex-wrap gap-1.5 mt-5">
            {metadata.tags.map((tag) => (
              <span 
                key={tag} 
                className="text-xs font-bold text-neutral-400 bg-neutral-900/80 border border-neutral-850 px-2.5 py-1 rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Specific core detail spec indicators grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-6 bg-gradient-to-b from-neutral-900/60 to-neutral-900/20 border border-neutral-850 rounded-2xl p-4">
            <div className="flex flex-col gap-1 text-center sm:text-left">
              <span className="text-[10px] text-neutral-500 font-extrabold uppercase tracking-widest bg-neutral-950/80 w-fit px-2 py-0.5 rounded-md mx-auto sm:mx-0">나이 Age</span>
              <span className="text-xs md:text-sm text-neutral-200 font-bold">{metadata.age}</span>
            </div>
            <div className="flex flex-col gap-1 text-center sm:text-left">
              <span className="text-[10px] text-neutral-500 font-extrabold uppercase tracking-widest bg-neutral-950/80 w-fit px-2 py-0.5 rounded-md mx-auto sm:mx-0">신장 Size</span>
              <span className="text-xs md:text-sm text-neutral-200 font-bold">{metadata.height}</span>
            </div>
            <div className="flex flex-col gap-1 text-center sm:text-left">
              <span className="text-[10px] text-neutral-500 font-extrabold uppercase tracking-widest bg-neutral-950/80 w-fit px-2 py-0.5 rounded-md mx-auto sm:mx-0">성격 Mood</span>
              <span className="text-xs md:text-sm text-neutral-200 font-bold">{metadata.personality}</span>
            </div>
            <div className="flex flex-col gap-1 text-center sm:text-left">
              <span className="text-[10px] text-neutral-500 font-extrabold uppercase tracking-widest bg-neutral-950/80 w-fit px-2 py-0.5 rounded-md mx-auto sm:mx-0">MBTI MBTI</span>
              <span className="text-xs md:text-sm text-neutral-200 font-bold">{metadata.mbti}</span>
            </div>
          </div>

          {/* Worldview summary description card */}
          <div className="mt-5 p-4 bg-neutral-900/30 border border-neutral-850 rounded-2xl">
            <div className="text-[11px] font-extrabold uppercase text-[#b9adff] tracking-widest mb-1.5">
              원작 시놉시스 &amp; 세계관 설정
            </div>
            <p className="text-base text-neutral-300 leading-relaxed font-medium">
              {metadata.story}
            </p>
          </div>

          {/* CTA actions group */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              onClick={() => onStartChat(character.id)}
              className="flex-1 bg-gradient-to-r from-[#7c6cff] to-[#5f4fd6] text-white font-extrabold text-sm py-4.5 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.01] hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-[#7c6cff]/10 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white text-white" />
              <span>새 대화 시작하기</span>
            </button>
            <button
              onClick={() => onStartChat(character.id)}
              className="bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-neutral-200 font-bold text-sm py-4.5 px-6 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 transition-all cursor-pointer"
            >
              <span>대화 이어서하기</span>
            </button>
            <button
              onClick={() => triggerToast("원작 소설/웹툰 플랫폼 연동 페이지로 이동합니다 (인공지능 데모)")}
              className="bg-neutral-950 hover:bg-neutral-900 border border-neutral-850 text-neutral-400 font-bold text-sm py-4.5 px-5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>원작 보러가기</span>
            </button>
          </div>

        </div>
      </section>

      {/* CHARACTER ASSETS COLLECTION AREA */}
      <section className="py-8 border-t border-neutral-900">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-black text-white select-none flex items-center gap-2">
            <span>스토리 컬렉션</span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 bg-neutral-900 px-2 py-0.5 border border-neutral-800 rounded">
              Collection
            </span>
          </h2>
          <button 
            onClick={() => triggerToast("에셋 라이브러리 연동 준비 중")}
            className="text-xs text-neutral-400 hover:text-white cursor-pointer"
          >
            전체보기
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400 font-medium mb-4 select-none">
          <span>🔓 수집률 <b>2 / 71</b> 에셋 수집</span>
          <div className="w-[160px] h-1.5 bg-neutral-850 rounded-full overflow-hidden">
            <span className="block h-full w-[15%] bg-gradient-to-r from-[#7c6cff] to-[#4f7cff]" />
          </div>
        </div>

        {/* Collection slide track grid */}
        <div className="flex overflow-x-auto gap-4 pb-3 scrollbar-thin scrollbar-thumb-neutral-800">
          
          {/* Active collected cards */}
          <div className="flex-shrink-0 w-[140px] md:w-[150px] aspect-[3/4] rounded-2xl border border-neutral-800 bg-[#0a0a0c] overflow-hidden relative group cursor-pointer" onClick={() => triggerToast("오하나 - 기본 스쿨수트 에셋을 감상합니다.")}>
            {character.avatar ? (
              <img
                src={character.avatar}
                alt=""
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className={`w-full h-full bg-gradient-to-tr ${getAvatarColor(character.id)}`} />
            )}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-2 text-center">
              <span className="text-[10px] font-black text-[#26eeb7]">수집됨</span>
              <span className="text-[11px] font-bold text-white block truncate">기본 일상</span>
            </div>
          </div>

          <div className="flex-shrink-0 w-[140px] md:w-[150px] aspect-[3/4] rounded-2xl border border-[#7c6cff]/30 bg-[#7c6cff]/5 overflow-hidden relative group cursor-pointer" onClick={() => triggerToast("오하나 - 심야 체육관 에셋을 감상합니다.")}>
            {character.avatar ? (
              <img
                src={character.avatar}
                alt=""
                className="w-full h-full object-cover filter brightness-90 saturate-50 group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className={`w-full h-full bg-gradient-to-tr ${getAvatarColor(character.id)}`} />
            )}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-2 text-center">
              <span className="text-[10px] font-black text-[#26eeb7]">수집됨</span>
              <span className="text-[11px] font-bold text-white block truncate">룸메이트 동거</span>
            </div>
          </div>

          {/* Locked indicators */}
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div 
              key={i} 
              onClick={() => triggerToast(`대화를 이어나가 조건 만족 시 잠금 해제됩니다. (Locked ${i})`)}
              className="flex-shrink-0 w-[140px] md:w-[150px] aspect-[3/4] rounded-2xl border border-neutral-900 bg-[#0a0a0c] overflow-hidden relative group cursor-pointer"
            >
              <div className="absolute inset-0 bg-[#020205]/95 backdrop-blur-[3.5px] z-10 flex flex-col items-center justify-center gap-1.5">
                <span className="text-xl">🔒</span>
                <span className="text-[10px] font-extrabold text-neutral-500 uppercase tracking-wider">잠금 상태</span>
              </div>
              {character.avatar ? (
                <img
                  src={character.avatar}
                  alt=""
                  className="w-full h-full object-cover opacity-10 filter blur-md"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full bg-neutral-950" />
              )}
            </div>
          ))}

        </div>
      </section>

      {/* PROLOGUE SECTION */}
      <section className="py-8 border-t border-neutral-900">
        <div className="mb-6">
          <h2 className="text-xl md:text-2xl font-black text-white select-none flex items-center gap-2">
            <span>프롤로그 설정</span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#7c6cff]">
              Prologue Story
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-6 items-center">
          
          {/* Left Block: Intro artwork canvas video block placeholder */}
          <div 
            onClick={() => triggerToast("인트로 사운드 재생 갤러리 준비 중 (AI Demo)")}
            className="w-full aspect-[4/3] rounded-3xl overflow-hidden bg-gradient-to-tr from-[#2a2438] to-[#1a1626] border border-neutral-850 flex items-center justify-center relative group cursor-pointer transition-all duration-300 hover:border-[#7c6cff]/40"
          >
            <div className="absolute inset-0 bg-radial-gradient-glow pointer-events-none" />
            
            <div className="relative z-10 text-center flex flex-col items-center px-4">
              <span className="w-16 h-16 rounded-full bg-neutral-850/80 group-hover:bg-[#7c6cff]/55 border border-white/10 flex items-center justify-center transition-all duration-300 group-hover:scale-105 shadow-xl mb-3.5">
                <Play className="w-6 h-6 fill-white text-white ml-1" />
              </span>
              <span className="text-xs md:text-sm font-extrabold text-neutral-200">
                프롤로그 보이스 인트로 재생
              </span>
              <span className="text-[10px] md:text-xs text-neutral-500 font-semibold block mt-1">
                클릭하면 {character.name} 캐릭터의 생생한 가상 보이스 연출이 재생됩니다.
              </span>
            </div>

            <span className="absolute bottom-3 left-4 text-[10px] font-bold text-neutral-400 bg-black/60 border border-neutral-850 px-2 py-0.5 rounded-md">
              INTRO 0:18
            </span>
          </div>

          {/* Right Block: Live Chat conversation flow representation */}
          <div className="flex flex-col justify-center gap-4 bg-neutral-950/40 p-4 rounded-3xl border border-neutral-900">
            <p className="text-stone-300 text-base leading-relaxed p-1.5 bg-neutral-950/50 rounded-xl px-3 border border-neutral-900 font-medium">
              {metadata.prologueText}
            </p>

            <div className="flex flex-col gap-3.5 max-h-[350px] overflow-y-auto pr-1">
              {metadata.prologueChat.map((bubble, idx) => (
                <div 
                  key={idx} 
                  className={`flex gap-3 max-w-[85%] items-end ${
                    bubble.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${getAvatarColor(character.id)} p-[1.5px] shrink-0`}>
                    <div className="w-full h-full bg-[#111] rounded-full flex items-center justify-center font-black text-[9px]">
                      {bubble.name.slice(0, 1)}
                    </div>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-neutral-500 font-extrabold ml-1">{bubble.name}</span>
                    <div className={`px-4 py-2.5 rounded-2xl text-base ${
                      bubble.sender === "user" 
                        ? "bg-[#7d6dfa] text-white rounded-tr-none" 
                        : "bg-neutral-900 text-neutral-200 rounded-tl-none border border-neutral-850"
                    }`}>
                      {bubble.text}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* COMMENTS LIST AREA (Replaces understanding) */}
      <section className="py-8 border-t border-neutral-900">
        <div className="flex items-center justify-between mb-4.5">
          <h2 className="text-xl md:text-2xl font-black text-white select-none flex items-center gap-2">
            <span>한 줄 감상평</span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#7c6cff]">
              Comments ({localComments.length})
            </span>
          </h2>
          
          <div className="flex items-center gap-3 text-xs font-semibold text-neutral-500">
            <span 
              onClick={() => {
                setSortType("new");
                setLocalComments([...localComments].sort((a,b) => b.id.localeCompare(a.id)));
              }}
              className={`cursor-pointer transition-colors ${sortType === "new" ? "text-neutral-200 font-bold" : "hover:text-neutral-300"}`}
            >
              최신순
            </span>
            <span className="text-neutral-800">|</span>
            <span 
              onClick={() => {
                setSortType("likes");
                setLocalComments([...localComments].sort((a,b) => b.likes - a.likes));
              }}
              className={`cursor-pointer transition-colors ${sortType === "likes" ? "text-neutral-200 font-bold" : "hover:text-neutral-300"}`}
            >
              좋아요순
            </span>
          </div>
        </div>

        {/* Post Comment Input row */}
        <div className="flex gap-2.5 mb-6">
          <input
            type="text"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddComment();
            }}
            placeholder="이 페르소나 캐릭터에 대한 애정과 감상을 남겨보세요."
            className="flex-grow bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-3 text-xs md:text-sm text-neutral-200 placeholder-neutral-600 outline-none focus:border-[#7c6cff]/65 transition-all text-ellipsis"
          />
          <button
            onClick={handleAddComment}
            className="bg-[#7c6cff] hover:bg-[#5f4fd6] text-white font-extrabold text-xs md:text-sm px-6 rounded-xl cursor-pointer active:scale-95 transition-all shrink-0"
          >
            등록
          </button>
        </div>

        {/* Comments mapping list */}
        <div className="flex flex-col divide-y divide-neutral-900">
          {localComments.map((comment) => (
            <div key={comment.id} className="py-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-850 flex items-center justify-center text-[10px] font-black text-neutral-300 font-mono select-none">
                    {comment.author.slice(0, 1)}
                  </div>
                  <div>
                    <span className="text-xs md:text-sm font-bold text-neutral-300 block leading-tight">{comment.author}</span>
                    <span className="text-[10px] text-neutral-500 font-medium">{comment.time}</span>
                  </div>
                </div>
              </div>
              <p className="text-base text-neutral-300 font-medium leading-relaxed pl-1 md:pl-10">
                {comment.body}
              </p>
              <div className="flex items-center gap-4 pl-1 md:pl-10 mt-1">
                <button
                  onClick={() => handleLikeComment(comment.id)}
                  className="text-[11px] font-bold text-neutral-500 hover:text-rose-400 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>♡</span>
                  <span>공감 {comment.likes}</span>
                </button>
                <button
                  onClick={() => triggerToast("답글 기능 준비 중")}
                  className="text-[11px] font-bold text-neutral-500 hover:text-[#b9adff] transition-colors cursor-pointer"
                >
                  답글 {comment.replies}
                </button>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* AUTHOR MODAL PROFILE POPUP */}
      {isAuthorModalOpen && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAuthorModalOpen(false);
          }}
          className="fixed inset-0 z-[200] background-black/60 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="w-full max-w-[340px] bg-[#15131c] border border-neutral-850 rounded-3xl p-6 relative animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setIsAuthorModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-500 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#7c6cff] to-[#4f3fd6] text-white font-extrabold text-xl flex items-center justify-center mx-auto mb-3 shadow-xl">
              {metadata.author.slice(0, 1)}
            </div>

            <h3 className="text-lg font-black text-white text-center leading-none">
              {metadata.author}
            </h3>
            <p className="text-[11px] text-neutral-500 font-extrabold uppercase text-center mt-1">
              에이스 작가 / Creator
            </p>

            {/* Author Metrics column stats */}
            <div className="grid grid-cols-3 gap-2 py-3.5 my-4 border-y border-neutral-850 text-center">
              <div>
                <b className="block text-base font-extrabold text-white text-center">12</b>
                <small className="text-[10px] text-neutral-500 font-semibold block leading-none mt-1">작품</small>
              </div>
              <div>
                <b className="block text-base font-extrabold text-white text-center">340+</b>
                <small className="text-[10px] text-neutral-500 font-semibold block leading-none mt-1">캐릭터</small>
              </div>
              <div>
                <b className="block text-base font-extrabold text-white text-center">5.1K</b>
                <small className="text-[10px] text-neutral-500 font-semibold block leading-none mt-1">구독자</small>
              </div>
            </div>

            <p className="text-xs text-neutral-400 text-center leading-snug font-medium mb-5 px-1 py-1 bg-neutral-950/20 border border-neutral-900 rounded-xl">
              "서브컬처 일상 로맨스와 동거 라이프 소설을 즐겨 씁니다. 노벨챗 마이 페르소나와 속 깊은 가상 은밀 동거 대화를 시작해보세요."
            </p>

            <button
              onClick={() => {
                triggerToast(`[${metadata.author}] 작가 전용 Curation Booth로 이동 (데모)`);
                setIsAuthorModalOpen(false);
              }}
              className="w-full bg-[#7c6cff] hover:bg-[#5f4fd6] text-white font-extrabold text-xs md:text-sm py-3 rounded-xl transition-all cursor-pointer shadow-lg shadow-[#7c6cff]/10"
            >
              작가의 다른 작품 구경하기
            </button>
          </div>
        </div>
      )}

      {/* FLOAT MESSAGE TOAST ALERT MANAGER */}
      {toastMessage && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[300] bg-neutral-900 border border-neutral-800 text-neutral-200 text-xs md:text-sm px-6 py-3 rounded-2xl shadow-2xl tracking-wide flex items-center gap-1.5 animate-in slide-in-from-bottom-3 duration-300 font-medium">
          <span>✔️</span>
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
