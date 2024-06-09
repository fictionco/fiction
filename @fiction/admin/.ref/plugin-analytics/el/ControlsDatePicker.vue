<script lang="ts" setup>
import { dayjs, onResetUi, resetUi, vue, vueRouter } from '@factor/api'
import ElButton from '../../ui/ElButton.vue'
import { useKaption } from '../../utils'
import ElControl from './ElControl.vue'

defineProps({
  title: { type: String, default: '' },
})

const { kaptionDashboard } = useKaption()

const filter = kaptionDashboard.kaptionFilter

const daysOfWeek = ['s', 'm', 't', 'w', 't', 'f', 's']
interface DateRange {
  name?: string
  timeStartAt?: string
  timeEndAt?: string
}
type SelectedDay = '' | 'start' | 'end' | 'between' | 'future'

const router = vueRouter.useRouter()
const active = vue.ref(false)
const selectedRange = vue.ref<DateRange>({
  timeStartAt: undefined,
  timeEndAt: undefined,
})

const selectedMonth = vue.ref(filter.activeEndTime.value)

function show(): void {
  resetUi({ scope: 'all', cause: 'showDatePicker' })
  selectedRange.value = {
    timeStartAt: filter.activeStartTime.value,
    timeEndAt: filter.activeEndTime.value,
  }
  selectedMonth.value = filter.activeEndTime.value
  active.value = true
}

onResetUi(() => (active.value = false))

function selectDay(day?: string): void {
  // no future
  if (!day || dayjs(day).isAfter(dayjs().add(2, 'day')))
    return

  const { timeStartAt, timeEndAt } = selectedRange.value
  if (timeStartAt && !timeEndAt) {
    if (dayjs(day).isBefore(timeStartAt, 'day')) {
      selectedRange.value = {
        timeStartAt: filter.naiveIsoString(dayjs(day)),
        timeEndAt: timeStartAt,
      }
    }
    else {
      selectedRange.value.timeEndAt = filter.naiveIsoString(dayjs(day))
    }
  }
  else {
    selectedRange.value = { timeStartAt: filter.naiveIsoString(dayjs(day)) }
  }
}

const activeMonths = vue.computed(() => {
  const months = []
  const { timeStartAt, timeEndAt } = selectedRange.value
  for (let step = 0; step <= 1; step++) {
    const activeMonth = dayjs(selectedMonth.value).subtract(step, 'month')
    const monthName = activeMonth.format('MMMM')

    const days = []
    const daysInMonth = activeMonth.daysInMonth()
    const startDayOfWeek = +activeMonth.startOf('month').format('d')

    for (let step = 0; step <= 42; step++) {
      if (step >= startDayOfWeek && step <= daysInMonth + startDayOfWeek - 1) {
        const dayName = step - startDayOfWeek + 1
        const moment = activeMonth.date(dayName).startOf('day')

        let selected: SelectedDay = ''
        if (timeStartAt && dayjs(timeStartAt).isSame(moment, 'day'))
          selected = 'start'
        else if (timeEndAt && dayjs(timeEndAt).isSame(moment, 'day'))
          selected = 'end'
        else if (
          timeStartAt
          && timeEndAt
          && moment.isAfter(timeStartAt)
          && moment.isBefore(timeEndAt)
        )
          selected = 'between'
        else if (moment.isAfter(dayjs().add(1, 'day')))
          selected = 'future'

        days.push({
          name: dayName,
          moment,
          date: filter.naiveIsoString(moment),
          selected,
        })
      }
      else {
        days.push({ name: '' })
      }
    }
    months.unshift({
      name: monthName,
      year: activeMonth.format('YYYY'),
      moment: activeMonth,
      days,
    })
  }
  return months
})

function previousMonth(): void {
  selectedMonth.value = filter.naiveIsoString(
    dayjs(selectedMonth.value).subtract(1, 'month'),
  )
}

function nextMonth(): void {
  const next = dayjs(selectedMonth.value).add(1, 'month')
  if (!next.isAfter(dayjs(), 'month')) {
    selectedMonth.value = filter.naiveIsoString(
      dayjs(selectedMonth.value).add(1, 'month'),
    )
  }
}

const selectedRangeName = vue.computed(() => {
  const f = filter.dateRangeList().find((r) => {
    if (
      r.timeStartAt === filter.activeStartTime.value
      && r.timeEndAt === filter.activeEndTime.value
    )
      return true
    else return false
  })

  return f ? f.value : 'custom'
})

async function applyRange(): Promise<void> {
  const { timeStartAt } = selectedRange.value
  let { timeEndAt } = selectedRange.value
  const route = router.currentRoute.value

  if (!timeEndAt)
    timeEndAt = timeStartAt

  if (timeStartAt && timeEndAt) {
    await router.push({
      query: {
        ...route.query,
        from: timeStartAt,
        to: timeEndAt,
      },
    })
    resetUi({ scope: 'all', cause: 'applyDateRange' })
  }
}

