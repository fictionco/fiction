<script lang="ts" setup>
import type { MediaObject, StandardSize } from '@fiction/core'
import { determineMediaFormat, removeUndefined, vue } from '@fiction/core'
import XMedia from '../media/XMedia.vue'
import LibraryModal from './LibraryModal.vue'

defineOptions({ name: 'InputMedia' })

const props = defineProps<{
  modelValue?: MediaObject
  isBackground?: boolean
  uiSize?: StandardSize
  optionPath?: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', payload: MediaObject): void
}>()

const vis = vue.ref(false)
const value = vue.computed(() => {
  const media = props.modelValue || {}
  const format = determineMediaFormat(media)
  return { ...media, format }
})

const hasMedia = vue.computed(() => {
  const v = value.value
  return v.url || v.html || v.iconId || (props.isBackground && v.gradient)
})

// Smaller sizing classes compared to default UI elements
const sizes = {
  'xxs': 'h-12',
  'xs': 'h-14',
  'sm': 'h-16',
  'md': 'h-20',
  'lg': 'h-24',
  'xl': 'h-28',
  '2xl': 'h-32',
}

const height = vue.computed(() => sizes[props.uiSize || 'md'])

function openMediaSelector() {
  if (!props.disabled) {
    vis.value = true
  }
}

function clearMedia(event: MouseEvent) {
  event.stopPropagation()

  // Simple confirmation dialog
  if (confirm('Remove this media?')) {
    emit('update:modelValue', {})
  }
}

function handleMediaUpdate(newValue: MediaObject) {
  const newMedia = removeUndefined(newValue, { removeNull: true })
  emit('update:modelValue', newMedia)
}
</script>

<template>
  <div data-test-id="media-input" class="mb-1">
    <!-- Media is present -->
    <div
      v-if="hasMedia"
      class="border border-theme-200 dark:border-theme-700 rounded-md overflow-hidden relative group"
      :class="[height, disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer']"
      @click="openMediaSelector"
    >
      <XMedia
        :media="value"
        image-mode="contain"
        class="w-full h-full object-contain"
      />

      <!-- Hover overlay -->
      <div
        v-if="!disabled"
        class="absolute inset-0 bg-theme-950/10 dark:bg-theme-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
      >
        <!-- Remove button - positioned in the top right corner -->
        <button
          type="button"
          aria-label="Remove media"
          class="absolute top-1 right-1 p-1 text-theme-50 bg-theme-700/80 hover:bg-theme-600 rounded-lg"
          @click="clearMedia"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="size-2.5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>

    <!-- No media selected -->
    <button
      v-else
      type="button"
      :disabled="disabled"
      class="w-full flex items-center justify-center gap-1.5 border border-dashed border-theme-300 dark:border-theme-600 rounded-md transition-colors"
      :class="[
        height,
        disabled
          ? 'opacity-60 cursor-not-allowed'
          : 'hover:border-theme-400 dark:hover:border-theme-500 cursor-pointer',
      ]"
      @click="openMediaSelector"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-theme-500 dark:text-theme-400" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
      </svg>
      <span class="text-xs text-theme-500 dark:text-theme-400">
        {{ isBackground ? 'Add Background' : 'Add Media' }}
      </span>
    </button>

    <!-- Media selector modal -->
    <LibraryModal
      v-model:vis="vis"
      :model-value="value"
      :tools="[...(isBackground ? ['background'] as const : []), 'upload', 'media', 'html']"
      default-tool="media"
      title="Media Manager"
      :test-id="`media-modal-${optionPath}`"
      @update:model-value="handleMediaUpdate"
    />
  </div>
</template>
