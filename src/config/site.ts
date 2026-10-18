export const siteConfig = {
  // Master switch. Set to false and push to main to take the site offline:
  // the build then ships only a maintenance page (see vite.config.ts).
  online: false,
  name: "Keith Walsh",
  // Keep in sync with the static <title> and og: tags in index.html.
  tagline: "Analytics Engineer",
  domain: "keithwalsh.ie",
  analyticsId: "G-Y3YL6PG2XD",
  // EmailJS public keys are designed to ship in client code.
  emailjs: {
    serviceId: "service_zzzdhcl",
    templateId: "template_n221y8m",
    publicKey: "GUHCRPfiQGja4E8rI",
  },
} as const
