<script lang="ts" setup>
import type { NumberFormats, vue } from '@factor/api'
import { formatNumber } from '@factor/api'

const props = defineProps({
  counters: {
    type: Object as vue.PropType<
      { name: string, count: vue.Ref<number>, format?: NumberFormats }[]
    >,
    required: true,
  },
})
</script>

<template>
  <div class="flex space-x-6">
    <div
      v-for="(counter, i) of counters"
      :key="i"
      class=""
    >
      <dd class="text-xl font-bold tracking-tight">
        {{ formatNumber(counter.count.value, counter.format || "number") }}
      </dd>
      <dt class="truncate text-xs font-medium text-theme-400">
        {{ counter.name }}
      </dt>
    </div>
  </div>
</template>
