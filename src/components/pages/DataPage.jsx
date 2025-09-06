import { Thermometer, Droplets, Sun, Wind, Cloud, Zap } from "lucide-react"
import { GaugeCard } from "../ui/GaugeCard"
import { ValueCard } from "../ui/ValueCard"
import { BinaryCard } from "../ui/BinaryCard"
import { LoadingSpinner } from "../ui/LoadingSpinner"
import { MiniChart } from "../ui/MiniChart"

export function DataPage({ sensorData, thresholds, historicalData }) {
  if (!sensorData) {
    return <LoadingSpinner message="Waiting for sensor data from ESP32..." />
  }

  const { insideTemp, outsideTemp, insideHumidity, outsideHumidity, rain, light, shed, valve, fan, moisture } =
    sensorData

  const getHistoricalData = (key) => {
    return historicalData.slice(-20).map((data, index) => ({
      time: index,
      value: data[key] || 0,
    }))
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Live Sensor Data</h2>
        <p className="text-muted-foreground">Real-time environmental monitoring and system status</p>
      </div>

      {/* Primary Metrics with Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <GaugeCard
          title="Inside Temperature"
          value={insideTemp}
          unit="°C"
          max={50}
          threshold={Number.parseFloat(thresholds.temp)}
          icon={<Thermometer className="h-5 w-5" />}
          chart={<MiniChart data={getHistoricalData("insideTemp")} color="#ef4444" />}
        />
        <GaugeCard
          title="Soil Moisture"
          value={moisture}
          unit="%"
          max={100}
          threshold={Number.parseInt(thresholds.moist)}
          icon={<Droplets className="h-5 w-5" />}
          chart={<MiniChart data={getHistoricalData("moisture")} color="#3b82f6" />}
        />
        <GaugeCard
          title="Inside Humidity"
          value={insideHumidity}
          unit="%"
          max={100}
          icon={<Droplets className="h-5 w-5" />}
          chart={<MiniChart data={getHistoricalData("insideHumidity")} color="#10b981" />}
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ValueCard
          title="Outside Temperature"
          value={`${outsideTemp} °C`}
          icon={<Thermometer className="h-5 w-5" />}
          chart={<MiniChart data={getHistoricalData("outsideTemp")} color="#f59e0b" />}
        />
        <ValueCard
          title="Outside Humidity"
          value={`${outsideHumidity} %`}
          icon={<Cloud className="h-5 w-5" />}
          chart={<MiniChart data={getHistoricalData("outsideHumidity")} color="#6366f1" />}
        />
        <ValueCard
          title="Light Level"
          value={light}
          icon={<Sun className="h-5 w-5" />}
          chart={<MiniChart data={getHistoricalData("light")} color="#eab308" />}
        />
        <ValueCard title="System Status" value="Online" icon={<Zap className="h-5 w-5" />} color="text-primary" />
      </div>

      {/* System Controls */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <h3 className="text-xl font-semibold mb-6 text-card-foreground">System Controls & Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <BinaryCard
            title="Weather Status"
            isOn={rain === 1}
            onText="Raining"
            offText="Clear"
            icon={<Cloud className="h-5 w-5" />}
          />
          <BinaryCard
            title="Greenhouse Door"
            isOn={shed === 1}
            onText="Open"
            offText="Closed"
            icon={<Wind className="h-5 w-5" />}
          />
          <BinaryCard
            title="Irrigation System"
            isOn={valve === 1}
            onText="Active"
            offText="Inactive"
            icon={<Droplets className="h-5 w-5" />}
          />
          <BinaryCard
            title="Ventilation Fan"
            isOn={fan === 1}
            onText="Running"
            offText="Stopped"
            icon={<Wind className="h-5 w-5" />}
          />
        </div>
      </div>

      {/* Threshold Information */}
      <div className="bg-muted/50 rounded-xl p-6 border border-border">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Current Thresholds</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-4 bg-card rounded-lg border border-border">
            <div className="flex items-center gap-3">
              <Thermometer className="h-5 w-5 text-chart-3" />
              <span className="font-medium">Temperature Threshold</span>
            </div>
            <span className="text-lg font-bold text-chart-3">{thresholds.temp}°C</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-card rounded-lg border border-border">
            <div className="flex items-center gap-3">
              <Droplets className="h-5 w-5 text-chart-2" />
              <span className="font-medium">Moisture Threshold</span>
            </div>
            <span className="text-lg font-bold text-chart-2">{thresholds.moist}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
