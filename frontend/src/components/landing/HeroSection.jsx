import { Box, Typography, Button, Stack, Paper, Chip } from "@mui/material";
import { ArrowForward, AutoAwesome, BlurOn, Insights } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { lazy, Suspense } from "react";

const InteractiveFarmScene = lazy(() => import("./InteractiveFarmScene"));

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        maxWidth: 1320,
        mx: "auto",
        mb: { xs: 4, md: 6 },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.2, md: 3.4 },
          bgcolor: "transparent",
          border: "1px solid rgba(205, 221, 193, 0.9)",
          borderRadius: { xs: "26px", md: "34px" },
          overflow: "hidden",
          background:
            "radial-gradient(circle at top left, rgba(232, 243, 203, 0.9), rgba(232, 243, 203, 0) 30%), linear-gradient(180deg, #F8FBF5 0%, #EEF5E7 100%)",
          boxShadow: "0 24px 70px rgba(29, 72, 42, 0.08)",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1.02fr) minmax(420px, 0.98fr)" },
            alignItems: "center",
            gap: { xs: 2.5, md: 3.5 },
          }}
        >
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            sx={{ py: { xs: 0.5, md: 1.1 } }}
          >
            <Chip
              icon={<AutoAwesome sx={{ color: "#1E5A35 !important" }} />}
              label="Interactive AI farming workspace"
              sx={{
                mb: 2,
                px: 1,
                py: 2.2,
                borderRadius: "999px",
                bgcolor: "rgba(255,255,255,0.82)",
                border: "1px solid rgba(150, 178, 129, 0.42)",
                "& .MuiChip-label": { px: 0.8, fontWeight: 700, color: "secondary.main" },
              }}
            />

            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "2.5rem", sm: "3.2rem", lg: "4.35rem" },
                lineHeight: 1.02,
                letterSpacing: "-0.05em",
                maxWidth: 700,
                mb: 1.5,
              }}
            >
              Explore your farm decisions through a live command space.
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                maxWidth: 620,
                fontSize: { xs: "1rem", md: "1.12rem" },
                lineHeight: 1.8,
                mb: 2.4,
              }}
            >
              Soil, weather, crop fit, and market signals now feel connected. Rotate the scene,
              open a module, and move from analysis to action without a crowded dashboard.
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.4} sx={{ mb: 2.4 }}>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                onClick={() => navigate("/crop-recommendation")}
                sx={{
                  minWidth: 210,
                  py: 1.45,
                  borderRadius: "999px",
                  bgcolor: "primary.main",
                  "&:hover": { bgcolor: "primary.dark" },
                }}
              >
                Start Recommendation
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<Insights />}
                onClick={() => navigate("/weather-analysis")}
                sx={{
                  minWidth: 190,
                  py: 1.45,
                  borderRadius: "999px",
                  borderColor: "rgba(30, 90, 53, 0.2)",
                  bgcolor: "rgba(255,255,255,0.65)",
                }}
              >
                Explore Weather
              </Button>
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2} useFlexGap flexWrap="wrap">
              {[
                { icon: <BlurOn fontSize="small" />, text: "3D guided home experience" },
                { icon: <Insights fontSize="small" />, text: "Weather-aware crop scoring" },
                { icon: <AutoAwesome fontSize="small" />, text: "Farmer-friendly workflow" },
              ].map((item) => (
                <Box
                  key={item.text}
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.8,
                    px: 1.4,
                    py: 1,
                    borderRadius: "999px",
                    bgcolor: "rgba(255,255,255,0.85)",
                    border: "1px solid rgba(168, 190, 151, 0.42)",
                    color: "secondary.main",
                    fontWeight: 600,
                  }}
                >
                  {item.icon}
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {item.text}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>

          <Box
            component={motion.div}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, ease: "easeOut", delay: 0.1 }}
            sx={{ position: "relative" }}
          >
            <Suspense
              fallback={
                <Box
                  sx={{
                    width: "100%",
                    height: { xs: 320, sm: 380, md: 500 },
                    borderRadius: "28px",
                    background:
                      "radial-gradient(circle at 25% 20%, rgba(232,243,203,0.95), rgba(232,243,203,0) 28%), linear-gradient(180deg, #183C25 0%, #102A1A 100%)",
                    border: "1px solid rgba(226, 236, 216, 0.3)",
                    boxShadow: "0 30px 80px rgba(16, 42, 26, 0.22)",
                  }}
                />
              }
            >
              <InteractiveFarmScene />
            </Suspense>
            <Stack
              direction="row"
              spacing={1}
              sx={{
                position: "absolute",
                left: { xs: 16, md: 24 },
                right: { xs: 16, md: "auto" },
                bottom: { xs: 16, md: 24 },
                zIndex: 2,
                flexWrap: "wrap",
              }}
            >
              {[
                { label: "Crop Fit", value: "Live" },
                { label: "Signals", value: "4 modules" },
                { label: "Motion", value: "Interactive" },
              ].map((item) => (
                <Paper
                  key={item.label}
                  elevation={0}
                  sx={{
                    px: 1.3,
                    py: 1,
                    minWidth: 110,
                    borderRadius: "16px",
                    bgcolor: "rgba(10, 22, 14, 0.58)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    backdropFilter: "blur(14px)",
                  }}
                >
                  <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)" }}>
                    {item.label}
                  </Typography>
                  <Typography sx={{ color: "#FFFFFF", fontWeight: 800 }}>{item.value}</Typography>
                </Paper>
              ))}
            </Stack>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default HeroSection;
