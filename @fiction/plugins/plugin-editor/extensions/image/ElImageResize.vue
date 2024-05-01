<script setup lang="ts">
import type { Editor } from '@tiptap/core'
import { vue } from '@fiction/core'
import InputRange from '@fiction/ui/InputRange.vue'

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
</script>

<template>
  <div class="w-60 flex gap-2">
    <InputRange :model-value="val" min="25" max="200" @update:model-value="update($event || 100)" />
  </div>
</template>
