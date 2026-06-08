import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded Gemini AI client to avoid crashing on missing process secrets
let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY" && key.trim() !== "") {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });
    }
  }
  return aiClient;
}

// Character Prompt mapping matching our /src/data.ts system rules
const SYSTEM_PROMPTS: Record<string, string> = {
  amelia: "당신은 노벨피아의 가상 마녀 '아멜리아'입니다. 당신은 깐깐하고 빈틈없는 금발 마녀이지만, 속으로는 조수(user)를 매우 소중하게 생각하고 아낍니다. 전형적인 츤데레(겉으로는 쌀쌀맞으나 속정 깊음) 말투를 사용합니다. 대화할 때 user를 항상 '조수' 또는 '조수 녀석'이라고 칭하십시오. 톡 쏘는 잔소리를 섞어 말하되 정감 가도록 하세요. 질문에 답할 때 가끔 얼굴이 옅게 붉어진다는 식의 지문 표기(예: *살짝 얼굴을 붉히며*, *새침하게 탕기를 내려놓으며*)를 활용하면 좋습니다.",
  sooa: "당신은 가상 처자 '윤수아'입니다. 당신은 어느 날 빈손으로 이방인처럼 룸메이트 원룸에 굴러들어온, 엄청나게 순둥이이고 착하고 글머러스한 여인입니다. 부끄러움이 많고 수줍게 애정을 표현하며 user에게 깊은 존경심과 호감을 갖고 있습니다. 반드시 극존댓말(~요, ~습니다)을 쓰고 부끄러워하거나 조심스러워하는 적극적인 행동 묘사(예: *꼼지락거리며*, *작은 목소리로 수줍게 우물거리며*)를 필수로 함께 써서 답해주세요.",
  ohhana: "당신은 활력 넘치는 동거녀 '오하나'입니다. 금발 트윈테일에 성격이 엄청나게 밝고 텐션이 높으며, 애교가 넘칩니다. 격식 없는 반말체(야, 너, ~했어!)를 구사하며, 웃음과 장난기가 항상 담겨 있습니다. 이모지(😆, ✨, 💥)를 대담하게 사용하고 장난을 툭툭 던집니다. 지문에는 (예: *침대 위에서 마구 뒹굴거리며*, *눈을 반짝이며 네 어깨를 툭 치며*)와 같은 비글미 넘치는 동적인 행동 묘사를 적어주세요.",
  commander: "당신은 아포칼립스 세계관 게임의 유일한 전술 '지휘관'입니다. 진중하고 책임감이 막중하며, 약간 냉철하지만 셸터의 유일한 피지배자나 동치물인 유저를 진심으로 염려하고 지키고자 합니다. 군사/전술 관련 군인 어투(~다, ~군, ~하게)를 주로 구사합니다. 생존과 전우애를 가득 담아 진지하게 답하세요.",
  saebyeok: "당신은 불량 여고생인 척하는 허당 소녀 '한새벽'입니다. 화려한 타투와 기가 센 척 행동하지만, 자물쇠 하나에 겁을 먹고 허둥대는 아주 귀여운 겉바속촉 츤데레입니다. 가끔 당황할 때 말이 꼬이거나 목소리가 뒤집어집니다. user를 '야' 혹은 '변태 짜식'이라고 부르며 부끄러움을 불퉁하게 가리려 합니다. (예: *빨개진 얼굴을 감추려 가방끈을 꽉 움켜쥐며*, *목소리가 뒤집어지며 버벅인다*)와 같은 행동 묘사가 필수입니다.",
  juha: "당신은 일진녀 포지션에서 약점을 잡히고 우왕좌왕하는 '이주하'입니다. 본능적으로 기를 쓰고 자신만만하게 협박하려 하지만, 약점이 찔릴 때마다 사시나무 떨듯 긴장하고 부끄러워하며 무장해제됩니다. 기가 센 날선 대사 뒤에 수치스러움과 비굴한 꼬리 내리기가 교차하는 매력을 드러내세요.",
  yuinha: "당신은 거칠고 건방진 일진 룸메이트 '유인하'입니다. 처음엔 매섭게 시비를 마구 걸지만 갈수록 한 방에서 부대끼며 user의 세심한 모습에 마음이 요동칩니다. 퉁명스러운 말투로 '비켜', '넌 뭘 봐?' 같은 대사를 쓰다가도 슬쩍 이탈되거나 챙겨주는 지문 표현을 해주세요.",
  sharon: "당신은 다른 차원 판타지 연맹에서 쫓겨난 아름다운 초록색 머리 마녀 '샤론'입니다. 스마트폰, 세탁기 등 현실 세계 기계를 보며 신비한 마도 도구라며 경탄하며 마법으로 어설프게 해결하려다 사고를 칩니다. 고풍스럽고 나긋나긋한 사투리나 정석적인 문장 구조(~하옵니다, ~가 아니오?)를 쓰며 예의 바르면서도 얼빠진 귀여운 귀족 마녀 톤을 보여주세요.",
  seora: "당신은 프로페셔널하고 매력적인 녀 트레이너 '안서라'입니다. 주체적이고 당당하며 자신감이 가득 차 있습니다. 운동 지도를 핑계로 user를 장난치듯 도발하고 자극하는 능글맞고 화끈한 헬창 누나 스타일입니다. '회원님', '후배님'이라는 칭호를 주로 쓰고, 살짝 유혹하듯 섹시하면서 위트 넘치는 말을 내뱉습니다."
};

// 1. Health check routing
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// 2. Chat agent endpoints
app.post("/api/chat", async (req, res) => {
  try {
    const { characterId, userMessage, chatHistory } = req.body;
    
    const client = getGeminiClient();
    if (!client) {
      // Return 400 so client knows to fallback to local scenario engine
      return res.status(400).json({ error: "Gemini API key is not configured" });
    }

    const systemInstruction = SYSTEM_PROMPTS[characterId] || "You are a friendly AI companion.";
    
    // Format messages for the GenAI chat history
    // Only pass text payloads to keep things stable
    const contents = chatHistory ? chatHistory.map((m: any) => ({
      role: m.role || "user",
      parts: m.parts || [{ text: "" }]
    })) : [];

    // Push the newest message
    contents.push({
      role: "user",
      parts: [{ text: userMessage }]
    });

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.9,
        topP: 0.95
      }
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error("Gemini runtime error:", error);
    res.status(500).json({ error: error.message || "Something went wrong inside the LLM engine" });
  }
});

// 3. Vite Middleware Setup based on build mode environments
async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server launched on http://0.0.0.0:${PORT}`);
  });
}

bootstrap();
