import React from "react";
import { Box, Typography, Stack, Link as MuiLink, Button, Grid, Chip } from "@mui/material";
import { Call, Mail, Language } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Footer = () => (
  <Box
    component="footer"
    sx={{
      mt: 5.5,
      color: "#EAF2EB",
      borderTop: "1px solid #29543A",
      background:
        "linear-gradient(132deg, #0E2518 0%, #123122 54%, #17412A 100%)",
      overflow: "hidden",
    }}
  >
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.35 }}
      sx={{ maxWidth: 1280, mx: "auto", px: { xs: 2, md: 3 }, py: { xs: 3, md: 4 } }}
    >
      <Grid container spacing={2.5}>
        <Grid item xs={12} md={4.5}>
          <Typography variant="h6" sx={{ color: "#FFFFFF", mb: 1 }}>
            AgroAssist Pro
          </Typography>
          <Typography variant="body2" sx={{ color: "rgba(234,242,235,0.82)", mb: 1.5, maxWidth: 420 }}>
            Farmer-first digital platform for crop decisions, weather insights, disease intelligence, and sustainability tracking.
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Chip label="Crop AI" size="small" sx={{ bgcolor: "rgba(255,255,255,0.1)", color: "#EAF2EB" }} />
            <Chip label="Weather Alerts" size="small" sx={{ bgcolor: "rgba(255,255,255,0.1)", color: "#EAF2EB" }} />
            <Chip label="Market Signals" size="small" sx={{ bgcolor: "rgba(255,255,255,0.1)", color: "#EAF2EB" }} />
          </Stack>
        </Grid>

        <Grid item xs={12} sm={6} md={2.5}>
          <Typography variant="body1" sx={{ color: "#FFFFFF", fontWeight: 700, mb: 1 }}>
            Quick Access
          </Typography>
          <Stack spacing={0.6}>
            <MuiLink component={Link} to="/crop-recommendation" underline="hover" sx={{ color: "rgba(234,242,235,0.85)" }}>
              Crop Recommendation
            </MuiLink>
            <MuiLink component={Link} to="/weather-analysis" underline="hover" sx={{ color: "rgba(234,242,235,0.85)" }}>
              Weather Analysis
            </MuiLink>
            <MuiLink component={Link} to="/market-price-prediction" underline="hover" sx={{ color: "rgba(234,242,235,0.85)" }}>
              Market Price
            </MuiLink>
            <MuiLink component={Link} to="/sustainability-dashboard" underline="hover" sx={{ color: "rgba(234,242,235,0.85)" }}>
              Sustainability
            </MuiLink>
          </Stack>
        </Grid>

        <Grid item xs={12} sm={6} md={2.5}>
          <Typography variant="body1" sx={{ color: "#FFFFFF", fontWeight: 700, mb: 1 }}>
            Farmer Support
          </Typography>
          <Stack spacing={0.8}>
            <Typography variant="body2" sx={{ display: "flex", gap: 0.8, alignItems: "center", color: "rgba(234,242,235,0.85)" }}>
              <Call fontSize="small" /> 1800-123-AGRO
            </Typography>
            <Typography variant="body2" sx={{ display: "flex", gap: 0.8, alignItems: "center", color: "rgba(234,242,235,0.85)" }}>
              <Mail fontSize="small" /> support@agroassist.ai
            </Typography>
            <Typography variant="body2" sx={{ display: "flex", gap: 0.8, alignItems: "center", color: "rgba(234,242,235,0.85)" }}>
              <Language fontSize="small" /> Hindi, Marathi, English
            </Typography>
          </Stack>
        </Grid>

        <Grid item xs={12} md={2.5}>
          <Typography variant="body1" sx={{ color: "#FFFFFF", fontWeight: 700, mb: 1 }}>
            Need help now?
          </Typography>
          <Typography variant="body2" sx={{ color: "rgba(234,242,235,0.82)", mb: 1.2 }}>
            Talk to advisory experts for crop disease, irrigation timing, and market decisions.
          </Typography>
          <Button
            variant="contained"
            component={Link}
            to="/disease-detection"
            sx={{
              bgcolor: "primary.main",
              "&:hover": { bgcolor: "primary.dark" },
            }}
          >
            Get Expert Help
          </Button>
        </Grid>
      </Grid>

      <Box
        sx={{
          mt: 2.5,
          pt: 1.6,
          borderTop: "1px solid rgba(234,242,235,0.16)",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          gap: 0.8,
        }}
      >
        <Typography variant="body2" sx={{ color: "rgba(234,242,235,0.76)" }}>
          Copyright {new Date().getFullYear()} AgroAssist Pro. All rights reserved.
        </Typography>
        <Stack direction="row" spacing={2}>
          <MuiLink href="#" underline="hover" sx={{ color: "rgba(234,242,235,0.76)" }}>
            Privacy
          </MuiLink>
          <MuiLink href="#" underline="hover" sx={{ color: "rgba(234,242,235,0.76)" }}>
            Terms
          </MuiLink>
          <MuiLink href="#" underline="hover" sx={{ color: "rgba(234,242,235,0.76)" }}>
            Accessibility
          </MuiLink>
        </Stack>
      </Box>
    </Box>
  </Box>
);

export default Footer;
