import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from "react-router-dom";

import { UserContext } from "../components/Context";
import { GET } from "../api/Get";
import { POST } from "../api/Post";
import useFetch from "../hooks/useFetch";
import { apiModes } from "../api/ApiProperties";
import { validateTankRegister } from "../utility/TanksUtility";

export default function AddTank() {
	const navigate = useNavigate();
	const { user, setUser } = React.useContext(UserContext);
	const [tank, setTank, doFetch] = useFetch({
		tankId: "",
		WtrLvlMin: "",
		WtrLvlMax: "",
		OxygenPercentageMin: "",
		OxygenPercentageMax: "",
		PhMin: "",
		PhMax: ""
	});
	const [pageState, setPageState] = useState({
		fieldsValidationErrorString: "",
        alertSeverity: "",
		isBusy: false,
		displayAlert: false
	});
	const updateTank = (event, prop) => {
		setTank({
			...tank,
			[prop]: event.target.value,
		});
	};

	const handleAddTank = async(e) => {
		try {
			e.preventDefault();
			console.log(tank);
			setPageState({
				...pageState,
				isBusy: true,
				displayAlert: false,
			});
			var tankValidationMessage = validateTankRegister(tank);
			console.log(tankValidationMessage);
			if (tankValidationMessage) {
				setPageState({
					...pageState,
					fieldsValidationErrorString: tankValidationMessage,
					displayAlert: true,
					alertSeverity: "error"
				});
			}
			else {
				let locSeverity = '';
				const jsonData = await doFetch("POST", apiModes.ADDTANK, true, {
					tankId: tank.tankId,
					WtrLvlMin: tank.WtrLvlMin,
					WtrLvlMax: tank.WtrLvlMax,
					OxygenPercentageMin: tank.OxygenPercentageMin,
					OxygenPercentageMax: tank.OxygenPercentageMax,
					PhMin: tank.PhMin,
					PhMax: tank.PhMax,
					accessToken: localStorage.getItem("accessToken"),
					company: user.company});
				if(jsonData.msg === 'Token has expired') {
					navigate('/log-in');
				}
				else if(jsonData.msg === 'Tank already added, please modify or delete.') {
					locSeverity = 'success';
				}
				else if(jsonData.msg === 'Success adding') {
					locSeverity = 'success';
				}

				if(jsonData.msg !== 'Token has expired') {
					setPageState({
						...pageState,
						fieldsValidationErrorString: jsonData.msg,
						alertSeverity: locSeverity,
						displayAlert: true,
						isBusy: false
					});
				}
			}
		}
		catch(error) {
			let errorMessage = "";
			if(error.message === 'Failed to fetch') {
				errorMessage = "Please check your internet connection and try again.";
			}

			setPageState({
				...pageState,
				fieldsValidationErrorString: errorMessage,
				alertSeverity: "error",
				isBusy: false
			});
		}
	};

	useEffect(() => {
		async function authenticateUser() {
			try {
				const jsonData = await doFetch("GET", apiModes.GETUSER, true, {
					accessToken: localStorage.getItem("accessToken"),
				});

				if (jsonData.msg === "Token has expired") {
					setUser({
						name: "",
						lastName: "",
						email: "",
						company: "",
						access_token: "",
					});
					navigate("/log-in");
				}
			} catch (error) {
				let errorMessage = "";
				if(error.message === 'Failed to fetch') {
					errorMessage = "Something went wrong with connection, please check your internet";
				}
				setPageState({
					...pageState,
					fieldsValidationErrorString: errorMessage,
					displayAlert: true,
					alertSeverity: "error"
				});
			}
		}
		authenticateUser();
	}, []);
	return (
		<Box
			component='form'
			noValidate
			sx={{
				marginLeft: "auto",
				marginRight: "auto",
				marginTop: "100px",
				padding: "10px",
				width: "50%",
				justifyContent: "center",
				backgroundColor: "rgba(255,255,255, 0.8)",
				borderRadius: "15px",
				textAlign: "center",
			}}
			autoComplete='off'>
			<h1>Type parameters</h1>
			<div style={{ marginTop: "5px", marginBottom: "10px" }}>
				<TextField
					id='outlined-basic'
					label='Tank Id'
					variant='outlined'
					value={tank.tankId}
					onChange={(e) => updateTank(e, "tankId")}
				/>
			</div>
			<Divider>Water Level Values</Divider>
			<div style={{ marginTop: "10px", marginBottom: "10px" }}>
				<TextField
					sx={{ }}
					id='outlined-basic'
					label='Min'
					type='number'
					variant='outlined'
					value={tank.WtrLvlMin}
					onChange={(e) => updateTank(e, "WtrLvlMin")}
				/>
				<TextField
					id='outlined-basic'
					label='Max'
					type='number'
					variant='outlined'
					value={tank.WtrLvlMax}
					onChange={(e) => updateTank(e, "WtrLvlMax")}
				/>
			</div>
			<Divider>%Oxygen Values</Divider>
			<div style={{ marginTop: "10px", marginBottom: "10px" }}>
				<TextField
					sx={{  }}
					id='outlined-basic'
					label='Min'
					type='number'
					variant='outlined'
					value={tank.OxygenPercentageMin}
					onChange={(e) => updateTank(e, "OxygenPercentageMin")}
				/>
				<TextField
					id='outlined-basic'
					label='Max'
					type='number'
					variant='outlined'
					value={tank.OxygenPercentageMax}
					onChange={(e) => updateTank(e, "OxygenPercentageMax")}
				/>
			</div>
			<Divider>PH Values</Divider>
			<div style={{ marginTop: "10px" }}>
				<TextField
					sx={{  }}
					id='outlined-basic'
					label='Min'
					type='number'
					variant='outlined'
					value={tank.PhMin}
					onChange={(e) => updateTank(e, "PhMin")}
				/>
				<TextField
					id='outlined-basic'
					label='Max'
					type='number'
					variant='outlined'
					value={tank.PhMax}
					onChange={(e) => updateTank(e, "PhMax")}
				/>
			</div>
			<div style={{display: pageState.isBusy ? "block" : "none"}}>
				<CircularProgress />
			</div>
			{pageState.displayAlert ? (
				<div 
                    style={{
                        width: "70%", 
                        marginLeft: "auto",
                        marginRight: "auto",
                        marginTop: "10px"
                    }}>
					<Alert severity={pageState.alertSeverity}>{pageState.fieldsValidationErrorString}</Alert>
				</div>
			) : null}
			<div style={{ marginTop: "10px" }}>
				<Button
					variant='contained'
					sx={{
						width: "50%",
						borderRadius: "15px",
					}}
					onClick={(e) => handleAddTank(e)}>
					Add
				</Button>
			</div>
		</Box>
	);
}
