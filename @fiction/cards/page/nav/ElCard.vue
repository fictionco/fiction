<script setup lang="ts">
import type { NavListItem } from '@fiction/core'
import type { Card } from '@fiction/site/card'
import type { UserConfig } from './config'
import CardNavLink from '@fiction/cards/CardNavLink.vue'
import { useService, vue } from '@fiction/core'
import TransitionSlide from '@fiction/ui/anim/TransitionSlide.vue'
import XLogoType from '@fiction/ui/media/XLogoType.vue'
import NavMobile from '@fiction/ui/NavMobile.vue'
import CardLink from '../../el/CardLink.vue'
import { processNavItems } from '../../utils/nav'
import UserMenu from './UserMenu.vue'
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

function closeMenu() {
  activeItem.value = undefined
}
</script>

<template>
  <div class="z-20" :class="card.classes.value.contentWidth">
    <div class="x-header-container">
      <div class="relative">
        <nav class="relative flex items-center justify-between gap-12" aria-label="Global">
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
          <div class="hidden md:flex gap-x-6 items-center justify-end" :class="layoutClass.utility">
            <XNav
              :nav="nav.utility"
              :card
              item-class="py-1.5 text-base font-sans font-medium inline-flex items-center"
              :active-item="activeItem"
              @update:active-item="setActiveHover($event)"
            />
            <UserMenu :card />
          </div>

          <!-- Mobile Menu -->
          <div class="flex md:hidden">
            <button
              class="text-3xl z-30 relative i-tabler-menu"
              :class="mobileMenuVisible ? 'text-white' : ''"
              aria-label="Toggle menu"
              @click.stop="mobileMenuVisible = !mobileMenuVisible"
            />
            <NavMobile
              :vis="mobileMenuVisible"
              :nav="{ navA: nav.primary, navB: nav.utility }"
              @update:vis="mobileMenuVisible = $event"
            />
          </div>
        </nav>

        <!-- Mega Menu -->
        <TransitionSlide>
          <nav
            v-if="activeItem?.list?.variant === 'expanded' && activeItem?.list?.items?.length"
            class="overflow-hidden absolute z-40 top-[calc(100%+.5rem)] w-full bg-theme-0 dark:bg-theme-800 border border-theme-300/70 dark:border-theme-500/20 rounded-xl flex shadow-primary-500/20 dark:shadow-lg dark:shadow-primary-700/30"
            @mouseover="setActiveHover(activeItem)"
            @mouseleave="setActiveHover(undefined)"
          >
            <!-- Mega Menu Header -->
            <div class="dark:bg-theme-950/70 dark:text-white w-[33%] min-h-[200px]">
              <div class="p-8 space-y-2 max-w-[350px]">
                <h2 class="x-font-title text-3xl font-semibold dark:text-theme-100">
                  {{ activeItem.list.title || activeItem.label }}
                </h2>
                <p class="text-xl text-theme-500 dark:text-theme-400 font-sans font-normal">
                  {{ activeItem.list.description }}
                </p>
              </div>
            </div>

            <!-- Mega Menu Content -->
            <div class="grow">
              <div
                class=""
                :class="activeItem.list.items.some(_ => _.list?.items?.length)
                  ? 'py-6 px-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 auto-cols-fr grid-flow-dense'
                  : 'p-12 flex flex-col gap-6 text-xl'"
              >
                <div
                  v-for="(item, i) in activeItem.list.items"
                  :key="i"
                  class="break-inside-avoid"
                >
                  <CardNavLink
                    hover-effect="underline"
                    :card
                    :item="item"
                    class="px-4 py-2 font-normal x-font-title "
                    :depth="1"
                    :class="[
                      item.isHidden ? 'hidden' : 'block',
                      item?.href || item.onClick ? 'cursor-pointer' : 'cursor-default text-theme-500 dark:text-theme-400',
                    ]"
                    @click="closeMenu()"
                  />

                  <div v-if="item.list?.items?.length">
                    <template v-for="(subSubItem, iii) in item.list?.items" :key="iii">
                      <CardNavLink
                        hover-effect="underline"
                        :card
                        :item="subSubItem"
                        class="font-sans pl-7 pr-4 py-1.5 block font-normal text-[.9em]"
                        :depth="2"
                        :class="subSubItem.isHidden ? 'hidden' : 'block'"
                        @click="closeMenu()"
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
