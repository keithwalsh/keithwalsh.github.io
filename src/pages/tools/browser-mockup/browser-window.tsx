import { useState } from "react"

/** A macOS-style browser frame around an image, with an editable address bar. */
export function BrowserWindow({
  imageUrl,
  width,
  defaultUrl = "http://localhost:3000",
  ref,
}: {
  imageUrl: string
  width: number
  defaultUrl?: string
  ref?: React.Ref<HTMLDivElement>
}) {
  const [url, setUrl] = useState(defaultUrl)
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div
      ref={ref}
      style={{ width }}
      className="mx-auto overflow-hidden rounded-xl border bg-background"
    >
      <div className="flex items-center gap-3 border-b bg-muted/60 px-4 py-1.5">
        <div className="flex shrink-0 gap-1.5" aria-hidden="true">
          <span className="size-3 rounded-full bg-[#f25f58]" />
          <span className="size-3 rounded-full bg-[#fbbe3c]" />
          <span className="size-3 rounded-full bg-[#58cb42]" />
        </div>

        {isEditing ? (
          <input
            autoFocus
            value={url}
            aria-label="Website URL"
            onChange={(event) => setUrl(event.target.value)}
            onBlur={() => setIsEditing(false)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === "Escape") {
                setIsEditing(false)
              }
            }}
            className="h-7 min-w-0 flex-1 rounded-full bg-background px-4 text-[13px] ring-2 ring-ring/50 outline-none"
          />
        ) : (
          <button
            type="button"
            title="Click to edit the address"
            onClick={() => setIsEditing(true)}
            className="h-7 min-w-0 flex-1 cursor-text truncate rounded-full bg-background px-4 text-left text-[13px] text-foreground/80 outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            {url}
          </button>
        )}

        <div className="flex shrink-0 flex-col gap-[3px]" aria-hidden="true">
          <span className="h-[3px] w-4 rounded-full bg-foreground/50" />
          <span className="h-[3px] w-4 rounded-full bg-foreground/50" />
          <span className="h-[3px] w-4 rounded-full bg-foreground/50" />
        </div>
      </div>

      <div className="p-2">
        <img
          src={imageUrl}
          alt="Uploaded image shown in the browser mockup"
          className="block max-h-[500px] w-full rounded-b-md object-contain"
        />
      </div>
    </div>
  )
}
