<script setup lang="ts">
import type { NavItem, PostObject } from '@fiction/core'
import type { Card } from '@fiction/site/card'
import type { NavCardUserConfig } from '..'
import CardLink from '@fiction/cards/el/CardLink.vue'
import { toLabel, toSlug, vue } from '@fiction/core'
import ElSpinner from '@fiction/ui/loaders/ElSpinner.vue'
import ElHeader from './ElHeader.vue'

const {
  card,
  basePath,
  panelProps = {},
  loading = false,
  header,
} = defineProps<{
  card: Card
  basePath: string
  panelProps?: Record<string, any>
  loading?: boolean
  header?: PostObject
}>()

const emit = defineEmits<{
  (event: 'update:header', payload: PostObject): void
}>()

const panels = vue.computed(() => card.cards.value.filter(t => t.slug.value) as Card<NavCardUserConfig>[])

const routeItemId = vue.computed(() => toSlug(card.site?.siteRouter.params.value.itemId as string) || panels.value[0].slug.value)

const currentPanel = vue.computed(() => panels.value.find(p => toSlug(p.slug.value) === routeItemId.value))

const nav = vue.computed<NavItem[]>(() => {
  const router = card.site?.siteRouter.current.value
  const currentRoute = card.site?.siteRouter.current.value
  const query = currentRoute?.fullPath.split('?')[1] || ''

  return panels.value
    .filter(p => p.userConfig.value?.isNavItem)
    .map((p) => {
      const slug = p.slug.value === '_home' ? '' : p.slug.value
      const cfg = p.userConfig.value || {}
      const itemId = router?.params.itemId || ''
      const isActive = slug === itemId || slug === currentPanel.value?.userConfig.value?.parentItemId

      return {
        name: p.title.value || toLabel(slug),
        desc: p.description.value,
        href: `${basePath}/${slug}${query ? `?${query}` : ''}`,
        isActive,
        icon: isActive && cfg.navIconAlt ? cfg.navIconAlt : cfg.navIcon || 'i-heroicons-arrow-small-right-20-solid',
      }
    })
})
</script>

<template>
  <div class="flex h-[calc(100dvh-61px)]">
    <div class="w-[32%] shrink-0 rounded-l-md pb-32 p-3 md:p-6 border-r dark:border-theme-600/60 border-theme-300/60 space-y-6">
      <ElHeader
        v-if="header"
        class="dark:bg-theme-700/50 rounded-xl p-6"
        :model-value="header"
        @update:model-value="emit('update:header', $event)"
      />
      <div class="space-y-2 text-right">
        <CardLink
          v-for="(v, i) in nav"
          :key="i"
          :card
          class="flex items-center gap-4 px-3 py-2.5 xl:px-5 xl:py-3 text-xs sm:text-base rounded-lg transition-all duration-100"
          :href="v.href"
          :class="
            v.isActive
              ? 'active bg-primary-100/50 text-primary-700 hover:text-primary-500 dark:bg-theme-700/70 dark:text-theme-0'
              : 'inactive text-theme-600 dark:text-theme-0 hover:bg-theme-100/30 dark:hover:bg-theme-700/60' "
        >
          <div v-if="v.icon" class="text-[1.5em] xl:text-[2em]  shrink-0 text-theme-500 dark:text-theme-50" :class="v.icon" />
          <div class="min-w-0 truncate overflow-ellipsis text-left">
            <div class="font-semibold truncate">
              {{ v.name }}
            </div>
            <div class="text-theme-500 dark:text-theme-400 truncate">
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
          />
        </div>
      </transition>
    </div>
  </div>
</template>
