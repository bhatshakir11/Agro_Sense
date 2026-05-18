import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const APP_DATA_STORAGE_KEY = "agroassist-live-data";
const defaultState = {
  weather: null,
  crop: null,
  market: null,
  disease: null,
};

const AppDataContext = createContext({
  appData: defaultState,
  updateWeatherData: () => {},
  updateCropData: () => {},
  updateMarketData: () => {},
  updateDiseaseData: () => {},
});

function loadInitialState() {
  try {
    const raw = localStorage.getItem(APP_DATA_STORAGE_KEY);
    return raw ? { ...defaultState, ...JSON.parse(raw) } : defaultState;
  } catch (error) {
    localStorage.removeItem(APP_DATA_STORAGE_KEY);
    return defaultState;
  }
}

export function AppDataProvider({ children }) {
  const [appData, setAppData] = useState(loadInitialState);

  useEffect(() => {
    localStorage.setItem(APP_DATA_STORAGE_KEY, JSON.stringify(appData));
  }, [appData]);

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key !== APP_DATA_STORAGE_KEY || !event.newValue) {
        return;
      }

      try {
        setAppData({ ...defaultState, ...JSON.parse(event.newValue) });
      } catch (error) {
        localStorage.removeItem(APP_DATA_STORAGE_KEY);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const updateModule = (moduleName, payload) => {
    setAppData((previous) => ({
      ...previous,
      [moduleName]: {
        ...payload,
        lastUpdated: new Date().toISOString(),
      },
    }));
  };

  const value = useMemo(
    () => ({
      appData,
      updateWeatherData: (payload) => updateModule("weather", payload),
      updateCropData: (payload) => updateModule("crop", payload),
      updateMarketData: (payload) => updateModule("market", payload),
      updateDiseaseData: (payload) => updateModule("disease", payload),
    }),
    [appData]
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  return useContext(AppDataContext);
}
