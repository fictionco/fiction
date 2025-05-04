<script lang="ts" setup>
import type { FictionPosts, TablePostConfig } from '@fiction/posts'
import type { Card } from '@fiction/site'
import { useService, vue } from '@fiction/core'
import { useSSRData } from '@fiction/core/utils/ssr'
import { Post } from '@fiction/posts'
import { getPost } from '@fiction/posts/utils/post'
import PostSingle from '@fiction/ui/posts/PostSingle.vue'
import CardWrap from '../../CardWrap.vue'

const { card } = defineProps<{ card: Card }>()
const { fictionPosts } = useService<{ fictionPosts: FictionPosts }>()

const itemId = vue.computed(() => card.site?.siteRouter.params.value.itemId as string | undefined)

// Define function to fetch posts
async function fetchSinglePost() {
  const orgId = card.site?.settings.orgId
  const slug = itemId.value
  if (!orgId || !slug) {
    return undefined
  }

  const result = await getPost({
    fictionPosts,
    orgId,
    where: { slug },
  })

  return result
}

// Generate a unique cache key based on relevant props
const cacheKey = vue.computed(() => `post-single-${itemId.value}1`)

// Use the SSR data hook
const { data: postSingleData, loading, hasInitialized } = useSSRData({ key: cacheKey, fetchData: fetchSinglePost })

// Extract data for templates
const post = vue.computed<Post | undefined>(() => {
  const postData = postSingleData.value || []
  const p = postData.map((p: TablePostConfig) => new Post({ fictionPosts, card, ...p }))
  return p[0]
})
</script>

<template>
  <CardWrap :card>
    <PostSingle
      :card
      :post
      :loading
    />
  </CardWrap>
</template>
