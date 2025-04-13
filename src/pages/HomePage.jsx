import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  Chip,
  Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import { useContext, useEffect, useState } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";

export const HomePage = () => {
  const data = useContext(UserContext);
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    const fetchTrips = async () => {
      const tripCollection = collection(db, "trips");
      const snapshot = await getDocs(tripCollection);
      const currentUserId = auth.currentUser?.uid;
      const tripList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter(
        (trip) =>
          trip.visibility === "public" || trip.creatorId === currentUserId
      );
      setTrips(tripList);
    };

    fetchTrips();
  }, []);

  const handleAddDummyTrip = async () => {
    const dummyTrip = {
      title: "Spring Break in Amsterdam",
      destination: "Amsterdam",
      startDate: "2025-04-12",
      endDate: "2025-04-18",
      budget: "1800",
      currency: "EUR",
      visibility: "public", // Default to public for dummy trip
      creatorId: auth.currentUser.uid,
    };

    try {
      await addDoc(collection(db, "trips"), dummyTrip);
      alert("Dummy trip added!");
      window.location.reload();
    } catch (err) {
      console.error("Error adding dummy trip:", err.message);
    }
  };

  return (
    <Box sx={{ bgcolor: "#f1ede8", minHeight: "100vh", py: 8 }}>
      <Container maxWidth="md">
        <Typography
          variant="h3"
          fontWeight="bold"
          gutterBottom
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          ✈️ Welcome, {data?.user?.name || "Traveler"}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" mb={4}>
          Plan smarter. Travel better. Track everything.
        </Typography>

        <Box display="flex" gap={2} mb={5}>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            sx={{
              bgcolor: "#6e4f3a",
              color: "#fff",
              px: 3,
              "&:hover": { bgcolor: "#5a3e2e" },
            }}
            onClick={() => navigate("/new-trip")}
          >
            Create New Trip
          </Button>
          <Button
            variant="outlined"
            size="large"
            sx={{
              borderColor: "#6e4f3a",
              color: "#6e4f3a",
              "&:hover": {
                borderColor: "#5a3e2e",
                backgroundColor: "#f6eee9",
              },
            }}
            onClick={handleAddDummyTrip}
          >
            Add Dummy Trip
          </Button>
        </Box>

        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Your Trips:
        </Typography>

        {trips.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 6,
              mt: 2,
              textAlign: "center",
              borderRadius: 4,
              bgcolor: "#fffaf5",
              color: "#5c4033",
            }}
          >
            <TravelExploreIcon sx={{ fontSize: 60, mb: 2, color: "#b98e69" }} />
            <Typography variant="h6">
              No trips found. Start by creating one! 🌍
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={4}>
            {trips.map((trip) => (
              <Grid item xs={12} sm={6} key={trip.id}>
                <Card
                  onClick={() => navigate(`/trip/${trip.id}`)}
                  sx={{
                    borderRadius: 5,
                    bgcolor: "#fff5ed",
                    cursor: "pointer",
                    transition: "0.3s",
                    px: 2,
                    "&:hover": {
                      boxShadow: 6,
                      transform: "scale(1.02)",
                    },
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      gutterBottom
                      sx={{ color: "#4e342e" }}
                    >
                      {trip.title}
                    </Typography>

                    <Typography sx={{ color: "#7b4c4c", fontSize: 15 }}>
                      📍 {trip.destination}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        mt: 1,
                        color: "#5f4339",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      📅 {trip.startDate} → {trip.endDate}
                    </Typography>

                    <Chip
                      label={`Budget: ${trip.currency || "USD"} ${trip.budget}`}
                      sx={{
                        mt: 2,
                        bgcolor: "#c08e7b",
                        color: "#fff",
                        fontWeight: "bold",
                        px: 2,
                        fontSize: 14,
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};
