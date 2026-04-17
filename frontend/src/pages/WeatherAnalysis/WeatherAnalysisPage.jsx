import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Chip,
  Stack,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Paper,
} from "@mui/material";
import {
  WbSunny,
  Opacity,
  Thunderstorm,
  Place,
  Air,
  WaterDrop,
  TrendingUp,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import PageHero from "../../components/common/PageHero";
import { getWeatherByCoordinates, getWeatherByPlace } from "../../services/weatherService";
import { getSavedWeatherLocation, setSavedWeatherLocation } from "../../utils/weatherLocationStorage";

const WeatherAnalysisPage = () => {
  const [place, setPlace] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [locationStatus, setLocationStatus] = useState("");

  const loadWeather = async (nextPlace) => {
    try {
      setLoading(true);
      setError("");
      setLocationStatus("");
      const data = await getWeatherByPlace(nextPlace);
      setWeather(data);
      setPlace(data.location.name);
      setSavedWeatherLocation({
        latitude: data.location.latitude,
        longitude: data.location.longitude,
        place: data.location.name,
      });
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Unable to fetch live weather data right now."
      );
    } finally {
      setLoading(false);
    }
  };

  const loadWeatherForCoordinates = async (nextLocation, statusMessage) => {
    try {
      setLoading(true);
      setError("");
      setLocationStatus(statusMessage || "");
      const data = await getWeatherByCoordinates(nextLocation);
      setWeather(data);
      const resolvedLocation = {
        latitude: data.location.latitude,
        longitude: data.location.longitude,
        place: data.location.name,
      };
      setPlace(data.location.name);
      setSavedWeatherLocation(resolvedLocation);
    } catch (requestError) {
      setLocationStatus("");
      setError(
        requestError.response?.data?.message || "Unable to fetch live weather data right now."
      );
    } finally {
      setLoading(false);
    }
  };

  const requestCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Location access is not supported in this browser.");
      return;
    }

    setError("");
    setLocationStatus("Detecting your location...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextLocation = {
          latitude: Number(position.coords.latitude.toFixed(4)),
          longitude: Number(position.coords.longitude.toFixed(4)),
          place: "",
        };

        loadWeatherForCoordinates(nextLocation, "Using your saved location.");
      },
      () => {
        setLocationStatus("");
        setError("We could not access your location. You can still search manually.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 600000,
      }
    );
  };

  useEffect(() => {
    const savedLocation = getSavedWeatherLocation();

    if (
      savedLocation &&
      Number.isFinite(savedLocation.latitude) &&
      Number.isFinite(savedLocation.longitude)
    ) {
      loadWeatherForCoordinates(savedLocation, "Using your saved location.");
      return;
    }

    requestCurrentLocation();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!place.trim()) return;
    loadWeather(place.trim());
  };

  const metricCards = weather
    ? [
        {
          label: "Temperature",
          value: `${weather.current.temperature}°C`,
          icon: <WbSunny sx={{ color: "#F59E0B" }} />,
        },
        {
          label: "Humidity",
          value: `${weather.current.humidity}%`,
          icon: <Opacity sx={{ color: "#2563EB" }} />,
        },
        {
          label: "Storm Risk",
          value: weather.current.stormRisk,
          icon: <Thunderstorm sx={{ color: "#7C3AED" }} />,
        },
        {
          label: "Wind Gust",
          value: `${weather.current.windGust} km/h`,
          icon: <Air sx={{ color: "#059669" }} />,
        },
      ]
    : [];

  const detailCards = weather
    ? [
        {
          label: "Rain Outlook",
          value: `${weather.forecast[0]?.rainChance || 0}%`,
          note: "Chance for today",
          icon: <WaterDrop sx={{ color: "#0EA5E9" }} />,
        },
        {
          label: "Field Condition",
          value:
            weather.current.stormRisk === "High"
              ? "Delay Spray"
              : weather.current.humidity > 75
              ? "Watch Moisture"
              : "Stable Window",
          note: "Based on current exposure",
          icon: <TrendingUp sx={{ color: "#6AAE2C" }} />,
        },
      ]
    : [];

  return (
    <Box>
      <PageHero
        eyebrow="Climate Intelligence"
        title="Weather Analysis"
        subtitle="Track live conditions, scan the next few days, and read a cleaner field-ready weather view before planning irrigation, spraying, or labor."
        chips={["Realtime Weather", "Forecast", "Field Planning"]}
      />

      <Box sx={{ maxWidth: 1280, mx: "auto" }}>
        <Paper
          component={motion.div}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          sx={{
            p: { xs: 2, md: 2.4 },
            mb: 2,
            border: "1px solid rgba(211, 224, 202, 0.95)",
            background: "linear-gradient(135deg, #FFFFFF 0%, #F7FBF3 100%)",
          }}
        >
          <Stack
            direction={{ xs: "column", lg: "row" }}
            spacing={2}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", lg: "center" }}
          >
            <Box sx={{ maxWidth: 560 }}>
              <Typography variant="h5" sx={{ mb: 0.5 }}>
                Search Location
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Enter a village, district, or city to fetch live weather for your field decisions.
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%", maxWidth: 620 }}>
              <Stack direction={{ xs: "column", md: "row" }} spacing={1.2} alignItems="stretch">
                <TextField
                  label="Place"
                  value={place}
                  onChange={(event) => setPlace(event.target.value)}
                  fullWidth
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{ minWidth: 170, bgcolor: "primary.main", "&:hover": { bgcolor: "primary.dark" } }}
                >
                  {loading ? "Loading..." : "Get Live Weather"}
                </Button>
                <Button variant="outlined" disabled={loading} onClick={requestCurrentLocation} sx={{ minWidth: 170 }}>
                  Use My Location
                </Button>
              </Stack>
              {locationStatus && (
                <Typography variant="body2" color="success.main" sx={{ mt: 1.2 }}>
                  {locationStatus}
                </Typography>
              )}
            </Box>
          </Stack>
        </Paper>

        {loading ? (
          <Paper sx={{ p: 3, border: "1px solid #DDE4D8", bgcolor: "#FFFFFF" }}>
            <Box sx={{ minHeight: 420, display: "grid", placeItems: "center" }}>
              <CircularProgress color="success" />
            </Box>
          </Paper>
        ) : error ? (
          <Paper sx={{ p: 2.4, border: "1px solid #DDE4D8", bgcolor: "#FFFFFF" }}>
            <Alert severity="error">{error}</Alert>
          </Paper>
        ) : !weather ? (
          <Paper sx={{ p: 2.4, border: "1px solid #DDE4D8", bgcolor: "#FFFFFF" }}>
            <Box sx={{ minHeight: 360, display: "grid", placeItems: "center", textAlign: "center", px: 2 }}>
              <Box>
                <Typography variant="h6" sx={{ mb: 0.6 }}>
                  Detecting your location
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  If location access is blocked, you can still search a village, district, or city manually.
                </Typography>
              </Box>
            </Box>
          </Paper>
        ) : (
          <Stack spacing={2}>
            <Paper
              component={motion.div}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              sx={{
                p: { xs: 2, md: 2.6 },
                border: "1px solid #E3EBDD",
                background:
                  "linear-gradient(135deg, rgba(14,42,26,1) 0%, rgba(19,61,35,1) 55%, rgba(38,99,56,1) 100%)",
                color: "#FFFFFF",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: -40,
                  right: -50,
                  width: 210,
                  height: 210,
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 70%)",
                }}
              />

              <Stack direction={{ xs: "column", lg: "row" }} spacing={2.4} justifyContent="space-between">
                <Box sx={{ maxWidth: 420 }}>
                  <Typography variant="overline" sx={{ color: "rgba(255,255,255,0.68)", letterSpacing: "0.08em" }}>
                    Current Location
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.8, flexWrap: "wrap" }}>
                    <Typography variant="h3" sx={{ lineHeight: 1 }}>
                      {weather.location.name}
                    </Typography>
                    <Chip
                      icon={<Place />}
                      label={weather.location.admin1 || weather.location.country || "Live"}
                      sx={{ bgcolor: "rgba(255,255,255,0.12)", color: "#FFFFFF" }}
                    />
                  </Stack>
                  <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)", mb: 1.6 }}>
                    {weather.metadata.stormRiskNote}
                  </Typography>

                  <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                    <Chip label={`${weather.current.temperature}°C now`} sx={{ bgcolor: "rgba(255,255,255,0.12)", color: "#FFFFFF" }} />
                    <Chip label={`${weather.current.humidity}% humidity`} sx={{ bgcolor: "rgba(255,255,255,0.12)", color: "#FFFFFF" }} />
                    <Chip label={`Storm ${weather.current.stormRisk}`} sx={{ bgcolor: "rgba(255,255,255,0.12)", color: "#FFFFFF" }} />
                  </Stack>
                </Box>

                <Box
                  sx={{
                    width: "100%",
                    maxWidth: 690,
                    display: "grid",
                    gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", md: "repeat(4, minmax(0, 1fr))" },
                    gap: 1.2,
                    alignSelf: "stretch",
                  }}
                >
                  {metricCards.map((item, index) => (
                    <Box
                      key={item.label}
                      component={motion.div}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08 * index }}
                      sx={{
                        p: 1.6,
                        borderRadius: "22px",
                        border: "1px solid rgba(255,255,255,0.14)",
                        bgcolor: "rgba(255,255,255,0.08)",
                        minHeight: 132,
                        backdropFilter: "blur(12px)",
                      }}
                    >
                      <Box sx={{ mb: 1 }}>{item.icon}</Box>
                      <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.74)", mb: 0.2 }}>
                        {item.label}
                      </Typography>
                      <Typography variant="h5" sx={{ lineHeight: 1.15 }}>
                        {item.value}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Stack>
            </Paper>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", xl: "minmax(0, 1.15fr) minmax(320px, 0.85fr)" },
                gap: 2,
              }}
            >
              <Paper
                component={motion.div}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
                sx={{
                  p: { xs: 2, md: 2.4 },
                  border: "1px solid #E3EBDD",
                  bgcolor: "#FFFFFF",
                  background: "linear-gradient(180deg, #FFFFFF 0%, #F9FCF6 100%)",
                }}
              >
                <Stack direction={{ xs: "column", lg: "row" }} justifyContent="space-between" spacing={2} sx={{ mb: 2.2 }}>
                  <Box sx={{ maxWidth: 520 }}>
                    <Typography variant="overline" sx={{ color: "secondary.main", letterSpacing: "0.08em" }}>
                      6-Day Forecast Board
                    </Typography>
                    <Typography variant="h4" sx={{ mb: 0.7 }}>
                      Plan the week before stepping into the field
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Temperature, rain chance, humidity, and wind gusts are laid out day by day so you can decide faster.
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                    <Chip label={`${weather.current.windGust} km/h gust`} color="success" variant="outlined" />
                    <Chip label={`${weather.forecast[0]?.rainChance || 0}% rain today`} color="warning" variant="outlined" />
                  </Stack>
                </Stack>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", md: "repeat(3, minmax(0, 1fr))" },
                    gap: 1.3,
                  }}
                >
                  {weather.forecast.map((day, index) => (
                    <Box
                      key={day.label}
                      component={motion.div}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08 * index }}
                      whileHover={{ y: -4 }}
                      sx={{
                        p: 1.6,
                        borderRadius: "24px",
                        border: index === 0 ? "1px solid #BFD8A8" : "1px solid #E0E7DA",
                        bgcolor: index === 0 ? "#F6FBF1" : "#FCFDFC",
                        minHeight: 192,
                      }}
                    >
                      <Typography variant="body2" sx={{ color: "text.secondary", mb: 0.3 }}>
                        {index === 0 ? "Today" : day.label}
                      </Typography>
                      <Typography variant="h4" sx={{ color: "#16271B", lineHeight: 1, mb: 0.6 }}>
                        {day.temperature}°
                      </Typography>
                      <Box
                        sx={{
                          height: 8,
                          borderRadius: "999px",
                          bgcolor: "#EAF0E5",
                          overflow: "hidden",
                          mb: 1.1,
                        }}
                      >
                        <Box
                          sx={{
                            width: `${day.rainChance}%`,
                            height: "100%",
                            background: "linear-gradient(90deg, #4DA3FF 0%, #8EC5FF 100%)",
                          }}
                        />
                      </Box>
                      <Stack spacing={0.8}>
                        <Typography variant="body2" color="text.secondary">
                          Rain chance:{" "}
                          <Box component="span" sx={{ color: "text.primary", fontWeight: 700 }}>
                            {day.rainChance}%
                          </Box>
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Humidity:{" "}
                          <Box component="span" sx={{ color: "text.primary", fontWeight: 700 }}>
                            {day.humidity}%
                          </Box>
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Wind gust:{" "}
                          <Box component="span" sx={{ color: "text.primary", fontWeight: 700 }}>
                            {day.windGust} km/h
                          </Box>
                        </Typography>
                      </Stack>
                    </Box>
                  ))}
                </Box>
              </Paper>

              <Stack spacing={2}>
                <Paper
                  component={motion.div}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 }}
                  sx={{
                    p: 2,
                    border: "1px solid #E3EBDD",
                    bgcolor: "#FFFFFF",
                    background: "linear-gradient(180deg, #FFFFFF 0%, #F6FBF2 100%)",
                  }}
                >
                  <Typography variant="overline" sx={{ color: "secondary.main", letterSpacing: "0.08em" }}>
                    Action Snapshot
                  </Typography>
                  <Typography variant="h5" sx={{ mb: 1.4 }}>
                    What the weather is telling you now
                  </Typography>
                  <Stack spacing={1.1}>
                    {detailCards.map((card) => (
                      <Box
                        key={card.label}
                        sx={{
                          p: 1.3,
                          borderRadius: "20px",
                          border: "1px solid #E2EADC",
                          bgcolor: "#FFFFFF",
                          display: "flex",
                          gap: 1.2,
                          alignItems: "center",
                        }}
                      >
                        <Box
                          sx={{
                            width: 42,
                            height: 42,
                            borderRadius: "14px",
                            display: "grid",
                            placeItems: "center",
                            bgcolor: "#EEF6E6",
                          }}
                        >
                          {card.icon}
                        </Box>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {card.label}
                          </Typography>
                          <Typography sx={{ fontWeight: 800 }}>{card.value}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {card.note}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </Paper>

                <Paper
                  component={motion.div}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.16 }}
                  sx={{
                    p: 2,
                    border: "1px solid #E3EBDD",
                    background:
                      "linear-gradient(160deg, rgba(16,42,26,1) 0%, rgba(24,61,39,1) 100%)",
                    color: "#FFFFFF",
                  }}
                >
                  <Typography variant="overline" sx={{ color: "rgba(255,255,255,0.72)", letterSpacing: "0.08em" }}>
                    Advisory Mood
                  </Typography>
                  <Typography variant="h5" sx={{ mb: 0.8 }}>
                    {weather.current.stormRisk === "High"
                      ? "Keep operations cautious"
                      : weather.current.humidity > 75
                      ? "Watch for moisture-sensitive work"
                      : "Good window for regular field planning"}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.75)", lineHeight: 1.8 }}>
                    {weather.metadata.stormRiskNote}
                  </Typography>
                </Paper>
              </Stack>
            </Box>
          </Stack>
        )}
      </Box>
    </Box>
  );
};

export default WeatherAnalysisPage;
