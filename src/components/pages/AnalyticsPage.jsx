"use client"

import { useMemo } from "react"
import { TrendingUp, TrendingDown, Activity, BarChart3, Brain, AlertTriangle, CheckCircle, Info } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Alert, AlertDescription } from "../../../components/ui/alert"

export function AnalyticsPage({ historicalData, sensorData }) {
  const chartData = useMemo(() => {
    return historicalData.slice(-50).map((data, index) => ({
      time: new Date(data.timestamp).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      insideTemp: data.insideTemp,
      outsideTemp: data.outsideTemp,
      moisture: data.moisture,
      humidity: data.insideHumidity,
      light: data.light,
    }))
  }, [historicalData])

  const getAdvancedAnalytics = () => {
    if (historicalData.length < 10) return null

    const recent = historicalData.slice(-20)
    const older = historicalData.slice(-40, -20)

    // Calculate averages and trends
    const recentAvg = {
      temp: recent.reduce((sum, d) => sum + d.insideTemp, 0) / recent.length,
      moisture: recent.reduce((sum, d) => sum + d.moisture, 0) / recent.length,
      humidity: recent.reduce((sum, d) => sum + d.insideHumidity, 0) / recent.length,
      light: recent.reduce((sum, d) => sum + d.light, 0) / recent.length,
    }

    const olderAvg =
      older.length > 0
        ? {
            temp: older.reduce((sum, d) => sum + d.insideTemp, 0) / older.length,
            moisture: older.reduce((sum, d) => sum + d.moisture, 0) / older.length,
            humidity: older.reduce((sum, d) => sum + d.insideHumidity, 0) / older.length,
            light: older.reduce((sum, d) => sum + d.light, 0) / older.length,
          }
        : recentAvg

    // Calculate trends
    const trends = {
      temp: recentAvg.temp - olderAvg.temp,
      moisture: recentAvg.moisture - olderAvg.moisture,
      humidity: recentAvg.humidity - olderAvg.humidity,
      light: recentAvg.light - olderAvg.light,
    }

    // AI Insights
    const insights = []
    const recommendations = []

    // Temperature insights
    if (recentAvg.temp > 30) {
      insights.push({
        type: "warning",
        title: "High Temperature Detected",
        message: `Average temperature (${recentAvg.temp.toFixed(1)}°C) is above optimal range. Consider ventilation or shade.`,
        icon: <AlertTriangle className="h-4 w-4" />,
      })
      recommendations.push("Install shade cloth or improve ventilation to reduce temperature stress")
    } else if (recentAvg.temp < 15) {
      insights.push({
        type: "info",
        title: "Low Temperature Alert",
        message: `Temperature (${recentAvg.temp.toFixed(1)}°C) may slow plant growth. Consider heating solutions.`,
        icon: <Info className="h-4 w-4" />,
      })
    } else {
      insights.push({
        type: "success",
        title: "Optimal Temperature",
        message: `Temperature (${recentAvg.temp.toFixed(1)}°C) is within ideal range for most crops.`,
        icon: <CheckCircle className="h-4 w-4" />,
      })
    }

    // Moisture insights
    if (recentAvg.moisture < 30) {
      insights.push({
        type: "warning",
        title: "Low Soil Moisture",
        message: `Soil moisture (${recentAvg.moisture.toFixed(1)}%) is below optimal. Irrigation recommended.`,
        icon: <AlertTriangle className="h-4 w-4" />,
      })
      recommendations.push("Increase irrigation frequency or check for water system issues")
    } else if (recentAvg.moisture > 80) {
      insights.push({
        type: "warning",
        title: "High Soil Moisture",
        message: `Soil moisture (${recentAvg.moisture.toFixed(1)}%) may cause root rot. Reduce watering.`,
        icon: <AlertTriangle className="h-4 w-4" />,
      })
      recommendations.push("Improve drainage and reduce watering frequency")
    } else {
      insights.push({
        type: "success",
        title: "Good Soil Moisture",
        message: `Soil moisture (${recentAvg.moisture.toFixed(1)}%) is at healthy levels.`,
        icon: <CheckCircle className="h-4 w-4" />,
      })
    }

    // Trend analysis
    if (Math.abs(trends.temp) > 2) {
      const direction = trends.temp > 0 ? "rising" : "falling"
      recommendations.push(`Temperature is ${direction} rapidly. Monitor closely and adjust environmental controls`)
    }

    if (Math.abs(trends.moisture) > 10) {
      const direction = trends.moisture > 0 ? "increasing" : "decreasing"
      recommendations.push(`Soil moisture is ${direction} significantly. Review irrigation schedule`)
    }

    // Growth predictions
    const growthScore = Math.min(
      100,
      Math.max(
        0,
        (recentAvg.temp >= 18 && recentAvg.temp <= 28 ? 25 : 0) +
          (recentAvg.moisture >= 40 && recentAvg.moisture <= 70 ? 25 : 0) +
          (recentAvg.humidity >= 50 && recentAvg.humidity <= 80 ? 25 : 0) +
          (recentAvg.light >= 300 ? 25 : (recentAvg.light / 300) * 25),
      ),
    )

    return {
      recentAvg,
      trends,
      insights,
      recommendations,
      growthScore: Math.round(growthScore),
    }
  }

  const analytics = getAdvancedAnalytics()

  const TrendIndicator = ({ value, unit = "" }) => {
    const isPositive = value > 0
    const isNeutral = Math.abs(value) < 0.1

    if (isNeutral) {
      return (
        <div className="flex items-center gap-1 text-muted-foreground">
          <Activity className="h-4 w-4" />
          <span className="text-sm">Stable</span>
        </div>
      )
    }

    return (
      <div className={`flex items-center gap-1 ${isPositive ? "text-chart-3" : "text-chart-2"}`}>
        {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
        <span className="text-sm font-medium">
          {isPositive ? "+" : ""}
          {value.toFixed(1)}
          {unit}
        </span>
      </div>
    )
  }

  if (!analytics || chartData.length === 0) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2 font-heading">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Historical data analysis and AI-powered insights</p>
        </div>
        <div className="bg-card rounded-xl p-12 text-center border border-border">
          <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-card-foreground">No Data Available</h3>
          <p className="text-muted-foreground">
            Analytics will appear once sufficient historical data has been collected.
            <br />
            Keep your system running to start seeing trends and insights.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2 font-heading">Analytics Dashboard</h2>
        <p className="text-muted-foreground">
          AI-powered analysis and insights from {historicalData.length} data points
        </p>
      </div>

      <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            <CardTitle className="font-heading">AI Growth Optimization Score</CardTitle>
          </div>
          <CardDescription>Real-time assessment of growing conditions based on sensor data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="text-4xl font-bold text-primary">{analytics.growthScore}%</div>
            <div className="flex-1">
              <div className="w-full bg-muted rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-primary to-accent h-3 rounded-full transition-all duration-500"
                  style={{ width: `${analytics.growthScore}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {analytics.growthScore >= 80
                  ? "Excellent growing conditions"
                  : analytics.growthScore >= 60
                    ? "Good conditions with room for improvement"
                    : analytics.growthScore >= 40
                      ? "Moderate conditions, adjustments needed"
                      : "Poor conditions, immediate attention required"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Temperature</CardTitle>
              <TrendIndicator value={analytics.trends.temp} unit="°C" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-3 mb-1">{analytics.recentAvg.temp.toFixed(1)}°C</div>
            <p className="text-xs text-muted-foreground">20-reading average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Soil Moisture</CardTitle>
              <TrendIndicator value={analytics.trends.moisture} unit="%" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-2 mb-1">{analytics.recentAvg.moisture.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">20-reading average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Humidity</CardTitle>
              <TrendIndicator value={analytics.trends.humidity} unit="%" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-1 mb-1">{analytics.recentAvg.humidity.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">20-reading average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Light Level</CardTitle>
              <TrendIndicator value={analytics.trends.light} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-4 mb-1">{Math.round(analytics.recentAvg.light)}</div>
            <p className="text-xs text-muted-foreground">20-reading average</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-heading">
              <Brain className="h-5 w-5 text-primary" />
              AI Insights
            </CardTitle>
            <CardDescription>Automated analysis of your growing conditions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {analytics.insights.map((insight, index) => (
              <Alert
                key={index}
                className={`border-l-4 ${
                  insight.type === "success"
                    ? "border-l-green-500 bg-green-50 dark:bg-green-950/20"
                    : insight.type === "warning"
                      ? "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/20"
                      : "border-l-blue-500 bg-blue-50 dark:bg-blue-950/20"
                }`}
              >
                <div className="flex items-start gap-2">
                  {insight.icon}
                  <div>
                    <h4 className="font-semibold text-sm">{insight.title}</h4>
                    <AlertDescription className="text-sm">{insight.message}</AlertDescription>
                  </div>
                </div>
              </Alert>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-heading">
              <TrendingUp className="h-5 w-5 text-primary" />
              Recommendations
            </CardTitle>
            <CardDescription>AI-generated suggestions for optimization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.recommendations.length > 0 ? (
                analytics.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <Badge variant="secondary" className="mt-0.5">
                      {index + 1}
                    </Badge>
                    <p className="text-sm leading-relaxed">{rec}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">All conditions are optimal! Keep up the great work.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Temperature Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Temperature Trends</CardTitle>
          <CardDescription>Inside vs outside temperature comparison</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--card-foreground))",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="insideTemp"
                  stroke="hsl(var(--chart-3))"
                  strokeWidth={2}
                  name="Inside Temp (°C)"
                  dot={{ fill: "hsl(var(--chart-3))", strokeWidth: 2, r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="outsideTemp"
                  stroke="hsl(var(--chart-4))"
                  strokeWidth={2}
                  name="Outside Temp (°C)"
                  dot={{ fill: "hsl(var(--chart-4))", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Moisture & Humidity Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Environmental Conditions</CardTitle>
          <CardDescription>Soil moisture and humidity levels over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--card-foreground))",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="moisture"
                  stackId="1"
                  stroke="hsl(var(--chart-2))"
                  fill="hsl(var(--chart-2) / 0.3)"
                  name="Soil Moisture (%)"
                />
                <Area
                  type="monotone"
                  dataKey="humidity"
                  stackId="2"
                  stroke="hsl(var(--chart-1))"
                  fill="hsl(var(--chart-1) / 0.3)"
                  name="Humidity (%)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Light Level Analysis</CardTitle>
          <CardDescription>Photosynthetic light availability for optimal growth</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.slice(-20)}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--card-foreground))",
                  }}
                />
                <Bar dataKey="light" fill="hsl(var(--chart-4))" name="Light Level" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
