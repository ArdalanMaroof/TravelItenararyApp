// src/components/Login.jsx
import {
  Box,
  Button,
  Card,
  CardContent,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateInput } from "../utils";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleAuthProvider } from "../firebaseConfig";
import GoogleIcon from "@mui/icons-material/Google";

export const Login = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [formDisabled, setFormDisabled] = useState(true);
  const [openNotification, setOpenNotification] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        loginData.email,
        loginData.password
      );
      const user = userCredential.user;
      if (user) {
        setOpenNotification(true);
        localStorage.setItem(
          "user",
          JSON.stringify({ displayName: user.displayName, email: user.email })
        );
        setTimeout(() => navigate("/"), 2000);
      }
    } catch (error) {
      alert(error.message);
      console.error(error.message);
    }
  };

  const handleLoginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const user = result.user;
      if (user) {
        setOpenNotification(true);
        localStorage.setItem(
          "user",
          JSON.stringify({ displayName: user.displayName, email: user.email })
        );
        navigate("/");
      }
    } catch (error) {
      alert(error.message);
      console.error(error.message);
    }
  };

  useEffect(() => {
    const isDisabled = validateInput([loginData.email, loginData.password]);
    setFormDisabled(isDisabled);
  }, [loginData]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f3f4f6",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 520, 
          p: 5,
          borderRadius: 5,
          bgcolor: "#fdf4ec",
          boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
        }}
      >
        <CardContent>
          <Typography
            variant="h4"
            fontWeight="bold"
            textAlign="center"
            gutterBottom
          >
            ✈️ Login
          </Typography>

          <Box display="flex" flexDirection="column" gap={4} mt={3}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              size="medium"
              value={loginData.email}
              onChange={(e) =>
                setLoginData({ ...loginData, email: e.target.value })
              }
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              size="medium"
              value={loginData.password}
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
            />

            <Button
              variant="contained"
              fullWidth
              onClick={handleLogin}
              disabled={formDisabled}
              sx={{
                backgroundColor: "#1976d2",
                fontWeight: "bold",
                py: 1.5,
                fontSize: "1rem",
              }}
            >
              Login
            </Button>

            <Button
              variant="outlined"
              fullWidth
              onClick={handleLoginWithGoogle}
              startIcon={<GoogleIcon />}
              sx={{ py: 1.5, fontSize: "1rem" }}
            >
              Sign in with Google
            </Button>

            <Typography textAlign="center" variant="body1">
              Don’t have an account?{" "}
              <span
                style={{
                  cursor: "pointer",
                  color: "#1976d2",
                  fontWeight: "bold",
                }}
                onClick={() => navigate("/signup")}
              >
                Sign up
              </span>
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Snackbar
        open={openNotification}
        autoHideDuration={6000}
        message="Login successful"
      />
    </Box>
  );
};
