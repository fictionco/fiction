<script lang="ts" setup>
import type { PostObject } from '@fiction/core'
import type { Post } from '@fiction/posts'
import type { Card } from '@fiction/site'
import { vue } from '@fiction/core'
import XText from '../common/XText.vue'
import EffectFitText from '../effect/EffectFitText.vue'
import XMedia from '../media/XMedia.vue'
import PostFeature from './PostFeature.vue'
import PostItem from './PostItem.vue'

defineOptions({ name: 'PostLayout' })

const { posts, featuredCount = 1, layout = 'magazine', sortBy = 'latest', header } = defineProps<{
  posts: Post[]
  loading?: boolean
  sortBy?: 'latest' | 'popular'
  header?: PostObject
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
    <div v-if="header?.title" class="flex gap-16 xl:gap-36 items-center">
      <!-- Content section -->
      <div class="flex-1 space-y-2">
        <!-- Headline with fit text -->
        <!-- Subheading text -->

        <div v-if="header?.title" class="relative z-10 flex items-center gap-16 xl:gap-36 ">
          <EffectFitText
            :content="header.title"
            :min-size="40"
            :max-size="160"
            :lines="1"
            class="w-full"
          >
            <XText
              :card
              tag="span"
              :model-value="header.title"
              animate="rise"
              class="block font-bold x-font-title  "
            />
          </EffectFitText>
        </div>
        <XText
          v-if="header?.subTitle"
          :card
          :model-value="header.subTitle"
          animate="rise"
          class="text-theme-400 text-2xl xl:text-3xl mix-blend-difference z-0 relative"
        />
      </div>
      <div
        v-if="header?.media?.url"
        class=" w-24 flex-shrink-0"
      >
        <XMedia
          :media="header?.media"
          class="aspect-square w-full rounded-full overflow-hidden ring-2 xl:ring-4 ring-white"
          itemprop="image"
        />
      </div>

      <!-- Featured image - responsive approach -->
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
