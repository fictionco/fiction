<script lang="ts" setup>
import { dayjs, formatNumber, vue } from '@factor/api'
import type {
  ClientWidget,
  DataCompared,
  DataPointChart,
  WidgetKeys,
} from '@factor/api/plugin-dashboards'
import { createLineChart } from '../../utils/chart'
import { useKaption } from '../../utils'
import ElLoading from '../../ui/ElLoading.vue'
import { shouldUpdateChart } from './utils'

const props = defineProps({
  widget: {
    type: Object as vue.PropType<ClientWidget<DataCompared<DataPointChart>>>,
    required: true,
  },
})

const { kaptionFilter } = useKaption()

if (!props.widget)
  throw new Error('widget prop is required')

const loadingData = vue.ref<'loading' | 'timeout' | false>('loading')
const chartEl = vue.ref<HTMLCanvasElement>()
const totals = vue.ref<DataPointChart>()
const totalsCompare = vue.ref<DataPointChart>()
const valueFormat = vue.computed(() => props.widget.ui.valueFormat)

const valueKey = vue.computed<WidgetKeys | 'count'>(() => {
  return props.widget?.widgetKey
})

const total = vue.computed(() => totals.value?.[valueKey.value] || 0)
const totalNice = vue.computed(() => {
  const v = formatNumber(total.value, valueFormat.value)

  return v
})
const totalCompare = vue.computed(
  () => totalsCompare.value?.[valueKey.value] || 0,
)
const totalCompareNice = vue.computed(() =>
  formatNumber(totalCompare.value, valueFormat.value),
)

const difference = vue.computed(() => {
  const v = +total.value
  const prev = +totalCompare.value

  if (!v && prev)
    return -1
  else if (v && !prev)
    return 999
  else if (!v && !prev)
    return 0

  if (props.widget.ui.valueFormat === 'percent')
    return Math.round((v - prev) * 10) / 10 // round to 1 decimal
  else
    return Math.min(Math.round(((v - prev) / prev) * 100), 999)
})

const positiveChange = vue.computed(() => {
  if (
    (props.widget.ui.changeFormat === 'inverse' && difference.value <= 0)
    || difference.value >= 0
  )
    return true
  else
    return false
})

vue.onMounted(() => {
  if (!chartEl.value)
    return

  const chart = createLineChart({
    el: chartEl.value,
    countFormat: props.widget.ui.valueFormat,
  })

  vue.watch(
    () => props.widget.data.value,
    (v, old) => {
      if (v)
        loadingData.value = false

      if (v && shouldUpdateChart(v, old)) {
        const { mainTotals, compareTotals, main, compare = [] } = v
        totals.value = mainTotals
        totalsCompare.value = compareTotals

        // const filledMain = kaptionFilter.intervalDataPoints({ data: main })
        // const filledCompare = kaptionFilter.intervalDataPoints({
        //   data: compare,
        //   compare: true,
        // })

        const labels = main?.map((_) => {
          const startDate = dayjs(_.date).utc()
          const f = kaptionFilter.activeDateFormat.value
          const interval = kaptionFilter.activeInterval.value

          const lStartDate
            = interval === 'day' || interval === 'hour'
              ? startDate.local()
              : startDate

          if (interval === 'week') {
            return [lStartDate, lStartDate.add(6, 'day')]
              .map(d => d.utc().format(f))
              .join(' - ')
          }
          else {
            return lStartDate.format(f)
          }
        })

        const data = main.map((_) => {
          return +(_[valueKey.value] || 0)
        })

        const presentIndex = main.findIndex(d => d.tense === 'present')

        const compareData = compare.map(_ => +(_[valueKey.value] || 0))

        const datasets = [
          {
            label: props.widget.title.value || '',
            data,
            presentIndex,
          },
          {
            label: `Compare (${kaptionFilter.activeCompare.value})`,
            data: compareData,
          },
        ]

        chart.setData({ labels, datasets, dataKey: props.widget.widgetKey })
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
        <div class="text-lg font-bold">
          {{ totalNice }}
        </div>
        <div class="text-theme-400 ml-2 text-xs">
          from {{ totalCompareNice }}
        </div>
      </div>
      <div class="change">
        <div
          class="inline-flex items-center space-x-2 rounded-full text-xs font-medium md:mt-2 lg:mt-0"
          :class="positiveChange ? 'text-emerald-500' : 'text-orange-500'"
        >
          <div class="mr-1 text-sm font-bold">
            {{ `${difference}%` }}
          </div>
          <div
            class="flex h-5 w-5 items-center justify-center rounded-full"
            :class="positiveChange ? 'bg-emerald-100' : 'bg-orange-100'"
          >
            <div
              class="text-base"
              :class="difference >= 0 ? ' ' : 'transform rotate-180'"
            >
              &uarr;
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="relative grow py-2">
      <div
        v-if="loadingData"
        class="absolute flex h-full w-full items-center justify-center bg-white/90 text-primary-500"
      >
        <div class="pb-4 text-center">
          <template v-if="loadingData === 'timeout'">
            <div class="text-theme-200 text-[10px]">
              No Data Found
            </div>
          </template>
          <template v-else>
            <ElLoading class="inline-block w-6" />
            <div class="text-theme-200 text-[10px]">
              Loading
            </div>
          </template>
        </div>
      </div>
      <canvas ref="chartEl" />
    </div>
  </div>
</template>
