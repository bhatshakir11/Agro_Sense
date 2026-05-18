const { readJsonBody } = require("../utils/requestBody");
const { fetchWeatherIntelligence } = require("../utils/weatherIntelligence");
const { getMarketSeries, normalizeCommodity } = require("../utils/marketDataProvider");
const { summarizeMarketSeries } = require("../utils/marketPredictionEngine");

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, { "Content-Type": "application/json" });
  response.end(JSON.stringify(payload));
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function average(values) {
  if (!values.length) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function inferCommodity(body) {
  const cropName =
    body.commodity ||
    body.crop?.recommendation?.primaryRecommendation?.crop ||
    body.crop?.primaryRecommendation?.crop ||
    body.market?.commodity ||
    "wheat";

  return normalizeCommodity(cropName);
}

function getWeatherReadiness(weather) {
  if (!weather?.current) {
    return 68;
  }

  const stormScoreMap = {
    Low: 88,
    Medium: 66,
    High: 38,
  };
  const humidityPenalty =
    weather.current.humidity > 84 ? 16 : weather.current.humidity > 75 ? 8 : 0;

  return clamp((stormScoreMap[weather.current.stormRisk] || 60) - humidityPenalty, 25, 95);
}

function getCropFitScore(crop) {
  const confidence =
    crop?.recommendation?.primaryRecommendation?.confidence ||
    crop?.primaryRecommendation?.confidence;

  return Number.isFinite(confidence) ? confidence : 72;
}

function getDiseaseHealthScore(disease) {
  const analysis = disease?.analysis || disease;

  if (!analysis) {
    return 74;
  }

  const severityScoreMap = {
    low: 88,
    medium: 64,
    high: 36,
  };

  const base = severityScoreMap[String(analysis.severity || "").toLowerCase()] || 64;
  const confidenceModifier = Number.isFinite(Number(analysis.confidence))
    ? Math.round((100 - Number(analysis.confidence)) * 0.16)
    : 8;

  return clamp(base - confidenceModifier, 18, 92);
}

function getMarketOpportunityScore(marketSummary) {
  if (!marketSummary) {
    return 66;
  }

  return clamp(
    Math.round(
      marketSummary.prediction.demandScore * 0.7 +
        (marketSummary.prediction.latestChangePercent >= 0 ? 18 : 6)
    ),
    32,
    94
  );
}

function getSeasonTrendLabels() {
  const formatter = new Intl.DateTimeFormat("en-US", { month: "short" });
  const labels = [];
  const now = new Date();

  for (let index = 5; index >= 0; index -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - index, 1);
    labels.push(formatter.format(date));
  }

  return labels;
}

function buildTrendSeries(overallScore, cropFit, weatherReadiness, marketOpportunity) {
  const labels = getSeasonTrendLabels();
  const offsets = [-9, -6, -3, -1, 2, 0];
  const targetBase = clamp(Math.round(average([cropFit, weatherReadiness, marketOpportunity]) + 4), 58, 92);

  return labels.map((label, index) => ({
    month: label,
    score: clamp(Math.round(overallScore + offsets[index]), 40, 98),
    target: clamp(targetBase + (index < 3 ? -2 : 0), 45, 98),
  }));
}

function buildRadarData(cropFit, weatherReadiness, marketOpportunity, diseaseHealth, weather) {
  const rainChance = weather?.forecast?.[0]?.rainChance || 35;
  const waterUse = clamp(Math.round(82 - rainChance * 0.25), 42, 94);
  const incomeStability = clamp(Math.round((cropFit + marketOpportunity) / 2), 35, 96);

  return [
    { category: "Crop Fit", value: cropFit },
    { category: "Weather Stability", value: weatherReadiness },
    { category: "Market Timing", value: marketOpportunity },
    { category: "Plant Health", value: diseaseHealth },
    { category: "Water Use", value: waterUse },
    { category: "Income Stability", value: incomeStability },
  ];
}

function buildResourceBreakdown(cropFit, weatherReadiness, marketOpportunity, diseaseHealth) {
  return [
    { label: "Soil-to-crop alignment", value: clamp(cropFit, 24, 96) },
    { label: "Weather readiness", value: clamp(weatherReadiness, 24, 96) },
    { label: "Disease control readiness", value: clamp(diseaseHealth, 24, 96) },
    { label: "Market timing opportunity", value: clamp(marketOpportunity, 24, 96) },
  ];
}

