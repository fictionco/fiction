<script setup lang="ts">
import type { Card } from '@fiction/site'
import type { FictionPosts } from '..'
import type { Post } from '../post'
import type { PostLocation } from '../utils/post'
import { useService, vue } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import { findPostLocations } from '../utils/post'

const { post } = defineProps<{
  post: Post
  card: Card
}>()

const { fictionPosts } = useService<{ fictionPosts: FictionPosts }>()

const loading = vue.ref(false)
const postLocations = vue.shallowRef<PostLocation[]>([])
const copied = vue.ref<string | null>(null)

vue.onMounted(async () => {
  vue.watch(() => post.slug.value, async () => {
    loading.value = true
    postLocations.value = await findPostLocations({ post, fictionPosts })
    loading.value = false
  }, { immediate: true })
})

function copyToClipboard(url: string) {
  navigator.clipboard.writeText(url)
  copied.value = url
  setTimeout(() => {
    copied.value = null
  }, 2000)
}

function shareTwitter(url: string) {
  const text = `${post.title.value}`
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`)
}

function shareLinkedIn(url: string) {
  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`)
}

function shareFacebook(url: string) {
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`)
}
</script>

<template>
  <div class="sharing-section">
    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-6 w-6 border-t-2 border-theme-500" />
    </div>

    <div v-else-if="postLocations.length > 0" class="space-y-6">
      <div v-for="location in postLocations" :key="location.url" class="bg-theme-50 dark:bg-theme-800 border border-theme-200 dark:border-theme-600 rounded-lg overflow-hidden p-4">
        <div class="mb-3">
          <div class="text-sm text-theme-600 dark:text-theme-300 mb-1">
            {{ location.site.title.value || 'Unnamed Site' }}
          </div>
          <div class="flex items-center gap-2">
            <input
              type="text"
              readonly
              :value="location.url"
              class="flex-1 px-3 py-2 bg-white dark:bg-theme-700 border border-theme-200 dark:border-theme-600 rounded text-sm"
            >
            <XButton
              size="sm"
              design="ghost"
              :icon="copied === location.url ? 'i-tabler-check' : 'i-tabler-copy'"
              :theme="copied === location.url ? 'emerald' : 'default'"
              @click="copyToClipboard(location.url)"
            >
              {{ copied === location.url ? 'Copied!' : 'Copy' }}
            </XButton>
          </div>
        </div>

        <div class="pt-4">
          <div class="text-sm font-medium mb-2">
            Share on social media
          </div>
          <div class="flex flex-wrap gap-2">
            <XButton
              size="xs"
              icon="i-tabler-brand-x"
              theme="blue"
              design="outline"
              @click="shareTwitter(location.url)"
            >
              X / Twitter
            </XButton>
            <XButton
              size="xs"
              icon="i-tabler-brand-linkedin"
              theme="indigo"
              design="outline"
              @click="shareLinkedIn(location.url)"
            >
              LinkedIn
            </XButton>
            <XButton
              size="xs"
              icon="i-tabler-brand-facebook"
              theme="blue"
              design="outline"
              @click="shareFacebook(location.url)"
            >
              Facebook
            </XButton>
            <XButton
              size="xs"
              icon="i-tabler-mail"
              theme="emerald"
              design="outline"
              :href="`mailto:?subject=${encodeURIComponent(post.title.value)}&body=${encodeURIComponent(location.url)}`"
            >
              Email
            </XButton>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="p-6 md:p-12 bg-theme-50 dark:bg-theme-700/20 text-theme-700 dark:text-theme-300 rounded-md text-center text-sm space-y-2">
      <p class="dark:text-theme-0 text-theme-900  font-semibold">
        This post isn't currently found on any of your sites.
      </p>
      <p>To add it, make sure your site includes a page with a post/blog element and that element includes this post.</p>
    </div>
  </div>
</template>
