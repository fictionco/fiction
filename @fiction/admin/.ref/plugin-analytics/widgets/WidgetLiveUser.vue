<script lang="ts" setup>
import { timeAgo, vue } from '@factor/api'
import dayjs from 'dayjs'
import type { ClientWidget, DataCompared } from '@factor/api/plugin-dashboards'
import { createBarChart } from '../../utils/chart'
import { useKaption } from '../../utils'
import { shouldUpdateChart } from './utils'
import type { ActiveUserResponse } from './types'

const props = defineProps({
  widget: {
    type: Object as vue.PropType<
      ClientWidget<DataCompared<ActiveUserResponse>>
    >,
    default: undefined,
  },
})

const { kaptionDashboard } = useKaption()

const filter = kaptionDashboard.kaptionFilter

const totalVisitors = vue.ref(0)
const totalVisitorsFinal = vue.ref(0)

function animateCount(end: number, num: vue.Ref<number>): void {
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

const dataEmpty = vue.computed(() => {
  const data = props.widget?.data.value
  const chartData = data?.main.length && data?.compare?.length

  return !chartData
})

vue.watch(
  () => totalVisitors.value,
  end => animateCount(end, totalVisitorsFinal),
)

const chartEl = vue.ref<HTMLCanvasElement>()
vue.onMounted(() => {
  if (!chartEl.value)
    return

  const chart = createBarChart({ el: chartEl.value })

  vue.watch(
    () => props.widget?.data.value,
    (v, old) => {
      if (v && shouldUpdateChart(v, old)) {
        const { main, compareTotals } = v

        const timeEndAt = dayjs()
        const timeStartAt = dayjs().subtract(60, 'minute')

        const filledMain = filter.intervalDataPoints<ActiveUserResponse>({
          data: main,
          timeEndAt,
          timeStartAt,
          interval: 'minute',
          windowInterval: 'minute',
        })

        totalVisitors.value = +(compareTotals?.uniqueVisitors ?? 0)

        const labels = filledMain?.map(_ => timeAgo(_.date))
        const uniques = filledMain?.map(_ => +_.uniqueVisitors)
        const views = filledMain?.map(_ => +_.views)

        chart.setData({
          labels,
          datasets: [
            { data: uniques, label: 'Unique Visitors' },
            { data: views, label: 'Page Views' },
          ],
        })
      }
    },
    { immediate: true },
  )
})
</script>

<template>
  <div class="relative px-3">
    <div class="flex items-start justify-between py-2">
      <div class="flex items-baseline">
        <span class="pr-2 text-lg font-bold">
          {{ totalVisitorsFinal }}
        </span>
        <div class="text-theme-400 mr-2 inline text-xs">
          Active Users
          <span class="text-theme-300">(Last Hour)</span>
        </div>
      </div>
      <div class="inline-flex items-center py-0.5 md:mt-2 lg:mt-0">
        <span
          class="bg-theme-100 text-theme-800 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
        >
          Real-Time
        </span>
      </div>
    </div>
    <div class="relative">
      <canvas ref="chartEl" />
    </div>
  </div>
</template>
