import { createCn } from "cn/config"

// The type-scale sizes in index.css aren't Tailwind defaults, so without this
// cn() reads `text-eyebrow` as a text colour and merges it away. vite.config.ts
// resolves every `from "cn"` import here, including the generated ui/ ones.
export const cn = createCn({
  extend: {
    classGroups: { "font-size": [{ text: ["eyebrow", "meta", "display"] }] },
  },
})
