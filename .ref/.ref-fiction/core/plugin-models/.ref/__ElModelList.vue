<script lang="ts" setup>
import { dayjs, vue } from '@factor/api'
import { useKaption } from '@kaption/core/utils'
import ElTable from '@kaption/core/ui/ElTable.vue'
import ElPanel from '@kaption/core/ui/ElPanel.vue'

const { factorRouter, kaptionAdmin, kaptionEvents } = useKaption()

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
  ]

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
      empty-text="No events found. Create one."
      :loading="indexState.status === 'loading'"
      :actions="[
        {
          name: 'New Event',
          btn: 'slate',
          route: factorRouter.link('eventNew'),
        },
      ]"
    />
  </ElPanel>
</template>
