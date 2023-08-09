import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import zoomPlugin from "chartjs-plugin-zoom"; // Import the plugin

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin
);

export const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Chart.js Line Chart",
    },
    zoom: {
      pan: {
        enabled: true,
        mode: "x" as const,
      },
      zoom: {
        wheel: {
          enabled: true,
        },
        pinch: {
          enabled: true,
        },
        mode: "x" as const,
      },
    },
  },
};

type LineChartChartJsProps = {
  data: { name: string; temperature: number; crackmovement: number }[];
};

export const LineChartChartJs: React.FC<LineChartChartJsProps> = ({ data }) => {
  const [chartData, setChartData] = useState({
    labels: data.map((item) => item.name),
    datasets: [
      {
        label: "Temperature",
        data: data.map((item) => item.temperature),
        borderColor: "#E85319",
        backgroundColor: "#E85319",
        // pointRadius: 0,
      },
      {
        label: "Crack Movement",
        data: data.map((item) => item.crackmovement),
        borderColor: "#0f5a96",
        backgroundColor: "#0f5a96",
        // pointRadius: 0,
      },
    ],
  });

  return (
    <div style={{ width: 1400, height: 500 }}>
      <Line options={options} data={chartData} />
    </div>
  );
};
