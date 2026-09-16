import { useState } from "react"
import { AArrowDown, AArrowUp, Accessibility, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  applyFontSize,
  clampFontSize,
  FONT_SIZE,
  getStoredFontSize,
  saveFontSize,
} from "@/lib/font-size"

export function AccessibilityMenu() {
  const [fontSize, setFontSize] = useState(getStoredFontSize)

  const updateFontSize = (size: number) => {
    const next = clampFontSize(size)
    setFontSize(next)
    applyFontSize(next)
    saveFontSize(next)
  }

  // Keep the menu open so the size can be stepped repeatedly.
  const keepOpen = (update: () => void) => (event: Event) => {
    event.preventDefault()
    update()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Accessibility settings">
          <Accessibility />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex items-center justify-between">
          Text size
          <span className="tabular-nums">{fontSize}px</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            disabled={fontSize >= FONT_SIZE.max}
            onSelect={keepOpen(() => updateFontSize(fontSize + FONT_SIZE.step))}
          >
            <AArrowUp />
            Increase font size
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={fontSize <= FONT_SIZE.min}
            onSelect={keepOpen(() => updateFontSize(fontSize - FONT_SIZE.step))}
          >
            <AArrowDown />
            Decrease font size
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={fontSize === FONT_SIZE.default}
            onSelect={keepOpen(() => updateFontSize(FONT_SIZE.default))}
          >
            <RotateCcw />
            Reset font size
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
