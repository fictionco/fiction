<script lang="ts" setup>
import type { vue } from '@fiction/core'
import ProseEditor from '../prose/editor/ProseEditor.vue'
import type { UiElementSize } from '../utils'

defineProps({
  modelValue: { type: String, default: '' },
  inputClass: { type: String, default: '' },
  uiSize: { type: String as vue.PropType<UiElementSize>, default: 'md' },
})

const emit = defineEmits<{
  (event: 'update:modelValue', payload: string): void
}>()

function handleEmit(payload: string): void {
  emit('update:modelValue', payload)
}
</script>

<template>
  <div class="p-2 pl-7 prose prose-sm dark:prose-invert border rounded-lg border-theme-200 dark:border-theme-600/70 dark:bg-theme-900">
    <ProseEditor class="font-mono" :model-value="modelValue" @update:model-value="handleEmit($event)" />
  </div>
</template>

<style lang="less">
.prose{
  > *:first-child{
    margin-top: .5em;
  }
  > *:last-child{
    margin-bottom: .5em;
  }
}
</style>
