<script setup lang="ts">
import SiteHeader from './SiteHeader.vue'
import SiteFooter from './SiteFooter.vue'
import { useMeta } from '@factor/api'

import icon from '/icon.jpg'

useMeta({
  title: 'Fiction - Create Adaptive Websites',
  meta: [
    {
      name: `description`,
      content: `Fiction is the world's leading generative website tool. Create adaptive websites.`,
    },
    {
      vmid: 'socialImage',
      property: 'og:image',
      content: icon,
    },
    {
      vmid: 'icon',
      rel: 'icon',
      href: icon,
    },
  ],
})
</script>

<template>
  <div
    class="content-layout m-auto min-h-screen bg-white font-normal max-w-[1200px] mx-auto"
  >
    <SiteHeader />
    <router-view />
    <SiteFooter />
  </div>
</template>

<style lang="less">
@import "./style.less";
</style>
