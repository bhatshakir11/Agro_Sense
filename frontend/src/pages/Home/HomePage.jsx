import { Box } from "@mui/material";
import HeroSection from "../../components/landing/HeroSection";
import FeaturesSection from "../../components/landing/FeaturesSection";

const HomePage = () => (
  <Box
    sx={{
      color: "text.primary",
      background:
        "radial-gradient(circle at top, rgba(232,243,203,0.7), rgba(232,243,203,0) 24%), linear-gradient(180deg, #F6F9F2 0%, #F2F6EE 100%)",
      px: { xs: 2, md: 3 },
      pt: { xs: 2, md: 3 },
      pb: { xs: 5, md: 6 },
    }}
  >
    <HeroSection />
    <FeaturesSection />
  </Box>
);

export default HomePage;
