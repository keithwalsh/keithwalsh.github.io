# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Requires Node 22.22+.

```bash
npm run dev        # Vite dev server on 127.0.0.1:5173
npm run build      # tsc -b && vite build
npm run typecheck  # tsc -b --noEmit
npm run lint       # eslint .
npm run format     # prettier --write "src/**/*.{ts,tsx,css}"
npm run preview    # serve the production build
```

There is no test framework installed and no test files. Verify changes with
`npm run typecheck && npm run lint && npm run build`, then check the page in the
browser — most of this codebase is UI with no logic layer to assert against.

CI (`.github/workflows/deploy.yml`) runs lint and build on every push to `main`,
then publishes `dist/` to GitHub Pages. **A lint error blocks the deploy**, and
Prettier is not part of lint — run `npm run format` yourself before committing.

## Architecture

### Static SPA on GitHub Pages — three consequences

This is a fully client-side site on a static host, which drives three things that
look odd in isolation:

1. **Hash routing.** `main.tsx` mounts `HashRouter`, so every URL is
   `https://host/#/tools/cron-expressions`. Deep links and refreshes work on
   Pages without server rewrites. Navigating a bare path in a browser tool will
   land on `/` — click through or use the `#/...` form.
2. **`base: "./"` in `vite.config.ts`.** Never reference a `public/` asset with a
   leading-slash path from JS. Use `assetUrl()` from `src/lib/browser.ts`, which
   resolves against `import.meta.env.BASE_URL`. Paths in `index.html` are the
   exception — they are root-absolute and fine.
3. **Crawlers see only `index.html`.** `og:`/`twitter:` tags must be static there;
   the per-route `<title>` set at runtime in `app-layout.tsx` is invisible to
   social crawlers. Keep the static `<title>` and `siteConfig.tagline` in sync.

### Adding a route touches two files

`src/config/navigation.ts` is the single source of route metadata. A route
registered only in `App.tsx` renders, but gets no sidebar entry, no breadcrumb
and no document title — `findNavLocation(pathname)` drives all three from
`primaryNav`/`sectionNav`. Add the lazy `<Route>` in `App.tsx` **and** the nav
entry in `navigation.ts`.

Nested routes (`/blog/:slug`) have no nav entry of their own. `findNavLocation`
falls back to the longest matching parent URL, so they inherit that parent's
breadcrumb and title rather than rendering "Page not found" in the header.

### The blog is a folder of Markdown files

Adding a post means adding one file to `src/content/posts/`. No index to update:
`src/lib/posts.ts` globs the directory with Vite's `?raw` + `eager`, so posts are
inlined at build time and the site stays fully static.

Frontmatter is parsed by ~15 lines of regex, not a YAML library — it handles
`key: value` and comma-separated `tags`, and nothing else. Do not write nested
YAML in a post.

`draft: true` hides a post from production builds while leaving it visible (badged)
in `npm run dev`. New posts should start as drafts; pushing to `main` publishes
immediately.

`post-body.tsx` maps Markdown to the repo's existing components — `CodeHighlighter`
for fenced blocks, `InlineCode`, and the shadcn `Table` set for GFM tables. There
is no `@tailwindcss/typography`; element styling lives in that one `components`
map. Note the `pre` override returning a fragment: `CodeHighlighter` renders a
`div`, which cannot legally nest inside a `pre`.

### Content lives in JSON, not JSX

`src/data/*.json` holds all CV-style content. Components map over it; they do not
hardcode copy. Two rules that are not obvious from the files themselves:

- **`professionalJourney.json` is the single source for both the About timeline
  (`pages/about/professional-journey.tsx`) and the Professional Projects page.**
  A duplicate `professionalProjects.json` used to exist and drifted out of sync on
  three date ranges — do not reintroduce a second copy of role data.
- Entries carry a `year` marker alongside a `dateRange`; `year` must be the start
  year of the range or the timeline renders a misleading label.

Runtime data is different: `public/data/*.csv` is fetched by the weather page at
load, so replacing those files changes the charts with no rebuild.

### Cross-cutting behaviours

- **Theme and font size apply before first paint.** An inline script in
  `index.html` sets the `dark`/`light` class from `localStorage` to avoid a flash;
  `applyFontSize()` runs in `main.tsx` before `createRoot`. Changing how either is
  stored means editing both the inline script and `theme-provider.tsx` /
  `lib/font-size.ts`. Font size works by setting `documentElement.style.fontSize`
  — every Tailwind size is rem-based, so the whole UI scales.
- **`?notoolbar`** hides the header (`app-layout.tsx`) so a tool page can be
  embedded elsewhere. Preserve it when touching the layout.
- **Analytics only initialise in production builds** and page views are sent
  manually per route change via `trackPageView`, not by gtag's automatic tracking.

### Tools pages

Each tool under `src/pages/tools/<name>/` is self-contained, lazy-loaded, and runs
entirely in the browser — no backend, no network calls beyond `public/`. Follow
the existing folder-per-tool shape rather than adding shared tool infrastructure.

## Conventions

- **Prettier**: no semicolons, double quotes, 80 columns, ES5 trailing commas,
  with `prettier-plugin-tailwindcss` sorting class names in `cn()` and `cva()`.
- **shadcn/ui, `radix-nova` style, `neutral` base.** Add components with
  `npx shadcn@latest add <component>`; they land in `src/components/ui/`. Treat
  that directory as generated — it has its own ESLint exemption for exporting
  variant helpers next to components.
- **`verbatimModuleSyntax`** is on: type-only imports must use `import type`.
- **`erasableSyntaxOnly`** is on: no `enum`, no constructor parameter properties.
- `noUnusedLocals` and `noUnusedParameters` are errors, so `typecheck` fails on
  leftover imports that lint alone would let through.
- Import alias `@/` maps to `src/`.
