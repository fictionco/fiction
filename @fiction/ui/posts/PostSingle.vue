<script lang="ts" setup>
import type { Post } from '@fiction/posts'
import type { Card } from '@fiction/site'
import SiteText from '@fiction/cards/SiteText.vue'
import { dayjs, pathCheck, PostSchema as schema, vue } from '@fiction/core'

import XMedia from '@fiction/ui/media/XMedia.vue'
import El404 from '@fiction/ui/page/El404.vue'
import XEntry from '@fiction/ui/prose/XEntry.vue'
import { getColorThemeStyles } from '@fiction/ui/utils'
import PostItemMeta from './PostItemMeta.vue'

defineOptions({ name: 'SinglePost' })

const props = defineProps<{
  card?: Card
  loading?: boolean
  post?: Post
  nextPost?: Post
  likeCount?: number
  commentCount?: number
  isLiked?: boolean
  dropCap?: boolean
  showSocial?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:likeCount', count: number): void
  (e: 'comment'): void
  (e: 'share'): void
}>()

const singlePostEl = vue.ref<HTMLElement>()

const themeStyle = vue.computed(() => {
  return getColorThemeStyles(props.post?.theme.value)
})

const localLikeCount = vue.ref(props.likeCount ?? 42)
const localCommentCount = vue.ref(props.commentCount ?? 7)
const localIsLiked = vue.ref(props.isLiked ?? false)

// Update local refs when props change
vue.watch(() => props.likeCount, (newVal) => {
  if (newVal !== undefined)
    localLikeCount.value = newVal
})

vue.watch(() => props.commentCount, (newVal) => {
  if (newVal !== undefined)
    localCommentCount.value = newVal
})

vue.watch(() => props.isLiked, (newVal) => {
  if (newVal !== undefined)
    localIsLiked.value = newVal
})

function handleLikeUpdate(count: number) {
  localLikeCount.value = count
  localIsLiked.value = !localIsLiked.value
  emit('update:likeCount', count)
}

function handleComment() {
  // Scroll to comments or open comment form
  console.warn('Opening comment form...')
  emit('comment')
}

function handleShare() {
  // Handle successful sharing
  console.warn('Post shared!')
  emit('share')
}
</script>

