<script lang="ts" setup>
import type { Post } from '@fiction/posts'
import type { Card } from '@fiction/site'
import SidebarMediaItem from './SidebarMediaItem.vue'
import SidebarWidget from './SidebarWidget.vue'

const { posts } = defineProps<{
  card: Card
  posts: Post[]
}>()
</script>

<template>
  <SidebarWidget title="Related Articles">
    <div v-if="posts.length" class="space-y-4">
      <SidebarMediaItem
        v-for="(related, index) in posts"
        :key="index"
        class="group"
        :href="related.href.value"
        :title="related.title.value"
        :sub-title="related.subTitle.value || 'Related Post'"
      />
    </div>
    <div v-else class="text-theme-500 dark:text-theme-400 text-sm">
      No related articles found.
    </div>
  </SidebarWidget>
</template>
