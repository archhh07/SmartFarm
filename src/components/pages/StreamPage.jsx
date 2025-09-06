"use client"

import { useState, useRef, useEffect } from "react"
import { Video, Maximize2, RotateCcw, Settings } from "lucide-react"

export function StreamPage({ camStatus, streamUrl }) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [streamError, setStreamError] = useState(false)
  const videoRef = useRef(null)
  const containerRef = useRef(null)

  const handleFullscreen = () => {
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen()
        setIsFullscreen(true)
      } else {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }
  }

  const handleImageError = () => {
    setStreamError(true)
    setTimeout(() => setStreamError(false), 5000) // Retry after 5 seconds
  }

  const handleRefresh = () => {
    setStreamError(false)
    if (videoRef.current) {
      videoRef.current.src = `${streamUrl}?t=${Date.now()}`
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Live Camera Feed</h2>
          <p className="text-muted-foreground">Real-time video monitoring from your ESP32-CAM device</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleFullscreen}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/80 transition-colors"
          >
            <Maximize2 className="h-4 w-4" />
            <span>Fullscreen</span>
          </button>
        </div>
      </div>

      {/* Stream Container */}
      <div
        ref={containerRef}
        className={`bg-black rounded-xl shadow-lg overflow-hidden ${
          isFullscreen ? "fixed inset-0 z-50 rounded-none" : "aspect-video max-w-6xl mx-auto"
        }`}
      >
        {camStatus === "connected" && !streamError ? (
          <div className="relative w-full h-full group">
            <img
              ref={videoRef}
              src={streamUrl || "/placeholder.svg"}
              alt="Live stream from ESP32-CAM"
              className="w-full h-full object-contain"
              onError={handleImageError}
            />

            {/* Stream Overlay */}
            <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-lg text-sm font-medium">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span>LIVE</span>
              </div>
            </div>

            {/* Stream Info */}
            <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="space-y-1">
                <div>Resolution: Auto</div>
                <div>Source: ESP32-CAM</div>
                <div>Status: Connected</div>
              </div>
            </div>

            {/* Controls */}
            <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleRefresh}
                className="p-2 bg-black/70 text-white rounded-lg hover:bg-black/90 transition-colors"
                title="Refresh stream"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                onClick={handleFullscreen}
                className="p-2 bg-black/70 text-white rounded-lg hover:bg-black/90 transition-colors"
                title="Toggle fullscreen"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-white p-8">
            <Video className="h-16 w-16 text-gray-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              {camStatus === "disconnected" || streamError ? "Camera Disconnected" : "Connecting to camera..."}
            </h3>
            <p className="text-gray-400 text-center mb-6">
              {streamError
                ? "Failed to load stream. Check camera connection and try refreshing."
                : "Please ensure the ESP32-CAM is powered on and connected to WiFi."}
            </p>
            {(camStatus === "disconnected" || streamError) && (
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/80 transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Try Again</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Stream Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center gap-3 mb-4">
            <Video className="h-6 w-6 text-primary" />
            <h3 className="font-semibold text-card-foreground">Stream Quality</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Resolution:</span>
              <span className="font-medium">Auto (VGA)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Frame Rate:</span>
              <span className="font-medium">~10 FPS</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Format:</span>
              <span className="font-medium">MJPEG</span>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="h-6 w-6 text-secondary" />
            <h3 className="font-semibold text-card-foreground">Camera Settings</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Brightness:</span>
              <span className="font-medium">Auto</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Contrast:</span>
              <span className="font-medium">Normal</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Saturation:</span>
              <span className="font-medium">Normal</span>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`w-3 h-3 rounded-full ${
                camStatus === "connected" ? "bg-primary animate-pulse-glow" : "bg-muted"
              }`}
            />
            <h3 className="font-semibold text-card-foreground">Connection Status</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <span
                className={`font-medium capitalize ${camStatus === "connected" ? "text-primary" : "text-destructive"}`}
              >
                {camStatus}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Device:</span>
              <span className="font-medium">ESP32-CAM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Protocol:</span>
              <span className="font-medium">HTTP Stream</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
