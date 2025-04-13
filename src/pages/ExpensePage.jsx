// src/pages/ExpensePage.jsx
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Grid,
    Typography,
    TextField,
    MenuItem,
    Chip,
    Paper,
    Alert,
  } from "@mui/material";
  import { useParams, useNavigate } from "react-router-dom";
  import { useEffect, useState, useContext } from "react";
  import {
    doc,
    getDoc,
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
  } from "firebase/firestore";
  import { db, auth } from "../firebaseConfig";
  import AddIcon from "@mui/icons-material/Add";
  import EditIcon from "@mui/icons-material/Edit";
  import DeleteIcon from "@mui/icons-material/Delete";
  import UserContext from "../context/UserContext";
  import ReceiptIcon from "@mui/icons-material/Receipt";
  
  export const ExpensePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(UserContext) || {};
    const [trip, setTrip] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreator, setIsCreator] = useState(false);
    const [newExpense, setNewExpense] = useState({
      category: "",
      amount: "",
      description: "",
    });
    const [editingExpense, setEditingExpense] = useState(null);
    const [budgetExceeded, setBudgetExceeded] = useState(false);
  
    const categories = [
      "accommodation",
      "transportation",
      "food",
      "activities",
      "flight ticket",
      "others",
    ];
  
    useEffect(() => {
      const fetchTripAndExpenses = async () => {
        setLoading(true);
        // Fetch trip
        const tripRef = doc(db, "trips", id);
        const tripSnap = await getDoc(tripRef);
        if (tripSnap.exists()) {
          const tripData = { id: tripSnap.id, ...tripSnap.data() };
          setTrip(tripData);
          setIsCreator(tripData.creatorId === auth.currentUser?.uid);
        } else {
          setTrip(null);
        }
  
        // Fetch expenses
        const expenseCollection = collection(db, `trips/${id}/expenses`);
        const expenseSnapshot = await getDocs(expenseCollection);
        const expenseList = expenseSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setExpenses(expenseList);
  
        // Check budget
        const totalExpenses = expenseList.reduce(
          (sum, exp) => sum + Number(exp.amount),
          0
        );
        setBudgetExceeded(totalExpenses > Number(tripSnap.data()?.budget || 0));
  
        setLoading(false);
      };
  
      fetchTripAndExpenses();
    }, [id]);
  
    const handleAddExpense = async () => {
      if (!newExpense.category || !newExpense.amount) {
        alert("Please fill in category and amount.");
        return;
      }
  
      try {
        const expenseData = {
          ...newExpense,
          amount: Number(newExpense.amount),
          creatorId: auth.currentUser.uid,
          visibility: trip.visibility,
          createdAt: new Date().toISOString(),
        };
  
        const expenseRef = await addDoc(
          collection(db, `trips/${id}/expenses`),
          expenseData
        );
        setExpenses([...expenses, { id: expenseRef.id, ...expenseData }]);
        setNewExpense({ category: "", amount: "", description: "" });
  
        // Check budget
        const totalExpenses =
          expenses.reduce((sum, exp) => sum + Number(exp.amount), 0) +
          Number(newExpense.amount);
        setBudgetExceeded(totalExpenses > Number(trip.budget));
        alert("Expense added successfully!");
      } catch (error) {
        console.error("Error adding expense:", error.message);
        alert("Error adding expense: " + error.message);
      }
    };
  
    const handleEditExpense = async (expense) => {
      if (!editingExpense.category || !editingExpense.amount) {
        alert("Please fill in category and amount.");
        return;
      }
  
      try {
        const expenseRef = doc(db, `trips/${id}/expenses`, expense.id);
        await updateDoc(expenseRef, {
          category: editingExpense.category,
          amount: Number(editingExpense.amount),
          description: editingExpense.description,
          updatedAt: new Date().toISOString(),
        });
  
        setExpenses(
          expenses.map((exp) =>
            exp.id === expense.id
              ? {
                  ...exp,
                  category: editingExpense.category,
                  amount: Number(editingExpense.amount),
                  description: editingExpense.description,
                }
              : exp
          )
        );
        setEditingExpense(null);
  
        // Check budget
        const totalExpenses = expenses
          .map((exp) =>
            exp.id === expense.id
              ? Number(editingExpense.amount)
              : Number(exp.amount)
          )
          .reduce((sum, amt) => sum + amt, 0);
        setBudgetExceeded(totalExpenses > Number(trip.budget));
        alert("Expense updated successfully!");
      } catch (error) {
        console.error("Error updating expense:", error.message);
        alert("Error updating expense: " + error.message);
      }
    };
  
    const handleDeleteExpense = async (expenseId) => {
      const confirmDelete = window.confirm("Are you sure you want to delete this expense?");
      if (confirmDelete) {
        try {
          await deleteDoc(doc(db, `trips/${id}/expenses`, expenseId));
          const updatedExpenses = expenses.filter((exp) => exp.id !== expenseId);
          setExpenses(updatedExpenses);
  
          // Check budget
          const totalExpenses = updatedExpenses.reduce(
            (sum, exp) => sum + Number(exp.amount),
            0
          );
          setBudgetExceeded(totalExpenses > Number(trip.budget));
          alert("Expense deleted successfully!");
        } catch (error) {
          console.error("Error deleting expense:", error.message);
          alert("Error deleting expense: " + error.message);
        }
      }
    };
  
    if (loading) {
      return <Typography>Loading...</Typography>;
    }
  
    if (!trip) {
      return <Typography>Trip not found.</Typography>;
    }
  
    return (
      <Box sx={{ bgcolor: "#f1ede8", minHeight: "100vh", py: 8 }}>
        <Container maxWidth="md">
          <Typography
            variant="h3"
            fontWeight="bold"
            gutterBottom
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <ReceiptIcon /> Expense Tracker for {trip.title}
          </Typography>
  
          {budgetExceeded && (
            <Alert severity="warning" sx={{ mb: 4 }}>
              Warning: Total expenses exceed the trip budget!
            </Alert>
          )}
  
          <Box mb={5}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Trip Details:
            </Typography>
            <Card sx={{ bgcolor: "#fff5ed", borderRadius: 5, p: 2 }}>
              <CardContent>
                <Typography>
                  <strong>Trip Total Budget:</strong> {trip.currency} {trip.budget}
                </Typography>
                <Typography>
                  <strong>Start Date:</strong> {trip.startDate}
                </Typography>
                <Typography>
                  <strong>End Date:</strong> {trip.endDate}
                </Typography>
              </CardContent>
            </Card>
          </Box>
  
          {isCreator && (
            <Box mb={5}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Add New Expense:
              </Typography>
              <Card sx={{ bgcolor: "#fff5ed", borderRadius: 5, p: 2 }}>
                <CardContent>
                  <Box display="flex" flexDirection="column" gap={3}>
                    <TextField
                      label="Category"
                      select
                      fullWidth
                      value={newExpense.category}
                      onChange={(e) =>
                        setNewExpense({ ...newExpense, category: e.target.value })
                      }
                    >
                      {categories.map((cat) => (
                        <MenuItem key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </MenuItem>
                      ))}
                    </TextField>
                    <TextField
                      label="Amount"
                      type="number"
                      fullWidth
                      value={newExpense.amount}
                      onChange={(e) =>
                        setNewExpense({ ...newExpense, amount: e.target.value })
                      }
                    />
                    <TextField
                      label="Description"
                      fullWidth
                      value={newExpense.description}
                      onChange={(e) =>
                        setNewExpense({
                          ...newExpense,
                          description: e.target.value,
                        })
                      }
                    />
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={handleAddExpense}
                      sx={{ bgcolor: "#6e4f3a" }}
                    >
                      Add Expense
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          )}
  
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Your Expenses:
          </Typography>
  
          {expenses.length === 0 ? (
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
              <ReceiptIcon sx={{ fontSize: 60, mb: 2, color: "#b98e69" }} />
              <Typography variant="h6">
                No expenses found. Start by adding one! 💸
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={4}>
              {expenses
                .filter(
                  (expense) =>
                    expense.visibility === "public" ||
                    expense.creatorId === auth.currentUser?.uid
                )
                .map((expense) => (
                  <Grid item xs={12} sm={6} key={expense.id}>
                    <Card
                      sx={{
                        borderRadius: 5,
                        bgcolor: "#fff5ed",
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
                          {expense.category.charAt(0).toUpperCase() +
                            expense.category.slice(1)}
                        </Typography>
                        <Typography sx={{ color: "#7b4c4c", fontSize: 15 }}>
                          💰 Amount: {trip.currency} {expense.amount}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ mt: 1, color: "#5f4339" }}
                        >
                          📝 {expense.description || "No description"}
                        </Typography>
                        {isCreator && (
                          <Box mt={2} display="flex" gap={2}>
                            <Button
                              variant="contained"
                              startIcon={<EditIcon />}
                              onClick={() => setEditingExpense(expense)}
                              sx={{ bgcolor: "#1976d2" }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outlined"
                              startIcon={<DeleteIcon />}
                              color="error"
                              onClick={() => handleDeleteExpense(expense.id)}
                            >
                              Delete
                            </Button>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
            </Grid>
          )}
  
          {editingExpense && (
            <Box mt={5}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Edit Expense:
              </Typography>
              <Card sx={{ bgcolor: "#fff5ed", borderRadius: 5, p: 2 }}>
                <CardContent>
                  <Box display="flex" flexDirection="column" gap={3}>
                    <TextField
                      label="Category"
                      select
                      fullWidth
                      value={editingExpense.category}
                      onChange={(e) =>
                        setEditingExpense({
                          ...editingExpense,
                          category: e.target.value,
                        })
                      }
                    >
                      {categories.map((cat) => (
                        <MenuItem key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </MenuItem>
                      ))}
                    </TextField>
                    <TextField
                      label="Amount"
                      type="number"
                      fullWidth
                      value={editingExpense.amount}
                      onChange={(e) =>
                        setEditingExpense({
                          ...editingExpense,
                          amount: e.target.value,
                        })
                      }
                    />
                    <TextField
                      label="Description"
                      fullWidth
                      value={editingExpense.description}
                      onChange={(e) =>
                        setEditingExpense({
                          ...editingExpense,
                          description: e.target.value,
                        })
                      }
                    />
                    <Box display="flex" gap={2}>
                      <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        onClick={() => handleEditExpense(editingExpense)}
                        sx={{ bgcolor: "#1976d2" }}
                      >
                        Save
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => setEditingExpense(null)}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          )}
        </Container>
      </Box>
    );
  };