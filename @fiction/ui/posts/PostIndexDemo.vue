<script lang="ts" setup>
import type { IndexMeta } from '@fiction/core'
import type { TablePostConfig } from '@fiction/posts'
import type { Card } from '@fiction/site'
import type { BlogConfig } from './PostIndex.vue'
import { vue } from '@fiction/core'
import { Post } from '@fiction/posts'
import XButton from '@fiction/ui/buttons/XButton.vue'
import { getDemoPosts } from './index.js'
import BlogPostIndex from './PostIndex.vue'

defineOptions({ name: 'PostIndexDemo' })

const { card } = defineProps<{ card?: Card }>()

// Demo configuration presets
const presets: { name: string, config: BlogConfig }[] = [
  {
    name: 'Grid (Default)',
    config: {
      columns: 3,
      showExcerpt: true,
      showAuthors: true,
      showDate: true,
      imagePosition: 'top',
      basePath: 'blog',
    },
  },
  {
    name: 'List with Left Images',
    config: {
      showExcerpt: true,
      showAuthors: true,
      showDate: true,
      showReadTime: true,
      imagePosition: 'left',
      basePath: 'articles',
    },
  },
  {
    name: 'List with Right Images',
    config: {
      showExcerpt: true,
      showAuthors: true,
      showDate: true,
      imagePosition: 'right',
      basePath: 'news',
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
    },
  },
]

// Additional base path presets
const basePathPresets = ['p', 'blog', 'articles', 'news', 'post', 'magazine']

// Current configuration and index meta
const activePreset = vue.ref(0)
const currentConfig = vue.computed(() => presets[activePreset.value].config)
const currentIndexMeta = vue.ref<IndexMeta>({
  limit: 12,
  offset: 0,
  count: 999,
})

// Custom base path
const customBasePath = vue.ref('')

// Update index meta handler
function updateIndexMeta(newMeta: IndexMeta) {
  currentIndexMeta.value = newMeta
}

// Toggle theme
const darkMode = vue.ref(false)
function toggleDarkMode() {
  darkMode.value = !darkMode.value
}

// Update base path
function updateBasePath(path: string) {
  customBasePath.value = path
  const config = { ...currentConfig.value, basePath: path }
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
  <div class="space-y-8 max-w-screen-lg mx-auto px-4">
    <!-- Controls -->
    <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 space-y-4">
      <h3 class="text-lg font-medium">
        Blog Layout Options
      </h3>

      <div class="flex flex-wrap gap-2">
        <XButton
          v-for="(preset, index) in presets"
          :key="preset.name"
          :theme="activePreset === index ? 'primary' : 'theme'"
          size="sm"
          @click="activePreset = index"
        >
          {{ preset.name }}
        </XButton>

        <XButton
          theme="theme"
          size="sm"
          class="ml-auto"
          @click="toggleDarkMode"
        >
          {{ darkMode ? 'Light Mode' : 'Dark Mode' }}
        </XButton>
      </div>

      <!-- Base path options -->
      <div class="space-y-2">
        <h4 class="text-sm font-medium">
          Base Path Options
        </h4>
        <div class="flex flex-wrap gap-2">
          <XButton
            v-for="path in basePathPresets"
            :key="path"
            :theme="currentConfig.basePath === path ? 'primary' : 'theme'"
            size="xs"
            @click="updateBasePath(path)"
          >
            /{{ path }}/
          </XButton>

          <div class="flex items-center gap-2 mt-2 w-full">
            <input
              v-model="customBasePath"
              type="text"
              placeholder="Custom base path"
              class="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
            >
            <XButton
              size="xs"
              theme="primary"
              @click="updateBasePath(customBasePath)"
            >
              Apply
            </XButton>
          </div>
        </div>
      </div>

      <!-- Configuration details -->
      <div class="text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 p-2 rounded">
        <div>Active configuration:</div>
        <pre class="overflow-x-auto p-2">{{ JSON.stringify(currentConfig, null, 2) }}</pre>
      </div>
    </div>

    <!-- Blog index with current configuration -->
    <BlogPostIndex
      :posts
      :loading="loading || false"
      :index-meta="currentIndexMeta"
      :config="{
        ...currentConfig,
      }"
      @update:index-meta="updateIndexMeta"
    />
  </div>
</template>
