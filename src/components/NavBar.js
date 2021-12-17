import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import TimelineIcon from '@mui/icons-material/Timeline';
import { deepOrange, deepPurple } from '@mui/material/colors';
import {
  Link
} from "react-router-dom";

import { UserContext, NavigationContext } from './Context';

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

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };
  const [state, setState] = React.useState({
    left: false
  });
  
  const renderListItem = (text) => {
    let icon = null;
    let to = "/";

    switch(text) {
      case 'Profile':
        icon = <AccountCircleIcon />
        to = "/profile";
        break;
      case 'Collaborators':
        icon = <ConnectWithoutContactIcon />
        to = "/collaborators";
        break;
      case 'Visualization':
        icon = <EqualizerIcon />
        to = "/bar-chart";
        break;
      case 'Historic':
        icon = <TimelineIcon />
        to = "/historic";
        break;
      default:
        icon = null;
    }
    
    return (
      <Link style={{textDecoration: "none", color: "black"}} to={to}>
        <ListItem button key={text}>
          <ListItemIcon>
            {icon}
          </ListItemIcon>
          <ListItemText primary={text} />
        </ListItem>
      </Link>
    );
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {['Profile', 'Collaborators'].map((text, index) => (
          renderListItem(text)
        ))}
      </List>
      <Divider />
      <List>
        {['Visualization', 'Historic'].map((text, index) => (
            renderListItem(text)
        ))}
      </List>
    </Box>
  );
  console.log(user.access_token);
  return (
    <Box 
      sx={{ flexGrow: 1 }} 
      style={{position: 'fixed',
              top: 0,
              right: 0,
              width: '100%',
              zIndex: 1
              }}>
      <AppBar position="static">
        <Toolbar>
        {(user.access_token || localStorage.getItem("accessToken"))? (
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer("left", true)}>
            <MenuIcon/>
          </IconButton>
        ) : null}
          <Drawer
                anchor={'left'}
                open={state['left']}
                onClose={toggleDrawer('left', false)}>
            <div 
              style={{
                marginLeft: "auto", 
                marginRight: "auto", 
                marginTop: "10px"}}>
              <Avatar 
                sx={{ bgcolor: deepOrange[600], 
                width: 100, 
                height: 100, 
                fontSize: "50px" }}>
                  N
                </Avatar>
            </div>
            {list('left')}
          </Drawer>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {navigation.currentPage}
          </Typography>
          {(user.access_token || localStorage.getItem("accessToken")) ? (
            <React.Fragment>
              <Button 
                color="inherit"
                onClick={() => setNavigation({
                  ...navigation,
                  currentPage: "Visualization"
                })} 
                style={buttonStyle} >
                <Link to="/bar-chart" style={linkStyle}>Visualization</Link>
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

