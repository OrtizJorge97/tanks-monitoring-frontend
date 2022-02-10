import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

export default function HistoricalChart(props) {
  const { data, tankSelected } = props;
  /*console.log("--------DATA FOR HISTORICAL---------");
  console.log(data);*/
  const [dataForGraph, setDataForGraph] = useState({
    WtrLvlValues: [],
    OxygenPercentageValues: [],
    PhValues: [],
    timestamp: []
  });

  useEffect(() => {
    if(data && tankSelected) {
        let tankHistoricDataFiltered = data.filter((element) => element.tank_name === tankSelected);
        if (tankHistoricDataFiltered.length > 0) {
            let tankHistoricDataSelected = tankHistoricDataFiltered[0];
            console.log("------------------PRINTING HISTORIC TANK SELECTED------------------");
            console.log(tankHistoricDataSelected);
            setDataForGraph({
                WtrLvlValues: tankHistoricDataSelected.WtrLvlValues,
                OxygenPercentageValues: tankHistoricDataSelected.OxygenPercentageValues,
                PhValues: tankHistoricDataSelected.PhValues,
                timestamp: tankHistoricDataSelected.timestamp
            });
        }
    }
  }, [tankSelected, data]);

  return (
    <div>
      <Line
        data={{
          labels: dataForGraph.timestamp,
          datasets: [
            {
              label: "Water Level",
              data: dataForGraph.WtrLvlValues,
              fill: false,
              borderColor: "rgb(33, 122, 237)",
              tension: 0.1,
            },
            {
              label: "Oxygen Percentage",
              data: dataForGraph.OxygenPercentageValues,
              fill: false,
              borderColor: "rgb(75, 192, 192)",
              tension: 0.1,
            },
            {
              label: "Ph Values",
              data: dataForGraph.PhValues,
              fill: false,
              borderColor: "rgb(69, 30, 0)",
              tension: 0.1,
            },
          ],
        }}
      />
    </div>
  );
}
