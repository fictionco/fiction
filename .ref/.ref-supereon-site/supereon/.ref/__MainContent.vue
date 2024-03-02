<script setup lang="ts">
import SiteHeader from './SiteHeader.vue'
import SiteFooter from './SiteFooter.vue'
import { useMeta } from '@factor/api'

import icon from '/icon.jpg'

useMeta({
  title: 'Applied AI - Supereon',
  meta: [
    {
      name: `description`,
      content: `Supereon companies are building non-linear technologies for the future.`,
    },
    {
      key: 'og:image',
      property: 'og:image',
      content: icon,
    },
  ],
  link: [
    {
      key: 'icon',
      rel: 'icon',
      href: icon,
    },
  ],
})
</script>

<template>
  <div class="content-layout font-sans">
    <SiteHeader />
    <router-view />
    <SiteFooter />
  </div>
</template>
