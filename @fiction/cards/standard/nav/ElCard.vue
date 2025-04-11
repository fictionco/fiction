<script setup lang="ts">
import type { Card } from '@fiction/site/card'
import type { UserConfig } from './config'
import CardNavLink from '@fiction/cards/CardNavLink.vue'
import { useService, vue } from '@fiction/core'
import XLogoType from '@fiction/ui/media/XLogoType.vue'
import UserMenu from '@fiction/ui/nav/UserMenu.vue'
import CardLink from '../../el/CardLink.vue'
import { processNavItems } from '../../utils/nav'

const { card } = defineProps<{ card: Card<UserConfig> }>()
const { fictionUser } = useService()

const uc = vue.computed(() => card.userConfig.value || {})

// Process navigation items for both primary and utility nav
const nav = vue.computed(() => {
  const siteRouter = card.site?.siteRouter
  const pages = card.site?.pages.value.filter(p => p.inNav.value).map(page => ({
    label: page.title.value || page.slug.value,
    href: `/${page.slug.value}`,
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

const layoutClass = vue.computed(() => {
  return {
    brand: '',
    primary: 'grow justify-center',
    utility: 'shrink ',
  }
})
</script>

<template>
  <div class="z-20" :class="card.classes.value.contentWidth">
    <div class="x-header-container">
      <div class="relative">
        <nav class="" aria-label="Global">
          <div class="relative flex items-center justify-between gap-12">
            <div v-if="uc.brand?.logo" class="inline-flex mr-4 justify-start basis-0 grow" :class="layoutClass.brand">
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

            <div
              class="hidden md:flex gap-x-8 items-center grow-0"
            >
              <CardNavLink
                v-for="(item, i) in nav.primary"
                :key="i"
                :card
                :item
                class="py-1.5 text-base font-sans font-medium inline-flex items-center"
                :depth="0"
                hover-effect="underline"
              />
            </div>

            <!-- Utility Navigation -->
            <div class="gap-x-6 flex items-center justify-end basis-0 grow" :class="layoutClass.utility">
              <UserMenu :card :nav="nav.primary" />
            </div>
          </div>
        </nav>
      </div>
    </div>
  </div>
</template>
