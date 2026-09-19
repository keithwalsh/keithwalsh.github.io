import type { CSSProperties } from "react"

export type FrameStyle = "mac" | "minimal"
export type ChromeMode = "dark" | "light"
export type ShadowStyle = "none" | "soft" | "deep"

// The frame is artwork that gets exported, so its colours are fixed per chrome
// mode rather than following the site theme.
const CHROME: Record<
  ChromeMode,
  {
    frame: string
    frameBorder: string
    bar: string
    barBorder: string
    address: string
    addressText: string
    menu: string
    placeholder: [string, string]
    placeholderText: string
  }
> = {
  dark: {
    frame: "oklch(0.145 0 0)",
    frameBorder: "oklch(1 0 0 / 14%)",
    bar: "oklch(0.225 0 0)",
    barBorder: "oklch(1 0 0 / 10%)",
    address: "oklch(0.145 0 0)",
    addressText: "oklch(0.985 0 0 / 85%)",
    menu: "oklch(0.985 0 0 / 45%)",
    placeholder: ["oklch(0.21 0 0)", "oklch(0.245 0 0)"],
    placeholderText: "oklch(0.62 0 0)",
  },
  light: {
    frame: "#ffffff",
    frameBorder: "rgba(0, 0, 0, 0.14)",
    bar: "#f4f4f5",
    barBorder: "rgba(0, 0, 0, 0.08)",
    address: "#ffffff",
    addressText: "rgba(0, 0, 0, 0.72)",
    menu: "rgba(0, 0, 0, 0.42)",
    placeholder: ["oklch(0.97 0 0)", "oklch(0.935 0 0)"],
    placeholderText: "oklch(0.5 0 0)",
  },
}

const SHADOW: Record<ShadowStyle, string> = {
  none: "none",
  soft: "0 18px 40px -14px rgba(0, 0, 0, 0.6)",
  deep: "0 44px 80px -24px rgba(0, 0, 0, 0.85), 0 14px 28px -10px rgba(0, 0, 0, 0.6)",
}

/** A browser frame around a screenshot, or a striped placeholder without one. */
export function BrowserWindow({
  imageUrl,
  width,
  url,
  frame,
  chrome,
  shadow,
  onPlaceholderClick,
}: {
  imageUrl?: string
  width: number
  url: string
  frame: FrameStyle
  chrome: ChromeMode
  shadow: ShadowStyle
  onPlaceholderClick?: () => void
}) {
  const colors = CHROME[chrome]

  return (
    <div
      style={{
        width,
        backgroundColor: colors.frame,
        borderColor: colors.frameBorder,
        boxShadow: SHADOW[shadow],
      }}
      className="shrink-0 overflow-hidden rounded-xl border"
    >
      <div
        style={{ backgroundColor: colors.bar, borderColor: colors.barBorder }}
        className="flex items-center gap-3 border-b px-3.5 py-[7px]"
      >
        {frame === "mac" && (
          <div className="flex shrink-0 gap-1.5" aria-hidden="true">
            <span className="size-[11px] rounded-full bg-[#f25f58]" />
            <span className="size-[11px] rounded-full bg-[#fbbe3c]" />
            <span className="size-[11px] rounded-full bg-[#58cb42]" />
          </div>
        )}
        <div
          style={{ backgroundColor: colors.address, color: colors.addressText }}
          className="h-[26px] min-w-0 flex-1 truncate rounded-full px-3.5 font-mono text-xs leading-[26px]"
        >
          {url}
        </div>
        {frame === "mac" && (
          <div className="flex shrink-0 flex-col gap-[3px]" aria-hidden="true">
            {[0, 1, 2].map((bar) => (
              <span
                key={bar}
                style={{ backgroundColor: colors.menu }}
                className="h-0.5 w-[15px] rounded-full"
              />
            ))}
          </div>
        )}
      </div>

      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Screenshot shown in the browser mockup"
          className="block h-auto w-full"
        />
      ) : (
        // Never exported (export needs an image), so unlike the rest of the
        // frame its label is rem-sized and follows the text-size setting.
        <button
          type="button"
          onClick={onPlaceholderClick}
          style={
            {
              "--stripe-a": colors.placeholder[0],
              "--stripe-b": colors.placeholder[1],
              color: colors.placeholderText,
            } as CSSProperties
          }
          className="flex aspect-video w-full cursor-pointer items-center justify-center bg-[image:repeating-linear-gradient(45deg,var(--stripe-a)_0_7px,var(--stripe-b)_7px_14px)] font-mono text-caption tracking-wide outline-none focus-visible:ring-3 focus-visible:ring-brand/50 focus-visible:ring-inset"
        >
          Your screenshot goes here
        </button>
      )}
    </div>
  )
}
