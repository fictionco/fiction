<script lang="ts" setup>
import type { OverlaySetting, vue } from '@fiction/core'
import ElInput from './ElInput.vue'

const props = defineProps({
  modelValue: {
    type: Object as vue.PropType<OverlaySetting>,
    default: undefined,
  },
})

const emit = defineEmits<{
  (event: 'update:modelValue', payload: OverlaySetting): void
}>()

const blendModes = [
  'normal',
  'overlay',
  'multiply',
  'screen',
  'darken',
  'lighten',
  'color-dodge',
  'color-burn',
  'hard-light',
  'soft-light',
  'difference',
  'exclusion',
  'hue',
  'saturation',
  'color',
  'luminosity',
]

async function updateValue(value: OverlaySetting): Promise<void> {
  emit('update:modelValue', value)
}

async function updateField(field: string, value: unknown): Promise<void> {
  const newValue = { ...props.modelValue, [field]: value }
  await updateValue(newValue)
}
</script>

<template>
  <div class="space-y-4">
    <ElInput
      class=""
      input="InputGradient"
      label="Overlay Color"
      :model-value="modelValue?.gradient"
      @update:model-value="updateField('gradient', $event)"
    />
    <ElInput
      class=""
      input="InputRange"
      label="Overlay Opacity"
      :list="blendModes"
      :model-value="modelValue?.opacity"
      @update:model-value="updateField('opacity', $event)"
    />
    <ElInput
      class=""
      input="InputSelect"
      label="Overlay Blend Mode"
      :list="blendModes"
      :model-value="modelValue?.blendMode"
      @update:model-value="updateField('blendMode', $event)"
    />
  </div>
</template>
