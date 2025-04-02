<script lang="ts" setup>
import type { ActionButton } from '@fiction/core'
import type { Widget } from './widget.js'
import { vue } from '@fiction/core'
import XButtonList from '@fiction/ui/buttons/XButtonList.vue'
import ElSpinner from '@fiction/ui/loaders/ElSpinner.vue'

const props = defineProps({
  loading: { type: Boolean, default: false },
  widget: { type: Object as vue.PropType<Widget>, default: undefined },
  editable: { type: Boolean, default: false },
  buttons: { type: Array as vue.PropType<ActionButton[]>, default: () => [] },
})

const widgetTitle = vue.computed(() => props.widget?.settings.title)
</script>

<template>
  <div
    class="drop-target relative @container/widget border border-theme-200 dark:border-theme-700/90 rounded-lg shadow-sm bg-white dark:bg-theme-800/50 overflow-hidden"
    :draggable="editable"
  >
    <div class="flex flex-col transition-all ">
      <div
        v-if="widgetTitle"
        class="text-theme-600 dark:text-theme-50 flex items-center justify-between p-3 @sm/widget:px-5 py-4 border-b border-theme-200 dark:border-theme-700/90"
        :class="editable ? 'cursor-move ' : ''"
      >
        <div class="relative flex items-center">
          <div class="font-semibold text-base">
            {{ widgetTitle }}
          </div>
        </div>
        <div>
          <slot v-if="$slots.action" name="action" />
          <XButtonList v-else class="flex gap-2 items-center" :buttons ui-size="sm" />
        </div>
      </div>

      <div class="p-3 @sm/widget:px-5 py-4">
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
        <div v-else class="no-scrollbar min-h-0 grow overflow-scroll relative">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less">
.widget.drag * {
  pointer-events: none;
}
</style>
