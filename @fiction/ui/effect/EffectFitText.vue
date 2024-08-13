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
const fitty = vue.ref<Fitty | null>(null)

vue.onMounted(async () => {
  await waitFor(50)
  if (fittyRef.value) {
    fitty.value = new Fitty()
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
})

vue.onBeforeUnmount(() => {
  if (fitty.value) {
    fitty.value.observeWindow = false
  }
})

vue.watch(
  () => [props.content, props.minSize, props.maxSize, props.multiLine, props.lines],
  () => {
    vue.nextTick(() => {
      fitty.value?.fitAll()
    })
  },
  { deep: true },
)

const cls = vue.computed(() => twMerge(props.wrapClass))
</script>

<template>
  <div :class="cls">
    <div ref="fittyRef" class="w-full h-full">
      <slot />
    </div>
  </div>
</template>
