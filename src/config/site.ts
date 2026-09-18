export const siteConfig = {
  name: "Keith Walsh",
  // Keep in sync with the static <title> and og: tags in index.html.
  tagline: "Data & Software Engineer",
  domain: "keithwalsh.ie",
  analyticsId: "G-Y3YL6PG2XD",
  // false removes the Test Page from the sidebar and makes /test-page a 404.
  showTestPage: false,
  // EmailJS public keys are designed to ship in client code.
  emailjs: {
    serviceId: "service_zzzdhcl",
    templateId: "template_n221y8m",
    publicKey: "GUHCRPfiQGja4E8rI",
  },
} as const
