<script lang="ts" setup>
import type { NavCardUserConfig } from '@fiction/admin'
import SettingsBoard from '@fiction/admin/settings/SettingsBoard.vue'
import { vue } from '@fiction/core'
import { Card } from '@fiction/site'

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
  <SettingsBoard
    :card
    :panels="panels"
    base-path="/sites"
    :header="{
      title: 'Sites',
      subTitle: 'Customizable websites and landing pages.',
      media: { class: 'i-tabler-browser' },
      action: {},
      theme: 'green',
    }"
    theme="green"
  />
</template>
