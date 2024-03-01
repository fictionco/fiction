<script lang="ts" setup>
import { dayjs, timeAgo, vue } from '@factor/api'
import type { ClientWidget, DataCompared } from '@factor/api/plugin-dashboards'
import { createBarChart } from '../../utils/chart'
import { useKaption } from '../../utils'
import type { ActiveUserResponse } from './types'
import { shouldUpdateChart } from './utils'

const props = defineProps({
  widget: {
    type: Object as vue.PropType<
      ClientWidget<DataCompared<ActiveUserResponse>>
    >,
    required: true,
  },
})

const { kaptionDashboard } = useKaption()

const filter = kaptionDashboard.kaptionFilter

const totalGoal = vue.ref(0)
const totalGoalFinal = vue.ref(0)
const totalConversions = vue.ref(0)
const totalConversionFinal = vue.ref(0)

function animateCount(end: number, num: vue.Ref<number>) {
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

vue.watch(
  () => totalGoal.value,
  end => animateCount(end, totalGoalFinal),
)
vue.watch(
  () => totalConversions.value,
  end => animateCount(end, totalConversionFinal),
)

const chartEl2 = vue.ref<HTMLCanvasElement>()
vue.onMounted(() => {
  if (!chartEl2.value)
    return

  const chart2 = createBarChart({ el: chartEl2.value })
  vue.watch(
    () => props.widget?.data.value,
    (v, old) => {
      if (v && shouldUpdateChart(v, old)) {
        const { main, compareTotals } = v

        const timeEndAt = dayjs()
        const timeStartAt = dayjs().subtract(60, 'minute')

        const filledMain = filter.intervalDataPoints({
          data: main,
          timeEndAt,
          timeStartAt,
          interval: 'minute',
          windowInterval: 'minute',
        })

        totalGoal.value = +(compareTotals?.goals ?? 0)
        totalConversions.value = +(compareTotals?.conversions ?? 0)

        const labels = filledMain?.map(_ => timeAgo(_.date))
        const goals = filledMain?.map(_ => +(_.goals || 0))
        const conversions = filledMain?.map(_ => +(_.conversions || 0))

        chart2.setData({
          labels,
          datasets: [
            { data: conversions, label: 'Primary Conversions' },
            { data: goals, label: 'Goal Conversions' },
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
        <span class="pr-2 text-lg font-semibold">
          {{ totalConversionFinal }}
        </span>
        <div class="text-theme-400 mr-2 inline text-xs">
          Conversions
        </div>
        <span class="pr-2 text-lg font-semibold">
          {{ totalGoalFinal }}
        </span>
        <div class="text-theme-400 mr-2 inline text-xs">
          Goals
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
      <canvas ref="chartEl2" />
    </div>
  </div>
</template>
