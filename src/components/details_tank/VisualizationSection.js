import React from "react";
import { Bar } from "react-chartjs-2";

export default function VisualizationSection(props) {
    const data = {
        labels: ["Water Level", "%Oxygen", "Ph"],
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
                data: [100, 40, 10],
            },
        ],
    }
    
	return (
		<div
			style={{
				width: "60%",
				backgroundColor: "",
			}}>
			<Bar data={data} />
		</div>
	);
}
