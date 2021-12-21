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
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

import { socketApiRoute } from "../api/ApiProperties";
import { UserContext } from "./Context";
import { GET } from "../api/Get";
import { apiModes } from "../api/ApiProperties";
import TanksList from "./TanksList";

import socketIOClient from "socket.io-client";
const ENDPOINT = socketApiRoute;

const categories = ["Water Level", "%Oxygen", "Ph"];
const dataFromServerDummy = {
	tanks: ["MT001", "MT002", "MT003", "MT004", "MT005"],
	data: [10, 5, 2, 6, 8]
}
var data = {
	labels: dataFromServerDummy.tanks,
	datasets: [
		{
			label: "",
			backgroundColor: [
				"rgb(255, 99, 132)",
				"rgb(54, 99, 132)",
				"rgb(54, 99, 43)",
				"rgb(54, 99, 43)",
				"rgb(54, 99, 43)",
			],
			borderColor: "rgb(255, 99, 132)",
			data: dataFromServerDummy.data,
		},
	],
};
var options = {
	indexAxis: 'y',
	scales: {
		y: {
			min: 0,
			max: 200,
		},
	},
};
const Item = styled(Paper)(({ theme }) => ({
	...theme.typography.body2,
	padding: theme.spacing(1),
	textAlign: 'center',
	color: theme.palette.text.secondary,
}));
  

const Alert = React.forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});

function BarChart() {
	document.title = "Visualization";
	const navigate = useNavigate();
	const { user, setUser } = useContext(UserContext);
	const [open, setOpen] = useState(false);
    const [localUser, setLocalUser] = useState({
        name: "",
        lastName: "",
        email: "",
        company: ""
    });
	const [socket, setSocket] = useState(null);
	const [componentState, setComponentState] = useState({
		notificationMessage: "",
		notificationType: "",
	});
	const [graph, setGraph] = useState({
		labels: dataFromServerDummy.tanks,
		data: data,
		options: options,
	});
	const [checked, setChecked] = React.useState([0]);
	/*
	const updateGraph = (event) => {
		if (event.target.value === labels[0]) {
			console.log("selected water level");
			options = {
				scales: {
					y: {
						min: 0,
						max: 200,
					},
				},
			};
		} else if (event.target.value === labels[1]) {
			console.log("selected % Oxygen");
			options = {
				scales: {
					y: {
						min: 0,
						max: 100,
					},
				},
			};
		} else if (event.target.value === labels[2]) {
			console.log("selected Ph");
			options = {
				scales: {
					y: {
						min: 0,
						max: 14,
					},
				},
			};
		}

		setGraph({
			...graph,
			options: options,
		});
	};*/

	const handleClose = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}

		setOpen(false);
	};
	const updateChart = (tanksSelected) => {
		console.log(dataFromServerDummy.tanks);
		console.log(dataFromServerDummy.data);
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
            if(jsonData.email) {
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
			alert("t kgas wey");
			console.log(data);
		});
        socket.on('connect_error', err => console.log('connect_error: ' + err.message))
        socket.on('connect_failed', err => console.log('connect_failed: ' + err.message))
        socket.on('disconnect', err => {
            setOpen(true);
            setComponentState({
				notificationMessage: "Connection lost :(",
				notificationType: "error",
			});
        })

		return socket;
	};

	useEffect(() => {
		var socket = null;
		async function stablishConnection() {
            try {
                var connectionStablished = false;
                var jsonData = null;
                const response = await GET(apiModes.GETUSER, true, {
                    accessToken: localStorage.getItem("accessToken"),
                });
                console.log(response);
                if (response) {
                    jsonData = await response.json();
                    console.log(response.status);
                    console.log(jsonData.msg);

                    if (jsonData.msg === "Succesfully authenticated") {
                        connectionStablished = true;
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
                }
                if (connectionStablished) {
                    socket = stablishSocketConnection(jsonData);
                }
            }
            catch(error) {
                setComponentState({
                    notificationMessage: "Could not stablish connection :(",
                    notificationType: "error",
                });
                setOpen(true);
            }

		}
		stablishConnection();
		return () => {
			if (socket) {
				socket.close();
			}
		};
	}, []);

	return (
		<div style={{ marginTop: "90px" }}>
			<div style={{ textAlign: "center" }}>
				<h1>Company name: {user.company}</h1>
				<FormControl component='fieldset'>
					<FormLabel component='legend'>Select a Category</FormLabel>
					<RadioGroup
						row={true}
						aria-label='gender'
						defaultValue={categories[0]}
						name='radio-buttons-group'
						onChange={(e) => {
							console.log(e.target.value);
							//updateGraph(e);
						}}>
						<FormControlLabel
							value={categories[0]}
							control={<Radio />}
							label={categories[0]}
						/>
						<FormControlLabel
							value={categories[1]}
							control={<Radio />}
							label={categories[1]}
						/>
						<FormControlLabel
							value={categories[2]}
							control={<Radio />}
							label={categories[2]}
						/>
					</RadioGroup>
				</FormControl>
			</div>
			<Stack 
				direction={{ xs: 'column', sm: 'row' }}
				justifyContent="space-evenly"
				alignItems="center"
				spacing={2}
				mt={5}>
				<div>
					<h3>Select tanks to display (MAX 5)</h3>
					<TanksList 
						tanks={dataFromServerDummy.tanks}
						updateChart={updateChart}/>
				</div>
				<div style={{width: "60%", marginLeft: "15px"}}>
					<Bar data={graph.data} options={options} />
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
				</Alert> ) : null}
			</Snackbar>
		</div>
	);
}

export default BarChart;
