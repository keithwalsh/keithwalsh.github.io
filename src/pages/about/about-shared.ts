import { useEffect, useLayoutEffect, useRef, useState } from "react"

/** The About route widens past the shared `Page` container to 1400px. */
export const sectionClass =
  "mx-auto w-full max-w-[87.5rem] px-[clamp(1.25rem,4vw,3.5rem)]"

/** Mono section label, e.g. `01 — Professional Journey`. */
export const eyebrowClass =
  "font-mono text-[0.6875rem] tracking-[0.2em] text-muted-foreground uppercase"

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
      el.style.transition = `opacity .8s ease ${delay}s, transform .9s cubic-bezier(.16,1,.3,1) ${delay}s`
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
