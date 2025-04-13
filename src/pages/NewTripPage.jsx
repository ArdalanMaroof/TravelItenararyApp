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
import { useState, useContext, useEffect } from "react";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { useNavigate, useLocation } from "react-router-dom";
import { capitals } from "../assets/capitals";
import UserContext from "../context/UserContext";

export const NewTripPage = () => {
  const location = useLocation();
  const { user } = useContext(UserContext) || {};
  const tripDataFromLocation = location.state ? location.state.tripData : null;
  const navigate = useNavigate();
  const [loadingAuth, setLoadingAuth] = useState(true);

  const [tripData, setTripData] = useState({
    id: tripDataFromLocation?.id || null,
    title: tripDataFromLocation?.title || "",
    destination: tripDataFromLocation?.destination || "",
    startDate: tripDataFromLocation?.startDate || "",
    endDate: tripDataFromLocation?.endDate || "",
    budget: tripDataFromLocation?.budget || "",
    currency: tripDataFromLocation?.currency || "USD",
    visibility: tripDataFromLocation?.visibility || "private",
  });

   // Check authentication state
   useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        navigate("/login"); // Redirect to login if not authenticated
      }
      setLoadingAuth(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const getTodayDateString = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const handleAddTrip = async () => {
    const { title, destination, startDate, endDate, budget, visibility, currency, id } = tripData;
  
    if (!title || !destination || !startDate || !endDate || !budget || !currency || !visibility) {
      alert("⚠️ Please fill all fields before continuing.");
      return;
    }
  
    const today = getTodayDateString();
  
    if (startDate < today || endDate < today) {
      alert("🚫 Dates cannot be in the past.");
      return;
    }
  
    if (endDate < startDate) {
      alert("🚫 End date cannot be before the start date.");
      return;
    }
  
    try {
      if (!auth.currentUser) {
        alert("You must be logged in to create a trip.");
        navigate("/login");
        return;
      }
      if (id) {
        // 🔁 EDIT MODE
        const tripRef = doc(db, "trips", id);
        await updateDoc(tripRef, {
          title,
          destination,
          startDate,
          endDate,
          budget,
          currency,
          visibility,
          updatedAt: new Date().toISOString(),
        });
        alert("Trip updated successfully!");
      } else {
        // ➕ ADD MODE
        await addDoc(collection(db, "trips"), {
          title,
          destination,
          startDate,
          endDate,
          budget,
          currency,
          visibility,
          creatorId: auth.currentUser.uid, // Safe to access after check
          createdAt: new Date().toISOString(),
        });
        alert("Trip added successfully!");
      }
  
      navigate("/");
    } catch (error) {
      console.error("Failed to save trip:", error.message);
      alert("Error: " + error.message);
    }
  };
   
  if (loadingAuth) {
    return <Typography>Loading...</Typography>;
  }

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
                inputProps={{ min: getTodayDateString() }}
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
                inputProps={{ min: getTodayDateString() }}
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


              <TextField
                label="Visibility"
                select
                fullWidth
                value={tripData.visibility}
                onChange={(e) =>
                  setTripData({ ...tripData, visibility: e.target.value })
                }
              >
                <MenuItem value="public">Public</MenuItem>
                <MenuItem value="private">Private</MenuItem>
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
