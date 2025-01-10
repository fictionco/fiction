<script lang="ts" setup>
import type { MediaObject, vue } from '@fiction/core'
import type { InputOption } from '.'
import { MediaDisplaySchema as schema } from '@fiction/core'
import { createOption } from '.'
import FormEngine from './FormEngine.vue'

defineOptions({ name: 'LibraryBackground' })

defineProps({
  modelValue: { type: Object as vue.PropType<MediaObject>, default: () => ({}) },
})

const emit = defineEmits<{
  (event: 'update:modelValue', payload: MediaObject): void
}>()

const options: InputOption[] = [
  createOption({
    key: 'group.gradient',
    input: 'group',
    label: 'Custom HTML / Embed',
    icon: { class: 'i-tabler-brand-youtube' },
    schema,
    options: [
      createOption({
        key: 'html',
        label: 'HTML Code',
        input: 'InputTextarea',
        description: 'This is how you can use YouTube embed code, SVGs, or any other custom HTML',
        schema,
        placeholder: 'Enter your custom HTML or embed code',
        props: {
          rows: 6,
        },
      }),

    ],
  }),

]

function updateValue(value: MediaObject) {
  emit('update:modelValue', { ...value, format: 'html' })
}
</script>

<template>
  <div>
    <FormEngine
      state-key="bgInput"
      :depth="1"
      :model-value="modelValue"
      ui-size="md"
      :options="options"
      @update:model-value="updateValue($event)"
    />
  </div>
</template>
