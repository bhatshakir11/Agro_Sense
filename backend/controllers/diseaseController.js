const { readJsonBody } = require("../utils/requestBody");
const { analyzeLeafDisease } = require("../utils/diseaseDetectionService");

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, { "Content-Type": "application/json" });
  response.end(JSON.stringify(payload));
}

async function analyzeDisease(request, response) {
  try {
    const body = await readJsonBody(request);

    if (!body.imageData || !String(body.imageData).startsWith("data:image/")) {
      sendJson(response, 400, {
        error: true,
        message: "A leaf image is required for disease detection.",
      });
      return;
    }

    const result = await analyzeLeafDisease({
      imageData: body.imageData,
      cropHint: body.cropHint || "",
    });

    sendJson(response, 200, result);
  } catch (error) {
    sendJson(response, error.statusCode || 500, {
      error: true,
      message: error.message || "Unable to analyze the leaf image right now.",
    });
  }
}

module.exports = {
  analyzeDisease,
};
