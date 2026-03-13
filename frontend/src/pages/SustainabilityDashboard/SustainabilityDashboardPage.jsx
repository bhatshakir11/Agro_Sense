import React from "react";
import { Grid, Typography, Box, Chip, LinearProgress, Stack } from "@mui/material";
import Card from "../../components/common/Card";
import RadarChart from "../../components/charts/RadarChart";
import LineChart from "../../components/charts/LineChart";
import PageHero from "../../components/common/PageHero";

const radarData = [
  { category: "Soil Health", value: 82 },
  { category: "Water Use", value: 74 },
  { category: "Input Efficiency", value: 79 },
  { category: "Biodiversity", value: 68 },
  { category: "Income Stability", value: 77 },
  { category: "Community Benefit", value: 72 },
];

const trendData = [
  { month: "Jan", score: 62, target: 68 },
  { month: "Feb", score: 66, target: 69 },
  { month: "Mar", score: 70, target: 70 },
  { month: "Apr", score: 72, target: 72 },
  { month: "May", score: 76, target: 73 },
  { month: "Jun", score: 79, target: 74 },
];

const metricCards = [
  { label: "Overall Sustainability Score", value: "79/100", color: "success" },
  { label: "Water Saved This Season", value: "18.4%", color: "primary" },
  { label: "Carbon Reduction", value: "11.2 tCO2e", color: "secondary" },
  { label: "Farmer Profit Stability", value: "+14%", color: "warning" },
];

const SustainabilityDashboardPage = () => (
  <Box>
    <PageHero
      eyebrow="Sustainability Analytics"
      title="Sustainability Dashboard"
      subtitle="Track environmental, economic, and social indicators in one place with actionable season insights."
      image="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80"
      chips={["ESG-ready", "Farmer-centric", "Impact Monitoring"]}
    />

    <Card
      title="KPI Overview"
      subtitle="A quick snapshot of current sustainability outcomes."
      rightNode={<Chip label="Updated today" color="success" variant="outlined" />}
    >
      <Grid container spacing={1.5}>
        {metricCards.map((metric) => (
          <Grid item xs={12} sm={6} md={3} key={metric.label}>
            <Box sx={{ p: 1.6, border: "1px solid #DDE3D8", bgcolor: "#FAFCF8", minHeight: 105 }}>
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
        <Card title="Sustainability Radar" subtitle="Balanced performance across six impact dimensions.">
          <RadarChart data={radarData} dataKey="value" categories="category" color="#00793A" height={360} />
        </Card>
      </Grid>

      <Grid item xs={12} lg={5}>
        <Card title="Monthly Progress Trend" subtitle="Current score versus seasonal target.">
          <LineChart
            data={trendData}
            xKey="month"
            yKey="score"
            secondaryKey="target"
            yLabel="Actual Score"
            secondaryLabel="Target Score"
            color="#00793A"
            secondaryColor="#65AC1E"
            yFormatter={(value) => `${value}`}
            height={360}
          />
        </Card>
      </Grid>

      <Grid item xs={12} md={7}>
        <Card title="Resource Efficiency Breakdown">
          <Stack spacing={1.5}>
            {[
              { label: "Nitrogen use efficiency", value: 81 },
              { label: "Water efficiency", value: 74 },
              { label: "Pesticide reduction", value: 69 },
              { label: "Renewable energy usage", value: 58 },
            ].map((item) => (
              <Box key={item.label}>
                <Typography variant="body2" sx={{ mb: 0.4 }}>
                  {item.label}
                </Typography>
                <LinearProgress value={item.value} variant="determinate" color="success" sx={{ height: 9 }} />
              </Box>
            ))}
          </Stack>
        </Card>
      </Grid>

      <Grid item xs={12} md={5}>
        <Card title="Field Snapshot for Farmers">
          <img
            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1000&q=80"
            alt="Healthy crop field"
            style={{ width: "100%", height: 230, objectFit: "cover", border: "1px solid #DDE3D8", marginBottom: 12 }}
          />
          <Typography variant="body2" color="text.secondary">
            Healthy canopy and controlled irrigation indicate strong sustainability trajectory for this cycle.
          </Typography>
        </Card>
      </Grid>
    </Grid>
  </Box>
);

export default SustainabilityDashboardPage;
