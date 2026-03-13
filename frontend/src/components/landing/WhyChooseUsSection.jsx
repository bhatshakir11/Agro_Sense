import { Box, Typography, Grid, Paper, Button, Avatar } from "@mui/material";
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

const stories = [
  {
    name: "Ravi Patil",
    place: "Nashik",
    quote: "Irrigation timing alerts helped me reduce water use and keep crop quality stable.",
    avatar:
      "https://images.unsplash.com/photo-1542327897-d73f4005b533?auto=format&fit=crop&w=300&q=80",
  },
  {
    name: "Sunita Verma",
    place: "Indore",
    quote: "Disease detection caught leaf blight early and prevented major loss in my tomato field.",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
  },
];

const WhyChooseUsSection = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ pb: { xs: 4.5, md: 6 } }}>
      <Grid container spacing={2}>
        <Grid item xs={12} lg={7}>
          <Paper sx={{ p: 2.4, border: "1px solid #DDE4D8", bgcolor: "#FFFFFF", height: "100%" }}>
            <Typography variant="h4" sx={{ mb: 1 }}>
              Why Farmers Prefer This Platform
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Designed for real field conditions with simple workflows and high-impact decisions.
            </Typography>

            <Grid container spacing={1.5}>
              {highlights.map((item, idx) => (
                <Grid item xs={12} key={item.title}>
                  <MotionPaper
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.28, delay: idx * 0.05 }}
                    sx={{ p: 1.6, border: "1px solid #E1E7DD", bgcolor: "#F9FCF6" }}
                  >
                    <Typography variant="h6" sx={{ mb: 0.4 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.9 }}>
                      {item.desc}
                    </Typography>
                    <Button
                      variant="text"
                      endIcon={<ArrowForward />}
                      sx={{ px: 0, color: "secondary.main" }}
                      onClick={() => navigate(`/features/${item.route}`)}
                    >
                      Explore details
                    </Button>
                  </MotionPaper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={5}>
          <Paper sx={{ p: 2.4, border: "1px solid #DDE4D8", bgcolor: "#FFFFFF", height: "100%" }}>
            <Typography variant="h6" sx={{ mb: 1.4 }}>
              Farmer Stories
            </Typography>
            <Grid container spacing={1.2}>
              {stories.map((story, idx) => (
                <Grid item xs={12} key={story.name}>
                  <MotionPaper
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.25, delay: idx * 0.05 }}
                    sx={{ p: 1.5, border: "1px solid #E1E7DD", bgcolor: "#FFFFFF" }}
                  >
                    <Box sx={{ display: "flex", gap: 1.2, alignItems: "center", mb: 1 }}>
                      <Avatar src={story.avatar} alt={story.name} />
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 700 }}>
                          {story.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {story.place}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      "{story.quote}"
                    </Typography>
                  </MotionPaper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default WhyChooseUsSection;
