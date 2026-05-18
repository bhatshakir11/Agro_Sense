const http = require("http");
const { URL } = require("url");
const { loadEnv } = require("./utils/loadEnv");
const { handleWeatherRoutes } = require("./routes/weatherRoutes");
const { handleCropRoutes } = require("./routes/cropRoutes");
const { handleMarketRoutes } = require("./routes/marketRoutes");
const { handleDiseaseRoutes } = require("./routes/diseaseRoutes");
const { handleDashboardRoutes } = require("./routes/dashboardRoutes");
const { handleAssistantRoutes } = require("./routes/assistantRoutes");

loadEnv();

const PORT = process.env.PORT || 5000;

function setCorsHeaders(response) {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

const server = http.createServer((request, response) => {
  setCorsHeaders(response);

  if (request.method === "OPTIONS") {
    response.writeHead(204);
    response.end();
    return;
  }

  const parsedUrl = new URL(request.url, `http://${request.headers.host}`);

  if (handleWeatherRoutes(request, response, parsedUrl)) {
    return;
  }

  if (handleCropRoutes(request, response, parsedUrl)) {
    return;
  }

  if (handleMarketRoutes(request, response, parsedUrl)) {
    return;
  }

  if (handleDiseaseRoutes(request, response, parsedUrl)) {
    return;
  }

  if (handleDashboardRoutes(request, response, parsedUrl)) {
    return;
  }

  if (handleAssistantRoutes(request, response, parsedUrl)) {
    return;
  }

  if (request.method === "GET" && parsedUrl.pathname === "/api/health") {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ ok: true }));
    return;
  }

  response.writeHead(404, { "Content-Type": "application/json" });
  response.end(JSON.stringify({ error: true, message: "Route not found." }));
});

server.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
