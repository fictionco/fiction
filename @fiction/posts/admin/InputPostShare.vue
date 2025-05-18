<script setup lang="ts">
import type { Card, FictionSites } from '@fiction/site'
import type { FictionPosts } from '..'
import type { Post } from '../post'
import { useService, vue } from '@fiction/core'
import UrlShare from '@fiction/ui/blocks/UrlShare.vue'

const { post } = defineProps<{
  post: Post
  card: Card
}>()

const { fictionUser, fictionSites } = useService<{ fictionPosts: FictionPosts, fictionSites: FictionSites }>()

const url = vue.computed(() => {
  const href = post.href.value
  const org = fictionUser.activeOrganization.value
  if (!href || !org)
    return ''

  const origin = fictionSites.getOrigin({ subDomain: org.handle })

  return `${origin}${href}`
})
</script>

<template>
  <div class="my-6 bg-theme-50 dark:bg-theme-900 border border-theme-200 dark:border-theme-700 rounded-lg  p-4 md:p-6">
    <UrlShare :url="url" :title="post.title.value" ui-size="lg" :classes="{ inputClass: 'dark:bg-black' }" />
  </div>
</template>
