const SAVED_LOCATION_KEY = "weather-default-location";
const WEATHER_LOCATION_UPDATED_EVENT = "weather-location-updated";

export function getSavedWeatherLocation() {
  try {
    const rawValue = localStorage.getItem(SAVED_LOCATION_KEY);
    return rawValue ? JSON.parse(rawValue) : null;
  } catch (error) {
    localStorage.removeItem(SAVED_LOCATION_KEY);
    return null;
  }
}

export function setSavedWeatherLocation(location) {
  const nextValue = JSON.stringify(location);
  const previousValue = localStorage.getItem(SAVED_LOCATION_KEY);

  if (previousValue === nextValue) {
    return;
  }

  localStorage.setItem(SAVED_LOCATION_KEY, nextValue);
  window.dispatchEvent(new CustomEvent(WEATHER_LOCATION_UPDATED_EVENT, { detail: location }));
}

export function subscribeToWeatherLocationUpdates(callback) {
  const handleCustomUpdate = (event) => {
    callback(event.detail || getSavedWeatherLocation());
  };

  const handleStorageUpdate = (event) => {
    if (event.key === SAVED_LOCATION_KEY) {
      callback(getSavedWeatherLocation());
    }
  };

  window.addEventListener(WEATHER_LOCATION_UPDATED_EVENT, handleCustomUpdate);
  window.addEventListener("storage", handleStorageUpdate);

  return () => {
    window.removeEventListener(WEATHER_LOCATION_UPDATED_EVENT, handleCustomUpdate);
    window.removeEventListener("storage", handleStorageUpdate);
  };
}

export { SAVED_LOCATION_KEY };
