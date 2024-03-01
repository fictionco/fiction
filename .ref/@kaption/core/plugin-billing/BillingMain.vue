<script lang="ts" setup>
import { dayjs, formatNumber, standardDate, toLabel, vue } from '@factor/api'
import type { UsageReport } from '@factor/api/plugin-admin/query'
import ElButton from '../ui/ElButton.vue'
import { useKaption } from '../utils'
import type { CreatedChart } from '../utils/chart'
import { createLineChart } from '../utils/chart'
import BillingWrap from './BillingWrap.vue'

const { factorRouter, factorAdmin, factorUser, kaptionBilling } = useKaption()

type Totals = {
  [k in keyof UsageReport]?: number
}

const chartTypes: (keyof UsageReport)[] = ['sessions', 'events']

const usageData = vue.ref<UsageReport[]>([])
const totals = vue.ref<Totals>({
  sessions: 0,
  events: 0,
})

const dateRange = vue.computed(() => {
  const unixStartAt
    = kaptionBilling.activeSubscription.value?.current_period_start
  const unixEndAt = kaptionBilling.activeSubscription.value?.current_period_end
  const timeStartAt = unixStartAt
    ? dayjs.unix(unixStartAt)
    : dayjs().subtract(1, 'month')

  const timeEndAt = unixEndAt ? dayjs.unix(unixEndAt) : dayjs()
  return {
    timeEndAt,
    timeEndAtIso: timeEndAt.toISOString(),
    timeStartAt,
    timeStartAtIso: timeStartAt.toISOString(),
  }
})

async function setUsageData(organizationId: string): Promise<void> {
  const r = await factorAdmin.requests.ManageUsage.request({
    _action: 'retrieve',
    organizationId,
    ...dateRange.value,
  })

  if (r.status === 'success')
    usageData.value = r.data ?? []
}
vue.watch(
  () => factorAdmin.activeOrganization.value?.organizationId,
  async (v) => {
    if (v)
      await setUsageData(v)
  },
  { immediate: true },
)

function sumValues(values: (number | undefined)[], initialValue = 0): number {
  const numberValues = values.filter(Boolean) as number[]

  return numberValues.reduce((a, b) => a + b, initialValue)
}

vue.onMounted(async () => {
  await factorUser.userInitialized()

  const charts: {
    el: HTMLCanvasElement | null
    type: keyof UsageReport
    chart: CreatedChart<'line'> | undefined
  }[] = chartTypes.map((type) => {
    const el = document.querySelector(
      `#${type}Chart`,
    ) as HTMLCanvasElement | null
    const chart = el
      ? createLineChart({
        el,
        opts: { options: { aspectRatio: 5, maintainAspectRatio: true } },
      })
      : undefined
    return { el, type, chart }
  })

  vue.watch(
    () => usageData.value,
    (v) => {
      if (v) {
        const labels = v?.map(_ => standardDate(_.timestamp))

        charts.forEach((ch) => {
          if (ch.chart) {
            const data = v?.map(_ => +_[ch.type])
            totals.value[ch.type] = sumValues(data)
            ch.chart.setData({
              labels,
              datasets: [{ data, label: ch.type }],
            })
          }
        })
      }
    },
    { immediate: true, deep: true },
  )
})
</script>

<template>
  <BillingWrap>
    <div class="mx-auto block lg:flex lg:space-x-12">
      <div class="grow">
        <ul class="mb-8 divide-y divide-slate-200">
          <li class="flex items-center justify-between py-4">
            <div class="text-theme-500 font-medium hover:text-primary-500">
              <span class="mr-2">Tracked Users</span>
              <span class="text-theme-300">({{ dateRange.timeStartAt.format("MMM DD") }} to
                {{ dateRange.timeEndAt.format("MMM DD") }})</span>
            </div>
            <div class="font-bold text-primary-500 hover:bg-primary-50">
              {{ formatNumber(totals.sessions, "abbreviated") }}
            </div>
          </li>
        </ul>
        <div class="mb-8">
          <div
            v-for="(ch, i) in chartTypes"
            :key="i"
            class="relative mb-4 rounded-md border border-slate-200 p-4"
          >
            <div class="flex justify-between">
              <span class="text-theme-500 mb-4 font-semibold">{{ toLabel(ch) }}
                <span class="opacity-50">({{ formatNumber(totals[ch], "abbreviated") }})</span></span>
              <span class="text-theme-300">{{ dateRange.timeStartAt.format("MMM DD") }} to
                {{ dateRange.timeEndAt.format("MMM DD") }}</span>
            </div>
            <div
              v-if="totals[ch] === 0"
              class="text-theme-300 py-8 text-center font-semibold"
            >
              No Data
            </div>
            <canvas v-show="totals[ch]" :id="`${ch}Chart`" />
          </div>
        </div>
      </div>
      <div class="lg:w-96 lg:max-w-xs">
        <div
          class="mb-8 rounded-xl border border-slate-200 p-4 lg:flex lg:items-center lg:justify-between"
        >
          <div class="divide-y divide-slate-200">
            <h2 class="text-lg font-semibold">
              <div>Current Plan:</div>
              <span class="text-primary-500">{{ toLabel(kaptionBilling.activePlan.value?.name) }}
                <span
                  v-if="kaptionBilling.activePlan.value?.status"
                  class="opacity-50"
                >({{ kaptionBilling.activePlan.value?.status }})</span></span>
            </h2>
            <div
              v-if="kaptionBilling.activePlan.value?.name === 'free'"
              class="mt-4 pt-4"
            >
              <h2 class="mt-2 font-semibold">
                The Free Plan
              </h2>
              <p class="text-theme-500 mt-1 text-sm">
                When using the free plan, you will collect a limited amount of
                traffic data (up to 5k sessions) and provide access to basic
                tools and dashboards.
              </p>
            </div>

            <div class="mt-4 pt-4">
              <h2 class="mt-2 font-semibold">
                About Responses
              </h2>
              <p class="text-theme-500 mt-1 text-sm">
                A response is any form of qualitative feedback via form or
                survey.
              </p>
            </div>

            <div class="mt-4 pt-4">
              <h2 class="mt-2 font-semibold">
                Tracked Users
              </h2>
              <p class="text-theme-500 mt-1 text-sm">
                Each user session counts as a tracked user. These are groups of
                user interactions with your properties over a given time frame.
              </p>
            </div>
          </div>
        </div>

        <div
          v-if="kaptionBilling.activePlan.value?.name === 'free'"
          class="mb-8 rounded-xl border border-slate-200 p-4"
        >
          <div>
            <h2 class="text-lg font-semibold">
              Ready to Go Pro?
            </h2>
            <div class="text-theme-500 text-sm">
              Try Pro free for 14 days.
            </div>
          </div>
          <div class="mt-4">
            <ElButton btn="primary" :to="factorRouter.to('billing')">
              Start free trial &rarr;
            </ElButton>
          </div>
        </div>
      </div>
    </div>
  </BillingWrap>
</template>
