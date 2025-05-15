<script lang="ts" setup>
import type { IndexMeta } from '@fiction/core'
import type { FictionPosts, TablePostConfig } from '@fiction/posts'
import type { Card } from '@fiction/site'
import type { UserConfig } from './config'
import { useService, vue } from '@fiction/core'
import { useSSRData } from '@fiction/core/utils/ssr'
import { Post } from '@fiction/posts'
import { loadPosts } from '@fiction/posts/utils/post'
import PostIndexLayout from '@fiction/ui/posts/PostIndexLayout.vue'
import CardWrap from '../../CardWrap.vue'

const { card } = defineProps<{ card: Card<UserConfig> }>()
const { fictionPosts } = useService<{ fictionPosts: FictionPosts }>()

const uc = vue.computed(() => card.fullConfig.value || {})
const indexMeta = vue.ref<IndexMeta>({
  offset: 0,
  limit: uc.value.posts?.limit || 12,
  count: 0,
})

const sortBy = vue.ref<'latest' | 'popular'>('latest')

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
  return postData.map((p: TablePostConfig) => new Post({ fictionPosts, card, ...p }))
})

const org = vue.computed(() => {
  return card.site?.org.value
})
</script>

<template>
  <CardWrap :card>
    <PostIndexLayout
      v-model:sort-by="sortBy"
      :card
      :posts
      :index-meta="indexMeta"
      :loading
      :header="uc"
      :featured-count="+(uc.featuredCount ?? 1)"
      @update:index-meta="indexMeta = $event"
    />
  </CardWrap>
</template>
