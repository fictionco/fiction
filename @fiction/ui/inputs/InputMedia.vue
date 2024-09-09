<script lang="ts" setup>
import { useService, vue } from '@fiction/core'
import type { MediaObject, TableMediaConfig } from '@fiction/core'
import TransitionSlide from '../anim/TransitionSlide.vue'
import XButton from '../buttons/XButton.vue'
import EffectMasonry from '../effect/EffectMasonry.vue'
import ElModal from '../ElModal.vue'
import ElSpinner from '../loaders/ElSpinner.vue'
import XMedia from '../media/XMedia.vue'
import ElInput from './ElInput.vue'
import InputMediaUpload from './InputMediaUpload.vue'

defineOptions({ name: 'InputMedia' })

const props = defineProps({
  modelValue: { type: Object as vue.PropType<MediaObject>, default: () => ({}) },
  formats: { type: Object as vue.PropType<{ url?: boolean, html?: boolean }>, default: () => ({ url: true, html: true }) },
})

const emit = defineEmits<{
  (event: 'update:modelValue', payload: MediaObject): void
}>()

const { fictionMedia } = useService()

const v = vue.computed(() => props.modelValue || {})
const hasMedia = vue.computed(() => v.value.url || v.value.html)

const vis = vue.ref(false)
const navItems = [
  { name: 'Upload', value: 'upload', icon: 'i-tabler-upload' },
  { name: 'Library', value: 'library', icon: 'i-tabler-photo' },
  { name: 'HTML/Embed', value: 'html', icon: 'i-tabler-code' },
]
const navItemActive = vue.ref(v.value.format === 'html' ? navItems[2] : navItems[0])
const libraryMedia = vue.ref<TableMediaConfig[]>([])
const loadingLibrary = vue.ref(false)
const showChangeOverlay = vue.ref(false)
const htmlCode = vue.ref(v.value.html)

// Local state for current media selection
const currentSelection = vue.ref<MediaObject>({})
const initialSelection = vue.ref<MediaObject>({})

// Computed property to check if media has been modified
const mediaModified = vue.computed(() => {
  return JSON.stringify(currentSelection.value) !== JSON.stringify(initialSelection.value)
})

async function fetchLibraryMedia() {
  loadingLibrary.value = true
  try {
    const response = await fictionMedia.requests.ManageMedia.projectRequest({
      _action: 'list',
      limit: 20,
      offset: 0,
    })
    if (response.status === 'success') {
      libraryMedia.value = response.data || []
    }
  }
  catch (error) {
    console.error('Error fetching media library:', error)
  }
  finally {
    loadingLibrary.value = false
  }
}

function selectMedia(media: MediaObject) {
  currentSelection.value = { ...currentSelection.value, ...media }
}

function openMediaSelector() {
  vis.value = true
  showChangeOverlay.value = false
  // Initialize current and initial selections
  currentSelection.value = { ...v.value }
  initialSelection.value = { ...v.value }
  navItemActive.value = navItems[0]
}

vue.watch(() => htmlCode.value, (v, old) => {
  if (htmlCode.value && v !== old)
    currentSelection.value = { html: htmlCode.value, format: 'html' }
})

function deleteMedia(media: TableMediaConfig) {
  if (media === currentSelection.value) {
    currentSelection.value = {}
  }
  libraryMedia.value = libraryMedia.value.filter(m => m !== media)
  // Here you would also call the API to delete the media from the server
}

vue.watch(() => navItemActive.value, (newValue) => {
  if (newValue.value === 'library') {
    fetchLibraryMedia()
  }
})

function handleNavItemClick(item: typeof navItems[number]) {
  if (item.value === 'close') {
    vis.value = false
  }
  else {
    navItemActive.value = item
  }
}

function getMasonryItemClass(media: TableMediaConfig) {
  const out = ['w-[18%]']
  if (media.width && media.height) {
    const ratio = media.width / media.height

    // Define standard aspect ratios
    const standardRatios = [
      { class: 'aspect-square', value: 1 },
      { class: 'aspect-video', value: 16 / 9 },
      { class: 'aspect-[4/3]', value: 4 / 3 },
      { class: 'aspect-[3/4]', value: 3 / 4 },
      { class: 'aspect-[3/2]', value: 3 / 2 },
      { class: 'aspect-[2/3]', value: 2 / 3 },
      { class: 'aspect-[5/4]', value: 5 / 4 },
      { class: 'aspect-[4/5]', value: 4 / 5 },
    ]

    // Find the closest standard ratio
    const closestRatio = standardRatios.reduce((prev, curr) =>
      Math.abs(curr.value - ratio) < Math.abs(prev.value - ratio) ? curr : prev,
    )

    out.push(closestRatio.class)
  }
  else {
    out.push('aspect-square')
  }
  return out.join(' ')
}

