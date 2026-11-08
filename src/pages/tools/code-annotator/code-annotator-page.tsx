import {
  useDeferredValue,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react"
import { Copy, Download, FileCode2, Images, SquareDashed } from "lucide-react"

import { CodeHighlighter } from "@/components/code-highlighter"
import { brandFillClass } from "@/components/editorial"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { useDownloadImage } from "@/hooks/use-download-image"
import { copyWithToast, readStoredObject } from "@/lib/browser"
import { toMarkdownCodeBlock } from "@/lib/code-highlight"
import { cn } from "@/lib/utils"
import {
  DEFAULT_STATE,
  DISPLAY_OPTIONS,
  clampInputHeight,
  findLanguage,
  type AnnotatorState,
  type DisplayOptions,
} from "@/pages/tools/code-annotator/annotator-settings"
import { InputResizeHandle } from "@/pages/tools/code-annotator/input-resize-handle"
import { SettingsRail } from "@/pages/tools/code-annotator/settings-rail"

const STORAGE_KEY = "code-annotator"

// The input, display options and input height persist between visits.
// Anything unrecognised in storage falls back to its default.
function loadState(): AnnotatorState {
  const saved = readStoredObject(STORAGE_KEY)
  if (!saved) return DEFAULT_STATE
  const text = (key: "code" | "language" | "filename") => {
    const value = saved[key]
    return typeof value === "string" ? value : undefined
  }
  const language = text("language")
  const options: Record<string, unknown> =
    saved.options && typeof saved.options === "object"
      ? { ...saved.options }
      : {}
  const inputHeight = Number(saved.inputHeight)
  return {
    code: text("code") ?? DEFAULT_STATE.code,
    language:
      language && findLanguage(language) ? language : DEFAULT_STATE.language,
    filename: text("filename") ?? DEFAULT_STATE.filename,
    options: Object.fromEntries(
      DISPLAY_OPTIONS.map(({ key }) => {
        const value = options[key]
        return [
          key,
          typeof value === "boolean" ? value : DEFAULT_STATE.options[key],
        ]
      })
    ) as DisplayOptions,
    inputHeight: Number.isFinite(inputHeight)
      ? clampInputHeight(inputHeight)
      : DEFAULT_STATE.inputHeight,
  }
}

/** Turns the filename into a safe name for the downloaded image. */
function imageName(filename: string) {
  return (
    filename
      .trim()
      .replace(/[^\w-]+/g, "-")
      .replace(/^-|-$/g, "") || "code"
  )
}

/** The rendered size of an element, for the canvas readout. */
function useElementSize<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })

  useLayoutEffect(() => {
    const element = ref.current
    if (!element) return
    const update = () =>
      setSize({ width: element.offsetWidth, height: element.offsetHeight })
    update()
    const observer = new ResizeObserver(update)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return { ref, size }
}

export default function CodeAnnotatorPage() {
  const [state, setState] = useState(loadState)
  const { code, language, filename, options, inputHeight } = state
  const { ref: outputRef, size } = useElementSize<HTMLDivElement>()
  // The input panel reads its height from this variable. A drag writes it
  // here directly and only commits to state once the pointer lifts.
  const inputRef = useRef<HTMLElement>(null)
  const { downloadImage, copyImage, isDownloading, isCopying } =
    useDownloadImage()

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // Storage can be unavailable (private mode, blocked site data).
    }
  }, [state])

  const update = (patch: Partial<AnnotatorState>) =>
    setState((current) => ({ ...current, ...patch }))

  // Highlighting the whole document on every keystroke makes typing lag on a
  // long paste, so the output trails the textarea by a render when it's busy.
  const deferredCode = useDeferredValue(code)

  const hasCode = code.trim().length > 0
  const lineCount = code.split("\n").length
  const languageLabel = findLanguage(language)?.label ?? language
  const title = filename.trim()

  const handleDownload = () => {
    if (!outputRef.current) return
    downloadImage(outputRef.current, { filename: imageName(filename) })
  }

  const handleCopyImage = () => {
    if (!outputRef.current) return
    copyImage(outputRef.current)
  }

  return (
    // Breakpoints follow the page's own width, not the viewport's, so the rail
    // still fits beside the canvas when the site sidebar is open.
    <div className="@container/annotator flex flex-1 flex-col">
      <div className="flex flex-1 flex-col @3xl/annotator:h-[calc(100svh-3.5rem)] @3xl/annotator:flex-none">
        <div className="flex h-15 shrink-0 items-center gap-3 border-b px-4 @3xl/annotator:px-5">
          {/* Clicking the chip focuses the filename field in the rail. */}
          <label
            htmlFor="code-filename"
            title="Name the file"
            className="flex min-w-0 cursor-pointer items-center gap-2 rounded-full bg-card py-1 pr-2.5 pl-2 text-caption text-muted-foreground ring-1 ring-tool-control-ring transition-colors duration-150 hover:bg-tool-raised-hover dark:bg-card"
          >
            <FileCode2 className="size-3.5 shrink-0" />
            <span
              className={cn(
                "truncate font-mono text-xs",
                title ? "text-foreground" : "text-subtle"
              )}
            >
              {title || "Untitled"}
            </span>
            <span className="shrink-0 whitespace-nowrap tabular-nums @max-5xl/annotator:hidden">
              {languageLabel} · {lineCount} {lineCount === 1 ? "line" : "lines"}
            </span>
          </label>

          <div className="ml-auto flex shrink-0 items-center gap-2">
            <Button
              variant="outline"
              disabled={!hasCode}
              onClick={() =>
                copyWithToast(
                  toMarkdownCodeBlock(code, language),
                  "Markdown copied"
                )
              }
            >
              <Copy />
              <span className="@max-2xl/annotator:sr-only">Copy Markdown</span>
            </Button>
            <Button
              variant="outline"
              disabled={!hasCode || isCopying}
              onClick={handleCopyImage}
            >
              {isCopying ? <Spinner /> : <Images />}
              <span className="@max-2xl/annotator:sr-only">Copy image</span>
            </Button>
            <Button
              disabled={!hasCode || isDownloading}
              onClick={handleDownload}
              className={cn(brandFillClass, "px-3 font-semibold")}
            >
              {isDownloading ? <Spinner /> : <Download />}
              <span className="@max-2xl/annotator:sr-only">Download PNG</span>
            </Button>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col @3xl/annotator:flex-row-reverse">
          <SettingsRail
            state={state}
            onChange={update}
            className="@max-3xl/annotator:order-last @max-3xl/annotator:border-t"
          />

          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            <section
              ref={inputRef}
              aria-label="Input"
              className="relative flex shrink-0 flex-col border-b"
              style={
                { "--input-height": `${inputHeight}rem` } as React.CSSProperties
              }
            >
              <div className="flex h-10 items-center justify-between border-b border-foreground/6 px-5">
                <label
                  htmlFor="code-input"
                  className="font-mono text-eyebrow text-muted-foreground uppercase"
                >
                  Input
                </label>
                <span className="font-mono text-2xs text-subtle tabular-nums">
                  {lineCount} {lineCount === 1 ? "line" : "lines"} ·{" "}
                  {code.length} chars
                </span>
              </div>
              <Textarea
                id="code-input"
                value={code}
                onChange={(event) => update({ code: event.target.value })}
                spellCheck={false}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                className="field-sizing-fixed h-(--input-height) resize-none rounded-none border-0 px-5 py-4 font-mono text-xs leading-relaxed focus-visible:ring-0 md:text-xs dark:bg-transparent"
              />
              <InputResizeHandle
                height={inputHeight}
                onPreview={(height) =>
                  inputRef.current?.style.setProperty(
                    "--input-height",
                    `${height}rem`
                  )
                }
                onCommit={(height) => update({ inputHeight: height })}
              />
            </section>

            {/* The rendered block sits on the same dotted canvas as Browser
                Mockup's preview. It scrolls here rather than inside the block,
                so the downloaded image isn't cropped to the visible size. */}
            <section
              aria-label="Output"
              className="relative flex min-h-[20rem] flex-1 overflow-auto bg-[color:oklch(0.97_0_0)] bg-[image:radial-gradient(oklch(0_0_0/7%)_1px,transparent_1px)] bg-size-[16px_16px] @3xl/annotator:min-h-0 dark:bg-tool-raised dark:bg-[image:radial-gradient(oklch(1_0_0/7%)_1px,transparent_1px)]"
            >
              <div
                className={cn(
                  "m-auto px-7 pt-7 pb-11",
                  options.wrap ? "w-full max-w-[45.5rem]" : "w-max"
                )}
              >
                <div className="min-w-80 rounded-lg shadow-xl shadow-black/15 dark:shadow-black/50">
                  <CodeHighlighter
                    ref={outputRef}
                    code={deferredCode}
                    language={language}
                    title={title || undefined}
                    className="bg-card dark:bg-[color:oklch(0.17_0_0)]"
                    {...options}
                  />
                </div>
              </div>

              <p className="pointer-events-none absolute bottom-3.5 left-4.5 flex items-center gap-2 font-mono text-2xs text-subtle @max-xl/annotator:hidden">
                <SquareDashed className="size-3.25" />
                The preview is what gets exported
              </p>
              <p className="pointer-events-none absolute right-4.5 bottom-3.5 font-mono text-2xs text-subtle tabular-nums">
                {size.width} × {size.height}
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
