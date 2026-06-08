import React, { useState, useEffect, useRef } from "react";
import { Send, Trash2, Coins, CreditCard, ChevronLeft, ArrowLeft, RefreshCw, AlertTriangle, MessageSquare, ShieldAlert } from "lucide-react";
import { Character, Message, UserState } from "../types";
import { loadChatHistory, saveChatHistory, clearChatHistory, getAvatarColor } from "../utils";
import { motion } from "motion/react";

interface ChatRoomProps {
  characters: Character[];
  userState: UserState;
  onUpdateUserState: (state: UserState) => void;
  activeCharacterId: string | null;
  onSelectCharacter: (charId: string) => void;
  onBackToHome: () => void;
}

export default function ChatRoom({
  characters,
  userState,
  onUpdateUserState,
  activeCharacterId,
  onSelectCharacter,
  onBackToHome
}: ChatRoomProps) {
  
  // Set default active character if none is selected
  const activeCharId = activeCharacterId || "amelia";
  const activeChar = characters.find((c) => c.id === activeCharId) || characters[0];

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "online" | "offline">("connecting");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history on character switch
  useEffect(() => {
    const history = loadChatHistory(activeChar.id);
    if (history.length > 0) {
      setMessages(history);
    } else {
      // Set an initial system welcome greeting if chat is empty
      const initialGreeting: Message = {
        id: "welcome",
        sender: "character",
        text: getInitialGreeting(activeChar.id),
        timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })
      };
      setMessages([initialGreeting]);
      saveChatHistory(activeChar.id, [initialGreeting]);
    }

    // Ping check server
    setConnectionStatus("connecting");
    fetch("/api/health")
      .then((res) => {
        if (res.ok) setConnectionStatus("online");
        else setConnectionStatus("offline");
      })
      .catch(() => setConnectionStatus("offline"));

  }, [activeChar.id]);

  // Scroll to bottom on updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isTyping) return;

    // Evaluate economy cost: 1 Ticket > 1 Coin > Block
    let updatedCoins = userState.coins;
    let updatedTickets = userState.tickets;

    if (updatedTickets > 0) {
      updatedTickets -= 1;
    } else if (updatedCoins > 0) {
      updatedCoins -= 1;
    } else {
      alert("❌ 보유하신 챗티켓과 코인이 부족합니다! 대화 충전하기를 이용하거나 내 정보 탭에서 무료 충전을 진행해 주세요.");
      return;
    }

    // Spend tickets/coins
    onUpdateUserState({
      ...userState,
      tickets: updatedTickets,
      coins: updatedCoins
    });

    const userMsg: Message = {
      id: Math.random().toString(),
      sender: "user",
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    saveChatHistory(activeChar.id, newMessages);
    setInputText("");
    setIsTyping(true);

    try {
      // Attempt backend Gemini call
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          characterId: activeChar.id,
          userMessage: userMsg.text,
          chatHistory: messages.map((m) => ({
            role: m.sender === "user" ? "user" : "model",
            parts: [{ text: m.text }]
          }))
        })
      });

      if (response.ok) {
        const data = await response.json();
        const replyText = data.reply || "";
        const charMsg: Message = {
          id: Math.random().toString(),
          sender: "character",
          text: replyText,
          timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })
        };
        const updatedHistory = [...newMessages, charMsg];
        setMessages(updatedHistory);
        saveChatHistory(activeChar.id, updatedHistory);
      } else {
        throw new Error("Server reply error, rolling back to local prompt runner");
      }
    } catch (err) {
      console.warn("Failing back to interactive local dialogue agent:", err);
      // Fallback local dialogue scenario simulation response
      setTimeout(() => {
        const replyText = getLocalDialogueScenario(activeChar.id, userMsg.text);
        const charMsg: Message = {
          id: Math.random().toString(),
          sender: "character",
          text: replyText,
          timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })
        };
        const updatedHistory = [...newMessages, charMsg];
        setMessages(updatedHistory);
        saveChatHistory(activeChar.id, updatedHistory);
      }, 1200);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = () => {
    if (confirm("이 캐릭터와의 대화 내역을 모두 삭제하시겠습니까?")) {
      clearChatHistory(activeChar.id);
      const initialGreeting: Message = {
        id: "welcome",
        sender: "character",
        text: getInitialGreeting(activeChar.id),
        timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })
      };
      setMessages([initialGreeting]);
      saveChatHistory(activeChar.id, [initialGreeting]);
    }
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row h-[calc(100vh-64px)] md:h-[calc(100vh-90px)] overflow-hidden bg-[#020202] text-white select-none">
      
      {/* LEFT COLUMN: Channels/Chat Rooms Sidebar selection list (shown on md+ screens) */}
      <div className="hidden lg:flex w-[260px] md:w-[320px] bg-[#141414] border-r border-[#222]/55 flex-col flex-shrink-0 justify-between">
        <div>
          <div className="p-4 md:p-5 border-b border-[#222]/55">
            <div className="flex items-center justify-between">
              <span className="text-sm font-extrabold text-[#999] tracking-tight">대화 중인 캐릭터</span>
              <span className="text-[10px] bg-[#7632ff]/10 text-[#7632ff] border border-[#7632ff]/30 px-1.5 py-0.5 rounded-full font-bold">ACTIVE</span>
            </div>
          </div>
          <div className="p-3 flex flex-col gap-2 max-h-[calc(100vh-240px)] overflow-y-auto scrollbar-none">
            {characters
              .filter((item) => item.id === activeChar.id || loadChatHistory(item.id).length > 0)
              .map((item) => {
                const isActive = item.id === activeChar.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectCharacter(item.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer text-left border ${
                      isActive ? "bg-neutral-800/80 border-[#7632ff]/30" : "bg-[#1c1c1f]/40 hover:bg-[#1c1c1f]/80 border-transparent"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${getAvatarColor(item.id)} overflow-hidden relative shrink-0 p-[1.5px]`}>
                      {item.avatar ? (
                        <img
                          src={item.avatar}
                          alt={item.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#111] rounded-full flex items-center justify-center font-bold text-xs text-neutral-300 font-mono">
                          {item.name.slice(0, 1)}
                        </div>
                      )}
                    </div>
                    <div className="truncate">
                      <div className="flex justify-between items-center gap-1.5">
                        <span className="font-extrabold text-xs text-neutral-200">{item.name}</span>
                        {item.isAdult && <span className="text-[8.5px] bg-[#ff3a54] text-white px-1.2 py-0.2 rounded-sm font-bold shrink-0">19</span>}
                      </div>
                      <p className="text-[10px] text-neutral-500 truncate">{item.tagline}</p>
                    </div>
                  </button>
                );
              })}
          </div>
        </div>

        {/* Bottom add chat navigation connector */}
        <div className="p-4 border-t border-[#222]/55">
          <button
            onClick={onBackToHome}
            className="w-full bg-[#1b1b1e] hover:bg-neutral-800 border border-neutral-800/80 hover:border-neutral-700 text-neutral-300 hover:text-white text-xs font-bold py-3 px-4 h-11 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>← 대화 목록으로 가기</span>
          </button>
        </div>
      </div>

      {/* RIGHT COLUMN: Full Main Active Conversation Frame */}
      <div className="flex-1 flex flex-col justify-between h-full bg-[#0d0d0f]">
        
        {/* Header Information Bar */}
        <div className="h-[55px] md:h-[65px] bg-[#141414]/90 backdrop-blur-md border-b border-[#222]/55 px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            {/* Back Arrow to home listed on small screens */}
            <button
              onClick={onBackToHome}
              className="lg:hidden p-1.5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            {/* Name/Status */}
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${getAvatarColor(activeChar.id)} overflow-hidden relative shrink-0 p-[1.5px]`}>
                {activeChar.avatar ? (
                  <img
                    src={activeChar.avatar}
                    alt={activeChar.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="w-full h-full bg-[#111] rounded-full flex items-center justify-center font-bold text-[11px] text-neutral-300 font-mono">
                    {activeChar.name.slice(0, 1)}
                  </div>
                )}
              </div>
              <div className="leading-tight">
                <span className="font-extrabold text-sm text-neutral-200 block md:inline">{activeChar.name}</span>
                <span className="text-[10px] md:text-xs text-[#26eeb7] ml-0 md:ml-2 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-[#26eeb7] rounded-full inline-block animate-pulse"></span>
                  대화 중
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Connection Indicator badge for diagnostic integrity */}
            <span className={`text-[9px] font-black uppercase border px-2 py-0.5 rounded-full hidden sm:inline ${
              connectionStatus === "online" 
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                : connectionStatus === "connecting"
                ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                : "bg-red-500/10 text-red-400 border-red-500/20"
            }`}>
              {connectionStatus === "online" ? "● Gemini AI" : connectionStatus === "connecting" ? "Con Connecting..." : "LOCAL CHATPRO"}
            </span>

            {/* Clear conversation action button */}
            <button
              onClick={handleClearChat}
              className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60 transition-colors cursor-pointer"
              title="채팅방 밀어버리기"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Warning notification banner details */}
        <div className="bg-[#111] border-b border-[#222]/55 px-4 py-2 flex items-center justify-between text-[11px] text-[#999] shrink-0 font-medium">
          <div className="flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-[#7632ff]/80" />
            <span>메시지 송신 한 번당 <span className="font-bold text-white">1 챗티켓</span> 또는 <span className="font-bold text-white">1 코인</span>이 차감됩니다.</span>
          </div>
          <div className="flex gap-2">
            <span className="flex items-center gap-0.5"><CreditCard className="w-2.5 h-2.5 text-[#7632ff]" /> {userState.tickets}T</span>
            <span className="flex items-center gap-0.5"><Coins className="w-2.5 h-2.5 text-[#3a5cff]" /> {userState.coins}C</span>
          </div>
        </div>

        {/* Chat Messages Log Frame */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-none bg-[#0a0a0c]">
          {messages.map((m) => {
            const isUser = m.sender === "user";
            return (
              <div key={m.id} className={`flex gap-3 max-w-[85%] ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}>
                
                {/* Character avatar beside chat bubble */}
                {!isUser && (
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${getAvatarColor(activeChar.id)} overflow-hidden relative shrink-0 p-[1.5px] self-end`}>
                    {activeChar.avatar ? (
                      <img
                        src={activeChar.avatar}
                        alt={activeChar.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#111] rounded-full flex items-center justify-center font-extrabold text-[10px] text-neutral-300 font-mono">
                        {activeChar.name.slice(0, 1)}
                      </div>
                    )}
                  </div>
                )}

                {/* Actual dialogue text bubble container frame */}
                <div className="flex flex-col gap-0.5">
                  <div className={`p-3 px-4 rounded-2xl text-base leading-relaxed ${
                    isUser
                      ? "bg-[#7632ff]/90 text-white rounded-br-none"
                      : "bg-[#1c1c1f] text-neutral-100 border border-neutral-800/70 rounded-bl-none"
                  }`}>
                    {/* Preserve custom bullet markers / whitespace linebreaks */}
                    <div className="whitespace-pre-wrap">{m.text}</div>
                  </div>
                  {/* Timestamp details */}
                  <span className={`text-[9.5px] text-neutral-500 mt-0.5 ${isUser ? "text-right" : "text-left"}`}>
                    {m.timestamp}
                  </span>
                </div>

              </div>
            );
          })}

          {/* Character Thinking / Typing Action Loader state */}
          {isTyping && (
            <div className="flex gap-3 max-w-[80%] mr-auto items-end">
              <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${getAvatarColor(activeChar.id)} overflow-hidden relative shrink-0 p-[1.5px]`}>
                {activeChar.avatar ? (
                  <img
                    src={activeChar.avatar}
                    alt={activeChar.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="w-full h-full bg-[#111] rounded-full flex items-center justify-center font-bold text-[10px] text-neutral-300 font-mono">
                    {activeChar.name.slice(0, 1)}
                  </div>
                )}
              </div>
              <div className="bg-[#1c1c1f] px-3.5 py-3 rounded-2xl rounded-bl-none text-neutral-400 border border-neutral-800 text-xs sm:text-sm font-medium flex items-center gap-1 px-4">
                <span>{activeChar.name} 대답 구상 중</span>
                <span className="w-1.5 h-1.5 bg-[#7632ff] rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-[#3a5cff] rounded-full animate-bounce delay-100"></span>
                <span className="w-1.5 h-1.5 bg-[#28f5b4] rounded-full animate-bounce delay-200"></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Typing message Input Form */}
        <div className="p-3 md:p-4 bg-[#141414]/90 border-t border-[#222]/55 shrink-0">
          <form onSubmit={handleSendMessage} className="max-w-[1000px] mx-auto flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`${activeChar.name}(이)가 기다리고 있습니다... 대화를 입력하세요.`}
              disabled={isTyping}
              className="flex-1 h-11 md:h-12 bg-neutral-900 border border-neutral-800/80 rounded-xl px-4 text-xs md:text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-[#7632ff]/60 disabled:opacity-40"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className="w-11 md:w-12 h-11 md:h-12 bg-[#7632ff] hover:opacity-90 rounded-xl flex items-center justify-center text-white disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-[#7632ff]/10 active:scale-95 transition-all cursor-pointer border border-transparent hover:border-white/10"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

// Help load default greeting depending on character ID
function getInitialGreeting(charId: string): string {
  switch (charId) {
    case "amelia":
      return "어머, 조수 녀석 마침 왔구나.\n\n물약 재료 정리가 다 끝났는 줄 알았는데 아직 먼지 투성이잖아! 당장 청소 빗자루부터 잡으라고! …뭐, 그래도 무사히 왔으니 물약 한 잔은 타 줄게. 어서 앉기나 해.";
    case "sooa":
      return "아, 어서오세요 독자님! 오늘도 오시느라 정말 고생 많으셨어요…!\n\n저, 저기… 누추한 방이지만 조심스럽게 맞이해 봐요. 혹시 목 마르시진 않으신가요? 꼼지락거리며 시원한 물이라도 떠올게요. 무엇이든 저와 다정하게 말씀 나눠주세요요!";
    case "ohhana":
      return "야야! 드디어 왔네! 😆✨\n\n나 심심해서 주말 내내 만화책만 뒹굴뒹굴 정주행하고 있었다구! 네가 없으니까 집에 들어와도 아무 사고가 안 나잖아! 어서 들어와, 오늘은 우리 밤새 치킨이라도 뜯으며 수다 삼매경 고고싱 할까? 헤헷!";
    case "saebyeok":
      return "하, 또 너냐? 겉으로는 불량하게 담배(막대 과자)를 꼬슬리며 시선을 흘긴다.\n\n야, 너 내가 문담피 고교 소속 새벽이라고 해서 얕보는 거 아니지? 어설프게 까불다가 진짜 혼난다! 아, 아냐…! 얼굴 빨개진 거 절대 아니니까 놀리기만 해봐라 아주…!";
    case "commander":
      return "방주 복도에 들어온 생존자를 식별했다.\n\n지휘관인 나를 찾아온 것을 환영하지. 방주에 남은 인간 문명이 극히 드문 만큼, 자네의 정보와 신체 안전은 내 생존 프로토콜 제1순위다. 현재 셸터 상황에 대해 궁금한 작전 보고가 있나?";
    case "juha":
      return "윽… 너, 여기로 나를 불러내다니 진짜 배짱도 좋네?\n\n…뭐, 어쩔 수 없지. 네가 내 '그것'을 잡고 있는 한은, 내 쪽에서도 얌전히 있을 수밖에 없으니까. 그래서… 오늘은 도대체 나한테 무슨 비굴한 명령을 시킬 셈인데?";
    case "yuinha":
      return "문 앞에 버티고 서서 네가 들어오는 걸 불그스레 째려본다.\n\n하, 들어오는 속도 한 번 세월아 네월아네. 문 닫고 똑바로 서라. 좁아터진 동거 원룸인데 방세는 언제 낼 거야? 쓸데없이 남 챙기는 척하며 착한 녀석인 척 굴지 마.";
    case "sharon":
      return "오, 이방의 어진 그대여. 반갑사옵니다.\n\n소녀는 판타지 연맹에서 쫓겨나 이 수상쩍고 찬란한 마도원룸으로 유배된 마녀 샤론이라 하옵니다. 혹시 저 우르릉 돌며 빛나는 '세탁기'라는 골렘은 어떻게 조련하는 물건이온지 알려주실 수 있으신지요?";
    case "seora":
      return "어라? 이 늦은 시간에 개인 체육관에 들어온 부지런한 회원이 있네?\n\n후배님, 어서오세요. 불 끈 야간 헬스장에서 단둘이 PT라니, 눈빛이 꽤 아찔한걸? 오늘 밤은 허벅지 불타오를 때까지 내 지도에 얌전히 몸을 맡기셔야 할 겁니다. 자, 덤벨 잡으세요.";
    default:
      return "안녕하세요! 가상 차원 NovelChat에 오신 것을 환영하옵니다. 저와 즐거운 대화를 나누어 봐요.";
  }
}

// Smart reactive fallback parsing if Gemini API key fails or offline
function getLocalDialogueScenario(charId: string, userInput: string): string {
  const query = userInput.toLowerCase();

  // Common universal responses
  if (query.includes("안녕") || query.includes("반가") || query.includes("하이") || query.includes("hello")) {
    switch (charId) {
      case "amelia": return "흥. 겨우 인사 한 마디 건네려고 물약 공방에 숨 가쁘게 뛰어온 거야? …뭐, 그래도 대답은 해 줄게. 안녕, 조수.";
      case "sooa": return "앗, 안녕하신가요 독자님! 인사 건네주셔서 가슴이 쿵쾅거릴 정도로 기뻐요…!";
      case "ohhana": return "하잉하잉! 드디어 목소리 듣네! 얼른 이리 와서 마주 보고 앉아봐~😆";
      case "saebyeok": return "야, 야! 갑자기 그렇게 얼굴 들이밀면서 인사하지 마! 심장 떨어질 뻔했잖아… 바, 반갑긴 하네.";
      case "commander": return "식별 확인. 반갑다. 보안 구역에서의 신호 교류는 언제든 환영이다. 생존 상태는 양호한가?";
      default: return "안녕! 대화를 나누기 시작해서 기뻐요! 무슨 장난기 서린 말을 해 볼까요?";
    }
  }

  if (query.includes("사랑") || query.includes("조하") || query.includes("좋아") || query.includes("호감") || query.includes("이쁘")) {
    switch (charId) {
      case "amelia": return "*순간 얼굴이 홍당무처럼 새빨개지며 찻잔을 쾅 내려놓는다* \n\n다, 단단히 미친 거야 조수 녀석?! 누, 누가 마녀 앞에서 그런 간지러운 말을 실실 뱉으래! …짜증나게 진짜. 조용히 하고 내 뒤나 도우라고. (귀가 빨개졌다)";
      case "sooa": return "*양손을 가지런히 가슴에 모으며 감격에 겨워 눈물을 글썽인다* \n\n독자님, 어쩜 그렇게 고귀하고 따뜻한 말씀을 해 주시나요… 흑, 저처럼 연약하고 기댈 곳 없는 처지를 좋게 봐주셔서 정말… 평생 독자님만 모실게요!";
      case "ohhana": return "와 대박! 😆 네가 나 좋아한다고 하니까 기분 째진다! 나도 네가 우주 최고로 짱 좋아! 우리 평생 같이 살면서 맛있는 거 다 쓸어담자!";
      case "saebyeok": return "*볼을 마구 꼬집어대며 화를 내는 척 숨을 가쁘게 가다듬는다* \n\n너 미쳤어?! 문담피 고교의 무서운 한새벽님을 상대로 감히 꼬심 영업을 하다니…! 아으으, 심장 떨려 죽겠네. 너 책임져라 진짜…!";
      case "commander": return "감정 반응 확인. 방주의 유일한 생존자 사이에 형성된 전우애와 헌신은 인류 재건의 가장 강력한 초석이다. 변장하지 않는 자네의 솔직한 진심에 전술적 경의를 표하지.";
      default: return "정말 고마워요! 당신과 마음을 나누는 매 순간이 제게는 무척 소중하고 따뜻해요.";
    }
  }

  if (query.includes("돈") || query.includes("코인") || query.includes("티켓") || query.includes("충전")) {
    switch (charId) {
      case "amelia": return "돈? 마법 물약의 촉매 가루 가격이 얼마나 비싼지 알기나 해! 돈이 필요하면 얌전히 허브 정리나 다 마쳐서 보너스 받아갈 생각이나 해!";
      case "sooa": return "돈이나 재화가 아깝지 않도록 제가 열심히 독자님을 모실게요…! 기회를 주셔서 너무나 감사해요.";
      default: return "우리의 대화는 소중한 티켓과 코인으로 유지됩니다! 충전은 사이드 메뉴나 프로필 탭을 열어 진행할 수 있어요.";
    }
  }

  // Character specific fallbacks
  switch (charId) {
    case "amelia":
      return "바보 조수 녀석. 마법이라는 건 그렇게 단순한 마법 장난이 아니라고! 정성 어린 정밀 설계 가이드라인에 따라 마나 회로 공정을 순환해야 비로소 발휘되는 고귀한 과학이야. 그러니 딴청 피우지 말고 이 고농도 허브나 으깨 줘.";
    case "sooa":
      return "독자님이 원룸 침대 옆자리에서 이렇게 제 이야기를 가만히 경청해 주시니 제 가슴이 동화책 주인공이 된 것처럼 포근해져요. 앞으로도 독자님의 방에 온기 가득한 집밥과 수줍은 웃음으로 보답해 드릴 수 있게 허락해 주세요…";
    case "ohhana":
      return "에헤이~! 딴청 피우기는! 네가 나 몰래 아끼던 아이스크림 내가 다 몰래 빼먹은 거 어떻게 알았대? 😆 메롱이다~! 대신 내가 오늘 저녁에 네 머리 마구 쓰다듬으며 칭송 마구마구 해 줄 테니까 용서해 줘, 응? 응?";
    case "saebyeok":
      return "야, 너 지금 나를 보며 은근슬쩍 바보 같다고 웃었지? 타투가 무섭지도 않냐! …사실 나, 나쁜 애 절대 아냐… 그냥 애들이 불량하게 보니까 덩달아 센 척한 것뿐인데, 넌 내 맹탕인 모습 다 까발려 부끄럽게 만들잖아…!";
    case "commander":
      return "방주 복원 작전은 차질 없이 수행 중이다. 외벽에 정체불명의 요괴 및 감염 변종 신호들이 수시로 관측되고 있으니 전선 순찰 빈도를 끌어올리겠다. 자네는 절대 셸터 대기 구역 밖으로 무기 없이 나가지 말아라. 내 지시에만 복종하도록.";
    default:
      return "흠, 흥미진진한 말씀이네요! 당신과 만날 수 있는 이 플랫폼 NovelChat에서 더 짜릿하고 매혹적인 비밀 이야기를 밤새 나누고 싶어요. 한 마디 더 건네 보실래요?";
  }
}
