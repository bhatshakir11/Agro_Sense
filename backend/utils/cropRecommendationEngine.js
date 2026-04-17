const cropDataset = require("../data/cropDataset.json");

const FIELD_WEIGHTS = {
  Nitrogen: 0.26,
  Phosphorus: 0.19,
  Potassium: 0.21,
  pH: 0.19,
  "Organic Carbon": 0.15,
};

const WEATHER_WEIGHTS = {
  season: 0.3,
  temperature: 0.27,
  humidity: 0.18,
  rainChance: 0.15,
  stormRisk: 0.1,
};

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function normalizeSoilData(rawSoilData) {
  return {
    Nitrogen: Number(rawSoilData.Nitrogen),
    Phosphorus: Number(rawSoilData.Phosphorus),
    Potassium: Number(rawSoilData.Potassium),
    pH: Number(rawSoilData.pH),
    "Organic Carbon": Number(rawSoilData["Organic Carbon"]),
  };
}

function validateSoilData(soilData) {
  const missing = Object.entries(soilData)
    .filter(([, value]) => Number.isNaN(value))
    .map(([key]) => key);

  return {
    valid: missing.length === 0,
    missing,
  };
}

function scoreField(value, range) {
  const spread = Math.max(range.max - range.min, 1);

  if (value >= range.min && value <= range.max) {
    const idealDistance = Math.abs(value - range.ideal);
    const safeRadius = Math.max(Math.abs(range.ideal - range.min), Math.abs(range.max - range.ideal), 1);
    return clamp(100 - (idealDistance / safeRadius) * 22, 78, 100);
  }

  if (value < range.min) {
    return clamp(72 - ((range.min - value) / spread) * 65, 0, 72);
  }

  return clamp(72 - ((value - range.max) / spread) * 65, 0, 72);
}

function buildInsights(cropProfile, soilData) {
  return Object.entries(cropProfile.soil).map(([fieldName, range]) => {
    const actual = soilData[fieldName];
    let status = "good";

    if (actual < range.min || actual > range.max) {
      status = "attention";
    } else if (Math.abs(actual - range.ideal) > (range.max - range.min) * 0.25) {
      status = "fair";
    }

    return {
      field: fieldName,
      actual,
      ideal: range.ideal,
      range: `${range.min}-${range.max}`,
      status,
    };
  });
}

function getCurrentSeason(timezone) {
  const month = Number(
    new Intl.DateTimeFormat("en-US", {
      month: "numeric",
      timeZone: timezone || "UTC",
    }).format(new Date())
  );

  if (month >= 6 && month <= 10) {
    return "Kharif";
  }

  if (month === 11 || month === 12 || month <= 3) {
    return "Rabi";
  }

  return "Zaid";
}

function buildWeatherSummary(weatherContext) {
  if (!weatherContext?.current || !weatherContext?.location) {
    return null;
  }

  const forecastSlice = Array.isArray(weatherContext.forecast) ? weatherContext.forecast.slice(0, 3) : [];
  const averageRainChance = forecastSlice.length
    ? Math.round(
        forecastSlice.reduce((sum, day) => sum + Number(day.rainChance || 0), 0) / forecastSlice.length
      )
    : 0;

  return {
    location: weatherContext.location,
    currentSeason: getCurrentSeason(weatherContext.location.timezone),
    temperature: Number(weatherContext.current.temperature),
    humidity: Number(weatherContext.current.humidity),
    rainChance: averageRainChance,
    stormRisk: String(weatherContext.current.stormRisk || "Low"),
    advisories: weatherContext.advisories || [],
  };
}

function scoreSeasonAlignment(cropSeason, currentSeason) {
  const normalizedCropSeason = String(cropSeason || "").toLowerCase();
  const normalizedCurrentSeason = String(currentSeason || "").toLowerCase();

  if (normalizedCropSeason.includes(normalizedCurrentSeason)) {
    return 100;
  }

  if (normalizedCropSeason === "annual" || normalizedCropSeason === "multiple") {
    return 88;
  }

  if (normalizedCropSeason.includes("/")) {
    const seasons = normalizedCropSeason.split("/").map((value) => value.trim());
    if (seasons.includes(normalizedCurrentSeason)) {
      return 96;
    }

    return 72;
  }

  if (normalizedCurrentSeason === "zaid") {
    return 62;
  }

  return 38;
}

function scoreStormRisk(stormRisk, stormTolerance) {
  const toleranceMatrix = {
    low: { Low: 95, Medium: 62, High: 24 },
    medium: { Low: 88, Medium: 78, High: 52 },
    high: { Low: 76, Medium: 86, High: 72 },
  };

  const normalizedTolerance = toleranceMatrix[stormTolerance] ? stormTolerance : "medium";
  return toleranceMatrix[normalizedTolerance][stormRisk] || 60;
}

function describeWeatherMetric(label, actual, range, positiveText, lowText, highText) {
  if (actual < range.min) {
    return `${label} is below the preferred range. ${lowText}`;
  }

  if (actual > range.max) {
    return `${label} is above the preferred range. ${highText}`;
  }

  return `${label} is in range. ${positiveText}`;
}