// Function to apply changes
function applyChanges() {
  emit('update:modelValue', currentSelection.value)
  vis.value = false
}
</script>

<template>
  <div class="relative">
    <div v-if="hasMedia" class="relative overflow-hidden rounded-lg group bg-theme-100/40 dark:bg-theme-700/70" @click.stop.prevent="openMediaSelector">
      <XMedia
        :media="v"
        image-mode="contain"
        class="h-[70px] max-w-full pointer-events-none"
      />
      <div
        class="absolute text-xs font-sans inset-0 flex items-center justify-center bg-theme-900 bg-opacity-50 transition-opacity pointer-events-none opacity-0 group-hover:opacity-100"
      >
        <span class="text-theme-100 font-medium flex gap-1 items-center">
          <div class="i-tabler-rotate text-lg" />
          <div>Change Media</div>
        </span>
      </div>
    </div>
    <XButton
      v-else
      rounding="full"
      theme="primary"
      icon="i-tabler-photo"
      size="sm"
      @click.stop.prevent="openMediaSelector"
    >
      Select Media
    </XButton>
    <ElModal v-model:vis="vis" class="max-w-3xl" modal-class="max-w-screen-md">
      <div class="media-gallery text-sm">
        <div class="nav p-4 flex justify-between gap-4 items-center border-b border-theme-300/50 dark:border-theme-700/70">
          <div class="font-medium">
            Media Manager
          </div>
          <div class="flex items-center justify-center gap-3">
            <XButton
              v-for="item in navItems"
              :key="item.value"
              :icon="item.icon"
              :theme="item.value === navItemActive.value ? 'primary' : 'theme'"
              size="xs"
              rounding="full"
              :data-test-id="`nav-${item.value}`"
              @click="handleNavItemClick(item)"
            >
              {{ item.name }}
            </XButton>
          </div>
        </div>

        <TransitionSlide>
          <div v-if="currentSelection" class="px-4 py-2 border-b border-theme-300/50 dark:border-theme-700/70">
            <div class="flex justify-between text-theme-500 dark:text-theme-600 py-2">
              <div class="text-sm">
                Preview
              </div>
              <div class="text-xs" :data-media-format="currentSelection.format">
                Format: {{ currentSelection.format }}
              </div>
            </div>
            <div>
              <XMedia
                :media="currentSelection"
                image-mode="contain"
                class="h-[200px]"
              />
            </div>
          </div>
        </TransitionSlide>

        <div v-if="navItemActive.value === 'upload'" class="p-8 flex flex-col justify-center items-center">
          <InputMediaUpload
            data-test-id="media-upload"
            :has-video="true"
            :model-value="currentSelection"
            class="w-full mx-auto max-w-xl"
            @update:model-value="selectMedia({ format: 'url', ...$event })"
          />
        </div>
        <div v-else-if="navItemActive.value === 'library'" class="p-8 max-h-[400px] overflow-scroll">
          <div v-if="loadingLibrary" class="flex justify-center py-8">
            <ElSpinner class="text-theme-600 dark:text-theme-500 size-6" />
          </div>
          <EffectMasonry v-else :items="libraryMedia" :options="{ gutter: 10 }">
            <div
              v-for="media in libraryMedia"
              :key="media.mediaId"
              class=" masonry-grid-item group relative cursor-pointer overflow-hidden rounded-lg"
              :class="getMasonryItemClass(media)"
              @click="selectMedia({ format: 'url', ...media })"
            >
              <XMedia
                :media
                image-mode="cover"
                class="absolute inset-0 w-full h-full transition-transform duration-300 group-hover:scale-110"
              />
              <div class="absolute inset-0 flex items-center justify-center bg-theme-900 bg-opacity-50 opacity-0 transition-opacity group-hover:opacity-100">
                <i class="i-tabler-check text-2xl text-theme-100" />
              </div>
            </div>
          </EffectMasonry>
        </div>
        <div v-else-if="navItemActive.value === 'html'" class="p-4">
          <ElInput
            :model-value="currentSelection.html"
            input="InputTextarea"
            :rows="6"
            placeholder="Enter HTML or embed code here"
            class="mb-4"
            @update:model-value="selectMedia({ html: $event, format: 'html' })"
          />
        </div>

        <!-- Apply Changes button -->
        <div class="p-4 border-t border-theme-300/50 dark:border-theme-700/70 flex justify-between">
          <XButton theme="default" rounding="full" icon="i-tabler-x" @click="vis = false">
            Cancel
          </XButton>
          <XButton :disabled="!mediaModified" theme="primary" rounding="full" icon="i-tabler-check" @click="applyChanges">
            Apply Changes
          </XButton>
        </div>
      </div>
    </ElModal>
  </div>
</template>
