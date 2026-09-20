import { toast } from "sonner"

/** Resolves a file in `public/` against Vite's base URL. */
export function assetUrl(path: string) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`
}

/** Copies text. The site is HTTPS-only, so the Clipboard API is always there. */
async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

/** The site's one copy confirmation: a toast, e.g. "Markdown copied". */
export async function copyWithToast(text: string, message: string) {
  if (await copyToClipboard(text)) {
    toast.success(message)
  } else {
    toast.error("Copy failed. Select the text and copy it manually.")
  }
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export function downloadTextFile(text: string, filename: string) {
  downloadBlob(new Blob([text], { type: "text/plain;charset=utf-8" }), filename)
}
