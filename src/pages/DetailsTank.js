import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import {
	UserContext,
	NavigationContext,
	TankContext,
} from "../components/Context";
import { useLocation } from "react-router-dom";
import { styled } from '@mui/material/styles';

import DataSection from "../components/details_tank/DataSection";
import VisualizationSection from "../components/details_tank/VisualizationSection";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));


export default function DetailsTank() {
	//const { tankContextData, setTankContextData } = React.useContext(TankContext);
	//console.log(tankContextData.tankSelected);
	const location = useLocation();

	useEffect(() => {
		console.log(`name passed: ${location.state.tankId}`);
	}, []);
	return (
		<div>
			<Stack
				sx={{
					marginTop: "100px"
				}}
				justifyContent="center"
				direction={{ xs: "column", sm: "row" }}
				spacing={{ xs: 1, sm: 2, md: 4 }}>
				<DataSection tankId={location.state.tankId}/>
				<VisualizationSection />
				
			</Stack>
		</div>
	);
}
