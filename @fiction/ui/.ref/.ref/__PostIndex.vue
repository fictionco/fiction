<script lang="ts" setup>
import type { IndexMeta } from '@fiction/core'
import type { Post } from '@fiction/posts'
import { vue } from '@fiction/core'
import El404 from '@fiction/ui/page/El404.vue'
import PostItem from './PostItem.vue'

defineOptions({ name: 'PostIndex' })

const props = defineProps<{
  posts: Post[]
  loading?: boolean
  indexMeta?: IndexMeta
  config?: Partial<PostIndexConfig>
  emptyTitle?: string
  emptySubTitle?: string
}>()

export interface PostIndexConfig {
  columns?: 1 | 2 | 3 | 4
  imagePosition?: 'top' | 'right' | 'left' | 'cover' | 'none'
}

// Merge default config with provided config
const defaultConfig: PostIndexConfig = {
  columns: 2,
  imagePosition: 'top',
}

const config = vue.computed<PostIndexConfig>(() => ({
  ...defaultConfig,
  ...(props.config || {}),
}))

// Calculate grid layout classes based on configuration
const gridClasses = vue.computed(() => {
  const { columns = 1 } = config.value

  // Map column counts to responsive grid classes
  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }

  // Create wider gaps for fewer columns (better readability)
  const gapClasses = {
    1: 'gap-10',
    2: 'gap-8 lg:gap-10 xl:gap-12',
    3: 'gap-6 lg:gap-8 xl:gap-10',
    4: 'gap-6',
  }

  return `grid ${gapClasses[columns]} ${columnClasses[columns]}`
})
</script>

<template>
  <section class="w-full blog-index">
    <!-- Regular Posts Grid or List Layout -->
    <div v-if="posts.length > 0" :class="gridClasses" itemscope itemtype="https://schema.org/Blog">
      <PostItem
        v-for="(post, index) in posts"
        :key="`standard-${post.postId || index}`"
        :post="post"
        :config="config"
      />
    </div>

    <!-- No Posts at All (After Hero and Standard) -->
    <div v-if="!loading && posts.length === 0">
      <El404
        :super-title="{ text: 'Blog' }"
        :title="emptyTitle || 'No Posts Available'"
        :sub-title="emptySubTitle || 'Check back later for new content'"
        :buttons="[{ label: 'Return to Homepage', href: '/', theme: 'primary' }]"
      />
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="py-12 space-y-8" aria-live="polite" aria-busy="true">
      <div
        v-for="i in 3"
        :key="i"
        class="animate-pulse flex flex-col"
        role="status"
      >
        <div class="bg-theme-200 dark:bg-theme-700 rounded-lg aspect-video w-full mb-4" />
        <div class="h-6 bg-theme-200 dark:bg-theme-700 rounded w-3/4 mb-3" />
        <div class="h-4 bg-theme-200 dark:bg-theme-700 rounded w-full mb-2" />
        <div class="h-4 bg-theme-200 dark:bg-theme-700 rounded w-5/6 mb-2" />
        <div class="h-4 bg-theme-200 dark:bg-theme-700 rounded w-2/3" />
        <span class="sr-only">Loading posts...</span>
      </div>
    </div>
  </section>
</template>
