import { createTheme } from "@mui/material/styles";
import palette from "./palette";
import typography from "./typography";

const theme = createTheme({
  palette,
  typography,
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#F5F7F2",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "none",
          paddingLeft: 16,
          paddingRight: 16,
        },
        contained: {
          boxShadow: "0 8px 20px rgba(106, 174, 44, 0.14)",
          "&:hover": {
            boxShadow: "0 10px 22px rgba(106, 174, 44, 0.18)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          boxShadow: "0 8px 24px rgba(24,34,27,0.04)",
          border: "1px solid #E3EBDD",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          boxShadow: "0 8px 24px rgba(24,34,27,0.04)",
          border: "1px solid #E3EBDD",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "none",
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 3,
          borderRadius: 999,
          backgroundColor: "#6AAE2C",
        },
      },
    },
  },
});

export default theme;
