<script lang="ts" setup>
import type { NavListItem } from '@fiction/core'
import { getNavComponentType, pathIsHref, vue } from '@fiction/core'
import ActionButtons from '../buttons/XButtonList.vue'
import ElIndexItemMedia from './ElIndexItemMedia.vue'

const { item, index = -1 } = defineProps<{ item: NavListItem, index: number }>()

const boxClass = 'dark:bg-theme-800/40 bg-theme-0 border border-theme-300/70 shadow-xs dark:border-theme-600/40 rounded-xl'
const hoverClass = 'hover:bg-theme-50 dark:hover:bg-theme-800/90 cursor-pointer'
const linkProps = vue.computed(() => {
  const { href } = item
  return pathIsHref(href) ? { href } : { to: href }
})
</script>

<template>
  <div
    :data-test-id="item.testId || `index-item-${index}`"
    class="@container"
  >
    <component
      :is="getNavComponentType(item)"
      v-bind="linkProps"
      class="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 py-5 px-6 sm:flex-nowrap"
      :class="[item.href ? hoverClass : '', boxClass]"
      @click.stop="item.onClick && item.onClick({ item, event: $event })"
    >
      <div class="@xl:flex gap-6 items-center space-y-4 @xl:space-y-0">
        <ElIndexItemMedia class="size-12 @xl:size-20" :media="item.media" :icon="item.icon" />
        <div>
          <div class="text-xl font-semibold leading-6">
            {{ item.label }}
          </div>
          <div class="mt-1 flex items-center gap-x-2 text-base leading-5 text-theme-500 dark:*:">
            {{ item.description }}
          </div>
        </div>
      </div>
      <dl class="flex w-full flex-none justify-between gap-x-8 sm:w-auto items-center">
        <slot :item="item" name="item" />

        <ActionButtons
          v-if="item.action?.buttons?.length"
          :buttons="item.action.buttons"
          ui-size="md"
          class="flex gap-3"
        />

        <svg v-else class="size-6 flex-none text-theme-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
        </svg>
      </dl>
    </component>
  </div>
</template>
