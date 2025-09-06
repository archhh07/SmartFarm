export function ValueCard({ title, value, icon, chart, color = "text-card-foreground" }) {
  return (
    <div className="bg-card rounded-xl p-6 border border-border hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">{icon}</div>
        <h3 className="font-semibold text-card-foreground">{title}</h3>
      </div>

      <div className="space-y-3">
        <div className={`text-2xl font-bold ${color}`}>{value}</div>
        {chart && <div className="h-12">{chart}</div>}
      </div>
    </div>
  )
}
