import React from "react";
import Stack from "@mui/material/Stack";

export default function DataSection(props) {
    const { tankId } = props;
	return (
		<div
			style={{
				width: "40%",
				backgroundColor: "",
				textAlign: "center",
			}}>
			<h2>{tankId}</h2>
            <h4>Water Level</h4>
			<Stack
                justifyContent="center" 
                direction='row' 
                spacing={2}>
                <span>Min: </span>
                <span>Max: </span>
            </Stack>

            <h4>%Oxygen</h4>
			<Stack
                justifyContent="center" 
                direction='row' 
                spacing={2}>
                <span>Min: </span>
                <span>Max: </span>
            </Stack>

            <h4>Ph</h4>
			<Stack
                justifyContent="center" 
                direction='row' 
                spacing={2}>
                <span>Min: </span>
                <span>Max: </span>
            </Stack>
		</div>
	);
}
