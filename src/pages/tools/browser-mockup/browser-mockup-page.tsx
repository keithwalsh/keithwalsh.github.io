import {
  useEffect,
  useEffectEvent,
  useLayoutEffect,
  useRef,
  useState,
} from "react"
import {
  CircleAlert,
  Copy,
  Download,
  ImageIcon,
  SquareDashed,
  Upload,
} from "lucide-react"

import { Page, PageHeader } from "@/components/page"
import { Alert, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useDownloadImage } from "@/hooks/use-download-image"
import { cn } from "@/lib/utils"
import { BrowserWindow } from "@/pages/tools/browser-mockup/browser-window"
import { DropZone } from "@/pages/tools/browser-mockup/drop-zone"
import {
  DEFAULT_SETTINGS,
  PADDING,
  WIDTH,
  type Backdrop,
  type MockupSettings,
} from "@/pages/tools/browser-mockup/mockup-settings"
import { SettingsRail } from "@/pages/tools/browser-mockup/settings-rail"

const MAX_FILE_SIZE = 5 * 1024 * 1024
const STORAGE_KEY = "browser-mockup-settings"

const BACKDROP: Record<Backdrop, string | undefined> = {
  none: undefined,
  solid: "oklch(0.30 0 0)",
  gradient:
    "linear-gradient(135deg, oklch(0.5 0.14 264), oklch(0.56 0.12 310))",
}

type UploadedImage = { url: string; name: string; size: number }

