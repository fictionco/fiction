<script lang="ts" setup>
import type { MediaObject, StandardSize } from '@fiction/core'
import type { Site } from '@fiction/site'
import { determineMediaFormat, removeUndefined, vue } from '@fiction/core'
import { SITE_INJECTION_KEY } from '@fiction/site'
import XMedia from '../media/XMedia.vue'
import LibraryModal from './LibraryModal.vue'

defineOptions({ name: 'InputMedia' })

const props = defineProps<{
  modelValue?: MediaObject
  isBackground?: boolean
  uiSize?: StandardSize
  optionPath?: string
  disabled?: boolean
  fullWidth?: boolean
  aspectClass?: string
  site?: Site
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', payload: MediaObject | undefined): void
}>()

const site = vue.inject(SITE_INJECTION_KEY, vue.computed(() => props.site))

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

// Width based on uiSize (only applied when fullWidth is false)
const widthClass = vue.computed(() => {
  if (props.fullWidth)
    return 'w-full'

  const sizes = { 'xxs': 'w-16', 'xs': 'w-24', 'sm': 'w-32', 'md': 'w-40', 'lg': 'w-48', 'xl': 'w-56', '2xl': 'w-64' }
  return sizes[props.uiSize || 'md']
})

function openMediaSelector() {
  if (!props.disabled)
    vis.value = true
}

function clearMedia(event: MouseEvent) {
  event.stopPropagation()
  if (confirm('Remove this media?'))
    emit('update:modelValue', undefined)
}

function handleMediaUpdate(newValue: MediaObject) {
  emit('update:modelValue', removeUndefined(newValue, { removeNull: true }))
}

const mediaPreview = vue.computed(() => {
  const v = value.value

  return site.value && v ? site.value.shortcodes.parseObjectSync(v) : v
})
</script>

<template>
  <div data-test-id="media-input">
    <!-- Media display or empty placeholder -->
    <div
      class="@container/media-input border rounded-md overflow-hidden relative"
      :class="[
        aspectClass || 'aspect-[1.618/1]',
        widthClass,
        disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer',
        !hasMedia && 'border-dashed border-theme-300 dark:border-theme-600 hover:border-theme-400 dark:hover:border-theme-500',
      ]"
      @click.stop="openMediaSelector"
    >
      <!-- Media preview -->
      <XMedia
        v-if="hasMedia"
        :media="mediaPreview"
        image-mode="cover"
        class="w-full h-full object-cover"
      />

      <!-- Empty state -->
      <div
        v-else
        class="flex flex-col items-center justify-center h-full gap-0.5 @[350px]/media-input:gap-1 p-1.5"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="size-4 @[350px]/media-input:size-5 text-theme-500 dark:text-theme-400" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
        </svg>
        <span class="text-[10px] text-theme-500 dark:text-theme-400 font-mono truncate min-w-0 w-full text-center">
          {{ isBackground ? 'Add Background' : 'Add Media' }}
        </span>
      </div>

      <!-- Hover overlay with remove button -->
      <div
        v-if="hasMedia && !disabled"
        class="absolute inset-0 bg-theme-950/10 dark:bg-theme-900/40 opacity-0 hover:opacity-100 transition-opacity"
      >
        <button
          type="button"
          aria-label="Remove media"
          class="absolute top-1 right-1 p-1 text-theme-50 bg-theme-700/80 hover:bg-theme-600 rounded-lg"
          @click="clearMedia"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="size-3" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>

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
