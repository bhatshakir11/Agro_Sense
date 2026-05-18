import React, { useEffect, useMemo, useState } from "react";
import {
  Grid,
  Typography,
  Box,
  Chip,
  LinearProgress,
  Stack,
  Alert,
  CircularProgress,
} from "@mui/material";
import Card from "../../components/common/Card";
import RadarChart from "../../components/charts/RadarChart";
import LineChart from "../../components/charts/LineChart";
import PageHero from "../../components/common/PageHero";
import { getDashboardOverview } from "../../services/dashboardService";
import { useAppData } from "../../context/AppDataContext";
import { getSavedWeatherLocation } from "../../utils/weatherLocationStorage";
import { normalizeCropCommodity } from "../../utils/cropPreference";

function formatUpdatedAt(value) {
  if (!value) {
    return "Waiting for live page activity";
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return "Synced from page activity";
  }

  return `Synced ${parsed.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  })}`;
}

const SustainabilityDashboardPage = () => {
  const { appData } = useAppData();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const weatherLocation = useMemo(
    () => appData.weather?.location || appData.crop?.weatherLocation || getSavedWeatherLocation(),
    [appData.weather, appData.crop]
  );

  const commodity = useMemo(
    () =>
      appData.market?.commodity ||
      normalizeCropCommodity(appData.crop?.recommendation?.primaryRecommendation?.crop || ""),
    [appData.market, appData.crop]
  );

  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      try {
        setError("");
        const payload = await getDashboardOverview({
          weatherLocation,
          commodity,
          crop: appData.crop,
          disease: appData.disease,
          market: appData.market,
        });

        if (!active) {
          return;
        }

        setDashboardData(payload);
      } catch (requestError) {
        if (!active) {
          return;
        }

        setDashboardData(null);
        setError(
          requestError.response?.data?.message ||
            "Unable to load the connected dashboard right now."
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    setLoading(true);
    loadDashboard();

    const intervalId = window.setInterval(loadDashboard, 45000);
    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, [
    commodity,
    appData.crop?.lastUpdated,
    appData.disease?.lastUpdated,
    appData.market?.lastUpdated,
    appData.weather?.lastUpdated,
    weatherLocation?.latitude,
    weatherLocation?.longitude,
  ]);

  const liveModules = dashboardData?.liveModules || {};
  const resourceRows = dashboardData?.resources || [];
  const syncHighlights = [
    {
      label: "Weather",
      value: liveModules.weather
        ? `${liveModules.weather.location} | ${liveModules.weather.temperature} deg C`
        : "Waiting for weather sync",
      note: formatUpdatedAt(appData.weather?.lastUpdated),
    },
    {
      label: "Crop",
      value: liveModules.crop
        ? `${liveModules.crop.crop} | ${liveModules.crop.confidence}% fit`
        : "Run a crop recommendation",
      note: formatUpdatedAt(appData.crop?.lastUpdated),
    },
    {
      label: "Market",
      value: liveModules.market
        ? `${liveModules.market.commodity} | Rs ${liveModules.market.latestPrice ?? "-"}`
        : "Open market intelligence",
      note: formatUpdatedAt(appData.market?.lastUpdated),
    },
    {
      label: "Disease",
      value: liveModules.disease
        ? `${liveModules.disease.likelyDisease} | ${liveModules.disease.confidence}%`
        : "Upload a diseased leaf image",
      note: formatUpdatedAt(appData.disease?.lastUpdated),
    },
  ];

  return (
    <Box>
      <PageHero
        eyebrow="Connected Farm Intelligence"
        title="Sustainability Dashboard"
        subtitle="This dashboard combines backend summaries with the latest results from your weather, crop, market, and disease pages so the whole app behaves like one connected workspace."
        chips={["Backend Connected", "Live Sync", "Cross-page Insights"]}
      />

      <Alert severity="info" sx={{ mb: 2 }}>
        The dashboard refreshes from the backend every 45 seconds and also reacts immediately when you use the crop, weather, market, or disease pages.
      </Alert>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading && !dashboardData ? (
        <Card title="Loading Connected Dashboard">
          <Box sx={{ minHeight: 280, display: "grid", placeItems: "center" }}>
            <CircularProgress color="success" />
          </Box>
        </Card>
      ) : !dashboardData ? (
        <Card title="Dashboard Waiting For Live Data">
          <Box
            sx={{
              minHeight: 220,
              display: "grid",
              placeItems: "center",
              textAlign: "center",
              px: 2,
            }}
          >
            <Box>
              <Typography variant="h6" sx={{ mb: 0.7 }}>
                Live dashboard data is not available yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Open the weather, crop, market, or disease pages once, then return here. The dashboard will start filling in with backend-backed summaries.
              </Typography>
            </Box>
          </Box>
        </Card>
      ) : (
        <>
          <Card
            title="Live Module Sync"
            subtitle="Every major page now feeds the dashboard with the latest module state."
            rightNode={
              <Chip
                label={`Updated ${new Date(dashboardData.generatedAt).toLocaleTimeString("en-IN", {
                  hour: "numeric",
                  minute: "2-digit",
                })}`}
                color="success"
                variant="outlined"
              />
            }
          >
            <Grid container spacing={1.5}>
              {syncHighlights.map((item) => (
                <Grid item xs={12} sm={6} lg={3} key={item.label}>
                  <Box
                    sx={{
                      p: 1.7,
                      border: "1px solid #DDE3D8",
                      bgcolor: "#FAFCF8",
                      minHeight: 122,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.7 }}>
                      {item.label}
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 0.6 }}>
                      {item.value}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.note}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Card>

          <Card
            title="KPI Overview"
            subtitle="This snapshot is computed by the backend from live weather and market inputs plus your latest crop and disease activity."
          >
            <Grid container spacing={1.5}>
              {dashboardData.kpis.map((metric) => (
                <Grid item xs={12} sm={6} md={3} key={metric.label}>
                  <Box
                    sx={{
                      p: 1.6,
                      border: "1px solid #DDE3D8",
                      bgcolor: "#FAFCF8",
                      minHeight: 105,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.6 }}>
                      {metric.label}
                    </Typography>
                    <Typography variant="h5" color={`${metric.color}.main`}>
                      {metric.value}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Card>

          <Grid container spacing={2}>
            <Grid item xs={12} lg={7}>
              <Card
                title="Connected Impact Radar"
                subtitle="Crop fit, weather stability, market timing, and disease pressure all contribute to the live radar."
              >
                <RadarChart
                  data={dashboardData.radar}
                  dataKey="value"
                  categories="category"
                  color="#00793A"
                  height={360}
                />
              </Card>
            </Grid>

            <Grid item xs={12} lg={5}>
              <Card
                title="Progress Trend"
                subtitle="Backend-generated trend line combining current app signals into a rolling field score."
              >
                <LineChart
                  data={dashboardData.trend}
                  xKey="month"
                  yKey="score"
                  secondaryKey="target"
                  yLabel="Field Score"
                  secondaryLabel="Target"
                  color="#00793A"
                  secondaryColor="#65AC1E"
                  yFormatter={(value) => `${value}`}
                  height={360}
                />
              </Card>
            </Grid>

            <Grid item xs={12} md={7}>
              <Card title="Operational Readiness Breakdown">
                <Stack spacing={1.5}>
                  {resourceRows.map((item) => (
                    <Box key={item.label}>
                      <Typography variant="body2" sx={{ mb: 0.4 }}>
                        {item.label}
                      </Typography>
                      <LinearProgress
                        value={item.value}
                        variant="determinate"
                        color="success"
                        sx={{ height: 9 }}
                      />
                    </Box>
                  ))}
                </Stack>
              </Card>
            </Grid>

            <Grid item xs={12} md={5}>
              <Card title="Live Backend Summary">
                <Stack spacing={1.1}>
                  {dashboardData.weather ? (
                    <Box sx={{ p: 1.3, border: "1px solid #DDE3D8", bgcolor: "#FFFFFF" }}>
                      <Typography variant="body2" color="text.secondary">
                        Weather focus
                      </Typography>
                      <Typography variant="h6">
                        {dashboardData.weather.location.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {dashboardData.weather.current.temperature} deg C,{" "}
                        {dashboardData.weather.current.humidity}% humidity, storm risk{" "}
                        {dashboardData.weather.current.stormRisk}
                      </Typography>
                    </Box>
                  ) : null}

                  {dashboardData.market ? (
                    <Box sx={{ p: 1.3, border: "1px solid #DDE3D8", bgcolor: "#FFFFFF" }}>
                      <Typography variant="body2" color="text.secondary">
                        Market focus
                      </Typography>
                      <Typography variant="h6">
                        {dashboardData.market.label} at {dashboardData.market.market.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Latest modal price Rs {dashboardData.market.latest.modalPrice} with{" "}
                        {dashboardData.market.summary.latestChangePercent >= 0 ? "+" : ""}
                        {dashboardData.market.summary.latestChangePercent}% trend.
                      </Typography>
                    </Box>
                  ) : null}

                  {liveModules.crop ? (
                    <Box sx={{ p: 1.3, border: "1px solid #DDE3D8", bgcolor: "#FFFFFF" }}>
                      <Typography variant="body2" color="text.secondary">
                        Crop recommendation
                      </Typography>
                      <Typography variant="h6">{liveModules.crop.crop}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Confidence {liveModules.crop.confidence}% for the current workflow.
                      </Typography>
                    </Box>
                  ) : null}

                  {liveModules.disease ? (
                    <Box sx={{ p: 1.3, border: "1px solid #DDE3D8", bgcolor: "#FFFFFF" }}>
                      <Typography variant="body2" color="text.secondary">
                        Disease analysis
                      </Typography>
                      <Typography variant="h6">{liveModules.disease.likelyDisease}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Severity {liveModules.disease.severity}, confidence {liveModules.disease.confidence}%.
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Upload a diseased leaf image to bring plant-health status into this dashboard.
                    </Typography>
                  )}
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default SustainabilityDashboardPage;
