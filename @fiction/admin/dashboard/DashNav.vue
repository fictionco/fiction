<script lang="ts" setup>
import type { MediaObject, NavListItem } from '@fiction/core'
import type { Card } from '@fiction/site/card'
import CardLink from '@fiction/cards/el/CardLink.vue'
import { toLabel, useService, vue } from '@fiction/core'
import ElAvatar from '@fiction/ui/common/ElAvatar.vue'
import XDropDown from '@fiction/ui/common/XDropDown.vue'
import XIcon from '@fiction/ui/media/XIcon.vue'
import XMedia from '@fiction/ui/media/XMedia.vue'

const props = defineProps({
  icon: { type: Object as vue.PropType<MediaObject>, default: undefined },
  nav: { type: Array as vue.PropType<NavListItem[]>, default: () => [] },
  card: { type: Object as vue.PropType<Card>, required: true },
})

const { fictionUser } = useService()

async function handleClick(event: MouseEvent, item: NavListItem): Promise<void> {
  if (item.onClick) {
    event.preventDefault()
    event.stopPropagation()
    await item.onClick({ event, item })
  }
}

// Workspace/Organization dropdown items
const workspaceItems = vue.computed<NavListItem[]>(() => {
  const activeOrg = fictionUser.activeOrganization.value
  const orgs = fictionUser.activeOrganizations.value || []

  const orgItems = orgs.map(org => ({
    label: org.orgName || org.handle || 'Unnamed Workspace',
    value: org.orgId,
    icon: { class: 'i-tabler-building' },
    isActive: org.orgId === activeOrg?.orgId,
    onClick: async () => {
      if (org.orgId !== activeOrg?.orgId) {
        await fictionUser.setNewActiveOrgId({ orgId: org.orgId, caller: 'PanelManageOrg' })
      }
    },
  }))

  return [
    ...orgItems,
    {
      label: 'Create Workspace',
      icon: { class: 'i-tabler-plus' },
      href: props.card.link({ path: '/settings/manage-organizations' }),
    },
  ]
})

// User dropdown items
const userItems = vue.computed<NavListItem[]>(() => [
  {
    label: 'Account Settings',
    icon: { class: 'i-tabler-settings' },
    href: props.card.link({ path: '/settings/account' }),
  },
  {
    label: 'Log Out',
    icon: { class: 'i-tabler-logout' },
    onClick: async () => {
      await fictionUser?.logout({ redirect: '/' })
    },
  },
])

const activeOrg = vue.computed(() => fictionUser.activeOrganization.value)
const activeUser = vue.computed(() => fictionUser.activeUser.value)

const cls = {
  active: 'font-semibold bg-primary-100/60 text-primary-700 dark:bg-primary-800/50 ring-2 ring-primary-600/50 dark:ring-primary-800 dark:text-primary-0',
  inactive: 'font-medium text-theme-700 dark:text-theme-200 dark:hover:bg-theme-700 border-theme-0',
  navItemWrap: 'group nav-item flex cursor-pointer items-center py-3 px-4 gap-3 truncate rounded-full font-sans text-base xl:text-base focus:outline-none transition-all duration-100',
  icon: 'size-6 shrink-0',
}
</script>

<template>
  <div class="flex h-full min-w-0 grow flex-col justify-between">
    <div class="space-y-1 font-sans">
      <div class="flex items-center justify-start space-x-3 p-2">
        <div>
          <div class="rounded-full flex items-center justify-start">
            <CardLink :card href="/" class="text-xl transition-all p-4 rounded-md">
              <XMedia class="h-[32px]" :media="icon" />
            </CardLink>
          </div>
        </div>
      </div>

      <!-- Workspace/Organization Dropdown -->
      <div class="pb-4">
        <XDropDown
          :items="workspaceItems"
          placement="bottom"
          mode="click"
          :classes="{ width: 'w-64' }"
        >
          <template #default="{ isActive }">
            <div class="flex items-center gap-3 p-3 rounded-lg hover:bg-theme-100 dark:hover:bg-theme-800 cursor-pointer transition-colors">
              <ElAvatar
                :org="activeOrg"
                class="size-8 shrink-0"
              />
              <div class="min-w-0 flex-1">
                <div class="text-sm font-medium text-theme-900 dark:text-theme-100 truncate">
                  {{ activeOrg?.orgName || activeOrg?.handle || 'No Workspace' }}
                </div>
              </div>
              <XIcon
                class="size-4 text-theme-400 transition-transform"
                :class="[isActive ? 'rotate-180' : '']"
                :media="{ class: 'i-tabler-chevron-down' }"
              />
            </div>
          </template>
        </XDropDown>
      </div>

      <div class="p-3 space-y-2">
        <div
          v-for="(sub, i) in nav"
          :key="i"
          class="menu-group"
        >
          <div class="nav-menu">
            <CardLink
              :card
              :href="sub.href"
              :class="[sub.isActive ? cls.active : cls.inactive, cls.navItemWrap]"
              :data-test-id="`dashboard-nav-${sub.testId}`"
              @click="handleClick($event, sub)"
            >
              <XIcon v-if="sub.icon" :media="sub.icon" :class="cls.icon" />
              <div class="truncate" v-html="toLabel(sub.label)" />
            </CardLink>
          </div>
        </div>
      </div>
    </div>

    <!-- User Dropdown -->
    <div class="mb-4 px-3">
      <XDropDown
        :items="userItems"
        placement="top"
        mode="click"
        :classes="{ width: 'w-56' }"
      >
        <template #default="{ isActive }">
          <div class="flex items-center gap-3 p-3 rounded-lg hover:bg-theme-100 dark:hover:bg-theme-800 cursor-pointer transition-colors">
            <ElAvatar
              :user="activeUser"
              class="size-8 shrink-0"
            />
            <div class="min-w-0 flex-1">
              <div class="text-sm font-medium text-theme-900 dark:text-theme-100 truncate">
                {{ activeUser?.email || 'User' }}
              </div>
            </div>
            <XIcon
              class="size-4 text-theme-400 transition-transform"
              :class="[isActive ? 'rotate-180' : '']"
              :media="{ class: 'i-tabler-chevron-up' }"
            />
          </div>
        </template>
      </XDropDown>
    </div>
  </div>
</template>
