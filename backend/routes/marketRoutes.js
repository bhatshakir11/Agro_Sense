const { getMarketOverview } = require("../controllers/marketController");

function handleMarketRoutes(request, response, parsedUrl) {
  if (request.method === "GET" && parsedUrl.pathname === "/api/market-prices") {
    getMarketOverview(request, response, Object.fromEntries(parsedUrl.searchParams.entries()));
    return true;
  }

  return false;
}

module.exports = {
  handleMarketRoutes,
};
