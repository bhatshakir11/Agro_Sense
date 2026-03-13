import React, { useState, useEffect } from "react";
import { Grid, Typography, Tabs, Tab, Box, Paper, Chip, Stack } from "@mui/material";
import { motion } from "framer-motion";
import SoilUpload from "../../components/SoilUpload";
import SoilForm from "../../components/SoilForm";
import RecommendationResult from "../../components/RecommendationResult";
import PageHero from "../../components/common/PageHero";
import { getCropRecommendation } from "../../services/mockCropService";

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

  useEffect(() => {
    setResult(null);
  }, [soilData]);

  const handleExtracted = (data) => setSoilData(data);

  const handleFormSubmit = async (data) => {
    setLoading(true);
    setSoilData(data);
    const rec = await getCropRecommendation(data);
    setResult(rec);
    setLoading(false);
  };

  return (
    <Box>
      <PageHero
        eyebrow="AI Advisory Suite"
        title="Crop Recommendation"
        subtitle="Input soil metrics manually or upload a soil report to receive crop suggestions with confidence and sustainability scoring."
        image="https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1200&q=80"
        chips={["Soil-aware", "Yield-focused", "Sustainability-ready"]}
      />

      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          <Paper
            elevation={0}
            sx={{ p: 2.4, bgcolor: "background.paper", border: "1px solid #DDE4D8" }}
            component={motion.div}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Typography variant="h5" sx={{ mb: 0.6 }}>
              Soil Input Workspace
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.8 }}>
              Choose your preferred input method and submit values to run recommendation.
            </Typography>
            <Tabs value={mode} onChange={(_, value) => setMode(value)} sx={{ mb: 2 }}>
              <Tab label="Manual Entry" />
              <Tab label="Upload Soil Report" />
            </Tabs>

            {mode === 0 ? (
              <SoilForm defaultValues={soilData} onSubmit={handleFormSubmit} loading={loading} />
            ) : (
              <>
                <SoilUpload onExtracted={handleExtracted} />
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
        </Grid>

        <Grid item xs={12} md={5}>
          <RecommendationResult result={result} />
          <Paper sx={{ mt: 2, p: 1.8, border: "1px solid #DDE4D8", bgcolor: "#FFFFFF" }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Quick Tips
            </Typography>
            <Stack spacing={0.8}>
              <Chip label="Use recent soil test values for better accuracy." color="success" />
              <Chip label="Update pH and organic carbon every season." color="primary" />
              <Chip label="Cross-check with local weather before sowing." color="secondary" />
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
