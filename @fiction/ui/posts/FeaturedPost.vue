<script lang="ts" setup>
import type { Post } from '@fiction/posts'
import { dayjs, vue } from '@fiction/core'
import { countWords } from '@fiction/core/utils/wordCount'
import XLink from '@fiction/ui/common/XLink.vue'
import XMedia from '@fiction/ui/media/XMedia.vue'

defineOptions({ name: 'FeaturedPost' })

const props = defineProps<{
  post: Post
  orientation?: 'left' | 'right'
  config: {
    showExcerpt?: boolean
    showAuthors?: boolean
    showDate?: boolean
    showReadTime?: boolean
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

// Get author information
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
    class="featured-post group relative w-full rounded-xl overflow-hidden aspect-[16/9] sm:aspect-[21/9] mb-12"
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
    <div class="absolute inset-0 w-full h-full">
      <XMedia
        v-if="post.media?.value"
        :media="post.media.value"
        class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        itemprop="image"
      />
      <div
        v-else
        class="bg-primary-800/20 dark:bg-primary-900/40 w-full h-full"
      />

      <!-- Content overlay gradient for legibility -->
      <div
        class="absolute inset-0 bg-gradient-to-b from-black/0 via-black/50 to-black/90"
      />
    </div>

    <!-- Content positioned at bottom -->
    <div class="z-10 flex h-full w-full absolute">
      <div
        class="w-full self-end p-6 sm:p-8 space-y-4"
      >
        <!-- Post metadata -->
        <div
          class="flex items-center text-sm text-white/80 font-sans space-x-4"
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

          <span v-if="config.showReadTime && readTime" class="flex items-center">
            <span class="i-tabler-clock text-lg mr-1.5" />
            {{ readTime }} min read
          </span>

          <div v-if="config.showAuthors && authors.length" class="flex items-center">
            <span class="i-tabler-user text-lg mr-1.5" />
            <span itemprop="author" itemscope itemtype="https://schema.org/Person">
              <span itemprop="name">{{ authors[0].fullName }}</span>
            </span>
            <span v-if="authors.length > 1" class="ml-1">+ {{ authors.length - 1 }}</span>
          </div>
        </div>

        <!-- Title with hover effect -->
        <div class="space-y-3">
          <h2
            itemprop="headline"
            class="x-font-title font-semibold text-white text-xl sm:text-2xl md:text-3xl transition-colors duration-300"
          >
            <XLink :href="post.href.value" class="text-white hover:text-primary-300">
              {{ post.title.value }}
            </XLink>
          </h2>

          <!-- Optional excerpt -->
          <p
            v-if="config.showExcerpt && post.excerpt?.value"
            class="text-white/90 text-base md:text-lg leading-relaxed max-w-3xl line-clamp-3"
            itemprop="description"
          >
            {{ post.excerpt.value }}
          </p>
        </div>
      </div>
    </div>
  </article>
</template>
