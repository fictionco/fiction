---
title: Sitemaps
description: Add sitemap data to your application
---

Sitemaps are how you let Factor know about all the possible paths and pages available in your application.

They are primarily used to generate a `sitemap.xml` file which is then used by search and social engines for syndicating your content.

However, they enable further functionality which can be used by plugins. For example, uploading your URLs so services or validating your site.

## Adding A Sitemap

```ts
// FILE: server.ts

export const setup = (): UserConfigServer | undefined => {
  return {
    sitemaps: [
      {
        topic: "feature",
        paths: ["/features/feature-a", "features/feature-b"],
      },
      {
        topic: "blog",
        paths: ["/blog/article-a", "blog/article-b"],
      },
    ],
  }
}
```

To view if your sitemap is comprehensive and generated correctly, visit `/sitemap.xml` on your site or after a build. You should see the paths you've passed in there; as well as any passed by plugins.
