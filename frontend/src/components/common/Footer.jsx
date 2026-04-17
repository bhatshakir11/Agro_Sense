import React from "react";
import { Box, Typography, Stack, Link as MuiLink } from "@mui/material";
import { Link } from "react-router-dom";

const Footer = () => (
  <Box
    component="footer"
    sx={{
      mt: 5,
      borderTop: "1px solid #E1E7DD",
      bgcolor: "#FFFFFF",
    }}
  >
    <Box
      sx={{
        maxWidth: 1280,
        mx: "auto",
        px: { xs: 2, md: 3 },
        py: 2.4,
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "space-between",
        alignItems: { xs: "flex-start", md: "center" },
        gap: 1.2,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        AgroAssist Pro
      </Typography>
      <Stack direction="row" spacing={2}>
        <MuiLink component={Link} to="/crop-recommendation" underline="hover" color="text.secondary">
          Crop
        </MuiLink>
        <MuiLink component={Link} to="/weather-analysis" underline="hover" color="text.secondary">
          Weather
        </MuiLink>
        <MuiLink component={Link} to="/market-price-prediction" underline="hover" color="text.secondary">
          Market
        </MuiLink>
      </Stack>
      <Typography variant="body2" color="text.secondary">
        Copyright {new Date().getFullYear()}
      </Typography>
    </Box>
  </Box>
);

export default Footer;
