// Index rows and the post's "Next in the index" row share one hover language:
// the row travels right, date and title warm up, the arrow slides in. Every
// piece also answers `:focus-visible`, so keyboard users get the same cue.
export const rowLinkClass =
  "group flex items-start gap-[clamp(0.75rem,2vw,1.75rem)] transition-[padding-left] duration-350 ease-[cubic-bezier(.2,.8,.2,1)] outline-none hover:pl-2.5 focus-visible:pl-2.5"

export const rowDateClass =
  "w-22 flex-none font-mono text-meta text-subtle uppercase tabular-nums transition-colors duration-300 group-hover:text-brand group-focus-visible:text-brand"

export const rowTitleClass =
  "font-medium tracking-[-0.025em] text-pretty text-foreground/78 transition-colors duration-300 group-hover:text-foreground group-focus-visible:text-foreground"

export const rowArrowClass =
  "size-4.5 flex-none -translate-x-2 text-brand opacity-0 [transition:opacity_.3s,translate_.35s_cubic-bezier(.2,.8,.2,1)] group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
