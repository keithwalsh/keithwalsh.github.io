import { ArrowLeft } from "lucide-react"
import { Link, useParams } from "react-router"

import { Page, PageHeader } from "@/components/page"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Empty, EmptyDescription, EmptyTitle } from "@/components/ui/empty"
import { findPost, formatPostDate } from "@/lib/posts"
import { PostBody } from "@/pages/blog/post-body"

export default function PostPage() {
  const { slug } = useParams()
  const post = findPost(slug)

  if (!post) {
    return (
      <Page>
        <Empty>
          <EmptyTitle>Post not found</EmptyTitle>
          <EmptyDescription>
            <Link to="/blog" className="underline underline-offset-4">
              Back to all posts
            </Link>
          </EmptyDescription>
        </Empty>
      </Page>
    )
  }

  return (
    <Page>
      <Button variant="ghost" size="sm" className="-ml-2 self-start" asChild>
        <Link to="/blog">
          <ArrowLeft />
          All posts
        </Link>
      </Button>

      <PageHeader
        title={post.title}
        description={
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <span>{formatPostDate(post.date)}</span>
            {post.draft && <Badge variant="outline">Draft</Badge>}
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </span>
        }
      />

      <PostBody body={post.body} />
    </Page>
  )
}
