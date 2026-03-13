import { Box, Typography, Grid, Paper, Button, Chip, Stack } from "@mui/material";
import { ArrowOutward } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const MotionPaper = motion(Paper);

const modules = [
  {
    title: "Crop Recommendation",
    desc: "AI matches your soil profile and nutrients with high-performing crops for the season.",
    route: "/crop-recommendation",
    image:
      "https://images.unsplash.com/photo-1592982537447-6f2a6a0b5e5f?auto=format&fit=crop&w=1200&q=80",
    tags: ["Soil", "Yield", "Planning"],
  },
  {
    title: "Weather Analysis",
    desc: "Track rainfall probability, humidity trends, and irrigation-friendly windows.",
    route: "/weather-analysis",
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
    tags: ["Forecast", "Risk", "Irrigation"],
  },
  {
    title: "Market Price Prediction",
    desc: "Compare mandi trends and demand momentum to optimize selling strategy.",
    route: "/market-price-prediction",
    image:
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1200&q=80",
    tags: ["Prices", "Demand", "Profit"],
  },
  {
    title: "Disease Detection",
    desc: "Upload leaf images for fast disease detection and treatment suggestions.",
    route: "/disease-detection",
    image:
      "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=1200&q=80",
    tags: ["Vision AI", "Health", "Medicine"],
  },
];

const FeaturesSection = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ mb: { xs: 4.5, md: 6 }, px: { xs: 1, md: 0 } }}>
      <Typography variant="h4" sx={{ mb: 1 }}>
        Smart Modules Built for Farmers
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2.6, maxWidth: 760 }}>
        Every module is designed as a practical action tool, not just a dashboard card.
      </Typography>
      <Grid container spacing={2}>
        {modules.map((module, idx) => (
          <Grid item xs={12} md={6} key={module.title}>
            <MotionPaper
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              whileHover={{ y: -5 }}
              sx={{
                overflow: "hidden",
                bgcolor: "#FFFFFF",
                border: "1px solid #DDE4D8",
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box sx={{ position: "relative", height: 188 }}>
                <img
                  src={module.image}
                  alt={module.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(180deg, rgba(8,16,12,0.05) 0%, rgba(8,16,12,0.6) 100%)",
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{ position: "absolute", left: 14, bottom: 12, color: "#FFFFFF", textShadow: "0 2px 6px rgba(0,0,0,0.35)" }}
                >
                  {module.title}
                </Typography>
              </Box>
              <Box sx={{ p: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.4 }}>
                  {module.desc}
                </Typography>
                <Stack direction="row" spacing={0.8} sx={{ mb: 1.4, flexWrap: "wrap" }}>
                  {module.tags.map((tag) => (
                    <Chip key={tag} label={tag} size="small" variant="outlined" />
                  ))}
                </Stack>
                <Button endIcon={<ArrowOutward />} onClick={() => navigate(module.route)} sx={{ px: 0, color: "secondary.main" }}>
                  Open module
                </Button>
              </Box>
            </MotionPaper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FeaturesSection;
