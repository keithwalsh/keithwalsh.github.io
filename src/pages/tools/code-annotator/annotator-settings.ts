/** `commentEnd` is set for languages whose comments have to be closed. */
export const LANGUAGE_OPTIONS: {
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

export const DISPLAY_OPTIONS = [
  { key: "showLineNumbers", id: "code-line-numbers", label: "Line numbers" },
  { key: "wrap", id: "code-wrap", label: "Wrap lines" },
  {
    key: "strikethrough",
    id: "code-strikethrough",
    label: "Strike through removed words",
  },
] as const

export type DisplayOptions = Record<
  (typeof DISPLAY_OPTIONS)[number]["key"],
  boolean
>

// `comment: true` markers are written in the selected language's comment style.
export const SYNTAX = [
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

// The default input explains the tool while exercising every marker.
export const DEFAULT_CODE = `<?php
// highlight-next-line
echo "Code Annotator turns plain code into an annotated snippet.";
echo "Paste code here and mark it up with comments to show";
// Remove
echo "the line you [-replaced-]";
// Add
echo "the line you [+added+]";
// highlight-start
echo "and the block worth a closer look.";
// highlight-end
echo "Then copy it as Markdown or download it as a PNG.";
?>`

export type AnnotatorState = {
  code: string
  language: string
  filename: string
  options: DisplayOptions
  /** Height of the input panel, in rem, see `lib/input-height.ts`. */
  inputHeight: number
}

export const DEFAULT_STATE: AnnotatorState = {
  code: DEFAULT_CODE,
  language: "php",
  filename: "",
  options: { showLineNumbers: true, wrap: true, strikethrough: true },
  // The old fixed `h-72`.
  inputHeight: 18,
}

export function findLanguage(value: string) {
  return LANGUAGE_OPTIONS.find((option) => option.value === value)
}

/** Writes a marker as a comment in the given language, e.g. `// Add`. */
export function writeComment(language: string, marker: string) {
  const selected = findLanguage(language)
  return [selected?.comment ?? "//", marker, selected?.commentEnd]
    .filter(Boolean)
    .join(" ")
}
