<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900 text-white"
  >
    <SiteHeader />
    <router-view />
  </div>
</template>
<script setup lang="ts">
import SiteHeader from "./SiteHeader.vue"
import { useMeta } from "@factor/api"

// eslint-disable-next-line import/no-unresolved
import icon from "/icon.jpg"
useMeta({
  title: "Andrew Powers",
  meta: [
    {
      name: `description`,
      content: `Website of Andrew Powers (@arpowers) - Innovation and Development Architect`,
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
