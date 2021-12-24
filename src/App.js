import React, { useState, useMemo } from "react"; 
import SignUp from './pages/SignUp';
import Users from './pages/Users';
import LogIn from "./pages/LogIn";
import Tanks from './pages/Tanks';
import Button from '@mui/material/Button';
import BarChart from "./components/BarChart";
import NavBar from "./components/NavBar";
import Profile from "./components/Profile";
//import { ThemeProvider } from "./ThemeContext";
import { UserContext, NavigationContext } from './components/Context';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

function App() {
  const [navigation, setNavigation] = useState({
    currentPage: ""
  });
  const [user, setUser] = useState({
    name: "",
    lastName: "",
    email: "",
    company: "",
    access_token: ""
  });

  const providerNavigation = useMemo(() => ({navigation, setNavigation}), [navigation, setNavigation]);
  const providerUser = useMemo(() => ({user, setUser}), [user, setUser]);

  return (
    <Router>
      <NavigationContext.Provider value={providerNavigation}>
        <UserContext.Provider value={providerUser}>
          <NavBar />
          <Routes>
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/log-in" element={<LogIn/>} />
            <Route path="/bar-chart" element={<BarChart/>} />
            <Route path="/profile" element={<Profile/>} />
            <Route path="/users" element={<Users/>} />
            <Route path="/tanks" element={<Tanks/>} />
          </Routes>
        </UserContext.Provider>
      </NavigationContext.Provider>
    </Router>

  );
}

export default App;
