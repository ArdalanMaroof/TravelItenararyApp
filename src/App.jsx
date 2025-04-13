// src/App.jsx
import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import { HomePage } from "./pages/HomePage";
import { SignupPage } from "./pages/SignupPage";
import { LoginPage } from "./pages/LoginPage";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import UserContext from "./context/UserContext";
import { NewTripPage } from "./pages/NewTripPage";
import { TripDetailsPage } from "./pages/TripDetailsPage";
import { ExpensePage } from "./pages/ExpensePage";


function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userFromStorage = JSON.parse(localStorage.getItem("user"));

    if (!userFromStorage) {
      navigate("/login");
    } else {
      setUser({
        isUserAuthenticated: true,
        user: {
          name: userFromStorage.displayName,
          email: userFromStorage.email,
        },
      });
    }
  }, []);

  return (
    <UserContext.Provider value={user}>
      {user?.isUserAuthenticated ? <Navbar /> : null}
      <Routes>
        <Route element={<HomePage />} path="/" />
        <Route element={<SignupPage />} path="/signup" />
        <Route element={<LoginPage />} path="/login" />
        <Route element={<NewTripPage />} path="/new-trip" />
        <Route element={<TripDetailsPage />} path="/trip/:id" />
        {/* Route to ExpensePage for managing trip expenses */}
        <Route element={<ExpensePage />} path="/trip/:id/expenses" />

      </Routes>
    </UserContext.Provider>
  );
}

export default App;
