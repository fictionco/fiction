<template>
  <div
    class="content-layout m-auto min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900"
  >
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
  title: "Fiction.com",
  meta: [
    {
      name: `description`,
      content: `Fiction.com is for sale`,
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
