<script setup lang="ts">
import type { Card, FictionSites } from '@fiction/site'
import type { FictionPosts } from '..'
import type { Post } from '../post'
import { useService, vue } from '@fiction/core'
import UrlShare from '@fiction/ui/blocks/UrlShare.vue'
import XButton from '@fiction/ui/buttons/XButton.vue'
import InputText from '@fiction/ui/inputs/InputText.vue'

const { post } = defineProps<{
  post: Post
  card: Card
}>()

const { fictionUser, fictionSites } = useService<{ fictionPosts: FictionPosts, fictionSites: FictionSites }>()

const loading = vue.ref(false)
const copied = vue.ref<string | null>(null)

const url = vue.computed(() => {
  const href = post.href.value
  const org = fictionUser.activeOrganization.value
  if (!href || !org)
    return ''

  const origin = fictionSites.getOrigin({ subDomain: org.handle })

  return `${origin}${href}`
})

function copyToClipboard(url: string) {
  navigator.clipboard.writeText(url)
  copied.value = url
  setTimeout(() => {
    copied.value = null
  }, 2000)
}

function shareTwitter() {
  const text = `${post.title.value}`
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url.value)}`)
}

function shareLinkedIn() {
  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url.value)}`)
}

function shareFacebook() {
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url.value)}`)
}
</script>

<template>
  <div class="my-6 bg-theme-50 dark:bg-theme-900 border border-theme-200 dark:border-theme-700 rounded-lg  p-4 md:p-6">
    <UrlShare :url="url" :title="post.title.value" ui-size="lg" :classes="{ inputClass: 'dark:bg-black' }" />
  </div>
</template>
