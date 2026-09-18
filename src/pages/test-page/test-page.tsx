import { Page, PageHeader } from "@/components/page"
import { Separator } from "@/components/ui/separator"
import { ButtonStory } from "@/pages/test-page/button-story"
import { MarkdownTableStory } from "@/pages/test-page/markdown-table-story"

export default function TestPage() {
  return (
    <Page className="max-w-5xl">
      <PageHeader description="A playground for previewing components with live props." />
      <MarkdownTableStory />
      <Separator />
      <ButtonStory />
    </Page>
  )
}
