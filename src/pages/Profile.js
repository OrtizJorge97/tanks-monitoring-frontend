import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import { deepOrange, deepPurple } from "@mui/material/colors";
import BusinessIcon from "@mui/icons-material/Business";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";
import { styled } from "@mui/material/styles";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import useFetch from "../hooks/useFetch";
import { UserContext, NavigationContext } from "../components/Context";
import { GET } from "../api/Get";
import { apiModes } from "../api/ApiProperties";

const Item = styled(Paper)(({ theme }) => ({
	...theme.typography.body2,
	padding: theme.spacing(1),
	textAlign: "center",
	width: "100%",
	color: theme.palette.text.secondary,
}));

const skelethonStyle = {
	margin: "auto",
};

const Alert = React.forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

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

export default function Profile() {
	const { user, setUser } = React.useContext(UserContext);
	const {navigation, setNavigation} = React.useContext(NavigationContext);
	const [open, setOpen] = useState(false);
	const navigate = useNavigate();
	document.title = "User";
	const [localUser, setLocalUser, doFetch] = useFetch({
		name: "",
		lastName: "",
		email: "",
		role: "",
		company: "",
	});
	const [componentState, setComponentState] = useState({
		notificationMessage: "",
		notificationType: "",
	});

	const handleClose = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}

		setOpen(false);
	};

	useEffect(() => {
		setNavigation({
			...navigation,
			currentPage: "Profile"
		});
		async function getUser() {
			try {
				const jsonData = await doFetch("GET", apiModes.GETUSER, true, {
					accessToken: localStorage.getItem("accessToken"),
				});

				if (jsonData.msg === "Succesfully authenticated") {
					setLocalUser({
						name: jsonData.name,
						lastName: jsonData.last_name,
						email: jsonData.email,
						role: jsonData.role,
						company: jsonData.company,
					});
					setComponentState({
						notificationMessage: "Successfully connected",
						notificationType: "success",
					});
					setOpen(true);
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
			} catch (error) {
                setComponentState({
                    notificationMessage: "Could not stablish connection :(",
                    notificationType: "error",
                });
                setOpen(true);
			}
		}
		getUser();
	}, []);

	return (
		<div style={{ padding: "5px" }}>
			<div
				style={{
					marginTop: "100px",
					width: "100%",
				}}
			>
			    {(localUser.name && localUser.lastName) ? (
                    <Avatar {...stringAvatar(`${localUser.name} ${localUser.lastName}`)} />
                ) : (<Skeleton 
                        variant="circular" 
                        width={150} 
                        height={150}
                        style={{margin: "auto"}} />
                )}
			</div>
			<Stack
				direction={{ xs: "column", sm: "row" }}
				spacing={{ xs: 1, sm: 2, md: 4 }}
				justifyContent="space-evenly"
				alignItems="center"
				mt={2}
			>
				<Item>
					<div>
						{localUser.name ? (
							<h1>
								Name: {localUser.name} {localUser.lastName}
							</h1>
						) : (
							<Skeleton style={skelethonStyle} width={"50%"} height={50} />
						)}
						{localUser.email ? (
							<h1>Email: {localUser.email}</h1>
						) : (
							<Skeleton style={skelethonStyle} width={"50%"} height={50} />
						)}
						{localUser.role ? (
							<h1>Role: {localUser.role}</h1>
						) : (
							<Skeleton style={skelethonStyle} width={"50%"} height={50} />
						)}
						{localUser.company ? (
							<h1>Works at: {localUser.company}</h1>
						) : (
							<Skeleton style={skelethonStyle} width={"50%"} height={50} />
						)}
					</div>
				</Item>
			</Stack>
			<Snackbar
				open={open}
				autoHideDuration={3000}
				onClose={() => handleClose()}
			>
				<Alert
					onClose={() => handleClose()}
					severity={componentState.notificationType}
					sx={{ width: "100%" }}
				>
					{componentState.notificationMessage}
				</Alert>
			</Snackbar>
		</div>
	);
}
