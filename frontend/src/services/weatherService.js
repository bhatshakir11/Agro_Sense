import api from "./api";

export async function getWeatherByPlace(place) {
  const response = await api.get("/weather", {
    params: { place },
  });

  return response.data;
}

export async function getWeatherByCoordinates({ latitude, longitude, place = "Your Location" }) {
  const response = await api.get("/weather", {
    params: { latitude, longitude, place },
  });

  return response.data;
}
