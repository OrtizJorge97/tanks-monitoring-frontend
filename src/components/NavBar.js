import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import {
  Link
} from "react-router-dom";

import { UserContext, NavigationContext } from './Context';
import SideBar from "./SideBar";


export default function NavBar() {

  const linkStyle = {
    textDecoration: 'none',
    color: "white"
  };
  const buttonStyle = {
    color: 'white'
  }
  const {navigation, setNavigation} = React.useContext(NavigationContext);
  const {user, setUser} = React.useContext(UserContext);
  const [state, setState] = React.useState({
    left: false
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };
  
  return (
    <Box 
      sx={{ 
        flexGrow: 1
      }} 
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '100%',
        zIndex: 1}}>
      <AppBar 
        position="static" 
        sx={{ 
          backgroundColor: "#54008c"
        }}>
        <Toolbar>
        {(user.access_token || localStorage.getItem("accessToken"))? (
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer("left", true)}>
            <MenuIcon sx={{
              fontSize: "40px"
            }}/>
          </IconButton>
        ) : null}
          <SideBar toggleDrawer={toggleDrawer} state={state}/>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {navigation.currentPage}
          </Typography>
          {(user.access_token || localStorage.getItem("accessToken")) ? (
            <React.Fragment>
              <Button 
                onClick={() => setNavigation({
                  ...navigation,
                  currentPage: "Home"
                })} 
                style={buttonStyle} 
                color="inherit">
                <Link to="/" style={linkStyle}>Home</Link>
              </Button>
              <Button 
                color="inherit"
                onClick={() => {
                  localStorage.setItem("accessToken", "");
                  localStorage.setItem("refreshToken", "");
                  setUser({
                    name: "",
                    lastName: "",
                    company: "",
                    access_token: ""
                  })
                }}
                style={buttonStyle}>
                <Link to="/log-in" style={linkStyle}>Log Out</Link>
              </Button>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Button 
                onClick={() => setNavigation({
                  ...navigation,
                  currentPage: "Home"
                })} 
                style={buttonStyle} 
                color="inherit">
                <Link to="/" style={linkStyle}>Home</Link>
              </Button>
              <Button 
                onClick={() => setNavigation({
                  ...navigation,
                  currentPage: "Sign Up"
                })} 
                style={buttonStyle} 
                color="inherit">
                <Link to="/sign-up" style={linkStyle}>Sign Up</Link>
              </Button>

              <Button 
                color="inherit"
                onClick={() => setNavigation({
                  ...navigation,
                  currentPage: "Log In"
                })} 
                style={buttonStyle} >
                <Link to="/log-in" style={linkStyle}>Log In</Link>
              </Button>
            </React.Fragment>
          )}
      
        </Toolbar>
      </AppBar>
    </Box>
  );
}

