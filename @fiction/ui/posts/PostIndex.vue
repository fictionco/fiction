<script lang="ts" setup>
import type { IndexMeta } from '@fiction/core'
import type { Post } from '@fiction/posts'
import { vue } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import El404 from '@fiction/ui/page/El404.vue'
import PostHero from './PostHero.vue'
import PostItem from './PostItem.vue'

export interface BlogConfig {
  columns?: 1 | 2 | 3 | 4
  showExcerpt?: boolean
  showAuthors?: boolean
  showDate?: boolean
  showReadTime?: boolean
  showCategories?: boolean
  showTags?: boolean
  imagePosition?: 'top' | 'right' | 'left' | 'cover' | 'none'
  /** Base URL path for posts, defaults to "p" */
  basePath?: string
  /** Display mode for posts */
  displayMode?: 'standard' | 'hero' | 'mixed'
  /** Number of hero posts to show at the top (when in mixed mode) */
  heroCount?: number
}

const props = defineProps<{
  posts: Post[]
  loading?: boolean
  indexMeta?: IndexMeta
  config?: Partial<BlogConfig>
  emptyTitle?: string
  emptySubTitle?: string
}>()

const emit = defineEmits<{
  (e: 'update:indexMeta', value: IndexMeta): void
  (e: 'loadMore'): void
}>()

// Merge default config with provided config
const defaultConfig: BlogConfig = {
  columns: 1,
  showExcerpt: true,
  showAuthors: true,
  showDate: true,
  showReadTime: false,
  imagePosition: 'top',
  basePath: 'p',
  displayMode: 'standard',
  heroCount: 1,
}

const config = vue.computed<BlogConfig>(() => ({
  ...defaultConfig,
  ...(props.config || {}),
}))

// Get current page information
const indexMeta = vue.computed(() => ({
  limit: 12,
  offset: 0,
  count: 0,
  ...props.indexMeta,
}))

// Calculate if there are more posts to load
const hasMorePosts = vue.computed(() => {
  const { offset = 0, limit = 12, count = 0 } = indexMeta.value
  return offset + limit < count
})

// Separate hero posts from standard posts based on the display mode
const heroPosts = vue.computed(() => {
  if (config.value.displayMode === 'standard' || props.posts.length === 0) {
    return []
  }

  if (config.value.displayMode === 'hero') {
    return props.posts
  }

  // For mixed mode, take the first N posts as hero posts
  const heroCount = Math.min(config.value.heroCount || 1, props.posts.length)
  return props.posts.slice(0, heroCount)
})

const standardPosts = vue.computed(() => {
  if (config.value.displayMode === 'hero' || props.posts.length === 0) {
    return []
  }

  if (config.value.displayMode === 'standard') {
    return props.posts
  }

  // For mixed mode, take the remaining posts after hero posts
  const heroCount = Math.min(config.value.heroCount || 1, props.posts.length)
  return props.posts.slice(heroCount)
})

// Handle "Load More" action
function loadMore() {
  if (hasMorePosts.value) {
    const newMeta = {
      ...indexMeta.value,
      offset: (indexMeta.value.offset || 0) + (indexMeta.value.limit || 12),
    }
    emit('update:indexMeta', newMeta)
    emit('loadMore')
  }
}

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
    2: 'gap-8 lg:gap-10',
    3: 'gap-6 lg:gap-8',
    4: 'gap-6',
  }

  return `grid ${gapClasses[columns]} ${columnClasses[columns]}`
})

// Calculate pagination information for screen readers and SEO
const paginationInfo = vue.computed(() => {
  const { offset = 0, limit = 12, count = 0 } = indexMeta.value
  const currentPage = Math.floor(offset / limit) + 1
  const totalPages = Math.ceil(count / limit)

  return {
    currentPage,
    totalPages,
    from: offset + 1,
    to: Math.min(offset + limit, count),
    total: count,
  }
})
</script>

<template>
  <section class="w-full blog-index">
    <!-- SEO metadata -->
    <div class="sr-only" aria-hidden="true">
      <span>Blog posts</span>
      <span v-if="indexMeta?.count">
        Showing {{ paginationInfo.from }}-{{ paginationInfo.to }} of {{ paginationInfo.total }} posts
      </span>
      <span v-if="config.basePath">
        Post URL format: /{{ config.basePath }}/[slug]
      </span>
    </div>

    <!-- Hero Posts Section -->
    <div v-if="heroPosts.length > 0" class="hero-posts-section mb-16 lg:mb-24">
      <PostHero
        v-for="(post, index) in heroPosts"
        :key="`hero-${post.postId || index}`"
        :post="post"
        :orientation="index % 2 === 0 ? 'left' : 'right'"
        :config="config"
      />
    </div>

    <!-- Regular Posts Grid or List Layout -->
    <div v-if="standardPosts.length > 0" :class="gridClasses" itemscope itemtype="https://schema.org/Blog">
      <PostItem
        v-for="(post, index) in standardPosts"
        :key="`standard-${post.postId || index}`"
        :post="post"
        :config="config"
      />
    </div>

    <!-- No Posts at All (After Hero and Standard) -->
    <div v-if="!loading && heroPosts.length === 0 && standardPosts.length === 0">
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

    <!-- Pagination / Load More -->
    <div
      v-if="!loading && (heroPosts.length > 0 || standardPosts.length > 0) && hasMorePosts"
      class="mt-12 flex justify-center"
      role="navigation"
      aria-label="Pagination"
    >
      <XButton
        theme="primary"
        design="outline"
        size="lg"
        :aria-label="`Load more posts (page ${paginationInfo.currentPage + 1} of ${paginationInfo.totalPages})`"
        @click="loadMore"
      >
        Load More Posts
      </XButton>
    </div>

    <!-- Hidden pagination metadata for SEO -->
    <div v-if="indexMeta?.count" class="hidden" aria-hidden="true">
      <link rel="canonical" href="current-url">
      <meta v-if="paginationInfo.currentPage > 1" name="robots" content="noindex,follow">
      <span itemprop="numberOfItems">{{ indexMeta.count }}</span>
    </div>
  </section>
</template>
