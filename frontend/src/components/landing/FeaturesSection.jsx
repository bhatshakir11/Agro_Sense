import { Box, Typography, Paper, Button, Stack } from "@mui/material";
import {
  ArrowOutward,
  Agriculture,
  CloudQueue,
  QueryStats,
  LocalHospital,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const modules = [
  {
    title: "Crop Recommendation",
    desc: "Match soil values, weather, and season with crops that fit your field.",
    route: "/crop-recommendation",
    icon: Agriculture,
    tone: "linear-gradient(135deg, rgba(106, 174, 44, 0.16), rgba(255,255,255,0.94))",
    accent: "#6AAE2C",
  },
  {
    title: "Weather Analysis",
    desc: "Track temperature, humidity, storm exposure, and rain-ready windows.",
    route: "/weather-analysis",
    icon: CloudQueue,
    tone: "linear-gradient(135deg, rgba(77, 163, 255, 0.16), rgba(255,255,255,0.94))",
    accent: "#4DA3FF",
  },
  {
    title: "Market Price Prediction",
    desc: "Read pricing momentum before you decide where and when to sell.",
    route: "/market-price-prediction",
    icon: QueryStats,
    tone: "linear-gradient(135deg, rgba(243, 149, 0, 0.16), rgba(255,255,255,0.94))",
    accent: "#F39500",
  },
  {
    title: "Disease Detection",
    desc: "Upload crop images for a quicker disease check and treatment direction.",
    route: "/disease-detection",
    icon: LocalHospital,
    tone: "linear-gradient(135deg, rgba(30, 90, 53, 0.16), rgba(255,255,255,0.94))",
    accent: "#1E5A35",
  },
];

const FeaturesSection = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ maxWidth: 1320, mx: "auto" }}>
      <Box sx={{ mb: 2.5, textAlign: { xs: "left", md: "center" } }}>
        <Typography variant="h4" sx={{ mb: 0.8 }}>
          Interactive Modules
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 720, mx: "auto" }}>
          Each module is still simple to use, but the UI now feels more alive and easier to scan.
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
          gap: { xs: 2, md: 2.4 },
        }}
      >
        {modules.map((module, index) => {
          const Icon = module.icon;

          return (
            <Paper
            key={module.title}
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
            elevation={0}
            sx={{
              p: { xs: 2.2, md: 2.6 },
              minHeight: 240,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              border: "1px solid rgba(211, 224, 202, 0.95)",
              background: module.tone,
              position: "relative",
              overflow: "hidden",
              transition: "transform 180ms ease, box-shadow 180ms ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 18px 40px rgba(24,34,27,0.08)",
              },
              "&::after": {
                content: '""',
                position: "absolute",
                inset: "auto -30px -70px auto",
                width: 180,
                height: 180,
                borderRadius: "50%",
                background: `${module.accent}18`,
              },
            }}
          >
              <Box sx={{ position: "relative", zIndex: 1 }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: "18px",
                    display: "grid",
                    placeItems: "center",
                    mb: 1.6,
                    bgcolor: "#FFFFFF",
                    color: module.accent,
                    boxShadow: "0 10px 24px rgba(24,34,27,0.08)",
                  }}
                >
                  <Icon />
                </Box>

                <Typography variant="h6" sx={{ mb: 0.8 }}>
                  {module.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 420 }}>
                  {module.desc}
                </Typography>
              </Box>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.1}
                alignItems={{ xs: "stretch", sm: "center" }}
                justifyContent="space-between"
                sx={{ mt: 2.2, position: "relative", zIndex: 1 }}
              >
                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700 }}>
                  Tap into live farm signals
                </Typography>
                <Button
                  variant="contained"
                  endIcon={<ArrowOutward />}
                  onClick={() => navigate(module.route)}
                  sx={{
                    alignSelf: { xs: "flex-start", sm: "center" },
                    borderRadius: "999px",
                    px: 2.1,
                    bgcolor: module.accent,
                    "&:hover": { bgcolor: module.accent },
                  }}
                >
                  Open Module
                </Button>
              </Stack>
            </Paper>
          );
        })}
      </Box>
    </Box>
  );
};

export default FeaturesSection;
