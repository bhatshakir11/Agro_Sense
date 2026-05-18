const { analyzeDisease } = require("../controllers/diseaseController");

function handleDiseaseRoutes(request, response, parsedUrl) {
  if (request.method === "POST" && parsedUrl.pathname === "/api/disease-detection") {
    analyzeDisease(request, response);
    return true;
  }

  return false;
}

module.exports = {
  handleDiseaseRoutes,
};
