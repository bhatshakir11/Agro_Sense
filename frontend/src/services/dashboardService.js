import api from "./api";

export async function getDashboardOverview(payload) {
  const response = await api.post(
    "/dashboard/overview",
    payload,
    {
      timeout: 20000,
    }
  );

  return response.data;
}
