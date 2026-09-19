import { useState } from "react"
import { ChevronsUpDown } from "lucide-react"
import PhoneInputWithCountrySelect, {
  getCountryCallingCode,
  type Country,
} from "react-phone-number-input"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

// Flags load on demand from the library's default CDN instead of bundling
// every country's SVG into the page.
const FLAG_URL = "https://purecatamphetamine.github.io/country-flag-icons/3x2"

type PhoneInputProps = Omit<
  React.ComponentProps<"input">,
  "onChange" | "value" | "ref" | "defaultValue"
> & {
  value?: string
  onChange?: (value: string) => void
  defaultCountry?: Country
  /** Forwarded to the underlying number input; `className` lands there too. */
  numberInputProps?: React.ComponentProps<"input">
}

/** Phone number input with a searchable country picker; the value is E.164. */
function PhoneInput({
  className,
  value,
  onChange,
  defaultCountry,
  ...props
}: PhoneInputProps) {
  return (
    <PhoneInputWithCountrySelect
      className={cn("flex w-full items-end gap-3", className)}
      flagComponent={FlagIcon}
      countrySelectComponent={CountrySelect}
      inputComponent={Input}
      defaultCountry={defaultCountry}
      smartCaret={false}
      value={value || undefined}
      onChange={(next) => onChange?.(next ?? "")}
      {...props}
    />
  )
}

type CountryOption = { value?: Country; label: string }

function CountrySelect({
  value: selectedCountry,
  onChange,
  options,
  disabled,
}: {
  value?: Country
  onChange: (country?: Country) => void
  options: CountryOption[]
  disabled?: boolean
}) {
  const [open, setOpen] = useState(false)
  const countries = options.filter(
    (option): option is { value: Country; label: string } =>
      Boolean(option.value)
  )
  const selectedLabel =
    countries.find((option) => option.value === selectedCountry)?.label ??
    "International"

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          disabled={disabled}
          className="h-[2.125rem] gap-2 rounded-none border-0 border-b px-0 pt-0 pb-1.5 font-mono text-caption font-normal transition-colors hover:border-brand hover:bg-transparent"
          aria-label={`Country: ${selectedLabel}`}
        >
          <FlagIcon country={selectedCountry} />
          {selectedCountry && (
            <span>+{getCountryCallingCode(selectedCountry)}</span>
          )}
          <ChevronsUpDown className="size-3.5 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="start">
        <Command>
          <CommandInput placeholder="Search country..." />
          <CommandList>
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              {countries.map(({ value, label }) => {
                const callingCode = `+${getCountryCallingCode(value)}`

                return (
                  <CommandItem
                    key={value}
                    value={`${label} ${callingCode}`}
                    data-checked={value === selectedCountry}
                    onSelect={() => {
                      onChange(value)
                      setOpen(false)
                    }}
                  >
                    <FlagIcon country={value} />
                    <span className="flex-1 truncate">{label}</span>
                    <span className="text-muted-foreground tabular-nums">
                      {callingCode}
                    </span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

function FlagIcon({ country }: { country?: Country }) {
  return (
    <span className="flex h-4 w-6 shrink-0 overflow-hidden rounded-xs bg-muted">
      {country && (
        <img
          src={`${FLAG_URL}/${country}.svg`}
          alt=""
          loading="lazy"
          className="size-full object-cover"
        />
      )}
    </span>
  )
}

export { PhoneInput }
