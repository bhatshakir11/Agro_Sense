import React from "react";
import { Box, Card, Typography, Grid, LinearProgress, Chip } from "@mui/material";
import { motion } from "framer-motion";

const cropImages = {
  Wheat:
    "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1000&q=80",
  Rice:
    "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=1000&q=80",
  Maize:
    "https://images.unsplash.com/photo-1601593768799-76d328f8f9ba?auto=format&fit=crop&w=1000&q=80",
};

export default function RecommendationResult({ result }) {
  if (!result) return null;

  return (
    <Box component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Card elevation={0} sx={{ p: 2.4, bgcolor: "background.paper", border: "1px solid #DDE4D8" }}>
        <Typography variant="h5" fontWeight={700} mb={1.2}>
          Recommended Crop
        </Typography>
        <img
          src={cropImages[result.crop] || cropImages.Wheat}
          alt={result.crop}
          style={{ width: "100%", height: 180, objectFit: "cover", border: "1px solid #DDE3D8", marginBottom: 12 }}
        />
        <Typography variant="h4" color="success.main" fontWeight={700} mb={1.3}>
          {result.crop}
        </Typography>
        <Typography variant="body1" mb={1.2}>
          Confidence: <Chip label={`${result.confidence}%`} color="primary" />
        </Typography>
        <Typography variant="body2" mb={1.2}>
          Sustainability Score:
        </Typography>
        <Grid container spacing={1.2}>
          {["Environmental", "Economic", "Social"].map((type) => (
            <Grid item xs={12} key={type}>
              <Typography variant="body2" fontWeight={600}>
                {type}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={result.scores[type]}
                sx={{ height: 8, mb: 0.4, bgcolor: "grey.200" }}
                color={type === "Environmental" ? "success" : type === "Economic" ? "primary" : "secondary"}
              />
              <Typography variant="caption">{result.scores[type]} / 100</Typography>
            </Grid>
          ))}
        </Grid>
      </Card>
    </Box>
  );
}
