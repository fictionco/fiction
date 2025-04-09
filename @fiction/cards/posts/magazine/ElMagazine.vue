<script lang="ts" setup>
import type { IndexMeta } from '@fiction/core'
import type { FictionPosts, TablePostConfig } from '@fiction/posts'
import type { Card } from '@fiction/site'
import type { UserConfig } from './config'
import { useService, vue } from '@fiction/core'
import { useSSRData } from '@fiction/core/utils/ssr'
import { Post } from '@fiction/posts'
import { loadPosts } from '@fiction/posts/utils/post'
import ElSpinner from '@fiction/ui/loaders/ElSpinner.vue'
import El404 from '@fiction/ui/page/El404.vue'
import ElMagazineIndex from './ElMagazineIndex.vue'
import ElMagazineSingle from './ElMagazineSingle.vue'

const { card } = defineProps<{ card: Card<UserConfig> }>()
const { fictionPosts } = useService<{ fictionPosts: FictionPosts }>()

const indexMeta = vue.ref<IndexMeta>({
  offset: 0,
  limit: card.userConfig.value.posts?.limit || 12,
  count: 0,
})

const viewId = vue.computed(() => card.site?.siteRouter.params.value.viewId as string)
const itemId = vue.computed(() => card.site?.siteRouter.params.value.itemId as string)
const uc = vue.computed(() => card.userConfig.value || {})

// Define function to fetch posts
async function fetchPosts() {
  const site = card.site

  const result = await loadPosts({
    fictionPosts,
    site,
    indexMeta: indexMeta.value,
  })

  // Update indexMeta with values from result
  indexMeta.value = result.indexMeta

  return result
}

// Generate a unique cache key based on relevant props
const cacheKey = vue.computed(() => `posts-${viewId.value}-${itemId.value}-${uc.value.posts?.format}-${indexMeta.value.offset}-${indexMeta.value.limit}`)

// Use the SSR data hook
const { data: postsData, loading: postsLoading } = useSSRData({ key: cacheKey, fetchData: fetchPosts })

// Extract data for templates
const posts = vue.computed(() => {
  const postData = postsData.value?.posts || []
  return postData.map((p: TablePostConfig) => new Post({ fictionPosts, ...p }))
})
</script>

<template>
  <div
    :class="card.classes.value.contentWidth"
    :data-post-format="uc.posts?.format"
    :data-post-limit="uc.posts?.limit"
    :data-item-id="itemId"
    :data-view-id="viewId"
  >
    <transition
      enter-active-class="ease-out duration-200"
      enter-from-class="opacity-0 translate-y-10"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="ease-in duration-200"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-10"
      mode="out-in"
    >
      <div v-if="postsLoading" class="flex justify-center py-12 h-[80vh]">
        <ElSpinner class="size-8 text-theme-500" />
      </div>

      <template v-else-if="itemId">
        <ElMagazineSingle
          v-if="itemId"
          :key="itemId"
          :card
          :post="posts[0]"
          :related-posts="posts.slice(1, 4)"
          :loading="postsLoading"
        />
        <El404
          v-else
          title="Post Not Found"
          sub-title="We couldn't find the post at this location"
          :buttons="[{
            label: 'All Posts',
            icon: 'i-tabler-article',
            href: card.link(`/${viewId}`),
            theme: 'primary',
          }]"
        />
      </template>

      <template v-else>
        <ElMagazineIndex
          v-if="posts.length"
          :card
          :posts
          :index-meta="indexMeta"
          :loading="postsLoading"
          @update:index-meta="indexMeta = $event"
        />

        <El404
          v-else-if="!posts.length"
          title="No Posts Available"
          sub-title="Check back later for new content"
        />
      </template>
    </transition>
  </div>
</template>
