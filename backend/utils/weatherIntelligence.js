const { getJson } = require("./httpClient");

function pickLocationName(address = {}) {
  return (
    address.city ||
    address.town ||
    address.village ||
    address.municipality ||
    address.county ||
    address.state_district ||
    "Your Location"
  );
}

async function reverseGeocodeCoordinates(latitude, longitude, fallbackPlace) {
  try {
    const reverseUrl =
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(latitude)}` +
      `&lon=${encodeURIComponent(longitude)}&zoom=10&addressdetails=1`;
    const reverseData = await getJson(reverseUrl, {
      headers: {
        "User-Agent": "AgroAssistPro/1.0 (location weather support)",
      },
    });
    const address = reverseData.address || {};

    return {
      name: pickLocationName(address) || fallbackPlace || "Your Location",
      admin1: address.state || address.region || "",
      country: address.country || "",
      latitude,
      longitude,
    };
  } catch (error) {
    return {
      name: fallbackPlace || "Your Location",
      admin1: "",
      country: "",
      latitude,
      longitude,
    };
  }
}

function getStormRisk(maxPrecipitationProbability, maxWindGust, weatherCodes) {
  const hasThunderstormCode = weatherCodes.some((code) => [95, 96, 99].includes(code));
  let score = 0;

  if (maxPrecipitationProbability >= 70) score += 35;
  else if (maxPrecipitationProbability >= 40) score += 20;
  else if (maxPrecipitationProbability >= 20) score += 10;

  if (maxWindGust >= 45) score += 30;
  else if (maxWindGust >= 30) score += 18;
  else if (maxWindGust >= 20) score += 10;

  if (hasThunderstormCode) score += 40;

  if (score >= 70) return "High";
  if (score >= 40) return "Medium";
  return "Low";
}

function getAdvisories(stormRisk, currentHumidity, maxPrecipitationProbability) {
  const advisories = [];

  if (stormRisk === "High") {
    advisories.push("Delay spraying and secure loose field materials before peak rain or wind.");
  } else if (stormRisk === "Medium") {
    advisories.push("Plan irrigation carefully and monitor the sky during the afternoon.");
  } else {
    advisories.push("Conditions are relatively stable for regular field work.");
  }

  if (currentHumidity >= 75) {
    advisories.push("Humidity is elevated. Watch for fungal disease pressure in dense crops.");
  }

  if (maxPrecipitationProbability >= 50) {
    advisories.push("Rain chance is significant. Avoid fertilizer application just before rainfall.");
  }

  return advisories;
}

function buildForecast(hourly, timezone) {
  const grouped = new Map();

  hourly.time.forEach((time, index) => {
    const dateKey = time.slice(0, 10);

    if (!grouped.has(dateKey)) {
      grouped.set(dateKey, {
        time,
        temperatures: [],
        humidities: [],
        precipitationProbabilities: [],
        windGusts: [],
        weatherCodes: [],
      });
    }

    const day = grouped.get(dateKey);
    day.temperatures.push(hourly.temperature_2m[index]);
    day.humidities.push(hourly.relative_humidity_2m[index]);
    day.precipitationProbabilities.push(hourly.precipitation_probability[index]);
    day.windGusts.push(hourly.wind_gusts_10m[index]);
    day.weatherCodes.push(hourly.weather_code[index]);
  });

  return Array.from(grouped.values())
    .slice(0, 6)
    .map((day) => ({
      label: new Intl.DateTimeFormat("en-US", {
        weekday: "short",
        timeZone: timezone,
      }).format(new Date(day.time)),
      temperature: Math.round(Math.max(...day.temperatures)),
      humidity: Math.round(day.humidities.reduce((sum, value) => sum + value, 0) / day.humidities.length),
      rainChance: Math.round(Math.max(...day.precipitationProbabilities)),
      windGust: Math.round(Math.max(...day.windGusts)),
    }));
}

async function resolveLocation(query) {
  const place = String(query.place || "").trim();
  const latitude = Number(query.latitude);
  const longitude = Number(query.longitude);
  const hasCoordinates = Number.isFinite(latitude) && Number.isFinite(longitude);

  if (hasCoordinates) {
    return reverseGeocodeCoordinates(latitude, longitude, place);
  }

  if (place.length < 2) {
    const inputError = new Error("Place must be at least 2 characters long.");
    inputError.statusCode = 400;
    throw inputError;
  }

  const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    place
  )}&count=1&language=en&format=json`;
  const geocodingData = await getJson(geocodingUrl);
  const location = geocodingData.results && geocodingData.results[0];

  if (!location) {
    const notFoundError = new Error("Location not found.");
    notFoundError.statusCode = 404;
    throw notFoundError;
  }

  return location;
}

function buildWeatherPayload(location, weatherData) {
  const next24Hours = {
    precipitationProbability: weatherData.hourly.precipitation_probability.slice(0, 24),
    windGusts: weatherData.hourly.wind_gusts_10m.slice(0, 24),
    weatherCodes: weatherData.hourly.weather_code.slice(0, 24),
  };

  const maxPrecipitationProbability = Math.max(...next24Hours.precipitationProbability);
  const maxWindGust = Math.max(...next24Hours.windGusts);
  const stormRisk = getStormRisk(maxPrecipitationProbability, maxWindGust, next24Hours.weatherCodes);

  return {
    location: {
      name: location.name,
      admin1: location.admin1 || "",
      country: location.country || "",
      latitude: location.latitude,
      longitude: location.longitude,
      timezone: weatherData.timezone,
    },
    current: {
      temperature: Math.round(weatherData.current.temperature_2m),
      humidity: Math.round(weatherData.current.relative_humidity_2m),
      windSpeed: Math.round(weatherData.current.wind_speed_10m),
      windGust: Math.round(weatherData.current.wind_gusts_10m),
      stormRisk,
    },
    forecast: buildForecast(weatherData.hourly, weatherData.timezone),
    advisories: getAdvisories(
      stormRisk,
      weatherData.current.relative_humidity_2m,
      maxPrecipitationProbability
    ),
    metadata: {
      provider: "Open-Meteo",
      stormRiskNote:
        "Storm risk is inferred from forecast precipitation probability, wind gusts, and thunderstorm weather codes.",
    },
  };
}

async function fetchWeatherIntelligence(query) {
  const location = await resolveLocation(query);
  const weatherUrl =
    `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}` +
    "&timezone=auto" +
    "&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_gusts_10m" +
    "&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,wind_gusts_10m,weather_code" +
    "&forecast_days=6";

  const weatherData = await getJson(weatherUrl);
  return buildWeatherPayload(location, weatherData);
}

module.exports = {
  fetchWeatherIntelligence,
};
