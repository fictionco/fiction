<script lang="ts" setup>
import type { PropType } from 'vue'
import { computed } from 'vue'
import { formatNumber } from '@factor/api'
import type { ChartResponse, FullWidget } from '..'

const props = defineProps({
  config: {
    type: Object as PropType<FullWidget<ChartResponse>>,
    default: () => {},
  },
})
const list = computed(() => {
  const data = props.config.data
  const v = props.config.keyMap?.map((_) => {
    return {
      ..._,
      value: _.value ? data?.mainTotals?.[_.value] : '',
    }
  })

  return v
})
</script>

<template>
  <div class="relative px-4">
    <dl class="grid grid-cols-2 gap-5">
      <div
        v-for="(point, i) in list"
        :key="i"
        class="p-2"
      >
        <dt class="text-sm font-medium text-slate-500 truncate">
          {{ point.name }}
        </dt>
        <dd v-if="point.value" class="mt-1 text-3xl font-semibold">
          {{ formatNumber(point.value)
          }}<span v-if="point.suffix" class="text-slate-400 ml-1">{{
            point.suffix
          }}</span>
        </dd>
      </div>
    </dl>
  </div>
</template>
