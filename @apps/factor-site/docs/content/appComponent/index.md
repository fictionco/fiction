---
title: The App Component
description: Learn how to use the App entry component in your app
---

In Factor, the entry component for your front-end application is called `App.vue`. This is the component that is mounted by the base Vue application in Factor.

Use it to add elements that are visible on all pages of your site like navigation or a footer.

This component is visible on all pages of your app and is a useful place to add global components, handling, and other defaults.

![Content Component](./content-wrapper.jpg)

## Example App.vue

A standard use case for `App.vue` is to add any components which need to appear on all pages. In this case a loading component and a notification component. We also include the global styles file.

```html
<template>
  <router-view />
  <LoadingVeil />
  <NotifyToaster />
</template>

<script lang="ts" setup>
  import LoadingVeil from "@factor/ui/LoadingVeil.vue"
  import NotifyToaster from "@factor/plugin-notify/NotifyToaster.vue"
</script>
<style lang="less">
  @import "./styles.less";
</style>
```
