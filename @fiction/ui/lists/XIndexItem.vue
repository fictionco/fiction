<script lang="ts" setup>
import type { ColorThemeUser, NavListItem } from '@fiction/core'
import { getNavComponentType, pathIsHref, vue } from '@fiction/core'
import XButton from '../buttons/XButton.vue'
import XDropDown from '../common/XDropDown.vue'
import ElIndexItemMedia from './ElIndexItemMedia.vue'

defineOptions({ name: 'XIndexItem' })

const {
  item,
  index = -1,
  theme,
  isActive = false,
  dropdownItems = [],
  isLast = false,
} = defineProps<{
  item: NavListItem
  index?: number
  theme?: ColorThemeUser
  isActive?: boolean
  dropdownItems?: NavListItem[]
  isLast?: boolean
}>()

const linkProps = vue.computed(() => {
  const { href } = item
  return pathIsHref(href) ? { href } : { to: href }
})

const hasDropdown = vue.computed(() => dropdownItems.length > 0)

// Extract meta information from nested items
const metaItems = vue.computed(() => {
  return item.list?.items || []
})
</script>

<template>
  <div
    :data-test-id="item.testId || `index-item-${index}`"
    class="group relative @container/index-item"
  >
    <component
      :is="getNavComponentType(item)"
      v-bind="linkProps"
      class="flex items-center justify-between p-4 border-t border-theme-200/60 dark:border-theme-700/80 hover:bg-theme-25 dark:hover:bg-theme-800/30 transition-colors duration-150"
      :class="{
        'bg-theme-25 dark:bg-theme-800 border-theme-200 dark:border-theme-700': isActive,
        'cursor-pointer': item.href || item.onClick,
        'border-b': isLast,
      }"
      @click.stop="item.onClick && item.onClick({ item, event: $event })"
    >
      <!-- Main content area -->
      <div class="flex items-center min-w-0 flex-1 gap-4 @[500px]:gap-12">
        <!-- Primary content -->
        <div class="min-w-0 flex-1 flex flex-col gap-2">
          <div class="flex flex-col gap-1">
            <div class="flex items-baseline gap-3">
              <h3 class="text-base font-medium text-theme-900 dark:text-theme-100 truncate">
                {{ item.label }}
              </h3>
              <div v-if="item.badge" class="flex-shrink-0">
                <span
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                  :class="{
                    'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400': item.badge.color === 'emerald',
                    'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400': item.badge.color === 'blue',
                    'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400': item.badge.color === 'amber',
                    'bg-theme-100 text-theme-800 dark:bg-theme-800 dark:text-theme-300': !item.badge.color,
                  }"
                >
                  {{ item.badge.content }}
                </span>
              </div>
              <!-- Dropdown menu -->
              <div>
                <XDropDown
                  v-if="true"
                  mode="click"
                  :items="dropdownItems"
                  dropdown-alignment="end"
                  placement="bottom"
                  @click.stop
                >
                  <XButton
                    theme="default"
                    size="sm"
                    design="ghost"
                    icon="i-tabler-dots"
                    class="opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </XDropDown>
              </div>
            </div>

            <p v-if="item.description" class="text-sm text-theme-600 dark:text-theme-400 line-clamp-1">
              {{ item.description }}
            </p>
          </div>
          <!-- Meta information grid -->
          <div v-if="metaItems.length" class="flex flex-wrap gap-4 text-xs text-theme-500 dark:text-theme-500">
            <div
              v-for="meta in metaItems"
              :key="meta.key"
              class="flex items-center gap-1.5"
            >
              <span v-if="meta.icon" class="flex-shrink-0">
                <i :class="meta.icon.class || meta.icon.iconId" class="text-theme-400" />
              </span>
              <span class="font-medium">{{ meta.label }}:</span>
              <span>{{ meta.value || meta.description }}</span>
            </div>
          </div>
        </div>

        <!-- Right side: Media and actions -->
        <div class="flex items-center gap-3 flex-shrink-0">
          <!-- Media display -->
          <ElIndexItemMedia
            v-if="item.media || item.icon"
            class="size-10 @[500px]/index-item:size-14"
            :media="item.media"
            :icon="item.icon"
            :theme="theme"
          />

          <!-- Action buttons from nested action area -->
          <div v-if="item.action?.buttons?.length" class="flex items-center gap-2">
            <XButton
              v-for="(button, i) in item.action.buttons"
              :key="i"
              :theme="button.theme || 'default'"
              :design="button.design || 'ghost'"
              :size="button.size || 'sm'"
              :icon="button.icon"
              :href="button.href"
              :rounding="button.rounding || 'md'"
              @click.stop="button.onClick ? button.onClick({ event: $event, item: button }) : null"
            >
              {{ button.label }}
            </XButton>
          </div>

          <!-- Default chevron for navigable items -->
          <div
            v-if="item.href || item.onClick"
            class="flex items-center text-theme-400 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <i class="i-tabler-chevron-right text-sm" />
          </div>
        </div>
      </div>
    </component>
  </div>
</template>
