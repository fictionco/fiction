<script lang="ts" setup>
import type { Widget } from '@fiction/admin/dashboard/widget'
import type { DataCompared, DataPointChart, StandardPeriod } from '@fiction/analytics/types'
import type { NumberFormats } from '@fiction/core'
import WidgetWrap from '@fiction/admin/dashboard/WidgetWrap.vue'
import XNumber from '@fiction/ui/common/XNumber.vue'
import { computed } from 'vue'
import SuperChart from './SuperChart.vue'
import { generateTimeSeriesData } from './utils'

const { widget } = defineProps<{ widget: Widget }>()

type MetricData = DataCompared<DataPointChart>
type MetricFormat = 'primary' | 'secondary' | 'detailed'

interface ProcessedMetric {
  id: string
  title: string
  icon: string
  value: number
  change: number
  changePeriod: StandardPeriod
  format?: NumberFormats
  displayFormat: MetricFormat
  changeLabel?: string
  suffix?: string
  data: MetricData
}

interface MetricFactoryArgs {
  id: string
  title: string
  icon: string
  baseValue: number
  days: number
  volatility?: number
  trend?: number
  format?: NumberFormats
  displayFormat: MetricFormat
  changeLabel?: string
  suffix?: string
}

class MetricFactory {
  static processTimeSeriesData(data: MetricData): { value: number, change: number } {
    const mainData = data.main || []
    const value = Number(data.mainTotals?.count || 0)

    // Calculate change using comparison data if available
    const change = data.compareTotals
      ? Number(data.mainTotals?.count || 0) - Number(data.compareTotals?.count || 0)
      : mainData.length > 1
        ? Number(mainData[mainData.length - 1]?.count || 0) - Number(mainData[0]?.count || 0)
        : 0

    return { value, change }
  }

  static createMetric(args: MetricFactoryArgs): ProcessedMetric {
    const data = generateTimeSeriesData({
      days: args.days,
      baseValue: args.baseValue,
      volatility: args.volatility || 0.1,
      trend: args.trend || 0.005,
    })

    const { value, change } = this.processTimeSeriesData(data)

    return {
      id: args.id,
      title: args.title,
      icon: args.icon,
      value,
      change,
      changePeriod: 'month',
      format: args.format || 'number',
      displayFormat: args.displayFormat,
      changeLabel: args.changeLabel,
      suffix: args.suffix,
      data,
    }
  }
}

// Define metrics using the updated factory
const metrics = computed(() => [
  // Primary metric
  MetricFactory.createMetric({
    id: 'total-audience',
    title: 'Total Audience',
    icon: 'i-tabler-users',
    baseValue: 2500,
    days: 60,
    volatility: 0.05,
    trend: 0.008,
    displayFormat: 'primary',
    suffix: 'followers',
    changeLabel: 'vs. last month',
  }),
  // Secondary metrics
  MetricFactory.createMetric({
    id: 'site-traffic',
    title: 'Site Traffic',
    icon: 'i-tabler-world',
    baseValue: 14000,
    days: 30,
    volatility: 0.15,
    trend: 0.005,
    displayFormat: 'secondary',
    changeLabel: '30 day avg',
  }),
  MetricFactory.createMetric({
    id: 'words-published',
    title: 'Words Published',
    icon: 'i-tabler-file-text',
    baseValue: 22000,
    days: 30,
    volatility: 0.08,
    trend: 0.003,
    displayFormat: 'secondary',
    changeLabel: 'This week',
  }),

  MetricFactory.createMetric({
    id: 'email-list',
    title: 'Email List',
    icon: 'i-tabler-mail',
    baseValue: 375,
    days: 30,
    volatility: 0.15,
    trend: 0.01,
    displayFormat: 'detailed',
  }),
])

const primaryMetric = computed(() => metrics.value.find(m => m.displayFormat === 'primary'))
const secondaryMetrics = computed(() => metrics.value.filter(m => m.displayFormat === 'secondary'))
const detailedMetrics = computed(() => metrics.value.filter(m => m.displayFormat === 'detailed'))
</script>

<template>
  <WidgetWrap :widget="widget">
    <div class="space-y-6">
      <!-- Primary Metric -->
      <div v-if="primaryMetric" class="rounded-2xl">
        <div class="flex justify-between items-start">
          <div>
            <div class="flex items-center gap-2 text-theme-500 dark:text-theme-400 mb-2">
              <i :class="[primaryMetric.icon]" class="text-lg opacity-80" />
              <span>{{ primaryMetric.title }}</span>
            </div>
            <div class="flex items-baseline gap-2">
              <XNumber
                :format="primaryMetric.format"
                :animate="true"
                class="text-4xl lg:text-5xl font-medium tracking-tight x-font-title"
                :model-value="primaryMetric.value"
              />
              <span class="text-theme-500 dark:text-theme-400 text-lg">{{ primaryMetric.suffix }}</span>
            </div>
          </div>
          <div class="relative w-[300px] aspect-[4/1]">
            <SuperChart
              :data="primaryMetric.data"
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
          v-for="metric in secondaryMetrics"
          :key="metric.id"
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
              <XNumber
                :format="metric.format"
                :animate="true"
                class="text-2xl font-medium x-font-title"
                :model-value="metric.value"
              />
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
              <div class="text-lg flex items-center justify-end" :class="metric.change >= 0 ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'">
                <i
                  :class="[
                    metric.change >= 0 ? 'i-tabler-arrow-up' : 'i-tabler-arrow-down ',
                  ]"
                />
                <XNumber
                  class="font-semibold"
                  :model-value="metric.change"
                  :animate="true"
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
          v-for="metric in detailedMetrics"
          :key="metric.id"
          class="p-4 rounded-xl bg-theme-50/50 dark:bg-theme-800/50 "
        >
          <div class="flex items-center gap-2 mb-1">
            <i :class="[metric.icon]" class="text-lg text-primary-500 dark:text-primary-400" />
            <span class="text-sm text-theme-500 dark:text-theme-400">{{ metric.title }}</span>
          </div>
          <XNumber
            :format="metric.format"
            :animate="true"
            class="text-2xl font-medium x-font-title"
            :model-value="metric.value"
          />
          <div class="flex items-center gap-1">
            <i
              class="text-sm"
              :class="[
                metric.change >= 0 ? 'i-tabler-trending-up text-green-500 dark:text-green-400' : 'i-tabler-trending-down text-red-500 dark:text-red-400',
              ]"
            />
            <XNumber
              class="text-sm font-semibold"
              :class="metric.change >= 0 ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'"
              :model-value="metric.change"
              :data-change="metric.change"
              :data-value="metric.value"
              :animate="true"
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
