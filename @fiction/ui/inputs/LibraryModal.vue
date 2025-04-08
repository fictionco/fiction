<script lang="ts" setup>
import type { MediaObject } from '@fiction/core'
import type { InputOption } from '.'
import { determineMediaFormat, MediaDisplaySchema as schema, vue, waitFor } from '@fiction/core'
import { createOption } from '.'
import XButton from '../buttons/XButton.vue'
import ElModal from '../ElModal.vue'
import XLogo from '../media/XLogo.vue'
import XMedia from '../media/XMedia.vue'
import FormEngine from './FormEngine.vue'
import LibraryBackground from './LibraryBackground.vue'

import LibraryIcon from './LibraryIcon.vue'
import LibraryMediaGallery from './LibraryMediaGallery.vue'
import TabbedOptions from './TabbedOptions.vue'

defineOptions({ name: 'LibraryModal' })

const props = defineProps<{
  modelValue: MediaObject
  vis?: boolean
  tools?: string[] // Filter by these option keys
  title?: string
  testId?: string
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', payload: MediaObject): void
  (event: 'update:vis', payload: boolean): void
}>()

const currentSelection = vue.ref<MediaObject>({})
const activeOptionId = vue.ref<string>('')

vue.watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      selectMedia(newValue)
    }
  },
  { immediate: true },
)

const options = [
  createOption({
    key: 'upload',
    input: 'group',
    label: 'Upload',
    icon: { class: 'i-tabler-upload' },
    schema,
    options: [
      createOption({ key: '*', label: 'Upload or Enter URL', testId: 'media-upload-input', input: 'InputMediaUpload', schema }),
    ],
  }),
  createOption({
    key: 'media',
    input: 'group',
    label: 'Library',
    icon: { class: 'i-tabler-library-photo' },
    schema,
    options: [
      createOption({ key: '*', label: 'Media Library', input: LibraryMediaGallery, schema }),
    ],
  }),
  createOption({
    key: 'icons',
    input: 'group',
    label: 'Icons',
    icon: { class: 'i-tabler-icons' },
    schema,
    options: [
      createOption({ key: '*', label: 'Icon Library', input: LibraryIcon, schema }),
    ],
  }),
  createOption({
    key: 'background',
    input: 'group',
    label: 'Background',
    icon: { class: 'i-tabler-background' },
    schema,
    options: [
      createOption({ key: '*', label: 'Background', input: LibraryBackground, schema }),
    ],
  }),
  createOption({
    key: 'html',
    input: 'group',
    label: 'HTML',
    icon: { class: 'i-tabler-code' },
    schema,
    options: [
      createOption({ key: 'html', input: 'InputTextarea', schema, props: { rows: 5 }, placeholder: 'Paste your HTML or Embed code here' }),
    ],
  }),
]

// Watch model value changes
vue.watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    selectMedia(newValue)
  }
}, { immediate: true })

function selectMedia(media: MediaObject) {
  const format = determineMediaFormat(media)
  currentSelection.value = { ...currentSelection.value, format, ...media }
}

function hasMedia() {
  return currentSelection.value.url || currentSelection.value.html || currentSelection.value.iconId
}

function clearMedia() {
  currentSelection.value = {}
}

function applyChanges(value: MediaObject) {
  selectMedia(value)
  emit('update:modelValue', currentSelection.value)
  emit('update:vis', false)
}
</script>

<template>
  <ElModal
    :vis
    class="max-w-4xl"
    modal-class="max-w-screen-md"
    :has-close="false"
    @update:vis="emit('update:vis', $event)"
  >
    <TabbedOptions
      :options
      :model-value="currentSelection"
      :active-option-id="activeOptionId"
      @update:model-value="applyChanges($event)"
      @update:temp-value="selectMedia($event)"
    >
      <template #header>
        <div class="flex gap-4">
          <XButton
            v-if="currentSelection.format"
            theme="default"
            design="link"
            size="sm"
            icon="i-tabler-info-circle"
          >
            <span class="text-theme-400">Format:</span> <span>{{ currentSelection.format }}</span>
          </XButton>
          <XButton
            :disabled="!hasMedia()"
            theme="default"
            size="sm"
            icon="i-tabler-trash"
            @click="clearMedia"
          >
            Clear Media
          </XButton>
        </div>
      </template>
      <template #preview>
        <div class="p-4 border-b border-theme-200 dark:border-theme-700 h-64">
          <div class="relative h-full">
            <div class="w-full h-full flex items-center justify-center text-center" :data-m="JSON.stringify(currentSelection)">
              <template v-if="currentSelection.format || currentSelection.gradient?.stops?.length || currentSelection.backgroundColor">
                <XLogo
                  v-if="['iconId', 'iconClass', 'typography'].includes(currentSelection.format || '')"
                  :media="currentSelection"
                  class="max-h-full h-[80%]"
                />
                <XMedia
                  v-else
                  :media="currentSelection"
                  class="max-h-full object-contain w-full h-full"
                  image-mode="contain"
                />
              </template>
              <div
                v-else
                class="text-center border-2 border-dashed border-theme-200 dark:border-theme-700 rounded-lg p-8 w-full h-full flex items-center justify-center"
              >
                <div>
                  <i class="i-tabler-photo-plus text-4xl text-theme-400 dark:text-theme-600 mb-2" />
                  <p class="text-theme-500 dark:text-theme-400">
                    No media selected
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </TabbedOptions>
  </ElModal>
</template>
