const { chatWithAssistant } = require("../controllers/assistantController");

function handleAssistantRoutes(request, response, parsedUrl) {
  if (request.method === "POST" && parsedUrl.pathname === "/api/assistant-chat") {
    chatWithAssistant(request, response);
    return true;
  }

  return false;
}

module.exports = {
  handleAssistantRoutes,
};
