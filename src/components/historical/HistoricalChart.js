import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

export default function HistoricalChart(props) {
  const { data, tankSelected, datesRange } = props;
  /*console.log("--------DATA FOR HISTORICAL---------");
  console.log(data);*/
  const [dataForGraph, setDataForGraph] = useState({
    WtrLvlValues: [],
    OxygenPercentageValues: [],
    PhValues: [],
    timestamp: [],
  });

  useEffect(() => {
    if (data && tankSelected) {
      let tankHistoricDataFiltered = data.filter(
        (element) => element.tank_name === tankSelected
      );
      if (tankHistoricDataFiltered.length > 0) {
        let startDateUnix = new Date(datesRange.startDate).getTime() / 1000;
        let endDateUnix = new Date(datesRange.endDate).getTime() / 1000;
        let tankHistoricDataSelected = tankHistoricDataFiltered[0];
        let WtrLvlValues = [];
        let OxygenPercentageValues = [];
        let PhValues = [];
        let timestamp = [];
        console.log("---------ALL DATA FROM TANK----------------");
        console.log(tankHistoricDataSelected);
        tankHistoricDataSelected.timestamp.forEach((timestampValue, index) => {
          if (timestampValue >= startDateUnix && timestampValue <= endDateUnix) {
            //indexes.push(index);
            WtrLvlValues.push(tankHistoricDataSelected.WtrLvlValues[index]);
            OxygenPercentageValues.push(tankHistoricDataSelected.OxygenPercentageValues[index]);
            PhValues.push(tankHistoricDataSelected.PhValues[index]);
            timestamp.push(tankHistoricDataSelected.timestamp[index]);
          }
        });

        setDataForGraph({
          WtrLvlValues: WtrLvlValues,
          OxygenPercentageValues: OxygenPercentageValues,
          PhValues: PhValues,
          timestamp: timestamp.map(
            (timestampValue) => {
              const date = new Date(timestampValue * 1000);
              let stringDate =
                "" +
                date.getFullYear() +
                "-" +
                (date.getMonth() + 1) +
                "-" +
                date.getDate();
              return stringDate;
            }
          ),
        });
      }
    }
  }, [tankSelected, data, datesRange]);

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
