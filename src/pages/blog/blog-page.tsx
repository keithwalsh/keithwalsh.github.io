import { PenLine } from "lucide-react"
import { Link } from "react-router"

import { Page, PageHeader } from "@/components/page"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Empty, EmptyDescription, EmptyTitle } from "@/components/ui/empty"
import { formatPostDate, posts } from "@/lib/posts"

export default function BlogPage() {
  return (
    <Page>
      <PageHeader
        icon={PenLine}
        title="Blog"
        description="Write-ups of problems worth the detour, mostly from data plumbing and e-commerce systems."
      />

      {posts.length === 0 ? (
        <Empty>
          <EmptyTitle>Nothing published yet</EmptyTitle>
          <EmptyDescription>
            Add a Markdown file to src/content/posts to start.
          </EmptyDescription>
        </Empty>
      ) : (
        <div className="flex max-w-3xl flex-col gap-4">
          {posts.map((post) => (
            <Card
              key={post.slug}
              className="relative transition-colors hover:bg-muted/40"
            >
              <CardHeader>
                <CardTitle className="text-lg">
                  <Link
                    to={`/blog/${post.slug}`}
                    className="after:absolute after:inset-0 focus-visible:outline-none"
                  >
                    {post.title}
                  </Link>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {formatPostDate(post.date)}
                  {post.draft && " · Draft"}
                </p>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <p className="text-muted-foreground">{post.summary}</p>
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </Page>
  )
}