function buildKpis(overallScore, weatherReadiness, marketSummary, diseaseHealth) {
  return [
    {
      label: "Overall Field Score",
      value: `${overallScore}/100`,
      color: "success",
    },
    {
      label: "Weather Readiness",
      value: `${weatherReadiness}/100`,
      color: weatherReadiness >= 75 ? "primary" : "warning",
    },
    {
      label: "Market Outlook",
      value: marketSummary
        ? `${marketSummary.prediction.latestChangePercent >= 0 ? "+" : ""}${marketSummary.prediction.latestChangePercent}%`
        : "N/A",
      color: marketSummary?.prediction.latestChangePercent >= 0 ? "secondary" : "warning",
    },
    {
      label: "Plant Health Score",
      value: `${diseaseHealth}/100`,
      color: diseaseHealth >= 70 ? "success" : "warning",
    },
  ];
}

function buildModuleSummary(weather, market, crop, disease) {
  return {
    weather: weather
      ? {
          location: weather.location.name,
          temperature: weather.current.temperature,
          humidity: weather.current.humidity,
          stormRisk: weather.current.stormRisk,
        }
      : null,
    market: market
      ? {
          commodity: market.label,
          market: market.market,
          latestPrice: market.latest?.modalPrice ?? null,
          trendPercent: market.prediction?.latestChangePercent ?? 0,
        }
      : null,
    crop: crop?.recommendation?.primaryRecommendation || crop?.primaryRecommendation || null,
    disease: disease?.analysis || disease || null,
  };
}

async function getDashboardOverview(request, response) {
  try {
    const body = request.method === "POST" ? await readJsonBody(request) : {};
    const commodity = inferCommodity(body);

    const [weatherResult, market] = await Promise.all([
      body.weatherLocation
        ? fetchWeatherIntelligence(body.weatherLocation).catch(() => null)
        : Promise.resolve(null),
      getMarketSeries({ commodity }),
    ]);

    const marketSummary = summarizeMarketSeries(market.series);
    const marketModule = {
      label: market.label,
      market: market.market,
      latest: marketSummary.latest,
      prediction: marketSummary.prediction,
    };
    const cropFit = getCropFitScore(body.crop);
    const weatherReadiness = getWeatherReadiness(weatherResult);
    const diseaseHealth = getDiseaseHealthScore(body.disease);
    const marketOpportunity = getMarketOpportunityScore(marketSummary);
    const overallScore = clamp(
      Math.round(
        cropFit * 0.34 +
          weatherReadiness * 0.26 +
          marketOpportunity * 0.24 +
          diseaseHealth * 0.16
      ),
      28,
      96
    );

    sendJson(response, 200, {
      generatedAt: new Date().toISOString(),
      commodity,
      kpis: buildKpis(overallScore, weatherReadiness, marketSummary, diseaseHealth),
      radar: buildRadarData(
        cropFit,
        weatherReadiness,
        marketOpportunity,
        diseaseHealth,
        weatherResult
      ),
      trend: buildTrendSeries(overallScore, cropFit, weatherReadiness, marketOpportunity),
      resources: buildResourceBreakdown(
        cropFit,
        weatherReadiness,
        marketOpportunity,
        diseaseHealth
      ),
      liveModules: buildModuleSummary(weatherResult, marketModule, body.crop, body.disease),
      weather: weatherResult
        ? {
            location: weatherResult.location,
            current: weatherResult.current,
            forecast: weatherResult.forecast,
            advisories: weatherResult.advisories,
          }
        : null,
      market: {
        commodity: market.commodity,
        label: market.label,
        market: {
          state: market.state,
          district: market.district,
          name: market.market,
        },
        latest: marketSummary.latest,
        source: market.source,
        summary: marketSummary.prediction,
      },
    });
  } catch (error) {
    sendJson(response, error.statusCode || 500, {
      error: true,
      message: error.message || "Unable to build dashboard overview right now.",
    });
  }
}

module.exports = {
  getDashboardOverview,
};
