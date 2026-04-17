import React, { useEffect, useState } from "react";
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
import { Menu, Spa, WbSunny } from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";
import { getWeatherByCoordinates } from "../../services/weatherService";
import {
  getSavedWeatherLocation,
  setSavedWeatherLocation,
  subscribeToWeatherLocationUpdates,
} from "../../utils/weatherLocationStorage";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Crop", to: "/crop-recommendation" },
  { label: "Weather", to: "/weather-analysis" },
  { label: "Market", to: "/market-price-prediction" },
  { label: "Disease", to: "/disease-detection" },
  { label: "Dashboard", to: "/sustainability-dashboard" },
];

const defaultWeatherChip = "Location weather unavailable";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [weatherChip, setWeatherChip] = useState(defaultWeatherChip);
  const location = useLocation();

  const isActive = (to) => location.pathname === to;

  useEffect(() => {
    let ignore = false;

    const loadNavbarWeather = async (savedLocation) => {
      if (
        !savedLocation ||
        !Number.isFinite(savedLocation.latitude) ||
        !Number.isFinite(savedLocation.longitude)
      ) {
        if (!ignore) {
          setWeatherChip(defaultWeatherChip);
        }
        return;
      }

      try {
        const data = await getWeatherByCoordinates(savedLocation);
        const resolvedLocation = {
          latitude: data.location.latitude,
          longitude: data.location.longitude,
          place: data.location.name,
        };

        setSavedWeatherLocation(resolvedLocation);

        if (!ignore) {
          setWeatherChip(`${data.location.name}: ${data.current.temperature}°C`);
        }
      } catch (error) {
        if (!ignore) {
          setWeatherChip(defaultWeatherChip);
        }
      }
    };

    loadNavbarWeather(getSavedWeatherLocation());
    const unsubscribe = subscribeToWeatherLocationUpdates(loadNavbarWeather);

    return () => {
      ignore = true;
      unsubscribe();
    };
  }, []);

  return (
    <AppBar position="sticky" color="transparent" elevation={0} sx={{ bgcolor: "#FFFFFF", borderBottom: "1px solid #E1E7DD" }}>
      <Toolbar sx={{ minHeight: 70, px: { xs: 1.5, md: 3 } }}>
        <Box
          component={Link}
          to="/"
          sx={{ display: "flex", alignItems: "center", gap: 1, textDecoration: "none", flexGrow: 1 }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              display: "grid",
              placeItems: "center",
              bgcolor: "secondary.main",
              color: "#FFFFFF",
            }}
          >
            <Spa fontSize="small" />
          </Box>
          <Typography sx={{ color: "text.primary", fontWeight: 700, fontSize: { xs: "1rem", md: "1.1rem" } }}>
            AgroAssist Pro
          </Typography>
        </Box>

        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ display: { xs: "none", md: "flex" }, mr: 1.2 }}>
          {navItems.map((item) => (
            <Button
              key={item.to}
              component={Link}
              to={item.to}
              sx={{
                color: isActive(item.to) ? "secondary.main" : "text.secondary",
                fontWeight: isActive(item.to) ? 700 : 600,
                minWidth: "auto",
                px: 1.2,
              }}
            >
              {item.label}
            </Button>
          ))}
        </Stack>

        <Chip
          icon={<WbSunny />}
          label={weatherChip}
          size="small"
          variant="outlined"
          sx={{ display: { xs: "none", md: "inline-flex" }, mr: 1 }}
        />

        <IconButton sx={{ display: { xs: "inline-flex", md: "none" } }} onClick={() => setOpen(true)}>
          <Menu />
        </IconButton>
      </Toolbar>

      <Drawer anchor="right" open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { width: 300 } }}>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Menu
          </Typography>
          <Divider sx={{ mb: 1.5 }} />
          <Stack spacing={0.5}>
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
                  py: 1,
                }}
              >
                {item.label}
              </Button>
            ))}
          </Stack>
          <Divider sx={{ my: 1.5 }} />
          <Chip icon={<WbSunny />} label={weatherChip} sx={{ width: "100%", justifyContent: "flex-start" }} variant="outlined" />
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
