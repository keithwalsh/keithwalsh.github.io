import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"

/**
 * Picks one of a few values. Drawn like `TabsList`, so every pill switch on the
 * site looks the same; tabs swap panels, this sets a value.
 */
export function SegmentedControl<T extends string>({
  value,
  onValueChange,
  options,
  className,
  ...props
}: {
  value: T
  onValueChange: (value: T) => void
  options: readonly { value: T; label: string }[]
  className?: string
  "aria-label"?: string
  "aria-labelledby"?: string
}) {
  return (
    <ToggleGroup
      type="single"
      spacing={0.5}
      value={value}
      // Radix clears the value when the active item is pressed again; keep it.
      onValueChange={(next) => next && onValueChange(next as T)}
      className={cn("h-8 bg-muted p-[3px]", className)}
      {...props}
    >
      {options.map((option) => (
        <ToggleGroupItem
          key={option.value}
          value={option.value}
          className="h-[calc(100%-1px)] flex-1 rounded-md border border-transparent px-2.5 text-sm font-medium text-foreground/60 hover:bg-transparent hover:text-foreground data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm dark:text-muted-foreground dark:hover:text-foreground dark:data-[state=on]:border-input dark:data-[state=on]:bg-input/30 dark:data-[state=on]:text-foreground"
        >
          {option.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
