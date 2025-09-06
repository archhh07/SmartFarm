import { Loader2 } from "lucide-react"

export function LoadingSpinner({ message }) {
  return (
    <div className="flex flex-col items-center justify-center h-96 text-center">
      <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
      <h3 className="text-lg font-semibold text-foreground mb-2">Loading...</h3>
      <p className="text-muted-foreground max-w-md">{message}</p>
    </div>
  )
}
