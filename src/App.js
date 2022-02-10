import React, { useState, useMemo, useEffect } from "react"; 
import SignUp from './pages/SignUp';
import Users from './pages/Users';
import LogIn from "./pages/LogIn";
import UserUpdate from './pages/UserUpdate';
import Tanks from './pages/Tanks';
import AddTank from './pages/AddTank';
import Historic from './pages/Historic';
import DetailsTank from "./pages/DetailsTank";
import TanksMonitor from "./pages/TanksMonitor";
import NavBar from "./components/NavBar";
import Profile from "./pages/Profile";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
//import { ThemeProvider } from "./ThemeContext";
import { UserContext, NavigationContext, TankContext } from './components/Context';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import ModifyTank from "./pages/ModifyTank";

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
  const [tankContextData, setTankContextData] = useState({
    tankSelected: ""
  });

  const providerNavigation = useMemo(() => ({navigation, setNavigation}), [navigation, setNavigation]);
  const providerUser = useMemo(() => ({user, setUser}), [user, setUser]);
  const providerTank = useMemo(() => ({tankContextData, setTankContextData}), [tankContextData, setTankContextData]);

  useEffect(() => {
    if(!user.name) {
      setUser({
        name: localStorage.getItem("name"),
        lastName: localStorage.getItem("lastName"),
        email: localStorage.getItem("email"),
        company: localStorage.getItem("company")
      })
    }
  }, [])

  return (
    <Router>
      <NavigationContext.Provider value={providerNavigation}>
        <UserContext.Provider value={providerUser}>
          <TankContext.Provider value={providerTank}>
            <NavBar />
            <Routes>
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/log-in" element={<LogIn/>} />
              <Route path="/tanks-monitor" element={<TanksMonitor/>} />
              <Route path="/profile" element={<Profile/>} />
              <Route path="/users" element={<Users/>} />
              <Route path="/tanks" element={<Tanks/>} />
              <Route path="/add-tank" element={<AddTank/>} />
              <Route path="/modify-tank" element={<ModifyTank/>} />
              <Route path="/details-tank" element={<DetailsTank/>} />
              <Route path="/historic" element={<LocalizationProvider dateAdapter={AdapterDateFns}><Historic/></LocalizationProvider>} />
              <Route path="/update-user" element={<UserUpdate/>} />
            </Routes>
          </TankContext.Provider>
        </UserContext.Provider>
      </NavigationContext.Provider>
    </Router>

  );
}

export default App;
