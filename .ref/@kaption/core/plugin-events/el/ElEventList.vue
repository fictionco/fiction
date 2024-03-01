<script lang="ts" setup>
import { dayjs, vue } from '@factor/api'
import type { TableCell } from '@factor/ui/ElTable.vue'
import ElTable from '@factor/ui/ElTable.vue'
import { useKaption } from '../../utils'
import ElPanel from '../../ui/ElPanel.vue'

const { factorRouter, factorAdmin, kaptionEvents } = useKaption()

const indexState = kaptionEvents.activeEventIndexState

vue.onMounted(async () => {
  await kaptionEvents.load({ _action: 'getIndex' })
})

const projectEvents = vue.computed(() => {
  if (!indexState.value.data)
    return []

  const events = indexState.value.data

  return events

  // .sort((a, b) =>
  //   (a?.updatedAt || 0) > (b?.updatedAt || 0) ? -1 : 1,
  // )
})

const formattedData = vue.computed(() => {
  const rows = projectEvents.value.map((ev) => {
    return [
      ev.eventId,
      ev.event,
      ev.conversion,
      ev.label,
      ev.value,
      ev.eventTrigger,
      dayjs(ev.updatedAt).format('MMM DD,YY'),
      {
        type: 'link',
        text: 'edit',
        path: (eventId: string) =>
          factorRouter.link('eventEdit', { eventId }).value,
      } as const,
    ]
  })
  const r = [
    ['', 'Name', 'Conversion', 'Label', 'Value', 'Trigger', 'Updated', ''],
    ...rows,
  ] as TableCell[][]

  return r
})

function rowLink(eventId: string) {
  return factorRouter.link('eventEdit', { eventId }).value
}
</script>

<template>
  <ElPanel title="Your Events">
    <ElTable
      :table="formattedData"
      :row-link="rowLink"
      :empty="{
        title: 'No custom events found',
        description: 'Create one to get started',
      }"
      :loading="indexState.status === 'loading'"
      :actions="[
        {
          name: 'New Event',
          link: factorRouter.link('eventNew'),
        },
      ]"
    />
  </ElPanel>
</template>
