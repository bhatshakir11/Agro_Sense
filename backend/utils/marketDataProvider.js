const marketHistory = require("../data/marketHistory.json");
const { getJson, getText } = require("./httpClient");
const { normalizeDateString } = require("./marketPredictionEngine");

const DEFAULT_MARKET_RESOURCE_ID = "9ef84268-d588-465a-a308-a864a43d0070";
const DEFAULT_SAMPLE_API_KEY = "579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b";

const commodityAliases = {
  wheat: "wheat",
  rice: "rice",
  maize: "maize",
  corn: "maize",
  cotton: "cotton",
  sugarcane: "sugarcane",
  soybean: "soybean",
  groundnut: "groundnut",
  "pearl millet": "pearl-millet",
  "pearl-millet": "pearl-millet",
  bajra: "pearl-millet",
  tomato: "tomato",
  potato: "potato",
};

const syntheticProfiles = {
  cotton: {
    label: "Cotton",
    state: "Karnataka",
    district: "Haveri",
    market: "Haveri",
    unit: "Rs/quintal",
    basePrice: 7180,
    trendStep: 38,
    arrivals: 84,
  },
  sugarcane: {
    label: "Sugarcane",
    state: "Karnataka",
    district: "Mandya",
    market: "Mandya",
    unit: "Rs/quintal",
    basePrice: 365,
    trendStep: 4,
    arrivals: 255,
  },
  soybean: {
    label: "Soybean",
    state: "Karnataka",
    district: "Bidar",
    market: "Bidar",
    unit: "Rs/quintal",
    basePrice: 4860,
    trendStep: 32,
    arrivals: 96,
  },
  groundnut: {
    label: "Groundnut",
    state: "Karnataka",
    district: "Chitradurga",
    market: "Challakere",
    unit: "Rs/quintal",
    basePrice: 6120,
    trendStep: 29,
    arrivals: 88,
  },
  "pearl-millet": {
    label: "Pearl Millet",
    state: "Karnataka",
    district: "Vijayapura",
    market: "Vijayapura",
    unit: "Rs/quintal",
    basePrice: 2580,
    trendStep: 18,
    arrivals: 104,
  },
  tomato: {
    label: "Tomato",
    state: "Karnataka",
    district: "Kolar",
    market: "Kolar",
    unit: "Rs/quintal",
    basePrice: 1460,
    trendStep: 26,
    arrivals: 132,
  },
  potato: {
    label: "Potato",
    state: "Karnataka",
    district: "Bengaluru Rural",
    market: "Doddaballapur",
    unit: "Rs/quintal",
    basePrice: 1710,
    trendStep: 16,
    arrivals: 118,
  },
};

function normalizeCommodity(input = "") {
  const value = String(input).trim().toLowerCase();
  return commodityAliases[value] || "wheat";
}

function buildSyntheticSeries(profile) {
  const startDate = new Date("2026-04-04T00:00:00Z");

  return Array.from({ length: 8 }).map((_, index) => {
    const date = new Date(startDate);
    date.setUTCDate(startDate.getUTCDate() + index);
    const modalPrice = profile.basePrice + profile.trendStep * index + (index % 2 === 0 ? 0 : 7);

    return {
      date: date.toISOString().slice(0, 10),
      modalPrice,
      minPrice: Math.max(1, modalPrice - Math.round(profile.basePrice * 0.018)),
      maxPrice: modalPrice + Math.round(profile.basePrice * 0.02),
      arrivalTonnes: Math.max(20, profile.arrivals - index * 3),
    };
  });
}

function getFallbackCommodity(commodity) {
  if (marketHistory[commodity]) {
    return marketHistory[commodity];
  }

  const profile = syntheticProfiles[commodity];

  if (!profile) {
    return marketHistory.wheat;
  }

  return {
    label: profile.label,
    state: profile.state,
    district: profile.district,
    market: profile.market,
    unit: profile.unit,
    series: buildSyntheticSeries(profile),
  };
}

