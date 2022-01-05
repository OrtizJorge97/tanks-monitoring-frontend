import React, { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import {
    useLocation
} from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import useInputTank from "../hooks/useInputTank";
import useFetch from "../hooks/useFetch";
import { apiModes } from "../api/ApiProperties";
import { UserContext, NavigationContext, TankContext } from '../components/Context';

export default function ModifyTank() {
    //const {tankContextData, setTankContextData} = React.useContext(TankContext);
    const navigate = useNavigate();
	const location = useLocation();
    const [tank, setTank, doFetch] = useFetch({
		tankId: "",
		WtrLvlMin: "",
		WtrLvlMax: "",
		OxygenPercentageMin: "",
		OxygenPercentageMax: "",
		PhMin: "",
		PhMax: ""
	});

    const updateTank = (event, prop) => {
		setTank({
			...tank,
			[prop]: event.target.value,
		});
	};
	const updateTankParametersFields = (parameters, tankId) => {
		let tank = {
			tankId: tankId,
			WtrLvlMin: "",
			WtrLvlMax: "",
			OxygenPercentageMin: "",
			OxygenPercentageMax: "",
			PhMin: "",
			PhMax: ""
		};
		parameters.forEach((parameter, index) => {
			console.log("in foreach")
			if(parameter.parameter === 'WtrLvl') {
				tank.WtrLvlMin = parameter.tankMinValue;
				tank.WtrLvlMax = parameter.tankMaxValue;
			}
			else if(parameter.parameter === 'OxygenPercentage') {
				tank.OxygenPercentageMin = parameter.tankMinValue;
				tank.OxygenPercentageMax = parameter.tankMaxValue;
			}
			else if(parameter.parameter === 'Ph') {
				tank.PhMin = parameter.tankMinValue;
				tank.PhMax = parameter.tankMaxValue;
			}
		});
		console.log(tank);
		setTank(tank);
	};
	const fetchTank = async() => {
		try {
			const jsonData = await doFetch("GET", apiModes.FETCHTANK, true, {
				accessToken: localStorage.getItem("accessToken"),
				tankId: location.state.tankId
			});
			console.log(jsonData);
			if(jsonData.msg === 'Token has expired') {
				navigate('/log-in');
			}
			else if(jsonData.msg === 'Successfully fetched') {
				updateTankParametersFields(jsonData.parameters, jsonData.tankId);
			}
		}	
		catch(error) {

		}
	};
	const handleUpdateTank = (e) => {
		console.log(tank);
	}
    useEffect(() => {
		fetchTank();

    }, []);
    return(
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
            <h1>Please type new values</h1>
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
			<div style={{ marginTop: "10px" }}>
				<Button
					variant='contained'
					sx={{
						width: "50%",
						borderRadius: "15px",
					}}
					onClick={(e) => handleUpdateTank(e)}>
					Update
				</Button>
			</div>
        </Box>
    );
}