import React, { useEffect, useState } from "react";
import { Typography, Tabs, Tab, Box, Paper, Stack, Alert, Button, Chip } from "@mui/material";
import { motion } from "framer-motion";
import { MyLocation, CloudUpload, EditNote, PsychologyAlt, Grass, CloudSync } from "@mui/icons-material";
import SoilUpload from "../../components/SoilUpload";
import SoilForm from "../../components/SoilForm";
import RecommendationResult from "../../components/RecommendationResult";
import PageHero from "../../components/common/PageHero";
import {
  extractSoilPdfAndRecommend,
  getCropRecommendationWithWeather,
} from "../../services/cropService";
import {
  getSavedWeatherLocation,
  setSavedWeatherLocation,
} from "../../utils/weatherLocationStorage";

const initialSoil = {
  Nitrogen: "",
  Phosphorus: "",
  Potassium: "",
  pH: "",
  "Organic Carbon": "",
};

export default function CropRecommendationPage() {
  const [mode, setMode] = useState(0);
  const [soilData, setSoilData] = useState(initialSoil);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [debugPreview, setDebugPreview] = useState("");
  const [weatherLocation, setWeatherLocation] = useState(null);
  const [weatherStatus, setWeatherStatus] = useState("");

  const saveWeatherLocation = (nextLocation, statusMessage) => {
    setWeatherLocation(nextLocation);
    setWeatherStatus(statusMessage || "");
    setSavedWeatherLocation(nextLocation);
  };

  const requestCurrentLocation = () => {
    if (!navigator.geolocation) {
      setWeatherStatus("Browser location is not available. Crop scoring will use soil data only.");
      return;
    }

    setWeatherStatus("Detecting your location for season-aware crop scoring...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        saveWeatherLocation(
          {
            latitude: Number(position.coords.latitude.toFixed(4)),
            longitude: Number(position.coords.longitude.toFixed(4)),
            place: "",
          },
          "Weather-linked crop scoring is active for your location."
        );
      },
      () => {
        setWeatherStatus("Location access was blocked. Crop scoring will use soil data only.");
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
      setWeatherLocation(savedLocation);
      setWeatherStatus("Weather-linked crop scoring is active for your saved location.");
      return;
    }

    requestCurrentLocation();
  }, []);

  const handleExtracted = async (file) => {
    setLoading(true);
    setUploadMessage("");
    setResult(null);
    setDebugPreview("");

    try {
      const response = await extractSoilPdfAndRecommend(file, weatherLocation);
      setSoilData(response.extractedSoilData);
      setResult(response.recommendation);
      setUploadMessage(
        response.usedOcr
          ? "Scanned PDF analyzed with OCR. Please review the extracted values before final use."
          : "Soil PDF analyzed successfully."
      );
    } catch (error) {
      const extractedSoilData = error.response?.data?.extractedSoilData;

      if (extractedSoilData) {
        setSoilData((previous) => ({
          ...previous,
          ...extractedSoilData,
        }));
      }

      if (error.response?.data?.debugTextPreview) {
        setDebugPreview(error.response.data.debugTextPreview);
      }

      setUploadMessage(error.response?.data?.message || "Unable to analyze the uploaded PDF.");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (data) => {
    setLoading(true);
    setResult(null);
    setSoilData(data);

    try {
      const rec = await getCropRecommendationWithWeather(data, weatherLocation);
      setResult(rec);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <PageHero
        eyebrow="AI Advisory Suite"
        title="Crop Recommendation"
        subtitle="Move from soil input to crop ranking in one flow. Upload a report or enter values manually and review crop fit, sustainability, and weather-season context together."
        image="https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1200&q=80"
        chips={["Soil-aware", "Weather-linked", "Season-aware"]}
      />

      <Box sx={{ maxWidth: 1360, mx: "auto" }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" },
            gap: 1.4,
            mb: 2,
          }}
        >
          {[
            {
              title: "Input Soil Data",
              text: "Upload a soil report or type the values directly.",
              icon: <EditNote />,
            },
            {
              title: "Blend with Weather",
              text: "The system also checks season and your saved location.",
              icon: <CloudSync />,
            },
            {
              title: "Rank the Best Crops",
              text: "Review primary crop fit, alternatives, and insights.",
              icon: <Grass />,
            },
          ].map((item, index) => (
            <Paper
              key={item.title}
              component={motion.div}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * index }}
              elevation={0}
              sx={{
                p: 1.8,
                borderRadius: "24px",
                background: "linear-gradient(180deg, #FFFFFF 0%, #F8FBF5 100%)",
              }}
            >
              <Box
                sx={{
                  width: 46,
                  height: 46,
                  borderRadius: "16px",
                  display: "grid",
                  placeItems: "center",
                  mb: 1.2,
                  bgcolor: "#ECF7E0",
                  color: "secondary.main",
                }}
              >
                {item.icon}
              </Box>
              <Typography variant="h6" sx={{ mb: 0.5 }}>
                {item.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.text}
              </Typography>
            </Paper>
          ))}
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", xl: "minmax(0, 1.08fr) minmax(380px, 0.92fr)" },
            gap: 2,
            alignItems: "start",
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 2.4,
              border: "1px solid #E3EBDD",
              background: "#FFFFFF",
            }}
            component={motion.div}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Stack direction={{ xs: "column", lg: "row" }} justifyContent="space-between" spacing={1.5} sx={{ mb: 1.8 }}>
              <Box>
                <Typography variant="h5" sx={{ mb: 0.6 }}>
                  Soil Input Workspace
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Choose your preferred input method and submit values to generate recommendation.
                </Typography>
              </Box>
              <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                <Chip icon={<EditNote />} label="Manual soil entry" variant="outlined" />
              <Chip icon={<CloudUpload />} label="PDF upload" variant="outlined" />
              </Stack>
            </Stack>

            <Alert
              severity={weatherLocation ? "success" : "warning"}
              sx={{ mb: 1.8 }}
              action={
                <Button color="inherit" size="small" startIcon={<MyLocation />} onClick={requestCurrentLocation}>
                  Use My Location
                </Button>
              }
            >
              {weatherLocation
                ? `${weatherStatus} ${weatherLocation.place || "Saved location"} will be used to check season and current weather before ranking crops.`
                : weatherStatus || "No saved location found yet. Recommendations will work, but only soil data will be used."}
            </Alert>

            <Paper
              elevation={0}
              sx={{
                p: 1.5,
                mb: 1.8,
                borderRadius: "22px",
                background: "linear-gradient(135deg, #163D27 0%, #245837 100%)",
                color: "#FFFFFF",
              }}
            >
              <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} justifyContent="space-between">
                <Box sx={{ display: "flex", gap: 1.1, alignItems: "flex-start" }}>
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: "14px",
                      display: "grid",
                      placeItems: "center",
                      bgcolor: "rgba(255,255,255,0.12)",
                    }}
                  >
                    <PsychologyAlt />
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 800, mb: 0.3 }}>
                      Smart recommendation flow
                    </Typography>
                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.75)" }}>
                      Keep the inputs simple, then let the app merge soil and weather before ranking crops.
                    </Typography>
                  </Box>
                </Box>
                <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                  <Chip label="Crop fit" sx={{ bgcolor: "rgba(255,255,255,0.12)", color: "#FFFFFF" }} />
                  <Chip label="Weather score" sx={{ bgcolor: "rgba(255,255,255,0.12)", color: "#FFFFFF" }} />
                </Stack>
              </Stack>
            </Paper>

            <Tabs
              value={mode}
              onChange={(_, value) => setMode(value)}
              sx={{
                mb: 2,
                "& .MuiTabs-flexContainer": {
                  gap: 1,
                },
                "& .MuiTab-root": {
                  minHeight: 46,
                  borderRadius: "999px",
                  border: "1px solid #D9E3D2",
                  textTransform: "none",
                  fontWeight: 700,
                },
                "& .Mui-selected": {
                  bgcolor: "#EAF5DD",
                  color: "secondary.main !important",
                },
                "& .MuiTabs-indicator": {
                  display: "none",
                },
              }}
            >
              <Tab label="Manual Entry" />
              <Tab label="Upload Soil Report" />
            </Tabs>

            {mode === 0 ? (
              <SoilForm defaultValues={soilData} onSubmit={handleFormSubmit} loading={loading} />
            ) : (
              <>
                <SoilUpload onExtracted={handleExtracted} />
                {uploadMessage && (
                  <Typography
                    variant="body2"
                    color={uploadMessage.includes("successfully") ? "success.main" : "error.main"}
                    mb={1.2}
                  >
                    {uploadMessage}
                  </Typography>
                )}
                {debugPreview && (
                  <Paper sx={{ p: 1.4, mb: 1.2, border: "1px solid #E6D6D6", bgcolor: "#FFF8F8" }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.6 }}>
                      Debug OCR/Text Preview
                    </Typography>
                    <Typography
                      component="pre"
                      variant="caption"
                      sx={{
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        m: 0,
                        color: "text.secondary",
                        fontFamily: "monospace",
                      }}
                    >
                      {debugPreview}
                    </Typography>
                  </Paper>
                )}
                {soilData.Nitrogen !== "" && (
                  <Box mt={2}>
                    <Typography variant="h6" mb={1.2}>
                      Extracted Soil Data (Editable)
                    </Typography>
                    <SoilForm defaultValues={soilData} onSubmit={handleFormSubmit} loading={loading} />
                  </Box>
                )}
              </>
            )}
          </Paper>

          <Box sx={{ width: "100%" }}>
            <RecommendationResult result={result} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
