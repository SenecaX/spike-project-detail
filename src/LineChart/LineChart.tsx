import React from "react";
import {
  Brush,
  CartesianGrid,
  LineChart as LC,
  Legend,
  Line,
  XAxis,
  YAxis,
} from "recharts";
import moment from "moment";

type LineChartProps = {
  data: { name: string; temperature: number; crackmovement: number }[];
};

const LineChart: React.FC<LineChartProps> = ({ data }) => {
  return (
    <LC width={1400} height={400} data={data}>
      <YAxis yAxisId="right" orientation="right" domain={[-15, 20]} unit="°C" />
      <YAxis yAxisId="left" orientation="left" domain={[-15, 20]} unit="mm" />
      <XAxis
        dataKey="name"
        tickFormatter={(time) => moment(time).format("DD MMM")}
      />
      <CartesianGrid strokeDasharray="3 3" />
      <Line
        yAxisId="left"
        type="monotone"
        dataKey="temperature"
        stroke="#E85319"
        dot={false}
      />
      <Line
        yAxisId="right"
        type="monotone"
        dataKey="crackmovement"
        stroke="#0f5a96"
        dot={false}
      />
      <Brush dataKey="name" travellerWidth={30} height={40} stroke="#0f5a96" />
      <Legend />
    </LC>
  );
};

export default LineChart;
