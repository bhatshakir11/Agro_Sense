const https = require("https");
const diseaseCatalog = require("../data/diseaseCatalog.json");

const OPENROUTER_CHAT_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_MODELS = [
  "google/gemini-2.0-flash-lite-preview-02-05:free",
  "meta-llama/llama-3.3-70b-instruct:free",
  "qwen/qwen-2.5-72b-instruct:free",
  "deepseek/deepseek-r1:free",
];

function getOpenRouterKey() {
  return process.env.OPENROUTER_API_KEY || "";
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

function postOpenRouter(payload, apiKey, timeoutMs = 8000) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(payload);
    const target = new URL(OPENROUTER_CHAT_URL);

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
          "HTTP-Referer": process.env.OPENROUTER_SITE_URL || "http://localhost:3000",
          "X-Title": process.env.OPENROUTER_APP_NAME || "AgroAssist Pro",
        },
      },
      (response) => {
        let responseBody = "";

        response.on("data", (chunk) => {
          responseBody += chunk;
        });

        response.on("end", () => {
          if (response.statusCode < 200 || response.statusCode >= 300) {
            reject(new Error(`OpenRouter returned status ${response.statusCode}`));
            return;
          }

          try {
            const parsed = JSON.parse(responseBody);
            const text = parsed.choices?.[0]?.message?.content;
            if (typeof text === "string" && text.trim()) {
              resolve(text.trim());
            } else {
              reject(new Error("No content returned in OpenRouter choice"));
            }
          } catch (err) {
            reject(new Error("Invalid JSON from OpenRouter"));
          }
        });
      }
    );

    request.on("error", (error) => reject(error));
    request.setTimeout(timeoutMs, () => {
      request.destroy(new Error(`Request timed out after ${timeoutMs}ms`));
    });

    request.write(body);
    request.end();
  });
}

