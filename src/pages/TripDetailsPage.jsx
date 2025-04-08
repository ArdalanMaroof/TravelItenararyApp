import {
    Box,
    Card,
    CardContent,
    Chip,
    Container,
    Typography,
  } from "@mui/material";
  import { useParams } from "react-router-dom";
  import { useEffect, useState } from "react";
  import { doc, getDoc } from "firebase/firestore";
  import { db } from "../firebaseConfig";
  import LocationOnIcon from "@mui/icons-material/LocationOn";
  import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
  import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
  import SearchIcon from "@mui/icons-material/Search";
  
  export const TripDetailsPage = () => {
    const { id } = useParams();
    const [trip, setTrip] = useState(null);
  
    useEffect(() => {
      const fetchTrip = async () => {
        const docRef = doc(db, "trips", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setTrip(docSnap.data());
        } else {
          console.error("Trip not found");
        }
      };
  
      fetchTrip();
    }, [id]);
  
    return (
      <Box sx={{ bgcolor: "#f4eee9", minHeight: "100vh", py: 10 }}>
        <Container maxWidth="sm">
          {trip && (
            <Card
              sx={{
                borderRadius: 6,
                p: 4,
                boxShadow: 6,
                bgcolor: "#fffaf3",
              }}
            >
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
              </CardContent>
            </Card>
          )}
        </Container>
      </Box>
    );
  };
  