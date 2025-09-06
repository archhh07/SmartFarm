import { TrendingUp, TrendingDown, Minus } from "lucide-react"

export function MetricCard({ title, value, unit, icon, trend, color = "text-primary" }) {
  const getTrendIcon = () => {
    if (Math.abs(trend) < 0.1) return <Minus className="h-4 w-4" />
    return trend > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />
  }

  const getTrendColor = () => {
    if (Math.abs(trend) < 0.1) return "text-muted-foreground"
    return trend > 0 ? "text-chart-3" : "text-chart-2"
  }

  return (
    <div className="bg-card rounded-xl p-6 border border-border hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg bg-primary/10 ${color}`}>{icon}</div>
        <div className={`flex items-center gap-1 ${getTrendColor()}`}>
          {getTrendIcon()}
          <span className="text-sm font-medium">
            {Math.abs(trend) < 0.1 ? "Stable" : `${trend > 0 ? "+" : ""}${trend.toFixed(1)}`}
          </span>
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-card-foreground">{value}</span>
          <span className="text-sm text-muted-foreground">{unit}</span>
        </div>
      </div>
    </div>
  )
}
