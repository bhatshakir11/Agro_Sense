const { readJsonBody } = require("../utils/requestBody");
const { recommendCrops } = require("../utils/cropRecommendationEngine");
const { parseSoilPdf, extractFieldsFromText } = require("../utils/soilPdfParser");
const { fetchWeatherIntelligence } = require("../utils/weatherIntelligence");

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, { "Content-Type": "application/json" });
  response.end(JSON.stringify(payload));
}

async function resolveWeatherContext(weatherLocation) {
  if (!weatherLocation) {
    return {
      weatherContext: null,
      weatherWarning: "",
    };
  }

  try {
    const weatherContext = await fetchWeatherIntelligence(weatherLocation);
    return {
      weatherContext,
      weatherWarning: "",
    };
  } catch (error) {
    return {
      weatherContext: null,
      weatherWarning: "Weather analysis could not be applied, so this recommendation is based on soil data only.",
    };
  }
}

function appendWeatherWarning(recommendation, weatherWarning) {
  if (!weatherWarning) {
    return recommendation;
  }

  return {
    ...recommendation,
    weatherContext: {
      ...(recommendation.weatherContext || { applied: false }),
      warning: weatherWarning,
    },
  };
}

async function getRecommendations(request, response) {
  try {
    const body = await readJsonBody(request);
    const { weatherContext, weatherWarning } = await resolveWeatherContext(body.weatherLocation);
    const recommendation = recommendCrops(body.soilData || body, { weatherContext });
    sendJson(response, 200, appendWeatherWarning(recommendation, weatherWarning));
  } catch (error) {
    sendJson(response, 400, {
      error: true,
      message: error.message || "Unable to generate crop recommendations.",
    });
  }
}

async function extractPdfAndRecommend(request, response) {
  try {
    const body = await readJsonBody(request);

    if (!body.fileData) {
      sendJson(response, 400, {
        error: true,
        message: "PDF file data is required.",
      });
      return;
    }

    const parsed = await parseSoilPdf(body.fileData);

    if (parsed.missing.length > 0) {
      sendJson(response, 422, {
        error: true,
        message: `Could not extract all required soil values from PDF. Missing: ${parsed.missing.join(", ")}`,
        extractedSoilData: parsed.extracted,
        missing: parsed.missing,
        debugTextPreview: parsed.text.slice(0, 1200),
      });
      return;
    }

    const { weatherContext, weatherWarning } = await resolveWeatherContext(body.weatherLocation);
    const recommendation = recommendCrops(parsed.extracted, { weatherContext });

    sendJson(response, 200, {
      extractedSoilData: parsed.extracted,
      recommendation: appendWeatherWarning(recommendation, weatherWarning),
    });
  } catch (error) {
    sendJson(response, 400, {
      error: true,
      message: error.message || "Unable to process PDF soil report.",
    });
  }
}

async function extractTextAndRecommend(request, response) {
  try {
    const body = await readJsonBody(request);
    const reportText = String(body.reportText || "");

    if (!reportText.trim()) {
      sendJson(response, 400, {
        error: true,
        message: "Extracted OCR text is required.",
      });
      return;
    }

    const parsed = extractFieldsFromText(reportText);

    if (parsed.missing.length > 0) {
      sendJson(response, 422, {
        error: true,
        message: `OCR could not confidently extract all required soil values. Missing: ${parsed.missing.join(", ")}`,
        extractedSoilData: parsed.extracted,
        missing: parsed.missing,
        debugTextPreview: reportText.slice(0, 1200),
        usedOcr: true,
      });
      return;
    }

    const { weatherContext, weatherWarning } = await resolveWeatherContext(body.weatherLocation);
    const recommendation = recommendCrops(parsed.extracted, { weatherContext });

    sendJson(response, 200, {
      extractedSoilData: parsed.extracted,
      recommendation: appendWeatherWarning(recommendation, weatherWarning),
      usedOcr: true,
    });
  } catch (error) {
    sendJson(response, 400, {
      error: true,
      message: error.message || "Unable to process OCR text for crop recommendation.",
    });
  }
}

module.exports = {
  getRecommendations,
  extractPdfAndRecommend,
  extractTextAndRecommend,
};