<template>
  <div v-if="card" ref="singlePostEl">
    <!-- Loading Skeleton -->
    <div
      v-if="loading"
      class="pt-24 pb-40 animate-pulse"
      aria-hidden="true"
    >
      <div class="max-w-[850px] mx-auto px-5 sm:px-8">
        <div class="w-24 h-5 bg-theme-100 dark:bg-theme-800 rounded mb-8" />
        <div class="w-3/4 h-12 bg-theme-100 dark:bg-theme-800 rounded mb-4" />
        <div class="w-2/3 h-8 bg-theme-100 dark:bg-theme-800 rounded mb-8" />
        <div class="flex gap-4 mb-12">
          <div class="w-10 h-10 rounded-full bg-theme-100 dark:bg-theme-800" />
          <div class="space-y-2">
            <div class="w-36 h-4 bg-theme-100 dark:bg-theme-800 rounded" />
            <div class="w-24 h-3 bg-theme-100 dark:bg-theme-800 rounded" />
          </div>
        </div>
        <div class="w-full aspect-video bg-theme-100 dark:bg-theme-800 rounded-lg mb-12" />
        <div class="space-y-4">
          <div class="w-full h-4 bg-theme-100 dark:bg-theme-800 rounded" />
          <div class="w-full h-4 bg-theme-100 dark:bg-theme-800 rounded" />
          <div class="w-2/3 h-4 bg-theme-100 dark:bg-theme-800 rounded" />
        </div>
      </div>
    </div>

    <!-- Post Content -->
    <article v-else-if="post" class="px-5 sm:px-8 @container/prose max-w-[850px] mx-auto">
      <div class="my-[clamp(2rem,5vw,4rem)]">
        <!-- Post Meta Top -->
        <div class="flex justify-between items-center mb-6">
          <div
            class="text-sm text-theme-400"
          >
            {{ dayjs(post.dateAt.value || post.publishAt.value).format('MMMM D, YYYY') }}
          </div>

          <!-- Social Actions -->
          <PostItemMeta
            v-if="showSocial !== false"
            :post="post"
            :like-count="localLikeCount"
            :comment-count="localCommentCount"
            :is-liked="localIsLiked"
            :items="['like', 'comment', 'share']"
            @update:like-count="handleLikeUpdate"
            @comment="handleComment"
            @share="handleShare"
          />
        </div>

        <!-- Post Title & Subtitle -->
        <div class="space-y-4 mb-8">
          <SiteText
            v-model="post.config.value"
            :card
            tag="h1"
            :path="pathCheck('title', schema)"
            :post="post"
            class="text-2xl md:text-3xl lg:text-4xl font-semibold x-font-title text-balance leading-tight"
          />
          <SiteText
            v-model="post.config.value"
            :card
            tag="h2"
            :path="pathCheck('subTitle', schema)"
            class="text-lg md:text-xl lg:text-2xl dark:text-theme-400 text-balance leading-snug"
          />
        </div>

        <!-- Author Info -->
        <div v-if="post.authors?.value?.length" class="flex items-center gap-8">
          <div
            v-for="(author, i) in post.authors.value"
            :key="i"
            class="text-base flex gap-4 items-center mt-2 not-prose"
          >
            <div class="size-10 rounded-full ring-1 ring-white/30 overflow-hidden bg-theme-100 dark:bg-theme-800">
              <img
                v-if="author.avatar?.url"
                :src="author.avatar.url"
                :alt="author.fullName || ''"
                class="size-full object-cover"
              >
              <div
                v-else
                class="size-full flex items-center justify-center text-theme-500 dark:text-theme-400"
              >
                <div class="i-tabler-user text-xl" />
              </div>
            </div>
            <div class="text-left space-y-1">
              <div class="font-bold text-base leading-tight">
                {{ author.fullName || author.email?.split('@')[0] }}
              </div>
              <div
                class="text-sm text-theme-400"
              >
                {{ author.title || author.email }}
              </div>
            </div>
          </div>
          <div class="flex-grow h-px bg-theme-700/70" />
        </div>
      </div>

      <!-- Featured Image -->
      <div
        v-if="post.media?.value?.url"
        class="relative mb-[clamp(2rem,5vw,4rem)] overflow-hidden rounded-lg aspect-video"
      >
        <XMedia
          :media="post.media.value"
          class="w-full h-full object-cover"
          :animate="true"
        />
      </div>

      <!-- Content -->
      <div class="max-w-[75ch] mx-auto">
        <XEntry
          :theme="post.theme.value"
          :class="{ 'with-drop-cap': dropCap }"
        >
          <SiteText
            v-model="post.config.value"
            :card
            :path="pathCheck('content', schema)"
            class="text-base @[500px]/prose:text-lg"
          />
        </XEntry>

        <!-- Bottom Meta -->
        <div v-if="showSocial !== false" class="mt-16 pt-6 border-t border-theme-200 dark:border-theme-800 flex justify-between items-center">
          <div
            class="font-medium text-sm text-theme-300"
          >
            {{ dayjs(post.dateAt.value || post.publishAt.value).format('MMMM D, YYYY') }}
          </div>

          <PostItemMeta
            :post="post"
            :like-count="localLikeCount"
            :comment-count="localCommentCount"
            :is-liked="localIsLiked"
            :items="['like', 'comment', 'share']"
            @update:like-count="handleLikeUpdate"
            @comment="handleComment"
            @share="handleShare"
          />
        </div>
      </div>
    </article>

    <El404
      v-else
      title="Post Not Found"
    />
  </div>
</template>
