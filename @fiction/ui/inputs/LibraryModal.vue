<script lang="ts" setup>
import { vue } from '@fiction/core'
import type { MediaObject } from '@fiction/core'
import XButton from '../buttons/XButton.vue'
import ElModal from '../ElModal.vue'
import XLogo from '../media/XLogo.vue'
import XMedia from '../media/XMedia.vue'
import ElInput from './ElInput.vue'
import InputMediaUpload from './InputMediaUpload.vue'
import LibraryIcon from './LibraryIcon.vue'
import LibraryMedia from './LibraryMedia.vue'

const props = defineProps({
  modelValue: { type: Object as vue.PropType<MediaObject>, default: () => ({}) },
  vis: { type: Boolean, default: false },
  tools: { type: Array as vue.PropType<Tool[]>, default: () => ['upload'] },
  title: { type: String, default: 'Library' },
})
const emit = defineEmits<{
  (event: 'update:modelValue', payload: MediaObject): void
  (event: 'update:vis', payload: boolean): void
}>()

const availableTools = [
  { name: 'Upload', value: 'upload', icon: 'i-tabler-upload' },
  { name: 'Library', value: 'library', icon: 'i-tabler-photo' },
  { name: 'HTML/Embed', value: 'html', icon: 'i-tabler-code' },
  { name: 'System Icons', value: 'icons', icon: 'i-tabler-category' },
  { name: 'Text + Font', value: 'typography', icon: 'i-tabler-typography' },
] as const
type Tool = typeof availableTools[number]['value']

function getDefaultTool() {
  const format = props.modelValue.format
  let v: Tool
  if (format === 'html')
    v = 'html'
  else if (format === 'typography')
    v = 'typography'
  else if (format === 'iconId')
    v = 'icons'
  else v = 'upload'

  return availableTools.find(item => item.value === v) || availableTools[0]
}

const navItems = vue.computed(() => availableTools.filter(item => props.tools.includes(item.value)))

const navItemActive = vue.ref(getDefaultTool())
const currentSelection = vue.ref<MediaObject>({ ...props.modelValue })

function selectMedia(media: MediaObject) {
  currentSelection.value = { ...currentSelection.value, ...media }
}

function applyChanges() {
  emit('update:modelValue', currentSelection.value)
  emit('update:vis', false)
}

function updateCurrentSelection(updates: Partial<MediaObject>) {
  currentSelection.value = { ...currentSelection.value, ...updates }
}
</script>

<template>
  <ElModal :vis class="max-w-3xl" modal-class="max-w-screen-md" @update:vis="emit('update:vis', $event)">
    <div class="library-modal text-sm">
      <div class="nav p-4 flex justify-between gap-4 items-center border-b border-theme-300/50 dark:border-theme-700/70">
        <div class="font-medium">
          {{ title }}
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
        <div class="flex justify-between text-theme-500 dark:text-theme-400 py-2">
          <div class="text-sm">
            Preview
          </div>
          <div class="text-xs" :data-format="currentSelection.format">
            Format: {{ currentSelection.format }}
          </div>
        </div>
        <div class="flex justify-center items-center truncate p-4">
          <XLogo :media="currentSelection" :class="['typography'].includes(currentSelection.format) ? 'h-[60px]' : 'h-[150px]'" />
        </div>
      </div>

      <div class=" p-4 text-xs flex items-center gap-1 text-theme-500 dark:text-theme-400">
        <span>Set New Value ({{ navItemActive.value }} format)</span> <span class="i-tabler-arrow-down-right text-lg" />
      </div>

      <!-- Tool-specific content -->
      <div v-if="navItemActive.value === 'upload'" class="p-8 flex flex-col justify-center items-center">
        <InputMediaUpload
          :has-video="true"
          :model-value="currentSelection"
          class="w-full mx-auto max-w-xl"
          @update:model-value="selectMedia({ format: 'url', ...$event })"
        />
      </div>

      <LibraryMedia
        v-else-if="navItemActive.value === 'library'"
        v-model="currentSelection"
        @update:model-value="selectMedia"
      />

      <div v-else-if="navItemActive.value === 'html'" class="p-4">
        <ElInput
          :model-value="currentSelection.html"
          input="InputTextarea"
          :rows="6"
          placeholder="Enter HTML or embed code here"
          class="mb-4"
          @update:model-value="updateCurrentSelection({ html: $event, format: 'html' })"
        />
      </div>

      <LibraryIcon
        v-else-if="navItemActive.value === 'icons'"
        v-model="currentSelection"
        @update:model-value="selectMedia"
      />

      <div v-else-if="navItemActive.value === 'typography'" class="p-8">
        <div class="max-w-md mx-auto">
          <ElInput
            :model-value="currentSelection.typography?.text"
            label="Logo Text"
            input="InputText"
            placeholder="Enter text for logo"
            class="mb-4"
            @update:model-value="updateCurrentSelection({ typography: { ...currentSelection.typography, text: $event }, format: 'typography' })"
          />
          <ElInput
            :model-value="currentSelection.typography?.font"
            label="Font"
            input="InputFont"
            placeholder="Select font for logo"
            class="mb-4"
            :no-preview="true"
            @update:model-value="updateCurrentSelection({ typography: { ...currentSelection.typography, font: $event }, format: 'typography' })"
          />
        </div>
      </div>

      <div class="p-4 border-t border-theme-300/50 dark:border-theme-700/70 flex justify-between">
        <XButton theme="default" rounding="full" icon="i-tabler-x" @click="$emit('update:vis', false)">
          Cancel
        </XButton>
        <XButton theme="primary" rounding="full" icon="i-tabler-check" @click="applyChanges">
          Apply Changes
        </XButton>
      </div>
    </div>
  </ElModal>
</template>
