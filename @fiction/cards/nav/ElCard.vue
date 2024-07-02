<script setup lang="ts">
import { useService, vue } from '@fiction/core'
import type { Card } from '@fiction/site/card'
import NavMobile from '@fiction/ui/NavMobile.vue'
import TransitionSlide from '@fiction/ui/anim/TransitionSlide.vue'
import CardNavLink from '@fiction/cards/CardNavLink.vue'
import { processNavItems } from '../utils/nav'
import XNav from './XNav.vue'
import ElBrand from './ElBrand.vue'
import type { SchemaNavItem, UserConfig } from './index.js'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})
const { fictionRouter, fictionUser } = useService()

const uc = vue.computed(() => props.card.userConfig.value || {})

const nav = vue.computed(() => {
  const n = {
    navA: processNavItems({ items: uc.value.navA || [], basePathPrefix: 'navA', fictionRouter, fictionUser }),
    navB: processNavItems({ items: uc.value.navB || [], fictionRouter, basePathPrefix: 'navB', fictionRouter, fictionUser }),
  }

  return n
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

const layoutClass = vue.computed(() => {
  const layout = uc.value.layout || 'justified'

  if (layout === 'navCenter') {
    return { brand: 'lg:grow lg:basis-1/3', navA: 'grow basis-1/3 justify-center', navB: 'grow  basis-1/3' }
  }
  else if (layout === 'logoCenter') {
    return { brand: 'lg:order-2 lg:justify-center lg:basis-1/3', navA: 'lg:order-1 justify-start basis-1/3', navB: 'lg:order-3 basis-1/3' }
  }
  else {
    return { brand: 'grow-0', navA: 'grow', navB: '' }
  }
})
</script>

<template>
  <div class="z-20">
    <div class="x-header-container" :class="card.classes.value.contentWidth">
      <div class="relative">
        <nav class="relative flex items-center justify-between gap-12" aria-label="Global">
          <div class="flex" :class="layoutClass.brand">
            <ElBrand :logo="uc.logo" :card />
          </div>
          <XNav
            :nav="nav.navA"
            :card
            class="hidden lg:flex lg:gap-x-4 items-center space-x-4 "
            :class="layoutClass.navA"
            item-class="py-1.5 text-base font-sans font-medium inline-flex items-center"
            :active-item="activeItem"
            @update:active-item="setActiveHover($event)"
          />
          <XNav
            :nav="nav.navB"
            :card
            class="hidden lg:flex gap-x-4 items-center space-x-4 justify-end"
            :class="layoutClass.navB"
            item-class="py-1.5 text-base font-sans font-medium inline-flex items-center "
            :active-item="activeItem"
            @update:active-item="setActiveHover($event)"
          />

          <div class="flex lg:hidden">
            <div class="text-3xl z-30 relative i-tabler-menu" :class="vis ? 'text-white' : ''" @click.stop="vis = !vis" />
            <NavMobile v-model:vis="vis" :nav="nav" />
          </div>
        </nav>
        <TransitionSlide>
          <nav v-if="activeItem?.subStyle === 'mega' && activeItem.items?.length" class="min-h-[300px] overflow-hidden absolute z-30 top-[calc(100%+.5rem)] w-full bg-theme-0 dark:bg-theme-800 dark:border-2 dark:border-theme-500/20 rounded-xl flex" @mouseover="setActiveHover(activeItem)" @mouseleave="setActiveHover(undefined)">
            <div class="bg-theme-950/70 text-white w-[33%]">
              <div class="p-6 space-y-2 max-w-[350px]">
                <h2 class="x-font-title text-3xl font-semibold dark:text-theme-100" v-html="activeItem.name" />
                <p class="text-xl text-theme-500 dark:text-theme-400 font-sans font-normal" v-html="activeItem.desc" />
              </div>
            </div>
            <div class="grow">
              <div class="p-12 grid grid-cols-3">
                <div v-for="(subItem, ii) in activeItem.items" :key="ii">
                  <CardNavLink
                    hover-effect="underline"
                    :card
                    :item="subItem"
                    class="px-4 py-2  font-normal x-font-title"
                    :depth="1"
                    :class="subItem.isHidden ? 'hidden' : 'block'"
                  />

                  <div v-if="subItem?.items?.length">
                    <template v-for="(subSubItem, iii) in subItem.items" :key="iii">
                      <CardNavLink
                        hover-effect="underline"
                        :card
                        :item="subSubItem"
                        class="font-sans pl-7 pr-4 py-1.5 block font-normal text-[.9em]"
                        :depth="2"
                        :class="subSubItem.isHidden ? 'hidden' : 'block'"
                      />
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
