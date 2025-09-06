import { Thermometer, Droplets, Activity, AlertTriangle, CheckCircle, TrendingUp, Zap, Eye } from "lucide-react"
import { StatusCard } from "../ui/StatusCard"
import { MetricCard } from "../ui/MetricCard"
import { AlertCard } from "../ui/AlertCard"

export function HomePage({ esp32Status, camStatus, sensorData, alerts, historicalData }) {
  const recentAlerts = alerts.slice(0, 3)

  const getSystemHealth = () => {
    if (esp32Status === "connected" && camStatus === "connected") {
      return { status: "excellent", message: "All systems operational", color: "text-primary" }
    } else if (esp32Status === "connected" || camStatus === "connected") {
      return { status: "good", message: "Partial connectivity", color: "text-secondary" }
    } else {
      return { status: "poor", message: "Connection issues detected", color: "text-destructive" }
    }
  }

  const systemHealth = getSystemHealth()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Farm Dashboard</h1>
          <p className="text-muted-foreground">Real-time monitoring and control of your smart farming system</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-card ${systemHealth.color}`}>
            {systemHealth.status === "excellent" ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertTriangle className="h-5 w-5" />
            )}
            <span className="font-medium">{systemHealth.message}</span>
          </div>
        </div>
      </div>

      {/* System Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatusCard
          title="ESP32 Controller"
          status={esp32Status}
          icon={<Activity className="h-6 w-6" />}
          description="Main control unit"
        />
        <StatusCard
          title="Camera Feed"
          status={camStatus}
          icon={<Eye className="h-6 w-6" />}
          description="Live monitoring"
        />
        <StatusCard
          title="Active Alerts"
          status={alerts.length > 0 ? "warning" : "connected"}
          icon={<AlertTriangle className="h-6 w-6" />}
          description={`${alerts.length} alerts`}
          customValue={alerts.length}
        />
        <StatusCard
          title="Data Points"
          status="connected"
          icon={<TrendingUp className="h-6 w-6" />}
          description="Historical records"
          customValue={historicalData.length}
        />
      </div>

      {/* Key Metrics */}
      {sensorData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Inside Temperature"
            value={sensorData.insideTemp}
            unit="°C"
            icon={<Thermometer className="h-6 w-6" />}
            trend={
              historicalData.length > 1
                ? sensorData.insideTemp - historicalData[historicalData.length - 2]?.insideTemp
                : 0
            }
            color="text-chart-3"
          />
          <MetricCard
            title="Soil Moisture"
            value={sensorData.moisture}
            unit="%"
            icon={<Droplets className="h-6 w-6" />}
            trend={
              historicalData.length > 1 ? sensorData.moisture - historicalData[historicalData.length - 2]?.moisture : 0
            }
            color="text-chart-2"
          />
          <MetricCard
            title="Inside Humidity"
            value={sensorData.insideHumidity}
            unit="%"
            icon={<Droplets className="h-6 w-6" />}
            trend={
              historicalData.length > 1
                ? sensorData.insideHumidity - historicalData[historicalData.length - 2]?.insideHumidity
                : 0
            }
            color="text-chart-1"
          />
          <MetricCard
            title="Light Level"
            value={sensorData.light}
            unit=""
            icon={<Zap className="h-6 w-6" />}
            trend={0}
            color="text-chart-4"
          />
        </div>
      )}

      {/* Recent Alerts */}
      {recentAlerts.length > 0 && (
        <div className="bg-card rounded-xl p-6 border border-border">
          <h3 className="text-xl font-semibold mb-4 text-card-foreground">Recent Alerts</h3>
          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} compact />
            ))}
          </div>
        </div>
      )}

      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-6 border border-border">
        <h3 className="text-xl font-semibold mb-3 text-foreground">Welcome to Smart Farm</h3>
        <p className="text-muted-foreground mb-4">
          Your intelligent farming companion is monitoring your crops 24/7. Use the navigation menu to explore live
          sensor data, view camera feeds, analyze trends, and configure system settings.
        </p>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-primary" />
            <span>Real-time monitoring</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-primary" />
            <span>Automated alerts</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-primary" />
            <span>Historical analytics</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-primary" />
            <span>Remote control</span>
          </div>
        </div>
      </div>
    </div>
  )
}
