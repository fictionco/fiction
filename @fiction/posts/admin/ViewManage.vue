<script lang="ts" setup>
import type { NavCardUserConfig } from '@fiction/admin'
import SettingsBoard from '@fiction/admin/settings/SettingsBoard.vue'
import { vue } from '@fiction/core'
import { Card } from '@fiction/site'

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
  <SettingsBoard
    :loading
    :card
    :panels
    :panel-props="{ card }"
    :header="{
      title: 'Posts',
      subTitle: 'Publish and manage content.',
      media: { class: `i-tabler-stack` },
      action: {},
    }"
    theme="orange"
  />
</template>
