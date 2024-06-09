<script lang="ts" setup>
import type { vue } from '@factor/api'
import ElFilters from './ControlsFilter.vue'
import ElDatePicker from './ControlsDatePicker.vue'
import ElInterval from './ControlsSelectInterval.vue'
import ElCompare from './ControlsSelectPeriod.vue'
import ElDimension from './ControlsSelectDimension.vue'

defineProps({
  controls: {
    type: Array as vue.PropType<string[]>,
    default: () => [],
  },
})
</script>

<template>
  <div class="controls mb-4 items-center justify-between lg:flex lg:flex-wrap">
    <div
      class="mr-4 mb-4 items-center justify-between space-x-3 space-y-0 md:mb-0"
    >
      <ElDimension v-if="controls.includes('dimension')" />
      <ElDatePicker />
      <span
        class="hidden py-2 text-center text-xs text-theme-300 lg:inline-block lg:py-0 lg:text-left"
      >
        BY
      </span>
      <ElInterval title="interval" />
      <span
        class="mx-auto hidden py-2 text-center text-xs text-theme-300 lg:inline-block lg:py-0 lg:text-left"
      >
        VS
      </span>
      <ElCompare />
    </div>
    <ElFilters />
  </div>
</template>
