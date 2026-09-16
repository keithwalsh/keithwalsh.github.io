import { useCallback, useState } from "react"
import { toCanvas } from "html-to-image"
import { toast } from "sonner"

import { downloadBlob } from "@/lib/browser"

const SHADOW_PADDING = 16

function pageBackgroundColor() {
  return document.documentElement.classList.contains("dark")
    ? "#0a0a0a"
    : "#ffffff"
}

type RenderOptions = {
  /** Output pixels per CSS pixel. Defaults to the display's pixel ratio. */
  pixelRatio?: number
  /**
   * Draw the element on a padded background with a soft shadow. Set to false
   * to capture the element exactly as it is, transparency included.
   */
  framed?: boolean
  backgroundColor?: string
}

async function renderPng(
  element: HTMLElement,
  {
    pixelRatio = window.devicePixelRatio || 1,
    framed = true,
    backgroundColor = pageBackgroundColor(),
  }: RenderOptions
) {
  const capture = await toCanvas(element, { pixelRatio })
  let canvas = capture

  if (framed) {
    const padding = SHADOW_PADDING * pixelRatio
    canvas = document.createElement("canvas")
    canvas.width = capture.width + padding * 2
    canvas.height = capture.height + padding * 2
    const context = canvas.getContext("2d")
    if (!context) {
      throw new Error("Canvas isn't supported in this browser")
    }

    context.fillStyle = backgroundColor
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.shadowColor = "rgba(0, 0, 0, 0.15)"
    context.shadowBlur = 8 * pixelRatio
    context.shadowOffsetX = pixelRatio
    context.shadowOffsetY = 2 * pixelRatio
    context.drawImage(capture, padding, padding)
  }

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/png")
  )
  if (!blob) {
    throw new Error("Failed to generate the image")
  }
  return blob
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown error"
}

/**
 * Captures an element as a PNG, to download or copy to the clipboard. By
 * default it's drawn on a padded background with a soft shadow, and the
 * background is the page background for the current theme.
 */
export function useDownloadImage() {
  const [isDownloading, setIsDownloading] = useState(false)
  const [isCopying, setIsCopying] = useState(false)

  const downloadImage = useCallback(
    async (
      element: HTMLElement,
      { filename, ...options }: RenderOptions & { filename: string }
    ) => {
      setIsDownloading(true)
      try {
        downloadBlob(await renderPng(element, options), `${filename}.png`)
      } catch (error) {
        toast.error(`Download failed: ${errorMessage(error)}`)
      } finally {
        setIsDownloading(false)
      }
    },
    []
  )

  const copyImage = useCallback(
    async (element: HTMLElement, options: RenderOptions = {}) => {
      if (!navigator.clipboard?.write || typeof ClipboardItem === "undefined") {
        toast.error("Copying images isn't supported in this browser")
        return
      }

      setIsCopying(true)
      try {
        // Safari only allows the write if it starts synchronously in the click
        // handler, so hand the clipboard a promise rather than awaiting first.
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": renderPng(element, options) }),
        ])
        toast.success("Image copied to clipboard")
      } catch (error) {
        toast.error(`Copy failed: ${errorMessage(error)}`)
      } finally {
        setIsCopying(false)
      }
    },
    []
  )

  return { downloadImage, copyImage, isDownloading, isCopying }
}
