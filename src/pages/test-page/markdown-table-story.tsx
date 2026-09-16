import { MarkdownTable } from "@/components/markdown-table"
import type { Alignment } from "@/lib/markdown-table"
import {
  ComponentPreview,
  type PreviewProps,
  type PropDefinition,
} from "@/pages/test-page/component-preview"

const SAMPLE_DATA = [
  ["Package ID", "Weight (kg)", "Status", "Destination"],
  ["PKG-2024-001", "12.50", "In Transit", "Dublin, IE"],
  ["PKG-2024-002", "3.75", "Delivered", "New York, US"],
  ["PKG-2024-003", "8.20", "Processing", "Frankfurt, DE"],
  ["PKG-2024-004", "5.60", "In Transit", "London, GB"],
]

const COLUMN_ALIGNMENTS: Alignment[] = ["left", "right", "center", "none"]

const CODE_EXAMPLE = `import { MarkdownTable } from "@/components/markdown-table"

const data = [
  ["Package ID", "Weight (kg)", "Status", "Destination"],
  ["PKG-2024-001", "12.50", "In Transit", "Dublin, IE"],
  ["PKG-2024-002", "3.75", "Delivered", "New York, US"],
  ["PKG-2024-003", "8.20", "Processing", "Frankfurt, DE"],
  ["PKG-2024-004", "5.60", "In Transit", "London, GB"],
]

export function TableExample() {
  return (
    <MarkdownTable
      inputData={data}
      columnAlignments={["left", "right", "center", "none"]}
      showLineNumbers
    />
  )
}`

const PROP_DEFINITIONS: PropDefinition[] = [
  {
    name: "inputData",
    description: "Outer arrays are rows; inner arrays are cells.",
    type: "string[][] | null",
    defaultValue: "null",
    controlType: "object",
  },
  {
    name: "columnAlignments",
    description:
      "One of 'left', 'center', 'right', or 'none'. Defaults to 'none'.",
    type: "readonly Alignment[]",
    defaultValue: "[]",
    controlType: "object",
  },
  {
    name: "isCompact",
    description: "Disables column width alignment.",
    type: "boolean",
    defaultValue: false,
    controlType: "boolean",
  },
  {
    name: "hasPadding",
    description: "Adds a space before and after cell content.",
    type: "boolean",
    defaultValue: true,
    controlType: "boolean",
  },
  {
    name: "hasTabs",
    description: "Adds a tab character after each | and before the content.",
    type: "boolean",
    defaultValue: false,
    controlType: "boolean",
  },
  {
    name: "hasHeader",
    description: "Indicates whether the first row of inputData is a header.",
    type: "boolean",
    defaultValue: true,
    controlType: "boolean",
  },
  {
    name: "convertLineBreaks",
    description: "Replace newlines with <br> tags in table cells.",
    type: "boolean",
    defaultValue: false,
    controlType: "boolean",
  },
  {
    name: "showLineNumbers",
    description: "Show or hide line numbers in the code block.",
    type: "boolean",
    defaultValue: true,
    controlType: "boolean",
  },
  {
    name: "className",
    description: "Class applied to the code block container.",
    type: "string",
    defaultValue: "undefined",
    controlType: "text",
  },
  {
    name: "onGenerate",
    description: "Callback to receive the generated Markdown table string.",
    type: "(markdown: string) => void",
    defaultValue: "undefined",
    controlType: "callback",
  },
]

export function MarkdownTableStory() {
  const renderTable = (props: PreviewProps) => (
    <MarkdownTable
      inputData={SAMPLE_DATA}
      columnAlignments={COLUMN_ALIGNMENTS}
      isCompact={Boolean(props.isCompact)}
      hasPadding={Boolean(props.hasPadding)}
      hasTabs={Boolean(props.hasTabs)}
      hasHeader={Boolean(props.hasHeader)}
      convertLineBreaks={Boolean(props.convertLineBreaks)}
      showLineNumbers={Boolean(props.showLineNumbers)}
      className={
        typeof props.className === "string" ? props.className : undefined
      }
    />
  )

  return (
    <ComponentPreview
      title="Markdown Table"
      description="Converts structured data into Markdown table syntax and displays it in a code block."
      codeExample={CODE_EXAMPLE}
      propDefinitions={PROP_DEFINITIONS}
      renderComponent={renderTable}
    />
  )
}
