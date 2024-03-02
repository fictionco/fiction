<script lang="ts" setup>
import { dayjs, timeAgo, vue } from '@factor/api'
import { colorStandard } from '../../utils/colors'
import type { DataSet } from '../../utils/chart'
import { createLineChart } from '../../utils/chart'

const chartEl = vue.ref<HTMLCanvasElement>()

vue.onMounted(() => {
  const randomMultiplier = (min: number, max: number): number => {
    const minInt = Math.round(min * 100)
    const maxInt = Math.round(max * 100)
    const randomInt = Math.floor(Math.random() * (maxInt - minInt + 1) + minInt)
    return randomInt / 100
  }
  if (!chartEl.value)
    return

  const chart = createLineChart({
    el: chartEl.value,
    opts: {
      options: { scales: { y: { display: false }, x: { display: false } } },
    },
  })
  const labels: string[] = []
  const data: number[] = []
  const data2: number[] = []

  const currentTime = dayjs()

  const getNextNumbers = (lastNumber: number): [number, number] => {
    const addNew = Math.floor(Math.random() * 100) + 1 - 42

    const dataNew = Math.round(lastNumber + addNew)

    return [dataNew, Math.round(dataNew * randomMultiplier(0.6, 0.8))]
  }

  for (let i = 0; i < 16; i++) {
    const nextTime = currentTime.subtract(i, 'day')
    labels.unshift(timeAgo(nextTime.toISOString()))
    const dataLast = data[i - 1] || 12

    const [d1, d2] = getNextNumbers(dataLast)

    data.push(d1)
    data2.push(d2)
  }

  const datasets: DataSet[] = [
    {
      label: `Primary`,
      data,
      color: colorStandard({ color: 'slate', level: 200 }),
    },
    {
      label: `Secondary`,
      data: data2,
      color: colorStandard({ color: 'slate', level: 100 }),
    },
  ].map((_) => {
    return { opts: { borderWidth: 4, pointRadius: 8 }, ..._ }
  })

  const ch = chart.setData({ labels, datasets })

  setInterval(() => {
    if (!ch)
      return

    const baseData = [...(ch.data?.datasets[0]?.data ?? [])] as number[]
    const last = baseData.pop() ?? 100
    const next = getNextNumbers(last)

    ch.data?.datasets?.forEach((d, i) => {
      const nextNumber = next[i]

      d.data.shift()
      d.data.push(nextNumber)
    })

    ch.data?.labels?.shift()
    ch.data?.labels?.push('test')

    ch.update()
  }, 60_000)
})
</script>

<template>
  <div class="relative -mt-10">
    <canvas ref="chartEl" height="700" />
  </div>
</template>
