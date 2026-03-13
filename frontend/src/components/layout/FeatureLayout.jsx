import React from "react";
import MainLayout from "./MainLayout";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

const FeatureLayout = () => (
  <MainLayout>
    <Box sx={{ maxWidth: 1040, mx: "auto", py: { xs: 3, md: 4 } }}>
      <Outlet />
    </Box>
  </MainLayout>
);

export default FeatureLayout;
