<script lang="ts" setup>
import type { Post } from '@fiction/posts'
import { vue } from '@fiction/core'
import ElSpinner from '../loaders/ElSpinner.vue'
import PostFeature from './PostFeature.vue'
import PostItem from './PostItem.vue'

defineOptions({ name: 'PostLayout' })

const props = defineProps<{
  posts: Post[]
  loading?: boolean
  sortBy?: 'latest' | 'popular'
  title?: string
  about?: {
    title: string
    content: string
  }
  config?: {
    layout?: 'magazine' | 'blog'
    featuredCount?: number
    sidebar?: 'left' | 'right' | 'none'
    imagePosition?: 'top' | 'left' | 'right' | 'cover' | 'none'
  }
}>()

const emit = defineEmits<{
  (e: 'update:sortBy', value: 'latest' | 'popular'): void
}>()

// Simple configuration with sensible defaults
const config = vue.computed(() => ({
  layout: props.config?.layout || 'blog',
  featuredCount: props.config?.featuredCount ?? 1,
  sidebar: props.config?.sidebar || 'none',
  imagePosition: props.config?.imagePosition || (props.config?.layout === 'magazine' ? 'top' : 'right'),
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
  return 'divide-y divide-theme-700/50'
})

// Helper for tab styling
function getTabClasses(tabType: 'latest' | 'popular') {
  const isActive = props.sortBy === tabType
  return [
    'py-2 px-4 text-sm font-medium transition-colors duration-200',
    'border-b-2',
    isActive
      ? 'border-theme-0 text-theme-0'
      : 'border-transparent text-theme-500 hover:text-theme-700 dark:text-theme-400 dark:hover:text-theme-300',
  ].join(' ')
}
</script>

<template>
  <div
    class="post-layout"
    :class="config.sidebar === 'none' && config.layout === 'blog' ? 'max-w-2xl mx-auto' : ''"
  >
    <div v-if="loading" class="flex items-center justify-center p-12">
      <ElSpinner class="size-8 text-theme-600" />
    </div>
    <template v-else>
      <!-- Featured Posts Section -->
      <div v-if="featuredPosts.length > 0" class="featured-posts space-y-12 pb-10">
        <PostFeature
          v-for="post in featuredPosts"
          :key="`featured-${post.postId}`"
          :post="post"
        />
      </div>

      <!-- Main Content Area with Optional Sidebar -->
      <div
        class="post-content-area flex flex-col lg:flex-row "
        :class="[
          config.sidebar === 'left' ? 'lg:flex-row-reverse' : '',
        ]"
      >
        <!-- Main Posts Grid -->
        <div class="w-full @container/post-list grow" :class="config.sidebar !== 'none' ? 'lg:w-[61.8%]' : 'lg:w-full'">
          <!-- Post Tabs -->
          <div class="flex border-b border-theme-200 dark:border-theme-700">
            <button
              :class="getTabClasses('latest')"
              @click="emit('update:sortBy', 'latest')"
            >
              Latest
            </button>
            <button
              :class="getTabClasses('popular')"
              @click="emit('update:sortBy', 'popular')"
            >
              Popular
            </button>
          </div>

          <div v-if="regularPosts.length > 0" class="grid" :class="gridClasses">
            <PostItem
              v-for="post in regularPosts"
              :key="`post-${post.postId}`"
              :post="post"
              :config="{ imagePosition: config.imagePosition }"
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
        </div>

        <!-- Sidebar - Using slots for widgets -->
        <aside v-if="config.sidebar !== 'none'" class="w-full lg:w-[38.2%] pt-8 lg:pt-0">
          <slot name="sidebar" />
        </aside>
      </div>
    </template>
  </div>
</template>
