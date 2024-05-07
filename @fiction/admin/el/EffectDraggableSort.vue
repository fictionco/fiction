<script lang="ts" setup>
import { vue, waitFor } from '@fiction/core'
import EffectTransitionList from './EffectTransitionList.vue'

const props = defineProps({
  itemSelector: { type: String, default: '[data-drag-id]' },
})

const emit = defineEmits<{
  (event: 'update:sorted', payload: string[]): void
}>()

const wrapperEl = vue.ref<HTMLElement>()

function update() {
  if (!wrapperEl.value)
    return

  const rank: string[] = []
  wrapperEl.value.querySelectorAll(props.itemSelector).forEach((el) => {
    const element = el as HTMLElement
    const value = element.dataset.dragId
    if (value)
      rank.push(value)
  })

  emit('update:sorted', rank)
}

vue.onMounted(async () => {
  await waitFor(200)

  if (!wrapperEl.value)
    return
  const { Plugins, Sortable } = await import('@shopify/draggable')
  const sortable = new Sortable(wrapperEl.value, {
    draggable: props.itemSelector,
    distance: 3,

    mirror: {
      constrainDimensions: true,
    },
    swapAnimation: {
      duration: 200,
      easingFunction: 'ease-in-out',
      horizontal: false,
    },
    plugins: [Plugins.SwapAnimation], // Or [SwapAnimation]
  })

  // --- Draggable events --- //
  sortable.on('drag:start', (_evt) => {
  })

  sortable.on('sortable:sort', (_evt) => {
  })

  sortable.on('sortable:sorted', (_evt) => {
  })

  sortable.on('sortable:stop', (_evt) => {
    setTimeout(() => update(), 50)
  })
})
</script>

<template>
  <div ref="wrapperEl" class="relative min-h-[30px] rounded-md">
    <EffectTransitionList>
      <slot />
    </EffectTransitionList>
  </div>
</template>
