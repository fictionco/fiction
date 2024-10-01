<script setup lang="ts">
import type { NavItem } from '@fiction/core'
import type { Card } from '@fiction/site/card'
import type { NavCardUserConfig } from '..'
import CardLink from '@fiction/cards/el/CardLink.vue'
import { toLabel, toSlug, useService, vue } from '@fiction/core'

const { card, basePath } = defineProps<{ card: Card, basePath: string }>()

const panels = vue.computed(() => card.cards.value.filter(t => t.slug.value) as Card<NavCardUserConfig>[])

const routeItemId = vue.computed(() => toSlug(card.site?.siteRouter.params.value.itemId as string) || panels.value[0].slug.value)

const currentPanel = vue.computed(() => panels.value.find(p => toSlug(p.slug.value) === routeItemId.value))

const nav = vue.computed<NavItem[]>(() => {
  return panels.value
    .filter(panel => panel.userConfig.value?.isNavItem)
    .map((panel) => {
      const slug = panel.slug.value === '_home' ? '' : panel.slug.value

      const panelConfig = panel.userConfig.value || {}
      const itemId = card.site?.siteRouter.params.value.itemId || ''
      const parentItemId = currentPanel.value?.userConfig.value?.parentItemId
      const isActive = !!(slug === itemId || (slug === parentItemId))

      const icon = isActive && panelConfig.navIconAlt
        ? panelConfig.navIconAlt
        : panelConfig.navIcon
          ? panelConfig.navIcon
          : 'i-heroicons-arrow-small-right-20-solid'

      return {
        name: panel.title.value || toLabel(panel.slug.value),
        desc: panel.description.value,
        href: `${basePath}/${slug}`,
        isActive,
        icon,
      }
    })
})
</script>

<template>
  <div class="flex h-[calc(100dvh-61px)]">
    <div class="w-[350px] shrink-0 rounded-l-md pb-32 p-3 md:p-6 border-r dark:border-theme-600/60 border-theme-300/60">
      <div class="space-y-1 text-right">
        <CardLink
          v-for="(v, i) in nav"
          :key="i"
          :card
          class="flex items-center gap-4 px-3 py-2.5 text-sm rounded-lg transition-all duration-100"
          :href="v.href"
          :class="
            v.isActive
              ? 'active bg-primary-100/50 text-primary-700 hover:text-primary-500 dark:bg-theme-600/50 dark:text-theme-0'
              : 'inactive text-theme-600 dark:text-theme-0 hover:bg-theme-100/30 dark:hover:bg-theme-700/60' "
        >
          <div v-if="v.icon" class="text-[2em] shrink-0 opacity-80" :class="v.icon" />
          <div class="min-w-0 truncate overflow-ellipsis text-left">
            <div class="font-semibold">
              {{ v.name }}
            </div>
            <div class="text-sm text-theme-500 dark:text-theme-400">
              {{ v.desc }}
            </div>
          </div>
        </CardLink>
      </div>
    </div>
    <div class="grow overflow-scroll pb-32">
      <transition
        enter-active-class="ease-out duration-300"
        enter-from-class="opacity-0 translate-y-12"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="ease-in duration-300"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-12"
        mode="out-in"
      >
        <component
          :is="currentPanel?.tpl.value?.settings?.el"
          :id="currentPanel?.cardId"
          data-test-id="card-engine-component"
          :data-card-type="currentPanel?.templateId.value"
          :card="currentPanel"
        />
      </transition>
    </div>
  </div>
</template>
