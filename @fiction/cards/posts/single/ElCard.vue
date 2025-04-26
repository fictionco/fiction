<script lang="ts" setup>
import type { FictionPosts, TablePostConfig } from '@fiction/posts'
import type { Card } from '@fiction/site'
import { useService, vue } from '@fiction/core'
import { useSSRData } from '@fiction/core/utils/ssr'
import { Post } from '@fiction/posts'
import { getPost } from '@fiction/posts/utils/post'
import XButton from '@fiction/ui/buttons/XButton.vue'
import PostSingle from '@fiction/ui/posts/PostSingle.vue'
import XWidgetAbout from '@fiction/ui/posts/XWidgetAbout.vue'
import XWidgetPosts from '@fiction/ui/posts/XWidgetPosts.vue'
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
  <CardWrap :card content-width="md" vertical-spacing="md">
    <div class="flex flex-col lg:flex-row gap-8 lg:gap-12">
      <!-- Main content area -->
      <div class="flex-1">
        <PostSingle
          :card
          :post
          :loading
        />
        <div class="nav flex justify-between items-center mt-8">
          <XButton
            :disabled="!post?.relatedPosts.value.prev?.href.value"
            design="outline"
            icon="i-tabler-arrow-left"
            :href="card.link(post?.relatedPosts.value.prev?.href.value)"
          >
            Previous
          </XButton>
          <XButton
            :disabled="!post?.relatedPosts.value.next?.href.value"
            design="outline"
            icon-after="i-tabler-arrow-right"
            :href="card.link(post?.relatedPosts.value.next?.href.value)"
          >
            Next
          </XButton>
        </div>
      </div>
      <div class="w-full lg:w-80 @lg/demo:block @container/sidebar space-y-8">
        <XWidgetAbout :card />
        <XWidgetPosts :card :posts="post?.relatedPosts.value.similar || []" />
      </div>
    </div>
  </CardWrap>
</template>
