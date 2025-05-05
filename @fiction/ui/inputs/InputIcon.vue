<script lang="ts" setup>
import type { MediaObject, StandardSize } from '@fiction/core'
import { vue } from '@fiction/core'
import XButton from '../buttons/XButton.vue'
import XIcon from '../media/XIcon.vue'
import LibraryModal from './LibraryModal.vue'

defineOptions({ name: 'InputIcon' })

const { modelValue = {}, uiSize = 'md' } = defineProps<{
  modelValue?: MediaObject
  uiSize?: StandardSize
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', payload: MediaObject): void
}>()

const vis = vue.ref(false)
const v = vue.computed(() => modelValue || {})
const hasIcon = vue.computed(() => v.value.iconId || v.value.html || v.value.url)

function openIconSelector() {
  vis.value = true
}

function handleIconUpdate(newValue: MediaObject) {
  emit('update:modelValue', newValue)
}

const sizeMap = vue.computed(() => {
  const sz: Record<StandardSize, { button: StandardSize, preview: string }> = {
    'xxs': { button: 'xxs', preview: 'size-5' },
    'xs': { button: 'xs', preview: 'size-6' },
    'sm': { button: 'xs', preview: 'size-8' },
    'md': { button: 'xs', preview: 'size-10' },
    'lg': { button: 'md', preview: 'size-12' },
    'xl': { button: 'lg', preview: 'size-14' },
    '2xl': { button: 'xl', preview: 'size-16' },
  }

  return sz[uiSize || 'md']
})
</script>

<template>
  <div class="relative">
    <div
      v-if="hasIcon"
      class="relative overflow-hidden rounded-lg group bg-theme-100/40 dark:bg-theme-700/70 cursor-pointer"
      @click.stop.prevent="openIconSelector"
    >
      <div class="flex items-center justify-center p-2">
        <XIcon :media="v" :class="sizeMap.preview" />
      </div>
      <div
        class="cursor-pointer absolute text-xs font-sans inset-0 flex items-center justify-center bg-theme-900 bg-opacity-50 transition-opacity opacity-0 group-hover:opacity-100"
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
      design="outline"
      icon="i-tabler-icons"
      :size="sizeMap.button"
      @click.stop.prevent="openIconSelector"
    >
      Select Icon
    </XButton>

    <LibraryModal
      v-model:vis="vis"
      :model-value="v"
      :tools="['icons']"
      default-tool="icons"
      title="Icon Selector"
      @update:model-value="handleIconUpdate"
    />
  </div>
</template>
