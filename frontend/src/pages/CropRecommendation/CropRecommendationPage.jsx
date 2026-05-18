import React, { useEffect, useState } from "react";
import { Typography, Tabs, Tab, Box, Paper, Stack, Alert, Button, Chip } from "@mui/material";
import { motion } from "framer-motion";
import { MyLocation, CloudUpload, EditNote } from "@mui/icons-material";
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
import { useAppData } from "../../context/AppDataContext";

const initialSoil = {
  Nitrogen: "",
  Phosphorus: "",
  Potassium: "",
  pH: "",
  "Organic Carbon": "",
};

export default function CropRecommendationPage() {
  const { updateCropData } = useAppData();
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

    setWeatherStatus("Detecting your location for crop scoring...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        saveWeatherLocation(
          {
            latitude: Number(position.coords.latitude.toFixed(4)),
            longitude: Number(position.coords.longitude.toFixed(4)),
            place: "",
          },
          "Weather-linked crop scoring is active."
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
      setWeatherStatus("Weather-linked crop scoring is active.");
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
      updateCropData({
        soilData: response.extractedSoilData,
        recommendation: response.recommendation,
        weatherLocation,
        inputMode: "pdf",
      });
      setUploadMessage(
        response.usedOcr
          ? "Scanned PDF analyzed with OCR. Review the extracted values before use."
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
      updateCropData({
        soilData: data,
        recommendation: rec,
        weatherLocation,
        inputMode: "manual",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <PageHero
        eyebrow="AI Advisory Suite"
        title="Crop Recommendation"
        subtitle="Enter soil values or upload a soil report to get the best crop match."
        chips={["Soil-aware", "Weather-linked"]}
      />

      <Box sx={{ maxWidth: 1360, mx: "auto" }}>
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
            <Stack
              direction={{ xs: "column", lg: "row" }}
              justifyContent="space-between"
              spacing={1.5}
              sx={{ mb: 1.8 }}
            >
              <Box>
                <Typography variant="h5" sx={{ mb: 0.4 }}>
                  Soil Input
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Choose manual entry or PDF upload.
                </Typography>
              </Box>
              <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                <Chip icon={<EditNote />} label="Manual" variant="outlined" />
                <Chip icon={<CloudUpload />} label="PDF" variant="outlined" />
              </Stack>
            </Stack>

            <Alert
              severity={weatherLocation ? "success" : "warning"}
              sx={{ mb: 1.8 }}
              action={
                <Button
                  color="inherit"
                  size="small"
                  startIcon={<MyLocation />}
                  onClick={requestCurrentLocation}
                >
                  Use My Location
                </Button>
              }
            >
              {weatherLocation
                ? `${weatherStatus} ${weatherLocation.place || "Saved location"} will be used before ranking crops.`
                : weatherStatus || "No saved location found yet. Recommendations will use soil data only."}
            </Alert>

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
                      Extracted Soil Data
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
