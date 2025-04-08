import { Box } from "@mui/material";
import React from "react";
import { Login } from "../components/Login";

export const LoginPage = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Login />
    </Box>
  );
};
