"use client"

import { useState, useEffect } from "react"
import { Settings, Thermometer, Droplets, Moon, Sun, Save, RotateCcw } from "lucide-react"

// Configuration from main App
const ESP32_API_IP = "192.168.202.52"

export function SettingsPage({ currentThresholds, onUpdate, setEsp32Status, isDarkMode, onToggleDarkMode }) {
  const [temp, setTemp] = useState(currentThresholds.temp)
  const [moist, setMoist] = useState(currentThresholds.moist)
  const [isUpdating, setIsUpdating] = useState(false)
  const [message, setMessage] = useState({ text: "", type: "" })

  useEffect(() => {
    setTemp(currentThresholds.temp)
    setMoist(currentThresholds.moist)
  }, [currentThresholds])

  const handleUpdate = async () => {
    setIsUpdating(true)
    setMessage({ text: "", type: "" })
    try {
      const response = await fetch(`http://${ESP32_API_IP}/set?temp=${temp}&moist=${moist}`)
      if (response.ok) {
        setMessage({ text: "Thresholds updated successfully!", type: "success" })
        onUpdate()
      } else {
        setMessage({ text: "Failed to update. The device responded with an error.", type: "error" })
        setEsp32Status("disconnected")
      }
    } catch (error) {
      setMessage({ text: "Connection failed. Check device IP and network.", type: "error" })
      setEsp32Status("disconnected")
    }
    setIsUpdating(false)
    setTimeout(() => setMessage({ text: "", type: "" }), 5000)
  }

  const handleReset = () => {
    setTemp(currentThresholds.temp)
    setMoist(currentThresholds.moist)
    setMessage({ text: "", type: "" })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">System Settings</h2>
        <p className="text-muted-foreground">Configure thresholds, preferences, and system behavior</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Threshold Settings */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center gap-3 mb-6">
            <Settings className="h-6 w-6 text-primary" />
            <h3 className="text-xl font-semibold text-card-foreground">Automation Thresholds</h3>
          </div>

          <p className="text-muted-foreground mb-6">
            These values determine when automated systems like the fan or water valve will activate.
          </p>

          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-card-foreground mb-3">
                <Thermometer className="h-4 w-4 text-chart-3" />
                Temperature Threshold
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={temp}
                  onChange={(e) => setTemp(e.target.value)}
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                  placeholder="30.0"
                  step="0.1"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">°C</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Fan will activate when inside temperature exceeds this value
              </p>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-card-foreground mb-3">
                <Droplets className="h-4 w-4 text-chart-2" />
                Soil Moisture Threshold
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={moist}
                  onChange={(e) => setMoist(e.target.value)}
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                  placeholder="40"
                  step="1"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Irrigation system will activate when soil moisture falls below this value
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleUpdate}
                disabled={isUpdating}
                className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground font-medium py-3 px-4 rounded-lg hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-ring transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-4 w-4" />
                {isUpdating ? "Updating..." : "Save Changes"}
              </button>

              <button
                onClick={handleReset}
                className="flex items-center justify-center gap-2 bg-secondary text-secondary-foreground font-medium py-3 px-4 rounded-lg hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </button>
            </div>

            {message.text && (
              <div
                className={`p-4 rounded-lg text-center font-medium ${
                  message.type === "success"
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "bg-destructive/10 text-destructive border border-destructive/20"
                }`}
              >
                {message.text}
              </div>
            )}
          </div>
        </div>

        {/* Display Settings */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center gap-3 mb-6">
            {isDarkMode ? <Moon className="h-6 w-6 text-primary" /> : <Sun className="h-6 w-6 text-primary" />}
            <h3 className="text-xl font-semibold text-card-foreground">Display Preferences</h3>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-card-foreground">Dark Mode</h4>
                <p className="text-sm text-muted-foreground">Toggle between light and dark themes</p>
              </div>
              <button
                onClick={onToggleDarkMode}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ring ${
                  isDarkMode ? "bg-primary" : "bg-muted"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isDarkMode ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="border-t border-border pt-6">
              <h4 className="font-medium text-card-foreground mb-4">Current Theme</h4>
              <div className="grid grid-cols-5 gap-2">
                <div className="h-8 bg-primary rounded" title="Primary" />
                <div className="h-8 bg-secondary rounded" title="Secondary" />
                <div className="h-8 bg-muted rounded" title="Muted" />
                <div className="h-8 bg-accent rounded" title="Accent" />
                <div className="h-8 bg-destructive rounded" title="Destructive" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Smart Farm theme with agricultural-inspired colors</p>
            </div>
          </div>
        </div>
      </div>

      {/* System Information */}
      <div className="bg-muted/50 rounded-xl p-6 border border-border">
        <h3 className="text-lg font-semibold mb-4 text-foreground">System Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">ESP32 Controller IP:</span>
            <div className="font-mono font-medium">{ESP32_API_IP}</div>
          </div>
          <div>
            <span className="text-muted-foreground">Dashboard Version:</span>
            <div className="font-medium">v2.0.0</div>
          </div>
          <div>
            <span className="text-muted-foreground">Last Updated:</span>
            <div className="font-medium">{new Date().toLocaleDateString()}</div>
          </div>
          <div>
            <span className="text-muted-foreground">Theme:</span>
            <div className="font-medium capitalize">{isDarkMode ? "Dark" : "Light"}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
