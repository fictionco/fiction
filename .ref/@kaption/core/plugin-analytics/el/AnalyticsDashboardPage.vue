<script lang="ts" setup>
import { vue } from '@factor/api'
import DashboardGrid from '@factor/api/plugin-dashboards/app/DashboardGrid.vue'
import ElControls from './AnalyticsControls.vue'

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
  <div key="analyticsPage" class="">
    <ElControls
      class="sticker top-10 z-10 transition-all md:sticky"
      :class="stuck ? 'p-4 bg-white/80 -ml-4 -mr-4 ' : 'py-1'"
      v-bind="$attrs"
    />

    <DashboardGrid v-bind="$attrs" />
  </div>
</template>
