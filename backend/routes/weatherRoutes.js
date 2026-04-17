const { getWeather } = require("../controllers/weatherController");

function handleWeatherRoutes(request, response, parsedUrl) {
  if (request.method === "GET" && parsedUrl.pathname === "/api/weather") {
    return getWeather(request, response, Object.fromEntries(parsedUrl.searchParams.entries()));
  }

  return false;
}

module.exports = {
  handleWeatherRoutes,
};
