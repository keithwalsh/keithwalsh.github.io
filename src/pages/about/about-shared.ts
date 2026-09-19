import { useEffect, useLayoutEffect, useRef, useState } from "react"

export const COUNT_WORDS = [
  "Zero",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
]

export function pad(n: number) {
  return String(n).padStart(2, "0")
}

/**
 * Returns the row nearest a line 34% down the viewport, and fills `bar` with
 * how far that line has travelled through the rows. Drives the sticky rails
 * on the About timeline and the blog index.
 */
export function trackRows(
  rows: (HTMLElement | null)[],
  bar: HTMLElement | null
) {
  const present = rows.filter((row) => row !== null)
  if (present.length === 0) return 0

  const anchor = window.innerHeight * 0.34
  let best = 0
  let bestDistance = Infinity
  present.forEach((row, index) => {
    const distance = Math.abs(row.getBoundingClientRect().top - anchor)
    if (distance < bestDistance) {
      bestDistance = distance
      best = index
    }
  })

  if (bar) {
    const first = present[0].getBoundingClientRect()
    const last = present[present.length - 1].getBoundingClientRect()
    const span = Math.max(1, last.bottom - first.top - window.innerHeight * 0.2)
    const done = Math.min(1, Math.max(0, (anchor - first.top) / span))
    bar.style.width = `${(done * 100).toFixed(1)}%`
  }

  return best
}

export function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () =>
      typeof matchMedia === "function" &&
      matchMedia("(prefers-reduced-motion: reduce)").matches
  )

  useEffect(() => {
    const query = matchMedia("(prefers-reduced-motion: reduce)")
    const onChange = () => setReduced(query.matches)
    query.addEventListener("change", onChange)
    return () => query.removeEventListener("change", onChange)
  }, [])

  return reduced
}

/**
 * Fades `[data-reveal]` descendants in on scroll. The hidden state is applied
 * from script and is always recoverable: anything already on screen is shown on
 * the next frame, and a timer force-reveals the rest — copy must never depend
 * on an observer callback that may not fire.
 */
export function useReveal<T extends HTMLElement>(enabled: boolean) {
  const ref = useRef<T>(null)

  useLayoutEffect(() => {
    const root = ref.current
    if (!root || !enabled) return

    const targets = Array.from(
      root.querySelectorAll<HTMLElement>("[data-reveal]")
    )
    const show = (el: HTMLElement) => {
      el.style.opacity = "1"
      el.style.transform = "none"
    }

    targets.forEach((el, index) => {
      const delay = 0.1 + Number(el.dataset.reveal || index) * 0.09
      el.style.opacity = "0"
      el.style.transform = "translateY(22px)"
      el.style.transition = `opacity .8s ease ${delay}s, transform .9s var(--ease-expo) ${delay}s`
    })

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          show(entry.target as HTMLElement)
          observer.unobserve(entry.target)
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    )
    targets.forEach((el) => observer.observe(el))

    const frame = requestAnimationFrame(() => {
      for (const el of targets) {
        const box = el.getBoundingClientRect()
        if (box.top < window.innerHeight && box.bottom > 0) {
          show(el)
          observer.unobserve(el)
        }
      }
    })
    const failsafe = window.setTimeout(() => targets.forEach(show), 1400)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
      clearTimeout(failsafe)
    }
  }, [enabled])

  return ref
}

/** Runs `onScroll` from a single rAF-throttled passive listener. */
export function useScrollEffect(enabled: boolean, onScroll: () => void) {
  const handler = useRef(onScroll)

  useEffect(() => {
    handler.current = onScroll
  })

  useEffect(() => {
    if (!enabled) return

    let frame = 0
    const run = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        handler.current()
      })
    }

    run()
    window.addEventListener("scroll", run, { passive: true })
    window.addEventListener("resize", run, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", run)
      window.removeEventListener("resize", run)
    }
  }, [enabled])
}
