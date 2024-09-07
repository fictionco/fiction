<script lang="ts" setup>
import { vue } from '@fiction/core'
import { systemIcons } from '@fiction/core/schemas/systemIcons'
import type { MediaObject } from '@fiction/core'
import XButton from '../buttons/XButton.vue'
import ElModal from '../ElModal.vue'
import XIcon from '../media/XIcon.vue'
import ElInput from './ElInput.vue'

defineOptions({ name: 'FictionIcon' })

const props = defineProps({
  modelValue: { type: Object as vue.PropType<MediaObject>, default: () => ({}) },
})

const emit = defineEmits<{
  (event: 'update:modelValue', payload: MediaObject): void
}>()

const vis = vue.ref(false)
const navItems = [
  { name: 'System Icons', value: 'system', icon: 'i-tabler-category' },
  { name: 'Custom HTML', value: 'html', icon: 'i-tabler-code' },
]
const navItemActive = vue.ref(navItems[0])
const htmlCode = vue.ref(props.modelValue.html || '')

const currentSelection = vue.ref<MediaObject>({})

const hasIcon = vue.computed(() => {
  return !!props.modelValue.format
})

function openIconSelector() {
  vis.value = true
  currentSelection.value = { ...props.modelValue }
  navItemActive.value = navItems[0]
}

function selectIcon(media: MediaObject) {
  currentSelection.value = media
}

function applyChanges() {
  if (navItemActive.value.value === 'html') {
    emit('update:modelValue', { html: htmlCode.value, format: 'html' })
  }
  else {
    emit('update:modelValue', currentSelection.value)
  }
  vis.value = false
}

function getCurrentValue() {
  switch (currentSelection.value.format) {
    case 'iconId': {
      const icon = systemIcons.find(icon => icon.iconId === currentSelection.value.iconId)
      return icon ? icon.name : ''
    }
    case 'html':
      return `HTML Code (length: ${currentSelection.value.html?.length})`
    default:
      return ''
  }
}
</script>

<template>
  <div class="relative">
    <div v-if="hasIcon" class="relative overflow-hidden rounded-lg group bg-theme-100/40 dark:bg-theme-700/70" @click.stop.prevent="openIconSelector">
      <div class="flex items-center justify-center pointer-events-none p-2">
        <XIcon
          :icon="modelValue"
          class="size-10"
        />
      </div>
      <div
        class="absolute text-xs font-sans inset-0 flex items-center justify-center bg-theme-900 bg-opacity-50 transition-opacity pointer-events-none opacity-0 group-hover:opacity-100"
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

    <ElModal v-model:vis="vis" class="max-w-3xl" modal-class="max-w-screen-md">
      <div class="icon-selector text-sm">
        <div class="nav p-4 flex justify-between gap-4 items-center border-b border-theme-300/50 dark:border-theme-700/70">
          <div class="font-medium">
            Icon Selector
          </div>
          <div class="flex items-center justify-center gap-3">
            <XButton
              v-for="item in navItems"
              :key="item.value"
              :icon="item.icon"
              :theme="item.value === navItemActive.value ? 'primary' : 'theme'"
              size="xs"
              rounding="full"
              @click="navItemActive = item"
            >
              {{ item.name }}
            </XButton>
          </div>
        </div>

        <!-- Preview section -->
        <div v-if="currentSelection.format" class="px-4 py-2 border-b border-theme-300/50 dark:border-theme-700/70">
          <div class="flex justify-between text-theme-500 dark:text-theme-600 py-2">
            <div class="text-sm">
              Preview
            </div>
            <div class="text-xs" :data-icon-format="currentSelection.format">
              Format: {{ currentSelection.format }} Value: {{ getCurrentValue() }}
            </div>
          </div>
          <div class="flex justify-center items-center h-[100px]">
            <XIcon
              :icon="currentSelection"
              class="size-16"
            />
          </div>
        </div>

        <div v-if="navItemActive.value === 'system'" class="p-4 grid grid-cols-8 gap-4 max-h-[400px] overflow-scroll">
          <button
            v-for="icon in systemIcons"
            :key="icon.iconId"
            class="flex flex-col items-center justify-center p-2 rounded hover:bg-theme-100 dark:hover:bg-theme-800"
            @click="selectIcon({ iconId: icon.iconId, format: 'iconId' })"
          >
            <XIcon :icon="{ format: 'iconId', iconId: icon.iconId }" class="w-8 h-8" />
            <span class="mt-1 text-xs">{{ icon.name }}</span>
          </button>
        </div>

        <div v-else-if="navItemActive.value === 'html'" class="p-4">
          <ElInput
            :model-value="currentSelection.html"
            input="InputTextarea"
            :rows="6"
            placeholder="Enter HTML or embed code here"
            class="mb-4"
            @update:model-value="selectIcon({ html: $event, format: 'html' })"
          />
        </div>

        <div class="p-4 border-t border-theme-300/50 dark:border-theme-700/70 flex justify-between">
          <XButton theme="default" rounding="full" icon="i-tabler-x" @click="vis = false">
            Cancel
          </XButton>
          <XButton theme="primary" rounding="full" icon="i-tabler-check" @click="applyChanges">
            Apply Changes
          </XButton>
        </div>
      </div>
    </ElModal>
  </div>
</template>
