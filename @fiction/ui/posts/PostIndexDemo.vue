<script lang="ts" setup>
import type { IndexMeta } from '@fiction/core'
import type { TablePostConfig } from '@fiction/posts'
import type { Card } from '@fiction/site'
import type { BlogConfig } from './PostIndex.vue'
import { vue } from '@fiction/core'
import { Post } from '@fiction/posts'
import XButton from '@fiction/ui/buttons/XButton.vue'
import InputRadioButton from '@fiction/ui/inputs/InputRadioButton.vue'
import { getDemoPosts } from './index.js'
import PostIndex from './PostIndex.vue'

defineOptions({ name: 'PostIndexDemo' })

const { card } = defineProps<{ card?: Card }>()

// Demo configuration presets
const presets: { name: string, config: BlogConfig }[] = [
  {
    name: 'Standard Grid',
    config: {
      columns: 3,
      showExcerpt: true,
      showAuthors: true,
      showDate: true,
      imagePosition: 'top',
      basePath: 'blog',
      displayMode: 'standard',
    },
  },
  {
    name: 'Hero Only',
    config: {
      showExcerpt: true,
      showAuthors: true,
      showDate: true,
      showReadTime: true,
      basePath: 'blog',
      displayMode: 'hero',
    },
  },
  {
    name: 'Mixed (Hero + Grid)',
    config: {
      columns: 3,
      showExcerpt: true,
      showAuthors: true,
      showDate: true,
      imagePosition: 'top',
      basePath: 'blog',
      displayMode: 'mixed',
      heroCount: 2,
    },
  },
  {
    name: 'List Layout',
    config: {
      showExcerpt: true,
      showAuthors: true,
      showDate: true,
      showReadTime: true,
      imagePosition: 'left',
      basePath: 'articles',
      displayMode: 'standard',
    },
  },
  {
    name: 'Magazine Style',
    config: {
      columns: 2,
      showExcerpt: true,
      showAuthors: true,
      showDate: true,
      imagePosition: 'cover',
      basePath: 'magazine',
      displayMode: 'standard',
    },
  },
]

// Additional base path presets
const basePathPresets = ['p', 'blog', 'articles', 'news', 'post', 'magazine']

// Display mode options
const displayModes = [
  { value: 'standard', label: 'Standard' },
  { value: 'hero', label: 'Hero Only' },
  { value: 'mixed', label: 'Mixed' },
]

// Current configuration and index meta
const activePreset = vue.ref(0)
const currentConfig = vue.computed(() => presets[activePreset.value].config)
const currentIndexMeta = vue.ref<IndexMeta>({
  limit: 12,
  offset: 0,
  count: 999,
})

// Hero count (for mixed mode)
const heroCount = vue.ref(currentConfig.value.heroCount || 1)

// Selected display mode
const selectedDisplayMode = vue.computed({
  get: () => currentConfig.value.displayMode || 'standard',
  set: (value) => {
    const config = { ...currentConfig.value, displayMode: value as 'standard' | 'hero' | 'mixed' }
    presets[activePreset.value].config = config
  },
})

// Update index meta handler
function updateIndexMeta(newMeta: IndexMeta) {
  currentIndexMeta.value = newMeta
}

// Update hero count (for mixed mode)
function updateHeroCount() {
  const count = Math.max(1, Math.min(5, heroCount.value))
  const config = { ...currentConfig.value, heroCount: count }
  presets[activePreset.value].config = config
}

const posts = vue.shallowRef<Post[]>([])
const loading = vue.ref(true)

vue.onMounted(async () => {
  posts.value = (await getDemoPosts()).map((p: TablePostConfig) => {
    return new Post({ ...p, card })
  })
  loading.value = false
})
</script>

<template>
  <div class="space-y-8 max-w-screen-2xl mx-auto px-4">
    <!-- Controls -->
    <div class="bg-theme-100 dark:bg-theme-800 rounded-lg p-4 space-y-4">
      <h3 class="text-lg font-medium mb-3">
        Blog Layout Options
      </h3>

      <div class="flex flex-wrap gap-2 mb-4">
        <XButton
          v-for="(preset, index) in presets"
          :key="preset.name"
          :theme="activePreset === index ? 'primary' : 'theme'"
          size="sm"
          @click="activePreset = index"
        >
          {{ preset.name }}
        </XButton>
      </div>

      <!-- Display Mode selector -->
      <div class="mb-4">
        <h4 class="text-sm font-medium mb-2">
          Display Mode
        </h4>
        <div class="flex flex-wrap gap-4">
          <InputRadioButton
            v-model="selectedDisplayMode"
            :list="displayModes"
            ui-size="sm"
          />
        </div>
      </div>

      <!-- Hero Count (visible only in mixed mode) -->
      <div v-if="selectedDisplayMode === 'mixed'" class="mb-4">
        <h4 class="text-sm font-medium mb-2">
          Hero Posts Count
        </h4>
        <div class="flex items-center gap-2">
          <input
            v-model.number="heroCount"
            type="number"
            min="1"
            max="5"
            class="px-3 py-1 rounded border border-theme-300 dark:border-theme-600 bg-white dark:bg-theme-700 text-sm w-20"
          >
          <XButton
            size="xs"
            theme="primary"
            @click="updateHeroCount"
          >
            Apply
          </XButton>
        </div>
      </div>

      <!-- Configuration details -->
      <div
        class="text-[10px] font-mono text-theme-500 dark:text-theme-400 bg-white dark:bg-theme-700 p-2 rounded mt-4 overflow-hidden"
        style="max-height: 200px; overflow-y: auto;"
      >
        <div>Active configuration:</div>
        <pre class="overflow-x-auto p-2">{{ JSON.stringify(currentConfig, null, 2) }}</pre>
      </div>
    </div>

    <!-- Blog index with current configuration -->
    <PostIndex
      :posts="posts"
      :loading="loading || false"
      :index-meta="currentIndexMeta"
      :config="currentConfig"
      @update:index-meta="updateIndexMeta"
    />
  </div>
</template>
