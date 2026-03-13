import React, { useMemo } from "react";
import {
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Chip,
  Stack,
} from "@mui/material";
import Card from "../../components/common/Card";
import LineChart from "../../components/charts/LineChart";
import PageHero from "../../components/common/PageHero";

const cropInsights = {
  wheat: {
    label: "Wheat",
    image:
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1000&q=80",
    trend: [
      { month: "Jan", price: 2080, demand: 72 },
      { month: "Feb", price: 2140, demand: 75 },
      { month: "Mar", price: 2190, demand: 78 },
      { month: "Apr", price: 2245, demand: 81 },
      { month: "May", price: 2280, demand: 79 },
      { month: "Jun", price: 2335, demand: 84 },
    ],
    note: "Demand is stable with positive momentum before procurement season.",
  },
  rice: {
    label: "Rice",
    image:
      "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=1000&q=80",
    trend: [
      { month: "Jan", price: 2720, demand: 65 },
      { month: "Feb", price: 2685, demand: 67 },
      { month: "Mar", price: 2760, demand: 72 },
      { month: "Apr", price: 2810, demand: 74 },
      { month: "May", price: 2870, demand: 77 },
      { month: "Jun", price: 2925, demand: 80 },
    ],
    note: "Export-led demand is improving; consider staggered sale strategy.",
  },
  maize: {
    label: "Maize",
    image:
      "https://images.unsplash.com/photo-1601593768799-76d328f8f9ba?auto=format&fit=crop&w=1000&q=80",
    trend: [
      { month: "Jan", price: 1860, demand: 68 },
      { month: "Feb", price: 1910, demand: 71 },
      { month: "Mar", price: 1965, demand: 76 },
      { month: "Apr", price: 2015, demand: 79 },
      { month: "May", price: 2050, demand: 82 },
      { month: "Jun", price: 2095, demand: 85 },
    ],
    note: "Feed demand is driving upward price potential through next cycle.",
  },
};

const MarketPricePredictionPage = () => {
  const [crop, setCrop] = React.useState("wheat");
  const activeCrop = useMemo(() => cropInsights[crop], [crop]);

  const latestPrice = activeCrop.trend[activeCrop.trend.length - 1].price;
  const previousPrice = activeCrop.trend[activeCrop.trend.length - 2].price;
  const change = (((latestPrice - previousPrice) / previousPrice) * 100).toFixed(1);

  return (
    <Box>
      <PageHero
        eyebrow="Market Intelligence"
        title="Market Price Prediction"
        subtitle="Analyze crop-wise trend momentum and demand pressure to improve selling timing and income stability."
        image="https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=1200&q=80"
        chips={["Mandi Trend", "Demand Index", "Profit Advisory"]}
      />

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Card title="Crop Selection" subtitle="Switch crop to compare trend behavior and demand pressure.">
            <FormControl fullWidth>
              <InputLabel>Crop</InputLabel>
              <Select value={crop} label="Crop" onChange={(event) => setCrop(event.target.value)}>
                <MenuItem value="wheat">Wheat</MenuItem>
                <MenuItem value="rice">Rice</MenuItem>
                <MenuItem value="maize">Maize</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ mt: 1.8 }}>
              <img
                src={activeCrop.image}
                alt={activeCrop.label}
                style={{ width: "100%", height: 180, objectFit: "cover", border: "1px solid #DDE3D8" }}
              />
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card
            title={`${activeCrop.label} Price Forecast`}
            subtitle="Price and demand movement for the upcoming months."
            rightNode={<Chip label={`Trend +${change}%`} color="success" />}
          >
            <LineChart
              data={activeCrop.trend}
              xKey="month"
              yKey="price"
              secondaryKey="demand"
              yLabel="Price (Rs/quintal)"
              secondaryLabel="Demand Index"
              color="#00793A"
              secondaryColor="#F39500"
              yFormatter={(value) => `Rs ${value}`}
            />
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card title="Profit Advisory" subtitle={activeCrop.note}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
              <Chip label={`Expected Price: Rs ${latestPrice}/quintal`} color="primary" />
              <Chip label="Suggested action: phased selling over 2-3 weeks" color="secondary" />
              <Chip label="Monitor mandi arrivals every 3 days" variant="outlined" />
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MarketPricePredictionPage;
