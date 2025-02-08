<script lang="ts" setup>
import type { MediaObject, StandardSize } from '@fiction/core'
import { determineMediaFormat, removeUndefined, vue } from '@fiction/core'
import XButton from '../buttons/XButton.vue'
import XMedia from '../media/XMedia.vue'
import LibraryModal from './LibraryModal.vue'

defineOptions({ name: 'InputMedia' })

const { modelValue = {}, isBackground = false, uiSize = 'md' } = defineProps<{
  modelValue?: MediaObject
  isBackground?: boolean
  uiSize?: StandardSize
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', payload: MediaObject): void
}>()

const val = vue.computed(() => {
  const format = determineMediaFormat(modelValue)
  return { ...modelValue, format }
})

const vis = vue.ref(false)
const v = vue.computed(() => modelValue || {})
const hasMedia = vue.computed(() => v.value.url || v.value.html)

function openMediaSelector() { vis.value = true }

function handleMediaUpdate(newValue: MediaObject) {
  const newMedia = removeUndefined(newValue, { removeNull: true })
  emit('update:modelValue', newMedia)
}

const sizeMap = vue.computed(() => {
  const sz: Record<StandardSize, { button: StandardSize, preview: string }> = {
    'xxs': { button: 'xxs', preview: 'h-[50px]' },
    'xs': { button: 'xs', preview: 'h-[60px]' },
    'sm': { button: 'xs', preview: 'h-[70px]' },
    'md': { button: 'sm', preview: 'h-[80px]' },
    'lg': { button: 'md', preview: 'h-[90px]' },
    'xl': { button: 'lg', preview: 'h-[100px]' },
    '2xl': { button: 'xl', preview: 'h-[110px]' },
  }

  return sz[uiSize || 'md']
})
</script>

<template>
  <div class="relative">
    <div
      v-if="hasMedia"
      data-test-id="media-select-button"
      class="relative overflow-hidden rounded-lg group bg-theme-100/40 dark:bg-theme-700/70 cursor-pointer"
      @click.stop.prevent="openMediaSelector"
    >
      <XMedia
        :media="v"
        image-mode="contain"
        class="max-w-full pointer-events-none w-full"
        :class="sizeMap.preview"
      />
      <div
        class="absolute text-xs font-sans inset-0 flex items-center justify-center bg-theme-900 bg-opacity-50 transition-opacity opacity-0 group-hover:opacity-100"
      >
        <span class="text-theme-100 font-medium flex gap-1 items-center">
          <div class="i-tabler-rotate text-lg" />
          <div>Change Media</div>
        </span>
      </div>
    </div>
    <XButton
      v-else
      data-test-id="media-select-button"
      rounding="full"
      theme="primary"
      icon="i-tabler-photo"
      :size="sizeMap.button"
      @click.stop.prevent="openMediaSelector"
    >
      {{ isBackground ? 'Edit Background' : 'Select Media' }}
    </XButton>

    <LibraryModal
      v-model:vis="vis"
      :model-value="val"
      :tools="[...(isBackground ? ['background'] as const : []), 'upload', 'media', 'html']"
      default-tool="media"
      title="Media Manager"
      @update:model-value="handleMediaUpdate"
    />
  </div>
</template>
