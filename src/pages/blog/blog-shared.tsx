import { nudgeClass } from "@/components/editorial"
import { cn } from "@/lib/utils"

// Index rows and the post's "Next in the index" row share one hover language:
// the row travels right, date and title warm up, the arrow slides in. Every
// piece also answers `:focus-visible`, so keyboard users get the same cue.
export const rowLinkClass = cn(
  nudgeClass,
  "group flex items-start gap-cells outline-none"
)

export const rowDateClass =
  "w-22 flex-none font-mono text-meta text-subtle uppercase tabular-nums transition-colors duration-300 group-hover:text-brand group-focus-visible:text-brand"

export const rowTitleClass =
  "font-medium text-pretty text-foreground/78 transition-colors duration-300 group-hover:text-foreground group-focus-visible:text-foreground"

export const rowArrowClass =
  "size-4.5 flex-none -translate-x-2 text-brand opacity-0 transition-[opacity,translate] duration-300 ease-glide group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
