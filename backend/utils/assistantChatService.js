const https = require("https");

const NVIDIA_CHAT_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
const FALLBACK_ASSISTANT_MODEL = "meta/llama-3.2-3b-instruct";

function getAssistantApiKey() {
  return process.env.NVIDIA_API_KEY || process.env.ASSISTANT_NVIDIA_API_KEY;
}

function getAssistantModel() {
  return process.env.NVIDIA_MODEL || process.env.ASSISTANT_NVIDIA_MODEL || FALLBACK_ASSISTANT_MODEL;
}

function normalizeMessages(messages = []) {
  return messages
    .filter((message) => {
      return (
        ["user", "assistant"].includes(message.role) &&
        typeof message.content === "string" &&
        message.content.trim()
      );
    })
    .slice(-10)
    .map((message) => ({
      role: message.role,
      content: message.content.trim().slice(0, 1400),
    }));
}

function extractAssistantText(payload) {
  const content = payload.choices?.[0]?.message?.content;

  if (typeof content === "string") {
    return content.trim();
  }

  if (Array.isArray(content)) {
    return content
      .filter((item) => item.type === "text" && item.text)
      .map((item) => item.text)
      .join("\n")
      .trim();
  }

  return "";
}

function extractStreamText(eventData) {
  if (!eventData || eventData === "[DONE]") {
    return "";
  }

  try {
    const parsed = JSON.parse(eventData);
    const choice = parsed.choices?.[0];
    return choice?.delta?.content || choice?.message?.content || "";
  } catch (error) {
    return "";
  }
}

function postNvidiaStream(url, payload, apiKey, timeoutMs = 90000) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ ...payload, stream: true });
    const target = new URL(url);
    let answer = "";
    let buffer = "";

    const request = https.request(
      {
        protocol: target.protocol,
        hostname: target.hostname,
        port: target.port || 443,
        path: `${target.pathname}${target.search}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body),
          Authorization: `Bearer ${apiKey}`,
          Accept: "text/event-stream",
        },
      },
      (response) => {
        response.setEncoding("utf8");

        response.on("data", (chunk) => {
          buffer += chunk;
          const lines = buffer.split(/\r?\n/);
          buffer = lines.pop() || "";

          lines.forEach((line) => {
            if (!line.startsWith("data:")) {
              return;
            }

            answer += extractStreamText(line.slice(5).trim());
          });
        });

        response.on("end", () => {
          if (response.statusCode < 200 || response.statusCode >= 300) {
            reject(new Error(answer || `Request failed with status ${response.statusCode}`));
            return;
          }

          resolve(answer.trim());
        });
      }
    );

    request.on("error", (error) => {
      reject(error);
    });

    request.setTimeout(timeoutMs, () => {
      request.destroy(new Error(`Request timed out after ${timeoutMs}ms`));
    });

    request.write(body);
    request.end();
  });
}

async function askFarmerAssistant({ messages }) {
  const assistantApiKey = getAssistantApiKey();
  const assistantModel = getAssistantModel();

  if (!assistantApiKey) {
    const error = new Error(
      "NVIDIA_API_KEY is not configured. Add it in backend/.env to enable the assistant."
    );
    error.statusCode = 503;
    throw error;
  }

  const conversation = normalizeMessages(messages);

  if (!conversation.length || conversation[conversation.length - 1].role !== "user") {
    const error = new Error("Please send a farmer question for the assistant.");
    error.statusCode = 400;
    throw error;
  }

  const payload = {
    model: assistantModel,
    messages: [
      {
        role: "system",
        content:
          "You are AgroAssist for Indian farmers. Answer crop, pest, disease, fertilizer, and medicine questions in 3 to 5 short practical bullet points. Prefer generic active ingredients. If unsure, ask for crop name, symptoms, and a clear photo.",
      },
      ...conversation,
    ],
    temperature: 0.3,
    max_tokens: 220,
    top_p: 0.8,
  };

  const answer = await postNvidiaStream(NVIDIA_CHAT_URL, payload, assistantApiKey);

  if (!answer) {
    throw new Error("The assistant model did not return a usable answer.");
  }

  return {
    answer,
    model: assistantModel,
  };
}

module.exports = {
  askFarmerAssistant,
};
