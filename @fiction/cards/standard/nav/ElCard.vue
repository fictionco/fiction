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

const fictionItems = vue.computed(() => getFictionNavItems({ fictionAdmin, fictionUser }))
</script>

<template>
  <CardWrap :card class="" vertical-spacing="none">
    <div class="flex justify-between min-h-14">
      <div class="flex justify-start items-center gap-6 basis-0 grow">
        <!-- Logo -->
        <XLink
          :card
          href="/"
          class="relative flex items-center z-40 will-change-transform transition-transform duration-300 ease-out"
          :class="[hoverClass, showMobileNav ? '' : '']"
          @click="showMobileNav = false"
        >
          <XLogoType
            :logo="uc?.logo"
            :classes="{ text: 'x-font-title text-lg font-bold' }"
            :media-handling="{ height: 2 }"
            :org="card.site?.org.value"
          />
        </XLink>
      </div>

      <div class="md:hidden flex items-center justify-end">
        <XButton
          icon-after="i-tabler-chevron-down"
          design="link"
          @click.stop="showMobileNav = !showMobileNav"
        >
          Menu
        </XButton>
      </div>

      <!-- Desktop Nav -->
      <nav class="hidden md:flex items-center space-x-6 grow-0 font-sans">
        <XLink
          v-for="item in nav"
          :key="item.href"
          :card
          :href="item.href"
          class="h-full flex items-center relative py-4 px-1 text-sm font-medium transition-colors duration-200"
          :class="item.isActive
            ? 'text-theme-900 dark:text-theme-0'
            : 'text-theme-600 dark:text-theme-400 hover:text-theme-900 dark:hover:text-theme-0'"
        >
          <span>{{ item.label }}</span>
          <!-- Active indicator line -->
          <div
            v-if="item.isActive"
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-theme-900 dark:bg-theme-0"
          />
        </XLink>
      </nav>

      <!-- Desktop Actions -->
      <div class="hidden md:flex items-center gap-2 md:gap-4 basis-0 grow justify-end">
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
          :items="fictionItems"
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
      class="md:hidden h-dvh w-[75%] max-w-[350px] shrink-0 will-change-auto transition-all  duration-300 border-theme-300/50 dark:border-theme-600/50 fixed top-0 z-30 justify-end border-r"
      :class="showMobileNav ? 'left-0 opacity-100 bg-theme-900/80' : '-left-full opacity-0'"
      @click.stop
    >
      <div class="px-8 py-24 flex flex-col gap-16 h-full ">
        <div class="  flex flex-col gap-12">
          <ul v-if="nav.length" class="space-y-3 ">
            <li class="text-theme-500 text-lg">
              Pages
            </li>
            <li v-for="(item, idx) in nav" :key="idx">
              <XLink
                :href="item.href"
                class="text-xl flex gap-2 items-center font-medium font-sans"
                @click="showMobileNav = false"
              >
                <span>{{ item.label }}</span>
              </XLink>
            </li>
          </ul>
          <ul class="space-y-3">
            <li class="text-theme-500 text-lg">
              Fiction
            </li>
            <li v-for="(item, idx) in fictionItems" :key="idx">
              <XLink
                :href="item.href"
                class="text-xl flex gap-2 items-center font-medium font-sans"
                @click="showMobileNav = false"
              >
                <span>{{ item.label }}</span>
              </XLink>
            </li>
          </ul>
        </div>
        <SubscribeButton :card size="lg" />
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
