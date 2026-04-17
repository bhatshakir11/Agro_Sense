import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import FeatureLayout from "./components/layout/FeatureLayout";
import HomePage from "./pages/Home/HomePage";
import CropRecommendationPage from "./pages/CropRecommendation/CropRecommendationPage";
import WeatherAnalysisPage from "./pages/WeatherAnalysis/WeatherAnalysisPage";
import MarketPricePredictionPage from "./pages/MarketPricePrediction/MarketPricePredictionPage";
import DiseaseDetectionPage from "./pages/DiseaseDetection/DiseaseDetectionPage";
import SustainabilityDashboardPage from "./pages/SustainabilityDashboard/SustainabilityDashboardPage";
import FeatureDetail from "./pages/FeatureDetail/FeatureDetail";
import ScrollToTop from "./components/common/ScrollToTop";

const AppRoutes = () => (
  <BrowserRouter>
    <ScrollToTop />
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/crop-recommendation" element={<CropRecommendationPage />} />
        <Route path="/weather-analysis" element={<WeatherAnalysisPage />} />
        <Route path="/market-price-prediction" element={<MarketPricePredictionPage />} />
        <Route path="/disease-detection" element={<DiseaseDetectionPage />} />
        <Route path="/sustainability-dashboard" element={<SustainabilityDashboardPage />} />
      </Route>
      <Route element={<FeatureLayout />}>
        <Route path="/features/:featureName" element={<FeatureDetail />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
