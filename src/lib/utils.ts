import { createCn } from "cn/config"

// The type roles and spacing names in index.css aren't Tailwind defaults, so
// without this cn() reads `text-eyebrow` as a text colour and merges it away,
// and can't tell that `pt-6` and `pt-page-top` conflict. vite.config.ts
// resolves every `from "cn"` import here, including the generated ui/ ones.
export const cn = createCn({
  extend: {
    theme: {
      spacing: [
        "gutter",
        "page-top",
        "page-bottom",
        "header-bottom",
        "section",
        "stack",
        "stack-sm",
        "columns",
        "row",
        "cells",
      ],
    },
    classGroups: {
      "font-size": [
        {
          text: [
            "eyebrow",
            "meta",
            "micro",
            "2xs",
            "caption",
            "body-sm",
            "body-lg",
            "lead",
            "subtitle",
            "heading",
            "title",
            "headline",
            "display",
            "numeral",
            "numeral-lg",
          ],
        },
      ],
    },
  },
})
