import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

export default function DataSection(props) {
	const navigate = useNavigate();
	const { tankId, tank } = props;
	//const [tankData, setTankData] = useState(tank);

	console.log("----DATA SECTION TANK DATA--------");
	console.log(tank);

	useEffect(() => {}, []);
	return (
		<div
			style={{
				width: "40%",
				backgroundColor: "",
				textAlign: "center",
			}}>
			<div style={{ marginBottom: "15px" }}>
				<Button sx={{backgroundColor: "#54008c"}} variant='contained'>
					<Link
						style={{
							textDecoration: "none",
							color: "white",
						}}
						to='/tanks'>
						Go back
					</Link>
				</Button>
			</div>
			<h2>{tankId}</h2>
			<h4>Water Level</h4>
			<Stack justifyContent='center' direction='row' spacing={2}>
				<span>Min: {tank ? tank.WtrLvlMin : "--"}</span>
				<span>Max: {tank ? tank.WtrLvlMax : "--"}</span>
			</Stack>

			<h4>%Oxygen</h4>
			<Stack justifyContent='center' direction='row' spacing={2}>
				<span>Min: {tank ? tank.OxygenPercentageMin : "--"}</span>
				<span>Max: {tank ? tank.OxygenPercentageMax : "--"}</span>
			</Stack>

			<h4>Ph</h4>
			<Stack justifyContent='center' direction='row' spacing={2}>
				<span>Min: {tank ? tank.PhMin : "--"}</span>
				<span>Max: {tank ? tank.PhMax : "--"}</span>
			</Stack>
		</div>
	);
}
