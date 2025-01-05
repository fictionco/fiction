<script lang="ts" setup>
import type { ActionArea, PostObject } from '@fiction/core'
import XButtonList from '@fiction/ui/buttons/XButtonList.vue'
import ElHeader from './ElHeader.vue'

const {
  title,
  action = {},
  header,
  editable = [],
} = defineProps<{
  title?: string
  action?: ActionArea
  header?: PostObject
  editable?: (keyof PostObject)[]
}>()

const emit = defineEmits<{
  (event: 'update:header', payload: PostObject): void
}>()
</script>

<template>
  <div>
    <div class="flex items-center justify-between p-4 border-b border-theme-300 dark:border-theme-700/70">
      <div class="font-semibold text-lg">
        {{ title || 'No Title' }}
      </div>
      <XButtonList :buttons="action.buttons" class="flex justify-end gap-2" ui-size="md" />
    </div>

    <div v-if="header" class="p-4">
      <ElHeader
        class="dark:bg-theme-700/30 rounded-xl p-8"
        :model-value="header"
        :editable
        @update:model-value="emit('update:header', $event)"
      />
    </div>

    <slot />
  </div>
</template>
