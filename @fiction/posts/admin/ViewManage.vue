<script lang="ts" setup>
import type { NavCardUserConfig } from '@fiction/admin'
import { vue } from '@fiction/core'
import { Card } from '@fiction/site'
import PagePostIndex from './PagePostIndex.vue'

const { card } = defineProps<{ card: Card }>()
const loading = vue.ref(false)

const panels = [
  new Card<NavCardUserConfig>({
    slug: 'posts',
    title: 'Posts',
    description: 'Manage your articles, updates, and announcements',
    el: vue.defineAsyncComponent(async () => import('./PagePostIndex.vue')),
    userConfig: { isNavItem: true, navIcon: 'i-tabler-file-description', navIconAlt: 'i-tabler-file-spark' },
  }),
]
</script>

<template>
  <div class="max-w-[920px] mx-auto py-12">
    <PagePostIndex :card />
  </div>
</template>
