<script lang="ts" setup>
import type { Post } from '@fiction/posts'
import { vue } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import PostHero from './PostHero.vue'
import PostItem from './PostItem.vue'

defineOptions({ name: 'PostLayout' })

const props = defineProps<{
  posts: Post[]
  loading?: boolean
  title?: string
  about?: {
    title: string
    content: string
  }
  config?: {
    layout?: 'magazine' | 'blog'
    featuredCount?: number
    showSidebar?: boolean
  }
}>()

// Simple configuration with sensible defaults
const config = vue.computed(() => ({
  layout: props.config?.layout || 'blog',
  featuredCount: props.config?.featuredCount ?? 1,
  showSidebar: props.config?.showSidebar !== false,
}))

// Separate featured posts from regular content
const featuredPosts = vue.computed(() => {
  if (config.value.featuredCount <= 0 || !props.posts.length)
    return []

  // First try to find posts marked as featured
  const explicitFeatured = props.posts.filter(post => post.isFeatured?.value)

  if (explicitFeatured.length > 0) {
    return explicitFeatured.slice(0, config.value.featuredCount)
  }

  // Otherwise, use the most recent posts as featured
  return props.posts.slice(0, config.value.featuredCount)
})

const regularPosts = vue.computed(() => {
  const featuredIds = new Set(featuredPosts.value.map(post => post.postId))
  return props.posts.filter(post => !featuredIds.has(post.postId))
})

// Determine grid columns based on layout
const gridClasses = vue.computed(() => {
  if (config.value.layout === 'magazine') {
    return 'grid-cols-1 @[500px]/post-list:grid-cols-2 @[1000px]/post-list:grid-cols-3 gap-8'
  }
  return 'grid-cols-1 gap-12'
})

const imagePosition = vue.computed(() => {
  if (config.value.layout === 'magazine') {
    return 'top'
  }
  return 'left'
})

// Determine if we need to center the content
const contentClasses = vue.computed(() => {
  // For magazine without sidebar, use full width with no max-width constraint
  if (config.value.layout === 'magazine' && !config.value.showSidebar) {
    return 'lg:w-full'
  }
  // For blog layout without sidebar, center with max-width constraint
  else if (!config.value.showSidebar) {
    return 'lg:w-full max-w-3xl mx-auto'
  }
  // With sidebar
  return 'lg:w-2/3'
})
</script>

<template>
  <div class="post-layout max-w-screen-xl mx-auto space-y-10">
    <!-- Featured Posts Section -->
    <div v-if="featuredPosts.length > 0" class="featured-posts space-y-12">
      <PostHero
        v-for="post in featuredPosts"
        :key="`featured-${post.postId}`"
        :post="post"
        layout="cover"
        :config="{
          showExcerpt: true,
          showAuthors: true,
          showDate: true,
          showReadTime: true,
        }"
      />
    </div>

    <!-- Main Content Area with Optional Sidebar -->
    <div class="post-content-area flex flex-col lg:flex-row gap-12 ">
      <!-- Main Posts Grid -->
      <div class="w-full space-y-8 @container/post-list" :class="contentClasses">
        <!-- Post Tabs -->
        <div class="flex gap-8 border-b border-theme-700/80">
          <button
            class="py-3 px-2 border-b-2 font-medium "
            :class="true ? 'border-primary-500 text-theme-900 dark:text-theme-50' : 'border-theme-500 dark:text-theme-400 hover:text-theme-700 dark:hover:text-theme-200'"
          >
            Latest
          </button>
          <button
            class="py-3 px-2 text-theme-500  border-b-2  transition-colors"
            :class="false ? 'border-primary-500 text-theme-900 dark:text-theme-50' : 'border-theme-600/60 dark:text-theme-400 hover:text-theme-700 dark:hover:text-theme-200'"
          >
            Popular
          </button>
        </div>

        <div v-if="regularPosts.length > 0" class="grid" :class="gridClasses">
          <PostItem
            v-for="post in regularPosts"
            :key="`post-${post.postId}`"
            :post="post"
            :config="{ imagePosition }"
          />
        </div>
        <div v-else-if="!loading && featuredPosts.length === 0" class="text-center py-12">
          <p class="text-theme-500 dark:text-theme-400 text-lg">
            No posts available
          </p>
        </div>
        <div v-else-if="loading" class="animate-pulse space-y-8 py-8">
          <div v-for="i in 3" :key="i" class="h-48 bg-theme-200 dark:bg-theme-700 rounded-lg" />
        </div>
      </div>

      <!-- Sidebar - Using slots for widgets -->
      <aside v-if="config.showSidebar" class="w-full lg:w-1/3 pt-8 lg:pt-0">
        <slot name="sidebar" />
      </aside>
    </div>
  </div>
</template>
