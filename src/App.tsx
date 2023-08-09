import React, { useEffect, useState } from "react";
import "./App.css";
import LineChart from "./LineChart/LineChart";
import sensorData from "./sensor_data.json";
import LineChartD3 from "./LineChart/LineChartD3";
import LineChart3 from "./LineChart/LineChart3";
import { LineChartChartJs } from "./LineChart/LinechartChartJs";

function App() {
  const [data, setData] = useState<any[]>([]);

  const transformedData = sensorData.reduce((acc: any, item: any) => {
    const time = item.time;
    if (!acc[time]) acc[time] = { name: time };
    acc[time][item.field.toLowerCase()] = item.value;
    return acc;
  }, {});

  return (
    <div
      className="App"
      style={{
        display: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
    >
      <div style={{ marginBottom: 30 }}>
        {/* <LineChart data={Object.values(transformedData)} /> */}
      </div>
      {/* <LineChartD3 data={Object.values(transformedData)} /> */}
      <LineChartChartJs data={Object.values(transformedData)} />
    </div>
  );
}

export default App;
