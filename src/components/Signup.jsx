// src/components/Signup.jsx
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
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { validateInput } from "../utils";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";

export const Signup = () => {
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    dob: "",
    password: "",
  });

  const navigate = useNavigate();

  const [formDisabled, setFormDisabled] = useState(true);
  const [openNotification, setOpenNotification] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        signupData.email,
        signupData.password
      );

      if (userCredential) {
        await addDoc(collection(db, "users"), {
          name: signupData.name,
          email: signupData.email,
          dob: signupData.dob,
        });

        setOpenNotification(true);
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error) {
      alert("Signup failed! " + error.message);
    }
  };

  useEffect(() => {
    const isDisabled = validateInput([
      signupData.name,
      signupData.email,
      signupData.password,
    ]);
    setFormDisabled(isDisabled);
  }, [signupData]);

  return (
    <Box
      sx={{
        bgcolor: "#f2f2f2",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card
        sx={{
          width: 400,
          bgcolor: "#fef4e8",
          borderRadius: 4,
          boxShadow: 6,
        }}
      >
        <CardContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <Typography variant="h5" fontWeight="bold" textAlign="center">
            🧳 Sign Up
            </Typography>

            <TextField
              label="Full Name"
              fullWidth
              value={signupData.name}
              onChange={(e) =>
                setSignupData({ ...signupData, name: e.target.value })
              }
            />

            <TextField
              label="Email"
              type="email"
              fullWidth
              value={signupData.email}
              onChange={(e) =>
                setSignupData({ ...signupData, email: e.target.value })
              }
            />

            <TextField
              label="Date of Birth"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={signupData.dob}
              onChange={(e) =>
                setSignupData({ ...signupData, dob: e.target.value })
              }
            />

            <TextField
              label="Password"
              type="password"
              fullWidth
              value={signupData.password}
              onChange={(e) =>
                setSignupData({ ...signupData, password: e.target.value })
              }
            />

            <Button
              variant="contained"
              fullWidth
              size="large"
              startIcon={<PersonAddIcon />}
              onClick={handleSignup}
              disabled={formDisabled}
              sx={{ py: 1.5, fontSize: 16 }}
            >
              Sign Up
            </Button>

            <Typography textAlign="center">
              Already have an account?{" "}
              <Link to="/login" style={{ color: "#1976d2", fontWeight: "bold" }}>
                Login
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Snackbar
        open={openNotification}
        autoHideDuration={6000}
        message="Signup Completed Successfully"
      />
    </Box>
  );
};
