import { Box, Grid, Typography, Paper } from "@mui/material";
import { motion } from "framer-motion";

const MotionPaper = motion(Paper);

const visuals = [
  {
    title: "Healthy Crop Canopy",
    desc: "Monitor canopy density and stress signals over the season.",
    image:
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Smart Irrigation Decisions",
    desc: "Use weather and soil data to reduce unnecessary water cycles.",
    image:
      "https://images.unsplash.com/photo-1492496913980-501348b61469?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Field Advisory Workflow",
    desc: "Turn signals into timely farm actions with simple recommendations.",
    image:
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1200&q=80",
  },
];

const AgricultureVisualSection = () => (
  <Box sx={{ mb: { xs: 4.5, md: 6 } }}>
    <Typography variant="h4" sx={{ mb: 1 }}>
      Field Visual Intelligence
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 2.6 }}>
      Visual cues and model insights together make farm decisions faster and clearer.
    </Typography>
    <Grid container spacing={2}>
      {visuals.map((item, idx) => (
        <Grid item xs={12} md={4} key={item.title}>
          <MotionPaper
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.35, delay: idx * 0.06 }}
            sx={{ overflow: "hidden", border: "1px solid #DDE4D8", bgcolor: "#FFFFFF" }}
          >
            <Box sx={{ height: 210, overflow: "hidden" }}>
              <img src={item.image} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </Box>
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ mb: 0.7 }}>
                {item.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.desc}
              </Typography>
            </Box>
          </MotionPaper>
        </Grid>
      ))}
    </Grid>
  </Box>
);

export default AgricultureVisualSection;
