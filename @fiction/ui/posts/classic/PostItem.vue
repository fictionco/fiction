<script lang="ts" setup>
import type { Post } from '@fiction/posts'
import type { Card } from '@fiction/site'
import { vue } from '@fiction/core'
import XLink from '@fiction/ui/common/XLink.vue'
import XMedia from '@fiction/ui/media/XMedia.vue'
import XIcon from '../../media/XIcon.vue'
import PostItemMeta from './PostItemMeta.vue'

defineOptions({ name: 'PostItem' })

const props = defineProps<{
  post: Post
  config?: {
    imagePosition?: 'right' | 'left'
  }
  featured?: boolean
  card?: Card
}>()

// Get author information and SEO data
const authors = vue.computed(() => props.post.authors?.value || [])
const publishDate = vue.computed(() => props.post.dateAt?.value || '')
const modifiedDate = vue.computed(() => props.post.updatedAt?.value || publishDate.value)
const categories = vue.computed(() => props.post.categories?.value || [])
const tags = vue.computed(() => props.post.tags?.value || [])
const hasMedia = vue.computed(() => !!props.post.media?.value?.url)

// Helper for layout position classes
// const positionClasses = vue.computed(() => {
//   const position = props.config?.imagePosition || 'top'

//   return {
//     article: '',
//     contentWrapper: ` ${position === 'left' ? '' : 'flex-row-reverse'}`,
//     imageWrapper: '',
//     content: 'flex-grow min-w-0 py-1 flex flex-col justify-between gap-2',
//     title: 'line-clamp-3',
//     excerpt: 'text-theme-600 dark:text-theme-300 mb-auto',
//     meta: 'text-theme-500',
//   }
// })
</script>

<template>
  <article
    itemscope
    itemtype="https://schema.org/BlogPosting"
    class="@container/post-item h-full group/post-item transition-opacity duration-300 text-theme-800 dark:text-theme-100 hover:opacity-95"
    :data-image-position="props.config?.imagePosition"
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

    <!-- Standard layouts (top, left, right) -->
    <div class="text-base h-full @[600px]/post-item:text-[1.1em] @[700px]/post-item:text-[1.2em] flex flex-col gap-4 @[500px]/post-item:gap-12 @[500px]/post-item:flex-row-reverse">
      <div
        class="flex-shrink-0 w-full @[500px]/post-item:w-[33%]"
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
      <div class="flex-grow min-w-0 flex flex-col justify-between gap-6">
        <div class="flex flex-col gap-[.1em]">
          <h2
            class="line-clamp-3 leading-[1.3] @[700px]/post-item:leading-[1.4] x-font-title font-semibold text-[1.4em]"
          >
            <XLink :href="post.href.value" itemprop="headline" class="hover:opacity-90 transition-opacity duration-100">
              {{ post.title.value || '(No Title)' }}
            </XLink>
          </h2>

          <p
            v-if="post.subTitle?.value"
            class="text-[1.1em] leading-relaxed line-clamp-3 text-theme-600 dark:text-theme-300 mb-auto"
            itemprop="description"
          >
            {{ post.subTitle.value }}
          </p>
        </div>

        <div class="flex gap-6 items-center flex-wrap">
          <PostItemMeta :post class="text-theme-500 text-sm " />
        </div>
      </div>
    </div>
  </article>
</template>