const list = vue.computed(() => {
  const rangeList = filter.dateRangeList()

  return rangeList.map((r) => {
    return {
      name: r.name,
      value: r.value,
    }
  })
})
async function selectRange(rangeValue?: string): Promise<void> {
  const rangeList = filter.dateRangeList()
  if (!rangeValue)
    return
  const range = rangeList.find(v => v.value === rangeValue)
  const { timeStartAt, timeEndAt } = range || {}
  if (timeStartAt && timeEndAt) {
    selectedMonth.value = timeEndAt
    selectedRange.value = { timeStartAt, timeEndAt }
    await applyRange()
  }
}
</script>

<template>
  <div class="relative inline-block w-auto shrink-0" @click.stop>
    <div class="inline-flex">
      <ElControl
        class="mr-4 hidden md:block"
        :list="list"
        default-name="custom"
        :model-value="selectedRangeName"
        align-dropdown="left"
        @update:model-value="selectRange($event)"
      />

      <ElButton btn="default" @click.prevent="show()">
        <div class="whitespace-nowrap font-medium">
          {{ dayjs(filter.activeStartTime.value).format("MMM D") }}
        </div>
        <div class="sep flex items-center text-theme-400 lg:mx-2">
          -
        </div>
        <div class="whitespace-nowrap font-medium">
          {{ dayjs(filter.activeEndTime.value).format("MMM D") }}
        </div>
      </ElButton>
    </div>

    <transition
      enter-active-class="transition ease-out duration-150"
      enter-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-200"
      leave-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="active"
        class="absolute top-full z-30 mt-2 w-screen max-w-sm origin-top-left rounded-md bg-white shadow-2xl md:max-w-md lg:max-w-2xl xl:left-0 xl:origin-top-right"
      >
        <div
          class="select-none overflow-auto rounded-md shadow focus:outline-none"
        >
          <div
            class="flex flex-col items-center justify-between border-b border-slate-200 px-4 py-2 md:flex-row"
          >
            <dd class="mt-1 hidden justify-between md:flex">
              <div
                v-if="selectedRange.timeStartAt"
                class="whitespace-nowrap text-sm font-semibold"
              >
                {{ dayjs(selectedRange.timeStartAt).format("MMM DD, YYYY") }}
              </div>
              <div class="sep mx-4 flex items-center text-theme-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="ml-1 h-4 w-4 opacity-50"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div
                v-if="selectedRange.timeEndAt"
                class="whitespace-nowrap text-sm font-semibold"
              >
                {{ dayjs(selectedRange.timeEndAt).format("MMM DD, YYYY") }}
              </div>
            </dd>

            <div class="action mt-2 text-right lg:mt-0">
              <ElButton btn="primary" @click="applyRange()">
                Apply
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="ml-1 h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </ElButton>
            </div>
          </div>
          <div class="flex">
            <div
              class="hover:text-primary-500 absolute left-0 flex cursor-pointer items-center rounded-md bg-theme-50 p-2 text-theme-500 lg:relative"
              @click="previousMonth()"
            >
              <svg
                class="h-8 w-8"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </div>
            <div class="grid grow grid-cols-1 pt-6 lg:grid-cols-2 lg:pt-0">
              <div
                v-for="(month, i) in activeMonths"
                :key="i"
                class="p-2"
              >
                <div
                  class="flex items-baseline justify-center pb-2 text-xs font-bold uppercase text-theme-500"
                >
                  <span>{{ month.name }}</span>
                  <span class="ml-1 opacity-70">{{ month.year }}</span>
                </div>
                <div class="grid grid-cols-7 gap-y-1">
                  <div
                    v-for="(dom, ii) in daysOfWeek"
                    :key="ii"
                    class="pb-1 text-center text-[12px] font-bold uppercase text-theme-300 opacity-80"
                    v-text="dom"
                  />
                  <div v-for="(day, ii) in month.days" :key="ii">
                    <div
                      v-if="day.name"
                      class="flex justify-center text-sm"
                      :class="[
                        day.selected === 'future'
                          ? 'opacity-20'
                          : 'cursor-pointer',
                        day.selected ? 'bg-theme-100 text-gray-900' : '',
                      ]"
                      @click="selectDay(day.date)"
                    >
                      <div
                        class="flex h-8 w-full items-center justify-center rounded-md"
                        :class="[
                          day.selected !== 'future'
                            ? 'hover:bg-primary-500 hover:text-white'
                            : '',
                          day.selected === 'start' || day.selected === 'end'
                            ? 'bg-primary-500 text-white'
                            : '',
                        ]"
                      >
                        {{ day.name }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="hover:text-primary-500 absolute right-0 flex cursor-pointer items-center bg-theme-50 p-2 text-theme-500 lg:relative"
              @click="nextMonth()"
            >
              <svg
                class="h-8 w-8"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
