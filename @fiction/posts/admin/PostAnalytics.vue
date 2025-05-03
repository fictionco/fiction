<script lang="ts" setup>
import type { DataPointChart, FictionAnalytics, MetricDisplayItem, MetricDisplayItemWithData } from '@fiction/analytics'
import type { Card } from '@fiction/site'
import type { Post } from '../post'
import SuperChart from '@fiction/admin/widgets/SuperChart.vue'
import { MetricDisplayFactory } from '@fiction/analytics/displayMetricFactory'
import { dayjs, useService, vue } from '@fiction/core'
import XNumber from '@fiction/ui/common/XNumber.vue'
import ElSpinner from '@fiction/ui/loaders/ElSpinner.vue'

const { post, card } = defineProps<{ post: Post, card: Card }>()

const service = useService<{ fictionAnalytics: FictionAnalytics }>()

const items: MetricDisplayItem[] = [
  {
    key: 'emailsSent',
    type: 'event',
    selector: `countIf(event='emailDelivered')`,
    title: 'Emails Sent',
    icon: 'i-tabler-mail-fast',
    displayFormat: 'primary',
    suffix: 'emails',
    changeLabel: 'vs last period',
    format: 'abbreviatedInteger',
  },
  {
    key: 'deliveryRate',
    type: 'event',
    selector: `countIf(event='emailDelivered') / countIf(event='emailSent') * 100`,
    title: 'Delivery Rate',
    icon: 'i-tabler-check',
    displayFormat: 'secondary',
    suffix: 'delivered',
    changeLabel: 'vs last period',
    format: 'percent',
  },
  {
    key: 'openRate',
    type: 'event',
    selector: `countIf(event='emailOpened') / countIf(event='emailDelivered') * 100`,
    title: 'Open Rate',
    suffix: 'opened',
    icon: 'i-tabler-mail-opened',
    displayFormat: 'secondary',
    changeLabel: 'vs last period',
    format: 'percent',
  },
  {
    key: 'clickRate',
    type: 'event',
    selector: `countIf(event='emailClicked') / countIf(event='emailDelivered') * 100`,
    title: 'Click Rate',
    suffix: 'clicked',
    icon: 'i-tabler-click',
    displayFormat: 'detailed',
    changeLabel: 'vs last period',
    format: 'percent',
  },
  {
    key: 'uniqueOpens',
    type: 'event',
    selector: `uniq(emailId) - countIf(event='emailBounced') - countIf(event='emailDropped')`,
    title: 'Unique Opens',
    icon: 'i-tabler-eye',
    displayFormat: 'detailed',
    format: 'abbreviatedInteger',
  },
  {
    key: 'uniqueClicks',
    type: 'event',
    selector: `uniqIf(emailId, event='emailClicked')`,
    title: 'Unique Clicks',
    icon: 'i-tabler-hand-click',
    displayFormat: 'detailed',
    format: 'abbreviatedInteger',
  },
  {
    key: 'bounceRate',
    type: 'event',
    selector: `countIf(event='emailBounced') / countIf(event='emailSent') * 100`,
    title: 'Bounce Rate',
    icon: 'i-tabler-mail-off',
    displayFormat: 'detailed',
    format: 'percent',
    invert: true,
  },
  {
    key: 'complaintRate',
    type: 'event',
    selector: `countIf(event='emailComplaint') / countIf(event='emailDelivered') * 100`,
    title: 'Complaint Rate',
    icon: 'i-tabler-alert-triangle',
    displayFormat: 'detailed',
    format: 'percent',
    invert: true,
  },
  {
    key: 'unsubscribeRate',
    type: 'event',
    selector: `countIf(event='emailUnsubscribe') / countIf(event='emailDelivered') * 100`,
    title: 'Unsubscribe Rate',
    icon: 'i-tabler-user-off',
    displayFormat: 'detailed',
    format: 'percent',
    invert: true,
  },
]

const factory = new MetricDisplayFactory('EmailDeliverabilityMetrics', { ...service, items })

// Initialize on mount
vue.onMounted(() => {
  vue.watch(
    () => post.postId,
    async (v) => {
      if (v) {
        await factory.load({ params: { filters: [{ name: 'postId', value: post.postId, operator: '=' }] } })
      }
    },
    { immediate: true },
  )
})

function setHoveredMetric(args: { metric: MetricDisplayItemWithData, point: DataPointChart | null, index: number | null }) {
  const { metric, point } = args

  // Don't set hover state during loading
  if (factory.loading.value)
    return

  if (!point) {
    factory.hovered.value = undefined
    return
  }

  factory.hovered.value = {
    ...metric,
    value: point.value as number,
    suffix: dayjs(point.date).format('MMM D'),
  }
}

function isMetricPositive(metric: MetricDisplayItemWithData) {
  return metric.change >= 0 || (metric.invert && metric.change < 0)
}

const loading = vue.computed(() => factory.loading.value)
</script>

