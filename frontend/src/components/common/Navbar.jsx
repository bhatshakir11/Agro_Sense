import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  Stack,
  Divider,
  Chip,
} from "@mui/material";
import { Menu, Spa, WbSunny, SupportAgent } from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Crop", to: "/crop-recommendation" },
  { label: "Weather", to: "/weather-analysis" },
  { label: "Market", to: "/market-price-prediction" },
  { label: "Disease", to: "/disease-detection" },
  { label: "Dashboard", to: "/sustainability-dashboard" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const isActive = (to) => location.pathname === to;

  return (
    <AppBar position="sticky" color="transparent" sx={{ bgcolor: "transparent", borderBottom: "none" }}>
      <Box
        sx={{
          bgcolor: "#0F2A1A",
          color: "rgba(255,255,255,0.86)",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          px: { xs: 1.5, md: 3 },
          py: 0.55,
          display: { xs: "none", md: "block" },
        }}
      >
        <Stack direction="row" spacing={1.3} justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={1.2} alignItems="center">
            <Chip
              icon={<WbSunny sx={{ color: "#FFE082 !important" }} />}
              label="Nashik: 29°C • Low Rain Risk"
              size="small"
              sx={{ bgcolor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.9)" }}
            />
            <Typography variant="body2">Farmer Advisory Helpline: 1800-123-AGRO</Typography>
          </Stack>
          <Typography variant="body2">Updated every 3 hours</Typography>
        </Stack>
      </Box>

      <Toolbar
        component={motion.div}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        sx={{
          minHeight: 74,
          px: { xs: 1.5, md: 3 },
          bgcolor: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid #DCE3D8",
        }}
      >
        <Box
          component={Link}
          to="/"
          sx={{ display: "flex", alignItems: "center", gap: 1, textDecoration: "none", flexGrow: 1 }}
        >
          <Box
            sx={{
              width: 34,
              height: 34,
              display: "grid",
              placeItems: "center",
              bgcolor: "secondary.main",
              color: "#FFFFFF",
              border: "1px solid rgba(0,0,0,0.04)",
            }}
          >
            <Spa fontSize="small" />
          </Box>
          <Box>
            <Typography sx={{ color: "text.primary", fontWeight: 700, lineHeight: 1.1, fontSize: { xs: "0.98rem", md: "1.08rem" } }}>
              AgroAssist Pro
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary", display: { xs: "none", md: "block" } }}>
              Smart decisions for every field
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 0.45 }}>
          {navItems.map((item) => (
            <Button
              key={item.to}
              component={Link}
              to={item.to}
              sx={{
                color: isActive(item.to) ? "secondary.main" : "text.secondary",
                borderBottom: isActive(item.to) ? "2px solid #00793A" : "2px solid transparent",
                px: 1.2,
                minWidth: "auto",
                fontWeight: isActive(item.to) ? 700 : 600,
                borderRadius: 0,
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>

        <Button
          variant="contained"
          startIcon={<SupportAgent />}
          component={Link}
          to="/weather-analysis"
          sx={{
            ml: 1.2,
            display: { xs: "none", md: "inline-flex" },
            bgcolor: "primary.main",
            "&:hover": { bgcolor: "primary.dark" },
          }}
        >
          Get Advisory
        </Button>

        <IconButton sx={{ display: { xs: "inline-flex", md: "none" } }} onClick={() => setOpen(true)}>
          <Menu />
        </IconButton>
      </Toolbar>

      <Drawer anchor="right" open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { width: 320 } }}>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 0.8 }}>
            Navigate
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.3 }}>
            Open any module quickly
          </Typography>
          <Divider sx={{ mb: 1.5 }} />
          <Stack spacing={0.4}>
            {navItems.map((item) => (
              <Button
                key={item.to}
                component={Link}
                to={item.to}
                onClick={() => setOpen(false)}
                sx={{
                  justifyContent: "flex-start",
                  color: isActive(item.to) ? "secondary.main" : "text.primary",
                  fontWeight: isActive(item.to) ? 700 : 600,
                  borderRadius: 0,
                  py: 1.1,
                }}
              >
                {item.label}
              </Button>
            ))}
          </Stack>
          <Divider sx={{ my: 1.5 }} />
          <Chip
            icon={<WbSunny />}
            label="Today: 29°C, irrigation-friendly"
            sx={{ width: "100%", justifyContent: "flex-start" }}
            variant="outlined"
          />
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
