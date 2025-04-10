<script setup lang="ts">
import type { NavListItem } from '@fiction/core'
import type { Card } from '@fiction/site/card'
import type { UserConfig } from './config'
import { useService, vue } from '@fiction/core'
import XLogoType from '@fiction/ui/media/XLogoType.vue'
import UserMenu from '@fiction/ui/nav/UserMenu.vue'
import CardLink from '../../el/CardLink.vue'
import { processNavItems } from '../../utils/nav'
import XNav from './XNav.vue'

const props = defineProps<{ card: Card<UserConfig> }>()
const { fictionUser } = useService()

const uc = vue.computed(() => props.card.userConfig.value || {})

// Process navigation items for both primary and utility nav
const nav = vue.computed(() => {
  const siteRouter = props.card.site?.siteRouter
  const out = {
    primary: processNavItems({
      items: uc.value.nav?.primary || [],
      basePathPrefix: 'nav.primary',
      fictionRouter: siteRouter,
      fictionUser,
    }),
    utility: processNavItems({
      items: uc.value.nav?.utility || [],
      fictionRouter: siteRouter,
      basePathPrefix: 'nav.utility',
      fictionUser,
    }),
  }

  return out
})

const mobileMenuVisible = vue.ref(false)

const activeItem = vue.ref<NavListItem>()

let timeoutId: ReturnType<typeof setTimeout> | null = null

function setActiveHover(item?: NavListItem) {
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

  switch (layout) {
    case 'navCenter':
      return {
        brand: '',
        primary: 'grow justify-center',
        utility: 'shrink ',
      }
    case 'logoCenter':
      return {
        brand: 'lg:order-2 lg:justify-center lg:basis-1/3 shrink',
        primary: 'lg:order-1 justify-start basis-1/3 grow',
        utility: 'lg:order-3 basis-1/3 grow',
      }
    default:
      return {
        brand: 'grow-0',
        primary: 'grow',
        utility: '',
      }
  }
})
</script>

<template>
  <div class="z-20" :class="card.classes.value.contentWidth">
    <div class="x-header-container">
      <div class="relative">
        <nav class="" aria-label="Global">
          <div class="relative flex items-center justify-between gap-12">
            <div v-if="uc.brand?.logo" class="inline-flex mr-4 justify-start" :class="layoutClass.brand">
              <CardLink
                :card
                href="/"
                class="flex items-end group"
              >
                <XLogoType
                  :logo="uc.brand.logo"
                  :classes="{
                    text: 'x-font-title text-2xl font-medium',
                  }"
                  :media-handling="{ height: 1.6 }"
                  class="transition-all group-hover:opacity-80 duration-200"
                  data-test-id="page-nav-logo"
                  :org="card.site?.org.value"
                />
              </CardLink>
            </div>

            <XNav
              :nav="nav.primary"
              :card
              class="hidden md:flex gap-x-8 items-center "
              :class="layoutClass.primary"
              item-class="py-1.5 text-base font-sans font-medium inline-flex items-center"
              :active-item="activeItem"
              @update:active-item="setActiveHover($event)"
            />

            <!-- Utility Navigation -->
            <div class="gap-x-6 flex items-center justify-end" :class="layoutClass.utility">
              <XNav
                :nav="nav.utility"
                :card
                item-class="hidden md:flex py-1.5 text-base font-sans font-medium hidden md:inline-flex items-center"
                :active-item="activeItem"
                @update:active-item="setActiveHover($event)"
              />
              <UserMenu :card :nav="[...nav.primary, ...nav.utility]" />
            </div>
          </div>
        </nav>
      </div>
    </div>
  </div>
</template>
