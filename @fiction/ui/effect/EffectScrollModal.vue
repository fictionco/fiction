<script lang="ts" setup>
import { vue, waitFor } from '@fiction/core'

const modalVisible = vue.ref(false)
const backdropOpacity = vue.ref(0)
const modalHeight = vue.ref(0)
const viewportHeight = window.innerHeight
const scrollHeight = vue.ref(document.documentElement.scrollHeight)
const minHeight = viewportHeight * 3
const noScrollMode = vue.computed(() => scrollHeight.value < minHeight)
const PERCENT_OFFSET = 0.3
const modal = vue.ref<HTMLElement | null>(null)

function updateModalHeight() {
  vue.nextTick(() => {
    if (modal.value)
      modalHeight.value = modal.value.offsetHeight
  })
}

function calculateTop() {
  return (scrollHeight.value * PERCENT_OFFSET)
}

function handleScroll() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop
  const scrollBottom = scrollTop + viewportHeight
  const triggerStartOpacity = calculateTop()
  const triggerFix = triggerStartOpacity + viewportHeight / 2 + modalHeight.value / 2

  modalVisible.value = scrollBottom >= triggerStartOpacity

  if (noScrollMode.value) {
    backdropOpacity.value = 1
  }

  else if (scrollBottom >= triggerStartOpacity && scrollBottom < triggerFix) {
    const opacityRange = triggerFix - triggerStartOpacity
    backdropOpacity.value = Math.min((scrollBottom - triggerStartOpacity) / opacityRange, 1)
  }
  else if (scrollBottom >= triggerFix) {
    backdropOpacity.value = 1
  }
  else {
    backdropOpacity.value = 0
  }
}

const modalFixed = vue.computed(() => backdropOpacity.value === 1)

vue.onMounted(async () => {
  await waitFor(2000)
  window.addEventListener('scroll', handleScroll)
  updateModalHeight()
  handleScroll() // Initialize modal visibility on mount
})

vue.onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <teleport to=".x-site">
    <div v-if="modalVisible">
      <div
        class="fixed inset-0 z-30 bg-theme-800/80 dark:bg-theme-600/80 backdrop-blur-sm will-change-scroll "
        :style="{ opacity: backdropOpacity }"
      />
      <div
        ref="modal"
        class="left-1/2 transform -translate-x-1/2 z-40 w-full max-w-lg p-3"
        :class="{ 'fixed top-1/2 -translate-y-1/2': modalFixed, 'absolute': !modalFixed }"
        :style="{ top: modalFixed ? '50%' : `${calculateTop()}px` }"
      >
        <div class="rounded-2xl  bg-theme-0 dark:bg-theme-800 ring-1 ring-inset ring-theme-200 dark:ring-theme-600 shadow-lg">
          <slot />
        </div>
      </div>
    </div>
  </teleport>
</template>
