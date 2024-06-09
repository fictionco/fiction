<script lang="ts" setup>
import { vue } from '@factor/api'
import type { ClientWidget, DataCompared } from '@factor/api/plugin-dashboards'
import type { LocationData } from '../../ui/ElMap.vue'
import ElemMap from '../../ui/ElMap.vue'

const props = defineProps({
  widget: {
    type: Object as vue.PropType<ClientWidget<DataCompared<LocationData>>>,
    required: true,
  },
})
const data = vue.computed<LocationData[] | undefined>(() => {
  return props.widget.data.value?.main
})
</script>

<template>
  <div class="relative h-full">
    <ElemMap :data="data" />
  </div>
</template>
