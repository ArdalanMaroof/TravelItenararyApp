// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const customTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#e8eaed", // soft light background
      paper: "#fefefe", // bright white cards
    },
    primary: {
      main: "#1976d2", // blue accent
    },
    text: {
      primary: "#1a1a1a",
      secondary: "#555",
    },
  },
  typography: {
    fontFamily: "Segoe UI, Roboto, sans-serif",
    fontSize: 14,
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#c4c4c4', // visible border
            },
            '&:hover fieldset': {
              borderColor: '#1976d2', // hover color
            },
          },
        },
      },
    },
    
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={customTheme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
