import { useState } from "react"

import { cn } from "@/lib/utils"

/** Makes an area accept dropped files, with an overlay while dragging over it. */
export function DropZone({
  onFiles,
  icon,
  message,
  className,
  children,
}: {
  onFiles: (files: File[]) => void
  icon: React.ReactNode
  message: string
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
        const files = [...event.dataTransfer.files]
        if (files.length > 0) onFiles(files)
      }}
      className={cn("relative", className)}
    >
      {children}
      {isDragging && (
        <div className="pointer-events-none absolute inset-3 z-10 flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-brand bg-background/70 backdrop-blur-[2px]">
          <div className="flex size-10 items-center justify-center rounded-lg bg-brand-strong text-brand [&>svg]:size-5">
            {icon}
          </div>
          <p className="text-sm font-medium">{message}</p>
        </div>
      )}
    </div>
  )
}
