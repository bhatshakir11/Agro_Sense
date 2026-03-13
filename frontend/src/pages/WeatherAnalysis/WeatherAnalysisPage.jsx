import React from "react";
import { Grid, Typography, Box, Chip, Stack } from "@mui/material";
import { WbSunny, Opacity, Thunderstorm, Place } from "@mui/icons-material";
import InputField from "../../components/forms/InputField";
import Card from "../../components/common/Card";
import LineChart from "../../components/charts/LineChart";
import PageHero from "../../components/common/PageHero";

const forecastData = [
  { date: "Mon", temperature: 29, rainChance: 22, humidity: 62 },
  { date: "Tue", temperature: 31, rainChance: 18, humidity: 58 },
  { date: "Wed", temperature: 30, rainChance: 26, humidity: 66 },
  { date: "Thu", temperature: 28, rainChance: 41, humidity: 72 },
  { date: "Fri", temperature: 27, rainChance: 55, humidity: 75 },
  { date: "Sat", temperature: 30, rainChance: 35, humidity: 63 },
];

const WeatherAnalysisPage = () => (
  <Box>
    <PageHero
      eyebrow="Climate Intelligence"
      title="Weather Analysis"
      subtitle="Track short-term weather signals, irrigation windows, and disease-prone conditions before they affect yield."
      image="https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1200&q=80"
      chips={["Forecast", "Risk Alerts", "Irrigation Planning"]}
    />

    <Card
      title="Weather Intelligence"
      subtitle="Get field-level weather trends and risk flags for better farm planning."
      rightNode={<Chip icon={<Place />} label="Nashik, MH" color="success" variant="outlined" />}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <LineChart
            data={forecastData}
            xKey="date"
            yKey="temperature"
            secondaryKey="rainChance"
            yLabel="Temperature (°C)"
            secondaryLabel="Rain Chance (%)"
            color="#00793A"
            secondaryColor="#F39500"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80"
            alt="Crop field weather"
            style={{ width: "100%", height: 320, objectFit: "cover", border: "1px solid #DDE3D8" }}
          />
        </Grid>
      </Grid>
    </Card>

    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <Card title="Location & Crop Setup">
          <InputField label="Village / District" name="location" register={() => ({})} errors={{}} required />
          <InputField label="Crop Stage" name="cropStage" register={() => ({})} errors={{}} required />
          <InputField label="Irrigation Type" name="irrigation" register={() => ({})} errors={{}} />
        </Card>
      </Grid>

      <Grid item xs={12} md={8}>
        <Card title="Daily Weather Snapshot">
          <Grid container spacing={1.5}>
            {[
              { label: "Avg Temp", value: "29°C", icon: <WbSunny color="warning" /> },
              { label: "Humidity", value: "66%", icon: <Opacity color="primary" /> },
              { label: "Storm Risk", value: "Medium", icon: <Thunderstorm color="secondary" /> },
            ].map((item) => (
              <Grid item xs={12} sm={4} key={item.label}>
                <Box sx={{ border: "1px solid #DDE3D8", p: 1.6, bgcolor: "#FAFCF8", minHeight: 110 }}>
                  <Box sx={{ mb: 1 }}>{item.icon}</Box>
                  <Typography variant="body2" color="text.secondary">
                    {item.label}
                  </Typography>
                  <Typography variant="h6">{item.value}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card title="Farmer Advisory Alerts">
          <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
            <Chip label="Irrigate before Thursday noon to reduce evaporation." color="success" />
            <Chip label="Fungal risk rises on Thu/Fri due to humidity spike." color="warning" />
            <Chip label="Avoid foliar spray during high rain probability." color="secondary" />
          </Stack>
        </Card>
      </Grid>
    </Grid>
  </Box>
);

export default WeatherAnalysisPage;
