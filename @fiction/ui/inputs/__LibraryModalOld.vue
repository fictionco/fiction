<script lang="ts" setup>
import type { MediaObject } from '@fiction/core'
import type { InputOption } from '.'
import { determineMediaFormat, MediaSchema as schema, vue } from '@fiction/core'
import { createOption } from '.'
import XButton from '../buttons/XButton.vue'
import ElModal from '../ElModal.vue'
import XLogo from '../media/XLogo.vue'
import XMedia from '../media/XMedia.vue'
import FormEngine from './FormEngine.vue'

import LibraryBackground from './LibraryBackground.vue'
import LibraryIcon from './LibraryIcon.vue'
import LibraryMediaGallery from './LibraryMediaGallery.vue'

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
const isScrolling = vue.ref(false)

vue.watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      selectMedia(newValue)
    }
  },
  { immediate: true },
)

// Add to the <script setup>
const optionsContainer = vue.ref<HTMLElement>()
const intersectionObserver = vue.ref<IntersectionObserver>()

// Cleanup observer on unmount
vue.onUnmounted(() => {
  intersectionObserver.value?.disconnect()
})

const options = [
  createOption({
    key: 'upload',
    input: 'group',
    label: 'Upload',
    icon: { class: 'i-tabler-upload' },
    schema,
    options: [
      createOption({ key: '*', testId: 'media-upload-input', input: 'InputMediaUpload', schema }),
    ],
  }),
  createOption({
    key: 'media',
    input: 'group',
    label: 'Library',
    icon: { class: 'i-tabler-library-photo' },
    schema,
    options: [
      createOption({ key: '*', input: LibraryMediaGallery, schema }),
    ],
  }),
  createOption({
    key: 'icons',
    input: 'group',
    label: 'Icons',
    icon: { class: 'i-tabler-icons' },
    schema,
    options: [
      createOption({ key: '*', input: LibraryIcon, schema }),
    ],
  }),
  createOption({
    key: 'background',
    input: 'group',
    label: 'Background',
    icon: { class: 'i-tabler-background' },
    schema,
    options: [
      createOption({ key: '*', input: LibraryBackground, schema }),
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

// Filter options based on tools prop
const filteredOptions = vue.computed(() => {
  if (!props.tools?.length)
    return options

  return props.tools.map(toolKey =>
    options.find(opt => opt.key.value === toolKey),
  ).filter(Boolean) as InputOption[]
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

// Modify scrollToOption function to handle smooth scrolling
function scrollToOption(optionKey: string) {
  activeOptionId.value = optionKey

  const sel = `[data-option-key="${optionKey}"]`
  // Find target element
  const el = document.querySelector(sel)

  if (!el || !optionsContainer.value) {
    console.error(`Element/container not found for scroll (${sel})`)
    return
  }

  isScrolling.value = true

  // Calculate scroll position
  const containerRect = optionsContainer.value.getBoundingClientRect()
  const elementRect = el.getBoundingClientRect()
  const scrollOffset = elementRect.top - containerRect.top + optionsContainer.value.scrollTop

  // Smooth scroll to target
  optionsContainer.value.scrollTo({
    top: scrollOffset,
    behavior: 'smooth',
  })

  setTimeout(() => { isScrolling.value = false }, 500)
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

vue.onUnmounted(() => {
  intersectionObserver.value?.disconnect()
})
</script>

<template>
  <ElModal
    :vis
    class="max-w-4xl"
    modal-class="max-w-screen-md"
    :has-close="false"
    @update:vis="emit('update:vis', $event)"
  >
    <div :data-test-id="testId" class="bg-white text-theme-900 dark:bg-theme-900 dark:text-theme-100 rounded-lg overflow-hidden">
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
        <!-- Content Area -->
        <div class="flex-1 flex flex-col">
          <!-- Preview Area -->
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

          <!-- Tool Content Area -->
          <div ref="optionsContainer" class="flex-1 p-4 bg-theme-50/50 dark:bg-theme-800/50 max-h-[350px] overflow-scroll">
            <div>
              <FormEngine
                state-key="mediaSetup"
                :depth="1"
                :model-value="currentSelection"
                ui-size="md"
                :options="filteredOptions"
                @update:model-value="selectMedia($event)"
              />
            </div>
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
