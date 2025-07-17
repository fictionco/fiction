<script lang="ts" setup>
import type { Post } from '@fiction/posts'
import XLink from '@fiction/ui/common/XLink.vue'
import XMedia from '@fiction/ui/media/XMedia.vue'
import PostItemMeta from './PostItemMeta.vue'

defineOptions({ name: 'PostHero' })

const props = defineProps<{
  post: Post
  layout?: 'left' | 'right' | 'above' | 'cover'
}>()
</script>

<template>
  <article
    class="hero-post group/post-item relative rounded-xl overflow-hidden h-[24rem] md:h-[32rem]"
  >
    <!-- Media background -->
    <div class="absolute inset-0 w-full h-full bg-theme-800/50">
      <template v-if="post.media?.value?.url">
        <XMedia
          :media="post.media.value"
          class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <!-- Gradient overlay for legibility -->
        <div class="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/10" />
      </template>
    </div>

    <!-- Content -->
    <div class="absolute inset-0 flex items-end p-6 md:p-8 lg:p-10">
      <div class="max-w-3xl">
        <!-- Meta information -->

        <!-- Title -->
        <h2 class="x-font-title font-semibold text-white text-2xl md:text-3xl lg:text-4xl mb-4">
          <XLink :href="post.href.value" class="text-white hover:text-white focus:outline-none">
            {{ post.title.value }}
          </XLink>
        </h2>

        <!-- Excerpt -->
        <p
          v-if="post.subTitle?.value"
          class="text-white/90 text-base md:text-lg mb-6 line-clamp-3 max-w-2xl"
        >
          {{ post.subTitle?.value }}
        </p>

        <PostItemMeta
          :post="post"
          class="mb-4"
          :classes="{
            color: 'text-white/75',
            hoverOnly: 'opacity-0 group-hover/post-item:opacity-100',
            textSize: 'text-xs @sm/post-item:text-sm',
          }"
        />
      </div>
    </div>
  </article>
</template>
