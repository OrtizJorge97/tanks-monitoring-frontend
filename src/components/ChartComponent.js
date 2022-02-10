import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import TextField from "@mui/material/TextField";

export default function ChartComponent(props) {
	const { scaleRanges, setScaleRanges, tanksSelected, tanksData, category } =
		props;
	const [maxScaleField, setMaxScaleField] = useState(scaleRanges.max);
	const [graph, setGraph] = useState({
		data: {
			labels: ["MT001"],
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
					data: [8],
				},
			],
		},
		options: {
			indexAxis: "x",
			scales: {
				y: {
					min: 0,
					max: maxScaleField,
				},
			},
		},
	});
	useEffect(() => {
		console.log(graph.options);
		let waterLevel = [];
		let oxygenPercentage = [];
		let ph = [];
		let dataToDisplay = null;

		tanksSelected.forEach((item, index) => {
			let tankSelectedIndex = tanksData.id.indexOf(item);
			if (tankSelectedIndex !== -1) {
				waterLevel.push(tanksData.WtrLvl[tankSelectedIndex]);
				oxygenPercentage.push(tanksData.OxPercentage[tankSelectedIndex]);
				ph.push(tanksData.Ph[tankSelectedIndex]);
			}
		});
		console.log(waterLevel);

		if (category === "Water Level") {
			dataToDisplay = waterLevel;
		} else if (category === "%Oxygen") {
			dataToDisplay = oxygenPercentage;
		} else if (category === "Ph") {
			dataToDisplay = ph;
		}
		setGraph({
			data: {
				labels: tanksSelected,
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
						data: dataToDisplay,
					},
				],
			},
			options: {
				...graph.options,
				scales: {
					y: scaleRanges,
				},
			},
		});
	}, [scaleRanges, tanksSelected, tanksData, category]);

	return (
		<div>
			<TextField
				id='outlined-basic'
				sx={{
					minWidth: "50px"
				}}
				label='Max Value'
				type='number'
				variant='outlined'
				value={maxScaleField}
				onChange={(e) => {
					setMaxScaleField(e.target.value);
				}}
				onKeyUp={(e) => {
					if (e.code === "Enter") {
						if(e.target.value > 0) {
							setScaleRanges({
								...scaleRanges,
								max: parseInt(e.target.value)
							});
						}
						console.log("Enter pressed!");
					}
				}}
			/>
			<Bar data={graph.data} options={graph.options} />
		</div>
	);
}
