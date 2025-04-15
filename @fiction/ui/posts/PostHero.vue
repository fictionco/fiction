<script lang="ts" setup>
import type { Post } from '@fiction/posts'
import { dayjs, vue } from '@fiction/core'
import { countWords } from '@fiction/core/utils/wordCount'
import XLink from '@fiction/ui/common/XLink.vue'
import XMedia from '@fiction/ui/media/XMedia.vue'
import PostItemMeta from './PostItemMeta.vue'

defineOptions({ name: 'PostHero' })

const props = defineProps<{
  post: Post
  layout?: 'cover' | 'split'
  config?: {
    showExcerpt?: boolean
    showAuthors?: boolean
    showDate?: boolean
    showReadTime?: boolean
  }
}>()

// Format the date
const formattedDate = vue.computed(() =>
  props.post.dateAt?.value ? dayjs(props.post.dateAt.value).format('MMM D, YYYY') : '',
)

// Calculate read time
const readTime = vue.computed(() => {
  const wordCount = props.post.content?.value ? countWords(props.post.content.value) : 0
  return Math.ceil(wordCount / 225)
})

// Other computed properties
const authors = vue.computed(() => props.post.authors?.value || [])
const showExcerpt = vue.computed(() => props.config?.showExcerpt !== false && !!props.post.excerpt?.value)
const showMeta = vue.computed(() =>
  (props.config?.showDate && !!formattedDate.value)
  || (props.config?.showReadTime && !!readTime.value)
  || (props.config?.showAuthors && authors.value.length > 0),
)
</script>

<template>
  <article
    class="hero-post group relative rounded-xl overflow-hidden"
    :class="layout === 'split' ? 'h-auto md:h-[28rem]' : 'h-[24rem] md:h-[32rem]'"
  >
    <!-- Media background -->
    <div class="absolute inset-0 w-full h-full">
      <XMedia
        v-if="post.media?.value"
        :media="post.media.value"
        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <!-- Gradient overlay for legibility -->
      <div class="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/10" />
    </div>

    <!-- Content -->
    <div class="absolute inset-0 flex items-end p-6 md:p-8 lg:p-10">
      <div class="max-w-3xl">
        <!-- Meta information -->

        <PostItemMeta
          :post="post"
          class="mb-4"
          color-class="text-white/75"
          text-size="text-xs @sm/post-item:text-sm"
          :like-count="123"
          :comment-count="23"
        />

        <!-- Title -->
        <h2 class="x-font-title font-semibold text-white text-2xl md:text-3xl lg:text-4xl mb-4">
          <XLink :href="post.href.value" class="text-white hover:text-white focus:outline-none">
            {{ post.title.value }}
          </XLink>
        </h2>

        <!-- Excerpt -->
        <p
          v-if="showExcerpt"
          class="text-white/90 text-base md:text-lg mb-6 line-clamp-3 max-w-2xl"
        >
          {{ post.excerpt?.value }}
        </p>

        <!-- Read more link -->
        <XLink
          :href="post.href.value"
          class="inline-flex items-center text-white hover:text-primary-300 border-b border-white/30
                hover:border-primary-300 transition-colors pb-0.5"
        >
          Read article
          <span class="i-tabler-arrow-right ml-1.5" />
        </XLink>
      </div>
    </div>
  </article>
</template>
