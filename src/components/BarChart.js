import React, { useState, useEffect, useContext } from "react";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { Bar } from 'react-chartjs-2';
import { socketApiRoute } from '../api/ApiProperties';

import { UserContext } from "./Context";

import socketIOClient from "socket.io-client";
const ENDPOINT = socketApiRoute;

const labels = [
    'Water Level',
    '% Oxygen',
    'Ph',
];
var data = {
    labels: labels,
    datasets: [{
    label: '',
    backgroundColor: ['rgb(255, 99, 132)','rgb(54, 99, 132)', 'rgb(54, 99, 43)'],
    borderColor: 'rgb(255, 99, 132)',
    data: [10, 5, 2],
    }]
};
var options = {
    scales: {
        y: {
            min: 0,
            max: 200
        }
    }
}

function BarChart() {
    document.title = "Visualization";
    const {user, setUser} = useContext(UserContext);
    const [graph, setGraph] = useState({
        labels: labels,
        data: data,
        options: options
    });
    const updateGraph = (event) => {
        if(event.target.value === labels[0]) {
            console.log("selected water level");
            options = {
                scales: {
                    y: {
                        min: 0,
                        max: 200
                    }
                }
            }
        }
        else if(event.target.value === labels[1]) {
            console.log("selected % Oxygen");
            options = {
                scales: {
                    y: {
                        min: 0,
                        max: 100
                    }
                }
            }
        }
        else if(event.target.value === labels[2]) {
            console.log("selected Ph");
            options = {
                scales: {
                    y: {
                        min: 0,
                        max: 14
                    }
                }
            }
        }

        setGraph({
            ...graph,
            options: options
        });
    };

    try {
        useEffect(() => {
            var socket = socketIOClient(ENDPOINT);
            socket.on('connect', () => {
                console.log("email " + user.email);
                socket.emit('join_user_sessionid', {
                    email: localStorage.getItem("email"),
                    company: localStorage.getItem("company"),
                });
            });
            socket.on('message', (msj) => {
                console.log("message from server conection: " + msj);
            });
            socket.on('success_joinning', (msj) => {
                console.log("message from server conection: " + msj.message);
            });

            return () => {
                socket.close();
            }
        },[]);

    }
    catch(error) {
        console.log(error);
    }

    return(
        <div style={{marginTop: "90px"}}>
            <div style={{textAlign: "center"}}>
                <h1>Company name: {user.company}</h1>
                <FormControl component="fieldset">
                    <FormLabel component="legend">Metric</FormLabel>
                    <RadioGroup
                        row={true}
                        aria-label="gender"
                        defaultValue={labels[0]}
                        name="radio-buttons-group"
                        onChange={(e) => {
                            console.log(e.target.value);
                            updateGraph(e);
                        }}
                    >
                        <FormControlLabel value={labels[0]} control={<Radio />} label={labels[0]} />
                        <FormControlLabel value={labels[1]} control={<Radio />} label={labels[1]} />
                        <FormControlLabel value={labels[2]} control={<Radio />} label={labels[2]} />
                    </RadioGroup>
                </FormControl>
            </div>
            <h1>Selected metric:</h1>
            <Bar 
                data={data}
                options={options}
            />
        </div>
    )
}

export default BarChart;