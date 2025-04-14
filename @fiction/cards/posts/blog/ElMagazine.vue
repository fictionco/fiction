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
import PostIndex from '@fiction/ui/posts/PostIndex.vue'
import CardWrap from '../../CardWrap.vue'
import ElMagazineIndex from './ElMagazineIndex.vue'
import ElMagazineSingle from './ElMagazineSingle.vue'

const { card } = defineProps<{ card: Card<UserConfig> }>()
const { fictionPosts } = useService<{ fictionPosts: FictionPosts }>()

const indexMeta = vue.ref<IndexMeta>({
  offset: 0,
  limit: card.userConfig.value.posts?.limit || 12,
  count: 0,
})

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
const cacheKey = vue.computed(() => `posts-${uc.value.posts?.format}-${indexMeta.value.offset}-${indexMeta.value.limit}`)

// Use the SSR data hook
const { data: postsData, loading, hasInitialized } = useSSRData({ key: cacheKey, fetchData: fetchPosts })

// Extract data for templates
const posts = vue.computed(() => {
  const postData = postsData.value?.posts || []
  return postData.map((p: TablePostConfig) => new Post({ fictionPosts, ...p }))
})
</script>

<template>
  <CardWrap :card>
    <div
      :class="card.classes.value.contentWidth"
      :data-post-format="uc.posts?.format"
      :data-post-limit="uc.posts?.limit"
    >
      <PostIndex
        v-if="posts.length"
        :card
        :posts
        :index-meta="indexMeta"
        :loading
        @update:index-meta="indexMeta = $event"
      />

      <El404
        v-else-if="!posts.length"
        title="No Posts Available"
        sub-title="Check back later."
      />
    </div>
  </CardWrap>
</template>
