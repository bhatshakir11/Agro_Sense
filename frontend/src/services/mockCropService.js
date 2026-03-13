// Simulate async crop recommendation
export async function getCropRecommendation(soilData) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        crop: 'Wheat',
        confidence: 92,
        scores: {
          Environmental: 88,
          Economic: 90,
          Social: 85,
        },
      });
    }, 1200);
  });
}
