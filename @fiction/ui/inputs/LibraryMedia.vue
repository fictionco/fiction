<script lang="ts" setup>
import type { MediaObject, vue } from '@fiction/core'
import type { InputOption } from '.'
import { MediaDisplaySchema as schema } from '@fiction/core'
import { createOption } from '.'
import FormEngine from './FormEngine.vue'
import LibraryMediaGallery from './LibraryMediaGallery.vue'

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
]

const options: InputOption[] = [
  createOption({
    key: 'group.upload',
    input: 'group',
    label: 'Upload Image or Video',
    icon: { class: 'i-tabler-upload' },
    schema,
    options: [
      createOption({
        key: '*',
        testId: 'media-upload-input',
        input: 'InputMediaUpload',
        schema,
      }),
    ],
  }),
  createOption({
    key: 'group.mediaLibrary',
    input: 'group',
    label: 'Media Library',
    icon: { class: 'i-tabler-library-photo' },
    schema,
    options: [
      createOption({
        key: '*',
        input: LibraryMediaGallery,
        schema,
      }),
    ],
  }),
]
</script>

<template>
  <div>
    <FormEngine
      state-key="mediaSetup"
      :depth="1"
      :model-value="modelValue"
      ui-size="md"
      :options="options"
      @update:model-value="emit('update:modelValue', $event)"
    />
  </div>
</template>
