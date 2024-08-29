<script lang="ts" setup>
import { onResetUi, vue } from '@fiction/core'

type Direction = 'right' | 'bottom' | 'top'

const props = defineProps({
  content: { type: String, default: '' },
  delay: { type: Number, default: 100 },
  disabled: { type: Boolean, default: false },
  timeout: { type: Number, default: 3000 },
  maxWidth: { type: Number, default: 200 },
  direction: { type: String as vue.PropType<Direction>, default: 'right' },
})

const triggerRef = vue.ref<HTMLElement | null>(null)
const tooltipRef = vue.ref<HTMLElement | null>(null)
const showTooltip = vue.ref(false)
const hoverIntentTimer = vue.ref<NodeJS.Timeout | null>(null)
const hideTooltipTimer = vue.ref<NodeJS.Timeout | null>(null)

const tooltipStyle = vue.reactive({
  left: '0px',
  top: '0px',
  maxWidth: `${props.maxWidth}px`,
})

const tooltipContent = vue.ref('')

function updatePosition() {
  if (!triggerRef.value || !tooltipRef.value)
    return

  const triggerRect = triggerRef.value.getBoundingClientRect()
  const tooltipRect = tooltipRef.value.getBoundingClientRect()

  let left: number, top: number

  switch (props.direction) {
    case 'bottom':
      left = triggerRect.left + window.scrollX + (triggerRect.width / 2) - (tooltipRect.width / 2)
      top = triggerRect.bottom + window.scrollY + 10
      break
    case 'top':
      left = triggerRect.left + window.scrollX + (triggerRect.width / 2) - (tooltipRect.width / 2)
      top = triggerRect.top + window.scrollY - tooltipRect.height - 10
      break
    default: // 'right'
      left = triggerRect.right + window.scrollX + 10
      top = triggerRect.top + window.scrollY + (triggerRect.height / 2) - (tooltipRect.height / 2)
  }

  tooltipStyle.left = `${left}px`
  tooltipStyle.top = `${top}px`
}

function showTooltipWithIntent() {
  if (props.disabled)
    return

  tooltipContent.value = props.content || triggerRef.value?.getAttribute('title') || ''

  if (triggerRef.value && triggerRef.value.hasAttribute('title')) {
    triggerRef.value.dataset.originalTitle = triggerRef.value.getAttribute('title') || ''
    triggerRef.value.removeAttribute('title')
  }

  if (tooltipContent.value) {
    showTooltip.value = true
    vue.nextTick(updatePosition)

    if (props.timeout > 0) {
      hideTooltipTimer.value = setTimeout(() => {
        showTooltip.value = false
      }, props.timeout)
    }
  }
}

function onMouseEnter() {
  if (props.disabled)
    return

  if (hideTooltipTimer.value) {
    clearTimeout(hideTooltipTimer.value)
    hideTooltipTimer.value = null
  }

  hoverIntentTimer.value = setTimeout(showTooltipWithIntent, props.delay)
}

function onMouseLeave() {
  if (hoverIntentTimer.value) {
    clearTimeout(hoverIntentTimer.value)
    hoverIntentTimer.value = null
  }

  if (hideTooltipTimer.value) {
    clearTimeout(hideTooltipTimer.value)
    hideTooltipTimer.value = null
  }

  if (triggerRef.value && triggerRef.value.dataset.originalTitle) {
    triggerRef.value.setAttribute('title', triggerRef.value.dataset.originalTitle)
    delete triggerRef.value.dataset.originalTitle
  }
  showTooltip.value = false
}

onResetUi(() => {
  showTooltip.value = false
  if (hoverIntentTimer.value) {
    clearTimeout(hoverIntentTimer.value)
    hoverIntentTimer.value = null
  }
  if (hideTooltipTimer.value) {
    clearTimeout(hideTooltipTimer.value)
    hideTooltipTimer.value = null
  }
})

vue.onMounted(() => {
  window.addEventListener('resize', updatePosition)
  window.addEventListener('scroll', updatePosition)
})

vue.onUnmounted(() => {
  window.removeEventListener('resize', updatePosition)
  window.removeEventListener('scroll', updatePosition)
  if (hoverIntentTimer.value)
    clearTimeout(hoverIntentTimer.value)
  if (hideTooltipTimer.value)
    clearTimeout(hideTooltipTimer.value)
})

const bgClass = 'text-white bg-theme-900/80 dark:bg-theme-600'

const arrowClass = vue.computed(() => {
  const baseClass = `absolute size-1.5 transform rotate-45 ${bgClass}`
  switch (props.direction) {
    case 'bottom': return `${baseClass} left-1/2 -translate-x-1/2 top-[-3px]`
    case 'top': return `${baseClass} left-1/2 -translate-x-1/2 bottom-[-3px]`
    default: return `${baseClass} left-[-3px] top-1/2 -translate-y-1/2` // 'right'
  }
})
</script>

<template>
  <div ref="triggerRef" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
    <slot />
  </div>
  <teleport to="body">
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <div
        v-show="showTooltip && !disabled"
        ref="tooltipRef"
        class="fixed z-50 px-2.5 py-1.5 text-xs font-normal rounded-md shadow-sm"
        :class="bgClass"
        :style="tooltipStyle"
      >
        {{ tooltipContent }}
        <div :class="arrowClass" />
      </div>
    </transition>
  </teleport>
</template>
