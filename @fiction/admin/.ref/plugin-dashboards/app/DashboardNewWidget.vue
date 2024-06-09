<script lang="ts" setup>
import ElSlideover from '@factor/ui/ElSlideOver.vue'
import { useService, vue } from '@factor/api'
import type { FactorDashboard } from '..'
import type { WidgetKeys } from '../types'
import type { Widget } from '../widget'
import { widgetCategories } from '../widget'

const emit = defineEmits<{
  (event: 'add', payload: { widgetKey: WidgetKeys }): void
}>()

const { factorDashboard } = useService<{
  factorDashboard: FactorDashboard
}>()

const widgetGroups = vue.computed(() => {
  const out: Record<string, Widget[]> = {}

  for (const category of widgetCategories.filter(item => item !== 'core')) {
    const widgets = factorDashboard.widgets.filter(
      widget =>
        widget.category.includes(category) && !widget.ui.noCustomDashboard,
    )
    if (widgets.length > 0)
      out[category] = widgets
  }
  return out
})

async function addToLayout(w: Widget): Promise<void> {
  emit('add', { widgetKey: w.widgetKey })
}
</script>

<template>
  <ElSlideover name="newWidget">
    <div
      class="text-theme-400 bg-theme-100 flex h-12 w-12 items-center justify-center rounded-full"
    >
      <div class="i-carbon-dashboard-reference text-2xl" />
    </div>

    <div class="select-none py-3">
      <h2 class="text-lg font-semibold">
        Add A New Widget
      </h2>
      <p class="text-theme-400 mt-2 text-sm">
        Select a new widget to add to your dashboard
      </p>
    </div>

    <div class="my-8">
      <div
        v-for="(widgetList, category) in widgetGroups"
        :key="category"
        role="list"
        class="relative z-0 mb-4 divide-y divide-slate-200 text-xs"
      >
        <h3 class="text-theme-300 my-2 font-semibold uppercase">
          {{ category }}
        </h3>
        <div
          v-for="(widget, ii) in widgetList"
          :key="ii"
          class="hover:bg-theme-50 relative flex cursor-pointer select-none space-x-4 p-3"
          @click="addToLayout(widget)"
        >
          <div class="min-w-0 flex-1 text-xs">
            <p class="font-semibold">
              {{ widget.title.value }}
            </p>
            <p class="text-theme-400 mt-1 font-normal">
              {{ widget.description.value }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </ElSlideover>
</template>
