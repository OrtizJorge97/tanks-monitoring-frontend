import React from "react";
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import Avatar from '@mui/material/Avatar';
import BuildIcon from '@mui/icons-material/Build';
import GroupIcon from '@mui/icons-material/Group';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import TimelineIcon from '@mui/icons-material/Timeline';
import {
    Link
} from "react-router-dom";

import {
    returnVisualization, 
    returnUserOptions, 
    returnTanksOptions
} from "../utility/Accounts";


function stringToColor(string) {
	let hash = 0;
	let i;

	/* eslint-disable no-bitwise */
	for (i = 0; i < string.length; i += 1) {
		hash = string.charCodeAt(i) + ((hash << 5) - hash);
	}

	let color = "#";

	for (i = 0; i < 3; i += 1) {
		const value = (hash >> (i * 8)) & 0xff;
		color += `00${value.toString(16)}`.substr(-2);
	}
	/* eslint-enable no-bitwise */

	return color;
}

function stringAvatar(name) {
	return {
		sx: {
			bgcolor: stringToColor(name),
			margin: "auto",
			width: 150,
			height: 150,
			fontSize: "70px",
		},
		children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
	};
}

export default function SideBar(props) {
    const { toggleDrawer, state } = props;
    console.log(localStorage.getItem("role"));
    
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
            to = "/tanks-monitor";
            break;
          case 'Historic':
            icon = <TimelineIcon />
            to = "/historic";
            break;
          case 'Users':
            icon = <GroupIcon />
            to = '/users';
            break;
            case 'Tanks':
            icon = <RemoveRedEyeIcon />
            to = '/tanks';
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
            {localStorage.getItem("role") ? returnUserOptions(localStorage.getItem("role")).map((text, index) => (
              renderListItem(text)
            )) : null}
          </List>
          <Divider />
          <List>
            {localStorage.getItem("role") ? returnVisualization(localStorage.getItem("role")).map((text, index) => (
                renderListItem(text)
            )) : null}
          </List>
          <Divider />
          <List>
            {returnTanksOptions(localStorage.getItem("role")) ? (returnTanksOptions(localStorage.getItem("role")).map((text, index) => (
                renderListItem(text)
            ))) : null}
          </List>
        </Box>
    );

    return(
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
                  {...stringAvatar(`${localStorage.getItem("name")} ${localStorage.getItem("lastName")}`)} 
                />
            </div>
            {list('left')}
        </Drawer>
    );
}