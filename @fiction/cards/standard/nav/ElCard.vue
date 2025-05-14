<script setup lang="ts">
import type { NavListItem } from '@fiction/core'
import type { Card } from '@fiction/site/card'
import type { UserConfig } from './config'
import { toLabel, useService, vue } from '@fiction/core'
import XLink from '@fiction/ui/common/XLink.vue'
import XLogoType from '@fiction/ui/media/XLogoType.vue'
import UserMenu from '@fiction/ui/nav/UserMenu.vue'
import CardWrap from '../../CardWrap.vue'
import { processNavItems } from '../../utils/nav'

const { card } = defineProps<{ card: Card<UserConfig> }>()
const { fictionUser } = useService()

const uc = vue.computed(() => card.userConfig.value || {})

// Process navigation items for both primary and utility nav
const nav = vue.computed(() => {
  const siteRouter = card.site?.siteRouter
  const pages: NavListItem[] = card.site?.pages.value.filter(p => !p.isSystem.value && p.nav.value === 'show').map(page => ({
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
  <CardWrap :card>
    <div class="z-20">
      <div class="x-header-container">
        <div class="relative">
          <nav class="" aria-label="Global">
            <div class="relative flex items-center justify-between gap-8">
              <div class="inline-flex justify-start basis-0 grow">
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
                    :media-handling="{ height: 1.6 }"
                    class="transition-all group-hover:opacity-80 duration-200"
                    data-test-id="page-nav-logo"
                    :org="card.site?.org.value"
                  />
                </XLink>
              </div>

              <div
                class="hidden md:flex gap-x-6 items-center grow-0"
              >
                <XLink
                  v-for="(item, i) in nav.primary"
                  :key="i"
                  :card
                  :href="item.href"
                  class="py-1 text-sm font-sans inline-flex items-center  transition-all duration-200 font-medium"
                  effect="underline"
                  :is-active="item.isActive"
                >
                  {{ item.label }}
                </XLink>
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
