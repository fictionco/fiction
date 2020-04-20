---
title: Static Assets
description: When and how to use static assets in a Factor app
---

# Static Assets

If you want to add and serve static assets in your Factor app, Factor provides a utility folder called `static`.

## Static Folder

In certain cases, it's nice to add meta files directly to the public folder of your built app.

Example use cases might be:

- `robots.txt`
- `CNAME`
- `manifest.json`
- `icon.png`

To do this, all you need to do is create a `/static` directory in the source of your application and add files.

When you build the files will be moved to the root `/dist` directory and will be available from your root URL.

For example, `robots.txt` will be available at `localhost:3000/robots.txt`.

In your code, you can reference them from your root `/` also:

```html
<img src="/icon.png" />
```
