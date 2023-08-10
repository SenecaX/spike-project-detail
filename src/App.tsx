import React from "react";
import sensorData from "./sensor_data_6.json";
import { LineChartChartJs } from "./LineChart/LinechartChartJs";
import { LineChart } from "recharts";
import LineChartD3 from "./LineChart/LineChartD3";
import PdfGenerator from "./Pdf/PdfGenerator";

function App() {
  // Extracting the first and last dates from the JSON data
  const startDate = new Date(sensorData[0].time); // Assuming 'time' is the date field
  const endDate = new Date(sensorData[sensorData.length - 1].time);

  let minCrackMovement = Number.POSITIVE_INFINITY;
  let maxCrackMovement = Number.NEGATIVE_INFINITY;
  let minTemperature = Number.POSITIVE_INFINITY;
  let maxTemperature = Number.NEGATIVE_INFINITY;

  const transformedData = sensorData.reduce((acc: any, item: any) => {
    const time = item.time;
    if (item.field === "CRACKMOVEMENT") {
      minCrackMovement = -30;
      maxCrackMovement = 30;
    }
    if (item.field === "TEMPERATURE") {
      minTemperature = -40;
      maxTemperature = 40;
    }
    if (!acc[time]) acc[time] = { name: time };
    acc[time][item.field.toLowerCase()] = item.value;
    return acc;
  }, {});

  return (
    <div className="App">
      {/* <LineChart data={Object.values(transformedData)} />
      <LineChartD3 data={Object.values(transformedData)} />
      <LineChartChartJs
        data={Object.values(transformedData)}
        startDate={startDate}
        endDate={endDate}
        minCrackMovement={minCrackMovement}
        maxCrackMovement={maxCrackMovement}
        minTemperature={minTemperature}
        maxTemperature={maxTemperature}
      /> */}
      <PdfGenerator />
    </div>
  );
}

export default App;
