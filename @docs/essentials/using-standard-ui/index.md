---
title: Using Standard UI Elements
description: Learn how to use Factor's standard UI elements for common front end tasks.
---

# Using Standard UI Elements

When developing there are certain UI elements that are common to most apps. For example, loading bars and spinners. Factor provides some vanilla UI elements to help you with these.

## Standard UI Reference

To see the specifics on available elements and their functionality see the [standard UI elements](./standard-ui) document.

## Using Standard UI Elements

All standard UI elements are exported and made available in `@factor/ui`. So just import then and use them as a component:

```html
<template>
  <factor-spinner />
  <factor-btn>Text</factor-btn>
</template>
<script>
  import { factorSpinner, factorBtn } from "@factor/ui"
  export default {
    components: { factorSpinner, factorBtn },
  }
</script>
```

## Overriding Standard Elements

Standard elements are used across apps, themes, and plugins so it's common to want to override them with customized versions. For example, you may want to override the default button with one that better matches your app's branding.

To do this, all you need to do is using `factor-settings`.

All components exported from `@factor/ui` are done so using settings. Check the [standard UI elements](./standard-ui) to the key to use for any specific element.
