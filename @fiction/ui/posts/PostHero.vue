<script lang="ts" setup>
import type { Post } from '@fiction/posts'
import { dayjs, vue } from '@fiction/core'
import { countWords } from '@fiction/core/utils/wordCount'
import XButton from '@fiction/ui/buttons/XButton.vue'
import XLink from '@fiction/ui/common/XLink.vue'
import XMedia from '@fiction/ui/media/XMedia.vue'

defineOptions({ name: 'PostHero' })

const props = defineProps<{
  post: Post
  orientation?: 'left' | 'right'
  layout?: 'cover' | 'split'
  config: {
    showExcerpt?: boolean
    showAuthors?: boolean
    showDate?: boolean
    showReadTime?: boolean
    basePath?: string
  }
}>()

// Format the date nicely
const formattedDate = vue.computed(() =>
  props.post.dateAt?.value ? dayjs(props.post.dateAt.value).format('MMM D, YYYY') : '',
)

// Calculate read time
const readTime = vue.computed(() => {
  const wordCount = props.post.content?.value ? countWords(props.post.content.value) : 0
  return Math.ceil(wordCount / 225)
})

// Get author information and SEO data
const authors = vue.computed(() => props.post.authors?.value || [])
const publishDate = vue.computed(() => props.post.dateAt?.value || '')
const modifiedDate = vue.computed(() => props.post.updatedAt?.value || publishDate.value)
const categories = vue.computed(() => props.post.categories?.value || [])
const tags = vue.computed(() => props.post.tags?.value || [])

// Base positioning classes
const isRightOriented = vue.computed(() => props.orientation === 'right')
</script>

<template>
  <article
    itemscope
    itemtype="https://schema.org/BlogPosting"
    class="hero-post group relative min-h-[18rem] sm:min-h-[22rem] md:min-h-[26rem] lg:min-h-[32rem] w-full mb-16 lg:mb-24 rounded-xl overflow-hidden"
  >
    <!-- SEO metadata -->
    <meta itemprop="headline" :content="post.title.value">
    <meta itemprop="description" :content="post.excerpt?.value || post.subTitle?.value || ''">
    <meta v-if="publishDate" itemprop="datePublished" :content="publishDate">
    <meta v-if="modifiedDate" itemprop="dateModified" :content="modifiedDate">
    <link v-if="post.href.value" itemprop="url" :href="post.href.value">

    <!-- Author metadata -->
    <div v-if="authors.length" itemscope itemtype="https://schema.org/Person" itemprop="author" class="hidden">
      <meta itemprop="name" :content="authors[0].fullName">
    </div>

    <!-- Categories and tags -->
    <div v-if="categories.length" itemprop="about" class="hidden">
      <meta v-for="(category, index) in categories" :key="`cat-${index}`" itemscope itemtype="https://schema.org/Thing" :content="category">
    </div>

    <div v-if="tags.length" class="hidden">
      <meta v-for="(tag, index) in tags" :key="`tag-${index}`" itemprop="keywords" :content="tag">
    </div>

    <!-- Image background -->
    <div v-if="post.media?.value" class="absolute inset-0 w-full h-full">
      <XMedia
        :media="post.media.value"
        class="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.33,1)]"
        itemprop="image"
      />
      <!-- Content overlay gradient for legibility -->
      <div
        class="absolute inset-0 bg-gradient-to-r"
        :class="isRightOriented ? 'from-black/10 via-black/60 to-black/90' : 'from-black/90 via-black/60 to-black/10'"
      />
    </div>

    <!-- Content positioned based on orientation -->
    <div class="z-10 flex h-full w-full items-end lg:items-center absolute">
      <div
        class="w-full md:max-w-[50%] p-6 sm:p-8 md:p-10 lg:p-12 space-y-6"
        :class="isRightOriented ? 'ml-auto' : 'mr-auto'"
      >
        <div
          class="flex items-center text-sm text-white/75 font-sans"
        >
          <time
            v-if="config.showDate && formattedDate"
            itemprop="datePublished"
            :datetime="publishDate"
            class="flex items-center"
          >
            <span class="i-tabler-calendar-event text-lg mr-1.5" />
            {{ formattedDate }}
          </time>

          <span v-if="config.showDate && formattedDate && (config.showReadTime || (config.showAuthors && authors.length))" class="mx-3">•</span>

          <span v-if="config.showReadTime && readTime" class="flex items-center">
            <span class="i-tabler-clock text-lg mr-1.5" />
            {{ readTime }} min read
          </span>

          <span v-if="config.showReadTime && (config.showAuthors && authors.length)" class="mx-3">•</span>

          <div v-if="config.showAuthors && authors.length" class="flex items-center">
            <span class="i-tabler-user text-lg mr-1.5" />
            <span itemprop="author" itemscope itemtype="https://schema.org/Person">
              <span itemprop="name">{{ authors[0].fullName }}</span>
            </span>
            <span v-if="authors.length > 1" class="ml-1">+ {{ authors.length - 1 }}</span>
          </div>
        </div>

        <!-- Title with hover effect -->
        <div class="space-y-4">
          <h2
            itemprop="headline"
            class="x-font-title font-semibold text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl lg:leading-[1.1] md:text-pretty transition-transform duration-300 transform"
          >
            <XLink :href="post.href.value" class="text-white hover:text-white">
              {{ post.title.value }}
            </XLink>
          </h2>

          <!-- Optional excerpt -->
          <p
            v-if="config.showExcerpt && post.excerpt?.value"
            class="font-medium text-white/90 text-base md:text-lg lg:text-xl leading-relaxed max-w-prose"
            itemprop="description"
          >
            {{ post.excerpt.value }}
          </p>
        </div>

        <!-- Read more link -->
        <XLink
          :href="post.href.value"
          class="inline-block mt-4 text-white hover:text-primary-300 border-b border-white/30 hover:border-primary-300 transition-colors duration-300 pb-0.5"
        >
          Read article
          <span class="i-tabler-arrow-right ml-1" />
        </XLink>
      </div>
    </div>
  </article>
</template>
