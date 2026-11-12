/**
 * The height scale shared by the tool pages whose input panel drags to
 * resize, see `InputResizeHandle`. Heights are kept in rem so they keep pace
 * with the font-size setting; each tool sets its own default. The effective
 * maximum is also capped to a share of the viewport, see `maxInputHeight`.
 */
export const INPUT_HEIGHT = { min: 8, max: 48, step: 1 } as const

export function clampInputHeight(height: number, max = maxInputHeight()) {
  return Math.min(max, Math.max(INPUT_HEIGHT.min, height))
}

/** The tallest the input may be here: 70% of the viewport, within the scale. */
export function maxInputHeight() {
  const rootSize = parseFloat(
    getComputedStyle(document.documentElement).fontSize
  )
  const viewportRem = (window.innerHeight * 0.7) / (rootSize || 16)
  return Math.min(INPUT_HEIGHT.max, Math.max(INPUT_HEIGHT.min, viewportRem))
}

/** A stored input height, clamped to the scale, or the fallback if unusable. */
export function readInputHeight(value: unknown, fallback: number) {
  const height = Number(value)
  return Number.isFinite(height) ? clampInputHeight(height) : fallback
}
