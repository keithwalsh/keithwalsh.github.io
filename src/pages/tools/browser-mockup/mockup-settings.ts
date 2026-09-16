import type {
  ChromeMode,
  FrameStyle,
  ShadowStyle,
} from "@/pages/tools/browser-mockup/browser-window"

export type Backdrop = "none" | "solid" | "gradient"
export type ExportScale = 1 | 2 | 3

export type MockupSettings = {
  width: number
  padding: number
  frame: FrameStyle
  chrome: ChromeMode
  backdrop: Backdrop
  shadow: ShadowStyle
  scale: ExportScale
  url: string
}

export const WIDTH = { min: 400, max: 1000, step: 10 }
export const PADDING = { min: 0, max: 120, step: 4 }

export const DEFAULT_SETTINGS: MockupSettings = {
  width: 700,
  padding: 48,
  frame: "mac",
  chrome: "dark",
  backdrop: "gradient",
  shadow: "soft",
  scale: 2,
  url: "keithwalsh.ie/tools/browser-mockup",
}
