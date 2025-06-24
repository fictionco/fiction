<script lang="ts" setup>
import type { NavCardUserConfig } from '@fiction/admin'
import SettingsBoard from '@fiction/admin/settings/SettingsBoard.vue'
import { vue } from '@fiction/core'
import { Card } from '@fiction/site'

const { card } = defineProps<{ card: Card }>()

const panels = [
  new Card<NavCardUserConfig>({
    slug: 'subscribers',
    title: 'All Subscribers',
    el: vue.defineAsyncComponent(async () => import('./ViewIndex.vue')),
    userConfig: {
      isNavItem: true,
      navIcon: 'i-tabler-users',
      navIconAlt: 'i-tabler-users-plus',
      query: { _view: 'list' },
    },
  }),
  new Card<NavCardUserConfig>({
    slug: 'import',
    title: 'Add / Import',
    el: vue.defineAsyncComponent(async () => import('./ViewImportPanel.vue')),
    userConfig: {
      isNavItem: true,
      navIcon: 'i-tabler-users',
      navIconAlt: 'i-tabler-users-plus',
      query: { _view: 'import' },
    },
  }),
  new Card<NavCardUserConfig>({
    slug: 'view',
    title: 'Contact Details',
    description: 'View individual subscriber information and history',
    el: vue.defineAsyncComponent(async () => import('./ViewSingle.vue')),
    userConfig: { navIcon: 'i-tabler-user' },
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
