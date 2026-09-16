import { useState } from "react"
import { Minus, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group"
import { cn } from "@/lib/utils"

/** Increment/decrement control whose number slides in the direction of change. */
export function NumberStepper({
  value,
  onChange,
  min,
  max,
  step = 1,
  disabled = false,
  label,
}: {
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step?: number
  disabled?: boolean
  label: string
}) {
  const [direction, setDirection] = useState<"up" | "down">("up")

  const change = (delta: number) => {
    setDirection(delta > 0 ? "up" : "down")
    onChange(Math.min(max, Math.max(min, value + delta)))
  }

  return (
    <ButtonGroup aria-label={label}>
      <Button
        variant="outline"
        size="icon"
        aria-label={`Decrease ${label.toLowerCase()}`}
        disabled={disabled || value <= min}
        onClick={() => change(-step)}
      >
        <Minus />
      </Button>
      <ButtonGroupText
        aria-live="polite"
        className="w-14 justify-center overflow-hidden bg-transparent font-mono tabular-nums dark:bg-input/30"
      >
        <span
          key={value}
          className={cn(
            "animate-in duration-200 fade-in-0",
            direction === "up"
              ? "slide-in-from-bottom-2"
              : "slide-in-from-top-2"
          )}
        >
          {value}
        </span>
      </ButtonGroupText>
      <Button
        variant="outline"
        size="icon"
        aria-label={`Increase ${label.toLowerCase()}`}
        disabled={disabled || value >= max}
        onClick={() => change(step)}
      >
        <Plus />
      </Button>
    </ButtonGroup>
  )
}