function scoreWeatherMatch(cropProfile, weatherSummary) {
  if (!weatherSummary || !cropProfile.weather) {
    return null;
  }

  const seasonScore = scoreSeasonAlignment(cropProfile.season, weatherSummary.currentSeason);
  const temperatureScore = scoreField(weatherSummary.temperature, cropProfile.weather.temperature);
  const humidityScore = scoreField(weatherSummary.humidity, cropProfile.weather.humidity);
  const rainChanceScore = scoreField(weatherSummary.rainChance, cropProfile.weather.rainChance);
  const stormRiskScore = scoreStormRisk(
    weatherSummary.stormRisk,
    cropProfile.weather.stormTolerance
  );

  const overall = Math.round(
    seasonScore * WEATHER_WEIGHTS.season +
      temperatureScore * WEATHER_WEIGHTS.temperature +
      humidityScore * WEATHER_WEIGHTS.humidity +
      rainChanceScore * WEATHER_WEIGHTS.rainChance +
      stormRiskScore * WEATHER_WEIGHTS.stormRisk
  );

  const insights = [
    seasonScore >= 90
      ? `Current season is ${weatherSummary.currentSeason}, which aligns well with ${cropProfile.crop}.`
      : `Current season is ${weatherSummary.currentSeason}; ${cropProfile.crop} is mainly a ${cropProfile.season} crop.`,
    describeWeatherMetric(
      "Temperature",
      weatherSummary.temperature,
      cropProfile.weather.temperature,
      "This supports establishment and crop growth.",
      "Cooler conditions may slow growth.",
      "Heat stress can reduce performance."
    ),
    describeWeatherMetric(
      "Humidity",
      weatherSummary.humidity,
      cropProfile.weather.humidity,
      "Moisture conditions are broadly supportive.",
      "Dry air may require closer moisture management.",
      "High humidity can raise disease pressure."
    ),
    describeWeatherMetric(
      "Rain chance",
      weatherSummary.rainChance,
      cropProfile.weather.rainChance,
      "Near-term moisture support looks acceptable.",
      "Lower rainfall support may require irrigation planning.",
      "Wet conditions may complicate field operations."
    ),
    weatherSummary.stormRisk === "High" && cropProfile.weather.stormTolerance === "low"
      ? "Storm exposure is high for a crop with lower tolerance."
      : `Storm risk is ${weatherSummary.stormRisk.toLowerCase()} for current field conditions.`,
  ];

  return {
    score: overall,
    season: weatherSummary.currentSeason,
    location: weatherSummary.location,
    current: {
      temperature: weatherSummary.temperature,
      humidity: weatherSummary.humidity,
      rainChance: weatherSummary.rainChance,
      stormRisk: weatherSummary.stormRisk,
    },
    insights,
  };
}

function recommendCrops(soilData, options = {}) {
  const normalizedSoilData = normalizeSoilData(soilData);
  const validation = validateSoilData(normalizedSoilData);
  const weatherSummary = buildWeatherSummary(options.weatherContext);

  if (!validation.valid) {
    throw new Error(`Missing or invalid soil fields: ${validation.missing.join(", ")}`);
  }

  const ranked = cropDataset
    .map((cropProfile) => {
      const fieldScores = Object.entries(cropProfile.soil).map(([fieldName, range]) => {
        const score = scoreField(normalizedSoilData[fieldName], range);
        return score * FIELD_WEIGHTS[fieldName];
      });

      const soilConfidence = Math.round(fieldScores.reduce((sum, value) => sum + value, 0));
      const weatherMatch = scoreWeatherMatch(cropProfile, weatherSummary);
      const confidence = weatherMatch
        ? Math.round(clamp(soilConfidence * 0.78 + weatherMatch.score * 0.22, 0, 100))
        : soilConfidence;

      return {
        crop: cropProfile.crop,
        season: cropProfile.season,
        confidence,
        soilConfidence,
        notes: cropProfile.notes,
        scores: cropProfile.sustainability,
        insights: buildInsights(cropProfile, normalizedSoilData),
        weatherMatch,
      };
    })
    .sort((left, right) => right.confidence - left.confidence);

  const primary = ranked[0];

  return {
    soilData: normalizedSoilData,
    primaryRecommendation: primary,
    alternatives: ranked.slice(1, 4),
    allRecommendations: ranked.slice(0, 6),
    datasetSize: cropDataset.length,
    weatherContext: weatherSummary
      ? {
          applied: true,
          location: weatherSummary.location,
          currentSeason: weatherSummary.currentSeason,
          current: {
            temperature: weatherSummary.temperature,
            humidity: weatherSummary.humidity,
            rainChance: weatherSummary.rainChance,
            stormRisk: weatherSummary.stormRisk,
          },
          advisories: weatherSummary.advisories,
        }
      : {
          applied: false,
          message: "Weather analysis was not applied because no location was available.",
        },
  };
}

module.exports = {
  recommendCrops,
  normalizeSoilData,
  validateSoilData,
};
