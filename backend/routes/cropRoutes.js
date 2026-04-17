const {
  getRecommendations,
  extractPdfAndRecommend,
  extractTextAndRecommend,
} = require("../controllers/cropController");

function handleCropRoutes(request, response, parsedUrl) {
  if (request.method === "POST" && parsedUrl.pathname === "/api/crop-recommendation") {
    getRecommendations(request, response);
    return true;
  }

  if (request.method === "POST" && parsedUrl.pathname === "/api/crop-recommendation/extract-pdf") {
    extractPdfAndRecommend(request, response);
    return true;
  }

  if (request.method === "POST" && parsedUrl.pathname === "/api/crop-recommendation/extract-text") {
    extractTextAndRecommend(request, response);
    return true;
  }

  return false;
}

module.exports = {
  handleCropRoutes,
};
