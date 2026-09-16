import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { HashRouter } from "react-router"

import "./index.css"
import { App } from "@/App"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { initAnalytics } from "@/lib/analytics"
import { applyFontSize, getStoredFontSize } from "@/lib/font-size"

applyFontSize(getStoredFontSize())
initAnalytics()

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <HashRouter>
        <TooltipProvider>
          <App />
          <Toaster />
        </TooltipProvider>
      </HashRouter>
    </ThemeProvider>
  </StrictMode>
)
