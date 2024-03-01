<script lang="ts" setup>
import { dayjs, formatNumber, vue } from '@factor/api'
import type { ClientWidget } from '@factor/api/plugin-dashboards'
import ElTable from '@factor/ui/ElTable.vue'
import WidgetCounts from '../../ui/WidgetCounts.vue'
import ElButton from '../../ui/ElButton.vue'
import WidgetChartBar from '../../ui/WidgetChartBar.vue'
import { useKaption } from '../../utils'
import type { ReplayOverviewData } from '.'

const props = defineProps({
  widget: {
    type: Object as vue.PropType<ClientWidget<ReplayOverviewData>>,
    required: true,
  },
})
const { factorRouter } = useKaption()
const data = vue.computed<ReplayOverviewData | undefined>(() => {
  return props.widget.data.value
})

const formattedData = vue.computed(() => {
  const main = data.value?.recentReplays.main || []
  const rows = main.map((d) => {
    return [
      d.replayId,
      d.cityName || `(Not Set)`,
      d.interactionTotal,
      formatNumber(d.replayDuration, 'duration'),
      d.reason,
      dayjs(d.timestamp, { utc: true }).tz().format('h:mma'),
    ]
  })
  const r = [
    ['', 'Recording (City)', 'Actions', 'Duration', 'Reason', 'Time'],
    ...rows,
  ]

  return r
})

function rowLink(replayId: string) {
  return factorRouter.link('replaySingle', { replayId }).value
}

const labels = vue.computed<string[]>(() => {
  const out
    = data.value?.replayChart.main.map(_ => _.label).filter(Boolean) || []

  return out as string[]
})
const datasets = vue.computed<{ label: string, data: number[] }[]>(() => {
  const main = data.value?.replayChart.main || []
  const replays = main.map(_ => _.totalReplays ?? 0) || []
  const presentIndex = main.findIndex(_ => _.tense === 'present')

  return [
    {
      label: 'Replays',
      data: replays,
      presentIndex,
    },
  ]
})

const counters = [
  {
    name: 'Sessions',
    count: vue.computed(() => {
      return data.value?.replayChart.mainTotals?.totalSessions ?? 0
    }),
  },
  {
    name: 'Recordings',
    count: vue.computed(() => {
      return data.value?.replayChart.mainTotals?.totalReplays ?? 0
    }),
  },
]
</script>

<template>
  <div class="flex flex-col space-y-3 p-4">
    <div class="grow space-y-3">
      <WidgetCounts :counters="counters" />

      <WidgetChartBar :labels="labels" :datasets="datasets" />

      <ElTable
        :table="formattedData"
        size="xs"
        :row-link="rowLink"
        :empty="{
          title: 'No recordings yet',
          description: 'Have you set things up?',
        }"
      />
    </div>

    <div>
      <ElButton btn="default" size="xs">
        View Replays
      </ElButton>
    </div>
  </div>
</template>
