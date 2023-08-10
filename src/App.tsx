import React from "react";
import sensorData from "./sensor_data.json";
import PdfGenerator from "./Pdf/PdfGenerator";

function App() {
  return (
    <div className="App">
      <PdfGenerator sensorData={sensorData} />
    </div>
  );
}

export default App;
