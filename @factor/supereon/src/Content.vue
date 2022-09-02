<template>
  <div class="content-layout max-w-7xl m-auto">
    <SiteHeader />
    <router-view />
    <SiteFooter />
  </div>
</template>
<script setup lang="ts">
import SiteHeader from "./SiteHeader.vue"
import SiteFooter from "./SiteFooter.vue"
import { useMeta } from "@factor/api"

// eslint-disable-next-line import/no-unresolved
import icon from "/icon.jpg"
useMeta({
  title: "Supereon",
  meta: [
    {
      name: `description`,
      content: `Supereon companies are building non-linear technologies for the future.`,
    },
    {
      vmid: "socialImage",
      property: "og:image",
      content: icon,
    },
    {
      vmid: "icon",
      rel: "icon",
      href: icon,
    },
  ],
})
</script>
