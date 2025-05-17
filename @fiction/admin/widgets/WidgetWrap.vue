<script lang="ts" setup>
import type { ActionButton } from '@fiction/core'
import XButtonList from '@fiction/ui/buttons/XButtonList.vue'

const { title, buttons } = defineProps<{
  title?: string
  buttons?: ActionButton[]
}>()
</script>

<template>
  <div
    class="drop-target relative @container/widget border border-theme-200 dark:border-theme-700/90 rounded-lg shadow-sm bg-white dark:bg-theme-800/50 overflow-hidden"
  >
    <div class="flex flex-col transition-all ">
      <div
        v-if="title"
        class="text-theme-600 dark:text-theme-50 flex items-center justify-between p-3 @sm/widget:px-5 py-4 border-b border-theme-200 dark:border-theme-700/90"
      >
        <div class="relative flex items-center">
          <div class="text-base">
            {{ title }}
          </div>
        </div>
        <div>
          <slot v-if="$slots.action" name="action" />
          <XButtonList v-else class="flex gap-2 items-center" :buttons ui-size="sm" />
        </div>
      </div>

      <div class="p-6">
        <slot />
      </div>
    </div>
  </div>
</template>
