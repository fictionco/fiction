<script lang="ts" setup>
import type { NavCardUserConfig } from '@fiction/admin'
import SettingsBoard from '@fiction/admin/settings/SettingsBoard.vue'
import { vue } from '@fiction/core'
import { Card } from '@fiction/site'

const { card } = defineProps<{ card: Card }>()

const panels = [
  new Card<NavCardUserConfig>({
    slug: 'subscribers',
    title: 'Subscribers',
    description: 'View, filter, and manage your complete list',
    el: vue.defineAsyncComponent(async () => import('../admin/ViewIndex.vue')),
    userConfig: { isNavItem: true, navIcon: 'i-tabler-users', navIconAlt: 'i-tabler-users-plus' },
  }),
  new Card<NavCardUserConfig>({
    slug: 'view',
    title: 'Contact Details',
    description: 'View individual subscriber information and history',
    el: vue.defineAsyncComponent(async () => import('../admin/ViewSingle.vue')),
    userConfig: { navIcon: 'i-tabler-user', parentItemId: 'subscribers' },
  }),
]
</script>

<template>
  <SettingsBoard
    :card
    :panels
    :panel-props="{ card }"
    :header="{
      media: { class: `i-tabler-users` },
      title: 'Audience',
      subTitle: 'Manage your audience and their preferences',
    }"
    theme="cyan"
  />
</template>
