<script setup lang="ts">
import type { FictionAdmin } from '@fiction/admin'
import type { NavListItem } from '@fiction/core'
import type { Card } from '@fiction/site/card'
import type { UserConfig } from './config'
import { getFictionAuthUrl, getFictionNavItems } from '@fiction/admin'
import { sortPriority, toLabel, useService, vue } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import ElAvatar from '@fiction/ui/common/ElAvatar.vue'
import XDropDown from '@fiction/ui/common/XDropDown.vue'
import XLink from '@fiction/ui/common/XLink.vue'
import XIcon from '@fiction/ui/media/XIcon.vue'
import XLogoType from '@fiction/ui/media/XLogoType.vue'
import CardWrap from '../../CardWrap.vue'

const { card } = defineProps<{ card: Card<UserConfig> }>()
const { fictionUser, fictionAdmin } = useService<{ fictionAdmin: FictionAdmin }>()

const user = vue.computed(() => fictionUser.activeUser?.value)
const uc = vue.computed(() => card.userConfig.value || {})
const isEditable = vue.computed(() => card.site?.isEditable.value)

const hoverClass = 'hover:opacity-70 transition-opacity duration-100'

// Navigation pages
const nav = vue.computed(() => {
  const siteRouter = card.site?.siteRouter
  return sortPriority(
    card.site?.pages.value
      .filter(p => !p.isSystem.value && p.nav.value === 'show')
      .map((page) => {
        const href = `/${page.isHome.value ? '' : page.slug.value}`
        return {
          label: page.title.value || toLabel(page.slug.value),
          href,
          isActive: href === siteRouter?.current.value.path,
          priority: page.priority.value,
          icon: { class: 'i-tabler-file' },
        }
      }) || [],
    { centerNumber: 100 },
  )
})

// All mobile menu items
const mobileItems = vue.computed(() => [
  ...nav.value,
  ...((!isEditable.value && !uc.value.hideSubscribe)
    ? [{
        label: card.site?.activeContact?.value?.status === 'active' ? 'Subscribed' : 'Subscribe',
        href: card.site?.activeContact?.value?.status === 'active' ? undefined : '?_subscribe=1',
        icon: { class: 'i-tabler-bell' },
      }]
    : []),
  ...(user.value
    ? getFictionNavItems({ fictionAdmin, fictionUser })
    : !isEditable.value
        ? [{
            label: 'Sign In',
            href: getFictionAuthUrl({ fictionAdmin, site: card.site, redirect: uc.value.redirectAfterLogin }),
            icon: { class: 'i-tabler-login' },
          }]
        : []),
])
</script>

<template>
  <CardWrap :card class="border-b border-theme-700 bg-theme-900/50" vertical-spacing="none">
    <div class="flex items-center justify-between">
      <!-- Logo -->
      <XLink :card href="/" :class="`py-2 ${hoverClass} flex items-center gap-2`">
        <XLogoType
          :logo="uc.brand?.logo"
          :classes="{ text: 'x-font-title text-lg font-bold' }"
          :media-handling="{ height: 2 }"
          :org="card.site?.org.value"
        />
      </XLink>

      <!-- Desktop Nav -->
      <nav class="hidden md:flex space-x-6">
        <XLink
          v-for="item in nav"
          :key="item.href"
          :card
          :href="item.href"
          class="relative py-4 px-1 text-sm font-medium transition-colors duration-200"
          :class="item.isActive
            ? 'text-theme-900 dark:text-theme-0'
            : 'text-theme-600 dark:text-theme-400 hover:text-theme-900 dark:hover:text-theme-0'"
        >
          {{ item.label }}
        </XLink>
      </nav>

      <!-- Desktop Actions -->
      <div class="hidden md:flex items-center gap-4">
        <XButton
          v-if="!user && !isEditable"
          :href="getFictionAuthUrl({ fictionAdmin, site: card.site, redirect: uc.redirectAfterLogin })"
          icon-after="i-tabler-chevron-right"
          design="link"
          :class="hoverClass"
        >
          Sign In
        </XButton>

        <XDropDown
          v-if="user"
          :items="getFictionNavItems({ fictionAdmin, fictionUser })"
          dropdown-alignment="end"
          mode="click"
          :classes="{ width: 'w-64' }"
        >
          <div :class="`flex items-center gap-2 cursor-pointer ${hoverClass}`">
            <ElAvatar class="size-8" :user="user" />
            <XIcon class="size-4" :media="{ class: 'i-tabler-chevron-down' }" />
          </div>
        </XDropDown>
      </div>

      <!-- Mobile Menu -->
      <XDropDown
        class="md:hidden"
        :items="mobileItems"
        dropdown-alignment="end"
        mode="click"
        :classes="{ width: 'w-64' }"
      >
        <div :class="`flex items-center gap-2 p-2 pr-0 cursor-pointer ${hoverClass}`">
          <ElAvatar v-if="user" class="size-8" :user="user" />
          <XIcon class="size-6 text-theme-600 dark:text-theme-400" :media="{ class: 'i-tabler-menu-2' }" />
        </div>
      </XDropDown>
    </div>
  </CardWrap>
</template>