<template>
  <div class="border border-theme-200 dark:border-theme-500/50 md:p-6 p-4 rounded-md shadow-md">
    <div v-if="loading" class="p-16 text-center text-theme-500 text-xs flex justify-center items-center gap-4">
      <ElSpinner class="size-6" />
    </div>

    <div v-else-if="factory.error.value" class="p-12 text-center text-red-500">
      {{ factory.error.value }}
    </div>

    <div v-else class="space-y-6">
      <!-- Primary Metric -->
      <div
        v-for="metric in factory.grouped.value.primary"
        :key="metric.key"
        class="rounded-2xl"
        :data-number-format="metric.format || 'none'"
        :data-number-value="metric.value"
      >
        <div class="flex justify-between items-center">
          <div class="shrink-0">
            <div class="flex items-center gap-2 text-xs md:text-base text-theme-500 dark:text-theme-400 mb-2 whitespace-nowrap">
              <i :class="[metric.icon]" class="text-base md:text-lg opacity-80" />
              <span>{{ metric.title }}</span>
            </div>
            <div class="flex items-baseline gap-2">
              <XNumber
                :format="metric.format"
                animate
                class="text-4xl lg:text-5xl font-semibold tracking-tight x-font-title"
                :model-value="metric.value"
                :loading="loading"
              />
              <span class="text-theme-500 dark:text-theme-400 text-lg">{{ metric.suffix }}</span>
            </div>
            <div class="flex gap-2 items-center">
              <div
                class="text-lg flex items-center"
                :class="isMetricPositive(metric) ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'"
              >
                <i :class="[isMetricPositive(metric) ? 'i-tabler-arrow-up-right' : 'i-tabler-arrow-down-right']" />
                <XNumber
                  class="font-semibold"
                  :model-value="metric.change"
                  animate
                  :loading="loading"
                />
              </div>
              <div class="text-xs text-theme-500 dark:text-theme-400 mt-0.5">
                {{ metric.changeLabel }}
              </div>
            </div>
          </div>

          <div class="text-right flex justify-end items-center gap-6">
            <div class="aspect-[7/2] w-[120px] md:w-[300px]">
              <SuperChart
                :data="metric.data"
                line-color="var(--primary-400)"
                area-color="var(--primary-400)"
                date-format="MMM D"
                :loading="loading"
                @point-hover="setHoveredMetric({ ...$event, metric })"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Secondary Metrics -->
      <div class="divide-y divide-theme-200/10">
        <div
          v-for="metric in factory.grouped.value.secondary"
          :key="metric.key"
          class="py-4 flex items-center justify-between"
        >
          <div class="flex items-center gap-3">
            <div class="size-8 rounded-lg flex items-center justify-center bg-primary-500/10">
              <i :class="[metric.icon]" class="text-primary-500 dark:text-primary-400 text-lg" />
            </div>
            <div>
              <div class="text-xs md:text-sm text-theme-500 dark:text-theme-400">
                {{ metric.title }}
              </div>

              <div class="flex items-baseline gap-2">
                <XNumber
                  :format="metric.format"
                  animate
                  class="text-2xl font-semibold x-font-title"
                  :model-value="metric.value"
                  :loading="loading"
                />
                <span class="text-theme-400 dark:text-theme-600 text-xs">{{ metric.suffix }}</span>
              </div>
            </div>
          </div>
          <div class="text-right flex justify-end items-center gap-6">
            <div class="aspect-[4/1] h-[20px]">
              <SuperChart
                :data="metric.data"
                line-color="var(--primary-400)"
                area-color="var(--primary-400)"
                date-format="MMM D"
                :loading="loading"
                @point-hover="setHoveredMetric({ ...$event, metric })"
              />
            </div>
            <div>
              <div
                class="text-lg flex items-center justify-end"
                :class="isMetricPositive(metric)
                  ? 'text-green-500 dark:text-green-400'
                  : 'text-red-500 dark:text-red-400'"
              >
                <i
                  :class="[isMetricPositive(metric) ? 'i-tabler-arrow-up' : 'i-tabler-arrow-down']"
                />
                <XNumber
                  class="font-semibold"
                  :model-value="metric.change"
                  animate
                  :loading="loading"
                />
              </div>
              <div class="text-xs text-theme-500 dark:text-theme-400 mt-0.5">
                {{ metric.changeLabel }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Detailed Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          v-for="metric in factory.grouped.value.detailed"
          :key="metric.key"
          class="p-4 rounded-xl bg-theme-50/50 dark:bg-theme-800/50"
        >
          <div class="flex items-center gap-2 mb-1">
            <i :class="[metric.icon]" class="text-lg text-primary-500 dark:text-primary-400" />
            <span class="text-sm text-theme-500 dark:text-theme-400">{{ metric.title }}</span>
          </div>

          <div class="flex items-baseline gap-2">
            <XNumber
              :format="metric.format"
              animate
              class="text-2xl font-semibold x-font-title"
              :model-value="metric.value"
              :loading="loading"
            />
            <span class="text-theme-400 dark:text-theme-600 text-xs">{{ metric.suffix }}</span>
          </div>
          <div class="flex items-center gap-1">
            <i
              class="text-sm"
              :class="[
                isMetricPositive(metric)
                  ? 'i-tabler-trending-up text-green-500 dark:text-green-400'
                  : 'i-tabler-trending-down text-red-500 dark:text-red-400',
              ]"
            />
            <XNumber
              class="text-sm font-semibold"
              :class="isMetricPositive(metric)
                ? 'text-green-500 dark:text-green-400'
                : 'text-red-500 dark:text-red-400'"
              :model-value="metric.change"
              :data-change="metric.change"
              :data-value="metric.value"
              animate
              :loading="loading"
            />
          </div>
          <div class="h-[20px] w-full mt-2">
            <SuperChart
              :data="metric.data"
              line-color="var(--primary-400)"
              area-color="var(--primary-400)"
              date-format="MMM D"
              :loading="loading"
              @point-hover="setHoveredMetric({ ...$event, metric })"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
