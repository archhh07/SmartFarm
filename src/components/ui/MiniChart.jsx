import { LineChart, Line, ResponsiveContainer } from "recharts"

export function MiniChart({ data, color = "#10b981" }) {
  if (!data || data.length === 0) {
    return <div className="w-full h-full bg-muted/20 rounded" />
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} isAnimationActive={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}
