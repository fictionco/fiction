<script lang="ts" setup>
import type { Post } from '@fiction/posts'
import { vue } from '@fiction/core'
import XLink from '@fiction/ui/common/XLink.vue'
import XMedia from '@fiction/ui/media/XMedia.vue'
import XIcon from '../media/XIcon.vue'
import PostItemMeta from './PostItemMeta.vue'

defineOptions({ name: 'PostFeature' })

const { post, layout = 'left', aspectRatio = 'landscape', minHeight = 'min-h-[240px]' } = defineProps<{
  post: Post
  layout?: 'left' | 'right' | 'above'
  aspectRatio?: 'square' | 'landscape' | 'portrait' | 'ultrawide'
  minHeight?: string
}>()

// Dynamic classes based on layout
const containerClasses = vue.computed(() => {
  const baseClasses = 'grid w-full'
  const twoColumn = `md:grid-cols-2 md:items-center md:gap-8`

  switch (layout) {
    case 'left':
      return `${baseClasses} ${twoColumn}`
    case 'right':
      return `${baseClasses} ${twoColumn}`
    case 'above':
      return `${baseClasses} grid-cols-1 gap-6`
    default:
      return `${baseClasses} ${twoColumn}`
  }
})

// Image aspect ratio classes
const imageClasses = vue.computed(() => {
  const base = 'w-full object-cover rounded-lg overflow-hidden'

  const aspectClasses = {
    square: 'aspect-square',
    landscape: 'aspect-[1.618/1]',
    portrait: 'aspect-[3/4]',
    ultrawide: 'aspect-[21/9]',
  }

  return `${base} ${aspectClasses[aspectRatio]}`
})

// Image container order classes for left/right layouts
const imageOrderClass = vue.computed(() => {
  return (layout === 'right') ? 'md:order-2' : ''
})
</script>

<template>
  <article class="post-hero relative">
    <!-- Standard layouts (left, right, above) -->
    <div
      class="grid"
      :class="[containerClasses, minHeight]"
    >
      <!-- Image container -->
      <XLink
        :href="post.href.value"
        class="relative hover:opacity-90 transition-opacity duration-100"
        :class="[imageOrderClass]"
      >
        <XMedia v-if="post.media?.value?.url" :media="post.media.value" :class="imageClasses" />
        <div
          v-else
          :class="[imageClasses]"
        >
          <div class="w-full h-full bg-theme-100 bg-theme-800/80 flex items-center justify-center text-theme-400 dark:text-theme-700">
            <XIcon :media="{ class: 'i-tabler-pin' }" class="size-8 lg:size-10" />
          </div>
        </div>
      </XLink>

      <!-- Content container -->
      <div class="flex flex-col items-center justify-center text-center">
        <!-- Title -->
        <h2 class="x-font-title font-semibold text-theme-950 dark:text-theme-50 text-2xl md:text-3xl mb-4 line-clamp-3">
          <XLink
            :href="post.href.value"
            class="hover:opacity-90 transition-opacity duration-100"
          >
            {{ post.title.value }}
          </XLink>
        </h2>

        <!-- Excerpt -->
        <p
          v-if="(post.subTitle?.value || post.excerpt?.value)"
          class="text-theme-700 dark:text-theme-300 text-base mb-4 line-clamp-3"
        >
          {{ post.subTitle?.value || post.excerpt?.value }}
        </p>

        <!-- Meta information -->
        <PostItemMeta
          :post="post"
          class="mb-3"
          :classes="{ color: 'text-theme-500', textSize: 'text-sm' }"
        />
      </div>
    </div>
  </article>
</template>
