<script lang="ts" setup>
import type {
  CreatedChart,
  DataSet,
} from '@factor/api/utils/chart'
import {
  createBarChart,
  createLineChart,
} from '@factor/api/utils/chart'
import { dayjs, timeAgo, vue } from '@factor/api'

const props = defineProps({
  itemsNum: { type: Number, default: 5 },
  timeout: { type: Number, default: 10_000 },
  height: { type: Number, default: 100 },
  chart: { type: String as vue.PropType<'line' | 'bar'>, default: 'bar' },
  colors: { type: Array as vue.PropType<string[]>, default: () => [] },
})

function randomMultiplier(min: number, max: number): number {
  const minInt = Math.round(min * 100)
  const maxInt = Math.round(max * 100)
  const randomInt = Math.floor(Math.random() * (maxInt - minInt + 1) + minInt)
  return randomInt / 100
}

function getNextNumbers(lastNumber: number, percentage?: number): number {
  const addNew = Math.floor(Math.random() * 100) - 42

  const dataNew = Math.round(lastNumber + addNew)

  const multiplier
    = percentage && percentage !== 1
      ? randomMultiplier(percentage - 0.1, percentage)
      : 1

  return Math.round(Math.abs(dataNew * multiplier))
}

const chartEl = vue.ref<HTMLCanvasElement>()

const datasets: DataSet[] = [
  {
    label: `Result A`,
    data: [],
  },
  {
    label: `Result B`,
    data: [],
  },
].map((_, i) => {
  const out: DataSet = {
    opts: { borderWidth: 3, pointRadius: 6 },
    ..._,
  }
  const color = props.colors[i]

  if (color)
    out.color = color
  return out
})

const primaryData = vue.computed(() => datasets[0].data)

const labels: string[] = []

const currentTime = dayjs()

vue.onMounted(() => {
  if (!chartEl.value)
    return

  const config = {
    el: chartEl.value,
    opts: {
      options: {
        scales: {
          y: { beginAtZero: undefined, display: false },
          x: { display: false },
        },
      },
    },
  }

  let chart: CreatedChart<typeof props.chart>
  if (props.chart === 'line')
    chart = createLineChart(config)
  else
    chart = createBarChart(config)

  const num = props.itemsNum ?? 5

  for (let i = 0; i < num; i++) {
    const nextTime = currentTime.subtract(i, 'day')

    const dataLast = primaryData.value[i - 1] || 12

    datasets.forEach((_item, i) => {
      const percentage = 1 - i * 0.4
      const num = getNextNumbers(dataLast, percentage)
      datasets[i].data.push(num)
    })

    labels.unshift(timeAgo(nextTime.toISOString()))
  }

  const ch = chart.setData({ labels, datasets, mode: 'multi' })

  setInterval(async () => {
    if (ch) {
      const last = datasets[0].data[datasets[0].data.length - 1] ?? 100
      ch.data.labels?.shift()
      ch.data.labels?.push(timeAgo(currentTime))
      ch.data.datasets?.forEach((d, i) => {
        const percentage = 1 - i * 0.2
        const next = getNextNumbers(last, percentage)
        d.data.shift()
        d.data.push(next)
      })

      ch.update()
    }
  }, props.timeout ?? 10_000)
})
</script>

<template>
  <div>
    <canvas ref="chartEl" :height="height ?? '100'" />
  </div>
</template>
