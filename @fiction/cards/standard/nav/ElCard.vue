<script setup lang="ts">
import type { FictionAdmin } from '@fiction/admin'
import type { Card } from '@fiction/site/card'
import type { UserConfig } from './config'
import { getFictionAuthUrl, getFictionNavItems } from '@fiction/admin'
import { sortPriority, toLabel, useService, vue } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import ElAvatar from '@fiction/ui/common/ElAvatar.vue'
import ElClose from '@fiction/ui/common/ElClose.vue'
import XDropDown from '@fiction/ui/common/XDropDown.vue'
import XLink from '@fiction/ui/common/XLink.vue'
import XMenuButton from '@fiction/ui/common/XMenuButton.vue'
import XIcon from '@fiction/ui/media/XIcon.vue'
import XLogoType from '@fiction/ui/media/XLogoType.vue'
import CardWrap from '../../CardWrap.vue'
import SubscribeButton from './SubscribeButton.vue'

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
        }
      }) || [],
    { centerNumber: 100 },
  )
})

const vis = vue.ref(false)

// subscribe
const showSubscribeButton = vue.computed(() => !isEditable.value && !uc.value.hideSubscribe)
const isSubscribed = vue.computed(() => card.site?.activeContact?.value?.status === 'active')

const showMobileNav = vue.ref(false)
</script>

<template>
  <CardWrap :card class="border-b border-theme-700 bg-theme-900/50" vertical-spacing="none">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3 -ml-3 md:ml-0 basis-0 grow">
        <div class="flex md:hidden px-2 py-2">
          <XMenuButton
            class="size-8"
            :is-open="showMobileNav"
            @click.stop="showMobileNav = !showMobileNav"
          />
        </div>
        <!-- Logo -->
        <XLink :card href="/" :class="`py-3 ${hoverClass} flex items-center gap-2 basis-0 grow`">
          <XLogoType
            :logo="uc.brand?.logo"
            :classes="{ text: 'x-font-title text-lg font-bold' }"
            :media-handling="{ height: 1.8 }"
            :org="card.site?.org.value"
          />
        </XLink>
      </div>

      <!-- Desktop Nav -->
      <nav class="hidden md:flex space-x-6 grow-0 font-sans">
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
      <div class="flex items-center gap-2 md:gap-4 basis-0 grow justify-end">
        <XButton
          v-if="!user && !isEditable"
          :href="getFictionAuthUrl({ fictionAdmin, site: card.site, redirect: uc.redirectAfterLogin })"
          icon-after="i-tabler-chevron-right"
          design="link"
          :class="hoverClass"
        >
          Sign In
        </XButton>

        <SubscribeButton :card />

        <XDropDown
          v-if="user"
          :site="card.site"
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
    </div>
    <Transition name="backdrop">
      <div v-if="showMobileNav" class="overlay md:hidden fixed z-20 bg-theme-700/20 inset-0  backdrop-blur-sm" @click="showMobileNav = false" />
    </Transition>
    <div
      v-if="nav.length"
      class="md:hidden h-dvh w-[60%] shrink-0 will-change-auto transition-all  duration-300 border-theme-300/50 dark:border-theme-600/50 fixed top-0 z-30 justify-end border-r"
      :class="showMobileNav ? 'left-0 opacity-100 bg-theme-900/80' : '-left-full opacity-0'"
      @click.stop
    >
      <div class="p-7 pb-32 flex flex-col justify-between gap-16 h-full">
        <div class="grow flex flex-col justify-between">
          <div v-if="nav.length" class="space-y-3 grow">
            <ul class="space-y-3 text-right">
              <li v-for="(item, idx) in nav" :key="idx">
                <XLink
                  :href="item.href"
                  class="text-3xl flex gap-2 justify-end items-center font-medium font-sans"
                  @click="showMobileNav = false"
                >
                  <span>{{ item.label }}</span>
                </XLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <ElClose v-if="showMobileNav" class="absolute -right-16 top-4" @click="showMobileNav = false" />
    </div>
  </CardWrap>
</template>

<style lang="less">
.backdrop-enter-active,
.backdrop-leave-active {
  transition: opacity 0.2s ease-in-out;
}

.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}
</style>
