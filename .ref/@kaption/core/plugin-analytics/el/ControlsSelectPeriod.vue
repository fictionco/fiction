<script lang="ts" setup>
import type { ListItem } from '@factor/api'
import { onResetUi, resetUi, vue, vueRouter } from '@factor/api'
import type { ComparePeriods } from '@factor/api/plugin-dashboards'
import { useKaption } from '../../utils'
import ElControl from '../../ui/ElControl.vue'

defineProps({
  title: { type: String, default: '' },
})

const { kaptionDashboard, factorRouter } = useKaption()

const filter = kaptionDashboard.kaptionFilter

interface DateRange {
  name?: string
  timeStartAt?: string
  timeEndAt?: string
}

const router = vueRouter.useRouter()
const active = vue.ref(false)
const selectedRange = vue.ref<DateRange>({
  timeStartAt: undefined,
  timeEndAt: undefined,
})

const selectedMonth = vue.ref(filter.activeEndTime.value)

function show(): void {
  resetUi({ scope: 'all', cause: 'selectCompare' })
  selectedRange.value = {
    timeStartAt: filter.activeStartTime.value,
    timeEndAt: filter.activeEndTime.value,
  }
  selectedMonth.value = filter.activeEndTime.value
  active.value = true
}

onResetUi(() => (active.value = false))

async function selectCompare(compare: ComparePeriods): Promise<void> {
  const route = factorRouter.router.currentRoute.value
  if (compare) {
    await factorRouter.push({
      query: {
        ...route.query,
        compare,
      },
    })
    resetUi({ scope: 'all', cause: 'selectCompare' })
  }
}

const list = vue.computed<ListItem[]>(() => {
  const f = filter.compareDateRangeList().map((l) => {
    return {
      name: l.name,
      value: l.value,
      desc: `${l.timeStartAt.format('M/D/YY')} to ${l.timeEndAt.format(
        'M/D/YY',
      )}`,
    }
  })
  return f
})
</script>

<template>
  <ElControl
    :list="list"
    default-value="period"
    @update:model-value="selectCompare($event as ComparePeriods)"
  />
</template>
