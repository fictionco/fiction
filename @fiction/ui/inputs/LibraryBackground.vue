<script lang="ts" setup>
import type { MediaObject, vue } from '@fiction/core'
import type { InputOption } from '.'
import { MediaSchema as schema } from '@fiction/core'
import { createOption } from '.'
import FormEngine from './FormEngine.vue'

defineOptions({ name: 'LibraryBackground' })

const props = defineProps({
  modelValue: { type: Object as vue.PropType<MediaObject>, default: () => ({}) },
})

const emit = defineEmits<{
  (event: 'update:modelValue', payload: MediaObject): void
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
].map(mode => ({ label: mode, value: mode }))

const options: InputOption[] = [
  createOption({
    key: 'group.gradient',
    input: 'group',
    label: 'Background Colors',
    icon: { class: 'i-tabler-background' },
    schema,
    options: [
      createOption({
        key: 'gradient',
        label: 'Gradient',
        input: 'InputGradient',
        schema,
      }),

    ],
  }),
  createOption({
    key: 'group.overlay',
    input: 'group',
    label: 'Background Overlay',
    icon: { class: 'i-tabler-contrast-filled' },
    schema,
    options: [
      createOption({
        key: 'effects.overlay.gradient',
        label: 'Overlay Color',
        input: 'InputGradient',
        schema,
      }),
      createOption({
        key: 'effects.overlay.blendMode',
        label: 'Blend Mode',
        input: 'InputSelect',
        list: blendModes,
        schema,
      }),
      createOption({
        key: 'effects.overlay.opacity',
        label: 'Overlay Opacity',
        input: 'InputRange',
        props: { min: 0, max: 1, step: 0.01 },
        schema,
      }),

    ],
  }),

]
</script>

<template>
  <div>
    <FormEngine
      state-key="bgInput"
      :depth="1"
      :model-value="modelValue"
      ui-size="md"
      :options="options"
      @update:model-value="emit('update:modelValue', $event)"
    />
  </div>
</template>
