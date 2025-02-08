<script setup lang="ts">
import type { NavListItem, StandardSize } from '@fiction/core'
import { onResetUi, resetUi, useService, vue } from '@fiction/core'
import { twMerge } from 'tailwind-merge'
import TransitionSlide from '../anim/TransitionSlide.vue'

const {
  items = [],
  placement = 'bottom',
  mode = 'hover',
  dropdownAlignment = 'start',
  uiSize = 'md',
  classes = {},
} = defineProps<{
  items: NavListItem[]
  placement?: 'top' | 'bottom' | 'left' | 'right'
  dropdownAlignment?: 'start' | 'center' | 'end'
  mode?: 'hover' | 'click'
  uiSize?: StandardSize
  classes?: { wrapper?: string, width?: string }
}>()

const emit = defineEmits<{
  (event: 'update:model-value', value: string): void
}>()

const isClicked = vue.ref(false)
const isHovered = vue.ref(false)
const dropdownRef = vue.ref<HTMLDivElement | null>(null)
const service = useService()

const visibleItems = vue.computed(() => items.filter(item => !item.isHidden))

function toggleClicked() {
  resetUi({ scope: 'inputs', cause: 'dropdown', trigger: 'elementClick' })
  isClicked.value = !isClicked.value
}

function resetDropDown() {
  isClicked.value = false
  isHovered.value = false
}

async function handleItemClick(args: { item: NavListItem, event: MouseEvent }) {
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
  else if (item.value) {
    emit('update:model-value', item.value as string)
  }
  isClicked.value = false
}

onResetUi(() => resetDropDown())

const menuClasses = vue.computed(() => {
  const baseClasses = `absolute z-30 bg-theme-100 dark:bg-theme-800 rounded-md shadow-lg ring-1 ring-theme-200 dark:ring-theme-600 focus:outline-none`
  const placementClasses = {
    top: 'bottom-full mb-1.5',
    bottom: 'top-full mt-1.5',
    left: 'right-full mr-1.5',
    right: 'left-full ml-1.5',
  }
  const dropdownAlignmentClasses = {
    start: 'left-0',
    center: 'left-1/2 transform -translate-x-1/2',
    end: 'right-0',
  }
  const widthClass = classes.width ? classes.width : 'w-48'
  return [widthClass, baseClasses, placementClasses[placement], dropdownAlignmentClasses[dropdownAlignment]].join(' ')
})

defineExpose({ isClicked, isHovered, toggleClicked })

let timeoutId: ReturnType<typeof setTimeout> | null = null

function setActiveHover(mode: 'on' | 'off') {
  if (timeoutId)
    clearTimeout(timeoutId)

  if (mode === 'on') {
    isHovered.value = true
  }
  else {
    timeoutId = setTimeout(() => {
      isHovered.value = false
    }, 350)
  }
}

const isActive = vue.computed({
  get: () => mode === 'click' ? isClicked.value : isHovered.value,
  set: v => mode === 'click' ? (isClicked.value = v) : (isHovered.value = v),
})

const sizeClasses = vue.computed(() => {
  const sizeClasses = {
    'xxs': { text: 'text-[10px] py-1' },
    'xs': { text: 'text-[11px] py-1' },
    'sm': { text: 'text-xs py-1.5' },
    'md': { text: 'text-sm py-1.5' },
    'lg': { text: 'text-base py-1.5' },
    'xl': { text: 'text-lg py-1.5' },
    '2xl': { text: 'text-xl py-1.5' },
  }

  return {
    text: sizeClasses[uiSize].text,
  }
})

const wrapperClass = vue.computed(() => {
  const baseClasses = 'relative inline-block text-left'
  return twMerge(baseClasses, classes.wrapper)
})
</script>

<template>
  <div
    ref="dropdownRef"
    :class="wrapperClass"
    @mouseover="setActiveHover('on')"
    @mouseleave="setActiveHover('off')"
  >
    <div
      role="button"
      aria-haspopup="true"
      :aria-expanded="isActive"
      @click.prevent.stop="toggleClicked()"
    >
      <slot :is-active="isActive" />
    </div>

    <TransitionSlide>
      <div
        v-if="isActive && items?.length"
        :class="menuClasses"
        role="menu"
        aria-orientation="vertical"
      >
        <div class="py-1 font-sans font-medium" role="none">
          <template
            v-for="(item, index) in visibleItems"
            :key="index"
          >
            <a
              :href="item.href"
              class="block cursor-pointer transition-all w-full text-left px-3 text-theme-700 dark:text-theme-200 hover:bg-theme-200 dark:hover:bg-theme-700/70 hover:text-theme-900 dark:hover:text-theme-100"
              :class="[
                item.isActive ? 'bg-theme-200 dark:bg-theme-600/70 text-theme-900 dark:text-theme-100' : '',
                sizeClasses.text,
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
    </TransitionSlide>
  </div>
</template>
