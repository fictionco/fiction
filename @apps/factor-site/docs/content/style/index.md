---
title: Styling Your Factor App
description: Using CSS and Tailwind in your Factor apps
---

Styling your Factor applications is simple and standard. Factor uses native conventions allowed in [Vite](https://vitejs.dev) which means anything that works there will work in Factor.

## Custom CSS

Including custom CSS works as normal in [Vite](https://vitejs.dev/guide/features.html#css). This means you can include `.css` files or any preprocessor files natively from your components.

Factor natively supports the [Less](http://lesscss.org/) preprocessor so you should be able to work with `.less` files and syntax natively. Note that we recommend only using the [nesting](http://lesscss.org/#nesting) functionality of pre-processors while using standard CSS for everything else.

In the [near future](https://drafts.csswg.org/css-nesting/), CSS nesting will become native, and therefore we won't need pre-processors at all.

## TailwindCSS

Factor natively supports TailwindCSS and we recommend you use it although it's not required.

To set up Tailwind, just add a `tailwind.config.ts` to the root of your application and configure it according to their [documentation](https://tailwindcss.com/docs/configuration).

## Factor Tailwind Colors and Config

If you are using Factor UI or UI from Factor plugins, we recommend you configure at least two custom Tailwind color schemes: `color` and `primary`.

- **"color" scheme:** The contrast color scheme associated with text and borders. Allowing standard classes for these common elements: `text-color-500` or `border-color-200`.
- **"primary" scheme** Typically applications pick a primary color (purple in Factor's case) and use this often. Setting this scheme allows UI libraries to stylize according to your brand.

Here is how `tailwind.config.ts` might look:

```ts
// tailwind.config.ts
module.exports = {
  // ...other config...
  theme: {
    colors: {
      ...require("tailwindcss/colors"),
      transparent: "transparent",
      primary: {
        50: "#f6f5ff",
        100: "#eeebff",
        200: "#d4ccff",
        300: "#baadff",
        400: "#8670ff",
        500: "#5233ff",
        600: "#4a2ee6",
        700: "#3e26bf",
        800: "#311f99",
        900: "#220082",
      },

      color: {
        25: "#fafafa",
        50: "#F8FAFC",
        75: "#F8FAFC",
        100: "#e3eaf3",
        200: "#E3E8EE",
        300: "#d1dce5",
        400: "#aec2d2",
        500: "#8ba8bf",
        600: "#7d97ac",
        700: "#687e8f",
        800: "#536573",
        900: "#44525e",
      },
    },
  },
}
```
