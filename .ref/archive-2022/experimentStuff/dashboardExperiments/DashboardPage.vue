<script lang="ts" setup>
import type { Experiment } from '@kaption/types'
import { computed } from 'vue'
import ElemZeroState from '../../el/ElemZeroState.vue'
import ElemButton from '../../el/ElemButton.vue'
import ElemControls from '../controls/ElemControls.vue'
import DashboardGrid from '../DashboardGrid.vue'
import { getRoute } from '../../tools/routes'
import { activeProject } from '../../tools/site'
import ElemExperiment from './SelectExperiment.vue'

const experiments = computed<Experiment[]>(() => {
  const all = activeProject.value?.experiments || {}
  const exp = Object.values(all).filter(
    (_: Experiment | null) => _?.experimentStatus,
  )
  return exp as Experiment[]
})

const experimentActive = computed(() => {
  const route = router.currentRoute.value
  return !!route.query.id
})
</script>

<template>
  <div>
    <ElemControls :hide="['compare']">
      <ElemExperiment v-if="experiments.length > 0" />
    </ElemControls>

    <ElemZeroState
      v-if="experiments.length === 0"
      title="No Existing Experiments"
      note="Create experiments to test and optimize your site copy and headlines."
    >
      <template #action>
        <ElemButton btn="primary" :to="getRoute('experimentIndex')">
          Experiments &rarr;
        </ElemButton>
      </template>
    </ElemZeroState>
    <ElemZeroState
      v-else-if="!experimentActive"
      title="Select Experiment"
      note="Select an experiment to view results"
    >
      <template #action>
        <ElemExperiment />
      </template>
    </ElemZeroState>
    <DashboardGrid v-else v-bind="$attrs" />
  </div>
</template>
