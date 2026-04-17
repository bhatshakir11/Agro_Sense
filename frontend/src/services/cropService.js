import api from "./api";
import { extractTextFromScannedPdf } from "./soilOcrService";

const extractedPdfCache = new Map();

function getFileCacheKey(file, weatherLocation) {
  const locationKey = weatherLocation
    ? [weatherLocation.place || "", weatherLocation.latitude || "", weatherLocation.longitude || ""].join(":")
    : "soil-only";

  return [file.name, file.size, file.lastModified, locationKey].join(":");
}

export async function getCropRecommendation(soilData) {
  const response = await api.post("/crop-recommendation", { soilData });
  return response.data;
}

export async function getCropRecommendationWithWeather(soilData, weatherLocation) {
  const response = await api.post("/crop-recommendation", { soilData, weatherLocation });
  return response.data;
}

export async function extractSoilPdfAndRecommend(file, weatherLocation) {
  const cacheKey = getFileCacheKey(file, weatherLocation);

  if (extractedPdfCache.has(cacheKey)) {
    return extractedPdfCache.get(cacheKey);
  }

  const fileData = await new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = String(reader.result || "");
      const base64 = result.includes(",") ? result.split(",")[1] : result;
      resolve(base64);
    };

    reader.onerror = () => {
      reject(new Error("Unable to read the PDF file."));
    };

    reader.readAsDataURL(file);
  });

  try {
    const response = await api.post("/crop-recommendation/extract-pdf", {
      fileName: file.name,
      fileData,
      weatherLocation,
    });

    extractedPdfCache.set(cacheKey, response.data);
    return response.data;
  } catch (error) {
    const message = String(error.response?.data?.message || "");
    const shouldUseOcr =
      message.includes("unsupported or damaged internal structure") ||
      message.includes("does not contain readable text") ||
      message.includes("Unable to read this PDF");

    if (!shouldUseOcr) {
      throw error;
    }

    const reportText = await extractTextFromScannedPdf(file);

    const ocrResponse = await api.post("/crop-recommendation/extract-text", {
      fileName: file.name,
      reportText,
      weatherLocation,
    });

    const payload = {
      ...ocrResponse.data,
      usedOcr: true,
    };

    extractedPdfCache.set(cacheKey, payload);
    return payload;
  }
}
