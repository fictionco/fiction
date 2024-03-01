<script lang="ts">
import type { PropType, Ref } from 'vue'
import { computed, onMounted, ref, watch } from 'vue'
import { timeAgo } from '@factor/api'
import { intervalDataPoints } from '@kaption/engine/active/time'
import dayjs from 'dayjs'
import { createBarChart } from '../../lib/chart'
import type { ActiveUserResponse, FullWidget } from '..'

export default {
  props: {
    config: {
      type: Object as PropType<FullWidget<ActiveUserResponse>>,
      default: () => {},
    },
  },
  setup(props) {
    const totalVisitors = ref(0)
    const totalVisitorsFinal = ref(0)

    const animateCount = (end: number, num: Ref<number>) => {
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
      () => totalVisitors.value,
      end => animateCount(end, totalVisitorsFinal),
    )

    const chartEl = ref<HTMLCanvasElement>()
    onMounted(() => {
      if (!chartEl.value)
        return

      const chart = createBarChart({ el: chartEl.value })
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
        { immediate: true, deep: true },
      )
    })

    return {
      dataEmpty,
      chartEl,
      totalVisitors,
      totalVisitorsFinal,
    }
  },
}
</script>

<template>
  <div class="relative px-4">
    <div class="flex justify-between items-start">
      <div class="flex flex-nowrap items-center">
        <span class="text-2xl font-semibold pr-2">
          {{ totalVisitorsFinal }}
        </span>
        <div class="inline text-sm text-slate-400 mr-2">
          Active Users
          <span class="text-slate-300">(5 Minutes)</span>
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
      <canvas v-else ref="chartEl" />
    </div>
  </div>
</template>
