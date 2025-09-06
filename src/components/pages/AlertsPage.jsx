"use client"

import { useState } from "react"
import { Bell, AlertTriangle, CheckCircle, X, Trash2, Filter } from "lucide-react"
import { AlertCard } from "../ui/AlertCard"

export function AlertsPage({ alerts, onClearAlert, onClearAll }) {
  const [filter, setFilter] = useState("all") // 'all', 'warning', 'error'

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === "all") return true
    return alert.type === filter
  })

  const alertCounts = {
    all: alerts.length,
    warning: alerts.filter((a) => a.type === "warning").length,
    error: alerts.filter((a) => a.type === "error").length,
  }

  const FilterButton = ({ type, label, count }) => (
    <button
      onClick={() => setFilter(type)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
        filter === type ? "bg-primary text-primary-foreground" : "bg-card text-card-foreground hover:bg-muted"
      }`}
    >
      <span>{label}</span>
      {count > 0 && (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            filter === type ? "bg-primary-foreground text-primary" : "bg-muted text-muted-foreground"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">System Alerts</h2>
          <p className="text-muted-foreground">Monitor and manage system notifications and warnings</p>
        </div>
        {alerts.length > 0 && (
          <button
            onClick={onClearAll}
            className="flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/80 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3">
        <FilterButton type="all" label="All Alerts" count={alertCounts.all} />
        <FilterButton type="warning" label="Warnings" count={alertCounts.warning} />
        <FilterButton type="error" label="Errors" count={alertCounts.error} />
      </div>

      {/* Alerts List */}
      {filteredAlerts.length === 0 ? (
        <div className="bg-card rounded-xl p-12 text-center border border-border">
          {alerts.length === 0 ? (
            <>
              <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-card-foreground">All Clear!</h3>
              <p className="text-muted-foreground">No active alerts. Your smart farm system is operating normally.</p>
            </>
          ) : (
            <>
              <Filter className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-card-foreground">No {filter} alerts</h3>
              <p className="text-muted-foreground">
                No alerts match the current filter. Try selecting a different filter option.
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAlerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} onClear={() => onClearAlert(alert.id)} />
          ))}
        </div>
      )}

      {/* Alert Statistics */}
      {alerts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="h-6 w-6 text-primary" />
              <h3 className="font-semibold text-card-foreground">Total Alerts</h3>
            </div>
            <div className="text-3xl font-bold text-primary mb-2">{alerts.length}</div>
            <p className="text-sm text-muted-foreground">Active notifications</p>
          </div>

          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-chart-4" />
              <h3 className="font-semibold text-card-foreground">Warnings</h3>
            </div>
            <div className="text-3xl font-bold text-chart-4 mb-2">{alertCounts.warning}</div>
            <p className="text-sm text-muted-foreground">Threshold exceeded</p>
          </div>

          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <X className="h-6 w-6 text-destructive" />
              <h3 className="font-semibold text-card-foreground">Errors</h3>
            </div>
            <div className="text-3xl font-bold text-destructive mb-2">{alertCounts.error}</div>
            <p className="text-sm text-muted-foreground">Critical issues</p>
          </div>
        </div>
      )}
    </div>
  )
}
