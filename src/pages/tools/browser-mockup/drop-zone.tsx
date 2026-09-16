import { useRef, useState } from "react"
import { ImageUp } from "lucide-react"

export function DropZone({ onFile }: { onFile: (file: File) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload an image to show in the browser mockup"
        aria-describedby="drop-zone-help"
        data-dragging={isDragging || undefined}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault()
            inputRef.current?.click()
          }
        }}
        onDragEnter={(event) => {
          event.preventDefault()
          setIsDragging(true)
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={(event) => {
          event.preventDefault()
          // Ignore leave events fired when moving between child elements.
          if (!event.currentTarget.contains(event.relatedTarget as Node)) {
            setIsDragging(false)
          }
        }}
        onDrop={(event) => {
          event.preventDefault()
          setIsDragging(false)
          const file = event.dataTransfer.files[0]
          if (file) onFile(file)
        }}
        className="flex min-h-52 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed bg-muted/30 p-6 text-center transition-colors outline-none hover:bg-muted/60 focus-visible:ring-3 focus-visible:ring-ring/50 data-dragging:border-primary data-dragging:bg-muted"
      >
        <div className="flex size-10 items-center justify-center rounded-lg bg-background ring-1 ring-border">
          <ImageUp className="size-5 text-muted-foreground" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-medium">
            {isDragging
              ? "Drop your image here"
              : "Drag & drop or click to browse"}
          </p>
          <p id="drop-zone-help" className="text-sm text-muted-foreground">
            Supports JPG, PNG, GIF and WebP up to 5 MB
          </p>
        </div>
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
          if (file) onFile(file)
          // Reset so choosing the same file again still fires a change.
          event.target.value = ""
        }}
      />
    </>
  )
}
