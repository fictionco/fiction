<script setup lang="ts">
import type { NavListItem } from '@fiction/core'
import type { Card } from '@fiction/site/card'
import type { UserConfig } from './config'
import CardNavLink from '@fiction/cards/CardNavLink.vue'
import { toLabel, useService, vue } from '@fiction/core'
import XLogoType from '@fiction/ui/media/XLogoType.vue'
import UserMenu from '@fiction/ui/nav/UserMenu.vue'
import CardWrap from '../../CardWrap.vue'
import CardLink from '../../el/CardLink.vue'
import { processNavItems } from '../../utils/nav'

const { card } = defineProps<{ card: Card<UserConfig> }>()
const { fictionUser } = useService()

const uc = vue.computed(() => card.userConfig.value || {})

// Process navigation items for both primary and utility nav
const nav = vue.computed(() => {
  const siteRouter = card.site?.siteRouter
  const pages: NavListItem[] = card.site?.pages.value.filter(p => p.inNav.value).map(page => ({
    label: page.title.value || toLabel(page.slug.value),
    href: `/${page.isHome.value ? '' : page.slug.value}`,
  })) || []

  const out = {
    primary: processNavItems({
      items: pages || [],
      fictionRouter: siteRouter,
      fictionUser,
      basePathPrefix: '',
    }),
  }

  return out
})
</script>

<template>
  <CardWrap :card content-width="full" class="bg-theme-700/20">
    <div class="z-20">
      <div class="x-header-container">
        <div class="relative">
          <nav class="" aria-label="Global">
            <div class="relative flex items-center justify-between gap-12">
              <div class="inline-flex mr-4 justify-start basis-0 grow">
                <CardLink
                  :card
                  href="/"
                  class="flex items-end group"
                >
                  <XLogoType
                    :logo="uc.brand?.logo"
                    :classes="{
                      text: 'x-font-title text-lg font-bold',
                    }"
                    :media-handling="{ height: 1.6 }"
                    class="transition-all group-hover:opacity-80 duration-200"
                    data-test-id="page-nav-logo"
                    :org="card.site?.org.value"
                  />
                </CardLink>
              </div>

              <div
                class="hidden md:flex gap-x-4 items-center grow-0"
              >
                <CardLink
                  v-for="(item, i) in nav.primary"
                  :key="i"
                  :card
                  :href="item.href"
                  class="py-1 px-4 text-sm font-sans inline-flex items-center rounded-lg  transition-all duration-200 font-medium"
                  :class="[
                    item.isActive ? 'bg-theme-700 text-theme-0' : 'hover:bg-theme-700 text-theme-200 hover:text-theme-0',
                  ]"
                >
                  {{ item.label }}
                </CardLink>
              </div>

              <!-- Utility Navigation -->
              <div class="gap-x-6 flex items-center justify-end basis-0 grow">
                <UserMenu :card :nav="nav.primary" />
              </div>
            </div>
          </nav>
        </div>
      </div>
    </div>
  </CardWrap>
</template>
