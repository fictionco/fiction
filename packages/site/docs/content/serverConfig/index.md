---
title: Endpoint Server Config
description: How to set up and use the server config file - server.ts
---

Factor's endpoint server is designed to run separately from your primary application to allow for flexibility.

## Server Entry

To start working with your endpoint server, there is a single entry file called `server.ts`. Here you'll initialize any server code and also return server specific configuration like endpoints, sitemaps, etc.

As with your app entry file, this file should export a function named `setup` which should return configuration for your endpoint server.

```ts
// FILE: src/server.ts
import { doServerStuff } from "./server-do-stuff" // other custom code

export const setup = (): ServiceConfig => {
  // initialize other server code here if you'd like
  doServerStuff()

  // return routes, plugins and any other app settings
  return {
    endpoints: [],
    sitemaps: [],
    plugins: [],
  }
}
```

## Endpoints, Sitemaps

Now that you know how to start working with your server, you'll need to learn the specifics. Check out the docs below:

- [Endpoints doc](./endpoints) - Learn how to create custom endpoints and use them
- [Sitemap doc](./sitemaps) - Learn how to create custom endpoints and use them
