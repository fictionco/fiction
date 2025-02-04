<script lang="ts" setup>
import type { ComparePeriods, DataCompared, DataPointChart, TimeLineInterval } from '@fiction/analytics/types'
import type { NumberFormats } from '@fiction/core'
import { vue } from '@fiction/core'

const props = defineProps<{
  data?: DataCompared<DataPointChart>
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
  loading?: boolean
}>()

const emit = defineEmits<{
  (event: 'pointHover', value: { point: DataPointChart | null, index: number | null }): void
}>()

// Component state
const container = vue.ref<HTMLElement>()
const chartRef = vue.ref<SVGElement>()
const dimensions = vue.ref({ width: 0, height: 0 })
const hoverX = vue.ref<number | null>(null)
const activePointIndex = vue.ref<number | null>(null)

// Chart configuration
const margin = { top: 2, right: 2, bottom: 2, left: 2 }
const gradientId = `chart-gradient-${Math.random().toString(36).slice(2, 11)}`
const loadingGradientId = `chart-loading-${Math.random().toString(36).slice(2, 11)}`
const points = vue.computed(() => props.loading ? getMockPoints() : props.data?.main || [])

function getMockPoints() {
  const baseValue = 50
  let lastValue = baseValue

  return Array.from({ length: 30 }, (_, i) => {
    // Create natural-looking variations that trend slightly up
    const change = (Math.random() - 0.48) * 15 // Slight upward bias
    lastValue = Math.max(20, Math.min(80, lastValue + change))

    return {
      value: lastValue,
      date: new Date().toISOString(),
    } as DataPointChart
  })
}
const loadingProgress = vue.ref(0)

vue.onMounted(() => {
  let start: number

  function animate(timestamp: number) {
    if (!start)
      start = timestamp
    const progress = (timestamp - start) / 1500 // 2 second animation
    loadingProgress.value = progress

    if (progress < 1 && props.loading) {
      requestAnimationFrame(animate)
    }
  }

  vue.watch(() => props.loading, (isLoading) => {
    if (isLoading) {
      start = 0
      requestAnimationFrame(animate)
    }
  }, { immediate: true })
})

// Update computed for loading animation
const loadingAnimation = vue.computed(() => ({
  mask: `url(#${loadingGradientId})`,
  clipPath: props.loading ? `inset(0 ${100 - (loadingProgress.value * 100)}% 0 0)` : 'none',
  transition: 'clip-path 0.1s cubic-bezier(0.25,1,0.33,1)', // Faster transition
}))

// Helper to get coordinates and scale
function getScales() {
  const values = points.value.map(p => Number(p.value || 0))
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1

  return {
    xScale: (i: number) => margin.left + (i / Math.max(1, points.value.length - 1)) * (dimensions.value.width - margin.left - margin.right),
    yScale: (v: number) => margin.top + (1 - ((v - min) / range)) * (dimensions.value.height - margin.top - margin.bottom),
  }
}

// Path generation
const pathData = vue.computed(() => {
  if (!dimensions.value.width || !dimensions.value.height)
    return { line: '', area: '' }
  const { xScale, yScale } = getScales()

  const path = points.value.map((point, i) => {
    const x = xScale(i)
    const y = yScale(Number(point.value || 0))
    return `${i === 0 ? 'M' : 'L'}${x},${y}`
  }).join(' ')

  return {
    line: path,
    area: `${path} L${dimensions.value.width - margin.right},${dimensions.value.height - margin.bottom} L${margin.left},${dimensions.value.height - margin.bottom} Z`,
  }
})

// Hover handling
function handleMouseMove(e: MouseEvent) {
  if (props.loading || !container.value)
    return
  const rect = container.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const { xScale } = getScales()

  const index = points.value.reduce((closest, _, i) => {
    const pointX = xScale(i)
    return Math.abs(pointX - x) < Math.abs(xScale(closest) - x) ? i : closest
  }, 0)

  hoverX.value = xScale(index)
  activePointIndex.value = index
  emit('pointHover', { point: points.value[index] || null, index })
}

function handleMouseLeave() {
  hoverX.value = null
  activePointIndex.value = null
  emit('pointHover', { point: null, index: null })
}

// Resize observer setup
vue.onMounted(() => {
  if (!container.value)
    return
  const observer = new ResizeObserver((entries) => {
    const entry = entries[0]
    if (entry) {
      dimensions.value = {
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      }
    }
  })
  observer.observe(container.value)
  dimensions.value = { width: container.value.clientWidth, height: container.value.clientHeight }
})

defineExpose({ chartElement: chartRef })
</script>

<template>
  <div ref="container" class="relative h-full w-full" @mousemove="handleMouseMove" @mouseleave="handleMouseLeave">
    <svg
      ref="chartRef"
      :width="dimensions.width"
      :height="dimensions.height"
      :class="[loading ? 'text-primary-300' : 'text-primary-500']"
      class="absolute inset-0"
      :viewBox="`0 0 ${dimensions.width} ${dimensions.height}`"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient :id="gradientId" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="currentColor" stop-opacity="0.2" />
          <stop offset="100%" stop-color="currentColor" stop-opacity="0" />
        </linearGradient>
        <mask :id="loadingGradientId">
          <rect width="100%" height="100%" fill="white" opacity="0.6">
            <animate
              attributeName="x"
              values="-100%;100%"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </rect>
        </mask>
      </defs>

      <!-- Update path elements -->
      <path
        v-if="pathData.area"
        :d="pathData.area"
        fill="currentColor"
        style="opacity: 0.1"
        :style="loading ? loadingAnimation : {}"
      />
      <path
        v-if="pathData.line"
        :d="pathData.line"
        class="stroke-current"
        fill="none"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        :style="loading ? loadingAnimation : {}"
      />
      <line
        v-if="!loading && hoverX !== null"
        :x1="hoverX"
        :y1="margin.top"
        :x2="hoverX"
        :y2="dimensions.height - margin.bottom"
        stroke="currentColor"
        stroke-width="1"
        stroke-dasharray="4,4"
        class="opacity-50"
      />
      <circle v-if="!loading && hoverX !== null && activePointIndex !== null" :cx="hoverX" :cy="getScales().yScale(Number(points[activePointIndex]?.value || 0))" r="3" fill="currentColor" />
    </svg>
  </div>
</template>
