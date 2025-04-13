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
//import { ExpensePage } from "./pages/ExpensePage";
import { auth } from "./firebaseConfig";



function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        const userData = {
          isUserAuthenticated: true,
          user: {
            name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
            email: firebaseUser.email,
          },
        };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData.user));
      } else {
        setUser(null);
        localStorage.removeItem("user");

         // only redirect if the current path is one that needs auth
      const protectedRoutes = ["/", "/new-trip", "/trip"];
      const isProtected = protectedRoutes.some((path) =>
        window.location.pathname.startsWith(path)

      );
      if(isProtected) {
        navigate("/login");

      }
           
    }
  });

    return () => unsubscribe();
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
       

      </Routes>
    </UserContext.Provider>
  );
}

export default App;
