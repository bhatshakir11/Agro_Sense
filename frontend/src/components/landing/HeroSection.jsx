import { Box, Typography, Grid, Button, Stack, Chip, LinearProgress } from "@mui/material";
import { ArrowForward, WaterDrop, HealthAndSafety, AutoGraph, Verified } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const liveSignals = [
  { label: "Soil Moisture", value: 76, icon: <WaterDrop fontSize="small" /> },
  { label: "Crop Health", value: 84, icon: <HealthAndSafety fontSize="small" /> },
  { label: "Market Readiness", value: 71, icon: <AutoGraph fontSize="small" /> },
];

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        minHeight: { xs: 620, md: 640 },
        mb: { xs: 4.5, md: 6 },
        borderBottom: "1px solid #DCE2D7",
        display: "flex",
        alignItems: "center",
        px: { xs: 2, md: 4 },
        py: { xs: 4.5, md: 5.5 },
        backgroundImage:
          "linear-gradient(108deg, rgba(14,33,23,0.86) 0%, rgba(14,33,23,0.5) 42%, rgba(14,33,23,0.25) 100%), url('https://images.unsplash.com/photo-1492496913980-501348b61469?auto=format&fit=crop&w=1800&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Grid container spacing={3} position="relative" zIndex={2}>
        <Grid item xs={12} md={7}>
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            sx={{ color: "#FFFFFF" }}
          >
            <Chip
              icon={<Verified />}
              label="Smart Farming Platform"
              sx={{
                color: "#EAF7D9",
                borderColor: "rgba(234,247,217,0.55)",
                mb: 1.6,
                bgcolor: "rgba(9,18,14,0.3)",
              }}
              variant="outlined"
            />
            <Typography variant="h1" sx={{ mb: 1.6, maxWidth: 760, fontSize: { xs: "2.05rem", md: "3.2rem" } }}>
              Advanced decisions for crops, weather, disease, and market timing.
            </Typography>
            <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.86)", maxWidth: 700, mb: 2.6 }}>
              Built for farmers, advisors, and agri teams who need quick, reliable, and easy-to-understand insights from field data.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2}>
              <Button
                variant="contained"
                endIcon={<ArrowForward />}
                onClick={() => navigate("/crop-recommendation")}
                sx={{
                  bgcolor: "primary.main",
                  px: 2.7,
                  py: 1.05,
                  "&:hover": { bgcolor: "primary.dark" },
                }}
              >
                Start Recommendation
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate("/sustainability-dashboard")}
                sx={{
                  color: "#FFFFFF",
                  borderColor: "rgba(255,255,255,0.5)",
                  "&:hover": { borderColor: "#FFFFFF", bgcolor: "rgba(255,255,255,0.08)" },
                }}
              >
                Open Dashboard
              </Button>
            </Stack>
          </Box>
        </Grid>

        <Grid item xs={12} md={5}>
          <Box
            component={motion.div}
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            sx={{
              bgcolor: "rgba(255,255,255,0.92)",
              border: "1px solid rgba(255,255,255,0.45)",
              p: 2.2,
              backdropFilter: "blur(4px)",
            }}
          >
            <Typography variant="h6" sx={{ mb: 1.5, color: "text.primary" }}>
              Live Farm Snapshot
            </Typography>
            <Stack spacing={1.3}>
              {liveSignals.map((signal) => (
                <Box key={signal.label} sx={{ border: "1px solid #DCE4D3", p: 1.2, bgcolor: "#FFFFFF" }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, color: "secondary.main" }}>
                      {signal.icon}
                      <Typography variant="body2">{signal.label}</Typography>
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {signal.value}%
                    </Typography>
                  </Box>
                  <LinearProgress value={signal.value} variant="determinate" color="success" sx={{ height: 8 }} />
                </Box>
              ))}
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HeroSection;
