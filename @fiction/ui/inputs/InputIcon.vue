<script lang="ts" setup>
import type { MediaObject } from '@fiction/core'
import { vue } from '@fiction/core'
import XButton from '../buttons/XButton.vue'
import XIcon from '../media/XIcon.vue'
import LibraryModal from './LibraryModal.vue'

defineOptions({ name: 'InputIcon' })

const props = defineProps({
  modelValue: { type: Object as vue.PropType<MediaObject>, default: () => ({}) },
})

const emit = defineEmits<{
  (event: 'update:modelValue', payload: MediaObject): void
}>()

const vis = vue.ref(false)
const v = vue.computed(() => props.modelValue || {})
const hasIcon = vue.computed(() => v.value.iconId || v.value.html || v.value.url)

function openIconSelector() {
  vis.value = true
}

function handleIconUpdate(newValue: MediaObject) {
  emit('update:modelValue', newValue)
}
</script>

<template>
  <div class="relative">
    <div
      v-if="hasIcon"
      class="relative overflow-hidden rounded-lg group bg-theme-100/40 dark:bg-theme-700/70"
      @click.stop.prevent="openIconSelector"
    >
      <div class="flex items-center justify-center pointer-events-none p-2">
        <XIcon :media="v" class="size-10" />
      </div>
      <div
        class="absolute text-xs font-sans inset-0 flex items-center justify-center bg-theme-900 bg-opacity-50 transition-opacity opacity-0 group-hover:opacity-100"
      >
        <span class="text-theme-100 font-medium flex gap-1 items-center">
          <div class="i-tabler-rotate text-lg" />
          <div>Change Icon</div>
        </span>
      </div>
    </div>
    <XButton
      v-else
      rounding="full"
      theme="primary"
      icon="i-tabler-photo"
      size="sm"
      @click.stop.prevent="openIconSelector"
    >
      Select Icon
    </XButton>

    <LibraryModal
      v-model:vis="vis"
      :model-value="v"
      :tools="['upload', 'library', 'html', 'icons']"
      title="Icon Selector"
      @update:model-value="handleIconUpdate"
    />
  </div>
</template>
