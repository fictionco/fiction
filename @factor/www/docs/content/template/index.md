---
title: The HTML Template
description: Working with the HTML scaffolding template
---

Factor apps use a single HTML file as a template for all pages: `index.html`. This file is required and should exist in your `source` folder next to your other entry files (e.g. `index.ts`, `server.ts`)

Any standard HTML you include in this file will appear on all pages of your application. That makes `index.html` and easy place to add tag managers or analytics code.

For dynamic content, Factor replaces some standard variables with associated content on build:

- `<!--factor-body-->` - This tag will be replaced with the page body content
- `<!--factor-head-->` - This tag will be replaced with dynamic meta information for the page
- `<!--factor-debug-->` - This tag will be replaced with available debugging information such as the currently rendered page.

A typical `index.html` file will look like this:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="shortcut icon" href="/favicon.png" />
    <!--factor-head-->
  </head>

  <body class="factor-app">
    <div id="app"><!--factor-body--></div>
    <!--factor-debug-->
  </body>
</html>
```
