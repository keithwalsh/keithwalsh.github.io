import { Field, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

/** A labelled select for a fixed list of string options. */
export function OptionSelect<T extends string>({
  id,
  label,
  value,
  onValueChange,
  options,
  className,
}: {
  id: string
  label: string
  value: T
  onValueChange: (value: T) => void
  options: readonly { value: T; label: string }[]
  className?: string
}) {
  return (
    <Field className={className}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Select value={value} onValueChange={(next) => onValueChange(next as T)}>
        <SelectTrigger id={id} className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  )
}
