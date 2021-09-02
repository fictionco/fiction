---
title: The Public Folder
description: When and how to use static assets in a Factor app
---

If you want to add and serve static assets in your Factor app, Factor provides a utility folder called `public`.

Example use cases might be:

- `robots.txt`
- `favicon.png`
- `_redirects`

When your application is built, these files will be moved to the root of the built application (`/dist`).

You can link to them from within your application, note that you should always reference public assets using root absolute path - for example, public/icon.png should be referenced in source code as /icon.png.

For more information, read the [public directory docs](https://vitejs.dev/guide/assets.html#the-public-directory) from Vite.
