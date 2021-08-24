---
title: URLs, Links, and Permalinks
description: Advanced URLs and link handling in Factor
---

# URLs and Links

Advanced tools for working with links and URLs in Factor.

## System URLs

From anywhere within Factor you can get the system-wide URLs using the `systemUrl` function:

```js
import { systemUrl } from "@factor/api"
/**
 * Location: "production" | "local" | "dashboard" | "current"
 */
const localUrl = systemUrl("local") // http://localhost:3000
const productionUrl = systemUrl("production") // https://factor.dev
```

## Getting Links for Posts

If you're working with posts and you need to link to them, then use `postLink`. The only caveat for postLink to work correctly is that the post needs to be loaded in the store before its use.

```js
import { postLink } from "@factor/api"

// Make sure post with _id is available in the store (populated) or this wont work
const linkToPost = postLink(_id)
```
