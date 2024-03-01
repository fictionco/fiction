<script lang="ts" setup>
import { stored, vue } from '@factor/api'
import { useKaption } from '@kaption/core/utils'
import ElemFilters from '@kaption/core/plugin-dashboards/app/ControlsFilter.vue'
import ElemDatePicker from '@kaption/core/plugin-dashboards/app/ControlsDatePicker.vue'
import ElemCompare from '@kaption/core/plugin-dashboards/app/ControlsSelectPeriod.vue'
import ElemInterval from '@kaption/core/plugin-dashboards/app/ControlsSelectInterval.vue'

defineProps({
  hide: {
    type: Array as vue.PropType<('compare' | 'date')[]>,
    default: () => [],
  },
})
const { kaptionDashboard } = useKaption()
const mode = vue.computed(
  () => kaptionDashboard.activeDashboard.value?.dashboardMode ?? [],
)

const controlsMobileVis = vue.computed(() => stored('controlsMobileVis'))
</script>

<template>
  <div class="controls mb-4 items-center justify-between lg:flex lg:flex-wrap">
    <div
      class="flex-wrap items-center space-y-4 md:flex lg:mr-4 lg:flex-nowrap lg:space-x-4 lg:space-y-0"
      :class="controlsMobileVis ? 'block' : 'hidden'"
    >
      <!-- <ElemDimension v-if="mode.includes('dimension')" class="mb-3 lg:mb-0" /> -->
      <slot />

      <template v-if="!mode.includes('realtime')">
        <ElemDatePicker />

        <template v-if="!hide.includes('compare')">
          <span
            class="mx-auto hidden py-2 text-center text-xs font-semibold text-slate-300 lg:inline-block lg:py-0 lg:text-left"
          >
            vs
          </span>
          <ElemCompare />
        </template>

        <ElemInterval title="interval" />
      </template>
      <!-- <template v-if="mode.includes('heatmap')"><ElemDevice /></template>
      <div v-if="mode.includes('realtime')" class="ml-3 text-sm text-slate-400">
        Realtime data within last 30 minutes
      </div> -->
    </div>
    <ElemFilters />
  </div>
</template>
