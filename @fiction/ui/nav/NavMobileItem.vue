<script lang="ts" setup>
import type { NavListItem } from '@fiction/core'
import { getNavComponentType, vue } from '@fiction/core'
import TransitionSlide from './anim/TransitionSlide.vue'
import XIcon from './media/XIcon.vue'

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

function getItemClass(depth = 0) {
  const baseClass = 'x-action-item font-sans pr-4 relative group flex gap-x-2 items-center justify-between'
  const depthClass = {
    0: 'text-xl font-normal',
    1: 'text-xl font-normal text-theme-600 dark:text-theme-300 pl-4 py-1',
    2: 'text-base font-normal pl-8 py-1',
  }[depth]

  return `${baseClass} ${depthClass}`
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
      :class="getItemClass(depth)"
      :data-is-active="item.isActive"
      :data-depth="depth"
    >
      <span class="relative group flex gap-x-2 items-center justify-between w-full">
        <span v-if="item.isActive" class="absolute -left-4 w-1.5 h-1.5 rounded-full bg-primary-500/60" />
        <component
          :is="getNavComponentType(item)"
          class="grow flex gap-2 items-center hover:text-primary-500 dark:hover:text-primary-400 duration-200 cursor-pointer"
          v-bind="linkProps"
          @click="handleClick"
        >
          <XIcon v-if="item.icon" :media="item.icon" />
          <span v-html="item.label" />
        </component>
        <div
          v-if="(item.list?.items && hasDropDown)"
          class="bg-theme-50 dark:bg-theme-700/30 dark:hover:bg-theme-700/60 flex items-center p-2 rounded-full cursor-pointer"
          @click.stop="isOpen = !isOpen"
        >
          <span
            class="text-lg transition-all bg-primary-500 dark:bg-primary-400 rounded-full"
            :class="[
              hasDropDown && isOpen ? 'rotate-180' : '',
              item.href?.includes('http')
                ? 'i-tabler-arrow-up-right text-primary-400/50 dark:text-primary-500/50'
                : item.list?.items && hasDropDown
                  ? 'i-tabler-chevron-down'
                  : '',
            ]"
          />
        </div>
      </span>
    </div>

    <TransitionSlide>
      <div
        v-if="item.list?.items"
        v-show="isOpen || !hasDropDown"
      >
        <div :class="depth <= 0 ? 'py-4' : 'pb-3'">
          <div v-for="(subItem, index) in item.list?.items" :key="index">
            <NavMobileItem
              :item="subItem"
              :depth="(depth || 0) + 1"
              :is-expanded="isOpen"
            />
          </div>
        </div>
      </div>
    </TransitionSlide>
  </div>
</template>
