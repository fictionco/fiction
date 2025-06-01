<script lang="ts" setup>
import type { Post } from '@fiction/posts'
import type { Card } from '@fiction/site'
import { vue } from '@fiction/core'
import XLink from '@fiction/ui/common/XLink.vue'
import XMedia from '@fiction/ui/media/XMedia.vue'
import XIcon from '../../media/XIcon.vue'
import PostItemMeta from './PostItemMeta.vue'

defineOptions({ name: 'PostFeature' })

const { post, card } = defineProps<{
  post: Post
  card?: Card
}>()

// Image aspect ratio using golden ratio proportions
const imageClasses = vue.computed(() => {
  return 'w-full h-full object-cover rounded-md overflow-hidden aspect-[1.618/1]'
})

const contextTitle = vue.computed(() => {
  const out = [post.isFeatured.value ? 'Featured' : 'Latest']

  const cat = post.categories.value?.[0]

  if (cat) {
    out.push(cat)
  }

  return out
})
</script>

<template>
  <article class="post-feature relative @container/feature">
    <div class="grid grid-cols-12 lg:gap-12 md:gap-8 gap-6">
      <!-- Image container with golden ratio proportions -->
      <div class="col-span-6">
        <XLink
          :card
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
      <div class="col-span-6 flex flex-col gap-8 justify-center text-base @[600px]/post-feature:text-[1.1em] @[700px]/post-feature:text-[1.2em]">
        <div class="flex flex-col gap-[.7em]">
          <!-- Category/tag if available -->
          <div
            v-if="contextTitle"
            class="text-md text-theme-600 dark:text-theme-500 flex gap-2"
          >
            <template v-for="(item, index) in contextTitle" :key="index">
              <span>{{ item }}</span>
              <span v-if="index < contextTitle.length - 1">·</span>
            </template>
          </div>
          <h2 class="!leading-[1.2] x-font-title font-semibold text-[2.2em] line-clamp-4 sm:text-pretty">
            <XLink
              :card
              :href="post.href.value"
              class="hover:text-theme-600 dark:hover:text-theme-200 transition-colors"
            >
              {{ post.title.value }}
            </XLink>
          </h2>

          <!-- Excerpt with proper spacing -->
          <p
            v-if="(post.subTitle?.value)"
            class="text-theme-700 dark:text-theme-300 line-clamp-2 md:line-clamp-3 text-[1.25em]"
          >
            {{ post.subTitle?.value }}
          </p>
        </div>

        <div class="flex gap-6 items-center">
          <PostItemMeta :post class="text-theme-500 text-[.9em]" />
        </div>
      </div>
    </div>
  </article>
</template>
