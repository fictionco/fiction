<script lang="ts" setup>
import type { ColorThemeUser, NavListItem, StandardSize } from '@fiction/core'
import { getNavComponentType, pathIsHref, vue } from '@fiction/core'
import ActionButtons from '../buttons/XButtonList.vue'
import ElIndexItemMedia from './ElIndexItemMedia.vue'

defineOptions({ name: 'ElIndexItem' })

const { item, index = -1, theme, uiSize = 'md', isActive = false } = defineProps<{ item: NavListItem, index: number, theme?: ColorThemeUser, isActive?: boolean, uiSize?: StandardSize }>()

const classes = vue.computed(() => {
  const sizes = {
    'xxs': {
      padding: 'p-2 md:p-3',
      gap: 'gap-2 md:gap-3',
      mediaSize: 'size-5 lg:size-6',
      titleSize: 'text-xs',
      descSize: 'text-[10px]',
    },
    'xs': {
      padding: 'p-2 md:p-4',
      gap: 'gap-3 md:gap-4',
      mediaSize: 'size-6 lg:size-8',
      titleSize: 'text-sm',
      descSize: 'text-xs',
    },
    'sm': {
      padding: 'p-3 md:p-5',
      gap: 'gap-3 md:gap-5',
      mediaSize: 'size-10 lg:size-12',
      titleSize: 'text-base',
      descSize: 'text-sm',
    },
    'md': {
      padding: 'p-4 md:p-6',
      gap: 'gap-4 md:gap-6',
      mediaSize: 'size-12 lg:size-16',
      titleSize: 'text-lg',
      descSize: 'text-md',
    },
    'lg': {
      padding: 'p-5 md:p-7',
      gap: 'gap-5 md:gap-7',
      mediaSize: 'size-12 lg:size-20',
      titleSize: 'text-xl',
      descSize: 'text-lg',
    },
    'xl': {
      padding: 'p-6 md:p-8',
      gap: 'gap-6 md:gap-8',
      mediaSize: 'size-14 lg:size-24',
      titleSize: 'text-2xl',
      descSize: 'text-xl',
    },
    '2xl': {
      padding: 'p-8 md:p-10',
      gap: 'gap-8 md:gap-10',
      mediaSize: 'size-16 lg:size-26',
      titleSize: 'text-3xl',
      descSize: 'text-2xl',
    },
  }

  return sizes[uiSize || 'md']
})

const boxClass = 'dark:bg-theme-800/40 bg-theme-0 border border-theme-300/70 shadow-xs dark:border-theme-600/40 rounded-xl'
const hoverClass = 'hover:bg-theme-50 dark:hover:bg-theme-800/90 cursor-pointer'
const activeClass = vue.computed(() => isActive ? 'ring-2 ring-primary-500/20 dark:ring-primary-600/40' : '')

const linkProps = vue.computed(() => {
  const { href } = item
  return pathIsHref(href) ? { href } : { to: href }
})
</script>

<template>
  <div
    :data-test-id="item.testId || `index-item-${index}`"
    class=""
  >
    <component
      :is="getNavComponentType(item)"
      v-bind="linkProps"
      class="flex flex-wrap items-center justify-between sm:flex-nowrap transition-all duration-200"
      :class="[
        item.href ? hoverClass : '',
        boxClass,
        activeClass,
        classes.padding,
      ]"
      @click.stop="item.onClick && item.onClick({ item, event: $event })"
    >
      <div class="flex items-center space-y-0" :class="classes.gap">
        <ElIndexItemMedia
          :class="classes.mediaSize"
          :media="item.media"
          :icon="item.icon"
          :theme="theme"
        />
        <div class="space-y-1">
          <div class="font-bold leading-6" :class="classes.titleSize">
            {{ item.label }}
          </div>
          <div class="flex items-center gap-x-2 text-theme-500 dark:text-theme-400" :class="classes.descSize">
            {{ item.description }}
          </div>
        </div>
      </div>
      <dl
        class="w-full flex-none justify-between gap-x-8 sm:w-auto items-center hidden md:flex"
      >
        <slot :item="item" name="item" />

        <ActionButtons
          v-if="item.action?.buttons?.length"
          :buttons="item.action.buttons"
          :ui-size="uiSize"
          class="flex gap-3"
        />

        <svg v-else-if="item.onClick || item.href" class="inline-block size-6 flex-none text-theme-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
        </svg>
      </dl>
    </component>
  </div>
</template>
