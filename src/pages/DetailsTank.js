import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import {
	UserContext,
	NavigationContext,
	TankContext,
} from "../components/Context";
import {
    useLocation
} from 'react-router-dom';

export default function DetailsTank() {
	//const { tankContextData, setTankContextData } = React.useContext(TankContext);
	//console.log(tankContextData.tankSelected);
	const location = useLocation();

    useEffect(() => {
        console.log(`name passed: ${location.state.name}`);
    }, []);
	return (
		<Box
			sx={{
				width: 300,
				height: 300,
				backgroundColor: "primary.dark",
				"&:hover": {
					backgroundColor: "primary.main",
					opacity: [0.9, 0.8, 0.7],
				},
			}}>
			<h1>Tank name Details: {location.state.tankSelected}</h1>
		</Box>
	);
}
