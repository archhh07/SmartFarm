"use client"
import { X, AlertTriangle } from "lucide-react"

export function AlertCard({ alert, onClear, compact = false }) {
  const getAlertStyle = () => {
    switch (alert.type) {
      case "error":
        return {
          bgColor: "bg-destructive/10 border-destructive/20",
          textColor: "text-destructive",
          iconBg: "bg-destructive/20",
        }
      case "warning":
        return {
          bgColor: "bg-chart-4/10 border-chart-4/20",
          textColor: "text-chart-4",
          iconBg: "bg-chart-4/20",
        }
      default:
        return {
          bgColor: "bg-primary/10 border-primary/20",
          textColor: "text-primary",
          iconBg: "bg-primary/20",
        }
    }
  }

  const style = getAlertStyle()
  const timeAgo = new Date(alert.timestamp).toLocaleString()

  if (compact) {
    return (
      <div className={`flex items-center gap-3 p-4 rounded-lg border ${style.bgColor}`}>
        <div className={`p-2 rounded-lg ${style.iconBg} ${style.textColor}`}>
          {alert.icon || <AlertTriangle className="h-4 w-4" />}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-card-foreground truncate">{alert.title}</h4>
          <p className="text-sm text-muted-foreground truncate">{alert.message}</p>
        </div>
        <span className="text-xs text-muted-foreground whitespace-nowrap">{timeAgo}</span>
      </div>
    )
  }

  return (
    <div className={`p-6 rounded-xl border ${style.bgColor}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1">
          <div className={`p-3 rounded-lg ${style.iconBg} ${style.textColor}`}>
            {alert.icon || <AlertTriangle className="h-5 w-5" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-card-foreground">{alert.title}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${style.bgColor} ${style.textColor}`}>
                {alert.type.toUpperCase()}
              </span>
            </div>
            <p className="text-muted-foreground mb-3">{alert.message}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Triggered: {timeAgo}</span>
            </div>
          </div>
        </div>
        {onClear && (
          <button onClick={onClear} className="p-2 rounded-lg hover:bg-muted transition-colors" title="Clear alert">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}
