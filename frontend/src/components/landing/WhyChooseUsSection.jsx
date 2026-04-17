import { Box, Typography, Paper, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowForward } from "@mui/icons-material";

const MotionPaper = motion(Paper);

const highlights = [
  {
    title: "Action-ready recommendations",
    desc: "Insights are delivered in plain language so farmers can act quickly in the field.",
    route: "farmer-friendly",
  },
  {
    title: "Reliable data and model blend",
    desc: "Combines government feeds, weather trends, and AI models to improve confidence.",
    route: "data-backed",
  },
  {
    title: "End-to-end crop cycle support",
    desc: "From crop selection to market selling, one platform supports the full season journey.",
    route: "ai-driven",
  },
];

const WhyChooseUsSection = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ pb: { xs: 4.5, md: 6 }, maxWidth: 1320, mx: "auto" }}>
      <Paper sx={{ p: { xs: 2.2, md: 2.8 }, border: "1px solid #DDE4D8", bgcolor: "#FFFFFF" }}>
        <Box sx={{ textAlign: "center", maxWidth: 780, mx: "auto", mb: 2.4 }}>
          <Typography variant="h4" sx={{ mb: 1 }}>
            Why Farmers Prefer This Platform
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Designed for real field conditions with simple workflows and high-impact decisions.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))", xl: "repeat(3, minmax(0, 1fr))" },
            gap: 1.5,
            alignItems: "stretch",
          }}
        >
          {highlights.map((item, idx) => (
            <MotionPaper
              key={item.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.28, delay: idx * 0.05 }}
              sx={{
                p: 2,
                border: "1px solid #E1E7DD",
                bgcolor: "#F9FCF6",
                minHeight: 190,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                textAlign: "center",
              }}
            >
              <Box>
                <Typography variant="h6" sx={{ mb: 0.7 }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360, mx: "auto" }}>
                  {item.desc}
                </Typography>
              </Box>
              <Button
                variant="text"
                endIcon={<ArrowForward />}
                sx={{ mt: 1.6, color: "secondary.main" }}
                onClick={() => navigate(`/features/${item.route}`)}
              >
                Explore details
              </Button>
            </MotionPaper>
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default WhyChooseUsSection;
