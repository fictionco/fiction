<script lang="ts" setup>
import type { MediaObject } from '@fiction/core'
import type { LibraryTool } from './LibraryModal.vue'
import { removeUndefined, vue } from '@fiction/core'
import XButton from '../buttons/XButton.vue'
import XMedia from '../media/XMedia.vue'
import LibraryModal from './LibraryModal.vue'

defineOptions({ name: 'InputMedia' })

const { modelValue = {}, isBackground = false } = defineProps<{
  modelValue: MediaObject
  isBackground?: boolean
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', payload: MediaObject): void
}>()

const vis = vue.ref(false)
const v = vue.computed(() => modelValue || {})
const hasMedia = vue.computed(() => v.value.url || v.value.html)

function openMediaSelector() {
  vis.value = true
}

function handleMediaUpdate(newValue: MediaObject) {
  const newMedia = removeUndefined(newValue, { removeNull: true })
  emit('update:modelValue', newMedia)
}

const tools = vue.computed(() => {
  const t: LibraryTool[] = ['upload', 'library', 'html']

  if (isBackground) {
    t.push('background')
  }

  return t
})
</script>

<template>
  <div class="relative">
    <div
      v-if="hasMedia"
      class="relative overflow-hidden rounded-lg group bg-theme-100/40 dark:bg-theme-700/70 cursor-pointer"
      @click.stop.prevent="openMediaSelector"
    >
      <XMedia
        :media="v"
        :image-mode="isBackground ? 'cover' : 'contain'"
        class="h-[70px] max-w-full pointer-events-none"
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
      rounding="full"
      theme="primary"
      icon="i-tabler-photo"
      size="sm"
      @click.stop.prevent="openMediaSelector"
    >
      Select Media
    </XButton>

    <LibraryModal
      v-model:vis="vis"
      :model-value="v"
      :tools="tools"
      title="Media Manager"
      @update:model-value="handleMediaUpdate"
    />
  </div>
</template>
