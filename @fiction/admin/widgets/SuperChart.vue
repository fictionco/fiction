<script lang="ts" setup>
import type { ComparePeriods, DataCompared, DataPointChart, TimeLineInterval } from '@fiction/analytics/types'
import type { NumberFormats } from '@fiction/core'
import { computed, onMounted, ref } from 'vue'

defineOptions({ name: 'SuperChart' })

const props = defineProps<{
  data: DataCompared<DataPointChart>
  valueKey?: string
  valueFormat?: NumberFormats
  interval?: TimeLineInterval
  comparePeriod?: ComparePeriods
  colors?: Partial<{
    line: string
    area: string
    dots: string
    hover: string
  }>
  showDots?: boolean
}>()

const emit = defineEmits<{
  (event: 'pointHover', value: { point: DataPointChart | null, index: number | null }): void
}>()

// Helper to get x/y coordinates from mouse event relative to container
function getRelativeCoords(e: MouseEvent, container: HTMLElement) {
  const rect = container.getBoundingClientRect()
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  }
}

// Component state
const container = ref<HTMLElement>()
const chartRef = ref<SVGElement>()
const dimensions = ref({ width: 0, height: 0 })
const hoverX = ref<number | null>(null)
const activePointIndex = ref<number | null>(null)

// Chart configuration
const margin = { top: 2, right: 2, bottom: 2, left: 2 }
const points = computed(() => props.data?.main || [])

// Generate unique IDs
const uniqueId = Math.random().toString(36).substr(2, 9)
const patternId = `sparklineDots-${uniqueId}`
const gradientId = `sparklineGradient-${uniqueId}`
const maskId = `sparklineMask-${uniqueId}`

// Scaling functions
function getScales() {
  const values = points.value.map(p => Number(p[props.valueKey || 'value'] || 0))
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min

  return {
    xScale: (i: number) => {
      const x = margin.left + (i / Math.max(1, points.value.length - 1)) * (dimensions.value.width - margin.left - margin.right)
      return Number.isNaN(x) ? margin.left : x
    },
    yScale: (v: number) => {
      const y = margin.top + (1 - ((v - min) / range)) * (dimensions.value.height - margin.top - margin.bottom)
      return Number.isNaN(y) ? dimensions.value.height - margin.bottom : y
    },
  }
}

// Computed path data
const pathData = computed(() => {
  const { xScale, yScale } = getScales()

  const path = points.value
    .map((point, i) => {
      const x = xScale(i)
      const y = yScale(Number(point[props.valueKey || 'value'] || 0))
      return `${i === 0 ? 'M' : 'L'}${x},${y}`
    })
    .join(' ')

  return {
    line: path,
    area: `${path} L${dimensions.value.width - margin.right},${dimensions.value.height - margin.bottom} L${margin.left},${dimensions.value.height - margin.bottom} Z`,
  }
})

// Hover handling
function handleMouseMove(e: MouseEvent) {
  if (!container.value)
    return

  const { x } = getRelativeCoords(e, container.value)
  const { xScale } = getScales()

  // Find closest point index
  const index = points.value.reduce((closest, _, i) => {
    const pointX = xScale(i)
    const currentDiff = Math.abs(pointX - x)
    const closestDiff = Math.abs(xScale(closest) - x)
    return currentDiff < closestDiff ? i : closest
  }, 0)

  hoverX.value = xScale(index)
  activePointIndex.value = index

  emit('pointHover', {
    point: points.value[index] || null,
    index,
  })
}

function handleMouseLeave() {
  hoverX.value = null
  activePointIndex.value = null
  emit('pointHover', { point: null, index: null })
}

// Resize observer setup
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
  <div
    ref="container"
    class="relative h-full w-full"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <svg
      ref="chartRef"
      :width="dimensions.width"
      :height="dimensions.height"
      class="absolute inset-0 text-primary-500"
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
            class="text-primary-500"
            style="fill: currentColor; opacity: 0.2;"
          />
        </pattern>

        <linearGradient :id="gradientId" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" class="text-primary-500" style="stop-color: currentColor; stop-opacity: 0.2" />
          <stop offset="100%" class="text-primary-500" style="stop-color: currentColor; stop-opacity: 0" />
        </linearGradient>

        <mask :id="maskId">
          <path
            v-if="pathData.area"
            :d="pathData.area"
            fill="white"
          />
        </mask>
      </defs>

      <!-- Background pattern -->
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
        :class="{ 'opacity-50': hoverX !== null }"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        fill="none"
      />

      <!-- Hover line -->
      <line
        v-if="hoverX !== null"
        :x1="hoverX"
        :y1="margin.top"
        :x2="hoverX"
        :y2="dimensions.height - margin.bottom"
        stroke="currentColor"
        stroke-width="1"
        stroke-dasharray="4,4"
        class="text-primary-500"
        opacity="0.5"
      />

      <!-- Hover point -->
      <circle
        v-if="hoverX !== null && activePointIndex !== null"
        :cx="hoverX"
        :cy="getScales().yScale(Number(points[activePointIndex]?.[valueKey || 'value'] || 0))"
        r="3"
        class="fill-primary-500"
      />
    </svg>
  </div>
</template>
