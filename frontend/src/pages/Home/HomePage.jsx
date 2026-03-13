import { Box } from "@mui/material";
import HeroSection from "../../components/landing/HeroSection";
import FeaturesSection from "../../components/landing/FeaturesSection";
import ImpactSection from "../../components/landing/ImpactSection";
import AgricultureVisualSection from "../../components/landing/AgricultureVisualSection";
import WhyChooseUsSection from "../../components/landing/WhyChooseUsSection";

const HomePage = () => (
  <Box
    sx={{
      color: "text.primary",
      background:
        "radial-gradient(circle at 85% 12%, rgba(101,172,30,0.13) 0%, rgba(101,172,30,0) 38%), radial-gradient(circle at 12% 36%, rgba(0,121,58,0.12) 0%, rgba(0,121,58,0) 42%), #F2F2F5",
    }}
  >
    <HeroSection />
    <FeaturesSection />
    <AgricultureVisualSection />
    <ImpactSection />
    <WhyChooseUsSection />
  </Box>
);

export default HomePage;
