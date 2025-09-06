"use client"

import React from "react"
import { Sprout, Moon, Sun, ArrowLeft, X } from "lucide-react"

export function Sidebar({
  navigationItems,
  activePage,
  onPageChange,
  esp32Status,
  camStatus,
  isDarkMode,
  onToggleDarkMode,
  onBackToWebsite,
  isMobileSidebarOpen,
  onCloseMobileSidebar,
}) {
  const getStatusColor = (status) => {
    switch (status) {
      case "connected":
        return "text-primary"
      case "disconnected":
        return "text-destructive"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <nav
      className={`
      bg-sidebar border-r border-sidebar-border flex flex-col
      lg:static lg:w-64 lg:h-full
      fixed top-0 left-0 h-full w-80 z-50 transition-transform duration-300 ease-in-out
      ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
    `}
    >
      <button
        onClick={onCloseMobileSidebar}
        className="lg:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-sidebar-accent"
      >
        <X className="h-5 w-5 text-sidebar-foreground" />
      </button>

      {/* Header */}
      <div className="flex items-center justify-start p-4 lg:p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Sprout className="h-8 w-8 text-primary" />
            <div
              className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
                esp32Status === "connected" ? "bg-primary animate-pulse-glow" : "bg-muted"
              }`}
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-sidebar-foreground">Smart Farm</h1>
            <p className="text-xs text-muted-foreground">IoT Dashboard</p>
          </div>
        </div>
      </div>

      <div className="px-3 py-2 border-b border-sidebar-border">
        <button
          onClick={onBackToWebsite}
          className="w-full flex items-center justify-start gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200 group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
          <span className="text-sm font-medium">Back to Website</span>
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-4">
        <ul className="space-y-2 px-3">
          {navigationItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onPageChange(item.page)}
                className={`w-full flex items-center justify-start gap-3 px-3 py-3 rounded-lg transition-all duration-200 group relative ${
                  activePage === item.page
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <div className="relative">
                  {React.cloneElement(item.icon, {
                    className: `h-5 w-5 transition-transform duration-200 ${
                      activePage === item.page ? "scale-110" : "group-hover:scale-105"
                    }`,
                  })}
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  )}
                </div>
                <span className="font-medium">{item.label}</span>
                {activePage === item.page && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-sidebar-primary-foreground rounded-r-full" />
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="px-3 py-2 border-t border-sidebar-border">
        <button
          onClick={onToggleDarkMode}
          className="w-full flex items-center justify-start gap-3 px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200 group"
        >
          {isDarkMode ? (
            <Sun className="h-5 w-5 transition-transform duration-200 group-hover:rotate-12" />
          ) : (
            <Moon className="h-5 w-5 transition-transform duration-200 group-hover:-rotate-12" />
          )}
          <span className="font-medium">{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
        </button>
      </div>

      {/* Status Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">ESP32 Controller</span>
            <div className={`flex items-center gap-1 ${getStatusColor(esp32Status)}`}>
              <div className="w-2 h-2 rounded-full bg-current" />
              <span className="capitalize text-xs">{esp32Status}</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Camera Feed</span>
            <div className={`flex items-center gap-1 ${getStatusColor(camStatus)}`}>
              <div className="w-2 h-2 rounded-full bg-current" />
              <span className="capitalize text-xs">{camStatus}</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
