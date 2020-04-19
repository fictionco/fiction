---
title: Standard CSS Variables
description: A reference for standard CSS variables in Factor apps
---

# Standard CSS Variables

In order to provide consistency across apps and extensions, Factor recommends a few standard CSS variables.

## Using CSS Variables

- CSS variables must be scoped to CSS selectors.
- No font size variable is needed, use `1rem`.
- Other defaults can be assigned globally to `html` or `body`.
- Components that make use of variables can usually be overwritten for more advanced customization.

```less
html.factor-app {
  // setting a variable
  --color-primary: #0471ff;
  // using a variable
  color: var(--color-primary);
}
```

## Standard Variables

```less
html.factor-app {
  // Primary app color
  --color-primary: #0471ff;

  // Secondary app color
  --color-secondary: #0471ff;

  // Primary text color
  --color-text: #3a4854;

  // Background color
  --color-bg: #ffffff;

  // Background contrast colors (e.g. hover states)
  --color-bg-contrast: #f6fafd;
  --color-bg-highlight: #edf1f5;

  // Layout border color
  --color-border: rgba(221, 223, 239, 0.7);

  // Placeholder text color (usually light contrast)
  --color-placeholder: #bdcad4;

  // Code color (`code`)
  --color-code: #283f63;

  // Application primary font
  --font-family-primary: "helvetica", sans-serif;

  // Font weights
  --font-weight-bold: 700;
  --font-weight-normal: 500;
  --font-weight-light: 400;
}
```
