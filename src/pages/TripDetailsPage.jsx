// src/pages/TripDetailsPage.jsx
import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Typography,
  Button,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import SearchIcon from "@mui/icons-material/Search";

export const TripDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();  // Add navigate to programmatically redirect
  const [trip, setTrip] = useState(null); // Start with null until data is fetched
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchTrip = async () => {
      setLoading(true); // Start loading
      const docRef = doc(db, "trips", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setTrip(docSnap.data());
      } else {
        setTrip(null); // Set to null if trip doesn't exist
      }
      setLoading(false); // Stop loading
    };

    fetchTrip();
  }, [id]);

  // Handle delete trip
  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this trip?");
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, "trips", id));
        alert("Trip deleted successfully!");
        navigate("/");  // Redirect to home page after deletion
      } catch (error) {
        console.error("Error deleting trip:", error.message);
        alert("Error deleting trip: " + error.message);
      }
    }
  };

  // Handle edit trip
 // src/pages/TripDetailsPage.jsx
const handleEdit = () => {
  navigate(`/new-trip`, { state: { tripData: trip } });
};


  if (loading) {
    return <div>Loading...</div>; // Show loading message while fetching
  }

  if (!trip) {
    return <div>Trip not found.</div>; // Handle case when trip is not found
  }

  return (
    <Box sx={{ bgcolor: "#f4eee9", minHeight: "100vh", py: 10 }}>
      <Container maxWidth="sm">
        <Card sx={{ borderRadius: 6, p: 4, boxShadow: 6, bgcolor: "#fffaf3" }}>
          <CardContent>
            <Typography
              variant="h4"
              fontWeight="bold"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <SearchIcon color="primary" />
              {trip.title}
            </Typography>

            <Typography
              variant="subtitle1"
              fontWeight="medium"
              sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}
            >
              <LocationOnIcon color="action" />
              <strong>Destination:</strong> {trip.destination}
            </Typography>

            <Typography
              sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}
              color="text.secondary"
            >
              <CalendarMonthIcon />
              <strong>Start Date:</strong> {trip.startDate}
            </Typography>
            <Typography
              sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}
              color="text.secondary"
            >
              <CalendarMonthIcon />
              <strong>End Date:</strong> {trip.endDate}
            </Typography>

            <Box mt={3}>
              <Chip
                icon={<AttachMoneyIcon />}
                label={`Budget: ${trip.currency || "USD"} ${trip.budget}`}
                sx={{
                  bgcolor: "#a9746e",
                  color: "#fff",
                  fontWeight: "bold",
                  px: 2,
                  py: 1,
                  fontSize: "16px",
                }}
              />
            </Box>

            {/* Edit and Delete Buttons */}
            <Box mt={2} sx={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleEdit}
                sx={{ px: 3, fontSize: "14px" }}
              >
                ✏️ Edit
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={handleDelete}
                sx={{ px: 3, fontSize: "14px" }}
              >
                🗑️ Delete
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};
