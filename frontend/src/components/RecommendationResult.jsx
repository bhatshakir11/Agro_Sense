import React from "react";
import { Box, Card, Typography, LinearProgress, Chip, Stack, Alert, Paper } from "@mui/material";
import { motion } from "framer-motion";
import { getCropMedia } from "../data/cropMedia";

function EmptyState() {
  return (
    <Card
      elevation={0}
      sx={{
        p: 2.4,
        border: "1px solid #DDE4D8",
        bgcolor: "#FFFFFF",
        background: "linear-gradient(180deg, #FFFFFF 0%, #F9FCF6 100%)",
      }}
    >
      <Typography variant="h5" sx={{ mb: 0.8 }}>
        No recommendation yet
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 420 }}>
        Upload a soil report or enter soil values manually to see the recommended crop here.
      </Typography>
    </Card>
  );
}

export default function RecommendationResult({ result }) {
  if (!result?.primaryRecommendation) {
    return (
      <Box component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
        <EmptyState />
      </Box>
    );
  }

  const primary = result.primaryRecommendation;
  const cropMedia = getCropMedia(primary.crop);
  const weatherContext = result.weatherContext;

  return (
    <Box component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Card
        elevation={0}
        sx={{
          border: "1px solid #DDE4D8",
          bgcolor: "#FFFFFF",
          overflow: "hidden",
          background: "linear-gradient(180deg, #FFFFFF 0%, #F9FCF6 100%)",
        }}
      >
        <Box sx={{ position: "relative" }}>
          {cropMedia ? (
            cropMedia.image ? (
              <img
                src={cropMedia.image}
                alt={cropMedia.alt}
                style={{ width: "100%", height: 220, objectFit: "cover", display: "block" }}
              />
            ) : (
              <Box
                sx={{
                  width: "100%",
                  height: 220,
                  display: "grid",
                  placeItems: "center",
                  bgcolor: "#F8FBF5",
                  background:
                    "radial-gradient(circle at top left, rgba(232,243,203,0.92), rgba(232,243,203,0) 30%), linear-gradient(135deg, #F8FBF5 0%, #EEF5E7 100%)",
                }}
              >
                <Box sx={{ textAlign: "center", px: 2 }}>
                  <Typography variant="overline" sx={{ color: "secondary.main", letterSpacing: "0.08em" }}>
                    Crop visual
                  </Typography>
                  <Typography variant="h4">{primary.crop}</Typography>
                </Box>
              </Box>
            )
          ) : (
            <Box
              sx={{
                width: "100%",
                height: 220,
                display: "grid",
                placeItems: "center",
                bgcolor: "#F8FBF5",
              }}
            >
              <Typography variant="h6">{primary.crop}</Typography>
            </Box>
          )}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(180deg, rgba(9,22,14,0.08) 0%, rgba(9,22,14,0.72) 100%)",
            }}
          />
          <Box sx={{ position: "absolute", left: 18, right: 18, bottom: 18, color: "#FFFFFF" }}>
            <Stack direction="row" spacing={1} sx={{ mb: 0.9, flexWrap: "wrap" }}>
              <Chip label={`Confidence ${primary.confidence}%`} sx={{ bgcolor: "rgba(255,255,255,0.16)", color: "#FFFFFF" }} />
              <Chip label={`Season ${primary.season}`} sx={{ bgcolor: "rgba(255,255,255,0.16)", color: "#FFFFFF" }} />
            </Stack>
            <Typography variant="h4" sx={{ lineHeight: 1.05 }}>
              {primary.crop}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ p: 2.2 }}>
          <Typography variant="body2" color="text.secondary" mb={1.6}>
            {primary.notes}
          </Typography>

          {weatherContext?.warning && (
            <Alert severity="warning" sx={{ mb: 1.6 }}>
              {weatherContext.warning}
            </Alert>
          )}

          {weatherContext?.applied && primary.weatherMatch && (
            <Paper
              sx={{
                p: 1.5,
                mb: 1.6,
                border: "1px solid #E1E8DC",
                bgcolor: "#F8FBF5",
                boxShadow: "none",
                borderRadius: "20px",
              }}
            >
              <Typography variant="h6" sx={{ mb: 1 }}>
                Weather Fit
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mb: 1.1, flexWrap: "wrap", gap: 1 }}>
                <Chip label={`Weather Score ${primary.weatherMatch.score}%`} color="success" variant="outlined" />
                <Chip label={`Season ${primary.weatherMatch.season}`} variant="outlined" />
                <Chip
                  label={`${weatherContext.current.temperature} deg C | ${weatherContext.current.humidity}% humidity`}
                  variant="outlined"
                />
                <Chip label={`Storm ${weatherContext.current.stormRisk}`} variant="outlined" />
              </Stack>
              <Typography variant="body2" color="text.secondary">
                Location: {weatherContext.location.name}
              </Typography>
            </Paper>
          )}

          <Box sx={{ mb: 1.8 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Sustainability Score
            </Typography>
            <Stack spacing={1.1}>
              {["Environmental", "Economic", "Social"].map((type) => (
                <Box key={type}>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.35 }}>
                    <Typography variant="body2" fontWeight={600}>
                      {type}
                    </Typography>
                    <Typography variant="caption">{primary.scores[type]} / 100</Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={primary.scores[type]}
                    sx={{ height: 8, bgcolor: "grey.200", borderRadius: "999px" }}
                    color={type === "Environmental" ? "success" : type === "Economic" ? "primary" : "secondary"}
                  />
                </Box>
              ))}
            </Stack>
          </Box>

          <Typography variant="h6" sx={{ mb: 0.9 }}>
            Soil Match
          </Typography>
          <Stack spacing={0.9} mb={1.8}>
            {primary.insights.map((insight) => (
              <Paper
                key={insight.field}
                component={motion.div}
                whileHover={{ y: -2 }}
                sx={{
                  p: 1.2,
                  border: "1px solid #E0E6DC",
                  bgcolor: "#FAFCF8",
                  boxShadow: "none",
                  borderRadius: "18px",
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.25 }}>
                  {insight.field}: {insight.actual}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Ideal {insight.ideal} | Target {insight.range}
                </Typography>
              </Paper>
            ))}
          </Stack>

          {result.alternatives?.length > 0 && (
            <>
              <Typography variant="h6" sx={{ mb: 0.8 }}>
                Alternatives
              </Typography>
              <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                {result.alternatives.map((alternative) => (
                  <Chip
                    key={alternative.crop}
                    label={`${alternative.crop} (${alternative.confidence}%)`}
                    variant="outlined"
                  />
                ))}
              </Stack>
            </>
          )}
        </Box>
      </Card>
    </Box>
  );
}
