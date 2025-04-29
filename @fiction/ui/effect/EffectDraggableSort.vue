<script lang="ts" setup>
import { vue, waitFor } from '@fiction/core'
import EffectTransitionList from './EffectTransitionList.vue'

defineOptions({
  name: 'EffectDraggableSort',
})

const {
  itemSelector = '[data-drag-id]',
  dragHandle,
  allowHorizontal = false,
  mode = 'block',
  disabled = false,
} = defineProps<{
  itemSelector?: string
  dragHandle?: string
  allowHorizontal?: boolean
  mode?: 'inline' | 'block'
  disabled?: boolean
}>()

const emit = defineEmits<{
  (event: 'update:sorted', payload: string[]): void
}>()

const wrapperEl = vue.ref<HTMLElement>()

function update() {
  if (!wrapperEl.value)
    return

  const rank: string[] = []
  wrapperEl.value.querySelectorAll(itemSelector).forEach((el) => {
    const element = el as HTMLElement
    const value = element.dataset.dragId
    if (value)
      rank.push(value)
  })

  emit('update:sorted', rank)
}

vue.onMounted(async () => {
  await waitFor(200)

  if (!wrapperEl.value || disabled)
    return

  const { Plugins, Sortable } = await import('@shopify/draggable')
  const sortable = new Sortable(wrapperEl.value, {
    draggable: itemSelector,
    handle: dragHandle || undefined,
    distance: 10,
    mirror: {
      constrainDimensions: true,
    },
    swapAnimation: {
      duration: 200,
      easingFunction: 'ease-in-out',
      horizontal: allowHorizontal,
    },
    plugins: [Plugins.SwapAnimation],
  })

  sortable.on('sortable:stop', () => {
    setTimeout(() => update(), 50)
  })
})
</script>

<template>
  <div ref="wrapperEl" class="relative min-h-[30px] rounded-md">
    <EffectTransitionList :mode :disabled>
      <slot />
    </EffectTransitionList>
  </div>
</template>
