import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { Bar } from "react-chartjs-2";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";

import useFetch from "../hooks/useFetch";
import { GET } from "../api/Get";
import ChartComponent from "../components/ChartComponent";
import { socketApiRoute } from "../api/ApiProperties";
import { UserContext, NavigationContext } from "../components/Context";
import { apiModes } from "../api/ApiProperties";
import TanksList from "../components/TanksList";

import socketIOClient from "socket.io-client";
const ENDPOINT = socketApiRoute;

const categories = ["Water Level", "%Oxygen", "Ph"];
const dataFromServerDummy = {
	tanks: ["MT001", "MT002", "MT003", "MT004", "MT005"],
	data: [10, 5, 2, 6, 8],
};
const Item = styled(Paper)(({ theme }) => ({
	...theme.typography.body2,
	padding: theme.spacing(1),
	textAlign: "center",
	color: theme.palette.text.secondary,
}));

const Alert = React.forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});

function BarChart() {
	document.title = "Visualization";
	const navigate = useNavigate();
	const {navigation, setNavigation} = React.useContext(NavigationContext);
	const { user, setUser } = useContext(UserContext);
	const [open, setOpen] = useState(false);
	const [tanksSelected, setTanksSelected] = useState([]);
	const [tanks, setTanks, doFetch] = useFetch([]);
	const [tanksData, setTanksData] = useState({
		id: [],
		company: "",
		WtrLvl: [],
		OxPercentage: [],
		Ph: [],
	});
	const [localUser, setLocalUser] = useState({
		name: "",
		lastName: "",
		email: "",
		company: "",
	});
	const [socket, setSocket] = useState(null);
	const [componentState, setComponentState] = useState({
		notificationMessage: "",
		notificationType: "",
	});
	const [scaleRanges, setScaleRanges] = useState({
		min: 0,
		max: 500,
	});
	const [category, setCategory] = useState("Water Level");
	
	const handleClose = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}
		setOpen(false);
	};
	const updateTanksSelected = async (tanksSelected) => {
		setTanksSelected(tanksSelected);
	};

	const stablishSocketConnection = (jsonData) => {
		var socket = socketIOClient(ENDPOINT);
		socket.on("connect", () => {
			setOpen(true);
			setSocket(socket);
			setComponentState({
				notificationMessage: "Successfully connected",
				notificationType: "success",
			});

			console.log("email " + jsonData.email);
			console.log("name " + jsonData.name);
			if (jsonData.email) {
				socket.emit("join_user_sessionid", {
					email: jsonData.email,
					company: jsonData.company,
				});
			}
		});
		socket.on("message", (msj) => {
			console.log("message from server conection: " + msj);
		});
		socket.on("success_joinning", (msj) => {
			console.log("message from server conection: " + msj.message);
		});
		socket.on('tanks_data', (data) => {
			console.log("----FROM SOCKET TANKS DATA------")
			console.log(data)
			setTanksData({
				id: data.id,
				company: data.company,
				WtrLvl: data.WtrLvl,
				OxPercentage: data.OxygenPercentage,
				Ph: data.Ph,
			});
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
		setNavigation({
			...navigation,
			currentPage: "Monitor Tanks"
		});
		var socket = null;
		async function stablishConnection() {
			try {
				var connectionStablished = false;
				const jsonData = await doFetch("GET", apiModes.FETCHTANKS, true, {
					accessToken: localStorage.getItem("accessToken"),
				});

				if (jsonData.msg === "Success fetching") {
					connectionStablished = true;
					setTanks(jsonData.tanks);
					setUser({
						name: jsonData.name,
						email: jsonData.email,
						role: jsonData.role,
						company: jsonData.company,
					});
				} else if (jsonData.msg === "Token has expired") {
					localStorage.setItem("accessToken", "");
					localStorage.setItem("refreshToken", "");
					setUser({
						name: "",
						lastName: "",
						email: "",
						company: "",
						access_token: "",
					});
					navigate("/log-in");
				}

				if (connectionStablished) {
					socket = stablishSocketConnection(jsonData);
				}
			} catch (error) {
				setComponentState({
					notificationMessage: "Could not stablish connection :(",
					notificationType: "error",
				});
				setOpen(true);
			}
		}
		if (!socket) {
			stablishConnection();
		} else {
		}
		return () => {
			if (socket) {
				socket.close();
			}
		};
	}, []);

	return (
		<div
			style={{
				marginTop: "90px",
				color: "black",
			}}>
			<div style={{ textAlign: "center" }}>
				<h1 style={{fontSize: "30px", fontWeight: 500}}>{localStorage.getItem("company")} Tanks</h1>
				<FormControl component='fieldset'>
					<FormLabel
						sx={{
							color: "black",
						}}
						component='legend'>
						Select a Category
					</FormLabel>
					<RadioGroup
						row={true}
						aria-label='gender'
						defaultValue={"Water Level"}
						name='radio-buttons-group'
						onChange={(e) => {
							console.log(e.target.value);
							setCategory(e.target.value);
						}}>
						<FormControlLabel
							value={categories[0]}
							control={<Radio sx={{ color: "black" }} />}
							label={categories[0]}
						/>
						<FormControlLabel
							value={categories[1]}
							control={<Radio sx={{ color: "black" }} />}
							label={categories[1]}
						/>
						<FormControlLabel
							value={categories[2]}
							control={<Radio sx={{ color: "black" }} />}
							label={categories[2]}
						/>
					</RadioGroup>
				</FormControl>
			</div>
			<Stack
				direction={{ xs: "column", sm: "row" }}
				justifyContent='space-evenly'
				alignItems='center'
				spacing={2}
				mt={5}>
				<div
					style={{
						backgroundColor: "rgba(255, 255, 255, 0.7)",
						padding: "10px",
						borderRadius: "15px",
						width: "auto",
					}}>
					<h3 style={{ color: "black", fontWeight: 500 }}>Tanks Available</h3>
					<TanksList
						allTanks={tanks}
						updateTanksSelected={updateTanksSelected}
					/>
				</div>
				<div
					style={{
						width: "60%",
						marginLeft: "15px",
						backgroundColor: "rgba(255, 255, 255, 0.7)",
						borderRadius: "15px",
						padding: "15px",
					}}>
					<ChartComponent
						scaleRanges={scaleRanges}
						setScaleRanges={setScaleRanges}
						tanksSelected={tanksSelected}
						tanksData={tanksData}
						category={category}
					/>
				</div>
			</Stack>
			<Snackbar
				open={open}
				autoHideDuration={3000}
				onClose={() => handleClose()}>
				{componentState.notificationType ? (
					<Alert
						onClose={handleClose}
						severity={componentState.notificationType}
						sx={{ width: "100%" }}>
						{componentState.notificationMessage}
					</Alert>
				) : null}
			</Snackbar>
		</div>
	);
}

export default BarChart;
