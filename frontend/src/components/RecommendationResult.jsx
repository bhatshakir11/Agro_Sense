import React from "react";
import { Box, Card, Typography, LinearProgress, Chip, Stack, Alert, Paper } from "@mui/material";
import { motion } from "framer-motion";
import { AutoAwesome, Agriculture, Thermostat, WaterDrop } from "@mui/icons-material";
import { getCropMedia } from "../data/cropMedia";

function EmptyState() {
  return (
    <Card
      elevation={0}
      sx={{
        p: 2.4,
        border: "1px solid #DDE4D8",
        bgcolor: "#FFFFFF",
        overflow: "hidden",
        position: "relative",
        background: "linear-gradient(180deg, #FFFFFF 0%, #F9FCF6 100%)",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: -30,
          right: -20,
          width: 160,
          height: 160,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(101,172,30,0.18) 0%, rgba(101,172,30,0) 68%)",
        }}
      />
      <Stack spacing={1.8} sx={{ position: "relative", zIndex: 1 }}>
        <Chip
          icon={<AutoAwesome />}
          label="Recommendation Panel"
          sx={{ alignSelf: "flex-start", bgcolor: "#EFF8E3", color: "secondary.main" }}
        />
        <Box>
          <Typography variant="h5" sx={{ mb: 0.8 }}>
            Waiting for soil analysis
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 420 }}>
            Upload a soil report or enter soil values manually to unlock crop ranking, weather fit,
            and nutrient-based guidance.
          </Typography>
        </Box>

        <Stack spacing={1.1}>
          {[
            {
              icon: <Agriculture fontSize="small" />,
              text: "Get a primary crop recommendation with alternatives.",
            },
            {
              icon: <Thermostat fontSize="small" />,
              text: "See how current weather and season affect crop fit.",
            },
            {
              icon: <WaterDrop fontSize="small" />,
              text: "Review nutrient match insights before sowing.",
            },
          ].map((item) => (
            <Paper
              key={item.text}
              sx={{
                p: 1.3,
                border: "1px solid #E3EAD9",
                bgcolor: "#FAFCF8",
                display: "flex",
                gap: 1.1,
                alignItems: "center",
                boxShadow: "none",
                borderRadius: "18px",
              }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "12px",
                  display: "grid",
                  placeItems: "center",
                  bgcolor: "#EAF5DD",
                  color: "secondary.main",
                  flexShrink: 0,
                }}
              >
                {item.icon}
              </Box>
              <Typography variant="body2" color="text.secondary">
                {item.text}
              </Typography>
            </Paper>
          ))}
        </Stack>
      </Stack>
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
                Weather and Season Fit
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mb: 1.1, flexWrap: "wrap", gap: 1 }}>
                <Chip label={`Weather Score ${primary.weatherMatch.score}%`} color="success" variant="outlined" />
                <Chip label={`Season ${primary.weatherMatch.season}`} variant="outlined" />
                <Chip
                  label={`${weatherContext.current.temperature}°C | ${weatherContext.current.humidity}% humidity`}
                  variant="outlined"
                />
                <Chip label={`Storm ${weatherContext.current.stormRisk}`} variant="outlined" />
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Location: {weatherContext.location.name}
              </Typography>
              <Stack spacing={0.8}>
                {primary.weatherMatch.insights.map((insight) => (
                  <Typography key={insight} variant="body2" color="text.secondary">
                    {insight}
                  </Typography>
                ))}
              </Stack>
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
            Soil Match Insights
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
                  {insight.field}: {insight.actual} (ideal {insight.ideal}, target {insight.range})
                </Typography>
                <Typography
                  variant="caption"
                  color={insight.status === "attention" ? "error.main" : "text.secondary"}
                >
                  {insight.status === "good"
                    ? "Strong match for this crop."
                    : insight.status === "fair"
                    ? "Usable, but nutrient balance can be improved."
                    : "Outside the preferred range for this crop."}
                </Typography>
              </Paper>
            ))}
          </Stack>

          {result.alternatives?.length > 0 && (
            <>
              <Typography variant="h6" sx={{ mb: 0.8 }}>
                Alternative Crops
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
