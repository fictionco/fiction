<script lang="ts">
import type { PropType } from 'vue'
import { onMounted, ref, watch } from 'vue'
import dayjs from 'dayjs'
import type { Variant } from '@kaption/types'
import type { FullWidget, GoalResult } from '..'
import { createLineChart } from '../../lib/chart'
import { getMultiColor } from '../../lib/colors'
import { formatNumber } from '../../tools/utils'
import { activeDateFormat } from '../../tools/time'

export default {
  props: {
    config: {
      type: Object as PropType<FullWidget<GoalResult>>,
      default: () => {},
    },
  },
  setup(props) {
    const chartEl = ref<HTMLCanvasElement>()

    const totals = ref<{
      totalSessions: number
      uniqueVisitors: number
      variantTotals: {
        variant: Variant
        value: string | number | undefined
        users: string | number | undefined
      }[]
    }>({ totalSessions: 0, uniqueVisitors: 0, variantTotals: [] })

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
            const { main, mainTotals } = v

            const labels
              = main.map(_ => dayjs(_.date).format(activeDateFormat.value))
              ?? []

            totals.value = {
              totalSessions: mainTotals?.totalSessions ?? 0,
              uniqueVisitors: mainTotals?.uniqueVisitors ?? 0,
              variantTotals:
                mainTotals?.variantSet.map((v) => {
                  const { variant, users, rate, conversion } = v

                  return {
                    variant,
                    value: formatNumber(rate, 'percent'),
                    users: formatNumber(users, 'abbreviated'),
                    conversions: formatNumber(conversion, 'abbreviated'),
                  }
                }) ?? [],
            }

            const datasetsRecord: Record<
              string,
              { label: string, data: any[] }
            > = {}

            main.forEach((row) => {
              row.variantSet.map((v) => {
                const { variant, rate } = v

                if (!datasetsRecord[variant.variantId]) {
                  datasetsRecord[variant.variantId] = {
                    label: variant.variantName ?? '',
                    data: [],
                  }
                }

                datasetsRecord[variant.variantId].data.push(rate ?? 0)
              })
            })

            const datasets = Object.values(datasetsRecord)
            chart.setData({ labels, datasets, mode: 'multi' })
          }
        },
        { immediate: true, deep: true },
      )
    })

    return { chartEl, formatNumber, totals, getMultiColor }
  },
}
</script>

<template>
  <div class="relative px-4 flex flex-col h-full">
    <div class="flex justify-between items-center">
      <div class="flex items-baseline space-x-4 my-2">
        <div
          v-for="(v, i) in totals?.variantTotals"
          :key="i"
          class="p-4 rounded-lg align-baseline border border-slate-300"
        >
          <div
            class="text-xs opacity-80 font-semibold"
            :style="{ color: getMultiColor(i) }"
          >
            {{ v.variant.variantName }}
          </div>
          <div class="flex items-baseline whitespace-nowrap my-1">
            <div class="font-bold mr-2 text-2xl">
              {{ v.value ?? "--" }}
            </div>
            <div class="text-xs opacity-80 text-slate-500">
              CVR
            </div>
          </div>
          <div
            class="flex justify-center items-baseline whitespace-nowrap text-xs text-slate-500"
          >
            <span><span class="font-bold">{{ v.conversions }}</span> CV</span>
            <span class="mx-2">/</span>
            <span>
              <span class="font-bold">{{ v.users }}</span> users</span>
          </div>
        </div>
      </div>
    </div>
    <div class="relative py-4 flex-grow min-h-0">
      <canvas ref="chartEl" />
    </div>
  </div>
</template>
