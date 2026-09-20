# Personal Website

Source for [www.keithwalsh.ie](https://www.keithwalsh.ie): my personal site and
analytics engineering portfolio, plus a small collection of in-browser tools
(cron expression builder, JSON explorer, code annotator, browser mockup,
Markdown table generator, text-to-ASCII) and weather visualisations.

## Tech Stack

- **React 19** + **TypeScript**
- **shadcn/ui** (Radix primitives, Nova style) on **Tailwind CSS v4**
- **Recharts** through shadcn's chart components for the weather page
- **React Router** with hash routing, so deep links work on GitHub Pages
- **Vite 8**: dev server and build tool
- Deployed to **GitHub Pages** via GitHub Actions

## Getting Started

Requires Node 22.22 or later.

```bash
npm install
npm run dev
```

## Scripts

| Command             | Description                                   |
| ------------------- | --------------------------------------------- |
| `npm run dev`       | Start the Vite dev server with hot reload     |
| `npm run build`     | Type-check and build the production bundle    |
| `npm run preview`   | Preview the production build locally          |
| `npm run lint`      | Lint with ESLint                              |
| `npm run typecheck` | Type-check without building                   |
| `npm run format`    | Format `src` with Prettier                    |

## Project Structure

```text
src/
  components/     Shared components; ui/ holds the shadcn/ui primitives
  config/         Navigation and site settings (analytics, EmailJS)
  data/           JSON content for the About and Projects pages
  lib/            Helpers: Markdown tables, code highlighting, analytics
  pages/          One folder per route
public/data/      Weather CSVs read by the Weather page
```

The weather CSVs are fetched at runtime, so replacing the files in
`public/data/` updates the charts without a code change.

## Adding shadcn/ui Components

```bash
npx shadcn@latest add <component>
```

Components land in `src/components/ui/` and follow the settings in `components.json`.

## Deployment

Pushing to `main` triggers the [Deploy to GitHub Pages](.github/workflows/deploy.yml) workflow, which builds the site and publishes `dist/` to GitHub Pages.
