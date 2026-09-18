import { useDeferredValue, useEffect, useRef, useState } from "react"
import { Copy, Download, Images } from "lucide-react"

import { CodeHighlighter } from "@/components/code-highlighter"
import { IconButton } from "@/components/icon-button"
import { InlineCode } from "@/components/inline-code"
import { Page, PageHeader } from "@/components/page"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldLabel, FieldTitle } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useDownloadImage } from "@/hooks/use-download-image"
import { copyWithToast } from "@/lib/browser"
import { toMarkdownCodeBlock } from "@/lib/code-highlight"
import { cn } from "@/lib/utils"

/** `commentEnd` is set for languages whose comments have to be closed. */
const LANGUAGE_OPTIONS: {
  value: string
  label: string
  comment: string
  commentEnd?: string
}[] = [
  { value: "javascript", label: "JavaScript", comment: "//" },
  { value: "typescript", label: "TypeScript", comment: "//" },
  { value: "tsx", label: "TSX", comment: "//" },
  { value: "python", label: "Python", comment: "#" },
  { value: "java", label: "Java", comment: "//" },
  { value: "csharp", label: "C#", comment: "//" },
  { value: "c", label: "C", comment: "//" },
  { value: "cpp", label: "C++", comment: "//" },
  { value: "go", label: "Go", comment: "//" },
  { value: "rust", label: "Rust", comment: "//" },
  { value: "ruby", label: "Ruby", comment: "#" },
  { value: "php", label: "PHP", comment: "//" },
  { value: "sql", label: "SQL", comment: "--" },
  { value: "bash", label: "Bash", comment: "#" },
  { value: "markup", label: "HTML", comment: "<!--", commentEnd: "-->" },
  { value: "css", label: "CSS", comment: "/*", commentEnd: "*/" },
  { value: "json", label: "JSON", comment: "//" },
  { value: "yaml", label: "YAML", comment: "#" },
  { value: "markdown", label: "Markdown", comment: "<!--", commentEnd: "-->" },
]

const DISPLAY_OPTIONS = [
  { key: "showLineNumbers", id: "code-line-numbers", label: "Line numbers" },
  { key: "wrap", id: "code-wrap", label: "Wrap lines" },
  {
    key: "strikethrough",
    id: "code-strikethrough",
    label: "Strike through removed words",
  },
] as const

type DisplayOptions = Record<(typeof DISPLAY_OPTIONS)[number]["key"], boolean>

// `comment: true` markers are written in the selected language's comment style.
const SYNTAX = [
  {
    comment: true,
    markers: ["Add", "Remove"],
    effect: "Marks the next line as added or removed",
  },
  {
    comment: false,
    markers: ["[+new+]", "[-old-]"],
    effect: "Marks the wrapped text as added or removed",
  },
  {
    comment: true,
    markers: ["highlight-next-line"],
    effect: "Highlights the next line",
  },
  {
    comment: true,
    markers: ["highlight-start", "highlight-end"],
    effect: "Highlights every line between them",
  },
]

const DEFAULT_CODE = `<?php
// Remove
echo "Hello [-Room-]";
// Add
echo "Hello [+World+]";
?>`

const STORAGE_KEY = "code-annotator"

type AnnotatorState = {
  code: string
  language: string
  filename: string
  options: DisplayOptions
}

const DEFAULT_STATE: AnnotatorState = {
  code: DEFAULT_CODE,
  language: "php",
  filename: "",
  options: { showLineNumbers: true, wrap: true, strikethrough: true },
}