function formatFileSize(bytes: number) {
  if (bytes === 0) return "0 Bytes"
  const units = ["Bytes", "KB", "MB", "GB"]
  const exponent = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${Number.parseFloat((bytes / 1024 ** exponent).toFixed(2))} ${units[exponent]}`
}

const clamp = (value: unknown, { min, max }: { min: number; max: number }) =>
  typeof value === "number" ? Math.min(max, Math.max(min, value)) : undefined

// Settings (not the image) persist between visits. Anything unrecognised in
// storage falls back to its default.
function loadSettings(): MockupSettings {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null")
    if (!saved || typeof saved !== "object") return DEFAULT_SETTINGS
    const pick = <K extends keyof MockupSettings>(
      key: K,
      allowed: readonly MockupSettings[K][]
    ) => (allowed.includes(saved[key]) ? saved[key] : DEFAULT_SETTINGS[key])
    return {
      width: clamp(saved.width, WIDTH) ?? DEFAULT_SETTINGS.width,
      padding: clamp(saved.padding, PADDING) ?? DEFAULT_SETTINGS.padding,
      frame: pick("frame", ["mac", "minimal"]),
      chrome: pick("chrome", ["dark", "light"]),
      backdrop: pick("backdrop", ["none", "solid", "gradient"]),
      shadow: pick("shadow", ["none", "soft", "deep"]),
      scale: pick("scale", [1, 2, 3]),
      url: typeof saved.url === "string" ? saved.url : DEFAULT_SETTINGS.url,
    }
  } catch {
    return DEFAULT_SETTINGS
  }
}

/**
 * Scales content down to fit its container, like a design tool's "zoom to
 * fit". Returns the content's natural size, which is what gets exported.
 */
function useFitToContainer() {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [fit, setFit] = useState({ scale: 1, width: 0, height: 0 })

  useLayoutEffect(() => {
    const container = containerRef.current
    const content = contentRef.current
    if (!container || !content) return

    const update = () => {
      const style = getComputedStyle(container)
      const availableWidth =
        container.clientWidth -
        parseFloat(style.paddingLeft) -
        parseFloat(style.paddingRight)
      const availableHeight =
        container.clientHeight -
        parseFloat(style.paddingTop) -
        parseFloat(style.paddingBottom)
      const width = content.offsetWidth
      const height = content.offsetHeight
      const scale = Math.min(
        1,
        availableWidth / width,
        availableHeight / height
      )
      setFit({ scale: Math.max(scale, 0.1), width, height })
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(container)
    observer.observe(content)
    return () => observer.disconnect()
  }, [])

  return { containerRef, contentRef, fit }
}

export default function BrowserMockupPage() {
  const [image, setImage] = useState<UploadedImage | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [settings, setSettings] = useState(loadSettings)
  const inputRef = useRef<HTMLInputElement>(null)
  const { containerRef, contentRef, fit } = useFitToContainer()
  const { downloadImage, copyImage, isDownloading, isCopying } =
    useDownloadImage()

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    } catch {
      // Storage can be unavailable (private mode, blocked site data).
    }
  }, [settings])

  const updateSettings = (patch: Partial<MockupSettings>) =>
    setSettings((current) => ({ ...current, ...patch }))

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

  // Pasting an image anywhere on the page frames it, unless typing in a field.
  const onPaste = useEffectEvent((event: ClipboardEvent) => {
    const target = event.target as HTMLElement | null
    if (target?.closest("input, textarea, [contenteditable]")) return
    const file = event.clipboardData?.files[0]
    if (file) {
      event.preventDefault()
      handleFile(file)
    }
  })
  useEffect(() => {
    document.addEventListener("paste", onPaste)
    return () => document.removeEventListener("paste", onPaste)
  }, [])

  const chooseFile = () => inputRef.current?.click()

  const exportOptions = { pixelRatio: settings.scale, framed: false }
  const filename = image
    ? `${image.name.replace(/\.[^.]+$/, "")}-mockup`
    : "browser-mockup"

  const handleDownload = () => {
    if (contentRef.current) {
      downloadImage(contentRef.current, { filename, ...exportOptions })
    }
  }

  const handleCopy = () => {
    if (contentRef.current) {
      copyImage(contentRef.current, exportOptions)
    }
  }

  const backdrop = BACKDROP[settings.backdrop]
  const stageRadius = settings.padding > 0 ? "rounded-2xl" : "rounded-xl"

  return (
    // Breakpoints follow the page's own width, not the viewport's, so the rail
    // still fits beside the canvas when the site sidebar is open.
    <div className="@container/mockup flex flex-1 flex-col">
      <div className="flex flex-1 flex-col @3xl/mockup:h-[calc(100svh-3.5rem)] @3xl/mockup:flex-none">
        <Page className="shrink-0">
          <PageHeader title="Browser Window Mockup" />
        </Page>
        <div className="flex h-15 shrink-0 items-center gap-3 border-y px-4 @3xl/mockup:px-5">
          <button
            type="button"
            onClick={chooseFile}
            title={image ? "Choose a different image" : "Choose an image"}
            className="flex min-w-0 items-center gap-2 rounded-full bg-card py-1 pr-2.5 pl-2 text-[13px] text-muted-foreground ring-1 ring-tool-control-ring transition-colors duration-150 outline-none hover:bg-tool-raised-hover focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-card"
          >
            <ImageIcon className="size-3.5 shrink-0" />
            <span className="truncate text-foreground">
              {image ? image.name : "Choose an image"}
            </span>
            <span className="shrink-0 whitespace-nowrap @max-5xl/mockup:hidden">
              {image ? formatFileSize(image.size) : "JPG · PNG · up to 5 MB"}
            </span>
          </button>

          <div className="ml-auto flex shrink-0 items-center gap-2">
            <Button variant="outline" onClick={chooseFile}>
              <Upload />
              <span className="@max-2xl/mockup:sr-only">
                {image ? "Replace" : "Upload"}
              </span>
            </Button>
            <Button
              variant="outline"
              onClick={handleCopy}
              disabled={!image || isCopying}
            >
              {isCopying ? <Spinner /> : <Copy />}
              <span className="@max-2xl/mockup:sr-only">Copy</span>
            </Button>
            <Button
              onClick={handleDownload}
              disabled={!image || isDownloading}
              className="bg-brand px-3 font-semibold text-brand-foreground transition-colors duration-150 hover:bg-brand-hover"
            >
              {isDownloading ? <Spinner /> : <Download />}
              <span className="@max-2xl/mockup:sr-only">Download PNG</span>
            </Button>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col @3xl/mockup:flex-row-reverse">
          <SettingsRail
            settings={settings}
            onChange={updateSettings}
            exportWidth={fit.width}
            className="@max-3xl/mockup:order-last @max-3xl/mockup:border-t"
          />

          <DropZone
            onFile={handleFile}
            className="flex h-[60svh] min-h-[420px] min-w-0 flex-col overflow-hidden bg-[color:oklch(0.97_0_0)] bg-[image:radial-gradient(oklch(0_0_0/7%)_1px,transparent_1px)] bg-size-[16px_16px] @3xl/mockup:h-auto @3xl/mockup:min-h-0 @3xl/mockup:flex-1 dark:bg-tool-raised dark:bg-[image:radial-gradient(oklch(1_0_0/7%)_1px,transparent_1px)]"
          >
            {error && (
              <Alert
                variant="destructive"
                className="absolute top-4 left-1/2 z-10 w-auto max-w-[calc(100%-2rem)] -translate-x-1/2 bg-card shadow-md"
              >
                <CircleAlert />
                <AlertTitle>{error}</AlertTitle>
              </Alert>
            )}

            <div
              ref={containerRef}
              // Absolutely positioned so the scaled preview never widens the page.
              className="absolute inset-0 flex items-center justify-center px-7 pt-7 pb-11"
            >
              <div
                className="relative shrink-0"
                style={{
                  width: fit.width * fit.scale,
                  height: fit.height * fit.scale,
                }}
              >
                <div
                  className={cn(
                    "absolute top-0 left-0 origin-top-left",
                    stageRadius,
                    settings.backdrop === "none" &&
                      settings.padding > 0 &&
                      "bg-[image:repeating-conic-gradient(oklch(0.93_0_0)_0%_25%,oklch(0.985_0_0)_0%_50%)] bg-size-[18px_18px] bg-center dark:bg-[image:repeating-conic-gradient(oklch(0.26_0_0)_0%_25%,oklch(0.21_0_0)_0%_50%)]"
                  )}
                  style={{ transform: `scale(${fit.scale})` }}
                >
                  {/* Everything inside this element is what gets exported. */}
                  <div
                    ref={contentRef}
                    className={cn("w-max", stageRadius)}
                    style={{ padding: settings.padding, background: backdrop }}
                  >
                    <BrowserWindow
                      imageUrl={image?.url}
                      width={settings.width}
                      url={settings.url}
                      frame={settings.frame}
                      chrome={settings.chrome}
                      shadow={settings.shadow}
                      onPlaceholderClick={chooseFile}
                    />
                  </div>
                </div>
              </div>
            </div>

            <p className="pointer-events-none absolute bottom-3.5 left-[18px] flex items-center gap-2 font-mono text-[11px] text-subtle @max-xl/mockup:hidden">
              <SquareDashed className="size-[13px]" />
              drop or paste a new image anywhere on the canvas
            </p>
            <p className="pointer-events-none absolute right-[18px] bottom-3.5 font-mono text-[11px] text-subtle tabular-nums">
              {fit.width} × {fit.height}
              {fit.scale < 1 && ` · ${Math.round(fit.scale * 100)}%`}
            </p>
          </DropZone>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          tabIndex={-1}
          aria-hidden="true"
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (file) handleFile(file)
            // Reset so choosing the same file again still fires a change.
            event.target.value = ""
          }}
        />
      </div>
    </div>
  )
}
