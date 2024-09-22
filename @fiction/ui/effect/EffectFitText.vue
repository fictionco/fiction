<script lang="ts" setup>
import { vue, waitFor } from '@fiction/core'
import { twMerge } from 'tailwind-merge'
import { Fitty } from './utilFitText.js'

const props = defineProps({
  wrapClass: { type: String, default: '' },
  minSize: { type: Number, default: 16 },
  maxSize: { type: Number, default: 512 },
  multiLine: { type: Boolean, default: true },
  lines: { type: Number, default: 1 },
  observeMutations: { type: [Boolean, Object], default: true },
  content: { type: String, required: true },
})

const fittyRef = vue.ref<HTMLElement | null>(null)
const containerRef = vue.ref<HTMLElement | null>(null)
const fitty = vue.ref<Fitty | null>(null)
const isTextVisible = vue.ref(false)

function initFitty() {
  if (fittyRef.value) {
    fitty.value = new Fitty({ debug: false })
    fitty.value.fit(fittyRef.value, {
      minSize: props.minSize,
      maxSize: props.maxSize,
      multiLine: props.multiLine,
      lines: props.lines,
      observeMutations: props.observeMutations === true
        ? { subtree: true, childList: true, characterData: true }
        : props.observeMutations,
    })
  }
}

function refitText() {
  vue.nextTick(async () => {
    await vue.nextTick() // Wait for DOM update
    fitty.value?.fitAll()
    isTextVisible.value = true // Show text after fitting
  })
}

vue.onMounted(async () => {
  await waitFor(50)
  initFitty()
  refitText()

  // Use ResizeObserver to detect container size changes
  const resizeObserver = new ResizeObserver(() => {
    refitText()
  })
  if (containerRef.value) {
    resizeObserver.observe(containerRef.value)
  }

  vue.onBeforeUnmount(() => {
    resizeObserver.disconnect()
    if (fitty.value) {
      fitty.value.destroy()
    }
  })
})

vue.watch(
  () => [props.content, props.minSize, props.maxSize, props.multiLine, props.lines],
  () => {
    isTextVisible.value = false // Hide text before refitting
    refitText()
  },
  { deep: true, immediate: true },
)

const cls = vue.computed(() => twMerge(props.wrapClass))

// Expose a method to force recalculation
function forceRecalculate() {
  isTextVisible.value = false // Hide text before refitting
  vue.nextTick(async () => {
    await waitFor(50)
    refitText()
  })
}

defineExpose({ forceRecalculate })

// Compute an initial font size based on container size
const initialFontSize = vue.computed(() => {
  if (!containerRef.value)
    return `${props.minSize}px`
  const containerWidth = containerRef.value.clientWidth
  const containerHeight = containerRef.value.clientHeight
  const initialSize = Math.min(containerWidth / 10, containerHeight / 2, props.maxSize)
  return `${Math.max(initialSize, props.minSize)}px`
})
</script>

<template>
  <div ref="containerRef" :class="cls">
    <div
      ref="fittyRef"
      class="w-full h-full transition-opacity duration-300"
      :class="{ 'opacity-0': !isTextVisible }"
      :style="{
        fontSize: initialFontSize,
        maxWidth: '100%',
        maxHeight: '100%',
      }"
    >
      <slot />
    </div>
  </div>
</template>
