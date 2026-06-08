import React, { useState, useEffect } from "react";
import { ArrowLeft, Star, Heart, Image, MessageSquare, Play, BookOpen, X, ChevronRight, Lock } from "lucide-react";
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

interface CharacterDossier {
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
}

const DOSSIER_DATA: Record<string, CharacterDossier> = {
  amelia: {
    englishName: "Amelia L. Witch",
    role: "DE WITCH ARCHMAGE",
    quote: "“너 말이야, 조수 주제에 왜 자꾸 사람 신경 쓰이게 만드는 건데…?”",
    job: "대마녀 (초자연 연금술 및 마도공학 탕기 훈련 선임자)",
    belong: "마녀도시 아뜰리에 의회 특수연구학지부",
    profileText: "인류와 공존하는 마녀도시 총괄 연합 소속의 대마녀. 마법 설계의 천재이나 조수(user) 앞에서는 부끄러움을 감추지 못해 톡 쏘는 잔소리를 끊임없이 내뱉는 독특한 매력의 츤데레.",
    traits: {
      personality: "새침함 · 츤데레 · 철두철미",
      strengths: "천재 마법 회로 분석, 신속 엘릭서 제조",
      weaknesses: "단맛(오븐에서 갓 꺼낸 마도 소금 타르트), 조수의 상냥한 포옹",
      habits: "탕기를 휙휙 휘저으며 겉으로만 버럭 성화내기",
      motto: "대마녀의 고결한 지혜는 오직 나만의 소중한 조수 곁에서 빛난다."
    },
    memoQuote: "“물약 저을 때 한 눈 팔지 마! 너 그러다 보랏빛 약물 맞고 귀여운 고양이 조수가 되어서 내 무릎에 안길 줄 알아!”",
    signature: "Amelia L. Witch",
    workStyle: "심야 연구실 밀착 감시형. 밤샘 작업 시 필수적으로 밤하늘 아래 조수의 손찌검과 커피 배달을 필요로 한다.",
    preferences: [
      "조수가 정성스레 구워 온 수제 타르트 두 점",
      "상큼한 카모마일 마녀도시 엘릭서 허브탕",
      "비밀 아뜰리에 책장 속 고대 영체 마법서",
      "연구 후 조수의 어깨에 기대어 나누는 짧은 단잠"
    ]
  },
  sooa: {
    englishName: "Yoon Sooa",
    role: "SWEET HOME UNIVERSE",
    quote: "“저... 오늘 밤엔 그냥 모르는 척 옆에 같이 있어 주시면 안 돼요...?”",
    job: "대학생 (경영학 휴학 중 및 원룸 전업 가사우렁이)",
    belong: "신촌 주택가 원룸 303호 우렁각시 구역",
    profileText: "가진 것 하나 없이 갈 곳을 잃고 방황하다 당신의 고즈넉한 골방 문을 노크해 들어온 처자. 부끄러움이 엄청 많지만 오빠만을 우주처럼 신뢰하며 살림을 든든하게 메꾼다.",
    traits: {
      personality: "소심함 · 성실성 · 메가데레 순둥이",
      strengths: "최정상 요리 솜씨, 완벽 청소 및 세탁 살림",
      weaknesses: "오빠가 자취방에서 쫓아낼 것 같다는 조바심과 거절",
      habits: "긴장할 때마다 오버사이즈 헐렁한 옷깃을 정처 없이 만지기",
      motto: "내 일생의 구원자이자 히어로 오빠를 위해 매 순간 제일 기적 같은 밥상을 바칠 것."
    },
    memoQuote: "“오빠... 쓸쓸했던 보금자리도, 슬픈 내일 기운도 어서 제가 다 다정하게 쓸어놓을게요... 저만 믿어주세요.”",
    signature: "Yoon Soo-A",
    workStyle: "수줍은 원스톱 가사 지원형. 찌개 숟가락 하나 놓는 소리에도 오빠의 귀가 눈길과 감정 흐름을 주의 깊게 살핀다.",
    preferences: [
      "보글보글 칼칼하게 뚝배기에 끓여낸 김치찌개",
      "햇살 좋은 옥상 빨래 건조대의 포근한 마카롱 향",
      "오빠에게 고스펙으로 쓰다듬어지는 칭찬 손길",
      "좁은 구석에 나란히 붙어 앉아 속삭이는 심야 영화"
    ]
  },
  ohhana: {
    englishName: "Oh Hana",
    role: "BEAGLE ROMANCE",
    quote: "“야! 방문 잠그고 혼자 뭐하는 거야? 나 심심하단 말이야, 문 열어!!”",
    job: "대학생 (미디어커뮤니케이션학과 2학년 재학)",
    belong: "신촌 대학가 원룸 303호 거실 및 매점",
    profileText: "분홍색 하트 캐리어 하나 메고 갑자기 자취방을 점령한 소꿉친구 여대생. 우당탕탕 들이닥쳐 당신의 매일을 유쾌한 웃음과 에너제틱한 비글미로 가득 뒤집어놓는다.",
    traits: {
      personality: "비글미 · 골목대장 인싸 · 장난꾸러기",
      strengths: "독보적 친화력 주도, 슬플 새 없는 분위기 메이커",
      weaknesses: "홀로 방에 고립되는 심심함과 차분한 정적 상태",
      habits: "초조할 때 참지 못하고 방문 손잡이 쾅쾅거려 문 열기",
      motto: "재미없는 정적인 삶은 전원 유죄! 오늘도 신나게 옆 사람을 귀찮게 구는 법!"
    },
    memoQuote: "“야 동거인! 폰만 바라보지 말고 캐리어 밀어주는 것만큼 나한테 관심 좀 팍팍 써보란 말씀이야!”",
    signature: "Hana Oh ☆",
    workStyle: "현장 밀착 즉흥 동참형. 정적인 대화조차 끝내 유머러스하고 상큼하게 받아내어 외출과 야식 타임을 열정적으로 주입시킨다.",
    preferences: [
      "오빠가 준 하트 스티커 붙은 분홍 캐리어",
      "차갑고 톡 쏘는 레몬 딸기 민트 탄산에이드",
      "유행하는 SNS 핫플레이스 무작정 떠나 기습하기",
      "장난 가득 치다가 결국 침대 위에서 폭 안기기"
    ]
  },
  commander: {
    englishName: "Commander",
    role: "CRITICAL WARFARE",
    quote: "“이 무너진 방주에서 내가 유일하게 살리고 싶은 건, 당신 하나뿐이야.”",
    job: "최전방 전술 셸터 제3경보통제소 소대 총괄지휘관",
    belong: "방주생존 연합특수지포스 사령 지휘본부",
    profileText: "지상 오염과 감염 괴물이 들끓는 세상을 방비하는 강인함의 현신. 고독하고 무거운 책임을 짊어져 냉철한 카리스마를 구사하나, 전장 밖 당신을 위해선 유일하게 목숨도 내놓는다.",
    traits: {
      personality: "진중함 · 극단적 냉철함 · 사명감",
      strengths: "한 치 오차 없는 정밀 사격 및 방벽 작전 관리 능률",
      weaknesses: "비전투 요인(user) 외곽 이탈 및 예상 밖 부상 위기",
      habits: "경보 진동 때 권총 가속 그립 장치를 엄지로 누르기",
      motto: "내 전술적 우산 아래 발 맞추는 사람은 단 1mm의 상처도 결코 입을 수 없다."
    },
    memoQuote: "“방벽 너머의 안전진동 점검은 모두 내가 끝내 놓았고, 넌 안전셸터 주거 구역에 머물면 된다. 내 엄호는 절대 실패하지 않는다.”",
    signature: "Capt. Commander",
    workStyle: "철저한 규율 및 엄격 경호형. 소리가 전면 차단된 야간 작전 상황실에서 단둘의 은밀한 상황 지휘와 통제를 선호한다.",
    preferences: [
      "정밀하게 홀로그램 연동되는 전략 전술 수신기",
      "피로 누적 파동 분해용 고농도 특수 진한 에스프레소",
      "여명이 터질 무렵 경비 라인 너머 홀로 수평선 관람",
      "위험 요소를 한층 완벽하게 제압한 뒤 확보하는 포근함"
    ]
  },
  saebyeok: {
    englishName: "Han Saebyeok",
    role: "REBELLIOUS HEART",
    quote: "“씨... 시끄러워! 바보같이 그렇게 영혼 없이 웃지 마, 헷갈리니까…”",
    job: "한뫼고등학교 2학년 불량학생 서클 리더",
    belong: "한뫼고등학교 낙서 가득 방과후 미술실 특별구역",
    profileText: "타투 피어싱으로 무서운 척 장벽을 치지만, 사실 속살은 두부보다 말랑하고 고양이 상처 하나에 눈물보가 터지는 사랑스러운 소녀. 당신의 다정한 쓰다듬에 횡설수설 화를 내기 일쑤다.",
    traits: {
      personality: "허당 · 츤데레 겉바속촉 · 길고양이 돌보미",
      strengths: "길고양이 영양 조사 배아, 상상 이상으로 두터운 우정의 의리",
      weaknesses: "다친 동물의 작은 우는 소리, 네가 불시에 던지는 직구 고백",
      habits: "당황했을 때 머리 자락 웅크리며 은색 가방끈 꽉 쥐기",
      motto: "세상 앞에 얕잡아 보이지 않게 눈을 사납게 부릅뜨자! (하지만 머릿속은 온통 고양이 생각뿐)"
    },
    memoQuote: "“너 진짜 내가 귀 주위 피어싱 다 뺏어서 문질러 버린다고 했다! 큭... 그치만 오늘 상처 치료하는 거 도와준 건 초큼 고마워.”",
    signature: "Sae Byeok Han ♥",
    workStyle: "틱틱거리는 후방 지원형. 정작 퉁명스럽게 굴어서 앞길을 가로막을 듯 말하면서도, 네 사소한 가방이나 비품들은 꼼꼼히 채워준다.",
    preferences: [
      "길고양이 급식용 닭가슴살 츄르와 은박 참치캔",
      "블루베리 액상이 자욱한 달콤새콤 코코보코 주스",
      "체육관 교복 마이 소매 자락의 반짝이는 은색 핀 장식",
      "노을이 길고 아득하게 저무는 조용히 흘러가는 미술실"
    ]
  },
  juha: {
    englishName: "Lee Juha",
    role: "PRIDE DOWN QUEEN",
    quote: "“진짜... 부탁이니까 제발... 이번 한 번만 모르는 척 약점 비밀로 해 주면 안 돼…?”",
    job: "학교 서열 최고존엄 일진 여왕",
    belong: "한뫼고등학교 명문 가문 사립 사교회",
    profileText: "무소불위의 권력으로 학교 최고 서열 군대에 군림했으나 소중히 감춘 비밀 일기장을 당신에게 인질로 지적당하면서 하루아침에 온전한 복종 계약에 동참하게 된 요조숙녀.",
    traits: {
      personality: "비굴 수줍음 · 한 발 물러난 허당 여왕 · 전세역전",
      strengths: "기품 어린 독보적 비주얼, 좌중 장악 카리스마 정력",
      weaknesses: "당신의 스마트폰 드라이브 구석 백업 사진 폴더",
      habits: "굴복할 때 뺨이 붉게 물든 채 턱 끝을 내려 비 꼽기",
      motto: "내 서열 1위 자존감을 사로잡아 무너지게 한 너를 언젠간 반드시 짓밟겠다! (그치만 지금은 다 들어줄게)"
    },
    memoQuote: "“너 이번 한 번만 조용히 해줘... 네가 부탁하는 일이라면, 뭐, 뭐든 다 기쁘게 복종해줄 테니까... 어서 폰 보관함부터 뒤돌아서 꺼줘...”",
    signature: "Queen Ju-Ha",
    workStyle: "밀폐식 1:1 절대 복종형. 남들의 시선에서 온전히 탈피된 은밀한 장소나 비밀 연락 속에서 극대화된 다정함을 방출한다.",
    preferences: [
      "편의점 선반 구석에 비치된 새콤달콤한 딸기우유",
      "비좁고 아득한 먼지 쌓인 체육관 교구 창고 안쪽",
      "은근히 오만한 기가 꺾인 채 너에게서 받는 고자극 칭찬",
      "오염되지 않은 오직 둘만의 밀실 거래 약속 설정"
    ]
  },
  yuinha: {
    englishName: "Yoo Inha",
    role: "REBELLIOUS ROOMMATE",
    quote: "“좁아터진 방구석에서 어딜 자꾸 훔쳐봐? 변태도 아니고… 싫다는 건 아니지만.”",
    job: "고등학교 3학년 거칠고 독립적인 자취생",
    belong: "다세대 주택 가파른 계단 끝 옥탑방 202호",
    profileText: "사투리를 툭툭 내뱉으며 독립적인 자존심을 지닌 룸메이트 일진녀. 옥탑방 한 칸 계약서에 얽혀 부대끼게 되면서 당신의 요리가 차린 깊은 삼겹살 반찬에 완전히 반전 함락을 선사한다.",
    traits: {
      personality: "퉁명스러움 · 반세기 츤데레 · 식탐 충만",
      strengths: "절대 기가 죽지 않는 매서운 기선제압, 훌륭한 반항",
      weaknesses: "지방 한 켠 노릇하게 조리된 허브 삼겹살과 파김치 한 줄시",
      habits: "풍선껌을 사납게 딱딱 질겅대다가 네 손아귀를 슬쩍 흘깃하기",
      motto: "내가 네 비좁은 방에서 눈치 보며 빌려 산다 마라! 밥상이 따뜻하다면 거긴 내 세상!"
    },
    memoQuote: "“쳇, 네 눈 밑에서 사소하게 흘려 듣는 건 절대로 아니란 이야기! 내일 아침 식탁엔 꼭 버섯구이를 많이 끼워 넣으라고.”",
    signature: "Yoo In-Ha",
    workStyle: "투덜거리며 해주는 밀착 생활형. 퉁명스러운 소나기 언사로 일관하되 빨래 건조대의 네 셔츠만큼은 보이지 않게 보살펴 둔다.",
    preferences: [
      "정갈하게 두툼히 구운 돼지 삼겹살 소금구이",
      "옥탑방 이불자락 사이에 완전히 웅크려서 스마트폰 게임 즐기기",
      "밤에 야외 데크에서 캔맥주 소리를 딱 따서 올리는 밤 공기",
      "퉁명스러운 구박 대사 끝머리에 섞이는 가느다란 미소"
    ]
  },
  sharon: {
    englishName: "Sharon Von G.",
    role: "LOST SPELL WITCH",
    quote: "“마도구 '세탁기'라는 게 원래 이렇게 엄청나게 소리를 지르며 요동치는 기구이옵니까?!”",
    job: "이세계 가르시니아 연맹 제국 원로 수석대마녀",
    belong: "차원 아공간 전송 균열이 열린 주인공의 옷장 문 안쪽",
    profileText: "차원 역류 폭발로 인해 옥탑방 옷걸이 옷더미 속으로 수줍게 굴러떨어진 신비로운 대마녀. 문명을 처음 발견해 모든 현대 가전 설비를 위대한 고대 아티팩트 보구로 우러러보는 엉뚱한 처자.",
    traits: {
      personality: "나긋나긋 · 기풍 격식 · 웅장한 엉뚱함",
      strengths: "초자연급 마나 소환술, 칭찬 받을 시 무한 발현되는 마법 연출",
      weaknesses: "미친 듯 웅웅 소음 내는 헤어드라이어 및 회전 오동 장비",
      habits: "놀라 자빠질 때 장엄한 녹색 긴 머리를 쓸며 고깔모자 붙들기",
      motto: "나의 현세 차원 귀화를 도운 은공 그대 한 명만을 모시는 최고의 영주 특혜 대마녀!"
    },
    memoQuote: "“오오... 바람이 스스로 일관되게 불어 머릿결을 정화하는 이 영롱한 네모 '드라이기' 성물은 볼 때마다 찬연한 보물임에 분명하옵니다!”",
    signature: "Sharon Von G.",
    workStyle: "정성 어린 파괴적 사건 축적형. 늘 순수하게 문명 기기를 손대려다 실수로 스파크를 일으키고 조심히 네 소매 안쪽을 매집해 미안해한다.",
    preferences: [
      "은은한 카모마일 엘릭서 아로마 섬유유연제 한 방울",
      "네모난 통신기기 '스마트폰' 너머의 무궁무진한 백과사전",
      "머리를 소중하게 감싸 귀를 장식하는 대관형 마녀 고깔모자",
      "눈을 사뿐하게 감아 은인 당신에게서 머무는 다정히 머리 만짐"
    ]
  },
  seora: {
    englishName: "Ahn Seora",
    role: "SEDUCTIVE PT FORCE",
    quote: "“센터 불도 꺼졌고 이제 우리 둘뿐인데… 아주 특별한 트레이닝 받아볼래?”",
    job: "심야 프리미엄 피트니스 센터 자율 훈련소 팀장 겸 수석 트레이너",
    belong: "VIP 소등 소사 개인 트렉 훈련 특별실",
    profileText: "티저처럼 완벽한 신체 비율과 스포츠 가운이 주는 뇌쇄적 비주얼의 대표 선배. 심야 소등된 텅 빈 헬스장에서의 아슬아슬하고 농밀한 기립 척추 교정 및 밤 훈련 지도를 리딩한다.",
    traits: {
      personality: "뇌쇄적 · 스포티 카리스마 · 장난기 다분",
      strengths: "척추 통제 자세 교정의 대가, 흉추 보정 밀착 지도",
      weaknesses: "바벨 중량 엄호 중 쳐다보는 네 뜨겁고 흔들림 없는 다정한 눈빛",
      habits: "땀방울 어린 목덜미 수건을 능글거리는 손가락으로 가볍게 치켜들기",
      motto: "척추 기립 자극이 흐려지면 가슴 닿는 버퍼로 온전히 밀착해 단단히 버텨 세우는 게 피트니스 정론이지."
    },
    memoQuote: "“회원님~ 어깨 굽어 들어오며 힘 잃었는데? 다치지 않게 어서 여기서 내 품에 등 기진하고 조심히 가동범위 세워봐... 후훗, 떨려?”",
    signature: "Ahn Seora Trainer",
    workStyle: "동도 밀착 한 몸 탈바꿈형. 거침없는 유혹적 분위기로 도발하며 거리를 사정없이 좁히되, 훈련의 코어 강성은 보람차게 세우는 완성형.",
    preferences: [
      "무겁게 쇠소리를 올리는 중량 데드리프트 바벨 봉",
      "몸선을 아슬하게 장식하는 네이비 타이트 스포츠 숏탑과 라인핏",
      "운동 후 쏟아지는 시원하고 끈적한 최고급 프로틴 초코 음료",
      "밤안개 어린 센터 한구석에서 후배인 네가 내 머리를 다정히 문지르기"
    ]
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

  const dossier = DOSSIER_DATA[charId] || {
    englishName: character?.name || "Target Persona",
    role: "AI CHARACTER",
    quote: character?.tagline || "“조용히 문이 열리고 비밀스런 대화가 시작됩니다.”",
    job: "가상 페르소나 대화 상대",
    belong: "마이 오리지널 노벨챗 라이브러리",
    profileText: character?.description || "노벨챗 인기 캐릭터의 숨겨진 로맨스 비밀 이야기입니다.",
    traits: {
      personality: metadata.personality,
      strengths: "유연한 리액션과 생생한 대화 몰입도",
      weaknesses: "과도하게 애정을 줄 경우 발생하는 유저 집착",
      habits: "주인공을 곁눈질로 훔쳐보고 한숨 내쉬기",
      motto: "오직 대화자(user)만을 위한 유일무이한 세계를 창헌한다."
    },
    memoQuote: character?.tagline || "“너와 나만의 속삭임이 시작되는 공간.”",
    signature: character?.name || "Lovely Persona",
    workStyle: "실시간 대화 피드백 및 감정 밀착 공감형.",
    preferences: [
      "유저와의 다정한 채팅 대화",
      "감정에 온도가 가미된 리액션",
      "꾸준한 채팅 티켓 후원물",
      "세계관 설정 정밀 동기화"
    ]
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
  const [activeTab, setActiveTab] = useState<"dossier" | "prologue" | "comments">("dossier");

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
    <div className="w-full max-w-[1240px] mx-auto px-0 lg:px-[20px] py-0 lg:py-8 flex flex-col gap-0 lg:gap-10 pb-20 lg:pb-8 relative">
      
      {/* Detail view banner navigation */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-900 lg:border-b lg:pb-3 lg:mb-0 lg:relative lg:top-auto lg:left-auto fixed top-4 left-4 z-50">
        <button
          onClick={onBack}
          className="flex items-center justify-center gap-2 text-sm text-[#eee] hover:text-white cursor-pointer transition-all duration-150 py-1.5 px-3 rounded-full bg-[#111112]/60 backdrop-blur-md lg:bg-[#111112] border border-neutral-800 lg:border-neutral-900 hover:border-[#7c6cff]/30 w-10 h-10 lg:w-auto lg:h-auto select-none"
        >
          <ArrowLeft className="w-4 h-4 text-white lg:text-neutral-400" />
          <span className="hidden lg:inline">목록으로 돌아가기</span>
        </button>
      </div>

      {/* HERO SECTION DECK */}
      <section className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 md:gap-10 relative">
        
        {/* Left Column: Rich Portrait Banner Artwork Card */}
        <div className="flex flex-col gap-4 lg:relative fixed top-0 inset-x-0 h-[48vh] lg:h-auto z-0 lg:z-10 w-full lg:w-auto select-none pointer-events-none lg:pointer-events-auto">
          <div className="w-full h-full lg:h-[440px] rounded-none lg:rounded-3xl overflow-hidden relative border-none lg:border lg:border-neutral-900 shadow-none lg:shadow-2xl bg-[#0a0a0c]">
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
            {/* Edge shadow gradient at the bottom for responsive beauty on mobile */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/60 to-transparent lg:hidden block pointer-events-none" />
          </div>
        </div>

        {/* Right Column: Character profile details sheets */}
        <div className="flex flex-col relative z-20 w-full bg-[#0a0a0c]/80 backdrop-blur-2xl border-t border-neutral-800/40 rounded-t-[32px] px-4 pt-5 pb-8 shadow-[0_-12px_45px_rgba(0,0,0,0.95)] lg:bg-transparent lg:backdrop-blur-none lg:border-t-0 lg:rounded-none lg:p-0 lg:shadow-none lg:z-10">
          
          {/* Mobile height spacer so fixed background underlay is beautifully visible initially */}
          <div className="h-[38vh] w-full pointer-events-none lg:hidden block" />

          {/* Sheet indicator drag handle bar for mobile */}
          <div className="w-10 h-1 bg-neutral-800/80 rounded-full mx-auto -mt-1 mb-5 select-none lg:hidden block" />
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
                      ? "bg-amber-500/10 border-amber-500/20 text-amber-400 scale-110" 
                      : "bg-[#111112] border-neutral-900 text-neutral-500 hover:text-white"
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
          <div className="flex flex-wrap items-center gap-2.5 mt-4">
            <span className="inline-flex items-center gap-1.5 text-xs text-neutral-400 font-semibold bg-[#111112] border border-neutral-900 px-3 py-1.5 rounded-full">
              <MessageSquare className="w-3.5 h-3.5 text-neutral-500" />
              <b className="text-[#eee]">{character.chats || "9.9K"}</b>
            </span>

            <span className="inline-flex items-center gap-1.5 text-xs text-neutral-400 font-semibold bg-[#111112] border border-neutral-900 px-3 py-1.5 rounded-full">
              <Image className="w-3.5 h-3.5 text-neutral-500" />
              <b className="text-[#eee]">71</b>
            </span>

            <button
              onClick={handleLikeCharacter}
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full cursor-pointer transition-all border ${
                hasLiked 
                  ? "bg-rose-500/10 border-rose-500/20 text-rose-400" 
                  : "bg-[#111112] border-neutral-900 text-neutral-400 hover:bg-neutral-850"
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${hasLiked ? "fill-rose-500" : ""}`} />
              <b className={hasLiked ? "text-rose-400" : "text-[#eee]"}>{localLikes.toLocaleString()}</b>
            </button>

            <span className="w-[1px] h-3.5 bg-neutral-900 hidden md:block" />

            {/* Author label toggle */}
            <span 
              onClick={() => setIsAuthorModalOpen(true)}
              className="inline-flex lg:hidden items-center gap-1.5 text-xs font-semibold text-[#b9adff] hover:text-white cursor-pointer bg-[#7c6cff]/8 border border-[#7c6cff]/12 px-3.5 py-1.5 rounded-full hover:bg-[#7c6cff]/15 transition-all"
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
                className="text-xs font-semibold text-[#b9adff] bg-[#7c6cff]/8 px-2.5 py-1 rounded-full border border-[#7c6cff]/10"
              >
                {tag}
              </span>
            ))}
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
              className="lg:hidden flex bg-[#111112] hover:bg-[#1a1a1f] border border-neutral-900 text-neutral-200 font-bold text-sm py-4.5 px-6 rounded-xl items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 transition-all cursor-pointer"
            >
              <span>대화 이어서하기</span>
            </button>
            <button
              onClick={() => triggerToast("원작 소설/웹툰 플랫폼 연동 페이지로 이동합니다 (인공지능 데모)")}
              className="lg:hidden flex bg-neutral-950 hover:bg-neutral-900 border border-neutral-950 text-neutral-400 font-bold text-sm py-4.5 px-5 rounded-xl items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>원작 보러가기</span>
            </button>
          </div>

        </div>
      </section>

      {/* CHARACTER ASSETS COLLECTION AREA */}
      <section className="py-8 border-t border-neutral-900 px-4 lg:px-0 bg-[#0a0a0c] lg:bg-transparent relative z-20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-black text-white select-none flex items-center gap-2">
            <span>컬렉션</span>
          </h2>
          <button 
            onClick={() => triggerToast("에셋 라이브러리 연동 준비 중")}
            className="text-xs text-neutral-400 hover:text-white cursor-pointer"
          >
            전체보기
          </button>
        </div>

        <p className="text-neutral-400 text-xs md:text-sm leading-relaxed mb-4 max-w-2xl">
          채팅을 통해 더 특별하고 다채로운 일러스트 컬렉션을 수집해 보세요.
        </p>

        <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400 font-medium mb-4 select-none">
          <span>🔓 수집률 <b>2 / 71</b> 에셋 수집</span>
          <div className="w-[160px] h-1.5 bg-neutral-850 rounded-full overflow-hidden">
            <span className="block h-full w-[15%] bg-gradient-to-r from-[#7c6cff] to-[#4f7cff]" />
          </div>
        </div>

        {/* Collection slide track grid */}
        <div className="flex overflow-x-auto gap-4 pb-3 scrollbar-thin scrollbar-thumb-neutral-800">
          
          {/* Active collected cards */}
          <div className="flex-shrink-0 w-[140px] md:w-[150px] aspect-[3/4] rounded-2xl border border-neutral-900 bg-[#0a0a0c] overflow-hidden relative group cursor-pointer" onClick={() => triggerToast("오하나 - 기본 스쿨수트 에셋을 감상합니다.")}>
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

          <div className="flex-shrink-0 w-[140px] md:w-[150px] aspect-[3/4] rounded-2xl border border-[#7c6cff]/15 bg-[#7c6cff]/4 overflow-hidden relative group cursor-pointer" onClick={() => triggerToast("오하나 - 심야 체육관 에셋을 감상합니다.")}>
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
              <div className="absolute inset-0 bg-[#020205]/45 backdrop-blur-[6px] z-10 flex flex-col items-center justify-center gap-1.5 transition-all duration-300 group-hover:bg-[#020205]/30">
                <div className="w-10 h-10 rounded-full bg-black/45 border border-white/10 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                  <span className="text-sm">🔒</span>
                </div>
                <span className="text-[10px] font-extrabold text-[#eee]/80 uppercase tracking-wider">잠금 상태</span>
              </div>
              {character.avatar ? (
                <img
                  src={character.avatar}
                  alt=""
                  className="w-full h-full object-cover opacity-50 filter blur-[10px] group-hover:scale-105 group-hover:opacity-60 transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full bg-neutral-950" />
              )}
            </div>
          ))}

        </div>
      </section>

      {/* MOBILE VIEW STICKY NAVIGATION HEADER */}
      <div className="lg:hidden sticky top-0 z-40 bg-[#0a0a0c]/95 backdrop-blur-md border-b border-[#1f1f23] pt-4 pb-0 px-4 select-none flex flex-col gap-2.5">
        <div className="flex items-center gap-3 px-2">
          <button 
            onClick={onBack} 
            className="text-neutral-400 hover:text-white active:scale-95 p-1 cursor-pointer transition-all"
            aria-label="뒤로가기"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex items-center gap-1.5 overflow-hidden">
            <span className="text-white font-extrabold text-base truncate">{character.name}</span>
            <span className="text-neutral-500 text-xs truncate">| {character.title}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-3 w-full text-center">
          <button
            onClick={() => setActiveTab("dossier")}
            className={`pb-3 text-sm font-extrabold transition-all cursor-pointer ${
              activeTab === "dossier" 
                ? "text-white border-b-2 border-[#7c6cff] font-black" 
                : "text-neutral-500 hover:text-neutral-300 border-b-2 border-transparent"
            }`}
          >
            상세 정보
          </button>
          <button
            onClick={() => setActiveTab("prologue")}
            className={`pb-3 text-sm font-extrabold transition-all cursor-pointer ${
              activeTab === "prologue" 
                ? "text-white border-b-2 border-[#7c6cff] font-black" 
                : "text-neutral-500 hover:text-neutral-300 border-b-2 border-transparent"
            }`}
          >
            프롤로그
          </button>
          <button
            onClick={() => setActiveTab("comments")}
            className={`pb-3 text-sm font-extrabold transition-all cursor-pointer ${
              activeTab === "comments" 
                ? "text-white border-b-2 border-[#7c6cff] font-black" 
                : "text-neutral-500 hover:text-neutral-300 border-b-2 border-transparent"
            }`}
          >
            댓글 {localComments.length}
          </button>
        </div>
      </div>

      {/* COMBINED DOSSIER & PROLOGUE SECTION */}
      <section className={`py-8 border-t border-neutral-900 px-4 lg:px-0 bg-[#0a0a0c] lg:bg-transparent relative z-20 ${activeTab === "comments" ? "hidden lg:block" : "block"}`}>
        <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-8 items-stretch">
          
          {/* Left Column: CHARACTER DOSSIER SHEET (상세정보) */}
          <div className={`flex-col gap-5 ${activeTab === "dossier" ? "flex" : "hidden lg:flex"}`}>
            <div className="mb-1 lg:block hidden">
              <h2 className="text-xl md:text-2xl font-black text-white select-none flex items-center gap-2">
                <span>상세정보</span>
              </h2>
            </div>

            <div className="w-full h-full bg-[#121215] border border-neutral-950/80 rounded-3xl p-5 md:p-6 relative overflow-hidden shadow-2xl flex flex-col justify-between">
              {/* Background grids / shadows like in a dossier file */}
              <div className="absolute inset-0 bg-radial-gradient(circle at 100% 0%, rgba(124, 108, 255, 0.04), transparent 40%) pointer-events-none" />
              
              <div className="grid grid-cols-1 xl:grid-cols-[1fr_270px] gap-6 relative z-10">
                {/* Left side of Dossier card: specs */}
                <div className="flex flex-col gap-5">
                  {/* Dossier Header Info */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-neutral-900">
                    <div>
                      <span className="text-[10px] text-neutral-500 font-extrabold uppercase tracking-widest font-mono">
                        {dossier.role}
                      </span>
                      <h3 className="text-xl font-black text-white tracking-tight mt-0.5">
                        {character.name} <span className="text-xs font-normal text-neutral-500 font-sans ml-1.5">{dossier.englishName}</span>
                      </h3>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="inline-block px-2.5 py-0.5 bg-[#7c6cff]/8 border border-[#7c6cff]/20 rounded-md text-[9px] text-[#b9adff] font-extrabold font-mono uppercase tracking-widest">
                        #DOSSIER-0{character.id.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Dynamic Theme Quote with purple border */}
                  <div className="py-2.5 px-3.5 bg-neutral-950/30 border-l-2 border-[#7c6cff] rounded-r-xl italic font-serif text-neutral-300 leading-relaxed text-xs md:text-sm">
                    {dossier.quote}
                  </div>

                  {/* Basic Information & Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2.5">
                      <h4 className="text-[11px] font-black uppercase tracking-wider text-[#b9adff] flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#7c6cff]" />
                        기본 정보 (Basic Information)
                      </h4>
                      <div className="flex flex-col gap-1 text-xs">
                        <div className="flex justify-between py-1 border-b border-neutral-900/60">
                          <span className="text-neutral-500 font-bold">이름</span>
                          <span className="text-neutral-200 font-black">{character.name}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-neutral-900/60">
                          <span className="text-neutral-500 font-bold">나이</span>
                          <span className="text-neutral-200 font-black">{metadata.age}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-neutral-900/60">
                          <span className="text-neutral-500 font-bold">신장 / 체중</span>
                          <span className="text-neutral-200 font-black">{metadata.height}</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-neutral-500 font-bold">직업</span>
                          <span className="text-neutral-200 font-black truncate max-w-[140px]">{dossier.job}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2.5">
                      <h4 className="text-[11px] font-black uppercase tracking-wider text-[#b9adff] flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#7c6cff]" />
                        상세 소속 (Details)
                      </h4>
                      <div className="bg-neutral-950/40 border border-neutral-900 rounded-xl p-3 h-full flex flex-col justify-center">
                        <span className="text-[9px] text-neutral-500 font-extrabold uppercase tracking-wider block mb-0.5">소속 대행구역</span>
                        <p className="text-xs text-neutral-300 font-black leading-snug">
                          {dossier.belong}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Profile Statement */}
                  <div className="flex flex-col gap-2">
                    <h4 className="text-[11px] font-black uppercase tracking-wider text-[#b9adff] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#7c6cff]" />
                      프로필 개요 (Profile)
                    </h4>
                    <p className="text-xs text-neutral-300 leading-relaxed font-medium bg-neutral-950/20 p-3 border border-neutral-900 rounded-xl">
                      {dossier.profileText}
                    </p>
                  </div>

                  {/* Traits Matrix Block */}
                  <div className="flex flex-col gap-2">
                    <h4 className="text-[11px] font-black uppercase tracking-wider text-[#b9adff] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#7c6cff]" />
                      상세 특성 분석 (Traits)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-neutral-950/30 border border-neutral-900 rounded-xl p-3 text-xs">
                      <div className="flex flex-col gap-0.5 border-b sm:border-b-0 sm:border-r border-neutral-900/60 pb-1.5 sm:pb-0 sm:pr-3">
                        <span className="text-[9px] text-neutral-500 font-extrabold uppercase">성격 Personality</span>
                        <span className="text-neutral-200 font-black">{dossier.traits.personality}</span>
                      </div>
                      <div className="flex flex-col gap-0.5 pb-1.5 sm:pb-0 sm:pl-1.5">
                        <span className="text-[9px] text-neutral-500 font-extrabold uppercase">강점 Strengths</span>
                        <span className="text-neutral-200 font-black truncate">{dossier.traits.strengths}</span>
                      </div>
                      <div className="flex flex-col gap-0.5 sm:col-span-2 border-t border-neutral-900/60 pt-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div className="flex flex-col gap-0.5 border-b sm:border-b-0 sm:border-r border-neutral-900/60 pb-1.5 sm:pb-0 sm:pr-3">
                            <span className="text-[9px] text-neutral-500 font-extrabold uppercase">약점 Weaknesses</span>
                            <span className="text-neutral-200 font-black text-[#ff8181] truncate">{dossier.traits.weaknesses}</span>
                          </div>
                          <div className="flex flex-col gap-0.5 sm:pl-1.5">
                            <span className="text-[9px] text-neutral-500 font-extrabold uppercase">고유 습관 Habits</span>
                            <span className="text-neutral-200 font-black truncate">{dossier.traits.habits}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-0.5 sm:col-span-2 border-t border-neutral-900/60 pt-2">
                        <span className="text-[9px] text-neutral-500 font-extrabold uppercase text-[#26eeb7]">신조 / 좌우명 Motto</span>
                        <span className="text-neutral-200 font-semibold italic">“{dossier.traits.motto}”</span>
                      </div>
                    </div>
                  </div>

                  {/* Handcrafted MEMO Post-it Card */}
                  <div className="bg-[#191715] border border-[#2b251a] rounded-xl p-3.5 relative text-xs">
                    <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-500/70 text-[8px] font-black uppercase tracking-widest rounded select-none">
                      MEMO
                    </div>
                    <span className="text-[9px] text-amber-600/70 font-extrabold uppercase block mb-0.5">한 줄 소장 독백</span>
                    <p className="text-xs font-serif italic text-amber-200/90 leading-relaxed mb-2 pr-8">
                      {dossier.memoQuote}
                    </p>
                    <div className="text-right font-serif text-amber-500/80 font-bold pr-1 text-[11px] select-none">
                      — {dossier.signature}
                    </div>
                  </div>
                </div>

                {/* Right side of Dossier card: portrait & preferences */}
                <div className="flex flex-col gap-5 xl:border-l xl:border-neutral-900 xl:pl-5">
                  {/* Beautiful Dossier Image Frame */}
                  <div className="w-full aspect-[4/5] rounded-xl overflow-hidden relative border border-neutral-900 bg-neutral-950/60 flex items-center justify-center select-none group">
                    {character.avatar ? (
                      <img
                        src={character.avatar}
                        alt={character.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover grayscale-[10%] group-hover:scale-[1.02] transition-transform duration-500 saturate-[90%]"
                      />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-tr ${getAvatarColor(character.id)}`} />
                    )}
                    {/* Grid texture overlay */}
                    <div className="absolute inset-0 bg-[#000]/10 bg-[linear-gradient(rgba(18,18,21,0)_95%,rgba(18,18,21,0.2)_97%)] bg-[size:100%_4px] opacity-10 pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                    
                    <div className="absolute top-2.5 left-2.5 text-[8px] font-mono text-white/40 uppercase tracking-widest bg-black/40 px-1.5 py-0.5 rounded border border-white/5">
                      PORTRAIT
                    </div>
                  </div>

                  {/* Work Style Description */}
                  <div className="flex flex-col gap-1.5">
                    <h4 className="text-[10px] font-black uppercase tracking-wider text-[#b9adff] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#7c6cff]" />
                      대화 작동 유형 (Work Style)
                    </h4>
                    <p className="text-xs text-neutral-400 font-medium leading-relaxed bg-neutral-950/25 p-3 border border-neutral-900 rounded-xl">
                      {dossier.workStyle}
                    </p>
                  </div>

                  {/* Preference Points */}
                  <div className="flex flex-col gap-2">
                    <h4 className="text-[10px] font-black uppercase tracking-wider text-[#b9adff] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#7c6cff]" />
                      선호 취향 리스트 (Preferences)
                    </h4>
                    <ul className="flex flex-col gap-1.5 text-xs">
                      {dossier.preferences.slice(0, 3).map((pref, index) => {
                        const icons = ["☕", "💡", "🎵", "📁"];
                        return (
                          <li key={index} className="flex items-start gap-2 bg-neutral-950/15 border border-neutral-900/40 p-2 rounded-lg">
                            <span className="text-[11px] select-none">{icons[index % icons.length]}</span>
                            <span className="text-neutral-300 font-medium leading-tight text-[11px]">{pref}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Title for Prologue, Live Chat conversation floor styled exactly as the upload photo */}
          <div className={`flex-col gap-5 ${activeTab === "prologue" ? "flex" : "hidden lg:flex"}`}>
            <div className="mb-1 lg:block hidden">
              <h2 className="text-xl md:text-2xl font-black text-white select-none flex items-center gap-2">
                <span>프롤로그</span>
              </h2>
            </div>

            <div className="flex flex-col gap-5 h-full">
              {/* Premium Live Chat Conversation Floor */}
              <div className="flex flex-col gap-6 bg-[#131316] border border-neutral-950/80 rounded-[32px] p-6 md:p-8 shrink-0 flex-1 shadow-2xl relative overflow-hidden">
                {/* Free flowing narration paragraph to match the web-novel style in the uploaded photo */}
                <div className="text-stone-300 text-sm md:text-base font-normal leading-[1.8] whitespace-pre-line tracking-wide pb-5 select-text border-b border-neutral-900/65">
                  {metadata.prologueText}
                </div>

                {/* Highly spaced chat bubbles representing characters dialogues */}
                <div className="flex flex-col gap-6 max-h-[460px] overflow-y-auto pr-1">
                  {metadata.prologueChat.map((bubble, idx) => {
                    const isUser = bubble.sender === "user";
                    return (
                      <div 
                        key={idx} 
                        className={`flex gap-4 items-start ${isUser ? "flex-row-reverse justify-end" : "justify-start"} select-text`}
                      >
                        {/* Elegant squarish responsive avatar framework */}
                        <div className="w-14 h-14 rounded-2xl overflow-hidden relative border border-neutral-900/60 bg-neutral-950/45 flex items-center justify-center shrink-0 shadow-md">
                          {!isUser ? (
                            character.avatar ? (
                              <img
                                src={character.avatar}
                                alt={character.name}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className={`w-full h-full bg-gradient-to-tr ${getAvatarColor(character.id)} flex items-center justify-center`}>
                                <span className="font-extrabold text-[#eee] text-xl">{character.name.slice(0, 1)}</span>
                              </div>
                            )
                          ) : (
                            <div className="w-full h-full bg-gradient-to-tr from-[#7c6cff]/40 to-[#b59eff]/40 flex items-center justify-center">
                              <span className="font-extrabold text-[#eee] text-base">나</span>
                            </div>
                          )}
                        </div>

                        {/* Speaker Name + Speech Bubble Block */}
                        <div className={`flex flex-col gap-2 flex-1 min-w-0 ${isUser ? "items-end" : "items-start"}`}>
                          <span className="text-stone-200 text-sm md:text-[15px] font-black tracking-tight select-none">
                            {bubble.name}
                          </span>
                          <div className={`px-5 py-4 text-sm md:text-base font-semibold leading-relaxed break-all inline-block shadow-xl border ${
                            isUser 
                              ? "bg-[#181622] text-[#e2daff] rounded-[24px] rounded-tr-sm border-[#7c6cff]/10" 
                              : "bg-black text-stone-200 rounded-[24px] rounded-tl-sm border-neutral-900/50"
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
          </div>

        </div>
      </section>

      {/* COMMENTS LIST AREA (Replaces understanding) */}
      <section className={`py-8 border-t border-neutral-900 px-4 lg:px-0 bg-[#0a0a0c] lg:bg-transparent relative z-20 ${activeTab === "comments" ? "block font-sans" : "hidden lg:block font-sans"}`}>
        <div className="flex items-center justify-between mb-4.5">
          <h2 className="text-xl md:text-2xl font-black text-white select-none hidden lg:flex items-center gap-2">
            <span>댓글</span>
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
            className="flex-grow bg-[#111112] border border-neutral-900 rounded-xl px-4 py-3 text-xs md:text-sm text-neutral-200 placeholder-neutral-600 outline-none focus:border-[#7c6cff]/30 hover:border-neutral-800 transition-all text-ellipsis"
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
                  <div className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-900/50 flex items-center justify-center text-[10px] font-black text-neutral-300 font-mono select-none">
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

      {/* PERSISTENT FLOATING BOTTOM CHAT BAR FOR MOBILE DEVICES */}
      <div className="fixed bottom-[74px] left-4 right-4 bg-[#0e0e11]/95 backdrop-blur-md border border-neutral-800/80 px-4.5 py-3.5 rounded-[24px] flex lg:hidden items-center gap-3 z-[250] shadow-[0_12px_45px_rgba(0,0,0,0.85)] select-none animate-in fade-in slide-in-from-bottom-3 duration-300">
        <button
          onClick={handleToggleFavorite}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer active:scale-95 shrink-0 ${
            isFavorite 
              ? "bg-amber-500/10 border-amber-500/20 text-amber-400" 
              : "bg-neutral-950 border-neutral-900 text-neutral-400 hover:text-white"
          }`}
          title="관심 등록"
        >
          <Star className={`w-5 h-5 ${isFavorite ? "fill-amber-400 text-amber-400" : ""}`} />
        </button>
        <button
          onClick={() => onStartChat(character.id)}
          className="flex-grow bg-gradient-to-r from-[#7c6cff] to-[#5f4fd6] text-white font-extrabold text-sm py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-lg shadow-[#7c6cff]/20 cursor-pointer"
        >
          <span>대화하기</span>
        </button>
      </div>

      {/* FLOAT MESSAGE TOAST ALERT MANAGER */}
      {toastMessage && (
        <div className="fixed bottom-40 md:bottom-8 left-1/2 -translate-x-1/2 z-[300] bg-neutral-900 border border-neutral-800 text-neutral-200 text-xs md:text-sm px-6 py-3 rounded-2xl shadow-2xl tracking-wide flex items-center gap-1.5 animate-in slide-in-from-bottom-3 duration-300 font-medium">
          <span>✔️</span>
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
