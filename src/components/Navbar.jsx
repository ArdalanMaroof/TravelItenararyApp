import {
  AppBar,
  Box,
  Button,
  Toolbar,
  Typography,
} from "@mui/material";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import UserContext from "../context/UserContext";

const Navbar = () => {
  const navigate = useNavigate();

  const data = useContext(UserContext);

  const handleSignout = async () => {
    await signOut(auth);
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <div>
      <AppBar component="nav">
        <Toolbar>
          <Box display="flex" justifyContent="space-between" width="100%">
            <Box display="flex" gap="20px" alignItems="center">
              <Typography>Welcome, {data.user.name}</Typography>
              <Button className="navButton" variant="outlined" onClick={() => navigate("/")}>
                 Home
              </Button>

            </Box>

            <Box display="flex" gap="8px">
              
              <Button variant="contained" color="error" onClick={handleSignout}>
                Signout
              </Button>
            </Box>
            

          </Box>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navbar;
