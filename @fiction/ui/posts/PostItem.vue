<script lang="ts" setup>
import type { Post } from '@fiction/posts'
import { dayjs, vue } from '@fiction/core'
import { countWords } from '@fiction/core/utils/wordCount'
import XLink from '@fiction/ui/common/XLink.vue'
import XMedia from '@fiction/ui/media/XMedia.vue'

defineOptions({ name: 'PostItem' })

const props = defineProps<{
  post: Post
  config: PostItemConfig
  featured?: boolean
}>()

export interface PostItemConfig {
  showExcerpt?: boolean
  showAuthors?: boolean
  showDate?: boolean
  showReadTime?: boolean
  imagePosition?: 'top' | 'right' | 'left' | 'cover' | 'none'
  /** Base URL path for posts, defaults to "p" */
  basePath?: string
}

// Set default base path if not provided
const basePath = vue.computed(() => props.config.basePath || 'p')

// Generate post URL with base path
const postUrl = vue.computed(() => {
  // Get the original URL from the post
  const originalUrl = props.post.href.value || ''

  // If it already includes a path structure, use it directly
  if (originalUrl.includes('/')) {
    return originalUrl
  }

  // Otherwise, construct URL with base path and slug
  const slug = props.post.slug?.value || ''
  return slug ? `/${basePath.value}/${slug}` : originalUrl
})

// Calculate layout classes
const containerClasses = vue.computed(() => {
  const { imagePosition } = props.config
  const baseClasses = '@container/post-item relative h-full'

  if (imagePosition === 'cover') {
    return `${baseClasses} group rounded-lg overflow-hidden min-h-[280px] @md/post-item:min-h-[340px] @lg/post-item:min-h-[380px]`
  }

  if (['left', 'right'].includes(imagePosition || '')) {
    const out = `${baseClasses} flex gap-5 h-full @md/post-item:gap-6 @lg/post-item:gap-7`
    return imagePosition === 'right' ? `${out} flex-row-reverse` : out
  }

  return `${baseClasses} flex flex-col h-full`
})

// Calculate image classes
const imageClasses = vue.computed(() => {
  const { imagePosition } = props.config

  if (imagePosition === 'cover') {
    return 'w-full h-full overflow-hidden absolute inset-0 transition-transform duration-500 group-hover:scale-105'
  }

  if (imagePosition === 'left' || imagePosition === 'right') {
    return 'size-24 @md/post-item:size-32 @lg/post-item:size-40 rounded-lg shrink-0 overflow-hidden'
  }

  if (imagePosition === 'top') {
    return 'w-full aspect-[16/9] overflow-hidden rounded-lg'
  }

  return ''
})

// Calculate content wrapper classes
const contentClasses = vue.computed(() => {
  const { imagePosition } = props.config
  const base = 'flex flex-col'

  if (imagePosition === 'cover') {
    return `${base} z-10 relative h-full justify-end p-5 @md/post-item:p-6 @lg/post-item:p-7`
  }

  if (imagePosition === 'left' || imagePosition === 'right') {
    return `${base} flex-grow py-1`
  }

  if (imagePosition === 'top') {
    return `${base} flex-grow pt-4`
  }

  return `${base} flex-grow gap-3`
})

// Title classes with container queries for responsive typography
const titleClasses = vue.computed(() => {
  const { imagePosition } = props.config

  const base = 'x-font-title font-semibold md:text-pretty text-lg tracking-tight @md/post-item:text-xl @lg/post-item:text-2xl'

  if (imagePosition === 'cover') {
    return `${base} text-white mb-2 @md/post-item:mb-3`
  }

  if (imagePosition === 'left' || imagePosition === 'right') {
    return `${base} line-clamp-3`
  }

  return base
})

// Format the date nicely
const formattedDate = vue.computed(() =>
  props.post.dateAt?.value ? dayjs(props.post.dateAt.value).format('MMM D, YYYY') : '',
)

// Calculate read time
const readTime = vue.computed(() => {
  const wordCount = props.post.content?.value ? countWords(props.post.content.value) : 0
  return Math.ceil(wordCount / 225) // Assume 225 words per minute (slightly more realistic)
})

// Get author information
const authors = vue.computed(() => props.post.authors?.value || [])

// Calculate if the post needs an overlay (for cover images with text)
const needsOverlay = vue.computed(() => props.config.imagePosition === 'cover')

// Get excerpt with appropriate trimming for each layout
const excerptClasses = vue.computed(() => {
  const { imagePosition } = props.config
  const base = 'text-sm @md/post-item:text-base leading-relaxed'

  if (imagePosition === 'cover') {
    return `${base} text-white/85 line-clamp-2 mb-3 max-w-prose`
  }

  return `${base} text-theme-600 dark:text-theme-300 line-clamp-3 mb-auto max-w-prose mt-2`
})

// SEO-relevant data
const publishDate = vue.computed(() => props.post.dateAt?.value || '')
const modifiedDate = vue.computed(() => props.post.updatedAt?.value || publishDate.value)
const categories = vue.computed(() => props.post.categories?.value || [])
const tags = vue.computed(() => props.post.tags?.value || [])
</script>

