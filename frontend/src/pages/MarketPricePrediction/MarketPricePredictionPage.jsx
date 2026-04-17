import React, { useEffect, useMemo, useState } from "react";
import {
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Chip,
  Stack,
  Alert,
  Typography,
  CircularProgress,
} from "@mui/material";
import Card from "../../components/common/Card";
import LineChart from "../../components/charts/LineChart";
import PageHero from "../../components/common/PageHero";
import { getMarketOverview } from "../../services/marketService";
import { getCropMedia } from "../../data/cropMedia";

const cropOptions = [
  { value: "wheat", label: "Wheat" },
  { value: "rice", label: "Rice" },
  { value: "maize", label: "Maize" },
  { value: "cotton", label: "Cotton" },
  { value: "sugarcane", label: "Sugarcane" },
  { value: "soybean", label: "Soybean" },
  { value: "groundnut", label: "Groundnut" },
  { value: "pearl-millet", label: "Pearl Millet" },
  { value: "tomato", label: "Tomato" },
  { value: "potato", label: "Potato" },
];

const MarketPricePredictionPage = () => {
  const [crop, setCrop] = useState("wheat");
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadMarket = async () => {
      try {
        setLoading(true);
        setError("");
        const payload = await getMarketOverview(crop);

        if (!active) {
          return;
        }

        setMarketData(payload);
      } catch (requestError) {
        if (!active) {
          return;
        }

        setError(
          requestError.response?.data?.message || "Unable to fetch market data right now."
        );
        setMarketData(null);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadMarket();

    return () => {
      active = false;
    };
  }, [crop]);

  const activeVisual = useMemo(
    () => getCropMedia(marketData?.label || cropOptions.find((option) => option.value === crop)?.label || crop),
    [crop, marketData]
  );

  return (
    <Box>
      <PageHero
        eyebrow="Market Intelligence"
        title="Market Price Prediction"
        subtitle="Pull crop price data from the backend, inspect the latest mandi movement, and view a short price forecast before deciding when to sell."
        chips={["Backend Connected", "Price Forecast", "Mandi Tracking"]}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Card title="Crop Selection" subtitle="Switch crop to load current price movement and prediction.">
            <FormControl fullWidth>
              <InputLabel>Crop</InputLabel>
              <Select value={crop} label="Crop" onChange={(event) => setCrop(event.target.value)}>
                {cropOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ mt: 1.8 }}>
              {activeVisual.image ? (
                <img
                  src={activeVisual.image}
                  alt={activeVisual.alt}
                  style={{ width: "100%", height: 180, objectFit: "cover", border: "1px solid #DDE3D8", borderRadius: 18 }}
                />
              ) : (
                <Box
                  sx={{
                    height: 180,
                    border: "1px solid #DDE3D8",
                    borderRadius: "18px",
                    display: "grid",
                    placeItems: "center",
                    textAlign: "center",
                    px: 2,
                    background:
                      "radial-gradient(circle at top left, rgba(232,243,203,0.92), rgba(232,243,203,0) 32%), linear-gradient(135deg, #F8FBF5 0%, #EEF5E7 100%)",
                  }}
                >
                  <Box>
                    <Typography variant="overline" sx={{ color: "secondary.main", letterSpacing: "0.08em" }}>
                      Crop visual
                    </Typography>
                    <Typography variant="h5">
                      {marketData?.label || cropOptions.find((option) => option.value === crop)?.label}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>

            {loading ? (
              <Box sx={{ minHeight: 120, display: "grid", placeItems: "center", mt: 1.6 }}>
                <CircularProgress color="success" />
              </Box>
            ) : marketData ? (
              <Stack spacing={1.1} sx={{ mt: 1.8 }}>
                <Chip
                  label={`${marketData.market.name}, ${marketData.market.state}`}
                  color="success"
                  variant="outlined"
                />
                <Chip
                  label={
                    marketData.source.type === "live"
                      ? "Live source connected"
                      : "Fallback history in use"
                  }
                  color={marketData.source.type === "live" ? "primary" : "warning"}
                  variant="outlined"
                />
                <Typography variant="body2" color="text.secondary">
                  Latest modal price: Rs {marketData.latest.modalPrice}/{marketData.unit === "Rs/quintal" ? "quintal" : "unit"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Latest record date: {marketData.latest.date}
                </Typography>
              </Stack>
            ) : null}
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card
            title={marketData ? `${marketData.label} Price Forecast` : "Price Forecast"}
            subtitle="Actual mandi prices from the backend with predicted next steps."
            rightNode={
              marketData ? (
                <Chip
                  label={`${marketData.summary.trendPercent >= 0 ? "+" : ""}${marketData.summary.trendPercent}% trend`}
                  color={marketData.summary.trendPercent >= 0 ? "success" : "warning"}
                />
              ) : null
            }
          >
            {loading ? (
              <Box sx={{ minHeight: 320, display: "grid", placeItems: "center" }}>
                <CircularProgress color="success" />
              </Box>
            ) : marketData ? (
              <LineChart
                data={marketData.chartSeries}
                xKey="label"
                yKey="actualPrice"
                secondaryKey="predictedPrice"
                yLabel="Actual Price"
                secondaryLabel="Predicted Price"
                color="#00793A"
                secondaryColor="#F39500"
                yFormatter={(value) => (value ? `Rs ${value}` : "-")}
              />
            ) : null}
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card
            title="Market Advisory"
            subtitle={
              marketData
                ? marketData.summary.recommendation
                : "Backend market advisory will appear after the data loads."
            }
          >
            {marketData && (
              <Stack direction={{ xs: "column", md: "row" }} spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                <Chip label={`Predicted average: Rs ${marketData.summary.predictedAverage}/quintal`} color="primary" />
                <Chip label={`Demand score: ${marketData.summary.demandScore}/100`} color="secondary" />
                <Chip label={`Volatility: ${marketData.summary.volatility}`} variant="outlined" />
                {marketData.latest.arrivalTonnes ? (
                  <Chip label={`Arrivals: ${marketData.latest.arrivalTonnes} tonnes`} variant="outlined" />
                ) : null}
              </Stack>
            )}

            {marketData?.source.warning && (
              <Alert severity="info" sx={{ mt: 2 }}>
                {marketData.source.warning}
              </Alert>
            )}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MarketPricePredictionPage;
