import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";
import AppRoutes from "./routes";
import { AppDataProvider } from "./context/AppDataContext";

const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <AppDataProvider>
      <AppRoutes />
    </AppDataProvider>
  </ThemeProvider>
);

export default App;
