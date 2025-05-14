<script lang="ts" setup>
import type { Post } from '@fiction/posts'
import type { Card } from '@fiction/site'
import { vue } from '@fiction/core'
import XText from '../common/XText.vue'
import EffectFitText from '../effect/EffectFitText.vue'
import PostFeature from './PostFeature.vue'
import PostItem from './PostItem.vue'

defineOptions({ name: 'PostLayout' })

const { posts, featuredCount = 1, layout = 'magazine', sortBy = 'latest', headline } = defineProps<{
  posts: Post[]
  loading?: boolean
  sortBy?: 'latest' | 'popular'
  title?: string
  headline?: string
  layout?: 'magazine' | 'blog'
  featuredCount?: number
  hasSidebar?: boolean
  card?: Card
}>()

const emit = defineEmits<{
  (e: 'update:sortBy', value: 'latest' | 'popular'): void
}>()

// Separate featured posts from regular content
const featuredPosts = vue.computed(() => {
  if (featuredCount <= 0 || !posts.length)
    return []

  // First try to find posts marked as featured
  const explicitFeatured = posts.filter(post => post.isFeatured?.value)

  if (explicitFeatured.length > 0) {
    return explicitFeatured.slice(0, featuredCount)
  }

  // Otherwise, use the most recent posts as featured
  return posts.slice(0, featuredCount)
})

const regularPosts = vue.computed(() => {
  const featuredIds = new Set(featuredPosts.value.map(post => post.postId))
  return posts.filter(post => !featuredIds.has(post.postId))
})

// Helper for tab styling
function getTabClasses(tabType: 'latest' | 'popular' | 'archive') {
  const s = sortBy || 'latest'
  return [
    'py-2 px-4 text-sm font-medium transition-colors duration-200 border-b-2',
    s === tabType
      ? 'border-theme-0 text-theme-0'
      : 'border-transparent text-theme-500 hover:text-theme-700 dark:text-theme-400 dark:hover:text-theme-300',
  ].join(' ')
}
</script>

<template>
  <div
    class="post-layout grid grid-cols-1 gap-12 xl:gap-16"
  >
    <div v-if="headline" class=" ">
      <EffectFitText :content="headline" :min-size="80" :max-size="160" :lines="1">
        <XText
          :card
          tag="span"
          :model-value="headline"
          animate="rise"
          class="block leading-tight font-bold x-font-title text-center"
        />
      </EffectFitText>
    </div>
    <div
      v-if="featuredPosts.length > 0"
      class="featured-posts space-y-12"
    >
      <PostFeature
        v-for="post in featuredPosts"
        :key="`featured-${post.postId}`"
        :card
        :post="post"
      />
    </div>

    <div
      class="post-content-area "
    >
      <div class="flex justify-between border-b border-theme-200 dark:border-theme-700 col-span-12">
        <div>
          <button
            :class="getTabClasses('latest')"
            @click="emit('update:sortBy', 'latest')"
          >
            Latest
          </button>
          <button
            class="hidden"
            :class="getTabClasses('popular')"
            @click="emit('update:sortBy', 'popular')"
          >
            Popular
          </button>
        </div>
        <div>
          <button
            :class="getTabClasses('archive')"
            @click="emit('update:sortBy', 'popular')"
          >
            View All
          </button>
        </div>
      </div>
      <div class="grid grid-cols-12 gap-12" :class="layout === 'magazine' ? 'pt-12' : ''">
        <div class="w-full @container/post-list grow col-span-12">
          <div
            v-if="regularPosts.length > 0"
            class="grid"
            :class="layout === 'magazine' ? 'grid grid-cols-1 @[500px]/post-list:grid-cols-2 @[1000px]/post-list:grid-cols-3 gap-12' : 'divide-y divide-theme-700/50'"
          >
            <PostItem
              v-for="post in regularPosts"
              :key="`post-${post.postId}`"
              :post="post"
              :class="[
                layout === 'blog' ? 'py-8 lg:py-12' : '',
              ]"
            />
          </div>
          <div v-else-if="!loading && featuredPosts.length === 0" class="text-center py-12">
            <p class="text-theme-500 dark:text-theme-400 text-lg">
              No posts available
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
