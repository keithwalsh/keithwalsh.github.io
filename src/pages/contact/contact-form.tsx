import { useEffect, useState } from "react"
import emailjs from "@emailjs/browser"
import { zodResolver } from "@hookform/resolvers/zod"
import { Send } from "lucide-react"
import { Controller, useForm, useWatch } from "react-hook-form"
import {
  isSupportedCountry,
  isValidPhoneNumber,
  type Country,
} from "react-phone-number-input"
import { toast } from "sonner"
import { z } from "zod"

import { eyebrowClass } from "@/components/editorial"
import { PhoneInput } from "@/components/phone-input"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

/**
 * Underlined field treatment for this page: the boxed shadcn control is
 * stripped back to a hairline that thickens to indigo on focus. `Input` and
 * `Textarea` live in the generated `components/ui`, so the overrides ride in
 * on `className` rather than being edited in.
 */
const underlineFieldClass =
  "h-[2.125rem] rounded-none border-0 border-b bg-transparent px-0 pt-0 pb-1.5 text-base transition-[border-color,box-shadow] focus-visible:border-brand focus-visible:shadow-[0_1px_0_0_var(--brand)] focus-visible:ring-0 aria-invalid:border-destructive aria-invalid:shadow-none aria-invalid:ring-0 md:text-base dark:bg-transparent"

const labelClass = cn(
  eyebrowClass,
  "group-data-[invalid=true]/field:text-destructive"
)

const metaClass = "font-mono text-meta text-muted-foreground uppercase"

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .pipe(z.email("Enter a valid email")),
  phone: z
    .string()
    .refine(
      (value) => value === "" || isValidPhoneNumber(value),
      "Enter a valid phone number"
    ),
  message: z.string().trim().min(1, "Message is required"),
})

type ContactValues = z.infer<typeof contactSchema>

const DEFAULT_VALUES: ContactValues = {
  name: "",
  email: "",
  phone: "",
  message: "",
}

/** Best-effort country lookup from the visitor's IP to preselect a dial code. */
function useDetectedCountry(fallback: Country) {
  const [country, setCountry] = useState<Country>(fallback)

  useEffect(() => {
    const controller = new AbortController()

    fetch("https://ipapi.co/json/", { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { country_code?: string } | null) => {
        const code = data?.country_code?.toUpperCase()
        if (code && isSupportedCountry(code)) {
          setCountry(code as Country)
        }
      })
      .catch(() => {
        // Keep the fallback country when the lookup fails or is blocked.
      })

    return () => controller.abort()
  }, [])

  return country
}

export function ContactForm() {
  const country = useDetectedCountry("IE")
  // Success swaps the form for an inline panel rather than firing a toast —
  // one confirmation, not both. Failure still toasts; there is no panel for it.
  const [sent, setSent] = useState<{ name: string; email: string } | null>(null)
  const form = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: DEFAULT_VALUES,
  })
  const { isSubmitting } = form.formState
  const message = useWatch({ control: form.control, name: "message" })
  const messageLength = message.trim().length

  async function onSubmit(values: ContactValues) {
    try {
      await emailjs.send(
        siteConfig.emailjs.serviceId,
        siteConfig.emailjs.templateId,
        {
          from_name: values.name,
          from_email: values.email,
          phone_number: values.phone,
          message: values.message,
        },
        { publicKey: siteConfig.emailjs.publicKey }
      )
      form.reset()
      setSent({ name: values.name, email: values.email })
    } catch {
      toast.error("Failed to send message. Please try again.")
    }
  }

  if (sent) {
    return (
      <div className="flex flex-col gap-4 border-t border-brand bg-brand-soft p-8">
        <span className="font-mono text-eyebrow text-brand uppercase">
          Message sent
        </span>
        <p className="max-w-[46ch] text-[1.0625rem] leading-[1.55] text-pretty">
          Thanks {sent.name.split(/\s+/)[0]} — it&rsquo;s in my inbox.
          I&rsquo;ll reply to {sent.email}.
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={() => setSent(null)}
          className="h-[2.125rem] w-fit px-3.5 font-mono text-meta uppercase"
        >
          Write another
        </Button>
      </div>
    )
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-7.5"
    >
      <div className="grid gap-7.5 sm:grid-cols-2">
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="contact-name" className={labelClass}>
                Name
              </FieldLabel>
              <Input
                {...field}
                id="contact-name"
                placeholder="Who's writing?"
                autoComplete="name"
                autoCapitalize="words"
                aria-invalid={fieldState.invalid}
                className={underlineFieldClass}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="contact-email" className={labelClass}>
                Email
              </FieldLabel>
              <Input
                {...field}
                id="contact-email"
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
                aria-invalid={fieldState.invalid}
                className={underlineFieldClass}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      <Controller
        name="phone"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="contact-phone" className={labelClass}>
              Phone
              <span className="text-muted-foreground/75">(optional)</span>
            </FieldLabel>
            <PhoneInput
              // Remount once the detected country arrives so it becomes the default.
              key={country}
              id="contact-phone"
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              defaultCountry={country}
              placeholder="85 123 4567"
              autoComplete="tel"
              aria-invalid={fieldState.invalid}
              numberInputProps={{ className: underlineFieldClass }}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="message"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <div className="flex items-baseline justify-between gap-3">
              <FieldLabel htmlFor="contact-message" className={labelClass}>
                Message
              </FieldLabel>
              {/* Decorative: the schema has no max length, so this never warns. */}
              <span className={cn(metaClass, "tabular-nums")}>
                {messageLength ? `${messageLength} chars` : ""}
              </span>
            </div>
            <Textarea
              {...field}
              id="contact-message"
              rows={4}
              placeholder="What are you working on, and where do I fit?"
              aria-invalid={fieldState.invalid}
              className={cn(
                underlineFieldClass,
                "field-sizing-fixed h-auto min-h-26 resize-y pb-2.5 leading-[1.55]"
              )}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <div className="flex flex-wrap items-center gap-4.5">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-[2.875rem] gap-2.5 bg-brand px-6 font-mono text-meta text-brand-foreground uppercase hover:bg-brand-hover [&_svg:not([class*='size-'])]:size-[0.9375rem]"
        >
          Send message
          {isSubmitting ? <Spinner /> : <Send />}
        </Button>
        <span className={metaClass}>Goes straight to my inbox</span>
      </div>
    </form>
  )
}
