const { fetchWeatherIntelligence } = require("../utils/weatherIntelligence");

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, { "Content-Type": "application/json" });
  response.end(JSON.stringify(payload));
}

async function getWeather(request, response, query) {
  try {
    const payload = await fetchWeatherIntelligence(query);
    sendJson(response, 200, payload);
  } catch (error) {
    sendJson(response, error.statusCode || 500, {
      error: true,
      message:
        error.statusCode === 404
          ? "Location not found."
          : error.message || "Unable to fetch weather data right now.",
      details: error.statusCode ? undefined : error.message,
    });
  }
}

module.exports = {
  getWeather,
};
