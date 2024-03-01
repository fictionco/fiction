<script lang="ts" setup>
import ElZeroBanner from '@factor/ui/ElZeroBanner.vue'
import { emitEvent, useService, vue, waitFor } from '@factor/api'
import type { FactorDashboard } from '..'
import { DragDropGrid } from './dragDropUtility'

defineProps({
  editMode: { type: String, default: '' },
})
const { factorDashboard } = useService<{
  factorDashboard: FactorDashboard
}>()
const activeLayout = factorDashboard.activeLayout
const activeWidgetComponents = vue.computed(() => {
  return activeLayout.value.map((w) => {
    return {
      widget: w,
      component: vue.defineAsyncComponent(w.el),
    }
  })
})
const editMode = factorDashboard.editMode
const dragDropWidgets = new DragDropGrid({ factorDashboard })
vue.watch(
  () => editMode.value,
  (val) => {
    if (val === 'on')
      dragDropWidgets.enable()
  },
)

async function newWidgetMode() {
  factorDashboard.editMode.value = 'on'
  await waitFor(200)
  emitEvent('newWidget')
}
</script>

<template>
  <ElZeroBanner
    v-if="activeLayout.length === 0 && editMode !== 'on'"
    title="This Dashboard is Empty"
    description="Add some widgets to customize"
    class="border-theme-300 bg-theme-0 border"
    :actions="[
      {
        name: 'Add Widgets',
        btn: 'primary',
        onClick: () => newWidgetMode(),
      },
    ]"
  />

  <div
    v-else
    :id="factorDashboard.domSelectors.grid"
    class="custom-grid grid grid-cols-12 gap-6 transition-all"
  >
    <component
      :is="component"
      v-for="({ widget, component }, i) in activeWidgetComponents"
      :key="i"
      :widget="widget"
      :editable="editMode === 'on'"
    />
    <div
      v-if="editMode === 'on'"
      class="bg-theme-0 border-theme-300 text-theme-500 group col-span-6 row-span-1 flex cursor-pointer select-none items-center justify-center rounded-md border font-semibold shadow-sm transition-all hover:shadow-md xl:col-span-3"
      @click.stop="emitEvent('newWidget')"
    >
      <div class="text-center">
        <div class="inline-block text-center">
          <div class="i-carbon-add inline-block text-3xl" />
        </div>
        <div class="text-sm font-bold">
          Add Widget
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less">
.custom-grid {
  grid-auto-flow: dense;
  grid-auto-rows: minmax(12rem, auto);
}
</style>
