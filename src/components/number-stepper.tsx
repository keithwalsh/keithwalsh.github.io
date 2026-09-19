import { useState } from "react"
import { Minus, Plus } from "lucide-react"

import { IconButton } from "@/components/icon-button"
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
      <IconButton
        variant="outline"
        size="icon"
        label={`Decrease ${label.toLowerCase()}`}
        disabled={disabled || value <= min}
        onClick={() => change(-step)}
      >
        <Minus />
      </IconButton>
      <ButtonGroupText
        aria-live="polite"
        className="w-14 justify-center overflow-hidden bg-transparent font-mono tabular-nums dark:bg-input/30"
      >
        <span
          key={value}
          className={cn(
            "animate-in duration-150 fade-in-0",
            direction === "up"
              ? "slide-in-from-bottom-2"
              : "slide-in-from-top-2"
          )}
        >
          {value}
        </span>
      </ButtonGroupText>
      <IconButton
        variant="outline"
        size="icon"
        label={`Increase ${label.toLowerCase()}`}
        disabled={disabled || value >= max}
        onClick={() => change(step)}
      >
        <Plus />
      </IconButton>
    </ButtonGroup>
  )
}
