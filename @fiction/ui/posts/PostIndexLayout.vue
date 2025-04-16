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
    sidebar?: 'left' | 'right' | 'none'
  }
}>()

// Simple configuration with sensible defaults
const config = vue.computed(() => ({
  layout: props.config?.layout || 'blog',
  featuredCount: props.config?.featuredCount ?? 1,
  sidebar: props.config?.sidebar || 'right',
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
    return 'grid grid-cols-1 @[500px]/post-list:grid-cols-2 @[1000px]/post-list:grid-cols-3 gap-8'
  }
  return ' divide-y divide-theme-700/50'
})

const imagePosition = vue.computed(() => {
  if (config.value.layout === 'magazine') {
    return 'top'
  }
  return 'left'
})
</script>

<template>
  <div class="post-layout  space-y-10" :class="config.sidebar === 'none' && config.layout === 'blog' ? 'max-w-3xl mx-auto' : ''">
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
    <div class="post-content-area flex flex-col lg:flex-row gap-12 " :class="config.sidebar === 'left' ? 'lg:flex-row-reverse' : ''">
      <!-- Main Posts Grid -->
      <div class="w-full space-y-8 @container/post-list" :class="config.sidebar !== 'none' ? 'lg:w-2/3' : 'lg:w-full'">
        <!-- Post Tabs -->
        <div class="flex gap-4 items-center">
          <XButton
            theme="default"
            design="link"
            size="sm"
            class="opacity-70"
          >
            Latest
          </XButton>
          <XButton
            theme="default"
            design="link"
            size="sm"
            class="opacity-40"
          >
            Popular
          </XButton>

          <div class="h-px bg-theme-700/50 basis-0 grow" />
        </div>

        <div v-if="regularPosts.length > 0" class="grid" :class="gridClasses">
          <PostItem
            v-for="post in regularPosts"
            :key="`post-${post.postId}`"
            :post="post"
            :config="{ imagePosition }"
            :class="[
              config.layout === 'blog' ? 'py-8' : '',
            ]"
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
      <aside v-if="config.sidebar !== 'none'" class="w-full lg:w-1/3 pt-8 lg:pt-0">
        <slot name="sidebar" />
      </aside>
    </div>
  </div>
</template>