function parseNumber(value) {
  const parsed = Number(String(value).replace(/[^\d.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter(Boolean);

  if (lines.length < 2) {
    return [];
  }

  const headers = lines[0]
    .split(",")
    .map((header) => header.trim().replace(/^"|"$/g, "").toLowerCase());

  return lines.slice(1).map((line) => {
    const parts = line.match(/(".*?"|[^",\s]+|[^,]+)/g) || [];
    const record = {};

    headers.forEach((header, index) => {
      record[header] = String(parts[index] || "")
        .trim()
        .replace(/^"|"$/g, "");
    });

    return record;
  });
}

function mapLiveRecord(record) {
  const date =
    record.arrival_date ||
    record.date ||
    record.price_date ||
    record.reported_on ||
    record.timestamp;
  const modalPrice = parseNumber(record.modal_price || record.modalprice || record.modal || record.price);

  if (!date || !modalPrice) {
    return null;
  }

  return {
    date: normalizeDateString(date),
    modalPrice,
    minPrice: parseNumber(record.min_price || record.minprice || record.min) || modalPrice,
    maxPrice: parseNumber(record.max_price || record.maxprice || record.max) || modalPrice,
    arrivalTonnes: parseNumber(record.arrival_tonnes || record.arrivals || record.arrival) || null,
    market: record.market || record.market_name || record.mandi || "",
    district: record.district || record.district_name || "",
    state: record.state || record.state_name || "",
    commodity: record.commodity || record.crop || record.variety || "",
  };
}

async function fetchConfiguredLiveSeries(commodity) {
  const directUrl = process.env.MARKET_DATA_URL;
  const dataGovApiKey = process.env.DATA_GOV_IN_API_KEY || DEFAULT_SAMPLE_API_KEY;
  const resourceId = process.env.MARKET_RESOURCE_ID || DEFAULT_MARKET_RESOURCE_ID;
  const fallbackCommodity = getFallbackCommodity(commodity);

  let records = [];

  if (directUrl) {
    if (directUrl.toLowerCase().endsWith(".json")) {
      const payload = await getJson(directUrl);
      records = Array.isArray(payload.records) ? payload.records : Array.isArray(payload) ? payload : [];
    } else {
      const csv = await getText(directUrl);
      records = parseCsv(csv);
    }
  } else if (resourceId) {
    const commodityLabel = fallbackCommodity.label;
    const endpoint = `https://api.data.gov.in/resource/${resourceId}?api-key=${encodeURIComponent(
      dataGovApiKey
    )}&format=json&limit=10&filters[commodity]=${encodeURIComponent(commodityLabel)}`;
    const payload = await getJson(endpoint);
    records = Array.isArray(payload.records) ? payload.records : [];
  } else {
    return null;
  }

  const commodityLabel = fallbackCommodity.label.toLowerCase();
  const mapped = records
    .map(mapLiveRecord)
    .filter(Boolean)
    .filter((record) => {
      const marketCommodity = String(
        record.commodity || commodityLabel
      ).toLowerCase();
      return marketCommodity.includes(commodityLabel);
    })
    .sort((left, right) => left.date.localeCompare(right.date));

  if (!mapped.length) {
    return null;
  }

  return {
    label: fallbackCommodity.label,
    state: mapped[mapped.length - 1].state || fallbackCommodity.state,
    district: mapped[mapped.length - 1].district || fallbackCommodity.district,
    market: mapped[mapped.length - 1].market || fallbackCommodity.market,
    unit: "Rs/quintal",
    series: mapped.slice(-8),
  };
}

async function getMarketSeries(query = {}) {
  const commodity = normalizeCommodity(query.commodity);
  const fallback = getFallbackCommodity(commodity);

  try {
    const live = await fetchConfiguredLiveSeries(commodity);

    if (live) {
      return {
        commodity,
        ...live,
        source: {
          type: "live",
          name: "Configured live mandi feed",
        },
      };
    }
  } catch (error) {
    return {
      commodity,
      ...fallback,
      source: {
        type: "fallback",
        name: "Bundled market history",
        warning: "Live mandi feed could not be reached, so fallback history is being used.",
      },
    };
  }

  return {
    commodity,
    ...fallback,
    source: {
      type: "fallback",
      name: "Bundled market history",
      warning:
        "Live market source could not be reached. The page is using bundled fallback history instead.",
    },
  };
}

module.exports = {
  getMarketSeries,
  normalizeCommodity,
};
