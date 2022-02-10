import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import useFetch from "../hooks/useFetch";
import { apiModes } from "../api/ApiProperties";

export default function UserUpdate() {
	const navigate = useNavigate();
	const location = useLocation();
	const [pageState, setPageState] = useState({
		isBusy: false,
		alertSeverity: "",
		msg: ""

	});
	const [user, setUser, doFetch] = useFetch({
		id: null,
		name: "",
		lastName: "",
		email: "",
		role: "Operator",
	});
	const handleChange = (e, prop) => {
		setUser({
			...user,
			[prop]: e.target.value,
		});
	};
	const errorHandler = (error) => {
		let messageInterpreted = "";
		let severityType = "error";
		if (error.message === 'Failed to fetch') {
			messageInterpreted = "Please check your internet connection and try again."
		}
		setPageState({
			isBusy: false,
			msg: messageInterpreted,
			alertSeverity: severityType
		});
	}
	const handleUpdateUser = async (e) => {
		try { //(httpMethod, apiMode, authorization, payload)
			console.log(user);
			const jsonData = await doFetch("PUT", apiModes.UPDATEUSER, true, {
				accessToken: localStorage.getItem("accessToken"),
				user
			});
			console.log(jsonData);
			if (jsonData.msg === "Token has expired") {
				navigate("/log-in");
			}
			if (jsonData.msg === "Succesfully updated") {
				setPageState({
					isBusy: false,
					msg: jsonData.msg,
					alertSeverity: "success"
				});
				setUser({
					id: jsonData.user.id,
					name: jsonData.user.name,
					lastName: jsonData.user.lastName,
					email: jsonData.user.email,
					role: jsonData.user.role,
				});
			}
		}
		catch (error) {
			errorHandler(error);
		}
	};
	const fetchUser = async () => {
		try { //(httpMethod, apiMode, authorization, payload)
			setPageState({
				isBusy: true,
				msg: ""
			});
			const jsonData = await doFetch("GET", apiModes.FETCHUSER, true, {
				accessToken: localStorage.getItem("accessToken"),
				email: location.state.email
			});
			console.log(jsonData);
			if (jsonData.msg === "Token has expired") {
				navigate("/log-in");
			}
			if (jsonData.msg === "Succesfully fetched") {
				setPageState({
					isBusy: false,
					msg: jsonData.msg,
					alertSeverity: "success"
				});
				setUser({
					id: jsonData.user.id,
					name: jsonData.user.name,
					lastName: jsonData.user.lastName,
					email: jsonData.user.email,
					role: jsonData.user.role,
				});
			}
		} catch (error) {
			errorHandler(error);
		}
	};
	useEffect(() => {
		fetchUser();
	}, []);
	return (
		<Box
			style={{
				height: 400,
				width: "80%",
				marginLeft: "auto",
				marginRight: "auto",
				marginTop: "100px",
				padding: "15px",
				borderRadius: "10px",
				backgroundColor: "rgba(0, 0, 0, 0)",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				textAlign: "center"
			}}>
			<h1>User page {location.state.email}</h1>
			<div>
				<TextField
					style={{ width: "50%", marginBottom: "15px" }}
					id='outlined-basic'
					label={"Name" || ""}
					variant='outlined'
					value={user.name}
					onChange={(e) => handleChange(e, "name")}
				/>
			</div>
			<div>
				<TextField
					style={{ width: "50%", marginBottom: "15px" }}
					id='outlined-basic'
					label={"Last Name" || ""}
					variant='outlined'
					value={user.lastName}
					onChange={(e) => handleChange(e, "lastName")}
				/>
			</div>
			<div>
				<TextField
					style={{ width: "50%", marginBottom: "10px" }}
					id='outlined-basic'
					label='Email'
					variant='outlined'
					value={user.email}
					onChange={(e) => handleChange(e, "email")}
				/>
			</div>
			<div>
				<FormControl
					sx={{
						marginBottom: "10px",
						width: "50%"
					}}>
					<InputLabel id='demo-simple-select-label'>Role</InputLabel>
					<Select
						labelId='demo-simple-select-label'
						id='demo-simple-select'
						value={user.role}
						label='Role'
						onChange={(e) => handleChange(e, "role")}>
						<MenuItem value={"Supervisor"}>Supervisor</MenuItem>
						<MenuItem value={"Administrator"}>Administrator</MenuItem>
						<MenuItem value={"Operator"}>Operator</MenuItem>
					</Select>
				</FormControl>
			</div>
			<div style={{ display: pageState.isBusy ? "block" : "none" }}>
				<CircularProgress />
			</div>
			{pageState.msg ? (
				<div
					style={{
						width: "50%",
						marginLeft: "auto",
						marginRight: "auto",
						marginTop: "10px",
					}}>
					<Alert severity={pageState.alertSeverity}>{pageState.msg}</Alert>
				</div>
			) : null}
			<div style={{ marginTop: "10px" }}>
				<Button
					variant='contained'
					sx={{
						width: "50%",
						borderRadius: "15px",
					}}
					onClick={(e) => handleUpdateUser(e)}>
					Update
				</Button>
			</div>
		</Box>
	);
}
