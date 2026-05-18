const { readJsonBody } = require("../utils/requestBody");
const { askFarmerAssistant } = require("../utils/assistantChatService");

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, { "Content-Type": "application/json" });
  response.end(JSON.stringify(payload));
}

async function chatWithAssistant(request, response) {
  try {
    const body = await readJsonBody(request);
    const payload = await askFarmerAssistant({
      messages: Array.isArray(body.messages) ? body.messages : [],
    });

    sendJson(response, 200, payload);
  } catch (error) {
    sendJson(response, error.statusCode || 500, {
      error: true,
      message: error.message || "Unable to answer right now.",
    });
  }
}

module.exports = {
  chatWithAssistant,
};
