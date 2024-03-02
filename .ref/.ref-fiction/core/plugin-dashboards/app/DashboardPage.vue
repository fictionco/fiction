<script lang="ts" setup>
import { vue } from '@factor/api'
import DashboardGrid from './DashboardGrid.vue'

/**
 * https://css-tricks.com/how-to-detect-when-a-sticky-element-gets-pinned/
 */
const stuck = vue.ref(false)

vue.onMounted(() => {
  const el = document.querySelector('.sticker')
  const observer = new IntersectionObserver(
    ([e]) => {
      stuck.value = e.intersectionRatio < 1
    },
    { threshold: [1], root: document.querySelector('#navbar') },
  )

  if (el)
    observer.observe(el)
})
</script>

<template>
  <div>
    <DashboardGrid v-bind="$attrs" />
  </div>
</template>
