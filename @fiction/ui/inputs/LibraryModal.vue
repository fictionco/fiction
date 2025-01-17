<script lang="ts" setup>
import type { MediaObject } from '@fiction/core'
import { determineMediaFormat, vue } from '@fiction/core'
import XButton from '../buttons/XButton.vue'
import ElModal from '../ElModal.vue'
import XLogo from '../media/XLogo.vue'
import XMedia from '../media/XMedia.vue'
import ElInput from './ElInput.vue'
import LibraryBackground from './LibraryBackground.vue'
import LibraryHtml from './LibraryHtml.vue'
import LibraryIcon from './LibraryIcon.vue'
import LibraryMedia from './LibraryMedia.vue'

const props = defineProps<{
  modelValue: MediaObject
  vis?: boolean
  tools?: LibraryTool[]
  title?: string
  defaultTool?: LibraryTool
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', payload: MediaObject): void
  (event: 'update:vis', payload: boolean): void
}>()

const availableTools = [
  { label: 'Select Media', value: 'media', icon: 'i-tabler-photo', component: LibraryMedia },
  { label: 'Custom HTML', value: 'html', icon: 'i-tabler-code', component: LibraryHtml },
  { label: 'Icon Library', value: 'icons', icon: 'i-tabler-category', component: LibraryIcon },
  { label: 'Background', value: 'background', icon: 'i-tabler-palette', component: LibraryBackground },
] as const

type LibraryTool = typeof availableTools[number]['value']

const currentSelection = vue.ref<MediaObject>({ })

vue.watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    selectMedia(newValue)
  }
}, { immediate: true })

function getDefaultTool() {
  const format = currentSelection.value.format
  const v: LibraryTool = format === 'html'
    ? 'html'
    : format === 'iconId'
      ? 'icons'
      : props.defaultTool || 'media'

  return availableTools.find(item => item.value === v) || availableTools[0]
}

function selectMedia(media: MediaObject) {
  const format = determineMediaFormat(media)
  currentSelection.value = { ...currentSelection.value, format, ...media }
}

const enabledTools = vue.computed(() =>
  availableTools.filter(tool => !props.tools || props.tools.includes(tool.value)),
)

const activeToolId = vue.ref<LibraryTool>(getDefaultTool().value)
const activeTool = vue.computed(() => availableTools.find(t => t.value === activeToolId.value))

function applyChanges() {
  emit('update:modelValue', currentSelection.value)
  emit('update:vis', false)
}

function clearMedia() {
  currentSelection.value = { }
}

function hasMedia() {
  return currentSelection.value.url || currentSelection.value.html || currentSelection.value.iconId
}
</script>

<template>
  <ElModal
    :vis="vis"
    class="max-w-4xl"
    modal-class="max-w-screen-md"
    :has-close="false"
    @update:vis="emit('update:vis', $event)"
  >
    <div data-test-id="media-modal" class="bg-white text-theme-900 dark:bg-theme-900 dark:text-theme-100 rounded-lg overflow-hidden">
      <!-- Header -->
      <div class="p-4 border-b border-theme-200 dark:border-theme-700">
        <div class="flex items-center justify-between">
          <h2 class="font-medium">
            {{ title || 'Media Manager' }}
          </h2>
          <div class="flex gap-4">
            <XButton
              v-if="currentSelection.format"
              theme="default"
              design="link"
              size="sm"
              icon="i-tabler-info-circle"
            >
              <span class="text-theme-400">Format:</span> <span class="uppercase">{{ currentSelection.format }}</span>
            </XButton>
            <XButton
              :disabled="!hasMedia()"
              theme="default"
              size="sm"
              icon="i-tabler-trash"
              @click="clearMedia"
            >
              Clear Media
            </XButton>
          </div>
        </div>
      </div>

      <!-- Main Content Area -->
      <div class="flex min-h-[500px]">
        <!-- Left Sidebar - Source Selection -->
        <div class="w-48 border-r border-theme-200 dark:border-theme-700 flex-shrink-0 bg-theme-50 dark:bg-theme-800">
          <nav class="p-3">
            <button
              v-for="tool in enabledTools"
              :key="tool.value"
              :data-test-id="`media-tool-${tool.value}`"
              class="w-full px-4 py-2 rounded-lg text-left mb-1 flex items-center gap-2 transition-colors text-sm font-medium"
              :class="[
                activeToolId === tool.value
                  ? 'bg-primary-600 dark:bg-primary-900/50 text-white'
                  : 'hover:bg-theme-100 dark:hover:bg-theme-700 text-theme-700 dark:text-theme-200',
              ]"
              @click.prevent="activeToolId = tool.value"
            >
              <i class="text-lg" :class="[tool.icon]" />
              <span>{{ tool.label }}</span>
            </button>
          </nav>
        </div>

        <!-- Content Area -->
        <div class="flex-1 flex flex-col">
          <!-- Preview Area -->
          <div class="p-4 border-b border-theme-200 dark:border-theme-700 h-64">
            <div class="relative h-full">
              <div class="w-full h-full flex items-center justify-center" :data-m="JSON.stringify(currentSelection)">
                <template v-if="currentSelection.format || currentSelection.gradient?.stops?.length || currentSelection.backgroundColor">
                  <XLogo
                    v-if="['iconId', 'iconClass', 'typography'].includes(currentSelection.format || '')"
                    :media="currentSelection"
                    class="max-h-full"
                  />
                  <XMedia
                    v-else
                    :media="currentSelection"
                    class="max-h-full object-contain w-full h-full"
                    image-mode="contain"
                  />
                </template>
                <div
                  v-else
                  class="text-center border-2 border-dashed border-theme-200 dark:border-theme-700 rounded-lg p-8 w-full h-full flex items-center justify-center"
                >
                  <div>
                    <i class="i-tabler-photo-plus text-4xl text-theme-400 dark:text-theme-600 mb-2" />
                    <p class="text-theme-500 dark:text-theme-400">
                      No media selected
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tool Content Area -->
          <div class="flex-1 p-4 bg-theme-50/50 dark:bg-theme-800/50 max-h-[350px] overflow-scroll">
            <!-- Dynamic Tool Component -->
            <component
              :is="activeTool?.component"
              v-if="activeTool?.component"
              v-model="currentSelection"
              class="w-full"
              @update:model-value="selectMedia"
            />

            <!-- HTML Input -->
            <div v-else-if="activeToolId === 'html'" class="space-y-4">
              <ElInput
                :model-value="currentSelection.html"
                input="InputTextarea"
                :rows="6"
                placeholder="Enter HTML or embed code here"
                @update:model-value="value => currentSelection = {
                  ...currentSelection,
                  html: value,
                  format: 'html',
                }"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-4 border-t border-theme-200 dark:border-theme-700 flex justify-between bg-theme-50 dark:bg-theme-800">
        <XButton
          theme="default"
          size="md"
          icon="i-tabler-x"
          data-test-id="media-cancel"
          @click="emit('update:vis', false)"
        >
          Cancel
        </XButton>
        <XButton
          theme="primary"
          size="md"
          icon="i-tabler-check"
          data-test-id="media-apply"
          @click="applyChanges"
        >
          Apply Changes
        </XButton>
      </div>
    </div>
  </ElModal>
</template>
