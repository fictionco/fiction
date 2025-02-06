<script setup lang="ts">
import type { NavItem, NavListItem } from '@fiction/core'
import { onResetUi, resetUi, useService, vue } from '@fiction/core'

const { items = [], placement = 'bottom', widthClass = 'w-48' } = defineProps<{
  items: NavItem[]
  placement?: 'top' | 'bottom' | 'left' | 'right'
  widthClass?: string
}>()

const isOpen = vue.ref(false)
const dropdownRef = vue.ref<HTMLDivElement | null>(null)
const service = useService()

const visibleItems = vue.computed(() => items.filter(item => !item.isHidden))

function toggleDropdown() {
  resetUi({ scope: 'inputs', cause: 'dropdown', trigger: 'elementClick' })
  isOpen.value = !isOpen.value
}

async function handleItemClick(args: { item: NavItem, event: MouseEvent }) {
  const { item } = args
  if (item.onClick) {
    item.onClick(args)
  }
  else if (item.href) {
    if (item.href.includes('http')) {
      window.open(item.href, '_blank')
    }
    else {
      await service.fictionRouter.push(item.href, { caller: 'XDropDown' })
    }
  }
  isOpen.value = false
}

onResetUi(() => {
  isOpen.value = false
})

const menuClasses = vue.computed(() => {
  const baseClasses = `absolute z-30 bg-theme-100 dark:bg-theme-800 rounded-md shadow-lg ring-1 ring-theme-200 dark:ring-theme-600 focus:outline-none ${widthClass}`
  const placementClasses = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2',
    right: 'left-full ml-2',
  }
  return `${baseClasses} ${placementClasses[placement]}`
})

defineExpose({ isOpen, toggleDropdown })

let timeoutId: ReturnType<typeof setTimeout> | null = null

function setActiveHover(mode: 'on' | 'off') {
  if (timeoutId)
    clearTimeout(timeoutId)

  if (mode === 'on') {
    isOpen.value = true
  }
  else {
    timeoutId = setTimeout(() => {
      isOpen.value = false
    }, 350)
  }
}
</script>

<template>
  <div
    ref="dropdownRef"
    class="relative inline-block text-left"
    @mouseover="setActiveHover('on')"
    @mouseleave="setActiveHover('off')"
  >
    <slot :toggle="toggleDropdown" :is-open="isOpen" />

    <div v-if="isOpen && items?.length" :class="menuClasses" role="menu" aria-orientation="vertical">
      <div class="py-1" role="none">
        <template v-for="(item, index) in visibleItems" :key="index">
          <a
            :href="item.href"
            class="block cursor-pointer w-full text-left px-3 py-2 text-xs text-theme-700 dark:text-theme-200 hover:bg-theme-200 dark:hover:bg-theme-700/70 hover:text-theme-900 dark:hover:text-theme-100"
            :class="[
              item.isActive ? 'bg-theme-200 dark:bg-theme-600/70 text-theme-900 dark:text-theme-100' : '',
              item.class,
            ]"
            role="menuitem"
            :data-test-id="item.testId"
            @click.prevent="handleItemClick({ item, event: $event })"
          >
            {{ item.label }}
          </a>
        </template>
      </div>
    </div>
  </div>
</template>
