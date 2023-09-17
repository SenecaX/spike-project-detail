/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
// import sensorData from "./sensor_data_6.json";
// import PdfGenerator from "./Pdf/PdfGenerator";
import PdfGenerator2 from "./tarou/PdfGeneratorV2";
import SimpleForm from "./tarou/SimpleForm";
import { ApolloProvider } from "@apollo/client";
import { client } from "./config/apolloClient";

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <SimpleForm />
      </div>
    </ApolloProvider>
  );
}

export default App;
