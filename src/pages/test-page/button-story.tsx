import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  ComponentPreview,
  type PreviewProps,
  type PropDefinition,
} from "@/pages/test-page/component-preview"

type ButtonProps = React.ComponentProps<typeof Button>

const CODE_EXAMPLE = `import { Button } from "@/components/ui/button"

export function ButtonDemo() {
  return <Button variant="default">Click me</Button>
}`

const PROP_DEFINITIONS: PropDefinition[] = [
  {
    name: "variant",
    description: "The visual style of the button.",
    type: '"default" | "secondary" | "outline" | "ghost" | "destructive" | "link"',
    defaultValue: "default",
    controlType: "select",
    options: [
      "default",
      "secondary",
      "outline",
      "ghost",
      "destructive",
      "link",
    ],
  },
  {
    name: "size",
    description: "The size of the button.",
    type: '"xs" | "sm" | "default" | "lg"',
    defaultValue: "default",
    controlType: "select",
    options: ["xs", "sm", "default", "lg"],
  },
  {
    name: "disabled",
    description: "If true, the button is disabled.",
    type: "boolean",
    defaultValue: false,
    controlType: "boolean",
  },
  {
    name: "children",
    description: "The button label.",
    type: "ReactNode",
    defaultValue: "Click me",
    controlType: "text",
  },
  {
    name: "onClick",
    description: "Callback fired when the button is clicked.",
    type: "(event: MouseEvent) => void",
    defaultValue: "undefined",
    controlType: "callback",
  },
]

export function ButtonStory() {
  const renderButton = (props: PreviewProps) => (
    <Button
      variant={props.variant as ButtonProps["variant"]}
      size={props.size as ButtonProps["size"]}
      disabled={Boolean(props.disabled)}
      onClick={() => toast("Button clicked!")}
    >
      {String(props.children || "Click me")}
    </Button>
  )

  return (
    <ComponentPreview
      title="Button"
      description="Buttons allow users to take actions and make choices with a single click."
      codeExample={CODE_EXAMPLE}
      propDefinitions={PROP_DEFINITIONS}
      renderComponent={renderButton}
    />
  )
}
