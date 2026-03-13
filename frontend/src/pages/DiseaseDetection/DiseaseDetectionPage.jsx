import React, { useEffect, useState } from "react";
import { Grid, Typography, Button, Box, Chip, LinearProgress, Stack } from "@mui/material";
import { CloudUpload, LocalFlorist } from "@mui/icons-material";
import Card from "../../components/common/Card";
import PageHero from "../../components/common/PageHero";

const sampleDiseases = [
  { name: "Leaf Blight", severity: 62, color: "warning", action: "Spray copper-based fungicide in evening hours." },
  { name: "Powdery Mildew", severity: 38, color: "info", action: "Improve airflow and avoid overhead irrigation." },
];

const DiseaseDetectionPage = () => {
  const [preview, setPreview] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  };

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <Box>
      <PageHero
        eyebrow="Plant Health AI"
        title="Disease Detection"
        subtitle="Upload crop leaf photos for quick diagnosis, severity estimation, and practical treatment recommendations."
        image="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1200&q=80"
        chips={["Image Diagnosis", "Severity Scoring", "Treatment Guidance"]}
      />

      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          <Card title="Upload Crop Image" subtitle="Capture a close leaf image in natural light for better prediction.">
            <Button variant="contained" component="label" startIcon={<CloudUpload />} sx={{ mb: 1.6 }}>
              Upload Image
              <input type="file" accept="image/*" hidden onChange={handleImageChange} />
            </Button>

            <Box
              sx={{
                border: "1px dashed #9AB893",
                p: 1,
                bgcolor: "#F8FBF5",
                minHeight: 260,
                display: "grid",
                placeItems: "center",
              }}
            >
              {preview ? (
                <img src={preview} alt="Uploaded crop leaf" style={{ width: "100%", maxHeight: 420, objectFit: "cover" }} />
              ) : (
                <img
                  src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1200&q=80"
                  alt="Plant sample reference"
                  style={{ width: "100%", maxHeight: 420, objectFit: "cover" }}
                />
              )}
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card
            title="Detection Summary"
            subtitle="AI identifies likely diseases and urgency level."
            rightNode={<Chip icon={<LocalFlorist />} label="Model confidence 91%" color="success" />}
          >
            <Stack spacing={1.2}>
              {sampleDiseases.map((disease) => (
                <Box key={disease.name} sx={{ border: "1px solid #DDE3D8", p: 1.2, bgcolor: "#FFFFFF" }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.6 }}>
                    <Typography variant="body1" sx={{ fontWeight: 700 }}>
                      {disease.name}
                    </Typography>
                    <Chip size="small" label={`${disease.severity}%`} color={disease.color} />
                  </Box>
                  <LinearProgress variant="determinate" value={disease.severity} color={disease.color} sx={{ height: 8, mb: 0.7 }} />
                  <Typography variant="body2" color="text.secondary">
                    {disease.action}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Card>

          <Card title="Medicine Recommendation">
            <Stack spacing={1}>
              <Chip label="Mancozeb 75% WP - preventive spray" color="primary" />
              <Chip label="Copper oxychloride - curative window: 3 days" color="secondary" />
              <Chip label="Repeat observation after 5 days" variant="outlined" />
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DiseaseDetectionPage;
