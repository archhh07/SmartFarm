export function BinaryCard({ title, isOn, onText, offText, icon }) {
  return (
    <div className="bg-card rounded-xl p-6 border border-border hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg ${isOn ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
          {icon}
        </div>
        <h3 className="font-semibold text-card-foreground">{title}</h3>
      </div>

      <div
        className={`inline-flex items-center px-4 py-2 rounded-lg font-medium ${
          isOn
            ? "bg-primary/10 text-primary border border-primary/20"
            : "bg-muted text-muted-foreground border border-border"
        }`}
      >
        <div className={`w-2 h-2 rounded-full mr-2 ${isOn ? "bg-primary animate-pulse" : "bg-muted-foreground"}`} />
        {isOn ? onText : offText}
      </div>
    </div>
  )
}
