<script lang="ts" setup>
import type { MediaObject, NavListItem, vue } from '@fiction/core'
import type { Card } from '@fiction/site/card'
import CardLink from '@fiction/cards/el/CardLink.vue'
import { toLabel } from '@fiction/core'
import ElIndexItemMedia from '@fiction/ui/lists/ElIndexItemMedia.vue'
import XIcon from '@fiction/ui/media/XIcon.vue'
import XMedia from '@fiction/ui/media/XMedia.vue'

defineProps({
  icon: { type: Object as vue.PropType<MediaObject>, default: undefined },
  nav: { type: Array as vue.PropType<NavListItem[]>, default: () => [] },
  navBottom: { type: Array as vue.PropType<NavListItem[]>, default: () => [] },
  card: { type: Object as vue.PropType<Card>, required: true },
})

async function handleClick(event: MouseEvent, item: NavListItem): Promise<void> {
  if (item.onClick) {
    event.preventDefault()
    event.stopPropagation()
    await item.onClick({ event, item })
  }
}

const cls = {
  active: 'font-semibold bg-primary-100/60 text-primary-700 dark:bg-primary-800/50 ring-2 ring-primary-600/50 dark:ring-primary-800 dark:text-primary-0',
  inactive: 'font-normal text-theme-700 dark:text-theme-200 dark:hover:bg-theme-700 hover:text-theme-900 border-theme-0',
  navItemWrap: 'group nav-item flex cursor-pointer items-center py-3 px-4 gap-3 truncate rounded-full font-sans text-base xl:text-lg focus:outline-none transition-all duration-100',
  icon: 'size-6 lg:size-8 shrink-0',
}
</script>

<template>
  <div class="flex h-full min-w-0 grow flex-col justify-between ">
    <div class="space-y-1 font-sans">
      <div class="flex items-center justify-start space-x-3 px-3 py-2">
        <div class=" ">
          <div class="rounded-full flex items-center justify-start">
            <CardLink :card href="/" class="text-xl text-theme-700 hover:text-primary-500 dark:text-theme-0 dark:hover:text-primary-300 transition-all p-4 rounded-md">
              <XMedia class="h-[21px] xl:h-[26px]" :media="icon" />
            </CardLink>
          </div>
        </div>
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
              :class="[sub.isActive ? cls.active : cls.inactive, cls.navItemWrap] "
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
    <div class="mb-4 p-3">
      <div
        v-for="(sub, i) in navBottom"
        :key="i"
        class="menu-group"
      >
        <div class="nav-menu">
          <CardLink
            :card
            :href="sub.href"
            :class="[sub.isActive ? cls.active : cls.inactive, cls.navItemWrap] "
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
</template>
