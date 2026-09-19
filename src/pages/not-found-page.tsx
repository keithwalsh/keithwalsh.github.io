import { ZeroState } from "@/components/editorial"
import { notFoundTitle } from "@/config/navigation"

export default function NotFoundPage() {
  return (
    <ZeroState
      numeral="404"
      lines={[notFoundTitle]}
      action={{ label: "Home page", to: "/" }}
    >
      This page doesn&apos;t exist or has moved.
    </ZeroState>
  )
}
