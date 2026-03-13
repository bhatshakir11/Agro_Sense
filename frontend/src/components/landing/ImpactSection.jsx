import { useEffect, useState } from "react";
import { Box, Grid, Typography, Paper, LinearProgress, Stack } from "@mui/material";
import { motion } from "framer-motion";

const MotionPaper = motion(Paper);

const metrics = [
  { label: "Farmers onboarded", value: 5200, suffix: "+", progress: 82 },
  { label: "Average yield increase", value: 18, suffix: "%", progress: 74 },
  { label: "Water usage reduced", value: 22, suffix: "%", progress: 69 },
];

const AnimatedNumber = ({ target, suffix }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const start = performance.now();
    let frame;

    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      setCount(Math.floor(target * p));
      if (p < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target]);

  return (
    <Typography variant="h3" sx={{ fontSize: { xs: "1.8rem", md: "2.1rem" } }}>
      {count.toLocaleString()}
      {suffix}
    </Typography>
  );
};

const ImpactSection = () => (
  <Box sx={{ mb: { xs: 4.5, md: 6 } }}>
    <Typography variant="h4" sx={{ mb: 1 }}>
      Real Impact on the Ground
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 2.6, maxWidth: 700 }}>
      Measurable outcomes from day-to-day advisory adoption across crop, weather, and sustainability decisions.
    </Typography>

    <Grid container spacing={2}>
      {metrics.map((metric, idx) => (
        <Grid item xs={12} md={4} key={metric.label}>
          <MotionPaper
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            sx={{
              p: 2.1,
              bgcolor: "#FFFFFF",
              border: "1px solid #DDE4D8",
            }}
          >
            <AnimatedNumber target={metric.value} suffix={metric.suffix} />
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.2 }}>
              {metric.label}
            </Typography>
            <LinearProgress value={metric.progress} variant="determinate" color="success" sx={{ height: 8 }} />
          </MotionPaper>
        </Grid>
      ))}
    </Grid>

    <Paper sx={{ mt: 2, p: 2.2, border: "1px solid #DDE4D8", bgcolor: "#FFFFFF" }}>
      <Typography variant="h6" sx={{ mb: 1.2 }}>
        Current Season Highlights
      </Typography>
      <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
        <Box sx={{ flex: 1, p: 1.3, bgcolor: "#F9FCF6", border: "1px solid #E3EAD9" }}>
          <Typography variant="body2" color="text.secondary">
            Disease alert response time
          </Typography>
          <Typography variant="h6">-34% faster</Typography>
        </Box>
        <Box sx={{ flex: 1, p: 1.3, bgcolor: "#F9FCF6", border: "1px solid #E3EAD9" }}>
          <Typography variant="body2" color="text.secondary">
            Weather-based irrigation planning
          </Typography>
          <Typography variant="h6">+19% efficiency</Typography>
        </Box>
        <Box sx={{ flex: 1, p: 1.3, bgcolor: "#F9FCF6", border: "1px solid #E3EAD9" }}>
          <Typography variant="body2" color="text.secondary">
            Market timing accuracy
          </Typography>
          <Typography variant="h6">87% reliable</Typography>
        </Box>
      </Stack>
    </Paper>
  </Box>
);

export default ImpactSection;
