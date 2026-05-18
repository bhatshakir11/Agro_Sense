const diseaseCatalog = require("../data/diseaseCatalog.json");

const cropAliases = {
  tomato: "tomato",
  potato: "potato",
  rice: "rice",
  paddy: "rice",
  cotton: "cotton",
  maize: "maize",
  corn: "maize",
  wheat: "wheat",
  soybean: "soybean",
  soya: "soybean",
  groundnut: "groundnut",
  peanut: "groundnut",
};

function normalizeCropName(value = "") {
  const normalized = String(value).trim().toLowerCase();
  return cropAliases[normalized] || "";
}

function normalizeText(value = "") {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ");
}

function getCropCatalog(cropName = "") {
  const normalizedCrop = normalizeCropName(cropName);
  return normalizedCrop ? diseaseCatalog[normalizedCrop] || null : null;
}

function findDiseaseByName(cropCatalog, diseaseName = "") {
  if (!cropCatalog) {
    return null;
  }

  const target = normalizeText(diseaseName);

  return (
    cropCatalog.diseases.find((entry) => normalizeText(entry.name) === target) ||
    cropCatalog.diseases.find((entry) => target.includes(normalizeText(entry.name))) ||
    null
  );
}

function scoreSymptomOverlap(symptoms = [], disease) {
  if (!disease || !Array.isArray(symptoms) || !symptoms.length) {
    return 0;
  }

  const symptomText = symptoms.map(normalizeText).filter(Boolean);
  const markers = (disease.symptoms || []).map(normalizeText).filter(Boolean);

  if (!markers.length || !symptomText.length) {
    return 0;
  }

  const matches = markers.filter((marker) =>
    symptomText.some((symptom) => symptom.includes(marker) || marker.includes(symptom))
  );

  return matches.length / markers.length;
}

function buildCatalogPrompt(cropCatalog) {
  if (!cropCatalog) {
    return "";
  }

  const diseaseLines = cropCatalog.diseases
    .map(
      (disease) =>
        `- ${disease.name}: visual signs include ${disease.symptoms.join(", ")}.`
    )
    .join("\n");

  return `
Crop is likely ${cropCatalog.label}. Choose the disease only from this list when the image evidence supports it:
${diseaseLines}
If the image does not clearly match one of these, return "Needs expert review" as the likelyDisease.
Do not reuse the same disease label unless the visible symptoms truly support it.
  `.trim();
}

function applyCatalogTreatment(result, cropHint = "") {
  const cropCatalog =
    getCropCatalog(result.crop) ||
    getCropCatalog(cropHint);

  if (!cropCatalog) {
    return result;
  }

  const matchedDisease = findDiseaseByName(cropCatalog, result.likelyDisease);

  if (!matchedDisease) {
    return {
      ...result,
      reviewRecommended: true,
      confidence: Math.min(result.confidence || 0, 62),
      notes:
        "The uploaded image did not confidently match the supported disease library for this crop. Please review with an agronomist before treatment.",
    };
  }

  const symptomOverlap = scoreSymptomOverlap(result.visibleSymptoms, matchedDisease);
  const confidencePenalty = symptomOverlap >= 0.45 ? 0 : symptomOverlap >= 0.25 ? 10 : 22;
  const adjustedConfidence = Math.max(18, (result.confidence || 0) - confidencePenalty);

  return {
    ...result,
    crop: cropCatalog.label,
    likelyDisease: matchedDisease.name,
    confidence: adjustedConfidence,
    medications: matchedDisease.medications,
    immediateActions: matchedDisease.immediateActions,
    organicSupport: matchedDisease.organicSupport,
    reviewRecommended:
      result.reviewRecommended || symptomOverlap < 0.45 || adjustedConfidence < 78,
    notes:
      symptomOverlap < 0.45
        ? "The crop-specific disease match is tentative. Please confirm the symptoms in the field before spraying."
        : result.notes,
  };
}

module.exports = {
  getCropCatalog,
  buildCatalogPrompt,
  applyCatalogTreatment,
  normalizeCropName,
};
