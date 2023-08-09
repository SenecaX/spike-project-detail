import React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

type DateRangeSliderProps = {
  value: [Date, Date];
  onChange: (value: [Date, Date]) => void;
};

const DateRangeSlider: React.FC<DateRangeSliderProps> = ({
  value,
  onChange,
}) => {
  const handleChange = (event: Event, newValue: number | number[]) => {
    const newDateValues = newValue as [number, number];
    const startDate = new Date(newDateValues[0]);
    const endDate = new Date(newDateValues[1]);
    onChange([startDate, endDate]);
  };

  const formatDate = (value: number) => {
    const date = new Date(value);
    return date.toLocaleDateString(); // Format the date as a string
  };

  const minDate = new Date("2023-08-01").getTime(); // Min date: 1st of August
  const maxDate = new Date("2023-09-01").getTime(); // Max date: 1st of September

  return (
    <Box sx={{ width: 1300 }}>
      <Slider
        getAriaLabel={() => "Date range slider"}
        value={value.map((date) => date.getTime())}
        onChange={handleChange}
        valueLabelDisplay="auto"
        valueLabelFormat={formatDate}
        step={86400000} // Number of milliseconds in a day
        min={minDate} // Set to the min date
        max={maxDate} // Set to the max date
      />
    </Box>
  );
};

export default DateRangeSlider;
