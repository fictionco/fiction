<script setup lang="ts">
import type { ActionButton, ColorThemeUser, NavListItem, PostObject } from '@fiction/core'
import type { Card } from '@fiction/site/card'
import type { NavCardUserConfig } from '..'
import CardButtons from '@fiction/cards/el/CardButtons.vue'
import CardLink from '@fiction/cards/el/CardLink.vue'
import { toLabel, toSlug, vue } from '@fiction/core'
import ElSpinner from '@fiction/ui/loaders/ElSpinner.vue'
import XIcon from '@fiction/ui/media/XIcon.vue'
import ElHeader from './ElHeader.vue'

const {
  card,
  basePath,
  panelProps = {},
  panelEvents = {},
  loading = false,
  header,
  colorTheme,
} = defineProps<{
  card: Card
  basePath?: string
  panelProps?: Record<string, any>
  panelEvents?: Record<string, (...args: any[]) => void>
  loading?: boolean
  header?: PostObject
  colorTheme?: ColorThemeUser
}>()

const emit = defineEmits<{
  (event: 'update:header', payload: PostObject): void
}>()

const panels = vue.computed(() => card.cards.value.filter(t => t.slug.value) as Card<NavCardUserConfig>[])

const routeItemId = vue.computed(() => toSlug(card.site?.siteRouter.params.value.itemId as string) || panels.value[0].slug.value)

const currentPanel = vue.computed(() => panels.value.find(p => toSlug(p.slug.value) === routeItemId.value) || panels.value[0])

const viewId = vue.computed(() => {
  return card.site?.siteRouter.current.value?.params.viewId || ''
})

const currentItemId = vue.computed(() => {
  return card.site?.siteRouter.current.value?.params.itemId || ''
})

const nav = vue.computed<NavListItem[]>(() => {
  const query = card.site?.siteRouter.current.value?.fullPath.split('?')[1] || ''

  return panels.value
    .filter(p => p.userConfig.value?.isNavItem)
    .map((p) => {
      const slug = p.slug.value === '_home' ? '' : p.slug.value
      const cfg = p.userConfig.value || {}
      const itemId = currentItemId.value || ''
      const isActive = slug === itemId || slug === currentPanel.value?.userConfig.value?.parentItemId
      const base = basePath || `/${viewId.value}`
      const href = `${base}/${slug}${query ? `?${query}` : ''}`

      return {
        label: p.title.value || toLabel(slug),
        description: p.description.value,
        href,
        isActive,
        icon: {
          class: isActive && cfg.navIconAlt ? cfg.navIconAlt : cfg.navIcon || 'i-heroicons-arrow-small-right-20-solid',
        },
      }
    })
})
</script>

<template>
  <div class="lg:flex h-[calc(100dvh-61px)]">
    <div
      :class="currentItemId ? 'hidden lg:block' : ''"
      class="lg:w-[32%] shrink-0 rounded-l-md p-3  md:p-6 md:border-r dark:border-theme-600/60 border-theme-300/60 space-y-6"
    >
      <div class="space-y-3">
        <ElHeader
          v-if="header"
          class="bg-theme-50/20 dark:bg-theme-800 rounded-xl p-4"
          :model-value="header"
          :color-theme="colorTheme || 'primary'"
          @update:model-value="emit('update:header', $event)"
        />
      </div>
      <div class="space-y-3 text-right pb-32">
        <CardLink
          v-for="(v, i) in nav"
          :key="i"
          :card
          class="flex items-center gap-3 xl:gap-5 px-3 py-2.5 xl:px-5 xl:py-3 text-xs sm:text-base rounded-lg transition-all duration-100"
          :href="v.href"
          :class="
            v.isActive
              ? 'active bg-primary-100/50 text-theme-700 dark:bg-theme-700/70 dark:text-theme-0'
              : 'inactive text-theme-600 dark:text-theme-0 hover:bg-theme-100/30 dark:hover:bg-theme-700/60' "
        >
          <XIcon
            v-if="v.icon"
            class="text-[1.3em] xl:text-[1.75em] shrink-0 text-theme-500 dark:text-theme-50"
            :media="v.icon"
          />
          <div class="min-w-0 truncate overflow-ellipsis text-left">
            <div class="font-semibold truncate">
              {{ v.label }}
            </div>
            <div class="text-theme-500 dark:text-theme-400 truncate text-sm">
              {{ v.description }}
            </div>
          </div>
        </CardLink>
      </div>
    </div>
    <div class="grow overflow-scroll pb-32" :class="currentItemId ? '' : 'hidden lg:block'">
      <transition
        enter-active-class="ease-out duration-300"
        enter-from-class="opacity-0 translate-y-12"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="ease-in duration-300"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-12"
        mode="out-in"
      >
        <div v-if="currentPanel" :key="currentPanel?.cardId">
          <!-- <div class="font-semibold text-lg p-4 border-b border-theme-300 dark:border-theme-700/70">
            {{ currentPanel.title.value }}
          </div> -->

          <div v-if="loading" class="p-12 flex justify-center">
            <ElSpinner class="size-8" />
          </div>
          <component
            :is="currentPanel?.tpl.value?.settings?.el"
            v-else
            :id="currentPanel?.cardId"
            data-test-id="card-engine-component"
            :data-card-type="currentPanel?.templateId.value"
            :card="currentPanel"
            v-bind="panelProps"
            v-on="panelEvents"
          />
        </div>
      </transition>
    </div>
  </div>
</template>
