<script lang="ts" setup>
import { vue } from '@factor/api'

import type { DataSet } from '../utils/chart'
import { createBarChart } from '../utils/chart'

const props = defineProps({
  labels: {
    type: Array as vue.PropType<string[]>,
    default: () => [],
  },
  datasets: {
    type: Array as vue.PropType<DataSet[]>,
    default: undefined,
  },
})

const chartEl = vue.ref<HTMLCanvasElement>()
vue.onMounted(() => {
  if (!chartEl.value)
    return

  const chart = createBarChart({ el: chartEl.value })

  vue.watch(
    () => props.datasets,
    (v) => {
      if (props.labels.length === 0)
        return
      chart.setData({ labels: props.labels || [], datasets: v || [] })
    },
    { immediate: true },
  )
})
</script>

<template>
  <div class="relative">
    <canvas ref="chartEl" />
  </div>
</template>
