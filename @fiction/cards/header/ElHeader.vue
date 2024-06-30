<script setup lang="ts">
import type { MediaDisplayObject, NavItem } from '@fiction/core'
import { shortId, useService, vue } from '@fiction/core'
import type { Card } from '@fiction/site/card'
import NavMobile from '@fiction/ui/NavMobile.vue'
import TransitionSlide from '@fiction/ui/anim/TransitionSlide.vue'
import XNav from './XNav.vue'
import ElBrand from './ElBrand.vue'
import type { SchemaNavItem, UserConfig } from './index.js'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})
const { fictionRouter } = useService()

const uc = vue.computed(() => props.card.userConfig.value || {})

const nav = vue.computed(() => {
  const currentRoute = fictionRouter.current.value.path

  return {
    a: (uc.value.navA || []).map((item) => {
      const isActive = item.href === currentRoute
      return { ...item, isActive }
    }),
    b: (uc.value.navB || []).map((item) => {
      const isActive = item.href === currentRoute
      return { ...item, isActive }
    }),
  }
})

const vis = vue.ref(false)

const activeItem = vue.ref<SchemaNavItem | undefined>(undefined)
let timeoutId: ReturnType<typeof setTimeout> | null = null
function setActiveHover(item: SchemaNavItem | undefined) {
  if (timeoutId)
    clearTimeout(timeoutId)

  if (item) {
    activeItem.value = item
  }
  else {
    timeoutId = setTimeout(() => {
      activeItem.value = undefined
    }, 500)
  }
}
const mega = vue.computed(() => {
  const item = activeItem.value

  if (item?.subStyle === 'mega') {
    return item
  }
  return undefined
})
</script>

<template>
  <div class="z-20">
    <div class="x-header-container" :class="card.classes.value.contentWidth">
      <div class="relative">
        <nav class="relative flex items-center justify-between gap-12" aria-label="Global">
          <div class="flex">
            <ElBrand :logo="uc.logo" :card />
          </div>
          <div class="justify-between hidden lg:flex lg:gap-x-4 grow">
            <XNav
              :nav="nav.a"
              :card
              class="hidden lg:flex lg:justify-center lg:gap-x-4 items-center space-x-4"
              item-class="py-1.5 text-base font-sans font-medium"
              :active-item="activeItem"
              @update:active-item="setActiveHover($event)"
            />
            <XNav
              :nav="nav.b"
              :card
              class="hidden lg:flex lg:justify-center lg:gap-x-4 items-center space-x-4"
              item-class="py-1.5 text-base font-sans font-medium"
              :active-item="activeItem"
              @update:active-item="setActiveHover($event)"
            />
          </div>
          <div class="flex lg:hidden">
            <div class="text-3xl z-30 relative" :class="vis ? 'text-white' : ''" @click.stop="vis = !vis">
              <div class="i-tabler-menu" />
            </div>
            <NavMobile v-model:vis="vis" :nav="nav" />
          </div>
        </nav>
        <TransitionSlide>
          <nav v-if="activeItem?.subStyle === 'mega' && activeItem.items?.length" class="min-h-[300px] overflow-hidden absolute z-30 top-[calc(100%+.5rem)] w-full bg-theme-0 dark:bg-theme-800 rounded-xl flex" @mouseover="setActiveHover(activeItem)" @mouseleave="setActiveHover(undefined)">
            <div class="bg-theme-950/70 text-white w-[33%]">
              <div class="p-6 space-y-2 max-w-[350px]">
                <h2 class="x-font-title text-3xl font-medium dark:text-theme-100">
                  Mega Menu Title
                </h2>
                <p class="text-xl text-theme-500 dark:text-theme-400 font-sans">
                  Mega Menu Sub
                </p>
              </div>
            </div>
            <div class="grow">
              <div class="p-12 grid grid-cols-3">
                <div v-for="(subItem, ii) in activeItem.items" :key="ii">
                  <ElNavLink :item="subItem" class="px-4 py-2 block dark:hover:bg-theme-700 font-normal">
                    {{ subItem.name }}
                  </ElNavLink>

                  <div v-if="subItem?.items?.length">
                    <template v-for="(subSubItem, iii) in subItem.items" :key="iii">
                      <ElNavLink :item="subSubItem" class="pl-7 pr-4 py-1.5 block dark:hover:bg-theme-700 font-normal text-[.9em]">
                        {{ subSubItem.name }}
                      </ElNavLink>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </TransitionSlide>
      </div>
    </div>
  </div>
</template>
