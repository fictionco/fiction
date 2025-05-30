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

// Process navigation items for both primary and utility nav
const nav = vue.computed(() => {
  const siteRouter = card.site?.siteRouter
  const pages: NavListItem[] = card.site?.pages.value.filter(p => !p.isSystem.value && p.nav.value === 'show').map((page) => {
    const href = `/${page.isHome.value ? '' : page.slug.value}`
    return {
      label: page.title.value || toLabel(page.slug.value),
      href,
      isActive: href === siteRouter?.current.value.path,
      priority: page.priority.value,
    }
  }) || []

  return sortPriority(pages, { centerNumber: 100 })
})

const mobileMenuVisible = vue.ref(false)

const isEditable = vue.computed(() => card.site?.isEditable.value)
const showSubscribeButton = vue.computed(() => {
  return !isEditable && !uc.value.hideSubscribe
})

const isSubscribed = vue.computed(() => card.site?.activeContact?.value?.status === 'active')
</script>

<template>
  <CardWrap :card class="border-b border-theme-700 bg-theme-900/50" vertical-spacing="none">
    <div class="relative flex items-center justify-between gap-8">
      <div class="inline-flex justify-start basis-0 grow py-2">
        <XLink
          :card
          href="/"
          class="flex items-end group"
        >
          <XLogoType
            :logo="uc.brand?.logo"
            :classes="{
              text: 'x-font-title text-lg font-bold',
            }"
            :media-handling="{ height: 2 }"
            class="transition-all group-hover:opacity-80 duration-200"
            data-test-id="page-nav-logo"
            :org="card.site?.org.value"
          />
        </XLink>
      </div>

      <nav class="hidden md:flex space-x-6">
        <XLink
          v-for="item in nav"
          :key="item.href"
          :card
          :href="item.href"
          class="relative py-4 px-1 text-sm font-medium transition-colors duration-200 hover:text-theme-900 dark:hover:text-theme-0"
          :class="item.isActive
            ? 'text-theme-900 dark:text-theme-0'
            : 'text-theme-600 dark:text-theme-400'"
        >
          {{ item.label }}
          <!-- Active/Hover border -->
          <span
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-theme-900 dark:bg-theme-0 transition-opacity duration-200"
            :class="item.isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'"
          />
        </XLink>
      </nav>

      <!-- Utility Navigation -->
      <div class="gap-x-6 flex items-center justify-end basis-0 grow">
        <div class="flex items-center relative gap-4">
          <XButton
            v-if="!user || isEditable"
            class="hidden md:block"
            :href="getFictionAuthUrl({ fictionAdmin, site: card.site, redirect: uc.redirectAfterLogin })"
            icon-after="i-tabler-chevron-right"
            theme="default"
            design="link"
          >
            Sign In
          </XButton>
          <XButton
            v-if="showSubscribeButton "
            :theme="isSubscribed ? 'default' : 'primary'"
            :design="isSubscribed ? 'ghost' : 'solid'"
            icon-after="i-tabler-chevron-right"
            :href="isSubscribed ? undefined : `?_subscribe=1`"
          >
            {{ isSubscribed ? 'Subscribed' : 'Subscribe' }}
          </XButton>
          <XDropDown
            v-if="user"
            :site="card.site"
            dropdown-alignment="end"
            mode="hover"
            :class="card.site?.isEditable.value ? 'pointer-events-none' : 'pointer-events-none md:pointer-events-auto '"
            :classes="{ width: 'w-64' }"
            :items="getFictionNavItems({ fictionAdmin, fictionUser })"
          >
            <template #default="{ isActive }">
              <div class="flex items-center relative hover:opacity-80 active:opacity-50">
                <ElAvatar
                  class="size-8 mr-1.5"
                  :user="user"
                />
                <div
                  class="flex z-20 rounded-full ring-1 ring-white bg-theme-600 dark:bg-theme-700 text-theme-100 dark:text-theme-300 size-4  items-center justify-center absolute bottom-0 right-0"
                >
                  <XIcon
                    class="hidden md:block size-[80%] transition-all text-theme-400 dark:text-theme-200"
                    :class="isActive ? 'rotate-180' : ''"
                    :media="{ class: 'i-tabler-chevron-down' }"
                  />
                  <XIcon
                    class="md:hidden size-[80%] transition-all text-theme-400 dark:text-theme-200"
                    :class="isActive ? 'rotate-180' : ''"
                    :media="{ class: 'i-tabler-menu-2' }"
                  />
                </div>
              </div>
            </template>
          </XDropDown>
        </div>
      </div>
    </div>
  </CardWrap>
</template>
