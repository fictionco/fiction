<script lang="ts" setup>
import type { NumberFormats } from '@fiction/core'
import { dayjs, formatNumber, isDarkOrLightMode, vue } from '@fiction/core'
import ElLoading from '@fiction/ui/loaders/ElSpinner.vue'
import type { ComparePeriods, DataCompared, DataPointChart } from '@fiction/analytics/types'
import { createLineChart } from './chart'
import { shouldUpdateChart } from './util'

const props = defineProps({
  title: { type: String, required: true },
  data: { type: Object as vue.PropType<DataCompared<DataPointChart> | undefined>, default: undefined },
  valueKey: { type: String, default: 'count' },
  valueFormat: { type: String as vue.PropType<NumberFormats>, default: 'number' },
  changeFormat: { type: String as vue.PropType<'inverse' | 'normal'>, default: 'normal' },
  dateFormat: { type: String, default: 'YYYY-MM-DD' },
  interval: { type: String, default: 'day' },
  comparePeriod: { type: String as vue.PropType<ComparePeriods>, default: 'period' },
  loading: { type: Boolean, default: false },
})

const chartEl = vue.ref<HTMLCanvasElement>()
const totals = vue.ref<DataPointChart>()
const totalsCompare = vue.ref<DataPointChart>()

const total = vue.computed(() => totals.value?.[props.valueKey] || 0)
const totalNice = vue.computed(() => formatNumber(total.value, props.valueFormat))
const totalCompare = vue.computed(() => totalsCompare.value?.[props.valueKey] || 0)
const totalCompareNice = vue.computed(() => formatNumber(totalCompare.value, props.valueFormat))

const difference = vue.computed(() => {
  const v = +total.value
  const prev = +totalCompare.value

  if (!v && prev)
    return -1
  else if (v && !prev)
    return 999
  else if (!v && !prev)
    return 0

  if (props.valueFormat === 'percent')
    return Math.round((v - prev) * 10) / 10 // round to 1 decimal
  else
    return Math.min(Math.round(((v - prev) / prev) * 100), 999)
})

const positiveChange = vue.computed(() => {
  if ((props.changeFormat === 'inverse' && difference.value <= 0) || difference.value >= 0) {
    return true
  }
  else {
    return false
  }
})

const mode = isDarkOrLightMode()
const colors = vue.computed(() => {
  return mode === 'dark'
    ? { line: `rgba(var(--primary-400))`, text: 'rgba(var(--theme-200))', bg: 'rgba(var(--theme-800))', grid: 'rgba(var(--theme-600)/ .5)', tipBg: 'rgba(var(--theme-0))', tipText: 'rgba(var(--theme-700))' }
    : { line: 'rgba(var(--primary-600))', text: 'rgba(var(--theme-500))', bg: 'rgba(var(--theme-0))', grid: 'rgba(var(--theme-200)/.5)', tipBg: 'rgba(var(--theme-800))', tipText: 'rgba(var(--theme-0))' }
})

vue.onMounted(() => {
  vue.watchEffect(() => {
    if (typeof document === 'undefined')
      return

    const c = colors.value
    document.documentElement.style.setProperty('--chart-bg-color', c.bg)
    document.documentElement.style.setProperty('--chart-grid-color', c.grid)
    document.documentElement.style.setProperty('--chart-line-color', c.line)
    document.documentElement.style.setProperty('--chart-text-color', c.text)
    document.documentElement.style.setProperty('--chart-tooltip-bg-color', c.tipBg)
    document.documentElement.style.setProperty('--chart-tooltip-text-color', c.tipText)
  })

  const el = chartEl.value
  if (!el)
    return

  const chart = createLineChart({ el, countFormat: props.valueFormat })

  vue.watch(
    () => props.data,
    (v, old) => {
      if (v && shouldUpdateChart(v, old)) {
        const { mainTotals, compareTotals, main, compare = [] } = v
        totals.value = mainTotals
        totalsCompare.value = compareTotals

        const labels = main?.map((_) => {
          const startDate = dayjs(_.date).utc()
          const f = props.dateFormat
          const interval = props.interval

          const lStartDate = interval === 'day' || interval === 'hour' ? startDate.local() : startDate

          if (interval === 'week') {
            return [lStartDate, lStartDate.add(6, 'day')].map(d => d.utc().format(f)).join(' - ')
          }
          else {
            return lStartDate.format(f)
          }
        }) || []

        const data = main?.map(_ => (+(_[props.valueKey] || 0))) || []

        const presentIndex = main?.findIndex(d => d.tense === 'present')

        const compareData = compare.map(_ => +(_[props.valueKey] || 0))

        const datasets = [
          { label: props.title || '', data, presentIndex },
          { label: `Compare (${props.comparePeriod})`, data: compareData },
        ]

        chart.setData({ labels, datasets, dataKey: props.valueKey })
      }
    },
    { immediate: true },
  )
})
</script>

<template>
  <div class="relative flex h-full flex-col px-3">
    <div class="flex items-center justify-between py-2">
      <div class="flex items-baseline">
        <div class="text-xl font-bold x-font-title">
          {{ totalNice }}
        </div>
        <div class="text-theme-400 ml-2 text-xs font-sans">
          from {{ totalCompareNice }}
        </div>
      </div>
      <div class="change">
        <div
          class="inline-flex items-center space-x-2 rounded-full text-xs font-medium md:mt-2 lg:mt-0"
          :class="positiveChange ? 'text-emerald-500 dark:text-emerald-50' : 'text-orange-500'"
        >
          <div class="mr-1 text-sm font-bold">
            {{ `${difference}%` }}
          </div>
          <div
            class="flex size-6  items-center justify-center rounded-full"
            :class="positiveChange ? 'bg-emerald-100 dark:bg-emerald-600' : 'bg-orange-100'"
          >
            <div class="text-base" :class="difference >= 0 ? ' ' : 'transform rotate-180'">
              &uarr;
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="relative grow py-2">
      <div
        v-if="loading"
        class="absolute flex h-full w-full items-center justify-center bg-white/90 text-primary-500"
      >
        <div class="pb-4 text-center">
          <ElLoading class="inline-block w-6" />
          <div class="text-theme-200 text-[10px]">
            Loading
          </div>
        </div>
      </div>
      <canvas ref="chartEl" />
    </div>
  </div>
</template>

<style lang="less">
:root {
  --chart-bg-color: rgba(0,0,0, 1);
  --chart-grid-color: rgba(100,100,100, 0.1);
  --chart-line-color: v-bind(colors.line);
  --chart-text-color: v-bind(colors.text);
}
</style>
