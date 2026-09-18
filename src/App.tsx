import { lazy } from "react"
import { Route, Routes } from "react-router"

import { AppLayout } from "@/components/app-layout"
import { siteConfig } from "@/config/site"

const AboutPage = lazy(() => import("@/pages/about/about-page"))
const BlogPage = lazy(() => import("@/pages/blog/blog-page"))
const PostPage = lazy(() => import("@/pages/blog/post-page"))
const ContactPage = lazy(() => import("@/pages/contact/contact-page"))
const WeatherPage = lazy(() => import("@/pages/weather/weather-page"))
const BrowserMockupPage = lazy(
  () => import("@/pages/tools/browser-mockup/browser-mockup-page")
)
const CodeAnnotatorPage = lazy(
  () => import("@/pages/tools/code-annotator/code-annotator-page")
)
const CronExpressionsPage = lazy(
  () => import("@/pages/tools/cron-expressions/cron-expressions-page")
)
const JsonExplorerPage = lazy(
  () => import("@/pages/tools/json-explorer/json-explorer-page")
)
const MarkdownTablePage = lazy(
  () => import("@/pages/tools/markdown-table/markdown-table-page")
)
const TextToAsciiPage = lazy(
  () => import("@/pages/tools/text-to-ascii/text-to-ascii-page")
)
const TestPage = lazy(() => import("@/pages/test-page/test-page"))
const ProfessionalProjectsPage = lazy(
  () => import("@/pages/projects/professional-projects-page")
)
const PersonalProjectsPage = lazy(
  () => import("@/pages/projects/personal-projects-page")
)
const NotFoundPage = lazy(() => import("@/pages/not-found-page"))

export function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<AboutPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="blog/:slug" element={<PostPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="visualizations/weather" element={<WeatherPage />} />
        <Route path="tools/browser-mockup" element={<BrowserMockupPage />} />
        <Route path="tools/code-annotator" element={<CodeAnnotatorPage />} />
        <Route
          path="tools/cron-expressions"
          element={<CronExpressionsPage />}
        />
        <Route path="tools/json-explorer" element={<JsonExplorerPage />} />
        <Route path="tools/markdown-table" element={<MarkdownTablePage />} />
        <Route path="tools/text-to-ascii" element={<TextToAsciiPage />} />
        {siteConfig.showTestPage && (
          <Route path="test-page" element={<TestPage />} />
        )}
        <Route
          path="projects/professional"
          element={<ProfessionalProjectsPage />}
        />
        <Route path="projects/personal" element={<PersonalProjectsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
