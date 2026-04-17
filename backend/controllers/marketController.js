const { getMarketSeries } = require("../utils/marketDataProvider");
const { summarizeMarketSeries } = require("../utils/marketPredictionEngine");

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, { "Content-Type": "application/json" });
  response.end(JSON.stringify(payload));
}

async function getMarketOverview(request, response, query) {
  try {
    const market = await getMarketSeries(query);
    const summary = summarizeMarketSeries(market.series);
    const latest = summary.latest;

    sendJson(response, 200, {
      commodity: market.commodity,
      label: market.label,
      market: {
        state: market.state,
        district: market.district,
        name: market.market,
      },
      unit: market.unit,
      source: market.source,
      latest: {
        date: latest.date,
        modalPrice: latest.modalPrice,
        minPrice: latest.minPrice,
        maxPrice: latest.maxPrice,
        arrivalTonnes: latest.arrivalTonnes,
      },
      summary: {
        trendPercent: summary.prediction.latestChangePercent,
        demandScore: summary.prediction.demandScore,
        volatility: summary.prediction.volatility,
        recommendation: summary.prediction.recommendation,
        predictedAverage: Math.round(
          summary.prediction.forecast.reduce((sum, entry) => sum + entry.predictedPrice, 0) /
            summary.prediction.forecast.length
        ),
      },
      historical: market.series,
      forecast: summary.prediction.forecast,
      chartSeries: summary.chartSeries,
    });
  } catch (error) {
    sendJson(response, 500, {
      error: true,
      message: error.message || "Unable to fetch market prices right now.",
    });
  }
}

module.exports = {
  getMarketOverview,
};
