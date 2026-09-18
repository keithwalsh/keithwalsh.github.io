import { useEffect, useState } from "react"
import figlet from "figlet"
import { CircleAlert, Copy, Download, Type } from "lucide-react"

import { InstructionsCard } from "@/components/instructions-card"
import { NumberStepper } from "@/components/number-stepper"
import { OptionSelect } from "@/components/option-select"
import { Page, PageHeader } from "@/components/page"
import { Alert, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
} from "@/components/ui/empty"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { copyWithToast, downloadTextFile } from "@/lib/browser"

// Fonts ship as JS modules, so each one is only fetched when first selected.
const FONT_LOADERS = {
  Standard: () => import("figlet/fonts/Standard"),
  Big: () => import("figlet/fonts/Big"),
  Small: () => import("figlet/fonts/Small"),
  Block: () => import("figlet/fonts/Block"),
  Slant: () => import("figlet/fonts/Slant"),
  Ghost: () => import("figlet/fonts/Ghost"),
  Speed: () => import("figlet/fonts/Speed"),
}

type FontName = keyof typeof FONT_LOADERS

const FONT_OPTIONS = (Object.keys(FONT_LOADERS) as FontName[]).map((font) => ({
  value: font,
  label: font,
}))

const LAYOUT_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "full", label: "Full" },
  { value: "fitted", label: "Fitted" },
  { value: "controlled smushing", label: "Controlled smushing" },
  { value: "universal smushing", label: "Universal smushing" },
] as const

type Layout = (typeof LAYOUT_OPTIONS)[number]["value"]

const parsedFonts = new Set<FontName>()

async function loadFont(font: FontName) {
  if (parsedFonts.has(font)) return
  const { default: data } = await FONT_LOADERS[font]()
  figlet.parseFont(font, data)
  parsedFonts.add(font)
}

export default function TextToAsciiPage() {
  const [text, setText] = useState("HELLO WORLD")
  const [font, setFont] = useState<FontName>("Standard")
  const [horizontalLayout, setHorizontalLayout] = useState<Layout>("default")
  const [verticalLayout, setVerticalLayout] = useState<Layout>("default")
  const [width, setWidth] = useState(80)
  const [whitespaceBreak, setWhitespaceBreak] = useState(true)
  const [output, setOutput] = useState("")
  const [error, setError] = useState<string | null>(null)

  const hasText = text.trim().length > 0

  useEffect(() => {
    if (!text.trim()) return
    let cancelled = false

    const generate = async () => {
      try {
        await loadFont(font)
        const result = await figlet.text(text, {
          font,
          horizontalLayout,
          verticalLayout,
          width,
          whitespaceBreak,
        })
        if (!cancelled) {
          setOutput(result)
          setError(null)
        }
      } catch (cause) {
        if (!cancelled) {
          setOutput("")
          setError(
            `Failed to generate ASCII art with font "${font}". ${cause instanceof Error ? cause.message : ""}`
          )
        }
      }
    }

    generate()
    return () => {
      cancelled = true
    }
  }, [text, font, horizontalLayout, verticalLayout, width, whitespaceBreak])

  const visibleOutput = hasText ? output : ""
  const filename = `ascii-art-${text.trim().replace(/\s+/g, "-").toLowerCase() || "text"}.txt`

  return (
    <Page>
      <PageHeader description="Convert your text into ASCII art using various fonts. Perfect for creating banners, headers, or decorative text." />

      <Card>
        <CardContent className="flex flex-col gap-5">
          <Field>
            <FieldLabel htmlFor="ascii-text">Enter your text</FieldLabel>
            <Textarea
              id="ascii-text"
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Type something awesome..."
              className="min-h-0"
              rows={2}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-3">
            <OptionSelect
              id="ascii-font"
              label="Font style"
              value={font}
              onValueChange={setFont}
              options={FONT_OPTIONS}
            />
            <OptionSelect
              id="ascii-horizontal-layout"
              label="Horizontal layout"
              value={horizontalLayout}
              onValueChange={setHorizontalLayout}
              options={LAYOUT_OPTIONS}
            />
            <OptionSelect
              id="ascii-vertical-layout"
              label="Vertical layout"
              value={verticalLayout}
              onValueChange={setVerticalLayout}
              options={LAYOUT_OPTIONS}
            />
          </div>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            <Field orientation="horizontal" className="w-auto">
              <span className="text-sm font-medium">Width</span>
              <NumberStepper
                label="Width"
                value={width}
                onChange={setWidth}
                min={40}
                max={200}
                disabled={!hasText}
              />
            </Field>
            <Field orientation="horizontal" className="w-auto">
              <Switch
                id="ascii-whitespace-break"
                checked={whitespaceBreak}
                onCheckedChange={setWhitespaceBreak}
              />
              <FieldContent>
                <FieldLabel htmlFor="ascii-whitespace-break">
                  Whitespace break
                </FieldLabel>
                <FieldDescription>
                  Break lines at whitespace to fit the width
                </FieldDescription>
              </FieldContent>
            </Field>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <CircleAlert />
          <AlertTitle>{error}</AlertTitle>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Output</CardTitle>
          <CardAction className="flex gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Copy ASCII art"
                  disabled={!visibleOutput}
                  onClick={() => copyWithToast(visibleOutput)}
                >
                  <Copy />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Copy to clipboard</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Download as text file"
                  disabled={!visibleOutput}
                  onClick={() => downloadTextFile(visibleOutput, filename)}
                >
                  <Download />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Download as text file</TooltipContent>
            </Tooltip>
          </CardAction>
        </CardHeader>
        <CardContent>
          {visibleOutput ? (
            <pre className="overflow-x-auto rounded-lg border bg-muted/40 p-4 font-mono text-[0.6rem] leading-tight sm:text-xs md:text-sm">
              {visibleOutput}
            </pre>
          ) : (
            <Empty className="border">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Type />
                </EmptyMedia>
                <EmptyDescription>
                  {hasText
                    ? "ASCII art will appear here"
                    : "Enter some text to get started"}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </CardContent>
      </Card>

      <InstructionsCard
        title="Tips"
        steps={[
          "Try different fonts to find the perfect style for your text",
          "Shorter text works best for complex fonts",
          "Adjust width for better text wrapping and appearance",
          "Try different horizontal/vertical layouts for unique effects",
          "Use the copy button to easily share your ASCII art",
          "Download as a text file to save your creations",
        ]}
      />
    </Page>
  )
}
