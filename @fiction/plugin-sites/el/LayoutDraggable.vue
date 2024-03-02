<script lang="ts" setup>
import { vue, waitFor } from '@fiction/core'
import type { LayoutOrder } from '../utils/layout'
import { getOrderRecursive, selectors } from '../utils/layout'

const emit = defineEmits<{
  (event: 'update:modelValue', payload: LayoutOrder[]): void
}>()

const wrapperEl = vue.ref<HTMLElement>()

function update() {
  if (!wrapperEl.value)
    return

  const itemOrder = getOrderRecursive({ parentEl: wrapperEl.value })

  emit('update:modelValue', itemOrder)
}

function setEmptyRecursive(args: { depth?: number, parentEl: Element }) {
  const { depth = 1, parentEl } = args

  const sel = selectors.dragZone + selectors.dragDepth(depth)

  const containers = parentEl.querySelectorAll(sel)

  if (!containers)
    return

  const classes = ['outline-2', 'outline-dashed', 'outline-theme-200', 'rounded-md']
  containers.forEach((container) => {
    const items = container.querySelectorAll(`:scope > ${selectors.handleId}`)
    const isEmpty = items.length === 0
    classes.forEach(cls => container.classList.toggle(cls, isEmpty))
    setEmptyRecursive({ depth: depth + 1, parentEl: container })
  })
}

vue.onMounted(async () => {
  await waitFor(200)

  if (!wrapperEl.value)
    return

  const containers = wrapperEl.value.querySelectorAll(selectors.dragZone)

  if (!containers)
    return

  setEmptyRecursive({ parentEl: wrapperEl.value })

  const { Plugins, Sortable } = await import('@shopify/draggable')
  const sortable = new Sortable(containers, {
    draggable: selectors.handleId,
    distance: 3,
    handle: '.handlebar',

    mirror: {
      constrainDimensions: true,
    },
    swapAnimation: {
      duration: 200,
      easingFunction: 'ease-in-out',
      horizontal: false,
    },
    plugins: [Plugins.SwapAnimation],
  })

  // --- Draggable events --- //
  sortable.on('drag:start', (_evt) => { })

  sortable.on('sortable:sort', (_evt) => { })

  sortable.on('sortable:sorted', (_evt) => {
    if (!wrapperEl.value)
      return
    setEmptyRecursive({ parentEl: wrapperEl.value })
  })

  sortable.on('sortable:stop', (_evt) => {
    setTimeout(() => {
      if (!wrapperEl.value)
        return
      setEmptyRecursive({ parentEl: wrapperEl.value })
      update()
    }, 100)
  })
})
</script>

<template>
  <div ref="wrapperEl">
    <slot />
  </div>
</template>

<style lang="less">
.draggable-mirror{
  z-index: 500;
}
</style>
./layout./layout
