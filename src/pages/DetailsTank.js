import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import {
	UserContext,
	NavigationContext,
	TankContext,
} from "../components/Context";

export default function DetailsTank() {
	const { tankContextData, setTankContextData } = React.useContext(TankContext);
	console.log(tankContextData.tankSelected);

	useEffect(() => {}, []);
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
			<h1>Tank name Details: {tankContextData.tankSelected}</h1>
		</Box>
	);
}
