<script setup lang="ts">
import type { NavCardUserConfig } from '..'
import { vue } from '@fiction/core'
import { Card } from '@fiction/site/card'
import SettingsBoard from './SettingsBoard.vue'

defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
})

const panels = [
  new Card<NavCardUserConfig>({
    slug: 'org',
    title: 'Global Settings',
    description: 'Manage your preferences',
    el: vue.defineAsyncComponent(async () => import('../settings/PanelOrganization.vue')),
    userConfig: { isNavItem: true, navIcon: 'i-tabler-building', navIconAlt: 'i-tabler-building-cog' },
  }),
  new Card<NavCardUserConfig>({
    slug: 'account',
    title: 'User Settings',
    description: 'Manage your login info',
    el: vue.defineAsyncComponent(async () => import('../settings/PanelAccount.vue')),
    userConfig: { isNavItem: true, navIcon: 'i-tabler-user-circle', navIconAlt: 'i-tabler-user-cog' },
  }),
  new Card<NavCardUserConfig>({
    slug: 'team',
    title: 'Team Members',
    description: 'Manage team members, roles, and permissions',
    el: vue.defineAsyncComponent(async () => import('../settings/PanelTeam.vue')),
    userConfig: { isNavItem: true, navIcon: 'i-tabler-users-group' },
  }),
  new Card<NavCardUserConfig>({
    slug: 'team-member',
    title: 'Member Details',
    description: 'View and edit individual team member settings and roles',
    el: vue.defineAsyncComponent(async () => import('../settings/PanelTeamMember.vue')),
    userConfig: { isNavItem: false, navIcon: 'i-tabler-users-group', parentItemId: 'team' },
  }),
  new Card<NavCardUserConfig>({
    slug: 'billing',
    title: 'Billing & Payments',
    description: 'Manage subscriptions, payment methods, and billing history',
    el: vue.defineAsyncComponent(async () => import('../settings/PanelBilling.vue')),
    userConfig: { isNavItem: true, navIcon: 'i-tabler-credit-card', navIconAlt: 'i-tabler-credit-card-filled' },
  }),

  new Card<NavCardUserConfig>({
    slug: 'manage-organizations',
    title: 'Change Workspace',
    description: 'Manage and change active organization',
    el: vue.defineAsyncComponent(async () => import('../settings/PanelManageOrg.vue')),
    userConfig: { isNavItem: true, navIcon: 'i-tabler-refresh', navIconAlt: 'i-tabler-refresh' },
  }),
]
</script>

<template>
  <SettingsBoard
    :card
    :panels
    :panel-props="{ card }"
    base-path="/settings"
    :header="{
      media: { class: 'i-tabler-settings' },
      title: 'Settings',
      subTitle: 'Manage your workspace, team, and personal preferences',
    }"
  />
</template>
