<script lang="ts" setup>
import type { StandardSize } from '@fiction/core'
import type { Site } from '@fiction/site'
import { toLabel, vue } from '@fiction/core'
import { SITE_INJECTION_KEY } from '@fiction/site'
import { siteGoto } from '@fiction/site/utils/manage'
import XButton from '../buttons/XButton.vue'
import InputSelectCustom from './InputSelectCustom.vue'
import InputUrl from './InputUrl.vue'

defineOptions({ name: 'InputSiteRoute' })

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

const injectedSite = vue.inject(SITE_INJECTION_KEY, vue.computed(() => undefined))
const site = props.site || injectedSite.value

type RouteMode = 'url' | 'page' | 'media'

const isEditing = vue.ref(false)
const mode = vue.ref<RouteMode>('page')
const urlValue = vue.ref(props.modelValue || '')
const mediaValue = vue.ref('')

// Format URL for display
const displayUrl = vue.computed(() => {
  const url = urlValue.value.trim()
  if (!url)
    return ''
  if (url === '/')
    return '/'

  // If URL has a _modal parameter, extract just the modal URL
  const mediaModalMatch = url.match(/(\?_modal=)([^&]+)/)
  if (mediaModalMatch) {
    return `Media popup: ${decodeURIComponent(mediaModalMatch[2])}`
  }

  // For non-modal URLs, remove common prefixes and trailing slashes
  return url.replace(/(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '')
})

const isExternalLink = vue.computed(() => {
  return urlValue.value && urlValue.value.includes('http')
})

const isPopupLink = vue.computed(() => {
  return urlValue.value && urlValue.value.includes('?_modal=')
})

// Sync URL value with model
vue.watch(() => props.modelValue, (val) => {
  urlValue.value = val || ''
})

vue.watch(() => mode.value, () => {
  isEditing.value = true
})

// Available pages in site
const pages = vue.computed(() => {
  if (!site)
    return []

  const pagelist = site.pages.value
    .filter(p => !p.isSystem.value)
    .map(p => ({
      label: p.title.value || toLabel(p.slug.value),
      value: `/${p.isHome.value ? '' : p.slug.value}`,
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
    site?.editorActivateTool({ toolId: 'pageAdd' })
    return
  }

  urlValue.value = path
  emit('update:modelValue', path)
}

// Toggle editing mode
function toggleEditing() {
  mode.value = 'page'
  isEditing.value = !isEditing.value
}

async function navigateToLink() {
  if (!urlValue.value)
    return

  emit('navigate', urlValue.value)
  await siteGoto({ site, location: urlValue.value, options: { caller: 'InputSiteRoute' } })
}

// Available modes
const modes = [
  { label: 'Page', value: 'page' as const },
  { label: 'URL', value: 'url' as const },

  { label: 'Media', value: 'media' as const },
]

function setMode(newMode: RouteMode) {
  mode.value = newMode
}
</script>

<template>
  <div class="space-y-2 w-full" :data-site-id="site?.siteId || 'not-set'">
    <!-- URL Preview (when not editing) -->
    <div v-if="!isEditing && urlValue" class="flex items-center gap-2">
      <XButton
        size="sm"
        icon-after="i-tabler-pencil"
        rounding="md"
        design="ghost"
        @click="toggleEditing"
      >
        {{ displayUrl }}
      </XButton>

      <XButton
        v-if="urlValue"
        size="sm"
        rounding="md"
        aria-label="Visit this link"
        design="link"
        icon="i-tabler-link"
        class="cursor-pointer"
        @click="navigateToLink"
      />
    </div>

    <XButton v-else-if="!isEditing" size="xs" @click="toggleEditing">
      Click to add a link
    </XButton>

    <!-- Editing interface -->
    <div v-if="isEditing" class="space-y-3">
      <!-- Mode selector -->
      <div class="flex gap-1">
        <span
          v-for="item in modes"
          :key="item.value"
          class="px-3 py-1 cursor-pointer text-xs rounded-md font-mono select-none"
          :class="[
            mode === item.value
              ? 'bg-primary-100 dark:bg-primary-900 border-primary-300 dark:border-primary-600 text-primary-900 dark:text-primary-100'
              : 'border-theme-200 dark:border-theme-700 text-theme-600 dark:text-theme-400 hover:bg-theme-50 dark:hover:bg-theme-700 dark:hover:text-theme-100',
          ]"
          @click="setMode(item.value)"
        >
          {{ item.label }}
        </span>
      </div>

      <!-- Input based on selected mode -->
      <div>
        <!-- URL input -->
        <InputUrl
          v-if="mode === 'url'"
          v-model="urlValue"
          :placeholder="placeholder || 'Enter a URL or path...'"
          class="w-full"
          :ui-size="props.uiSize"
          @update:model-value="handleUrlChange"
        />

        <!-- Page selector -->
        <InputSelectCustom
          v-else-if="mode === 'page'"
          class="w-full"
          :model-value="urlValue"
          :list="pages"
          placeholder="Select a page..."
          :ui-size="props.uiSize"
          @update:model-value="handlePageSelect($event as string)"
        />

        <!-- Media popup input -->
        <div v-else-if="mode === 'media'" class="flex gap-2">
          <InputUrl
            v-model="mediaValue"
            placeholder="Enter media URL (YouTube, Vimeo, etc.)"
            class="flex-1"
            :ui-size="props.uiSize"
          />
          <XButton
            theme="primary"
            size="sm"
            rounding="md"
            icon="i-tabler-plus"
            @click="handleMediaAdd"
          >
            Set URL
          </XButton>
        </div>
      </div>

      <!-- Action buttons -->
      <div class="flex justify-end">
        <XButton
          size="sm"
          theme="primary"
          design="outline"
          icon="i-tabler-check"
          @click="toggleEditing"
        >
          Done Editing
        </XButton>
      </div>
    </div>
  </div>
</template>
