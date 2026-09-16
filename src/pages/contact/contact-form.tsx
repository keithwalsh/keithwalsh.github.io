import { useEffect, useState } from "react"
import emailjs from "@emailjs/browser"
import { zodResolver } from "@hookform/resolvers/zod"
import { Send } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import {
  isSupportedCountry,
  isValidPhoneNumber,
  type Country,
} from "react-phone-number-input"
import { toast } from "sonner"
import { z } from "zod"

import { PhoneInput } from "@/components/phone-input"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { siteConfig } from "@/config/site"

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
  const form = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: DEFAULT_VALUES,
  })
  const { isSubmitting } = form.formState

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
      toast.success("Message sent successfully!")
    } catch {
      toast.error("Failed to send message. Please try again.")
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <div className="grid gap-5 sm:grid-cols-2">
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="contact-name">Name</FieldLabel>
                <Input
                  {...field}
                  id="contact-name"
                  autoComplete="name"
                  autoCapitalize="words"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="contact-email">Email</FieldLabel>
                <Input
                  {...field}
                  id="contact-email"
                  type="email"
                  autoComplete="email"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        <Controller
          name="phone"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="contact-phone">
                Phone
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
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
                autoComplete="tel"
                aria-invalid={fieldState.invalid}
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
              <FieldLabel htmlFor="contact-message">Message</FieldLabel>
              <Textarea
                {...field}
                id="contact-message"
                className="min-h-32"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? <Spinner /> : <Send />}
          Send Message
        </Button>
      </FieldGroup>
    </form>
  )
}
