<script lang="ts" setup>
import type { Widget } from '@fiction/admin/dashboard/widget'
import type { FictionAnalytics, MetricDisplayItem } from '@fiction/analytics'
import WidgetWrap from '@fiction/admin/dashboard/WidgetWrap.vue'
import { MetricDisplayFactory } from '@fiction/analytics/displayMetricFactory'
import { useService, vue } from '@fiction/core'
import XNumber from '@fiction/ui/common/XNumber.vue'
import SuperChart from './SuperChart.vue'

const { widget } = defineProps<{ widget: Widget }>()

const service = useService<{ fictionAnalytics: FictionAnalytics }>()

const items: MetricDisplayItem[] = [
  {
    key: 'totalAudience',
    type: 'snapshot',
    events: ['subscriptionTotalActive'],
    title: 'Total Audience',
    icon: 'i-tabler-users',
    displayFormat: 'primary',
    suffix: 'followers',
    changeLabel: 'vs. last month',
    format: 'abbreviatedInteger',
  },
  {
    key: 'siteTraffic',
    type: 'event',
    selector: 'uniq(anonymousId)',
    title: 'Site Traffic',
    suffix: 'unique visitors',
    icon: 'i-tabler-world',
    displayFormat: 'secondary',
    changeLabel: '30 day avg',
    format: 'abbreviatedInteger',
  },
  {
    key: 'wordsPublished',
    type: 'snapshot',
    events: ['contentTotalWordsPosts', 'contentTotalWordsSites'],
    title: 'Words Published',
    suffix: 'words',
    icon: 'i-tabler-file-text',
    displayFormat: 'secondary',
    changeLabel: 'This week',
    format: 'abbreviatedInteger',
  },
  {
    key: 'emailList',
    type: 'snapshot',
    suffix: 'subscribers',
    events: ['subscriptionTotalActive'],
    title: 'Email List',
    icon: 'i-tabler-mail',
    displayFormat: 'detailed',
    format: 'abbreviatedInteger',
  },
]

const factory = new MetricDisplayFactory('MetricDisplayFactory', { ...service, items })

// Initialize on mount
vue.onMounted(async () => {
  await factory.init()
})
</script>

<template>
  <WidgetWrap :widget="widget">
    <div v-if="factory.loading.value" class="p-12 text-center text-theme-500 text-xs">
      Loading metrics...
    </div>

    <div v-else-if="factory.error.value" class="p-12 text-center text-red-500">
      {{ factory.error }}
    </div>

    <div v-else class="space-y-6">
      <!-- Primary Metric -->
      <div
        v-if="factory.grouped.value.primary"
        class="rounded-2xl"
        :data-number-format="factory.grouped.value.primary.format || 'none'"
        :data-number-value="factory.grouped.value.primary.value"
      >
        <div class="flex justify-between items-start">
          <div>
            <div class="flex items-center gap-2 text-theme-500 dark:text-theme-400 mb-2">
              <i :class="[factory.grouped.value.primary.icon]" class="text-lg opacity-80" />
              <span>{{ factory.grouped.value.primary.title }}</span>
            </div>
            <div class="flex items-baseline gap-2">
              <XNumber
                :format="factory.grouped.value.primary.format"
                animate
                class="text-4xl lg:text-5xl font-medium tracking-tight x-font-title"
                :model-value="factory.grouped.value.primary.value"
              />
              <span class="text-theme-500 dark:text-theme-400 text-lg">{{ factory.grouped.value.primary.suffix }}</span>
            </div>
          </div>
          <div class="relative w-[300px] aspect-[4/1]">
            <SuperChart
              :data="factory.grouped.value.primary.data"
              line-color="var(--primary-400)"
              area-color="var(--primary-400)"
              date-format="MMM D"
            />
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
              <div class="text-sm text-theme-500 dark:text-theme-400">
                {{ metric.title }}
              </div>

              <div class="flex items-baseline gap-2">
                <XNumber
                  :format="metric.format"
                  animate
                  class="text-2xl font-medium x-font-title"
                  :model-value="metric.value"
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
              />
            </div>
            <div>
              <div
                class="text-lg flex items-center justify-end"
                :class="metric.change >= 0 ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'"
              >
                <i :class="[metric.change >= 0 ? 'i-tabler-arrow-up' : 'i-tabler-arrow-down']" />
                <XNumber
                  class="font-semibold"
                  :model-value="metric.change"
                  animate
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
      <div class="grid grid-cols-3 gap-4">
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
              class="text-2xl font-medium x-font-title"
              :model-value="metric.value"
            />
            <span class="text-theme-400 dark:text-theme-600 text-xs">{{ metric.suffix }}</span>
          </div>
          <div class="flex items-center gap-1">
            <i
              class="text-sm"
              :class="[
                metric.change >= 0
                  ? 'i-tabler-trending-up text-green-500 dark:text-green-400'
                  : 'i-tabler-trending-down text-red-500 dark:text-red-400',
              ]"
            />
            <XNumber
              class="text-sm font-semibold"
              :class="metric.change >= 0
                ? 'text-green-500 dark:text-green-400'
                : 'text-red-500 dark:text-red-400'"
              :model-value="metric.change"
              :data-change="metric.change"
              :data-value="metric.value"
              animate
            />
          </div>
          <div class="h-[20px] w-full mt-2">
            <SuperChart
              :data="metric.data"
              line-color="var(--primary-400)"
              area-color="var(--primary-400)"
              date-format="MMM D"
            />
          </div>
        </div>
      </div>
    </div>
  </WidgetWrap>
</template>
