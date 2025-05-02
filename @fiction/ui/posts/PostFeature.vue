<script lang="ts" setup>
import type { Post } from '@fiction/posts'
import { vue } from '@fiction/core'
import XLink from '@fiction/ui/common/XLink.vue'
import XMedia from '@fiction/ui/media/XMedia.vue'
import XIcon from '../media/XIcon.vue'
import PostItemByline from './PostItemByline.vue'
import PostItemMeta from './PostItemMeta.vue'

defineOptions({ name: 'PostFeature' })

const { post, layout = 'left', aspectRatio = 'landscape' } = defineProps<{
  post: Post
  layout?: 'left' | 'right' | 'above'
  aspectRatio?: 'square' | 'landscape' | 'portrait' | 'ultrawide'
}>()

// Container layout based on golden ratio principles
const containerClasses = vue.computed(() => {
  const baseClasses = 'flex flex-col gap-6 lg:gap-8'

  switch (layout) {
    case 'left':
      return `${baseClasses} @[800px]/post-feature:flex-row @[800px]/post-feature:gap-12`
    case 'right':
      return `${baseClasses} @[800px]/post-feature:flex-row-reverse @[800px]/post-feature:gap-12`
    case 'above':
      return `${baseClasses} gap-5`
    default:
      return `${baseClasses} md:flex-row md:gap-8`
  }
})

// Image aspect ratio using golden ratio proportions
const imageClasses = vue.computed(() => {
  const base = 'w-full h-full object-cover rounded-md overflow-hidden'

  const aspectClasses = {
    square: 'aspect-square',
    landscape: 'aspect-[1.618/1]', // Golden ratio
    portrait: 'aspect-[0.618/1]', // Inverse golden ratio
    ultrawide: 'aspect-[1.618/0.618]', // Golden ratio squared
  }

  return `${base} ${aspectClasses[aspectRatio]}`
})

// Content proportions based on golden ratio
const contentClass = vue.computed(() => {
  if (layout === 'above')
    return 'w-full'

  return 'w-full @[800px]/post-feature::w-[38.2%]' // Golden ratio proportion
})

// Image container proportions based on golden ratio
const imageContainerClass = vue.computed(() => {
  if (layout === 'above')
    return 'w-full'

  return 'w-full @[800px]/post-feature::w-[61.8%]' // Inverse golden ratio proportion
})
</script>

<template>
  <article class="post-feature relative @container/post-feature">
    <div
      :class="containerClasses"
    >
      <!-- Image container with golden ratio proportions -->
      <div :class="imageContainerClass">
        <XLink
          :href="post.href.value"
          class="block h-full overflow-hidden rounded-lg transition-transform duration-300 hover:brightness-105"
        >
          <XMedia
            v-if="post.media?.value?.url"
            :media="post.media.value"
            :class="imageClasses"
          />
          <div
            v-else
            class="bg-theme-100 dark:bg-theme-600/20 text-theme-400 dark:text-theme-500/50 flex items-center justify-center"
            :class="[imageClasses]"
          >
            <XIcon :media="{ class: 'i-tabler-photo-off' }" class="size-8 " />
          </div>
        </XLink>
      </div>

      <!-- Content container with golden ratio spacing -->
      <div class="flex flex-col justify-center" :class="[contentClass]">
        <!-- Category/tag if available -->
        <div
          v-if="post.categories?.value?.length"
          class="text-xs font-medium text-primary-600 dark:text-primary-400 mb-2"
        >
          {{ post.categories.value[0] }}
        </div>

        <!-- Title with proper rhythm -->
        <h2 class="!leading-[1.2] x-font-title font-semibold text-theme-950 dark:text-theme-50 text-2xl @[600px]/post-feature:text-3xl @[700px]/post-feature:text-4xl mb-3 line-clamp-2 sm:text-pretty">
          <XLink
            :href="post.href.value"
            class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            {{ post.title.value }}
          </XLink>
        </h2>

        <!-- Excerpt with proper spacing -->
        <p
          v-if="(post.subTitle?.value)"
          class="text-theme-700 dark:text-theme-300 mb-4 line-clamp-2 md:line-clamp-3"
        >
          {{ post.subTitle?.value }}
        </p>

        <div class="flex gap-6 items-center">
          <PostItemByline
            :post="post"
            :classes="{
              color: 'text-theme-500 dark:text-theme-400',
            }"
          />
          <PostItemMeta :post />
        </div>
      </div>
    </div>
  </article>
</template>
