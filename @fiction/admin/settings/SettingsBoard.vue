<script setup lang="ts">
import type { ColorThemeUser, NavListItem, PostObject } from '@fiction/core'
import type { Card } from '@fiction/site/card'
import type { NavCardUserConfig } from '..'
import CardLink from '@fiction/cards/el/CardLink.vue'
import { toLabel, toSlug, vue } from '@fiction/core'
import ElSpinner from '@fiction/ui/loaders/ElSpinner.vue'
import XIcon from '@fiction/ui/media/XIcon.vue'
import { useWindowSize } from '@vueuse/core'
import ElHeader from './ElHeader.vue'

const {
  card,
  panels = [],
  basePath,
  panelProps = {},
  panelEvents = {},
  loading = false,
  header,
  theme,
} = defineProps<{
  card: Card
  panels?: Card<NavCardUserConfig>[]
  basePath?: string
  panelProps?: Record<string, any>
  panelEvents?: Record<string, (...args: any[]) => void>
  loading?: boolean
  header?: PostObject
  theme?: ColorThemeUser
}>()

const emit = defineEmits<{
  (event: 'update:header', payload: PostObject): void
}>()

const optionPanels = vue.computed(() => panels)
const routeItemId = vue.computed(() => toSlug(card.site?.siteRouter.params.value.itemId as string) || optionPanels.value[0].slug.value)
const currentPanel = vue.computed(() => optionPanels.value.find(p => toSlug(p.slug.value) === routeItemId.value) || optionPanels.value[0])
const parentPanel = vue.computed(() => optionPanels.value.find(p => toSlug(p.slug.value) === currentPanel.value?.userConfig.value?.parentItemId))

const currentPanelKey = vue.computed(() => {
  const itemId = card.site?.siteRouter.query.value.itemId as string | undefined
  return `${currentPanel.value?.cardId}-${itemId || ''}`
})

const viewId = vue.computed(() => {
  return card.site?.siteRouter.current.value?.params.viewId || ''
})

const currentItemId = vue.computed(() => {
  return (card.site?.siteRouter.current.value?.params.itemId as string | undefined) || ''
})

const nav = vue.computed<NavListItem[]>(() => {
  const query = card.site?.siteRouter.current.value?.fullPath.split('?')[1] || ''

  return optionPanels.value
    .filter(p => p.userConfig.value?.isNavItem)
    .map((p) => {
      const isHome = p.isHome.value
      const slug = isHome ? '' : p.slug.value
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
        key: p.slug.value,
        icon: {
          class: isActive && cfg.navIconAlt ? cfg.navIconAlt : cfg.navIcon || 'i-heroicons-arrow-small-right-20-solid',
        },
      }
    })
})

function getNavItemClass(item: NavListItem, index: number) {
  return item.isActive
    ? 'bg-theme-100/50 text-theme-700 dark:bg-theme-800 dark:text-theme-50 ring-1 ring-theme-300 dark:ring-theme-600'
    : index === 0 && !currentItemId.value
      ? 'lg:bg-primary-50 lg:text-primary-700 lg:dark:bg-theme-800 lg:dark:text-theme-50 ring-1 ring-theme-100 dark:ring-theme-700/90 lg:ring-1 lg:ring-primary-600/50 lg:dark:ring-theme-600'
      : 'text-theme-600 dark:text-theme-200  hover:bg-theme-100/30 dark:hover:bg-theme-700/60 ring-1 ring-theme-100 dark:ring-theme-700/70'
}

const transitionDirection = vue.ref<'left' | 'right'>('right')
vue.watch(
  () => currentItemId.value,
  (newId, oldId) => {
    // If going from no ID to ID, slide left, otherwise right
    transitionDirection.value = !oldId && newId ? 'left' : 'right'
  },
)

const { width } = useWindowSize()

const isDesktop = vue.computed(() => width.value >= 1024)

