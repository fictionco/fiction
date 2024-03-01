<script lang="ts" setup>
import type { ListItem } from '@factor/types'
import { computed } from 'vue'
import { activeExperiments } from '../../_experiments/utils'
import ElemSelect from '../controls/ElemSelect.vue'

const selectList = computed<ListItem[]>(() => {
  return activeExperiments.value.map((ex) => {
    return { name: ex.experimentName, value: ex.experimentId }
  })
})
</script>

<template>
  <ElemSelect
    :list="selectList"
    select-text="Select Experiment"
    query-key="id"
    class="whitespace-nowrap"
  />
</template>
