# LibraryModal.vue
<script lang="ts" setup>
import type { MediaObject } from '@fiction/core'
import type { InputOption } from '.'
import { determineMediaFormat, MediaDisplaySchema as schema, vue } from '@fiction/core'
import { createOption } from '.'
import XButton from '../buttons/XButton.vue'
import ElModal from '../ElModal.vue'
import XMedia from '../media/XMedia.vue'
import FormEngine from './FormEngine.vue'
import LibraryBackground from './LibraryBackground.vue'
import LibraryIcon from './LibraryIcon.vue'
import LibraryMediaGallery from './LibraryMediaGallery.vue'

const props = defineProps<{
  modelValue: MediaObject
  vis?: boolean
  tools?: string[] // Filter by these option keys
  title?: string
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', payload: MediaObject): void
  (event: 'update:vis', payload: boolean): void
}>()

const currentSelection = vue.ref<MediaObject>({})
const activeOptionId = vue.ref<string>('')

// Options for the form engine
const options = [
  createOption({
    key: 'upload',
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
    key: 'media',
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
  createOption({
    key: 'icons',
    input: 'group',
    label: 'Icon Library',
    icon: { class: 'i-tabler-icons' },
    schema,
    options: [
      createOption({
        key: '*',
        input: LibraryIcon,
        schema,
      }),
    ],
  }),
  createOption({
    key: 'background',
    input: 'group',
    label: 'Background Color / Gradient',
    icon: { class: 'i-tabler-background' },
    schema,
    options: [
      createOption({
        key: '*',
        input: LibraryBackground,
        schema,
      }),
    ],
  }),
  createOption({
    key: 'html',
    input: 'group',
    label: 'Custom HTML / Embed',
    icon: { class: 'i-tabler-code' },
    schema,
    options: [
      createOption({
        key: 'html',
        input: 'InputTextarea',
        schema,
        props: { rows: 5 },
        placeholder: 'Paste your HTML or Embed code here',
      }),
    ],
  }),
]

// Filter options based on tools prop
const filteredOptions = vue.computed(() => {
  if (!props.tools?.length)
    return options
  return options.filter(opt => props.tools!.includes(opt.key.value))
})

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

function scrollToOption(optionKey: string) {
  activeOptionId.value = optionKey
  const el = document.querySelector(`[data-option-key="${optionKey}"]`)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

function hasMedia() {
  return currentSelection.value.url || currentSelection.value.html || currentSelection.value.iconId
}

function clearMedia() {
  currentSelection.value = {}
}

function applyChanges() {
  emit('update:modelValue', currentSelection.value)
  emit('update:vis', false)
}
</script>

<template>
  <ElModal
    :vis="vis"
    class="max-w-4xl"
    modal-class="max-w-screen-md"
    :has-close="false"
    @update:vis="emit('update:vis', $event)"
  >
    <div data-test-id="media-modal" class="bg-white text-theme-900 dark:bg-theme-900 dark:text-theme-100 rounded-lg overflow-hidden">
      <!-- Header -->
      <div class="p-4 border-b border-theme-200 dark:border-theme-700">
        <div class="flex items-center justify-between">
          <h2 class="font-medium">
            {{ title || 'Media Manager' }}
          </h2>
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
        </div>
      </div>

      <!-- Main Content Area -->
      <div class="flex min-h-[500px]">
        <!-- Left Sidebar - Option Navigation -->
        <div class="w-48 border-r border-theme-200 dark:border-theme-700 flex-shrink-0 bg-theme-50 dark:bg-theme-800">
          <nav class="p-3">
            <button
              v-for="opt in filteredOptions"
              :key="opt.key.value"
              :data-test-id="`media-tool-${opt.key.value}`"
              class="w-full px-4 py-2 rounded-lg text-left mb-1 flex items-center gap-2 transition-colors text-sm font-medium"
              :class="[
                activeOptionId === opt.key.value
                  ? 'bg-primary-600 dark:bg-primary-900/50 text-white'
                  : 'hover:bg-theme-100 dark:hover:bg-theme-700 text-theme-700 dark:text-theme-200',
              ]"
              @click="scrollToOption(opt.key.value)"
            >
              <i class="text-lg" :class="[opt.settings.icon?.class]" />
              <span>{{ opt.label.value }}</span>
            </button>
          </nav>
        </div>

        <!-- Content Area -->
        <div class="flex-1 flex flex-col">
          <!-- Preview Area -->
          <div class="p-4 border-b border-theme-200 dark:border-theme-700 h-64">
            <div class="relative h-full">
              <div class="w-full h-full flex items-center justify-center text-center">
                <template v-if="currentSelection.format || currentSelection.gradient?.stops?.length || currentSelection.backgroundColor">
                  <XMedia
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

          <!-- Options Content Area -->
          <div class="flex-1 p-4 bg-theme-50/50 dark:bg-theme-800/50 overflow-y-auto max-h-[400px]">
            <FormEngine
              state-key="mediaSetup"
              :depth="1"
              :model-value="modelValue"
              ui-size="md"
              :options="filteredOptions"
              @update:model-value="emit('update:modelValue', $event)"
            />
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-4 border-t border-theme-200 dark:border-theme-700 flex justify-between bg-theme-50 dark:bg-theme-800">
        <XButton
          theme="default"
          size="md"
          icon="i-tabler-x"
          data-test-id="media-cancel"
          @click="emit('update:vis', false)"
        >
          Cancel
        </XButton>
        <XButton
          theme="primary"
          size="md"
          icon="i-tabler-check"
          data-test-id="media-apply"
          @click="applyChanges"
        >
          Apply Changes
        </XButton>
      </div>
    </div>
  </ElModal>
</template>
