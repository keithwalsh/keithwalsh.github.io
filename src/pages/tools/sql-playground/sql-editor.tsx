import { useEffect, useEffectEvent, useRef } from "react"
import { PostgreSQL, SQLDialect, sql } from "@codemirror/lang-sql"
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language"
import { Compartment, Prec } from "@codemirror/state"
import { EditorView, keymap } from "@codemirror/view"
import { tags } from "@lezer/highlight"
import { basicSetup } from "codemirror"

import { cn } from "@/lib/utils"

/** Table names mapped to their column names, for autocomplete. */
export type SqlSchema = Record<string, string[]>

// There is no DuckDB dialect, so PostgreSQL gains the keywords the examples use.
const dialect = SQLDialect.define({
  ...PostgreSQL.spec,
  keywords: `${PostgreSQL.spec.keywords ?? ""} qualify asof pivot unpivot exclude replace`,
})

const language = new Compartment()
const sqlLanguage = (schema: SqlSchema) =>
  sql({ dialect, schema, upperCaseKeywords: true })

// The same `--code-*` tokens as CodeHighlighter, so SQL reads alike in both.
const highlighting = syntaxHighlighting(
  HighlightStyle.define([
    { tag: tags.keyword, color: "var(--code-keyword)" },
    { tag: tags.string, color: "var(--code-string)" },
    { tag: [tags.number, tags.bool, tags.null], color: "var(--code-number)" },
    { tag: tags.comment, color: "var(--code-comment)", fontStyle: "italic" },
    {
      tag: [tags.typeName, tags.standard(tags.name)],
      color: "var(--code-tag)",
    },
    { tag: tags.special(tags.name), color: "var(--code-variable)" },
  ])
)

// Every colour is a CSS variable, so the editor follows the `dark` class with
// no theme switching. CodeMirror's base theme is light-only, hence the
// overrides for the cursor, selection, gutters and tooltips.
const theme = EditorView.theme({
  "&": { color: "var(--foreground)", backgroundColor: "transparent" },
  "&.cm-focused": { outline: "none" },
  ".cm-scroller": {
    fontFamily: "var(--font-mono)",
    fontSize: "0.75rem",
    lineHeight: "1.625",
  },
  ".cm-content": { caretColor: "var(--foreground)", padding: "0.625rem 0" },
  ".cm-cursor, .cm-dropCursor": { borderLeftColor: "var(--foreground)" },
  "&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground":
    { backgroundColor: "var(--brand-strong)" },
  ".cm-gutters": {
    backgroundColor: "transparent",
    color: "var(--muted-foreground)",
    border: "none",
  },
  ".cm-activeLine": { backgroundColor: "transparent" },
  ".cm-activeLineGutter": {
    backgroundColor: "transparent",
    color: "var(--foreground)",
  },
  ".cm-selectionMatch": { backgroundColor: "var(--brand-soft)" },
  "&.cm-focused .cm-matchingBracket": {
    backgroundColor: "var(--brand-strong)",
  },
  ".cm-tooltip": {
    backgroundColor: "var(--popover)",
    color: "var(--popover-foreground)",
    border: "1px solid var(--border)",
    borderRadius: "0.5rem",
    overflow: "hidden",
  },
  ".cm-tooltip-autocomplete > ul": { fontFamily: "var(--font-mono)" },
  ".cm-tooltip-autocomplete > ul > li[aria-selected]": {
    backgroundColor: "var(--accent)",
    color: "var(--accent-foreground)",
  },
  ".cm-panels": {
    backgroundColor: "var(--muted)",
    color: "var(--foreground)",
    borderColor: "var(--border)",
  },
  ".cm-textfield, .cm-button": {
    backgroundImage: "none",
    backgroundColor: "var(--background)",
    color: "var(--foreground)",
    border: "1px solid var(--border)",
    borderRadius: "0.375rem",
  },
})

export function SqlEditor({
  value,
  onChange,
  onRun,
  schema,
  className,
}: {
  value: string
  onChange: (value: string) => void
  /** Ctrl+Enter, or Cmd+Enter on a Mac. */
  onRun: () => void
  schema: SqlSchema
  className?: string
}) {
  const host = useRef<HTMLDivElement>(null)
  const view = useRef<EditorView | null>(null)
  const initialValue = useRef(value)
  const handleChange = useEffectEvent(onChange)
  const handleRun = useEffectEvent(onRun)

  useEffect(() => {
    if (!host.current) return
    const editor = new EditorView({
      doc: initialValue.current,
      parent: host.current,
      extensions: [
        // Ahead of basicSetup, whose default keymap binds Mod-Enter.
        Prec.highest(
          keymap.of([
            {
              key: "Mod-Enter",
              run: () => {
                handleRun()
                return true
              },
            },
          ])
        ),
        basicSetup,
        language.of(sqlLanguage({})),
        highlighting,
        theme,
        EditorView.contentAttributes.of({ "aria-label": "SQL query" }),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) handleChange(update.state.doc.toString())
        }),
      ],
    })
    view.current = editor
    return () => {
      editor.destroy()
      view.current = null
    }
  }, [])

  // An example or Clear replaces the document from outside.
  useEffect(() => {
    const editor = view.current
    if (!editor || value === editor.state.doc.toString()) return
    editor.dispatch({
      changes: { from: 0, to: editor.state.doc.length, insert: value },
    })
  }, [value])

  useEffect(() => {
    view.current?.dispatch({
      effects: language.reconfigure(sqlLanguage(schema)),
    })
  }, [schema])

  return (
    <div
      ref={host}
      className={cn(
        "overflow-hidden rounded-lg border border-input transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 dark:bg-input/30",
        className
      )}
    />
  )
}
