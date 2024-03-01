<script lang="ts" setup>
import { dayjs, resetUi, vue } from '@factor/api'
import type { TimeLineInterval } from '@factor/api/plugin-dashboards'
import { useKaption } from '../../utils'
import ElControl from './ElControl.vue'

const { kaptionDashboard, factorRouter } = useKaption()

async function selectInterval(interval: TimeLineInterval): Promise<void> {
  const route = factorRouter.router.currentRoute.value
  if (interval) {
    await factorRouter.push({
      query: {
        ...route.query,
        interval,
      },
    })
    resetUi({ scope: 'all', cause: 'selectInterval' })
  }
}

const selectedInterval = vue.computed<TimeLineInterval>(() => {
  const util = kaptionDashboard.kaptionFilter
  const f = util
    .intervalList()
    .find(_ => util.activeInterval.value === _.value)

  const end = dayjs(util.activeEndTime.value)
  const start = dayjs(util.activeStartTime.value)
  const autoInterval = end.diff(start, 'day') > 4 ? 'day' : 'hour'
  return (f?.value || autoInterval) as TimeLineInterval
})

const list = vue.computed(() => {
  return kaptionDashboard.kaptionFilter.intervalList()
})
</script>

<template>
  <ElControl
    :list="list"
    default-value="day"
    :model-value="selectedInterval"
    @update:model-value="selectInterval($event as TimeLineInterval)"
  />
</template>
