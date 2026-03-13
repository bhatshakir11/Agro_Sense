import React from "react";
import { Card as MuiCard, CardContent, Typography, Box } from "@mui/material";
import { motion } from "framer-motion";

const Card = ({ title, subtitle, children, rightNode }) => (
  <MuiCard
    component={motion.div}
    initial={{ opacity: 0, y: 8 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.25 }}
    sx={{
      mb: 2,
      bgcolor: "#FFFFFF",
      transition: "transform 0.2s ease, border-color 0.2s ease",
      "&:hover": {
        transform: "translateY(-2px)",
        borderColor: "#C8DAB9",
      },
    }}
  >
    <CardContent sx={{ p: 2.3 }}>
      {(title || subtitle || rightNode) && (
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1.4, gap: 1 }}>
          <Box>
            {title && (
              <Typography variant="h6" sx={{ mb: subtitle ? 0.3 : 0 }}>
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          {rightNode}
        </Box>
      )}
      {children}
    </CardContent>
  </MuiCard>
);

export default Card;
