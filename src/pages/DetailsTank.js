import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import {
	UserContext,
	NavigationContext,
	TankContext,
} from "../components/Context";
import { useLocation } from "react-router-dom";
import { styled } from "@mui/material/styles";
import socketIOClient from "socket.io-client";

import { socketApiRoute } from "../api/ApiProperties";
import { apiModes } from "../api/ApiProperties";
import useFetch from "../hooks/useFetch";
import DataSection from "../components/details_tank/DataSection";
import VisualizationSection from "../components/details_tank/VisualizationSection";

const Item = styled(Paper)(({ theme }) => ({
	...theme.typography.body2,
	padding: theme.spacing(1),
	textAlign: "center",
	color: theme.palette.text.secondary,
}));

const Alert = React.forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});

export default function DetailsTank() {
	//const { tankContextData, setTankContextData } = React.useContext(TankContext);
	//console.log(tankContextData.tankSelected);
	const { user, setUser } = useContext(UserContext);
	const location = useLocation();
	const navigate = useNavigate();
	const [tank, setTank, doFetch] = useFetch({
		WtrLvl: null,
		OxygenPercentage: null,
		Ph: null,
	});
	const [tankParameters, setTankParameters] = useState({
		WtrLvl: null,
		OxygenPercentage: null,
		Ph: null,
		WtrLvlMax: null,
		OxygenPercentageMax: null,
		PhMax: null,
	});
	const [socket, setSocket] = useState(null);
	const [componentState, setComponentState] = useState({
		notificationMessage: "",
		notificationType: "",
	});
	const [open, setOpen] = useState(false);

	const handleClose = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}
		setOpen(false);
	};
	const updateDashboard = async (data) => {
		const tankIndex = data.id.indexOf(location.state.tankId);
		if (tankIndex > -1) {
			setTank({
				WtrLvl: data.WtrLvl[tankIndex],
				OxygenPercentage: data.OxygenPercentage[tankIndex],
				Ph: data.Ph[tankIndex],
			});
		}
	};

	const stablishSocketConnection = async (jsonData) => {
		let socket = socketIOClient(socketApiRoute);
		setSocket(socket);
		socket.on("connect", () => {
			socket.emit("join_user_sessionid", {
				email: localStorage.getItem("email"),
				company: localStorage.getItem("company"),
			});
			setOpen(true);
			setComponentState({
				notificationMessage: "Successfully connected",
				notificationType: "success",
			});
		});
		socket.on("success_joinning", (msj) => {
			console.log("message from server conection: " + msj.message);
		});
		socket.on("get_tank_data", (data) => {
			console.log("------TANK DATA FROM SERVER-------");
			console.log(data);
			updateDashboard(data);
		});
		socket.on("connect_error", (err) =>
			console.log("connect_error: " + err.message)
		);
		socket.on("connect_failed", (err) =>
			console.log("connect_failed: " + err.message)
		);
		socket.on("disconnect", (err) => {
			setOpen(true);
			setComponentState({
				notificationMessage: "Connection lost :(",
				notificationType: "error",
			});
		});
		return socket;
	};

	useEffect(() => {
		var socket = null;
		const stablishConnection = async () => {
			try {
				/*httpMethod, apiMode, authorization, payload */
				const jsonData = await doFetch("GET", apiModes.FETCHTANK, true, {
					accessToken: localStorage.getItem("accessToken"),
					tankId: location.state.tankId,
				});
				console.log(jsonData);
				if (jsonData.msg === "Token has expired") {
					setUser({
						name: "",
						lastName: "",
						email: "",
						company: "",
						access_token: "",
					});
					navigate("/log-in");
				} else if (jsonData.msg === "Successfully fetched") {
					console.log("-----DETAILS TANK DATA PARAMETERS----");
					console.log(jsonData.parameters);

					setTankParameters({
						WtrLvlMin: jsonData.parameters[0].tankMinValue,
						WtrLvlMax: jsonData.parameters[0].tankMaxValue,
						OxygenPercentageMin: jsonData.parameters[1].tankMinValue,
						OxygenPercentageMax: jsonData.parameters[1].tankMaxValue,
						PhMin: jsonData.parameters[2].tankMinValue,
						PhMax: jsonData.parameters[2].tankMaxValue,
					});
					socket = await stablishSocketConnection(jsonData);
				}
				return socket;
			} catch (error) {
				setComponentState({
					notificationMessage: "Could not stablish connection :(",
					notificationType: "error",
				});
				setOpen(true);
			}
		};

		if (!socket) {
			stablishConnection();
		}

		return () => {
			console.log(socket);
			if (socket) {
				socket.close();
			}
		};
	}, []);
	return (
		<div
			style={{
				marginTop: "100px",
			}}>
			<div style={{ textAlign: "center" }}>
				<h1>Tank Visualization</h1>
			</div>
			<div style={{ marginLeft: "auto", width: "100%" }}>
				<Stack
					sx={{
						marginTop: "10px",
					}}
					justifyContent='center'
					direction={{ xs: "column", sm: "row" }}
					spacing={{ xs: 1, sm: 2, md: 4 }}>
					<DataSection tankId={location.state.tankId} tank={tankParameters} />
					<VisualizationSection
						tank={{
							WtrLvl: tank ? tank.WtrLvl : null,
							OxygenPercentage: tank ? tank.OxygenPercentage : null,
							Ph: tank ? tank.Ph : null,
						}}
						tankParameters={tankParameters}
					/>
				</Stack>
			</div>
			<Snackbar
				open={open}
				autoHideDuration={3000}
				onClose={(event, reason) => handleClose(event, reason)}>
				{componentState.notificationType ? (
					<Alert
						onClose={(event, reason) => handleClose(event, reason)}
						severity={componentState.notificationType}
						sx={{ width: "100%" }}>
						{componentState.notificationMessage}
					</Alert>
				) : null}
			</Snackbar>
		</div>
	);
}
