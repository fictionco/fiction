<script lang="ts" setup>
import type { NavCardUserConfig } from '@fiction/admin'
import { vue } from '@fiction/core'
import { Card } from '@fiction/site'
import ManageIndex from './ManageIndex.vue'

const { card } = defineProps<{ card: Card }>()

const panels = [
  new Card<NavCardUserConfig>({
    slug: 'list',
    title: 'Sites',
    description: 'View and manage all your sites and landing pages',
    el: vue.defineAsyncComponent(async () => import('./ManageIndex.vue')),
    userConfig: {
      isNavItem: true,
      navIcon: 'i-tabler-browser',
      navIconAlt: 'i-tabler-browser-plus',
    },
  }),
]
</script>

<template>
  <div class="max-w-[920px] mx-auto py-12">
    <ManageIndex :card />
  </div>
</template>
