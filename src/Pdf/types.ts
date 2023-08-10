export interface SensorDataItem {
  time: string;
  field: "CRACKMOVEMENT" | "TEMPERATURE"; // Add other fields if needed
  value: number;
}

export type SensorData = SensorDataItem[];
