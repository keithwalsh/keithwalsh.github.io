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

/**
 * Captures an element as a PNG on a padded background with a soft shadow. The
 * background defaults to the page background for the current theme.
 */
export function useDownloadImage() {
  const [isDownloading, setIsDownloading] = useState(false)

  const downloadImage = useCallback(
    async (
      element: HTMLElement,
      {
        filename,
        backgroundColor = pageBackgroundColor(),
      }: { filename: string; backgroundColor?: string }
    ) => {
      setIsDownloading(true)
      try {
        const pixelRatio = window.devicePixelRatio || 1
        const capture = await toCanvas(element, { pixelRatio })
        const padding = SHADOW_PADDING * pixelRatio

        const canvas = document.createElement("canvas")
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

        const blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob(resolve, "image/png")
        )
        if (!blob) {
          throw new Error("Failed to generate the image")
        }
        downloadBlob(blob, `${filename}.png`)
      } catch (error) {
        toast.error(
          `Download failed: ${error instanceof Error ? error.message : "Unknown error"}`
        )
      } finally {
        setIsDownloading(false)
      }
    },
    []
  )

  return { downloadImage, isDownloading }
}
