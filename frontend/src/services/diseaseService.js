import api from "./api";

export async function analyzeLeafDisease({ imageData, cropHint = "" }) {
  const response = await api.post("/disease-detection", {
    imageData,
    cropHint,
  }, {
    timeout: 60000,
  });

  return response.data;
}
