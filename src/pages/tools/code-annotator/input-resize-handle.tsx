import { useEffect, useRef, useState } from "react"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { pxToRem } from "@/lib/browser"
import { cn } from "@/lib/utils"
import {
  INPUT_HEIGHT,
  clampInputHeight,
  maxInputHeight,
} from "@/pages/tools/code-annotator/annotator-settings"

// Matches TooltipProvider's delayDuration, since this tooltip is opened by
// hand rather than by its trigger.
const TOOLTIP_DELAY = 1000
const TOOLTIP_ID = "code-input-resize-tooltip"

/**
 * The input panel's bottom edge, the same window-splitter pattern as the
 * sidebar rail turned on its side: drag it to set the panel height, or with
 * focus step it with the arrow keys and jump to the limits with Home/End.
 *
 * A drag previews the height through `onPreview` and hands the final value to
 * `onCommit` once the pointer lifts, so the page state (and localStorage) is
 * written once per drag rather than once per pointer move.
 */
export function InputResizeHandle({
  height,
  onPreview,
  onCommit,
}: {
  height: number
  onPreview: (height: number) => void
  onCommit: (height: number) => void
}) {
  const drag = useRef<{
    pointerId: number
    startY: number
    startHeight: number
    height: number
    max: number
  } | null>(null)
  const [resizing, setResizing] = useState(false)

  // The tooltip anchors to a zero-width marker that follows the pointer along
  // the handle, so it sits beside the cursor instead of at the handle's
  // midpoint. Null centres it, for keyboard focus.
  const [open, setOpen] = useState(false)
  const [pointerX, setPointerX] = useState<number | null>(null)
  const timer = useRef<number | null>(null)

  const cancelOpen = () => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current)
      timer.current = null
    }
  }
  const closeTooltip = () => {
    cancelOpen()
    setOpen(false)
  }
  useEffect(() => cancelOpen, [])

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const current = drag.current
    if (!current || current.pointerId !== event.pointerId) return
    drag.current = null
    setResizing(false)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    onCommit(current.height)
  }

  const max = maxInputHeight()

  return (
    <Tooltip open={open} onOpenChange={setOpen}>
      <div
        role="separator"
        aria-orientation="horizontal"
        aria-label="Resize input"
        aria-valuemin={INPUT_HEIGHT.min}
        aria-valuemax={Math.round(max)}
        aria-valuenow={Math.round(height)}
        aria-describedby={open ? TOOLTIP_ID : undefined}
        tabIndex={0}
        data-resizing={resizing || undefined}
        className={cn(
          // Straddles the section's bottom border, above the output canvas.
          "absolute inset-x-0 -bottom-2 z-10 h-4 cursor-row-resize touch-none outline-hidden",
          "after:absolute after:inset-x-0 after:top-1/2 after:h-[2px] after:-translate-y-1/2 hover:after:bg-border focus-visible:after:bg-ring",
          // The hairline stays lit for the whole drag, even once the pointer
          // outruns the handle.
          "data-resizing:after:bg-border"
        )}
        onKeyDown={(event) => {
          const step = (delta: number) =>
            onCommit(clampInputHeight(height + delta, max))
          switch (event.key) {
            case "ArrowDown":
            case "ArrowRight":
              step(INPUT_HEIGHT.step)
              break
            case "ArrowUp":
            case "ArrowLeft":
              step(-INPUT_HEIGHT.step)
              break
            case "Home":
              onCommit(INPUT_HEIGHT.min)
              break
            case "End":
              onCommit(max)
              break
            default:
              return
          }
          event.preventDefault()
        }}
        onPointerEnter={(event) => {
          if (event.pointerType !== "mouse") return
          cancelOpen()
          timer.current = window.setTimeout(() => {
            timer.current = null
            setOpen(true)
          }, TOOLTIP_DELAY)
        }}
        onPointerLeave={closeTooltip}
        onPointerDown={(event) => {
          closeTooltip()
          if (event.button !== 0) return
          drag.current = {
            pointerId: event.pointerId,
            startY: event.clientY,
            startHeight: height,
            height,
            // Read once per drag: the viewport share is the live limit.
            max: maxInputHeight(),
          }
          setResizing(true)
          event.currentTarget.setPointerCapture(event.pointerId)
        }}
        onPointerMove={(event) => {
          const { left } = event.currentTarget.getBoundingClientRect()
          setPointerX(event.clientX - left)
          const current = drag.current
          if (!current || current.pointerId !== event.pointerId) return
          current.height = clampInputHeight(
            current.startHeight + pxToRem(event.clientY - current.startY),
            current.max
          )
          onPreview(current.height)
        }}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onFocus={(event) => {
          if (event.currentTarget.matches(":focus-visible")) {
            setPointerX(null)
            setOpen(true)
          }
        }}
        onBlur={closeTooltip}
      >
        <TooltipTrigger asChild>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 w-0"
            style={{ left: pointerX ?? "50%" }}
          />
        </TooltipTrigger>
      </div>
      {/* The marker moves by style alone, which the default position watcher
          misses, so re-measure every frame while open. */}
      <TooltipContent
        id={TOOLTIP_ID}
        side="bottom"
        updatePositionStrategy="always"
      >
        Drag to resize
      </TooltipContent>
    </Tooltip>
  )
}
