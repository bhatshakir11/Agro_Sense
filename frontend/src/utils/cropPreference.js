const cropSlugMap = {
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

export function normalizeCropCommodity(value = "") {
  const normalized = String(value).trim().toLowerCase();
  return cropSlugMap[normalized] || "wheat";
}
