<script setup lang="ts">
import type { Card, FictionSites } from '@fiction/site'
import type { FictionPosts } from '..'
import type { Post } from '../post'
import { useService, vue } from '@fiction/core'
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
  <div class="sharing-section">
    <div class="space-y-6">
      <div class="bg-theme-50 dark:bg-theme-800 border border-theme-200 dark:border-theme-600 rounded-lg overflow-hidden p-4 md:p-6">
        <div class="mb-3">
          <div class="flex items-center gap-2">
            <InputText v-model="url" input-class="dark:bg-theme-950" readonly ui-size="lg" />
            <XButton
              class="shrink-0"
              design="ghost"
              rounding="md"
              size="lg"
              :icon="copied === url ? 'i-tabler-check' : 'i-tabler-copy'"
              :theme="copied === url ? 'emerald' : 'default'"
              @click="copyToClipboard(url)"
            >
              {{ copied === url ? 'Copied!' : 'Copy' }}
            </XButton>
            <XButton
              class="shrink-0"
              design="ghost"
              theme="green"
              rounding="md"
              icon="i-tabler-external-link"
              size="lg"
              :href="url"
              target="_blank"
            >
              Go
            </XButton>
          </div>
        </div>

        <div class="pt-4 text-center space-y-4">
          <div class="text-sm mb-2 text-theme-500 dark:text-theme-400">
            Share on social media
          </div>
          <div class="flex flex-wrap gap-2 justify-center">
            <XButton
              size="md"
              icon="i-tabler-brand-x"
              theme="blue"
              design="outline"
              @click="shareTwitter()"
            >
              X
            </XButton>
            <XButton
              size="md"
              icon="i-tabler-brand-linkedin"
              theme="indigo"
              design="outline"
              @click="shareLinkedIn()"
            >
              LinkedIn
            </XButton>
            <XButton
              size="md"
              icon="i-tabler-brand-facebook"
              theme="blue"
              design="outline"
              @click="shareFacebook()"
            >
              Facebook
            </XButton>
            <XButton
              size="md"
              icon="i-tabler-mail"
              theme="emerald"
              design="outline"
              :href="`mailto:?subject=${encodeURIComponent(post.title.value)}&body=${encodeURIComponent(url)}`"
            >
              Email
            </XButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
