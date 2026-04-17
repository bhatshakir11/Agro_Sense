import React from "react";
import { Box, Typography, Stack, Chip, Button, Paper } from "@mui/material";
import { ArrowForward, AutoAwesome } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const PageHero = ({ eyebrow, title, subtitle, chips = [], actions = [] }) => (
  <Box
    component={motion.div}
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45, ease: "easeOut" }}
    sx={{
      maxWidth: 1360,
      mx: "auto",
      mb: 2.6,
    }}
  >
    <Paper
      elevation={0}
      sx={{
        position: "relative",
        overflow: "hidden",
        p: { xs: 2.2, md: 3.1 },
        borderRadius: "28px",
        border: "1px solid rgba(211, 224, 202, 0.95)",
        background:
          "radial-gradient(circle at top left, rgba(232,243,203,0.9), rgba(232,243,203,0) 30%), linear-gradient(135deg, #FFFFFF 0%, #F5FAF0 100%)",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: -70,
          right: -60,
          width: 230,
          height: 230,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(106,174,44,0.18) 0%, rgba(106,174,44,0) 72%)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -80,
          left: "42%",
          width: 220,
          height: 220,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(30,90,53,0.08) 0%, rgba(30,90,53,0) 72%)",
        }}
      />

      <Box sx={{ position: "relative", zIndex: 1 }}>
        {eyebrow && (
          <Chip
            icon={<AutoAwesome sx={{ color: "#1E5A35 !important" }} />}
            label={eyebrow}
            sx={{
              mb: 1.4,
              borderRadius: "999px",
              bgcolor: "rgba(255,255,255,0.9)",
              border: "1px solid rgba(185, 204, 168, 0.7)",
              "& .MuiChip-label": { color: "secondary.main", fontWeight: 700 },
            }}
          />
        )}

        <Typography variant="h3" sx={{ mb: 1, fontSize: { xs: "1.9rem", md: "2.5rem" }, maxWidth: 820 }}>
          {title}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: 820, lineHeight: 1.8, mb: chips.length || actions.length ? 1.8 : 0 }}
        >
          {subtitle}
        </Typography>

        {chips.length > 0 && (
          <Stack
            direction="row"
            spacing={0.9}
            sx={{ flexWrap: "wrap", gap: 0.9, mb: actions.length ? 1.5 : 0 }}
          >
            {chips.map((chip) => (
              <Chip
                key={chip}
                label={chip}
                size="small"
                sx={{
                  borderRadius: "999px",
                  bgcolor: "rgba(255,255,255,0.82)",
                  border: "1px solid rgba(211, 224, 202, 0.95)",
                  "& .MuiChip-label": { fontWeight: 700 },
                }}
              />
            ))}
          </Stack>
        )}

        {actions.length > 0 && (
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.1}>
            {actions.map((action) => (
              <Button
                key={action.label}
                component={Link}
                to={action.to}
                variant={action.variant || "contained"}
                endIcon={action.variant === "text" ? null : <ArrowForward />}
                sx={
                  action.variant === "text"
                    ? { color: "secondary.main", px: 0 }
                    : {
                        bgcolor: "primary.main",
                        borderRadius: "999px",
                        px: 2.2,
                        "&:hover": { bgcolor: "primary.dark" },
                      }
                }
              >
                {action.label}
              </Button>
            ))}
          </Stack>
        )}
      </Box>
    </Paper>
  </Box>
);

export default PageHero;
