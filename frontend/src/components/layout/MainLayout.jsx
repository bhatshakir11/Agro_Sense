import React from "react";
import Navbar from "../common/Navbar";
import Footer from "../common/Footer";
import { Box, Container } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";

const MainLayout = ({ children }) => {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", bgcolor: "background.default" }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Container maxWidth="xl" sx={{ py: isHome ? 0 : { xs: 3, md: 4 }, px: { xs: 1.5, md: 3 } }}>
          {children}
          {!children && <Outlet />}
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default MainLayout;
