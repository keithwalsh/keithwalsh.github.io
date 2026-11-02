export const siteConfig = {
  // Master switch, one value per Vite mode: `npm run dev` runs in
  // development mode, `npm run build` (and so the deploy) in production mode.
  // Set production to false and push to main to take the live site offline:
  // the build then ships only a maintenance page (see vite.config.ts), while
  // development can stay online so the app is still there to work on.
  online: {
    development: true,
    production: false,
  },
  // Shows the "CV" download button in the header and the "Download CV" link
  // on the About page. The PDF itself still ships either way.
  showCvDownload: false,
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
