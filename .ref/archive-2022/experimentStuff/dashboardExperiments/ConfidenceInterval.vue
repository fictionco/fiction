<script lang="ts">
import type { PropType } from 'vue'
import { computed } from 'vue'
import { formatNumber } from '../..'

export default {
  props: {
    val: {
      type: Array as PropType<(number | null)[]>,
      default: () => [],
    },
  },
  setup(props) {
    const vals = computed<[number, number]>(() => {
      return [props.val[0] ?? 0, props.val[1] ?? 0]
    })

    const isDisabled = computed(() => {
      return vals.value.every(_ => !_)
    })
    const offset = computed(() => {
      return ((vals.value[0] + 1) / 2) * 100
    })
    const rangeWidth = computed(() => {
      return ((vals.value[1] - vals.value[0]) / 2) * 100
    })

    const rangeColor = computed(() => {
      if (vals.value[0] > 0)
        return 'bg-green-500'
      else if (vals.value[1] < 0)
        return 'bg-red-500'
      else return 'bg-slate-500'
    })

    return { isDisabled, offset, rangeWidth, rangeColor, formatNumber }
  },
}
</script>

<template>
  <div
    class="w-24 text-center inline-block"
    :class="isDisabled ? 'opacity-10' : ''"
  >
    <div class="border border-slate-200 h-3 relative">
      <div
        class="interval-range absolute w-3 rounded-sm bottom-0"
        :class="rangeColor"
        :style="{ left: `${offset}%`, width: `${rangeWidth}%` }"
      />

      <span class="border-r border-slate-300 h-full w-0 absolute top-0" />
    </div>
    <div
      class="interval-midline mt-2 text-xs flex justify-between text-slate-400 font-semibold"
    >
      <span>{{ formatNumber(val[0], "rawPercent") }}</span>
      <span>{{ formatNumber(val[1], "rawPercent") }}</span>
    </div>
  </div>
</template>

<style>
.interval-range {
  height: calc(100% + 6px);
  top: -3px;
  bottom: -3px;
}
.interval-midline {
  left: 50%;
  transform: translateX(-0.5px);
}
</style>
