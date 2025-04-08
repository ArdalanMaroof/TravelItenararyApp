// src/pages/NewTripPage.jsx
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
  Autocomplete,
  Divider,
  MenuItem,
} from "@mui/material";
import { useState, useEffect } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useNavigate, useLocation } from "react-router-dom";
import { capitals } from "../assets/capitals";

export const NewTripPage = () => {
  const location = useLocation();

  // Get the trip data from location.state (for editing purposes)
  const tripDataFromLocation = location.state ? location.state.tripData : null;

  // Initialize state based on the tripDataFromLocation if editing, or with empty fields for a new trip
  const [tripData, setTripData] = useState({
    title: tripDataFromLocation?.title || "",
    destination: tripDataFromLocation?.destination || "",
    startDate: tripDataFromLocation?.startDate || "",
    endDate: tripDataFromLocation?.endDate || "",
    budget: tripDataFromLocation?.budget || "",
    currency: tripDataFromLocation?.currency || "USD",
  });

  const navigate = useNavigate();

  const handleAddTrip = async () => {
    const { title, destination, startDate, endDate, budget, currency } = tripData;

    // Logging for debugging
    console.log("Trip Data:", tripData);

    if (!title || !destination || !startDate || !endDate || !budget || !currency) {
      alert("⚠️ Please fill all fields before adding the trip.");
      return;
    }

    try {
      await addDoc(collection(db, "trips"), {
        title,
        destination,
        startDate,
        endDate,
        budget,
        currency,
        createdAt: new Date().toISOString(),
      });

      alert("Trip added successfully!");
      navigate("/");
    } catch (error) {
      console.error("Failed to add trip:", error.message);
      alert("Error adding trip: " + error.message);
    }
  };

  return (
    <Box sx={{ bgcolor: "#f5efe7", minHeight: "100vh", py: 8 }}>
      <Container maxWidth="sm">
        <Card
          sx={{
            p: 4,
            bgcolor: "#fff8f0",
            color: "#4e342e",
            borderRadius: "20px",
            boxShadow: "0 10px 40px rgba(95, 60, 40, 0.15)",
          }}
        >
          <CardContent>
            <Typography
              variant="h4"
              fontWeight="bold"
              gutterBottom
              sx={{ textAlign: "center", color: "#5d4037" }}
            >
              ☕ Create New Trip
            </Typography>

            <Divider sx={{ my: 3, backgroundColor: "#d7ccc8" }} />

            <Box display="flex" flexDirection="column" gap={3}>
              <TextField
                label="Trip Title"
                fullWidth
                variant="outlined"
                value={tripData.title}
                onChange={(e) =>
                  setTripData({ ...tripData, title: e.target.value })
                }
              />

              <Autocomplete
                freeSolo
                options={capitals}
                filterOptions={(options, { inputValue }) =>
                  options.filter((option) =>
                    option.toLowerCase().includes(inputValue.toLowerCase())
                  )
                }
                onInputChange={(e, value) =>
                  setTripData({ ...tripData, destination: value })
                }
                renderInput={(params) => (
                  <TextField {...params} label="Destination" fullWidth />
                )}
              />

              <TextField
                label="Start Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={tripData.startDate}
                onChange={(e) =>
                  setTripData({ ...tripData, startDate: e.target.value })
                }
              />

              <TextField
                label="End Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={tripData.endDate}
                onChange={(e) =>
                  setTripData({ ...tripData, endDate: e.target.value })
                }
              />

              <TextField
                label="Budget"
                type="number"
                fullWidth
                variant="outlined"
                value={tripData.budget}
                onChange={(e) =>
                  setTripData({ ...tripData, budget: e.target.value })
                }
              />

              <TextField
                label="Currency"
                select
                fullWidth
                value={tripData.currency}
                onChange={(e) =>
                  setTripData({ ...tripData, currency: e.target.value })
                }
              >
                {["USD", "EUR", "INR", "CAD", "GBP", "JPY"].map((curr) => (
                  <MenuItem key={curr} value={curr}>
                    {curr}
                  </MenuItem>
                ))}
              </TextField>

              <Button
                variant="contained"
                size="large"
                sx={{
                  py: 1.5,
                  fontSize: 18,
                  bgcolor: "#8d6e63",
                  "&:hover": { bgcolor: "#6d4c41" },
                }}
                onClick={handleAddTrip}
              >
                ➕ Add Trip
              </Button>

              {tripData.destination && (
                <Box mt={2} textAlign="center">
                  <Button
                    variant="outlined"
                    href={`https://www.google.com/flights?q=flights+to+${encodeURIComponent(
                      tripData.destination
                    )}`}
                    target="_blank"
                    sx={{
                      borderColor: "#8d6e63",
                      color: "#6d4c41",
                      "&:hover": {
                        backgroundColor: "#efebe9",
                        borderColor: "#6d4c41",
                      },
                    }}
                  >
                    ✈️ Flights to {tripData.destination}
                  </Button>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};
