import { useParams, useNavigate } from "react-router-dom";
import { featureDetails } from "../../data/featureDetails";
import { Box, Typography, Button, Grid, Paper, Chip } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { motion } from "framer-motion";
import PageHero from "../../components/common/PageHero";

const MotionPaper = motion(Paper);

const featureImages = {
  "ai-driven":
    "https://images.unsplash.com/photo-1518773553398-650c184e0bb3?auto=format&fit=crop&w=1200&q=80",
  "data-backed":
    "https://images.unsplash.com/photo-1551281044-8a88bdbdfe0f?auto=format&fit=crop&w=1200&q=80",
  "govt-data-integration":
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
  "farmer-friendly":
    "https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?auto=format&fit=crop&w=1200&q=80",
};

export default function FeatureDetail() {
  const { featureName } = useParams();
  const navigate = useNavigate();
  const data = featureDetails[featureName];

  if (!data) {
    return (
      <Box p={4} textAlign="center">
        <Typography variant="h4">Feature Not Found</Typography>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate(-1)}>
          Back
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <PageHero
        eyebrow="Feature Insight"
        title={data.hero.heading}
        subtitle={data.hero.subheading}
        image={featureImages[featureName] || featureImages["ai-driven"]}
        chips={[data.title, "Advanced Module"]}
      />

      <MotionPaper
        elevation={0}
        sx={{ p: 2.4, mb: 2, border: "1px solid #DDE4D8", bgcolor: "#FFFFFF" }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Typography variant="h5" fontWeight={700} mb={1.4}>
          How it Works
        </Typography>
        <Box component="ul" sx={{ pl: 2.2, m: 0 }}>
          {data.explanation.map((item, idx) => (
            <Typography component="li" variant="body1" key={idx} sx={{ mb: 0.6 }}>
              {item}
            </Typography>
          ))}
        </Box>
      </MotionPaper>

      <Paper sx={{ p: 2.2, mb: 2, border: "1px solid #DDE4D8", bgcolor: "#FFFFFF" }}>
        <Typography variant="h6" fontWeight={700} mb={1.2}>
          Process
        </Typography>
        <Grid container spacing={1.1}>
          {data.process.map((step, idx) => (
            <Grid item key={idx}>
              <Chip label={step} color="primary" variant="outlined" />
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Paper sx={{ p: 2.2, mb: 2, border: "1px solid #DDE4D8", bgcolor: "#F9FCF6" }}>
        <Typography variant="h6" fontWeight={700}>
          {data.example.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {data.example.description}
        </Typography>
      </Paper>

      <Button variant="outlined" startIcon={<ArrowBack />} onClick={() => navigate(-1)}>
        Back
      </Button>
    </Box>
  );
}
