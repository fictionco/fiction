<script lang="ts" setup>
import type { MediaObject } from '@fiction/core'
import { determineMediaFormat, MediaDisplaySchema as schema, vue } from '@fiction/core'
import { SITE_INJECTION_KEY } from '@fiction/site'
import { createOption } from '.'
import XButton from '../buttons/XButton.vue'
import ElModal from '../ElModal.vue'
import XLogo from '../media/XLogo.vue'
import XMedia from '../media/XMedia.vue'
import LibraryBackground from './LibraryBackground.vue'
import LibraryIcon from './LibraryIcon.vue'
import LibraryMediaGallery from './LibraryMediaGallery.vue'
import TabbedOptions from './TabbedOptions.vue'
// Define valid tool options
type ToolOptionKey = 'upload' | 'media' | 'icons' | 'background' | 'html'

defineOptions({ name: 'LibraryModal' })

const props = defineProps<{
  modelValue: MediaObject
  vis?: boolean
  tools?: ToolOptionKey[] // Typed array of valid tool options
  title?: string
  testId?: string
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', payload: MediaObject): void
  (event: 'update:vis', payload: boolean): void
}>()

const site = vue.inject(SITE_INJECTION_KEY, vue.computed(() => undefined))

const currentSelection = vue.ref<MediaObject>({})
const activeOptionId = vue.ref<string>('')

vue.watch(
  () => props.modelValue,
  (newValue) => {
    setMediaData(newValue)
  },
  { immediate: true },
)

// Define all available options
const allOptions = [
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

// Filter options based on tools prop if provided
const options = vue.computed(() => {
  if (!props.tools || props.tools.length === 0) {
    return allOptions
  }

  return allOptions.filter(option =>
    props.tools?.includes(option.key.value as ToolOptionKey),
  )
})

// Set default active option when options change
vue.watch(options, (newOptions) => {
  if (newOptions.length > 0 && (!activeOptionId.value || !newOptions.some(opt => opt.key.value === activeOptionId.value))) {
    activeOptionId.value = newOptions[0].key.value
  }
}, { immediate: true })

// Select media based on the model value
function setMediaData(media?: MediaObject) {
  if (!media) {
    currentSelection.value = {}
    return
  }

  const mediaData = media

  const format = determineMediaFormat(mediaData)
  currentSelection.value = { ...currentSelection.value, format, ...mediaData }
}

const mediaPreview = vue.computed(() => {
  const media = currentSelection.value
  return site.value ? site.value.shortcodes.parseObjectSync(media) : media
})

function hasMedia() {
  return currentSelection.value.url || currentSelection.value.html || currentSelection.value.iconId
}

function clearMedia() {
  currentSelection.value = {}
}

function applyChanges(value: MediaObject) {
  setMediaData(value)
  emit('update:modelValue', currentSelection.value)
  closeModal()
}

function closeModal() {
  emit('update:vis', false)
}
</script>

<template>
  <ElModal
    :vis
    modal-class="max-w-screen-md"
    :has-close="false"
    @update:vis="emit('update:vis', $event)"
  >
    <TabbedOptions
      :options="options"
      :model-value="currentSelection"
      :active-option-id="activeOptionId"
      @update:model-value="applyChanges($event)"
      @update:temp-value="setMediaData($event)"
      @update:active-option-id="activeOptionId = $event"
      @cancel="closeModal()"
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
        <div class="p-4 border-b border-theme-200 dark:border-theme-700 h-[200px] bg-theme-50 dark:bg-theme-800">
          <div class="relative h-full">
            <div class="w-full h-full flex items-center justify-center text-center">
              <template v-if="mediaPreview.format || mediaPreview.gradient?.stops?.length || mediaPreview.backgroundColor">
                <XLogo
                  v-if="['iconId', 'iconClass', 'typography'].includes(mediaPreview.format || '')"
                  :media="mediaPreview"
                  class="max-h-full h-[80%]"
                />
                <XMedia
                  v-else
                  :media="mediaPreview"
                  class="max-h-full object-contain w-full h-full"
                  image-mode="contain"
                />
              </template>
              <div
                v-else
                class="text-center rounded-lg p-8 w-full h-full flex items-center justify-center"
              >
                <div>
                  <i class="i-tabler-photo-plus text-4xl text-theme-400 dark:text-theme-600 mb-2" />
                  <p class="text-theme-400 dark:text-theme-600">
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
