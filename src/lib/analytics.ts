import { siteConfig } from "@/config/site"

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

/** Loads Google Analytics in production builds only. */
export function initAnalytics() {
  if (!import.meta.env.PROD || window.gtag) {
    return
  }

  const script = document.createElement("script")
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${siteConfig.analyticsId}`
  document.head.appendChild(script)

  const dataLayer = (window.dataLayer ??= [])
  window.gtag = function gtag() {
    // gtag.js expects the Arguments object itself, not an array copy.
    // eslint-disable-next-line prefer-rest-params
    dataLayer.push(arguments)
  }
  window.gtag("js", new Date())
  // Page views are sent per route change by trackPageView.
  window.gtag("config", siteConfig.analyticsId, { send_page_view: false })
}

export function trackPageView(path: string) {
  window.gtag?.("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  })
}
