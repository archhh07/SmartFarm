export function GaugeCard({ title, value, unit, max, threshold, icon, chart }) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  const circumference = 2 * Math.PI * 52
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  const isOverThreshold = threshold && value > threshold

  return (
    <div className="bg-card rounded-xl p-6 border border-border hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${isOverThreshold ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`}
          >
            {icon}
          </div>
          <h3 className="font-semibold text-card-foreground">{title}</h3>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative">
          <svg className="w-24 h-24" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" fill="none" stroke="hsl(var(--border))" strokeWidth="8" />
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
              className={`transition-all duration-500 ease-in-out ${
                isOverThreshold ? "text-destructive" : "text-primary"
              }`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-xl font-bold ${isOverThreshold ? "text-destructive" : "text-card-foreground"}`}>
              {value}
            </span>
            <span className="text-xs text-muted-foreground">{unit}</span>
          </div>
        </div>

        <div className="flex-1 ml-4">
          {chart && <div className="h-16 mb-2">{chart}</div>}
          {threshold && (
            <p className="text-xs text-muted-foreground">
              Threshold: {threshold}
              {unit}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
