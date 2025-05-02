<script lang="ts" setup>
import type { Post } from '@fiction/posts'
import { vue } from '@fiction/core'
import XLink from '@fiction/ui/common/XLink.vue'
import XMedia from '@fiction/ui/media/XMedia.vue'
import XIcon from '../media/XIcon.vue'
import PostItemByline from './PostItemByline.vue'
import PostItemMeta from './PostItemMeta.vue'

defineOptions({ name: 'PostItem' })

const props = defineProps<{
  post: Post
  config: {
    imagePosition?: 'top' | 'right' | 'left' | 'cover' | 'none'
  }
  featured?: boolean
}>()

// Get author information and SEO data
const authors = vue.computed(() => props.post.authors?.value || [])
const publishDate = vue.computed(() => props.post.dateAt?.value || '')
const modifiedDate = vue.computed(() => props.post.updatedAt?.value || publishDate.value)
const categories = vue.computed(() => props.post.categories?.value || [])
const tags = vue.computed(() => props.post.tags?.value || [])
const isCoverLayout = vue.computed(() => props.config.imagePosition === 'cover')
const hasMedia = vue.computed(() => !!props.post.media?.value?.url && props.config.imagePosition !== 'none')

// Helper for layout position classes
const positionClasses = vue.computed(() => {
  const position = props.config.imagePosition || 'top'

  if (position === 'cover') {
    return {
      article: 'relative rounded-lg overflow-hidden min-h-[280px] @sm/post-item:min-h-[340px] @lg/post-item:min-h-[380px]',
      contentWrapper: 'z-10 relative h-full flex flex-col justify-end p-5 @sm/post-item:p-6 @lg/post-item:p-7',
      title: 'text-white mb-2 @sm/post-item:mb-3',
      excerpt: 'text-white/85 line-clamp-2 mb-3',
      meta: 'text-white/75',
    }
  }

  if (position === 'left' || position === 'right') {
    return {
      article: '',
      contentWrapper: `flex gap-5 @sm/post-item:gap-6 @lg/post-item:gap-7 ${position === 'left' ? '' : 'flex-row-reverse'}`,
      imageWrapper: 'flex-shrink-0 w-28 @sm/post-item:w-36 @lg/post-item:w-40',
      content: 'flex-grow min-w-0 py-1 flex flex-col',
      title: 'line-clamp-3',
      excerpt: 'text-theme-600 dark:text-theme-300 mb-auto',
      meta: 'text-theme-500',
    }
  }

  // Default (top)
  return {
    article: '',
    contentWrapper: '',
    imageWrapper: 'w-full',
    content: 'flex-grow pt-4 min-w-0 flex flex-col gap-2',
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
    class="@container/post-item h-full group/post-item transition-opacity duration-300 text-theme-800 dark:text-theme-100 hover:opacity-95"
    :class="positionClasses.article"
    :data-image-position="props.config.imagePosition"
    :data-featured="props.featured"
    :data-post-id="post.postId"
  >
    <!-- SEO metadata -->
    <meta itemprop="headline" :content="post.title.value">
    <meta itemprop="description" :content="post.subTitle?.value || ''">
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

    <!-- Cover layout with media -->
    <template v-if="isCoverLayout">
      <!-- Media background -->
      <div class="absolute inset-0 overflow-hidden">
        <XMedia
          v-if="hasMedia"
          :media="post.media.value"
          class="w-full h-full object-cover transition-transform duration-500 group-hover/post-item:scale-105"
          itemprop="image"
        />
        <div v-else class="w-full h-full bg-theme-800/80 flex items-center justify-center">
          <XIcon :media="{ class: 'i-tabler-article' }" class="size-12 text-theme-500" />
        </div>

        <!-- Gradient overlay for legibility -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>

      <!-- Content -->
      <div :class="positionClasses.contentWrapper">
        <h2 class="x-font-title font-semibold md:text-pretty text-lg tracking-tight @sm/post-item:text-xl @lg/post-item:text-2xl" :class="positionClasses.title">
          <XLink :href="post.href.value" itemprop="headline">
            {{ post.title.value || '(No Title)' }}
          </XLink>
        </h2>

        <p
          v-if="post.subTitle?.value"
          class="text-sm @sm/post-item:text-base @lg/post-item:text-lg leading-relaxed line-clamp-3 max-w-prose"
          :class="positionClasses.excerpt"
          itemprop="description"
        >
          {{ post.subTitle.value }}
        </p>

        <PostItemByline
          :post="post"
          :classes="{
            color: positionClasses.meta,
          }"
        />
        <PostItemMeta :post />
      </div>
    </template>

    <!-- Standard layouts (top, left, right) -->
    <div v-else :class="positionClasses.contentWrapper">
      <!-- Media or placeholder -->
      <div
        v-if="props.config.imagePosition !== 'none'"
        :class="positionClasses.imageWrapper"
      >
        <XLink
          :href="post.href.value"
          class="block aspect-[1.618/1] rounded-lg overflow-hidden hover:opacity-90 transition-opacity duration-100"
          aria-hidden="true"
        >
          <XMedia
            v-if="hasMedia"
            :media="post.media.value"
            class="w-full h-full object-cover"
            itemprop="image"
          />
          <div
            v-else
            class="w-full h-full bg-theme-100 dark:bg-theme-800 flex items-center justify-center text-theme-400 dark:text-theme-600"
          >
            <XIcon :media="{ class: 'i-tabler-article' }" class="size-8 lg:size-10" />
          </div>
        </XLink>
      </div>

      <!-- Content -->
      <div :class="positionClasses.content">
        <h2
          class="x-font-title font-semibold md:text-pretty text-lg line-clamp-2 @sm/post-item:text-xl @lg/post-item:text-2xl"
          :class="positionClasses.title"
        >
          <XLink :href="post.href.value" itemprop="headline" class="hover:opacity-90 transition-opacity duration-100">
            {{ post.title.value || '(No Title)' }}
          </XLink>
        </h2>

        <p
          v-if="post.subTitle?.value"
          class="text-sm @sm/post-item:text-base @lg/post-item:text-lg leading-relaxed line-clamp-3 max-w-prose"
          :class="positionClasses.excerpt"
          itemprop="description"
        >
          {{ post.subTitle.value }}
        </p>

        <div class="flex gap-6 items-center flex-wrap">
          <PostItemByline
            :post="post"
            :classes="{
              color: positionClasses.meta,
            }"
          />
          <PostItemMeta :post />
        </div>
      </div>
    </div>
  </article>
</template>
