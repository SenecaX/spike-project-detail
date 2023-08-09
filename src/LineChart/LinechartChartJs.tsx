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
import DateRangeSlider from "./DateRangeSlider";
import { Box } from "@mui/material";

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
  startDate: Date; // New prop for start date
  endDate: Date; // New prop for end date
};

export const LineChartChartJs: React.FC<LineChartChartJsProps> = ({
  data,
  endDate,
  startDate,
}) => {
  const [sliderValue, setSliderValue] = useState<[Date, Date]>([
    startDate, // Initialize with the start date from props
    endDate, // Initialize with the end date from props
  ]);

  // Function to filter the data based on the selected date range
  const filterDataByDateRange = (startDate: Date, endDate: Date) => {
    return data.filter((item) => {
      const itemDate = new Date(item.name); // Assuming 'name' is the date field
      return itemDate >= startDate && itemDate <= endDate;
    });
  };

  const handleSliderChange = (value: [Date, Date]) => {
    setSliderValue(value);
    // Adjust the date range or zoom level based on sliderValue
    const [newStartDate, newEndDate] = value;
    const filteredData = filterDataByDateRange(newStartDate, newEndDate);

    // Update the chart data with the filtered data
    setChartData({
      labels: filteredData.map((item) => item.name),
      datasets: [
        {
          label: "Temperature",
          data: filteredData.map((item) => item.temperature),
          borderColor: "#E85319",
          backgroundColor: "#E85319",
        },
        {
          label: "Crack Movement",
          data: filteredData.map((item) => item.crackmovement),
          borderColor: "#0f5a96",
          backgroundColor: "#0f5a96",
        },
      ],
    });
  };

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
    <div
      style={{
        width: 1400,
        height: 500,
      }}
    >
      <Line options={options} data={chartData} />
      <Box sx={{ paddingLeft: 3 }}>
        <DateRangeSlider value={sliderValue} onChange={handleSliderChange} />
      </Box>
    </div>
  );
};
