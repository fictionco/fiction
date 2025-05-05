<script lang="ts" setup>
import type { Post } from '@fiction/posts'
import type { Card } from '@fiction/site'
import SiteText from '@fiction/cards/SiteText.vue'
import { pathCheck, PostSchema as schema, vue } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import XMedia from '@fiction/ui/media/XMedia.vue'
import El404 from '@fiction/ui/page/El404.vue'
import XEntry from '@fiction/ui/prose/XEntry.vue'
import PostItem from './PostItem.vue'
import XPostAuthor from './XPostAuthor.vue'

defineOptions({ name: 'SinglePost' })

const props = defineProps<{
  card?: Card
  loading?: boolean
  post?: Post
  likeCount?: number
  isLiked?: boolean
  dropCap?: boolean
}>()

const relatedPosts = vue.computed(() => {
  const related = []
  if (props.post?.relatedPosts.value.prev)
    related.push(props.post.relatedPosts.value.prev)
  if (props.post?.relatedPosts.value.next)
    related.push(props.post.relatedPosts.value.next)
  return related
})
</script>

<template>
  <div v-if="card" class="font-sans @container/post max-w-[850px] mx-auto">
    <!-- Loading Skeleton -->
    <div v-if="loading" class="pt-16 pb-32 animate-pulse" aria-hidden="true">
      <div class="max-w-[75ch] mx-auto space-y-6">
        <div class="w-36 h-12 bg-theme-100 dark:bg-theme-800 rounded mb-6" />
        <div class="w-3/4 h-24 bg-theme-100 dark:bg-theme-800 rounded mb-4" />
        <div class="w-1/2 h-8 bg-theme-100 dark:bg-theme-800 rounded mb-8" />
      </div>
    </div>

    <!-- Post Content -->
    <article v-else-if="post" class="mx-auto text-sm @[350px]/post:text-base @[700px]/post:text-[1.4em] @[900px]/post:text-[1.6em]">
      <div>
        <div class="space-y-[.5em] mb-[1.5em]">
          <SiteText
            v-model="post.config.value"
            :card
            tag="h1"
            :path="pathCheck('title', schema)"
            :post="post"
            class="text-3xl @[600px]/post:text-[1.8em] @[800px]/post:text-[2em] font-semibold x-font-title md:text-pretty !leading-[1.3] tracking-tight"
          />
          <SiteText
            v-model="post.config.value"
            :card
            tag="h2"
            :path="pathCheck('subTitle', schema)"
            class="text-lg @[600px]/post:text-[1.2em] @[800px]/post:text-[1.2em] text-theme-500 dark:text-theme-400 md:text-pretty !leading-[1.3]"
          />
        </div>

        <!-- Author, Date, and Actions -->
        <div class="flex items-center gap-4 mb-8 justify-between flex-wrap border-b border-theme-200 dark:border-theme-700 pb-8">
          <div v-if="post.authors?.value?.length" class="flex gap-6">
            <XPostAuthor v-for="user in post.authors.value" :key="user.userId" :user />
          </div>
          <div class="flex gap-2">
            <XButton
              :icon="props.post?.like.isLiked.value ? 'i-tabler-heart-filled' : 'i-tabler-heart'"
              :theme="props.post?.like.isLiked.value ? 'primary' : 'default'"
              @click="props.post?.like.toggle()"
            >
              {{ post.likeCount.value || 'Like' }}
            </XButton>
            <XButton
              icon="i-tabler-upload"
              theme="default"
              @click="post.copyLinkToClipboard()"
            >
              Share
            </XButton>
          </div>
        </div>

        <!-- Featured Image (if present) -->
        <div v-if="post.media?.value?.url" class="mb-12 rounded-md overflow-hidden aspect-video">
          <XMedia
            :media="post.media.value"
            class="w-full h-full object-cover"
            :animate="true"
          />
        </div>

        <!-- Content -->
        <XEntry
          class="font-serif"
          :theme="post.theme.value"
          :drop-cap="props.dropCap"
        >
          <SiteText
            v-model="post.config.value"
            :card
            :path="pathCheck('content', schema)"
          />
        </XEntry>

        <!-- Related Posts Section -->
        <div v-if="relatedPosts.length" class="mt-16 pb-8">
          <h3 class="text-xl font-semibold mb-6 text-theme-700 dark:text-theme-300 x-font-title">
            {{ relatedPosts.length > 1 ? 'Continue Reading' : (post.relatedPosts.value.prev ? 'Previous Post' : 'Next Post') }}
          </h3>

          <div class="grid gap-8 @[800px]/post:grid-cols-2">
            <PostItem
              v-for="relatedPost in relatedPosts"
              :key="relatedPost.postId"
              :post="relatedPost"
            />
          </div>
        </div>
      </div>
    </article>

    <El404 v-else title="Post Not Found" />
  </div>
</template>

<style scoped>
.with-drop-cap::first-letter {
  float: left;
  font-size: rem;
  line-height: 0.8;
  margin: 0.1em 0.1em 0 0;
  font-weight: 600;
}
</style>