function getItemPanelProps(panel?: Card<NavCardUserConfig>, opts: { isParent?: boolean } = {}) {
  return {
    'is': panel?.tpl.value?.settings?.el,
    'id': panel?.cardId,
    'is-parent': opts.isParent,
    'data-test-id': 'card-engine-component',
    'data-card-type': panel?.templateId.value,
    'card': panel,
    ...panelProps,
    'v-on': panelEvents,
  } as const
}

const itemPanelProps = vue.computed(() => {
  return getItemPanelProps(currentPanel.value)
})

const parentPanelProps = vue.computed(() => {
  return getItemPanelProps(parentPanel.value, { isParent: true })
})
</script>

<template>
  <div class="lg:flex lg:h-[calc(100dvh)] overflow-clip">
    <div v-if="loading" class="p-12 flex justify-center items-center w-full text-theme-400 dark:text-theme-700 h-full">
      <ElSpinner class="size-8" />
    </div>
    <template v-else>
      <div
        class="lg:w-[29%] shrink-0 rounded-l-md md:border-r dark:border-theme-600/60 border-theme-300/60 relative overflow-x-clip"
      >
        <transition :name="transitionDirection" mode="out-in">
          <div v-if="!currentItemId || (isDesktop && !parentPanel)" class="space-y-6 p-4">
            <div class="space-y-3">
              <ElHeader
                v-if="header"
                class="bg-theme-50 dark:bg-theme-800/50 rounded-xl p-4 md:p-6"
                :model-value="header"
                :theme="theme || 'primary'"
                @update:model-value="emit('update:header', $event)"
              />
            </div>
            <div class="space-y-3 text-right pb-32 md:p-4">
              <CardLink
                v-for="(v, i) in nav"
                :key="i"
                :card
                class="flex items-center gap-3 xl:gap-4 p-2.5 xl:p-3 rounded-lg transition-all duration-100"
                :href="v.href"
                :class="getNavItemClass(v, i)"
                :data-test-id="`nav-item-${v.key}`"
              >
                <XIcon
                  v-if="v.icon"
                  class="text-[1.7em] shrink-0 "
                  :media="v.icon || {}"
                />
                <div class="min-w-0 truncate overflow-ellipsis text-left">
                  <div class="font-semibold truncate">
                    {{ v.label }}
                  </div>
                </div>
              </CardLink>
            </div>
          </div>
          <div v-else-if="parentPanel && isDesktop" :key="parentPanel.cardId" class="grow lg:overflow-scroll pb-32">
            <component :is="parentPanelProps.is" v-bind="parentPanelProps" />
          </div>
          <div v-else :key="currentItemId || 'default'" class="grow lg:overflow-scroll pb-32">
            <component :is="itemPanelProps.is" v-bind="itemPanelProps" />
          </div>
        </transition>
      </div>
      <div
        v-if="currentPanel && isDesktop"

        class="grow lg:overflow-scroll pb-32"
      >
        <transition name="fade" mode="out-in">
          <component :is="itemPanelProps.is" v-bind="itemPanelProps" :key="currentPanelKey" />
        </transition>
      </div>
    </template>
  </div>
</template>

<style lang="less">
// Fade transition for desktop
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s cubic-bezier(0.25,1,0.33,1);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

// Left/Right slide transitions for mobile
.left-enter-active,
.left-leave-active,
.right-enter-active,
.right-leave-active {
  transition: transform 0.2s cubic-bezier(0.25,1,0.33,1);
  position: absolute;
  width: 100%;
  top: 0;
}

// Initial states
.left-enter-from {
  transform: translateX(100%);
}
.left-leave-from {
  transform: translateX(0);
}
.left-leave-to {
  transform: translateX(-100%);
}

.right-enter-from {
  transform: translateX(-100%);
}
.right-leave-from {
  transform: translateX(0);
}
.right-leave-to {
  transform: translateX(100%);
}
</style>
