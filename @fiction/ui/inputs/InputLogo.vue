<script lang="ts" setup>
import type { MediaObject } from '@fiction/core'
import { vue } from '@fiction/core'
import XButton from '../buttons/XButton.vue'
import XLogo from '../media/XLogo.vue'
import LibraryModal from './LibraryModal.vue'

defineOptions({ name: 'InputLogo' })

const props = defineProps({
  modelValue: { type: Object as vue.PropType<MediaObject>, default: () => ({}) },
})

const emit = defineEmits<{
  (event: 'update:modelValue', payload: MediaObject): void
}>()

const vis = vue.ref(false)
const v = vue.computed(() => props.modelValue || {})
const hasLogo = vue.computed(() => v.value.url || v.value.html || v.value.typography?.text || v.value.iconId)

function openLogoSelector() {
  vis.value = true
}

function handleLogoUpdate(newValue: MediaObject) {
  emit('update:modelValue', newValue)
}
</script>

<template>
  <div class="relative">
    <div
      v-if="hasLogo"
      class="relative overflow-hidden rounded-lg group bg-theme-100/40 dark:bg-theme-700/70 cursor-pointer"
      data-test-id="logo-select-button"
      @click.stop.prevent="openLogoSelector"
    >
      <div class="flex items-center justify-center pointer-events-none p-2 h-[50px]">
        <XLogo
          :media="v"
          class="h-full max-w-full"
          alignment-class="justify-start"
        />
      </div>
      <div
        class="absolute text-xs font-sans inset-0 flex items-center justify-center bg-primary-900/80 cursor-pointer transition-opacity  opacity-0 group-hover:opacity-100"
      >
        <span class="text-theme-100 font-medium flex gap-1 items-center">
          <div class="i-tabler-rotate text-lg" />
          <div>Change Logo</div>
        </span>
      </div>
    </div>
    <XButton
      v-else
      rounding="full"
      theme="primary"
      icon="i-tabler-photo"
      size="sm"
      data-test-id="logo-select-button"
      @click.stop.prevent="openLogoSelector"
    >
      Select Logo
    </XButton>

    <LibraryModal
      v-model="v"
      v-model:vis="vis"
      :tools="['upload', 'library', 'html', 'typography']"
      title="Logo Selector"
      @update:model-value="handleLogoUpdate"
    />
  </div>
</template>
