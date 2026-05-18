const { postJson } = require("./httpClient");
const {
  getCropCatalog,
  buildCatalogPrompt,
  applyCatalogTreatment,
} = require("./diseaseCatalog");

const OPENROUTER_CHAT_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL =
  process.env.OPENROUTER_MODEL || "nvidia/nemotron-nano-12b-v2-vl:free";

function normalizeConfidence(value) {
  const numeric = Number(value);

  if (!Number.isFinite(numeric)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(numeric)));
}

function extractMessageText(payload) {
  const rawContent = payload.choices?.[0]?.message?.content;

  if (typeof rawContent === "string") {
    return rawContent;
  }

  if (Array.isArray(rawContent)) {
    return rawContent
      .filter((item) => item.type === "text" && item.text)
      .map((item) => item.text)
      .join("\n");
  }

  return "";
}

function extractJsonBlock(content) {
  if (!content) {
    return "";
  }

  const fencedMatch = content.match(/```json\s*([\s\S]*?)```/i);

  if (fencedMatch) {
    return fencedMatch[1].trim();
  }

  const startIndex = content.indexOf("{");
  const endIndex = content.lastIndexOf("}");

  if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
    return "";
  }

  return content.slice(startIndex, endIndex + 1).trim();
}

function parseResponsePayload(payload) {
  const outputText = extractMessageText(payload);
  const jsonText = extractJsonBlock(outputText);

  if (!jsonText) {
    throw new Error("No structured analysis was returned by the disease model.");
  }

  const parsed = JSON.parse(jsonText);
  const confidence = normalizeConfidence(parsed.confidence);

  return {
    crop: parsed.crop || "Unknown crop",
    likelyDisease: parsed.likelyDisease || "Needs expert review",
    confidence,
    severity: parsed.severity || "medium",
    diagnosisSummary:
      parsed.diagnosisSummary ||
      "The image was analyzed, but the diagnosis should be reviewed before treatment.",
    visibleSymptoms: Array.isArray(parsed.visibleSymptoms) ? parsed.visibleSymptoms : [],
    immediateActions: Array.isArray(parsed.immediateActions) ? parsed.immediateActions : [],
    medications: Array.isArray(parsed.medications) ? parsed.medications : [],
    organicSupport: Array.isArray(parsed.organicSupport) ? parsed.organicSupport : [],
    reviewRecommended:
      typeof parsed.reviewRecommended === "boolean" ? parsed.reviewRecommended : confidence < 90,
    notes:
      parsed.notes ||
      "Use this as decision support only. Follow label directions and confirm unusual cases with a plant expert.",
  };
}

async function analyzeLeafDisease({ imageData, cropHint = "" }) {
  if (!process.env.OPENROUTER_API_KEY) {
    const error = new Error(
      "OPENROUTER_API_KEY is not configured on the backend, so disease image analysis is not available yet."
    );
    error.statusCode = 503;
    throw error;
  }

  const cropCatalog = getCropCatalog(cropHint);
  const prompt = `
You are an agricultural plant pathology assistant.
Analyze the uploaded leaf image carefully.
Your job is to identify the most likely visible disease, estimate confidence conservatively, and recommend practical treatment guidance.

Rules:
- Do not invent certainty. Only return confidence above 90 if the visual signs are very strong.
- If the image is blurry, partial, or inconclusive, say so and recommend expert review.
- Prefer generic active ingredients over brand names.
- Include 2 to 4 medication or treatment options when appropriate.
- Focus on likely fungal, bacterial, viral, or nutrient-stress leaf issues visible in the image.
- Crop hint from user: ${cropHint || "not provided"}.
- Base your answer on the visible symptoms in this image, not on common defaults.
- If the image is inconclusive, return "Needs expert review" instead of forcing a disease name.
- Keep medications empty if disease confidence is weak.
- Mention only symptoms that are visually evident in the image.
- ${buildCatalogPrompt(cropCatalog) || "If crop is unclear, identify the crop cautiously before naming a disease."}
- Return valid JSON only with this exact shape:
{
  "crop": "string",
  "likelyDisease": "string",
  "confidence": 0,
  "severity": "low|medium|high",
  "diagnosisSummary": "string",
  "visibleSymptoms": ["string"],
  "immediateActions": ["string"],
  "medications": [
    {
      "name": "string",
      "type": "string",
      "usage": "string",
      "purpose": "string"
    }
  ],
  "organicSupport": ["string"],
  "reviewRecommended": true,
  "notes": "string"
}
  `.trim();

  const payload = {
    model: DEFAULT_MODEL,
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          {
            type: "image_url",
            image_url: {
              url: imageData,
            },
          },
        ],
      },
    ],
    temperature: 0.2,
  };

  const response = await postJson(OPENROUTER_CHAT_URL, payload, {
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "HTTP-Referer": process.env.OPENROUTER_SITE_URL || "http://localhost:3000",
      "X-Title": process.env.OPENROUTER_APP_NAME || "AgroAssist Pro",
    },
  });

  return applyCatalogTreatment(parseResponsePayload(response), cropHint);
}

module.exports = {
  analyzeLeafDisease,
};
