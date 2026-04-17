function normalizeDateString(dateString) {
  const value = String(dateString || "").trim();

  if (!value) {
    return "";
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  const slashMatch = value.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);

  if (slashMatch) {
    const [, day, month, year] = slashMatch;
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  const parsed = new Date(value);

  if (!Number.isNaN(parsed.getTime())) {
    const year = parsed.getFullYear();
    const month = String(parsed.getMonth() + 1).padStart(2, "0");
    const day = String(parsed.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  return value;
}

function formatDateLabel(dateString) {
  const normalized = normalizeDateString(dateString);
  const parsed = new Date(`${normalized}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return String(dateString || "-");
  }

  return parsed.toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
  });
}

function average(values) {
  if (!values.length) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function runLinearRegression(values) {
  const size = values.length;
  const sumX = values.reduce((sum, _, index) => sum + index, 0);
  const sumY = values.reduce((sum, value) => sum + value, 0);
  const sumXY = values.reduce((sum, value, index) => sum + index * value, 0);
  const sumXX = values.reduce((sum, _, index) => sum + index * index, 0);
  const denominator = size * sumXX - sumX * sumX;

  if (!denominator) {
    return {
      slope: 0,
      intercept: values[0] || 0,
    };
  }

  const slope = (size * sumXY - sumX * sumY) / denominator;
  const intercept = (sumY - slope * sumX) / size;

  return { slope, intercept };
}

function addDays(dateString, days) {
  const [year, month, day] = normalizeDateString(dateString).split("-").map(Number);
  const base = new Date(Date.UTC(year, month - 1, day));
  base.setUTCDate(base.getUTCDate() + days);
  const nextYear = base.getUTCFullYear();
  const nextMonth = String(base.getUTCMonth() + 1).padStart(2, "0");
  const nextDay = String(base.getUTCDate()).padStart(2, "0");
  return `${nextYear}-${nextMonth}-${nextDay}`;
}

function buildPrediction(series) {
  const recent = series.slice(-5);
  const prices = recent.map((entry) => entry.modalPrice);
  const arrivals = recent.map((entry) => entry.arrivalTonnes || 0);
  const latest = series[series.length - 1];
  const previous = series[series.length - 2] || latest;
  const shortAverage = average(prices);
  const { slope, intercept } = runLinearRegression(prices);
  const latestChangePercent = ((latest.modalPrice - previous.modalPrice) / previous.modalPrice) * 100;
  const volatility = average(
    prices.slice(1).map((price, index) => Math.abs(price - prices[index]))
  );

  const forecast = Array.from({ length: 4 }).map((_, index) => {
    const nextDayIndex = prices.length + index;
    const regressionPrice = intercept + slope * nextDayIndex;
    const blendedPrice = Math.round(regressionPrice * 0.7 + shortAverage * 0.3);
    const date = addDays(latest.date, index + 1);

    return {
      date,
      label: formatDateLabel(date),
      predictedPrice: blendedPrice,
      actualPrice: null,
    };
  });

  const demandScore = clamp(
    Math.round(62 + latestChangePercent * 4 + (average(arrivals) - latest.arrivalTonnes) * 0.12),
    40,
    92
  );

  const recommendation =
    latestChangePercent >= 1.2
      ? "Momentum is positive. Stagger selling over the next 1-2 weeks."
      : latestChangePercent <= -1
      ? "Prices are soft. Avoid distress selling if storage is available."
      : "Prices are steady. Sell in phases and watch daily mandi arrivals.";

  return {
    latestChangePercent: Number(latestChangePercent.toFixed(1)),
    demandScore,
    volatility: Math.round(volatility),
    recommendation,
    forecast,
  };
}

function buildChartSeries(series, forecast) {
  const history = series.map((entry, index) => ({
    label: formatDateLabel(entry.date),
    actualPrice: entry.modalPrice,
    predictedPrice: index === series.length - 1 ? entry.modalPrice : null,
  }));

  return [
    ...history,
    ...forecast.map((entry) => ({
      label: entry.label,
      actualPrice: null,
      predictedPrice: entry.predictedPrice,
    })),
  ];
}

function summarizeMarketSeries(series) {
  const latest = series[series.length - 1];
  const previous = series[series.length - 2] || latest;
  const prediction = buildPrediction(series);

  return {
    latest,
    previous,
    prediction,
    chartSeries: buildChartSeries(series, prediction.forecast),
  };
}

module.exports = {
  normalizeDateString,
  summarizeMarketSeries,
};
