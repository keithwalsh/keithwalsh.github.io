import { ChevronsUpDown } from "lucide-react"
import PhoneInputWithCountrySelect, {
  getCountryCallingCode,
  type Country,
} from "react-phone-number-input"

import { Input } from "@/components/ui/input"
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

/** Phone number input with a country picker; the value is E.164. */
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

/**
 * The trigger shows the flag and dial code; a transparent native `<select>`
 * sits on top of it, so the picker is the platform's own — keyboard
 * type-ahead on desktop, the system wheel on mobile.
 */
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
  const countries = options.filter(
    (option): option is { value: Country; label: string } =>
      Boolean(option.value)
  )

  return (
    <div className="relative flex h-[2.125rem] items-center gap-2 border-0 border-b pb-1.5 font-mono text-caption transition-colors focus-within:border-brand">
      <FlagIcon country={selectedCountry} />
      {selectedCountry && (
        <span>+{getCountryCallingCode(selectedCountry)}</span>
      )}
      <ChevronsUpDown className="size-3.5 text-muted-foreground" />
      <select
        aria-label="Country"
        disabled={disabled}
        value={selectedCountry ?? ""}
        onChange={(event) => onChange(event.target.value as Country)}
        className="absolute inset-0 cursor-pointer opacity-0"
      >
        {countries.map(({ value, label }) => (
          <option key={value} value={value}>
            {label} +{getCountryCallingCode(value)}
          </option>
        ))}
      </select>
    </div>
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
