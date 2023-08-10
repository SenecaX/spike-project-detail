import {
  MIN_CRACK_MOVEMENT,
  MAX_CRACK_MOVEMENT,
  MIN_TEMPERATURE,
  MAX_TEMPERATURE,
} from "./constants";
import { SensorData } from "./types";

export const transformSensorData = (sensorData: SensorData) => {
  let minCrackMovement = Number.POSITIVE_INFINITY;
  let maxCrackMovement = Number.NEGATIVE_INFINITY;
  let minTemperature = Number.POSITIVE_INFINITY;
  let maxTemperature = Number.NEGATIVE_INFINITY;

  const transformedData = sensorData.reduce((acc: any, item: any) => {
    const time = item.time;
    if (item.field === "CRACKMOVEMENT") {
      minCrackMovement = MIN_CRACK_MOVEMENT;
      maxCrackMovement = MAX_CRACK_MOVEMENT;
    }
    if (item.field === "TEMPERATURE") {
      minTemperature = MIN_TEMPERATURE;
      maxTemperature = MAX_TEMPERATURE;
    }
    if (!acc[time]) acc[time] = { name: time };
    acc[time][item.field.toLowerCase()] = item.value;
    return acc;
  }, {});

  return {
    transformedData,
    minCrackMovement,
    maxCrackMovement,
    minTemperature,
    maxTemperature,
  };
};
