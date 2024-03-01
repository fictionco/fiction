<script lang="ts" setup>
import type { PropType, Ref } from 'vue'
import { computed, onMounted, ref, watch } from 'vue'
import type { WidgetConfigUser } from '@kaption/engine/types'
import { timeAgo } from '@factor/api'
import dayjs from 'dayjs'
import { intervalDataPoints } from '@kaption/engine/active/time'
import { createBarChart } from '../../lib/chart'
import type { ActiveUserResponse } from '..'

const props = defineProps({
  config: {
    type: Object as PropType<WidgetConfigUser<ActiveUserResponse>>,
    default: () => {},
  },
})
const totalMicro = ref(0)
const totalMicroFinal = ref(0)
const totalMacro = ref(0)
const totalMacroFinal = ref(0)

function animateCount(end: number, num: Ref<number>) {
  if (end !== num.value) {
    const range = end - num.value

    const stepTime = Math.abs(Math.floor(1200 / range))
    const timer = setInterval(() => {
      const increment = end > num.value ? 1 : -1
      num.value += increment

      if (num.value === end)
        clearInterval(timer)

      setTimeout(() => clearInterval(timer), 3000)
    }, stepTime)
  }
}

const dataEmpty = computed(() => {
  const chartData
    = props.config.data?.main.length && props.config.data?.compare?.length

  return !chartData
})

watch(
  () => totalMicro.value,
  end => animateCount(end, totalMicroFinal),
)
watch(
  () => totalMacro.value,
  end => animateCount(end, totalMacroFinal),
)

const chartEl2 = ref<HTMLCanvasElement>()
onMounted(() => {
  if (!chartEl2.value)
    return

  const chart2 = createBarChart({ el: chartEl2.value })
  watch(
    () => props.config.data,
    (v) => {
      if (v) {
        const { main, compareTotals } = v

        const timeEnd = dayjs()
        const timeStart = dayjs().subtract(30, 'minute')

        const filledMain = intervalDataPoints({
          data: main,
          timeEnd,
          timeStart,
          interval: 'minute',
          windowInterval: 'minute',
        })

        totalMicro.value = +(compareTotals?.micro ?? 0)
        totalMacro.value = +(compareTotals?.macro ?? 0)

        const labels = filledMain?.map(_ => timeAgo(_.date))
        const micro = filledMain?.map(_ => +_.micro)
        const macro = filledMain?.map(_ => +_.macro)

        chart2.setData({
          labels,
          datasets: [
            { data: macro, label: 'Macro Conversions' },
            { data: micro, label: 'Micro Conversions' },
          ],
        })
      }
    },
    { immediate: true, deep: true },
  )
})
</script>

<template>
  <div class="relative px-4">
    <div class="flex justify-between items-start">
      <div class="flex flex-nowrap items-center">
        <span class="text-2xl font-semibold pr-2">
          {{ totalMacroFinal }}/{{ totalMicroFinal }}
        </span>
        <div class="inline text-sm text-slate-400 mr-2">
          Macro / Micro Conversions
        </div>
      </div>
      <div class="inline-flex items-center py-0.5 md:mt-2 lg:mt-0">
        <div
          class="hidden md:flex justify-center items-center whitespace-nowrap h-8 px-2 rounded-lg text-center text-sm align-baseline font-medium bg-primary-100 text-primary-700"
        >
          Real-time
        </div>
      </div>
    </div>
    <div class="relative pt-4">
      <div
        v-if="dataEmpty"
        class="pt-12 pb-8 text-center text-xs font-semibold text-slate-400 uppercase tracking-wide text-opacity-40"
      >
        Waiting for live data
      </div>
      <canvas v-else ref="chartEl2" />
    </div>
  </div>
</template>
