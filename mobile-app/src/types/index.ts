export interface SensorData {
  insideTemp: number;
  outsideTemp: number;
  insideHumidity: number;
  outsideHumidity: number;
  moisture: number;
  light: number;
  rain: number;
  shed: number;
  valve: number;
  fan: number;
  timestamp?: string;
}

export interface AlertData {
  id: string;
  type: 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: string;
}

export interface ThresholdData {
  temp: string;
  moist: string;
}

export interface ApiResponse {
  sensors: SensorData;
  thresholds: ThresholdData;
}