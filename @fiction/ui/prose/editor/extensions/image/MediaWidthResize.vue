<script setup lang="ts">
import type { Editor } from '@tiptap/core'
import { vue } from '@fiction/core'
import InputRange from '@fiction/ui/inputs/InputRange.vue'

defineOptions({ name: 'MediaWidthResize' })

const props = defineProps({
  editor: { type: Object as vue.PropType<Editor>, required: true },
  modelValue: { type: String, required: true },
})

const emit = defineEmits<{
  (event: 'update:modelValue', payload: string): void
}>()

const val = vue.computed(() => (Number.parseInt(props.modelValue) || 100))

function update(v: number) {
  emit('update:modelValue', `${v}%`)
}

// Prevent drag events from bubbling to parent draggable node
function handlePointerDown(event: PointerEvent) {
  event.stopPropagation()
}

function handleMouseDown(event: MouseEvent) {
  event.stopPropagation()
}

function handleDragStart(event: DragEvent) {
  event.preventDefault()
  event.stopPropagation()
}
</script>

<template>
  <div
    class="w-60 flex gap-2"
    @pointerdown="handlePointerDown"
    @mousedown="handleMouseDown"
    @dragstart="handleDragStart"
  >
    <InputRange
      :model-value="val"
      min="25"
      max="200"
      @update:model-value="update($event || 100)"
    />
  </div>
</template>