function generateLocalAgronomyAnswer(userQuery) {
  const query = userQuery.toLowerCase();

  let cropKey = "";
  for (const key of Object.keys(diseaseCatalog)) {
    if (query.includes(key)) {
      cropKey = key;
      break;
    }
  }

  if (!cropKey) {
    if (query.includes("paddy") || query.includes("rice")) cropKey = "rice";
    else if (query.includes("corn") || query.includes("maize")) cropKey = "maize";
    else if (query.includes("peanut")) cropKey = "groundnut";
    else if (query.includes("soya")) cropKey = "soybean";
  }

  const cropData = cropKey ? diseaseCatalog[cropKey] : null;

  if (cropData) {
    let matchedDisease = null;
    for (const d of cropData.diseases) {
      const dName = d.name.toLowerCase();
      const symptomMatch = d.symptoms.some((s) => query.includes(s.toLowerCase()));
      if (query.includes(dName) || symptomMatch) {
        matchedDisease = d;
        break;
      }
    }

    if (!matchedDisease) {
      matchedDisease = cropData.diseases[0];
    }

    const meds = matchedDisease.medications
      .map((m) => `• **${m.name}** (${m.type}): ${m.purpose}`)
      .join("\n");
    const actions = matchedDisease.immediateActions.map((a) => `• ${a}`).join("\n");
    const organic = matchedDisease.organicSupport.map((o) => `• ${o}`).join("\n");

    return [
      `🌾 **AgroAssist Guidance for ${cropData.label} (${matchedDisease.name}):**`,
      "",
      `**Recommended Medicine & Fungicides:**`,
      meds,
      "",
      `**Immediate Field Actions:**`,
      actions,
      "",
      `**Organic & Preventive Support:**`,
      organic,
      "",
      `*Tip: If symptoms persist, upload a clear leaf photo in Disease Detection for exact AI diagnostic scoring.*`,
    ].join("\n");
  }

  if (query.includes("pest") || query.includes("insect") || query.includes("bug") || query.includes("worm") || query.includes("aphid")) {
    return [
      `🐛 **Pest Control Advisory:**`,
      "",
      `• **Neem Oil Spray (10,000 ppm):** Spray 5ml per liter of water during early evening to control sucking pests (aphids, thrips, whiteflies).`,
      `• **Chemical Control:** For severe infestations, use **Imidacloprid 17.8% SL** (0.5ml/L) for sucking pests or **Emamectin Benzoate 5% SG** (0.4g/L) for caterpillars and stem borers.`,
      `• **Traps:** Install yellow sticky cards (10-15 per acre) to monitor and catch adult insects.`,
      `• **Cultural Control:** Maintain proper plant spacing and eliminate surrounding host weeds.`,
    ].join("\n");
  }

  if (query.includes("fertilization") || query.includes("fertilizer") || query.includes("npk") || query.includes("urea") || query.includes("dap") || query.includes("nutrition") || query.includes("yellow leaf")) {
    return [
      `🌱 **Crop Nutrition & Fertilizer Guidance:**`,
      "",
      `• **Basal Dose:** Apply **DAP (Di-ammonium Phosphate)** or **NPK 12:32:16** at sowing/transplanting to promote strong root establishment.`,
      `• **Nitrogen Top Dressing:** Split **Neem-Coated Urea** into 2-3 doses (at tillering/branching and flowering stages) to prevent nitrogen leaching.`,
      `• **Micronutrients:** If leaves turn overall pale yellow, spray **Zinc Sulfate 0.5%** with 1% Urea solution.`,
      `• **Organic Booster:** Mix **Vermicompost** (2-3 tons/acre) or Bio-fertilizers (Azotobacter / PSB) during soil preparation.`,
    ].join("\n");
  }

  if (query.includes("rain") || query.includes("water") || query.includes("fungus") || query.includes("humid")) {
    return [
      `🌧️ **Post-Rain & Moisture Advisory:**`,
      "",
      `• **Drainage:** Drain excess standing water immediately from crop rows to prevent root rot and wilt.`,
      `• **Foliar Protection:** Spray **Copper Oxychloride 50% WP** (2.5g/L) or **Mancozeb 75% WP** (2g/L) after rain stops to prevent fungal spore germination.`,
      `• **Nutrient Care:** Avoid applying heavy nitrogen urea while soil is waterlogged; wait until fields reach field capacity.`,
    ].join("\n");
  }

  return [
    `🌾 **AgroAssist General Field Guidance:**`,
    "",
    `1. **Foliar Inspection:** Check the undersides of lower leaves for early spots, white mold, or pest eggs.`,
    `2. **Humidity & Airflow:** Ensure adequate spacing and remove lower diseased leaves to lower canopy humidity.`,
    `3. **Preventive Organic Care:** Spray **Neem Oil 10,000 ppm** (5ml/L) as a safe organic protective barrier against pests and mild fungal growth.`,
    `4. **Specific Guidance:** Mention your specific crop name (e.g., Tomato, Wheat, Rice, Potato, Cotton, Maize) and symptoms for targeted medicine recommendations!`,
  ].join("\n");
}

async function askFarmerAssistant({ messages }) {
  const conversation = normalizeMessages(messages);

  if (!conversation.length || conversation[conversation.length - 1].role !== "user") {
    const error = new Error("Please send a farmer question for the assistant.");
    error.statusCode = 400;
    throw error;
  }

  const userQuery = conversation[conversation.length - 1].content;
  const apiKey = getOpenRouterKey();

  if (apiKey) {
    const systemPrompt =
      "You are AgroAssist for Indian farmers. Answer crop, pest, disease, fertilizer, and medicine questions in 3 to 5 short practical bullet points. Prefer generic active ingredients. Mention precise dosage and field safety.";

    for (const model of OPENROUTER_MODELS) {
      try {
        const answer = await postOpenRouter(
          {
            model,
            messages: [
              { role: "system", content: systemPrompt },
              ...conversation,
            ],
            temperature: 0.3,
            max_tokens: 300,
          },
          apiKey,
          6000
        );

        if (answer) {
          return {
            answer,
            model,
          };
        }
      } catch (err) {
        // Try next model or fallback
      }
    }
  }

  const fallbackAnswer = generateLocalAgronomyAnswer(userQuery);
  return {
    answer: fallbackAnswer,
    model: "AgroAssist-AgronomyEngine-v1",
  };
}

module.exports = {
  askFarmerAssistant,
};
