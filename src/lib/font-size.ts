import { readStoredObject } from "@/lib/browser"

const STORAGE_KEY = "accessibilitySettings"

export const FONT_SIZE = { min: 12, max: 24, step: 1, default: 16 } as const

export function clampFontSize(size: number) {
  return Math.min(FONT_SIZE.max, Math.max(FONT_SIZE.min, size))
}

export function getStoredFontSize(): number {
  // Unreadable or blocked storage falls back to the default size.
  const size = Number(readStoredObject(STORAGE_KEY)?.fontSize)
  return Number.isFinite(size) ? clampFontSize(size) : FONT_SIZE.default
}

/** Scales the whole UI, since every Tailwind size is rem-based. */
export function applyFontSize(size: number) {
  document.documentElement.style.fontSize =
    size === FONT_SIZE.default ? "" : `${size}px`
}

export function saveFontSize(size: number) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ fontSize: size }))
  } catch {
    // The setting still applies for this visit without storage.
  }
}
