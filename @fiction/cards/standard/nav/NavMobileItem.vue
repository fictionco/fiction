<script lang="ts" setup>
import type { NavListItem } from '@fiction/core'
import { getNavComponentType, vue } from '@fiction/core'
import XIcon from '@fiction/ui/media/XIcon.vue'

const { item, depth = 0 } = defineProps<{
  item: NavListItem
  depth?: number
  isExpanded?: boolean
}>()

const isOpen = vue.ref(item.list?.items && item.list?.items.some(i => i.isActive))
const hasDropDown = vue.computed(() =>
  depth > 0 && item.list?.items?.length,
)

function handleClick(event: MouseEvent) {
  if (item.list?.items && hasDropDown.value) {
    event.preventDefault()
    isOpen.value = !isOpen.value
  }
  item.onClick?.({ event })
}

const componentType = vue.computed(() => getNavComponentType(item))

const linkProps = vue.computed(() => {
  return componentType.value === 'RouterLink' ? { to: item.href } : { href: item.href }
})
</script>

<template>
  <div>
    <div
      role="menuitem"
      class="x-action-item font-sans relative group flex gap-x-2 items-center justify-between "
      :data-is-active="item.isActive"
      :data-depth="depth"
    >
      <span class="relative group flex gap-x-2 items-center justify-between w-full">
        <component
          :is="getNavComponentType(item)"
          class="grow flex justify-between gap-3 items-center  duration-200 cursor-pointer text-2xl py-1"
          v-bind="linkProps"
          :class="item.isActive ? 'text-theme-900 dark:text-theme-0 font-semibold' : 'text-theme-500 dark:text-theme-400 font-normal hover:text-primary-500 dark:hover:text-primary-400'"
          @click="handleClick"
        >
          <span v-html="item.label" />
          <XIcon
            v-if="item.icon"
            class="size-[1em] text-theme-500"
            :class="item.isActive ? 'text-theme-900 dark:text-theme-0' : 'text-theme-400 dark:text-theme-700'"
            :media="item.icon"
          />
        </component>
      </span>
    </div>
  </div>
</template>
