import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import { applyFontSize, getStoredFontSize } from "@/lib/font-size"
import MaintenancePage from "@/pages/maintenance-page"

// The entry index.html boots instead of main.tsx while the site is offline.
applyFontSize(getStoredFontSize())

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MaintenancePage />
  </StrictMode>
)
