<script lang="ts" setup>
import type { MediaObject, vue } from '@fiction/core'
import ElInput from './ElInput.vue'

defineOptions({ name: 'LibraryBackground' })

const props = defineProps({
  modelValue: { type: Object as vue.PropType<MediaObject>, default: () => ({}) },
})

const emit = defineEmits<{
  (event: 'update:modelValue', payload: MediaObject): void
}>()

function updateBackground(updates: Partial<MediaObject>) {
  emit('update:modelValue', { ...props.modelValue, ...updates })
}
</script>

<template>
  <div class="p-8 max-h-[300px] overflow-scroll">
    <div class="max-w-md mx-auto space-y-8">
      <ElInput
        label="Background Colors"
        input="InputGradient"
        :model-value="modelValue.bgGradient"
        @update:model-value="updateBackground({ bgGradient: $event })"
      />

      <ElInput
        label="Background Overlay"
        input="InputOverlay"
        :model-value="modelValue.overlay"
        @update:model-value="updateBackground({ overlay: $event })"
      />
    </div>
  </div>
</template>
