---
title: Using Plugins
description: How to use Factor plugins in your apps
---

Factor has a simple plugin system that you can use to add server and application plugins.

## Server vs Application Plugins

Because of Factor's distributed nature, the application and server are designed to run independently of each other. For that reason many plugins export:

- an application component for adding runtime features used in the app
- a server component, for adding endpoints, sitemaps, and other server side functionality

So to properly install a plugin you may need to add it twice: add the 'app' plugin to `index.ts` and add the 'server' plugin to `server.ts`

## Plugin Docs and Options

Each plugin can determine it's options and installation procedure, for that reason you'll need to reference the plugin documentation (e.g. readme file) for specifics on how to use that plugin

## Adding a Plugin

To add the Blog Engine plugin, add it to both `server.ts` and `index.ts`

```ts
// SERVER PLUGIN
// FILE: server.ts
import { UserConfigServer } from "@factor/api"
import blogEngineServer from "@factor/plugin-blog-engine/server"
import { map } from "./blog-article-map"

export const setup = (): UserConfigServer => {
  return {
    plugins: [blogEngineServer({ map, baseRoute: "/blog" })],
  }
}
```

```ts
// APP PLUGIN
// FILE: index.ts

import { UserConfigApp } from "@factor/api"
import blogEngine from "@factor/plugin-blog-engine"
import { map } from "./blog-article-map"

export const setup = (): UserConfigApp => {
  return {
    plugins: [blogEngine({ map, baseRoute: "/blog" })],
  }
}
```
