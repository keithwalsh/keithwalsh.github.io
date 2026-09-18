import { Link } from "react-router"
import { Compass } from "lucide-react"

import { Page } from "@/components/page"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { notFoundTitle } from "@/config/navigation"

export default function NotFoundPage() {
  return (
    <Page className="flex-1 justify-center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Compass />
          </EmptyMedia>
          <EmptyTitle>
            <h1>{notFoundTitle}</h1>
          </EmptyTitle>
          <EmptyDescription>
            This page doesn&apos;t exist or has moved.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild>
            <Link to="/">Go to the home page</Link>
          </Button>
        </EmptyContent>
      </Empty>
    </Page>
  )
}
