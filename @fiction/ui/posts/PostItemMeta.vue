<script lang="ts" setup>
import type { Post } from '@fiction/posts'
import { dayjs, vue } from '@fiction/core'
import { countWords } from '@fiction/core/utils/wordCount'
import XIcon from '@fiction/ui/media/XIcon.vue'

defineOptions({ name: 'PostItemMeta' })

const props = defineProps<{
  post: Post
  colorClass?: string
  textSize?: string
  items?: ('date' | 'readTime' | 'author' | 'like' | 'comment' | 'share')[]
  likeCount?: number
  commentCount?: number
  isLiked?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:likeCount', count: number): void
  (e: 'comment'): void
  (e: 'share'): void
}>()

// Default to showing all items if not specified
const displayItems = vue.computed(() =>
  props.items || ['date', 'readTime', 'author', 'like', 'comment', 'share'],
)

// Format the date nicely
const formattedDate = vue.computed(() =>
  props.post.dateAt?.value ? dayjs(props.post.dateAt?.value).format('MMM D, YYYY') : '',
)

// Calculate read time
const readTime = vue.computed(() => {
  const wordCount = props.post.content?.value ? countWords(props.post.content.value) : 0
  return Math.ceil(wordCount / 225)
})

// Get author information
const authors = vue.computed(() => props.post.authors?.value || [])

// Default color and size classes if not provided
const metaColorClass = vue.computed(() => props.colorClass || 'text-theme-400')
const metaTextSize = vue.computed(() => props.textSize || 'text-xs @sm/post-item:text-sm')

function handleLike() {
  if (props.likeCount !== undefined) {
    emit('update:likeCount', props.isLiked ? props.likeCount - 1 : props.likeCount + 1)
  }
}

function handleComment() {
  emit('comment')
}

function handleShare() {
  // Get the current URL for sharing
  const url = typeof window !== 'undefined'
    ? window.location.origin + props.post.href.value
    : props.post.href.value

  // Copy to clipboard
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(url)
  }

  emit('share')
}
</script>

<template>
  <div
    class="flex flex-wrap items-center gap-x-5 gap-y-2 font-sans"
    :class="[metaColorClass, metaTextSize]"
  >
    <!-- Date -->
    <time
      v-if="displayItems.includes('date') && formattedDate"
      :datetime="post.dateAt?.value"
      class="flex items-center"
    >
      <XIcon :media="{ class: 'i-tabler-calendar' }" class="size-3.5 mr-1 opacity-75" />
      {{ formattedDate }}
    </time>

    <!-- Read time -->
    <span
      v-if="displayItems.includes('readTime') && readTime"
      class="flex items-center"
    >
      <XIcon :media="{ class: 'i-tabler-clock' }" class="size-3.5 mr-1 opacity-75" />
      {{ readTime }} min read
    </span>

    <!-- Author -->
    <div
      v-if="displayItems.includes('author') && authors.length"
      class="flex items-center"
    >
      <XIcon :media="{ class: 'i-tabler-user' }" class="size-3.5 mr-1 opacity-75" />
      <span>{{ authors[0].fullName }}</span>
      <span v-if="authors.length > 1" class="ml-1">+ {{ authors.length - 1 }}</span>
    </div>

    <!-- Like button -->
    <button
      v-if="displayItems.includes('like')"
      class="flex items-center transition-colors hover:text-primary-400 focus:outline-none"
      :class="{ 'text-primary-500': isLiked }"
      @click.prevent="handleLike"
    >
      <XIcon
        :media="{ class: isLiked ? 'i-tabler-heart-filled' : 'i-tabler-heart' }"
        class="size-3.5 mr-1"
      />
      <span v-if="likeCount" class="text-[10px] font-medium">{{ likeCount }}</span>
    </button>

    <!-- Comment link -->
    <button
      v-if="displayItems.includes('comment')"
      class="flex items-center transition-colors hover:text-primary-400 focus:outline-none"
      @click.prevent="handleComment"
    >
      <XIcon :media="{ class: 'i-tabler-message-circle-2' }" class="size-3.5 mr-1" />
      <span v-if="commentCount" class="text-[10px] font-medium">{{ commentCount }}</span>
    </button>

    <!-- Share button -->
    <button
      v-if="displayItems.includes('share')"
      class="flex items-center transition-colors hover:text-primary-400 focus:outline-none"
      @click.prevent="handleShare"
    >
      <XIcon :media="{ class: 'i-tabler-upload' }" class="size-3.5 mr-1" />
      <span class="sr-only">Share</span>
    </button>
  </div>
</template>
