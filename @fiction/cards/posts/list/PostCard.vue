// PostCard.vue - Reusable post card component
<script lang="ts" setup>
import type { Post } from '@fiction/posts'
import type { Card } from '@fiction/site'
import type { DisplayUserConfig } from './config'
import EffectGlare from '@fiction/ui/effect/EffectGlare.vue'
import XMedia from '@fiction/ui/media/XMedia.vue'
import CardLink from '../el/CardLink.vue'
import PostCardContent from './PostCardContent.vue'

defineProps<{
  card: Card<any>
  post?: Post
  display: DisplayUserConfig
  style?: Record<string, string>
}>()
</script>

<template>
  <CardLink
    v-if="post"
    :card="card"
    :href="post.href.value"
    class="group relative block"
    :style="style"
  >
    <EffectGlare wrap-class="rounded-[20px]" class="h-full">
      <XMedia
        :media="post.media.value"
        class="w-full h-full object-cover bg-theme-50 dark:bg-theme-700/70"
      />
      <PostCardContent :card="card" :post="post" :display="display" />
    </EffectGlare>
  </CardLink>
</template>