// The input and display options persist between visits. Anything unrecognised
// in storage falls back to its default.
function loadState(): AnnotatorState {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null")
    if (!saved || typeof saved !== "object") return DEFAULT_STATE
    const text = (key: "code" | "language" | "filename") =>
      typeof saved[key] === "string" ? (saved[key] as string) : undefined
    const language = text("language")
    return {
      code: text("code") ?? DEFAULT_STATE.code,
      language:
        language && LANGUAGE_OPTIONS.some((option) => option.value === language)
          ? language
          : DEFAULT_STATE.language,
      filename: text("filename") ?? DEFAULT_STATE.filename,
      options: Object.fromEntries(
        DISPLAY_OPTIONS.map(({ key }) => [
          key,
          typeof saved.options?.[key] === "boolean"
            ? saved.options[key]
            : DEFAULT_STATE.options[key],
        ])
      ) as DisplayOptions,
    }
  } catch {
    return DEFAULT_STATE
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

export default function CodeAnnotatorPage() {
  const [state, setState] = useState(loadState)
  const { code, language, filename, options } = state
  const outputRef = useRef<HTMLDivElement>(null)
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
  const selected = LANGUAGE_OPTIONS.find((option) => option.value === language)
  const writeComment = (marker: string) =>
    [selected?.comment ?? "//", marker, selected?.commentEnd]
      .filter(Boolean)
      .join(" ")

  const handleDownload = () => {
    if (!outputRef.current) return
    downloadImage(outputRef.current, { filename: imageName(filename) })
  }

  const handleCopyImage = () => {
    if (!outputRef.current) return
    copyImage(outputRef.current)
  }

  return (
    <Page>
      <PageHeader description="Mark lines and words as added, removed or highlighted, then copy the result as Markdown or download it as a PNG." />

      <Card>
        <CardContent className="flex flex-wrap items-center gap-x-8 gap-y-4">
          <Field orientation="horizontal" className="w-auto">
            <FieldLabel htmlFor="code-language">Language</FieldLabel>
            <Select
              value={language}
              onValueChange={(value) => update({ language: value })}
            >
              <SelectTrigger id="code-language" className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field orientation="horizontal" className="w-auto">
            <FieldLabel htmlFor="code-filename">Filename</FieldLabel>
            <Input
              id="code-filename"
              value={filename}
              onChange={(event) => update({ filename: event.target.value })}
              placeholder="Optional"
              spellCheck={false}
              autoComplete="off"
              className="w-40"
            />
          </Field>
          {DISPLAY_OPTIONS.map(({ key, id, label }) => (
            <Field key={key} orientation="horizontal" className="w-auto">
              <Switch
                id={id}
                checked={options[key]}
                onCheckedChange={(checked) =>
                  update({ options: { ...options, [key]: checked } })
                }
              />
              <FieldLabel htmlFor={id}>{label}</FieldLabel>
            </Field>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="code-input">Input</FieldLabel>
          <Textarea
            id="code-input"
            value={code}
            onChange={(event) => update({ code: event.target.value })}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            className="min-h-64 font-mono text-xs leading-relaxed md:text-xs"
          />
        </Field>
        <Field>
          <div className="flex items-center justify-between gap-2">
            <FieldTitle>Output</FieldTitle>
            <div className="-my-1 flex items-center gap-1">
              <IconButton
                label="Copy as Markdown"
                disabled={!hasCode}
                onClick={() =>
                  copyWithToast(
                    toMarkdownCodeBlock(code, language),
                    "Markdown copied"
                  )
                }
              >
                <Copy />
              </IconButton>
              <IconButton
                label="Copy image"
                disabled={!hasCode || isCopying}
                onClick={handleCopyImage}
              >
                {isCopying ? <Spinner /> : <Images />}
              </IconButton>
              {/* The same primary export as Browser Mockup's. */}
              <Button
                size="sm"
                disabled={!hasCode || isDownloading}
                onClick={handleDownload}
                className="ml-1 bg-brand font-semibold text-brand-foreground transition-colors duration-150 hover:bg-brand-hover"
              >
                {isDownloading ? <Spinner /> : <Download />}
                Download PNG
              </Button>
            </div>
          </div>
          {/* Unwrapped lines scroll here rather than inside the block, so the
              downloaded image isn't cropped to the visible width. */}
          <div className={cn(!options.wrap && "overflow-x-auto")}>
            <CodeHighlighter
              ref={outputRef}
              code={deferredCode}
              language={language}
              title={filename.trim() || undefined}
              className={cn(!options.wrap && "w-max min-w-full")}
              {...options}
            />
          </div>
        </Field>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Syntax</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid items-baseline gap-x-6 gap-y-3 sm:grid-cols-[auto_1fr]">
            {SYNTAX.map(({ comment, markers, effect }) => (
              <div key={effect} className="flex flex-col gap-1 sm:contents">
                <dt className="flex flex-wrap gap-1.5">
                  {markers.map((marker) => (
                    <InlineCode key={marker}>
                      {comment ? writeComment(marker) : marker}
                    </InlineCode>
                  ))}
                </dt>
                <dd className="text-muted-foreground">{effect}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>
    </Page>
  )
}
