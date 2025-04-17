<script lang="ts" setup>
import type { Post } from '@fiction/posts'
import { dayjs, vue } from '@fiction/core'
import { countWords } from '@fiction/core/utils/wordCount'
import XLink from '@fiction/ui/common/XLink.vue'
import XMedia from '@fiction/ui/media/XMedia.vue'
import XIcon from '../media/XIcon.vue'
import PostItemMeta from './PostItemMeta.vue'

defineOptions({ name: 'PostItem' })

const props = defineProps<{
  post: Post
  config: PostItemConfig
  featured?: boolean
}>()

export interface PostItemConfig {
  imagePosition?: 'top' | 'right' | 'left' | 'cover' | 'none'
}

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

// Only dynamic classes that change based on layout
const layoutClasses = vue.computed(() => {
  const position = props.config.imagePosition

  if (position === 'cover') {
    return {
      container: 'rounded-lg overflow-hidden min-h-[280px] @sm/post-item:min-h-[340px] @lg/post-item:min-h-[380px]',
      link: 'block h-full w-full',
      image: 'w-full h-full absolute inset-0 transition-transform duration-500 group-hover:scale-105',
      content: 'z-10 relative h-full justify-end p-5 @sm/post-item:p-6 @lg/post-item:p-7',
      title: 'text-white mb-2 @sm/post-item:mb-3',
      excerpt: 'text-white/85 line-clamp-2 mb-3',
      meta: 'text-white/75',
    }
  }

  if (position === 'left' || position === 'right') {
    return {
      container: '',
      link: `flex gap-5 @sm/post-item:gap-6 @lg/post-item:gap-7 h-full ${position === 'right' ? 'flex-row-reverse' : ''}`,
      image: 'size-16 @sm/post-item:size-24 @lg/post-item:size-32 rounded-lg shrink-0 overflow-hidden',
      content: 'flex-grow py-1',
      title: 'line-clamp-3',
      excerpt: 'text-theme-600 dark:text-theme-300 mb-auto',
      meta: 'text-theme-500',
    }
  }

  // Default (top or none)
  return {
    container: '',
    link: 'flex flex-col h-full',
    image: 'w-full aspect-[16/9] overflow-hidden rounded-lg',
    content: 'flex-grow pt-4',
    title: '',
    excerpt: 'text-theme-600 dark:text-theme-300 mb-auto',
    meta: 'text-theme-500',
  }
})
</script>

<template>
  <article
    itemscope
    itemtype="https://schema.org/BlogPosting"
    class="@container/post-item relative h-full group/post-item transition-opacity duration-300 text-theme-800 dark:text-theme-100 hover:opacity-95"
    :class="[
      layoutClasses.container,
    ]"
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

    <!-- Link wrapper -->
    <XLink
      :href="post.href.value"
      :class="layoutClasses.link"
    >
      <!-- Cover layout with overlay -->
      <template v-if="config.imagePosition === 'cover'">
        <XMedia
          v-if="post.media?.value"
          :media="post.media.value"
          class="overflow-hidden"
          :class="[layoutClasses.image]"
          itemprop="image"
        />

        <!-- Gradient overlay for legibility -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />

        <div class="flex flex-col" :class="[layoutClasses.content]">
          <h2
            itemprop="headline"
            class="x-font-title font-semibold md:text-pretty text-lg tracking-tight @sm/post-item:text-xl @lg/post-item:text-2xl"
            :class="[
              layoutClasses.title,
            ]"
          >
            {{ post.title.value || 'No Title' }}
          </h2>

          <p
            v-if="post.excerpt?.value"
            class="text-sm @sm/post-item:text-base @lg/post-item:text-lg leading-relaxed mt-2 line-clamp-3 max-w-prose"
            :class="[
              layoutClasses.excerpt,
            ]"
            itemprop="description"
          >
            {{ post.excerpt.value }}
          </p>

          <PostItemMeta
            :post="post"
            :classes="{
              color: layoutClasses.meta,
              textSize: 'text-xs @sm/post-item:text-sm',
              hoverOnly: 'opacity-0 group-hover/post-item:opacity-100',
            }"
            :like-count="123"
            :comment-count="0"
          />
        </div>
      </template>

      <!-- Standard layouts (top, left, right) -->
      <template v-else>
        <!-- Media (for top, left, right) -->
        <XMedia
          v-if="post.media?.value?.url && config.imagePosition !== 'none'"
          :media="post.media.value"
          class="overflow-hidden"
          :class="[layoutClasses.image]"
          itemprop="image"
        />
        <div
          v-else
          :class="[layoutClasses.image]"
          class="bg-theme-800/50 rounded-lg flex items-center justify-center text-theme-700"
        >
          <XIcon :media="{ class: 'i-tabler-pin' }" class="size-8 lg:size-12" />
        </div>

        <div class="flex flex-col" :class="[layoutClasses.content]">
          <h2
            itemprop="headline"
            class="x-font-title font-semibold md:text-pretty text-lg tracking-tight @sm/post-item:text-xl @lg/post-item:text-2xl"
            :class="[
              layoutClasses.title,
            ]"
          >
            {{ post.title.value || '(No Title)' }}
          </h2>

          <p
            v-if="(post.excerpt?.value || post.subTitle?.value)"
            class="text-sm @sm/post-item:text-base @lg/post-item:text-lg leading-relaxed mt-2 line-clamp-3 max-w-prose"
            :class="[
              layoutClasses.excerpt,
            ]"
            itemprop="description"
          >
            {{ post.excerpt.value || post.subTitle.value }}
          </p>

          <PostItemMeta
            :post="post"
            class="mt-3"
            :classes="{
              color: layoutClasses.meta,
              textSize: 'text-xs @sm/post-item:text-sm',
              hoverOnly: 'opacity-0 group-hover/post-item:opacity-100',
            }"
            :like-count="123"
            :comment-count="23"
          />
        </div>
      </template>
    </XLink>
  </article>
</template>
