<script lang="ts" setup>
import type { StandardSize } from '@fiction/core'
import type { Site } from '@fiction/site'
import { toLabel, vue } from '@fiction/core'
import { siteGoto } from '@fiction/site/utils/manage'
import XButton from '@fiction/ui/buttons/XButton.vue'
import XDropDown from '../common/XDropDown.vue'
import InputSelectCustom from './InputSelectCustom.vue'
import InputUrl from './InputUrl.vue'

type RouteMode = 'url' | 'page' | 'media'

const props = defineProps<{
  modelValue?: string
  placeholder?: string
  uiSize?: StandardSize
  site?: Site
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'navigate', path: string): void
}>()

const mode = vue.ref<RouteMode>('url')
const urlValue = vue.ref(props.modelValue || '')
const mediaValue = vue.ref('')

// Format URL for display
const displayUrl = vue.computed(() => {
  const url = urlValue.value
  if (!url)
    return ''

  // If URL has a _modal parameter, replace just the URL value within it
  const mediaModalMatch = url.match(/(\?_modal=)([^&]+)/)
  if (mediaModalMatch) {
    const [fullMatch, modalPrefix] = mediaModalMatch
    return url.replace(fullMatch, `${modalPrefix}(URL)`)
  }

  // For non-modal URLs, remove common prefixes and trailing slashes
  return url.replace(/(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '')
})

const afterIcon = vue.computed(() => {
  const isExternal = urlValue.value && urlValue.value.includes('http') && displayUrl.value
  const isPopup = urlValue.value && urlValue.value.includes('?_modal=')

  if (isExternal)
    return 'i-tabler-external-link'
  if (isPopup)
    return 'i-tabler-window'
  return undefined
})

// Sync URL value with model
vue.watch(() => props.modelValue, (val) => {
  urlValue.value = val || ''
})

// Available pages in site
const pages = vue.computed(() => {
  if (!props.site)
    return []

  const pagelist = props.site.pages.value
    .filter(p => !p.isSystem.value)
    .map(p => ({
      label: p.title.value || toLabel(p.slug.value),
      value: `/${p.slug.value === '_home' ? '' : p.slug.value}`,
    }))

  return [
    ...pagelist,
    { label: '+ Create New Page', value: '_new' },
  ]
})

// Basic media URL validation
function isValidMediaUrl(url: string): boolean {
  const mediaPatterns = [
    /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+/i,
    /^https?:\/\/(www\.|player\.)?vimeo\.com\/.+/i,
    /^https?:\/\/.+\.(mp4|webm|ogg)$/i,
  ]
  return mediaPatterns.some(pattern => pattern.test(url))
}

// Handle media URL submission
function handleMediaAdd() {
  if (!mediaValue.value || !isValidMediaUrl(mediaValue.value))
    return

  const baseUrl = urlValue.value && !urlValue.value.includes('http') ? urlValue.value : ''
  const joiner = baseUrl.includes('?') ? '&' : '?'
  const newValue = `${baseUrl}${joiner}_modal=${encodeURIComponent(mediaValue.value)}`

  urlValue.value = newValue
  emit('update:modelValue', newValue)
  mediaValue.value = ''
  mode.value = 'url'
}

// Handle URL/path changes
function handleUrlChange(val: string) {
  urlValue.value = val
  emit('update:modelValue', val)
}

// Handle page selection
function handlePageSelect(path?: string) {
  if (!path)
    return

  if (path === '_new') {
    props.site?.editorActivateTool({ toolId: 'addPage' })
    return
  }

  urlValue.value = path
  emit('update:modelValue', path)
  mode.value = 'url'
}

// Mode toggle buttons
const modes = [
  { label: 'Path / URL', value: 'url' as const },
  { label: 'Select Page', value: 'page' as const },
  { label: 'Media Modal', value: 'media' as const },
]

async function navigateToLink(url: string) {
  await siteGoto({ site: props.site, location: url, options: { caller: 'InputSiteRoute' } })
}
</script>

<template>
  <div class="space-y-3">
    <!-- URL Preview -->
    <div class="flex justify-between items-center gap-3">
      <XButton
        class="min-w-0"
        size="sm"
        theme="default"
        rounding="full"
        design="ghost"
        icon="i-tabler-link"
        :icon-after="afterIcon"
        :title="urlValue"
        @click.prevent.stop="navigateToLink(urlValue)"
      >
        {{ displayUrl }}
      </XButton>
      <XDropDown
        :items="modes"
        dropdown-alignment="end"
        mode="click"
        :classes="{ wrapper: 'shrink-0' }"
        @update:model-value="mode = ($event as RouteMode)"
      >
        <XButton
          size="sm"
          theme="default"
          rounding="full"
          design="outline"
          icon-after="i-tabler-chevron-down"
          title="URL Input Mode"
          @click.prevent
        >
          {{ modes.find(m => m.value === mode)?.label }}
        </XButton>
      </XDropDown>
    </div>

    <!-- Mode toggles -->
    <div class="flex gap-1.5">
      <template v-if="mode === 'page'">
        <InputSelectCustom
          class="flex-1"
          :model-value="urlValue"
          :list="pages"
          placeholder="Select a page..."
          :ui-size="props.uiSize"
          @update:model-value="handlePageSelect($event as string)"
        />
      </template>

      <div v-else-if="mode === 'media'" class="flex gap-2">
        <InputUrl
          v-model="mediaValue"
          placeholder="https://www.youtube.com/watch?v=[id]"
          class="flex-1"
          :ui-size="props.uiSize"
        />
        <XButton
          size="sm"
          theme="primary"
          rounding="md"
          icon="i-tabler-plus"
          @click="handleMediaAdd"
        >
          Add
        </XButton>
      </div>
      <template v-else>
        <InputUrl
          v-model="urlValue"
          :placeholder="placeholder || '/example'"
          class="flex-1"
          :ui-size="props.uiSize"
          @update:model-value="handleUrlChange"
        />
      </template>
    </div>

    <!-- Input based on mode -->
  </div>
</template>
