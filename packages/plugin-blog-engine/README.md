# Blog Engine

A simple markdown powered blog engine for Factor site and apps.

## What's included

This plugin includes utilities and a recommended structure for a markdown powered blog in Factor. It includes the following:

- Methods for retrieving blog index and individual posts
- Optional UI and routes
- Optionally provide your own post "map" or scan for files

## Usage

This plugin needs to be installed in both your app and server:

- app plugin - markdown and application utilities
- server plugin - sitemap handling

```ts
// index.ts
import { UserConfigApp } from "@factor/api"
import blogEngine from "@factor/plugin-blog-engine"
import { map } from "./blog/map"
export const setup = (): UserConfigApp => {
  return {
    routes,
    plugins: [blogEngine({ map, baseRoute: "/blog" })],
  }
}
```

```ts
// server.ts
import { UserConfig } from "@factor/api"
import { map } from "../blog/map"
import blogEngineServer from "@factor/plugin-blog-engine/server"

export const setup = (): UserConfig => {
  return {
    plugins: [blogEngineServer({ map, baseRoute: "/blog" })],
  }
}
```

## UI and Routes

To allow for straight forward customization, we recommend you port the example UI for this plug into your own Factor application and customize as you'd like.

You'll find the UI code in the [/blog folder](./blog)

Once you've added it, you simply need to add the blog routes to your master routes array that is passed in `index.ts`.

## Post Map

The posts in Blog Engine are handled using a post map that tells the plugin how and in which order to display the posts.

This is the array passed in to both the app/server plugins.

A map array looks like this:

```ts
import { BlogMap } from "@factor/plugin-blog-engine/types"

export const map: BlogMap = {
  someUniqueKey: {
    permalink: "the-post-permalink", // optional, would default to /some-unique-key
    publishDate: "2021-9-5",
    status: "published",
    type: ["release"],
    fileImport: (): Promise<any> => import("./path-to/post.md"),
    imageImport: (): Promise<any> => import("./path-to/image.jpg"),
  },
}
```
