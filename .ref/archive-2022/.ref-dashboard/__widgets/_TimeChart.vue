<script lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { formatNumber } from '@factor/api'
import {
  activeCompare,
  activeDateFormat,
  getCurrentDateIndex,
  intervalDataPoints,
} from '@kaption/engine/active/time'
import dayjs from 'dayjs'
import type { ChartResponse } from '..'
import { createLineChart } from '../../lib/chart'

export default {
  props: {
    config: {
      type: Object,
      default: () => {},
    },
  },
  setup(props) {
    const chartEl = ref<HTMLCanvasElement>()
    const totals = ref<ChartResponse>()
    const totalsCompare = ref<ChartResponse>()
    const valueFormat = computed(() => props.config.valueFormat)

    const valueKey = computed(() => {
      const widget = props.config.widget

      return widget === 'dimensionChart' ? 'count' : widget
    })

    const total = computed(() => totals.value?.[valueKey.value] || 0)
    const totalNice = computed(() => {
      const v = formatNumber(total.value, valueFormat.value)

      return v
    })
    const totalCompare = computed(
      () => totalsCompare.value?.[valueKey.value] || 0,
    )
    const totalCompareNice = computed(() =>
      formatNumber(totalCompare.value, valueFormat.value),
    )

    const difference = computed(() => {
      const v = +total.value
      const prev = +totalCompare.value

      if (!v && prev)
        return -1
      else if (v && !prev)
        return 999
      else if (!v && !prev)
        return 0

      if (props.config.valueFormat === 'percent')
        return Math.round((v - prev) * 10) / 10 // round to 1 decimal
      else
        return Math.min(Math.round(((v - prev) / prev) * 100), 999)
    })

    const positiveChange = computed(() => {
      if (
        (props.config.changeFormat === 'inverse' && difference.value <= 0)
        || difference.value >= 0
      )
        return true
      else
        return false
    })

    onMounted(() => {
      if (!chartEl.value)
        return

      const chart = createLineChart({
        el: chartEl.value,
        countFormat: props.config.valueFormat,
      })

      watch(
        () => props.config.data,
        (v) => {
          if (v) {
            const { mainTotals, compareTotals, main, compare = [] } = v
            totals.value = mainTotals
            totalsCompare.value = compareTotals

            const filledMain = intervalDataPoints({ data: main })
            const filledCompare = intervalDataPoints({
              data: compare,
              compare: true,
            })

            const labels = filledMain?.map((_) => {
              return dayjs(_.date).format(activeDateFormat.value)
            })

            const datasets = [
              {
                label: props.config.title || '',
                data: filledMain.map(_ =>
                  _[valueKey.value] ? +_[valueKey.value] : 0,
                ),
                currentDateIndex: getCurrentDateIndex(filledMain),
              },
              {
                label: `Compare (${activeCompare.value})`,
                data: filledCompare.map(_ =>
                  _[valueKey.value] ? +_[valueKey.value] : 0,
                ),
              },
            ]

            chart.setData({ labels, datasets })
          }
        },
        { immediate: true, deep: true },
      )
    })

    return {
      chartEl,
      totalNice,
      totalCompareNice,
      formatNumber,
      difference,
      positiveChange,
    }
  },
}
</script>

<template>
  <div class="relative px-4">
    <div class="flex justify-between items-center">
      <div class="flex items-baseline">
        <div class="font-medium text-2xl">
          {{ totalNice }}
        </div>
        <div class="ml-2 text-sm text-slate-300">
          from {{ totalCompareNice }}
        </div>
      </div>
      <div class="change">
        <div
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium md:mt-2 lg:mt-0"
          :class="positiveChange ? 'text-green-500' : 'text-orange-500'"
        >
          <div class="text-lg mr-3">
            {{ `${difference}%` }}
          </div>
          <div
            class="w-8 h-8 rounded-full flex justify-center"
            :class="positiveChange ? 'bg-green-100' : 'bg-orange-100 '"
          >
            <svg
              class="flex-shrink-0 self-center h-6 w-6"
              :class="difference >= 0 ? ' ' : 'transform rotate-180'"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
    <div class="relative pt-4">
      <canvas ref="chartEl" />
    </div>
  </div>
</template>
