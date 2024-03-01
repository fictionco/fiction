<script lang="ts" setup>
import type {
  ActionItem,
} from '@factor/api'
import {
  displayDateTime,
  displayDomain,
  formatNumber,
  vue,
} from '@factor/api'
import type { TableCell } from '@factor/ui/ElTable.vue'
import ElTable from '@factor/ui/ElTable.vue'
import type { ClientWidget, DataCompared } from '@factor/api/plugin-dashboards'
import { useKaption } from '../../utils'
import type { ReplaySessionEvent } from '../types'
import { getReplayId } from '../utils'

const props = defineProps({
  widget: {
    type: Object as vue.PropType<
      ClientWidget<DataCompared<ReplaySessionEvent>>
    >,
    default: () => {},
  },
})
const { factorRouter } = useKaption()
const actions: ActionItem[] = [
  {
    name: 'Settings',
    btn: 'primary',
    link: factorRouter.link(`projectSettings`),
  },
]

function getLocation(session: Partial<ReplaySessionEvent>): string {
  const location = [session.cityName, session.regionName].filter(Boolean)
  return location.length > 0 ? location.join(', ') : 'Unknown Location'
}

function getReferringDomain(session: Partial<ReplaySessionEvent>): string {
  const { referrer } = session

  const url = referrer ? new URL(referrer) : undefined

  return displayDomain(url?.host ?? '')
}

const sessions = vue.computed(() => {
  const data = props.widget.data.value ?? { main: [] }

  return data.main
})

const formattedData = vue.computed(() => {
  const rows = sessions.value.map((s) => {
    return [
      s.sessionId,
      {
        type: 'icon',
        iconClass: `fi text-theme-300 fis w-5 h-5 rounded-full fi-${
          s.countryCode?.toLowerCase() || 'unknown'
        }`,
        text: getLocation(s),
      } as const,
      formatNumber(s.replayDuration, 'duration'),
      s?.deviceType,
      getReferringDomain(s),
      s?.interactionTotal ?? 0,
      displayDateTime(s?.startedAt),
    ]
  })
  const r = [
    [
      '',
      'Location',
      'Duration',
      'Device',
      'Referrer',
      'Interactions',
      'Recorded',
    ],
    ...rows,
  ] as TableCell[][]

  return r
})

function rowLink(sessionId: string) {
  const session = sessions.value.find(s => s.sessionId === sessionId)

  if (!session)
    return

  return factorRouter.link('replaySingle', {
    replayId: getReplayId({
      sessionId,
      timestamp: session.timestamp,
    }),
  }).value
}
</script>

<template>
  <div class="replays-index">
    <ElTable
      :table="formattedData"
      :row-link="rowLink"
      :empty="{
        title: 'No replays found',
        description: 'Set up recordings to get started',
      }"
      :actions="actions"
    />
  </div>
</template>
