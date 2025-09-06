import { CheckCircle, AlertTriangle, Clock } from "lucide-react"

export function StatusCard({ title, status, icon, description, customValue }) {
  const getStatusInfo = () => {
    switch (status) {
      case "connected":
        return {
          text: customValue !== undefined ? customValue : "Connected",
          color: "text-primary",
          bgColor: "bg-primary/10 border-primary/20",
          statusIcon: <CheckCircle className="h-4 w-4" />,
        }
      case "disconnected":
        return {
          text: "Disconnected",
          color: "text-destructive",
          bgColor: "bg-destructive/10 border-destructive/20",
          statusIcon: <AlertTriangle className="h-4 w-4" />,
        }
      case "warning":
        return {
          text: customValue !== undefined ? customValue : "Warning",
          color: "text-chart-4",
          bgColor: "bg-chart-4/10 border-chart-4/20",
          statusIcon: <AlertTriangle className="h-4 w-4" />,
        }
      default:
        return {
          text: "Checking...",
          color: "text-muted-foreground",
          bgColor: "bg-muted/50 border-border",
          statusIcon: <Clock className="h-4 w-4" />,
        }
    }
  }

  const statusInfo = getStatusInfo()

  return (
    <div className="bg-card rounded-xl p-6 border border-border hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${statusInfo.bgColor} ${statusInfo.color}`}>{icon}</div>
          <div>
            <h3 className="font-semibold text-card-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </div>

      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${statusInfo.bgColor} ${statusInfo.color}`}>
        {statusInfo.statusIcon}
        <span className="font-medium">{statusInfo.text}</span>
      </div>
    </div>
  )
}
