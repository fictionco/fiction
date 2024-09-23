<script lang="ts" setup>
import type { ActionButton } from '@fiction/core'
import type { Widget } from './widget.js'
import { vue } from '@fiction/core'
import ElActions from '@fiction/ui/buttons/ElActions.vue'
import ElSpinner from '@fiction/ui/loaders/ElSpinner.vue'

const props = defineProps({

  loading: { type: Boolean, default: false },
  widget: { type: Object as vue.PropType<Widget>, default: undefined },
  editable: { type: Boolean, default: false },
  actions: { type: Array as vue.PropType<ActionButton[]>, default: () => [] },
})

const widgetTitle = vue.computed(() => props.widget?.settings.title)
const widgetDescription = vue.computed(() => props.widget?.settings.description)
</script>

<template>
  <div
    class="drop-target border-theme-300/70 shadow-[0px_8px_5px_-8px_rgba(var(--theme-300,.7))] dark:shadow-none bg-theme-0 dark:bg-theme-800/50 dark:border-theme-600 relative flex flex-col rounded-lg border transition-all"
    :draggable="editable"
    :wid="widget?.hashId.value"
  >
    <div
      class="border-theme-200 dark:border-theme-600 text-theme-600 dark:text-theme-50 flex items-center justify-between border-b p-2 text-sm"
      :class="editable ? 'cursor-move ' : ''"
      :data-hash="widget?.hashId.value"
    >
      <div class="relative flex items-center px-2">
        <div class="font-semibold">
          {{ widgetTitle }}
        </div>

        <div v-if="widgetDescription" class="description group relative ml-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="text-theme-300 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div
            class="pointer-events-none absolute top-0 left-full z-10 w-40 rounded-md bg-white text-theme-700 p-3 text-xs opacity-0 shadow-md ring-1 ring-black/5 group-hover:opacity-100"
          >
            {{ widgetDescription }}
          </div>
        </div>
      </div>
      <div>
        <ElActions class="flex gap-2 items-center" :actions ui-size="sm" />
      </div>
    </div>

    <div
      v-if="!widget || loading || widget?.loading.value"
      class="flex justify-center p-8"
    >
      <div class="text-theme-300 h-6 w-6">
        <ElSpinner />
      </div>
    </div>
    <div v-else-if="widget?.errorMessage.value" class="flex justify-center p-8">
      <div
        class="text-theme-500 pt-12 pb-8 text-center text-xs font-semibold uppercase tracking-wide text-opacity-40"
      >
        {{ widget.errorMessage ? `Data Error: ${widget.errorMessage.value}` : "No Data" }}
      </div>
    </div>
    <div v-else class="no-scrollbar min-h-0 grow overflow-scroll">
      <slot />
    </div>
  </div>
</template>

<style lang="less">
.widget.drag * {
  pointer-events: none;
}
</style>