<template>
  <article
    itemscope
    itemtype="https://schema.org/BlogPosting"
    :class="containerClasses"
    class="group transition-opacity duration-300 text-theme-800 dark:text-theme-100 hover:opacity-95"
  >
    <!-- Hidden SEO metadata -->
    <meta itemprop="headline" :content="post.title.value">
    <meta itemprop="description" :content="post.excerpt?.value || post.subTitle?.value || ''">
    <meta v-if="publishDate" itemprop="datePublished" :content="publishDate">
    <meta v-if="modifiedDate" itemprop="dateModified" :content="modifiedDate">
    <link v-if="postUrl" itemprop="url" :href="postUrl">

    <!-- Author metadata -->
    <div v-if="authors.length" itemscope itemtype="https://schema.org/Person" itemprop="author" class="hidden">
      <meta itemprop="name" :content="authors[0].fullName">
    </div>

    <!-- Categories and tags for SEO -->
    <div v-if="categories.length" itemprop="about" class="hidden">
      <meta v-for="(category, index) in categories" :key="`cat-${index}`" itemscope itemtype="https://schema.org/Thing" :content="category">
    </div>

    <div v-if="tags.length" class="hidden">
      <meta v-for="(tag, index) in tags" :key="`tag-${index}`" itemprop="keywords" :content="tag">
    </div>

    <!-- Actual link wrapper -->
    <XLink
      :href="postUrl"
      class="block h-full w-full"
    >
      <!-- Cover layout -->
      <template v-if="config.imagePosition === 'cover'">
        <!-- Media -->
        <XMedia
          v-if="post.media?.value"
          :media="post.media.value"
          :class="imageClasses"
          itemprop="image"
        />

        <!-- Gradient overlay for legibility -->
        <div
          v-if="needsOverlay"
          class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none"
        />

        <!-- Content -->
        <div :class="contentClasses">
          <!-- Title -->
          <h2 itemprop="headline" :class="titleClasses">
            {{ post.title.value }}
          </h2>

          <!-- Excerpt -->
          <p
            v-if="config.showExcerpt && post.excerpt?.value"
            :class="excerptClasses"
            itemprop="description"
          >
            {{ post.excerpt.value }}
          </p>

          <!-- Meta information -->
          <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs @md/post-item:text-sm text-white/75">
            <!-- Date -->
            <time v-if="config.showDate && formattedDate" itemprop="datePublished" :datetime="publishDate">
              {{ formattedDate }}
            </time>

            <!-- Read time -->
            <span v-if="config.showReadTime && readTime">{{ readTime }} min read</span>

            <!-- Authors -->
            <div v-if="config.showAuthors && authors.length" class="flex items-center gap-1">
              <span>By</span>
              <span class="font-medium" itemprop="author" itemscope itemtype="https://schema.org/Person">
                <span itemprop="name">{{ authors[0].fullName }}</span>
              </span>
              <span v-if="authors.length > 1">+ {{ authors.length - 1 }} more</span>
            </div>
          </div>
        </div>
      </template>

      <!-- Standard layout (top, left, right) -->
      <template v-else>
        <!-- Image for top layout -->
        <XMedia
          v-if="post.media?.value && config.imagePosition === 'top'"
          :media="post.media.value"
          :class="imageClasses"
          itemprop="image"
        />

        <!-- Image for side layouts (left/right) -->
        <XMedia
          v-if="post.media?.value && (config.imagePosition === 'left' || config.imagePosition === 'right')"
          :media="post.media.value"
          :class="imageClasses"
          itemprop="image"
        />

        <!-- Content -->
        <div :class="contentClasses">
          <!-- Title -->
          <h2 itemprop="headline" :class="titleClasses">
            {{ post.title.value }}
          </h2>

          <!-- Excerpt -->
          <p
            v-if="config.showExcerpt && (post.excerpt?.value || post.subTitle?.value)"
            :class="excerptClasses"
            itemprop="description"
          >
            {{ post.excerpt.value || post.subTitle.value }}
          </p>

          <!-- Meta information -->
          <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs @md/post-item:text-sm text-theme-500 dark:text-theme-400 mt-3">
            <!-- Date -->
            <time v-if="config.showDate && formattedDate" itemprop="datePublished" :datetime="publishDate">
              {{ formattedDate }}
            </time>

            <!-- Read time -->
            <span v-if="config.showReadTime && readTime">{{ readTime }} min read</span>

            <!-- Authors -->
            <div v-if="config.showAuthors && authors.length" class="flex items-center gap-1">
              <span>By</span>
              <span class="font-medium" itemprop="author" itemscope itemtype="https://schema.org/Person">
                <span itemprop="name">{{ authors[0].fullName }}</span>
              </span>
              <span v-if="authors.length > 1">+ {{ authors.length - 1 }} more</span>
            </div>
          </div>
        </div>
      </template>
    </XLink>
  </article>
</template>
