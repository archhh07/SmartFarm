import { ApiResponse } from '../types';

export class SensorDataService {
  private baseUrl: string;

  constructor(esp32Ip: string) {
    this.baseUrl = `http://${esp32Ip}`;
  }

  async checkStatus(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/status`, {
        timeout: 5000,
      });
      return response.ok;
    } catch (error) {
      console.error('Status check failed:', error);
      return false;
    }
  }

  async fetchSensorData(): Promise<ApiResponse | null> {
    try {
      const response = await fetch(`${this.baseUrl}/data`, {
        timeout: 5000,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch sensor data:', error);
      return null;
    }
  }

  async updateThresholds(temp: string, moist: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/set?temp=${temp}&moist=${moist}`, {
        timeout: 5000,
      });
      return response.ok;
    } catch (error) {
      console.error('Failed to update thresholds:', error);
      return false;
    }
  }
}