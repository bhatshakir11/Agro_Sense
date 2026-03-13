import React from "react";
import { Box, Typography, Grid, Chip, Stack, Button } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const PageHero = ({ eyebrow, title, subtitle, image, chips = [], actions = [] }) => (
  <Box
    sx={{
      position: "relative",
      overflow: "hidden",
      mb: 2.2,
      border: "1px solid #D7E0D3",
      bgcolor: "#FFFFFF",
    }}
  >
    <Grid container>
      <Grid item xs={12} md={7}>
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          sx={{ p: { xs: 2.1, md: 2.8 } }}
        >
          {eyebrow && (
            <Typography variant="body2" sx={{ color: "secondary.main", fontWeight: 700, mb: 0.7 }}>
              {eyebrow}
            </Typography>
          )}
          <Typography variant="h3" sx={{ mb: 1.1, fontSize: { xs: "1.65rem", md: "2rem" } }}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 680, mb: 1.4 }}>
            {subtitle}
          </Typography>
          <Stack direction="row" spacing={0.7} sx={{ flexWrap: "wrap", mb: actions.length ? 1.2 : 0 }}>
            {chips.map((chip) => (
              <Chip key={chip} label={chip} size="small" variant="outlined" />
            ))}
          </Stack>
          {actions.length > 0 && (
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
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
                      : { bgcolor: "primary.main", "&:hover": { bgcolor: "primary.dark" } }
                  }
                >
                  {action.label}
                </Button>
              ))}
            </Stack>
          )}
        </Box>
      </Grid>
      <Grid item xs={12} md={5}>
        <Box
          sx={{
            minHeight: { xs: 170, md: "100%" },
            backgroundImage: `linear-gradient(120deg, rgba(14,33,23,0.2) 0%, rgba(14,33,23,0.55) 100%), url('${image}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </Grid>
    </Grid>
  </Box>
);

export default PageHero;
