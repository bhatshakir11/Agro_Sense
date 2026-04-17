import api from "./api";

export async function getMarketOverview(commodity) {
  const response = await api.get("/market-prices", {
    params: { commodity },
  });

  return response.data;
}
