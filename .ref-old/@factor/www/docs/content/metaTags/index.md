---
title: Meta Tags and Meta Info
description: Working with meta tags and information in Factor.
---

Factor provides a standard function that you can use to add dynamic meta tags and information to your pages: `useMeta`.

To add custom meta tags, all you need to do is import this function and use it from within your components:

```html
<template> // component... </template>
<script setup>
  import { useMeta } from "@factor/api"
  import {computed} from 'vue'
  useMeta({
    title: "my title",
    meta: [
      {
        name: `description`,
        content: "my description",
      },
      {
        property: "og:title",
        content: metaTitle,
      },
      {
        property: "og:description",
        content: "my description",
      },
      {
        name: "twitter:card",
        content: "summary",
      },
      }
        name: "twitter:title",
        content: metaTitle,
      },
      {
        name: "twitter:description",
        // can be computed
        content: computed(() => "my description"),
      },
    ],
  })
</script>
```

## Notes

- Hierarchy: Factor's meta system will merge info from all components, preferring more specific components when there is a conflict
- Static and Computed: you can use [computed](https://v3.vuejs.org/guide/computed.html) data or static data with `useMeta`
