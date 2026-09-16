import { useEffect, useRef, useState } from "react"
import { CircleAlert, Download, ImageIcon } from "lucide-react"

import { InstructionsCard } from "@/components/instructions-card"
import { Page, PageHeader } from "@/components/page"
import { Alert, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldLabel } from "@/components/ui/field"
import { Slider } from "@/components/ui/slider"
import { Spinner } from "@/components/ui/spinner"
import { useDownloadImage } from "@/hooks/use-download-image"
import { BrowserWindow } from "@/pages/tools/browser-mockup/browser-window"
import { DropZone } from "@/pages/tools/browser-mockup/drop-zone"

const MAX_FILE_SIZE = 5 * 1024 * 1024
const WIDTH = { min: 400, max: 1000, step: 10, default: 700 }

type UploadedImage = { url: string; name: string; size: number }

function formatFileSize(bytes: number) {
  if (bytes === 0) return "0 Bytes"
  const units = ["Bytes", "KB", "MB", "GB"]
  const exponent = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${Number.parseFloat((bytes / 1024 ** exponent).toFixed(2))} ${units[exponent]}`
}

export default function BrowserMockupPage() {
  const [image, setImage] = useState<UploadedImage | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [width, setWidth] = useState(WIDTH.default)
  const windowRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLElement>(null)
  const { downloadImage, isDownloading } = useDownloadImage()

  useEffect(() => {
    if (image) {
      previewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [image])

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("File type not accepted. Please choose an image.")
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("File size exceeds the 5 MB limit.")
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setError(null)
      setImage({ url: String(reader.result), name: file.name, size: file.size })
    }
    reader.onerror = () => setError("Error reading file.")
    reader.readAsDataURL(file)
  }

  const handleDownload = () => {
    if (!windowRef.current) return
    downloadImage(windowRef.current, { filename: "browser-window-screenshot" })
  }

  return (
    <Page>
      <PageHeader
        title="Browser Window Mockup"
        description="Frame a screenshot in a browser window and download it as a PNG."
      />

      <div className="grid gap-4 md:grid-cols-2">
        <InstructionsCard
          title="How to Use"
          steps={[
            "Drag and drop or click to select an image",
            "The image appears in the browser mockup",
            "Adjust the browser window width using the slider",
            "Click the address bar to edit the displayed URL",
            'Click "Download PNG" to save the mockup',
          ]}
        />
        <DropZone onFile={handleFile} />
      </div>

      {error && (
        <Alert variant="destructive">
          <CircleAlert />
          <AlertTitle>{error}</AlertTitle>
        </Alert>
      )}

      {image && (
        <section
          ref={previewRef}
          aria-label="Browser mockup preview"
          className="flex animate-in scroll-mt-20 flex-col gap-4 duration-700 fade-in-0 slide-in-from-bottom-8"
        >
          <Card>
            <CardContent className="flex flex-wrap items-center gap-x-8 gap-y-4">
              <p className="flex min-w-0 items-center gap-2 text-sm">
                <ImageIcon className="size-4 shrink-0 text-muted-foreground" />
                <span className="truncate font-medium">{image.name}</span>
                <span className="shrink-0 text-muted-foreground">
                  ({formatFileSize(image.size)})
                </span>
              </p>
              <Field className="min-w-60 flex-1">
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="window-width">Window width</FieldLabel>
                  <span className="text-sm text-muted-foreground tabular-nums">
                    {width}px
                  </span>
                </div>
                <Slider
                  id="window-width"
                  min={WIDTH.min}
                  max={WIDTH.max}
                  step={WIDTH.step}
                  value={[width]}
                  onValueChange={([value]) => setWidth(value)}
                />
              </Field>
              <Button onClick={handleDownload} disabled={isDownloading}>
                {isDownloading ? <Spinner /> : <Download />}
                {isDownloading ? "Downloading..." : "Download PNG"}
              </Button>
            </CardContent>
          </Card>

          <div className="overflow-x-auto pb-2">
            <BrowserWindow ref={windowRef} imageUrl={image.url} width={width} />
          </div>
        </section>
      )}
    </Page>
  )
}
