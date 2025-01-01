<script lang="ts" setup>
import type { ComparePeriods, DataCompared, DataPointChart, TimeLineInterval } from '@fiction/analytics/types'
import type { NumberFormats } from '@fiction/core'
import { computed, onMounted, ref } from 'vue'

const {
  data,
  valueKey = 'count',
  valueFormat = 'number',
  interval = 'day',
  comparePeriod = 'period',
  colors = {},
  showDots = true,
} = defineProps<{
  data: DataCompared<DataPointChart>
  valueKey?: string
  valueFormat?: NumberFormats
  interval?: TimeLineInterval
  comparePeriod?: ComparePeriods
  colors?: Partial<{
    line: string
    area: string
    dots: string
  }>
  showDots?: boolean
}>()

const container = ref<HTMLDivElement>()
const chartRef = ref<SVGElement>()
const dimensions = ref({ width: 0, height: 0 })

const margin = { top: 2, right: 2, bottom: 2, left: 2 }
const points = computed(() => data?.main || [])

// Generate unique IDs for patterns and gradients
const uniqueId = Math.random().toString(36).substr(2, 9)
const patternId = `sparklineDots-${uniqueId}`
const gradientId = `sparklineGradient-${uniqueId}`
const maskId = `sparklineMask-${uniqueId}`

const pathData = computed(() => {
  const values = points.value.map(p => Number(p[valueKey] || 0))
  if (!values.length)
    return {}

  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min

  const xScale = (i: number) => {
    const x = margin.left + (i / Math.max(1, points.value.length - 1)) * (dimensions.value.width - margin.left - margin.right)
    return Number.isNaN(x) ? margin.left : x // Fallback to left margin if NaN
  }

  const yScale = (v: number) => {
    const y = margin.top + (1 - ((v - min) / range)) * (dimensions.value.height - margin.top - margin.bottom)
    return Number.isNaN(y) ? dimensions.value.height - margin.bottom : y // Fallback to bottom if NaN
  }
  const path = points.value
    .map((point, i) => {
      const x = xScale(i)
      const y = yScale(Number(point[valueKey] || 0))
      return `${i === 0 ? 'M' : 'L'}${x},${y}`
    })
    .join(' ')

  return {
    line: path,
    area: `${path} L${dimensions.value.width - margin.right},${dimensions.value.height - margin.bottom} L${margin.left},${dimensions.value.height - margin.bottom} Z`,
  }
})

// Resize observer to make the chart responsive
onMounted(() => {
  if (!container.value)
    return

  const resizeObserver = new ResizeObserver((entries) => {
    const entry = entries[0]
    if (entry) {
      dimensions.value = {
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      }
    }
  })

  resizeObserver.observe(container.value)

  // Initial dimensions
  dimensions.value = {
    width: container.value.clientWidth,
    height: container.value.clientHeight,
  }
})

defineExpose({
  chartElement: chartRef,
})
</script>

<template>
  <div ref="container" class="relative h-full w-full">
    <svg
      ref="chartRef"
      :width="dimensions.width"
      :height="dimensions.height"
      class="absolute inset-0 text-primary-500 "
      :viewBox="`0 0 ${dimensions.width} ${dimensions.height}`"
      preserveAspectRatio="none"
    >
      <defs>
        <pattern
          :id="patternId"
          :width="4"
          :height="4"
          patternUnits="userSpaceOnUse"
        >
          <rect :width="4" :height="4" fill="transparent" />
          <circle
            cx="1"
            cy="1"
            r="1"
            class="text-primary-500 "
            style="fill: currentColor; opacity: 0.2;"
          />
        </pattern>

        <!-- Area gradient -->
        <linearGradient :id="gradientId" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" class="text-primary-500 " style="stop-color: currentColor; stop-opacity: 0.2" />
          <stop offset="100%" class="text-primary-500 " style="stop-color: currentColor; stop-opacity: 0" />
        </linearGradient>

        <!-- Mask for dots to only show under the area -->
        <mask :id="maskId">
          <path
            v-if="pathData.area"
            :d="pathData.area"
            fill="white"
          />
        </mask>
      </defs>

      <!-- Background pattern (masked to only show under the area) -->
      <rect
        v-if="showDots"
        width="100%"
        height="100%"
        :fill="`url(#${patternId})`"
        :mask="`url(#${maskId})`"
      />

      <!-- Area fill -->
      <path
        v-if="pathData.area"
        :d="pathData.area"
        :fill="`url(#${gradientId})`"
      />

      <!-- Line -->
      <path
        v-if="pathData.line"
        :d="pathData.line"
        class="stroke-primary-500"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        fill="none"
      />
    </svg>
  </div>
</template>
