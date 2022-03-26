import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";

export default function VisualizationSection(props) {
	const { tank, tankParameters } = props;
	const [data, setData] = useState({
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
	});
	const [options, setOptions] = useState(null);

	const getMaxOfArray = (numArray) => {
		return Math.max.apply(null, numArray);
	};

	useEffect(() => {
		console.log("-------TANK DATA!------");
		console.log(tank);
        if(tankParameters) {
            const biggestNumber = getMaxOfArray([tankParameters.WtrLvlMax, tankParameters.OxygenPercentageMax, tankParameters.PhMax]);
			console.log(biggestNumber);
            setOptions({
                indexAxis: "x",
                scales: {
                    y: {

                        min: 0,
                        max: biggestNumber+5,
                    },
                },
            });
        }
		if (tank) {
            console.log("inside the update data");
            setData({
				...data,
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
						data: [tank.WtrLvl, tank.OxygenPercentage, tank.Ph],
					},
				],
			});
		}
	}, [
		tank.WtrLvl,
		tank.OxygenPercentage,
		tank.Ph,
		tankParameters.WtrLvlMax,
		tankParameters.OxygenPercentageMax,
		tankParameters.PhMax
	]);
	/*
WtrLvlMin: jsonData.parameters[0].tankMinValue,
					WtrLvlMax: jsonData.parameters[0].tankMaxValue,
					OxygenPercentageMin:jsonData.parameters[1].tankMinValue,
					OxygenPercentageMax: jsonData.parameters[1].tankMaxValue,
					PhMin:jsonData.parameters[2].tankMinValue,
					PhMax: jsonData.parameters[2].tankMaxValue,
*/
	return (
		<div
			style={{
				width: "60%",
				backgroundColor: "",
			}}>
			<Bar data={data} options={options} />
		</div>
	);
}

/*
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
					max: 1,
				},
			},
		},
	});
*/
