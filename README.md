# Personal Website

[![Code Climate](https://codeclimate.com/github/keithwalsh/keithwalsh.github.io/badges/gpa.svg)](https://codeclimate.com/github/keithwalsh/keithwalsh.github.io)

## Tech Stack

- **React** - Frontend Framework
- **TypeScript** - Type Safety
- **Material UI** - UI Component Library & Theming
- **Vite** - Build Tool & Development Server

## Features

- 🌓 Dark/Light mode with persistent preferences
- ♿ Accessibility menu with font sizing and contrast options
- 📱 Responsive layout with collapsible navigation
- 🎨 Custom themed Material UI components


## Project Structure

```
website/
├── index.html
├── public/
│   └── 404.html
├── src/
│   ├── components/
│   │   ├── AccessibilityMenu.tsx
│   │   ├── DrawerContent.tsx
│   │   ├── NavigationItems.tsx
│   │   ├── StyledComponents.tsx
│   │   └── pages/
│   │       ├── AboutPage.tsx
│   │       ├── ContactPage.tsx
│   │       ├── ProjectsPage.tsx
│   │       ├── ToolsPage.tsx
│   │       └── index.ts
│   ├── main.tsx
│   └── vite-env.d.ts
└── vite.config.ts
```

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Start the development server with `npm run dev`