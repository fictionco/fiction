<script lang="ts" setup>
import type { Card } from '@fiction/site'
import { useService, vue, waitFor } from '@fiction/core'
import { animateUnderline } from '@fiction/ui/anim/animateText.js'

defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
})

const { fictionRouter } = useService()

async function applyAnimatedUnderline() {
  await vue.nextTick()
  animateUnderline()
}

vue.onMounted(async () => {
  await waitFor(100)
  vue.watch(() => fictionRouter.current.value, async () => {
    // Reset and reapply animations on route change
    await waitFor(100) // Short delay to ensure DOM is updated
    applyAnimatedUnderline()
  }, { immediate: true })
})
</script>

<template>
  <div />
</template>
