<script lang="ts" setup>
import { vue } from '@factor/api'
import type { ClientWidget } from '@factor/api/plugin-dashboards'
import WidgetList from '../../ui/WidgetList.vue'
import WidgetCounts from '../../ui/WidgetCounts.vue'
import ElButton from '../../ui/ElButton.vue'
import WidgetChartBar from '../../ui/WidgetChartBar.vue'
import type { DataSet } from '../../utils/chart'
import type { HeatmapOverviewData } from '.'

const props = defineProps({
  widget: {
    type: Object as vue.PropType<ClientWidget<HeatmapOverviewData>>,
    required: true,
  },
})

const data = vue.computed<HeatmapOverviewData | undefined>(() => {
  return props.widget.data.value
})
const labels = vue.computed<string[]>(() => {
  const out
    = data.value?.clickChart.main.map(_ => _.label).filter(Boolean) || []

  return out as string[]
})
const datasets = vue.computed<DataSet[]>(() => {
  const main = data.value?.clickChart.main || []
  return [
    {
      label: 'interactions',
      data: main.map(_ => _.interactions) || [],
      presentIndex: main?.findIndex(_ => _.tense === 'present'),
    },
  ]
})

const counters = [
  {
    name: 'clicks',
    count: vue.computed(() => {
      return data.value?.clickChart.mainTotals?.clicks ?? 0
    }),
  },
  {
    name: 'interactions',
    count: vue.computed(() => {
      return data.value?.clickChart.mainTotals?.interactions ?? 0
    }),
  },
]
</script>

<template>
  <div class="flex h-full flex-col space-y-3 p-4">
    <div class="grow space-y-3">
      <WidgetCounts :counters="counters" />

      <WidgetChartBar :labels="labels" :datasets="datasets" />

      <WidgetList
        :data="data?.topPages.main || []"
        :totals="data?.topPages.mainTotals"
        :limit="5"
      />
    </div>

    <div>
      <ElButton btn="default" size="xs">
        View Heatmaps
      </ElButton>
    </div>
  </div>
</template>
