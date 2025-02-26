<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { Post } from '../post.js'
import { dayjs, vue } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import ElBadge from '@fiction/ui/ElBadge.vue'
import XMedia from '@fiction/ui/media/XMedia.vue'
import PostPreview from './PostPreview.vue'

defineOptions({ name: 'PostOverview' })

const props = defineProps<{
  post?: Post
  card: Card
}>()

const emit = defineEmits<{
  (event: 'navigate', payload: { key: string }): void
}>()

// Calculate time since post was created or updated
const timeAgo = vue.computed(() => {
  if (!props.post)
    return ''
  const dateToUse = props.post.dateAt.value || props.post.settings.updatedAt
  return dateToUse ? dayjs(dateToUse).fromNow() : ''
})

// Determine post status for display
const statusInfo = vue.computed(() => {
  if (!props.post)
    return { label: '', color: '', icon: '' }

  const status = props.post.status.value

  switch (status) {
    case 'draft':
      return { label: 'Draft', color: 'blue', icon: 'i-tabler-pencil' }
    case 'scheduled':
      return { label: 'Scheduled', color: 'amber', icon: 'i-tabler-calendar-time' }
    case 'published':
      return { label: 'Published', color: 'emerald', icon: 'i-tabler-check' }
    default:
      return { label: status, color: 'gray', icon: 'i-tabler-info-circle' }
  }
})

// Calculate word count and reading time
const readingStats = vue.computed(() => {
  if (!props.post)
    return { words: 0, time: '0 min' }

  const wordCount = props.post.wordCount.value || 0
  const readingTime = Math.max(1, Math.round(wordCount / 200))

  return {
    words: wordCount,
    time: `${readingTime} min read`,
  }
})

const hasCategory = vue.computed(() => props.post?.categories.value?.length || 0)
const hasTags = vue.computed(() => props.post?.tags.value?.length || 0)
</script>

<template>
  <div v-if="post" class="max-w-screen-xl mx-auto my-8">
    <div class="flex flex-col space-y-6 ">
      <!-- Main content overview -->
      <div class="bg-theme-50 dark:bg-theme-800 rounded-lg p-6 lg:p-8 xl:p-14 border border-theme-200 dark:border-theme-600/70 shadow-sm">
        <div class="flex gap-6">
          <!-- Left column with primary info -->
          <div class="flex-grow space-y-6">
            <div>
              <h1 class="text-2xl font-semibold mb-1 text-balance">
                {{ post.title.value || 'Untitled Post' }}
              </h1>
              <p v-if="post.subTitle.value" class="text-theme-600 dark:text-theme-300 text-lg">
                {{ post.subTitle.value }}
              </p>
            </div>

            <div class="flex flex-wrap gap-4 items-center text-sm">
              <div class="flex items-center gap-1 text-theme-500">
                <i class="i-tabler-file-text" />
                <span>{{ readingStats.words }} words</span>
              </div>

              <div class="flex items-center gap-1 text-theme-500">
                <i class="i-tabler-clock" />
                <span>{{ readingStats.time }}</span>
              </div>

              <div v-if="post.visibility.value" class="flex items-center gap-1 text-theme-500">
                <i class="i-tabler-eye" />
                <span class="capitalize">{{ post.visibility.value }}</span>
              </div>

              <div v-if="hasCategory" class="flex items-center gap-1 text-theme-500">
                <i class="i-tabler-folder" />
                <span>{{ post.categories.value.length }} {{ post.categories.value.length === 1 ? 'category' : 'categories' }}</span>
              </div>

              <div v-if="hasTags" class="flex items-center gap-1 text-theme-500">
                <i class="i-tabler-tag" />
                <span>{{ post.tags.value.length }} {{ post.tags.value.length === 1 ? 'tag' : 'tags' }}</span>
              </div>
            </div>

            <div v-if="post.excerpt.value" class="prose dark:prose-invert">
              <p class="italic text-theme-600 dark:text-theme-300">
                {{ post.excerpt.value }}
              </p>
            </div>

            <div class="pt-4 flex flex-wrap gap-3">
              <XButton
                icon="i-tabler-settings"
                design="outline"
                size="sm"
                @click="emit('navigate', { key: 'compose' })"
              >
                Compose
              </XButton>

              <XButton
                icon="i-tabler-share"
                design="outline"
                size="sm"
                @click="emit('navigate', { key: 'share' })"
              >
                Share Options
              </XButton>
            </div>
          </div>

          <!-- Right column with media -->
          <div v-if="post.media.value?.url" class="w-40 h-40 shrink-0 rounded-md overflow-hidden border border-theme-200 dark:border-theme-700 shadow-sm">
            <XMedia
              :media="post.media.value"
              class="h-full w-full"
              image-mode="cover"
            />
          </div>
        </div>
      </div>

      <!-- Post preview -->
      <div class="pt-4 border-t border-theme-200 dark:border-theme-700">
        <h2 class="text-lg font-medium mb-4">
          Preview
        </h2>
        <PostPreview :post="post" :card="card" />
      </div>
    </div>
  </div>
</template>
