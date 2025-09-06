"use client"

import { useState, useEffect, useCallback } from "react"
import { Thermometer, Droplets, Settings, Video, Home, Activity, TrendingUp, Bell } from "lucide-react"
import { Sidebar } from "./components/Sidebar"
import { HomePage } from "./components/pages/HomePage"
import { DataPage } from "./components/pages/DataPage"
import { StreamPage } from "./components/pages/StreamPage"
import { SettingsPage } from "./components/pages/SettingsPage"
import { AnalyticsPage } from "./components/pages/AnalyticsPage"
import { AlertsPage } from "./components/pages/AlertsPage"
import LandingPage from "./components/LandingPage"
import { ThemeProvider } from "./components/ThemeProvider"
import "./App.css"

// --- Configuration ---
// IMPORTANT: Replace these with the actual IP addresses of your ESP32 devices.
const ESP32_API_IP = "192.168.202.52" // Your main ESP32's IP
const ESP32_CAM_STREAM_IP = "192.168.202.120" // Your ESP32-CAM's IP
// --------------------

// Main App Component
export default function App() {
  const [currentView, setCurrentView] = useState("landing") // "landing" or "dashboard"
  const [activePage, setActivePage] = useState("home")
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false) // Added mobile sidebar state management
  const [esp32Status, setEsp32Status] = useState("checking")
  const [camStatus, setCamStatus] = useState("checking")
  const [sensorData, setSensorData] = useState(null)
  const [thresholds, setThresholds] = useState({ temp: "30.0", moist: "40" })
  const [historicalData, setHistoricalData] = useState([])
  const [alerts, setAlerts] = useState([])
  const [isDarkMode, setIsDarkMode] = useState(false)

  const goToDashboard = () => setCurrentView("dashboard")
  const backToWebsite = () => setCurrentView("landing")
  const toggleMobileSidebar = () => setIsMobileSidebarOpen(!isMobileSidebarOpen) // Added mobile sidebar toggle function
  const closeMobileSidebar = () => setIsMobileSidebarOpen(false)

  const checkStatus = useCallback(async () => {
    // Check ESP32 Data Server
    try {
      const response = await fetch(`http://${ESP32_API_IP}/status`)
      if (response.ok) {
        setEsp32Status("connected")
      } else {
        setEsp32Status("disconnected")
      }
    } catch (error) {
      setEsp32Status("disconnected")
    }

    // Check ESP32-CAM Server
    try {
      const img = new Image()
      const timeout = setTimeout(() => {
        setCamStatus("disconnected")
        img.src = ""
      }, 10000)

      img.onload = () => {
        setCamStatus("connected")
        clearTimeout(timeout)
      }
      img.onerror = () => {
        setCamStatus("disconnected")
        clearTimeout(timeout)
      }
      img.crossOrigin = "anonymous"
      img.src = `http://${ESP32_CAM_STREAM_IP}:81/stream`
    } catch (error) {
      setCamStatus("disconnected")
    }
  }, [])

  const fetchData = useCallback(async () => {
    if (esp32Status !== "connected") return
    try {
      const response = await fetch(`http://${ESP32_API_IP}/data`)
      const data = await response.json()
      setSensorData(data.sensors)
      setThresholds(data.thresholds)

      // Add to historical data for analytics
      const timestamp = new Date().toISOString()
      setHistoricalData((prev) => [...prev.slice(-99), { ...data.sensors, timestamp }])

      // Check for alerts
      checkAlerts(data.sensors, data.thresholds)
    } catch (error) {
      console.error("Failed to fetch sensor data:", error)
      setEsp32Status("disconnected")
    }
  }, [esp32Status])

  const checkAlerts = useCallback((sensors, thresholds) => {
    const newAlerts = []
    const now = new Date()

    if (sensors.insideTemp > Number.parseFloat(thresholds.temp)) {
      newAlerts.push({
        id: `temp-${now.getTime()}`,
        type: "warning",
        title: "High Temperature Alert",
        message: `Inside temperature (${sensors.insideTemp}°C) exceeds threshold (${thresholds.temp}°C)`,
        timestamp: now.toISOString(),
        icon: <Thermometer className="h-4 w-4" />,
      })
    }

    if (sensors.moisture < Number.parseInt(thresholds.moist)) {
      newAlerts.push({
        id: `moisture-${now.getTime()}`,
        type: "error",
        title: "Low Soil Moisture Alert",
        message: `Soil moisture (${sensors.moisture}%) is below threshold (${thresholds.moist}%)`,
        timestamp: now.toISOString(),
        icon: <Droplets className="h-4 w-4" />,
      })
    }

    if (newAlerts.length > 0) {
      setAlerts((prev) => [...newAlerts, ...prev.slice(0, 49)])
    }
  }, [])

  useEffect(() => {
    checkStatus()
    const statusInterval = setInterval(checkStatus, 10000)
    return () => clearInterval(statusInterval)
  }, [checkStatus])

  useEffect(() => {
    if (esp32Status === "connected") {
      fetchData()
      const dataInterval = setInterval(fetchData, 3000)
      return () => clearInterval(dataInterval)
    }
  }, [esp32Status, fetchData])

  const navigationItems = [
    { id: "home", icon: <Home />, label: "Dashboard", page: "home" },
    { id: "data", icon: <Activity />, label: "Live Data", page: "data" },
    { id: "analytics", icon: <TrendingUp />, label: "Analytics", page: "analytics" },
    { id: "stream", icon: <Video />, label: "Live Stream", page: "stream" },
    { id: "alerts", icon: <Bell />, label: "Alerts", page: "alerts", badge: alerts.length },
    { id: "settings", icon: <Settings />, label: "Settings", page: "settings" },
  ]

  const pages = {
    home: (
      <HomePage
        esp32Status={esp32Status}
        camStatus={camStatus}
        sensorData={sensorData}
        alerts={alerts}
        historicalData={historicalData}
      />
    ),
    data: <DataPage sensorData={sensorData} thresholds={thresholds} historicalData={historicalData} />,
    analytics: <AnalyticsPage historicalData={historicalData} sensorData={sensorData} />,
    stream: <StreamPage camStatus={camStatus} streamUrl={`http://${ESP32_CAM_STREAM_IP}:81/stream`} />,
    alerts: (
      <AlertsPage
        alerts={alerts}
        onClearAlert={(id) => setAlerts((prev) => prev.filter((alert) => alert.id !== id))}
        onClearAll={() => setAlerts([])}
      />
    ),
    settings: (
      <SettingsPage
        currentThresholds={thresholds}
        onUpdate={fetchData}
        setEsp32Status={setEsp32Status}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />
    ),
  }

  if (currentView === "landing") {
    return (
      <ThemeProvider isDarkMode={isDarkMode}>
        <LandingPage
          onEnterDashboard={goToDashboard}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        />
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider isDarkMode={isDarkMode}>
      <div className="bg-background min-h-screen font-sans text-foreground flex">
        <button
          onClick={toggleMobileSidebar}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-sidebar border border-sidebar-border shadow-lg"
        >
          <svg className="w-6 h-6 text-sidebar-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {isMobileSidebarOpen && (
          <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={closeMobileSidebar} />
        )}

        <Sidebar
          navigationItems={navigationItems}
          activePage={activePage}
          onPageChange={(page) => {
            setActivePage(page)
            closeMobileSidebar() // Close sidebar when navigating on mobile
          }}
          esp32Status={esp32Status}
          camStatus={camStatus}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          onBackToWebsite={() => {
            backToWebsite()
            closeMobileSidebar() // Close sidebar when going back
          }}
          isMobileSidebarOpen={isMobileSidebarOpen}
          onCloseMobileSidebar={closeMobileSidebar}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto lg:ml-0 pt-16 lg:pt-4">
          <div className="animate-fade-in-up">{pages[activePage]}</div>
        </main>
      </div>
    </ThemeProvider>
  )
}
