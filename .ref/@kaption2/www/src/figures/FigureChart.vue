<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'

import { createLineChart } from '@factor/api/utils/chart'

const props = defineProps({
  itemsNum: { type: Number, default: 5 },
  timeout: { type: Number, default: 10_000 },
  height: { type: Number, default: 400 },
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

const chartEl = ref<HTMLCanvasElement>()

const datasets: { label: string, data: number[] }[] = [
  {
    label: `Promoters`,
    data: [],
  },
  {
    label: `Passives`,
    data: [],
  },
  {
    label: `Detractors`,
    data: [],
  },
].map((_) => {
  return { opts: { borderWidth: 3, pointRadius: 6 }, ..._ }
})

const primaryData = computed(() => datasets[0].data)

const labels: string[] = []

onMounted(() => {
  if (!chartEl.value)
    return

  const chart = createLineChart({
    el: chartEl.value,
    opts: {
      options: {
        scales: {
          y: { beginAtZero: undefined },
          x: {},
        },
      },
    },
  })

  let day = 0

  for (let i = 0; i < props.itemsNum ?? 10; i++) {
    const dataLast = primaryData.value[i - 1] || 12

    datasets.forEach((_item, i) => {
      const percentage = 1 - i * 0.4
      const num = getNextNumbers(dataLast, percentage)
      datasets[i].data.push(num)
    })
    day++

    labels.unshift(`Day ${day}`)
  }

  const ch = chart.setData({ labels, datasets, mode: 'multi' })

  setInterval(async () => {
    if (ch) {
      const last = datasets[0].data[datasets[0].data.length - 1] ?? 100
      ch.data.labels?.shift()
      day++
      ch.data.labels?.push(`Day ${day}`)
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
  <div class="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-black/5">
    <canvas ref="chartEl" :height="height ?? '400'" />
  </div>
</template>
