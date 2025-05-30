<script setup lang="ts">
import type { NavListItem, StandardSize } from '@fiction/core'
import type { Site } from '@fiction/site'
import { normList, onResetUi, resetUi, useService, vue } from '@fiction/core'
import { twMerge } from 'tailwind-merge'
import TransitionSlide from '../anim/TransitionSlide.vue'
import XIcon from '../media/XIcon.vue'

const {
  items = [],
  placement = 'bottom',
  mode = 'hover',
  dropdownAlignment = 'start',
  uiSize = 'md',
  classes = {},
  site,
} = defineProps<{
  items?: NavListItem[]
  placement?: 'top' | 'bottom' | 'left' | 'right'
  dropdownAlignment?: 'start' | 'center' | 'end'
  mode?: 'hover' | 'click'
  uiSize?: StandardSize
  classes?: { wrapper?: string, width?: string, item?: string }
  site?: Site
}>()

const emit = defineEmits<{
  (event: 'update:model-value', value: string): void
}>()

const normalizedItems = vue.computed(() => normList(items))

const isClicked = vue.ref(false)
const isHovered = vue.ref(false)
const dropdownRef = vue.ref<HTMLDivElement | null>(null)
const service = useService()

const visibleItems = vue.computed(() => normalizedItems.value.filter(item => !item.isHidden))

function toggleClicked() {
  const wasOpen = isClicked.value
  resetUi({ scope: 'inputs', cause: 'dropdown', trigger: 'elementClick' })
  // Set to opposite of what it was before reset
  isClicked.value = !wasOpen
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
      window.open(item.href, item.target || '_self')?.focus()
    }
    else {
      const router = site?.siteRouter || service.fictionRouter
      await router.push(item.href, { caller: 'XDropDown' })
    }
  }
  else if (item.value) {
    emit('update:model-value', item.value as string)
  }
  isClicked.value = false
}

onResetUi(() => resetDropDown())

const menuClasses = vue.computed(() => {
  const baseClasses = `absolute z-30 bg-theme-100 dark:bg-theme-900 rounded-md ring-1 ring-theme-200 dark:ring-theme-600 focus:outline-none`
  const shadowClasses = 'shadow-[0_2px_8px_0_rgba(0,0,0,0.1)] dark:shadow-[0_2px_18px_0_rgba(0,0,0,1)]'
  const placementClasses = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2',
    right: 'left-full ml-2',
  }
  const dropdownAlignmentClasses = {
    start: 'left-0',
    center: 'left-1/2 transform -translate-x-1/2',
    end: 'right-0',
  }
  const widthClass = classes.width ? classes.width : 'w-48'
  return [widthClass, baseClasses, shadowClasses, placementClasses[placement], dropdownAlignmentClasses[dropdownAlignment]].join(' ')
})

defineExpose({ isClicked, isHovered, toggleClicked })

let timeoutId: ReturnType<typeof setTimeout> | null = null

function setActiveHover(hov: 'on' | 'off') {
  if (timeoutId)
    clearTimeout(timeoutId)

  if (hov === 'on') {
    // this prevents dropdowns hanging around when another dropdown is opened
    if (mode === 'hover') {
      resetUi({ scope: 'inputs', cause: 'dropdown', trigger: 'manualReset' })
    }
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
    'xxs': { text: 'text-[10px] py-1 gap-0.5' },
    'xs': { text: 'text-[11px] py-1 gap-1' },
    'sm': { text: 'text-xs py-1.5 gap-1' },
    'md': { text: 'text-sm py-1.5 gap-1.5' },
    'lg': { text: 'text-base py-1.5 gap-2' },
    'xl': { text: 'text-lg py-1.5 gap-2' },
    '2xl': { text: 'text-xl py-1.5 gap-3' },
  }

  return {
    text: twMerge(sizeClasses[uiSize].text, classes.item),
  }
})

const wrapperClass = vue.computed(() => {
  const baseClasses = 'relative'
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
      class="flex items-center"
      @click.prevent.stop="toggleClicked()"
    >
      <slot :is-active="isActive" />
    </div>

    <TransitionSlide>
      <div
        v-if="isActive && normalizedItems?.length"
        :class="menuClasses"
        role="menu"
        aria-orientation="vertical"
      >
        <slot name="top" />
        <div class="p-1 font-sans font-normal space-y-0.5" role="none">
          <template
            v-for="(item, index) in visibleItems"
            :key="index"
          >
            <a
              :href="item.href"
              class="flex gap-2 items-center cursor-pointer transition-all w-full text-left px-3 py-2 text-[1em] text-theme-700 dark:text-theme-200 rounded-lg"
              :class="[
                item.isActive ? 'bg-theme-200 dark:bg-theme-600/50 text-theme-900 dark:text-theme-100' : 'hover:bg-theme-200 dark:hover:bg-theme-600/50 hover:text-theme-900 dark:hover:text-theme-100',
                sizeClasses.text,
              ]"
              role="menuitem"
              :data-test-id="item.testId"
              @click.prevent="handleItemClick({ item, event: $event })"
            >
              <XIcon v-if="item.icon" class="size-[1.2em]" :media="item.icon" />
              <span class="text-[0.95em]">{{ item.label }}</span>
            </a>
          </template>
        </div>
      </div>
    </TransitionSlide>
  </div>
</template>
