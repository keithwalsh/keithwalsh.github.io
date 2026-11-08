import { readStoredObject } from "@/lib/browser"

const STORAGE_KEY = "sidebarSettings"

/**
 * Sidebar width in rem, so it keeps pace with the font-size setting like
 * every other size on the site. 16rem is the shadcn default.
 */
export const SIDEBAR_WIDTH = { min: 12, max: 28, step: 1, default: 16 } as const

export function clampSidebarWidth(width: number) {
  return Math.min(SIDEBAR_WIDTH.max, Math.max(SIDEBAR_WIDTH.min, width))
}

export function getStoredSidebarWidth(): number {
  // Unreadable or blocked storage falls back to the default width.
  const width = Number(readStoredObject(STORAGE_KEY)?.width)
  return Number.isFinite(width)
    ? clampSidebarWidth(width)
    : SIDEBAR_WIDTH.default
}

export function saveSidebarWidth(width: number) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ width: Math.round(width * 100) / 100 })
    )
  } catch {
    // The width still applies for this visit without storage.
  }
}

/** Converts a pointer distance in CSS pixels to rem at the current root size. */
export function pxToRem(px: number) {
  const rootSize = parseFloat(
    getComputedStyle(document.documentElement).fontSize
  )
  return px / (Number.isFinite(rootSize) && rootSize > 0 ? rootSize : 16)
}
