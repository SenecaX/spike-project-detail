import React from "react";
import sensorData from "./sensor_data.json";
import { LineChartChartJs } from "./LineChart/LinechartChartJs";

function App() {
  // Extracting the first and last dates from the JSON data
  const startDate = new Date(sensorData[0].time); // Assuming 'time' is the date field
  const endDate = new Date(sensorData[sensorData.length - 1].time);

  const transformedData = sensorData.reduce((acc: any, item: any) => {
    const time = item.time;
    if (!acc[time]) acc[time] = { name: time };
    acc[time][item.field.toLowerCase()] = item.value;
    return acc;
  }, {});

  return (
    <div className="App">
      <LineChartChartJs
        data={Object.values(transformedData)}
        startDate={startDate}
        endDate={endDate}
      />
    </div>
  );
}

export default App;
