const { getDashboardOverview } = require("../controllers/dashboardController");

function handleDashboardRoutes(request, response, parsedUrl) {
  if (
    (request.method === "GET" || request.method === "POST") &&
    parsedUrl.pathname === "/api/dashboard/overview"
  ) {
    getDashboardOverview(request, response);
    return true;
  }

  return false;
}

module.exports = {
  handleDashboardRoutes,
};
