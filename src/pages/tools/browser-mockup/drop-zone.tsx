import { useState } from "react"
import { ImageUp } from "lucide-react"

import { cn } from "@/lib/utils"

/** Makes an area accept a dropped file, with an overlay while dragging over it. */
export function DropZone({
  onFile,
  className,
  children,
}: {
  onFile: (file: File) => void
  className?: string
  children: React.ReactNode
}) {
  const [isDragging, setIsDragging] = useState(false)

  return (
    <div
      data-dragging={isDragging || undefined}
      onDragEnter={(event) => {
        if (!event.dataTransfer.types.includes("Files")) return
        event.preventDefault()
        setIsDragging(true)
      }}
      onDragOver={(event) => event.preventDefault()}
      onDragLeave={(event) => {
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
      className={cn("relative", className)}
    >
      {children}
      {isDragging && (
        <div className="pointer-events-none absolute inset-3 z-10 flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-cron-accent bg-background/70 backdrop-blur-[2px]">
          <div className="flex size-10 items-center justify-center rounded-lg bg-cron-accent-strong text-cron-accent">
            <ImageUp className="size-5" />
          </div>
          <p className="text-sm font-medium">Drop your image to frame it</p>
        </div>
      )}
    </div>
  )
}
