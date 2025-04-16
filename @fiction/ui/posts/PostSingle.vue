<script lang="ts" setup>
import type { Post } from '@fiction/posts'
import type { Card } from '@fiction/site'
import SiteText from '@fiction/cards/SiteText.vue'
import { dayjs, pathCheck, PostSchema as schema, vue } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue' // Assuming a minimal button component
import XMedia from '@fiction/ui/media/XMedia.vue'
import El404 from '@fiction/ui/page/El404.vue'
import XEntry from '@fiction/ui/prose/XEntry.vue'
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

const emit = defineEmits<{
  (e: 'update:likeCount', count: number): void
  (e: 'share'): void
}>()

const localLikeCount = vue.ref(props.likeCount ?? 42)
const localIsLiked = vue.ref(props.isLiked ?? false)

vue.watch(() => props.likeCount, (newVal) => {
  if (newVal !== undefined)
    localLikeCount.value = newVal
})

vue.watch(() => props.isLiked, (newVal) => {
  if (newVal !== undefined)
    localIsLiked.value = newVal
})

async function handleShare() {
  const url = window.location.href
  await navigator.clipboard.writeText(url)
  emit('share')
}
</script>

<template>
  <div v-if="card" class="font-sans @container/post">
    <!-- Loading Skeleton -->
    <div v-if="loading" class="pt-16 pb-32 animate-pulse" aria-hidden="true">
      <div class="max-w-[75ch] mx-auto space-y-6">
        <div class="w-36 h-12 bg-theme-100 dark:bg-theme-800 rounded mb-6" />
        <div class="w-3/4 h-24 bg-theme-100 dark:bg-theme-800 rounded mb-4" />
        <div class="w-1/2 h-8 bg-theme-100 dark:bg-theme-800 rounded mb-8" />
      </div>
    </div>

    <!-- Post Content -->
    <article v-else-if="post" class="mx-auto">
      <div>
        <!-- Post Title & Subtitle -->
        <SiteText
          v-model="post.config.value"
          :card
          tag="h1"
          :path="pathCheck('title', schema)"
          :post="post"
          class="text-3xl md:text-4xl xl:text-5xl font-bold x-font-title md:text-pretty !leading-[1.3]  mb-4"
        />
        <SiteText
          v-model="post.config.value"
          :card
          tag="h2"
          :path="pathCheck('subTitle', schema)"
          class="text-lg md:text-xl xl:text-2xl text-theme-500 dark:text-theme-400 md:text-pretty !leading-[1.3] mb-8"
        />

        <!-- Author, Date, and Actions -->
        <div class="flex items-center gap-4 mb-8 justify-between">
          <div v-if="post.authors?.value?.length">
            <XPostAuthor v-for="user in post.authors.value" :key="user.userId" :user />
          </div>
          <div class="flex gap-2">
            <XButton
              :icon="localIsLiked ? 'i-tabler-heart-filled' : 'i-tabler-heart'"
              theme="default"
              :label="localLikeCount.toString()"
            >
              {{ post.likeCount.value || 'Like' }}
            </XButton>
            <XButton
              icon="i-tabler-upload"
              theme="default"
              @click="handleShare"
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
          class="font-serif text-base md:text-xl"
          :theme="post.theme.value"
          :drop-cap="props.dropCap"
        >
          <SiteText
            v-model="post.config.value"
            :card
            :path="pathCheck('content', schema)"
          />
        </XEntry>
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
