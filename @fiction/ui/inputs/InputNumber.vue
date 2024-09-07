<script lang="ts" setup>
import { vue } from '@fiction/core'
import type { StandardSize } from '@fiction/core'
import { textInputClasses } from './theme'

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  min: { type: [String, Number], default: 0 },
  max: { type: [String, Number], default: undefined },
  step: { type: [String, Number], default: 1 },
  inputClass: { type: String, default: '' },
  uiSize: { type: String as vue.PropType<StandardSize>, default: 'md' },
})
const emit = defineEmits<{
  (event: 'update:modelValue', payload?: number): void
}>()

async function handleEmit(target: EventTarget | null): Promise<void> {
  const el = target as HTMLInputElement
  let v = +el.value

  emit('update:modelValue', v)

  await vue.nextTick()

  // if out of bounds, set to bound. emit undefined first to force re-render
  if (props.min !== undefined && v < +props.min) {
    v = +props.min
    emit('update:modelValue', v)
  }

  if (props.max !== undefined && v > +props.max) {
    v = +props.max
    emit('update:modelValue', v)
  }
}
</script>

<template>
  <input
    :class="textInputClasses({ inputClass, uiSize })"
    type="number"
    :value="modelValue"
    :min="min"
    :max="max"
    :step="step"
    @input="handleEmit($event.target)"
  >
</template>, type StandardSize
