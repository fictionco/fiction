<script lang="ts" setup>
import type { NavListItem } from '@fiction/core'
import type { Post } from '@fiction/posts'
import { dayjs, vue } from '@fiction/core'
import { countWords } from '@fiction/core/utils/wordCount'
import XIcon from '@fiction/ui/media/XIcon.vue'

defineOptions({ name: 'PostItemMeta' })

const props = defineProps<{
  post: Post
  items?: ('date' | 'readTime' | 'author' | 'like' | 'comment' | 'share')[]
  likeCount?: number
  commentCount?: number
  isLiked?: boolean
  classes: {
    color?: string
    hoverOnly?: string
    textSize?: string
  }
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
  props.post.dateAt?.value ? dayjs(props.post.dateAt.value).format('MMM D') : '',
)

// Calculate read time
const readTime = vue.computed(() => {
  const wordCount = props.post.content?.value ? countWords(props.post.content.value) : 0
  return Math.ceil(wordCount / 225)
})

// Get author information
const authors = vue.computed(() => props.post.authors?.value || [])

// Default color and size classes if not provided
const metaColorClass = vue.computed(() => props.classes?.color || 'text-theme-400')
const metaTextSize = vue.computed(() => props.classes?.textSize || 'text-xs @sm/post-item:text-sm')

// Generate the meta items as NavListItem objects
const metaItems = vue.computed(() => {
  const items: NavListItem[] = []

  if (displayItems.value.includes('date') && formattedDate.value) {
    items.push({
      label: formattedDate.value,
      icon: { class: 'i-tabler-calendar' },
      key: 'date',
      dateAt: props.post.dateAt?.value,
    })
  }

  if (displayItems.value.includes('readTime') && readTime.value) {
    items.push({
      label: `${readTime.value} min`,
      icon: { class: 'i-tabler-clock' },
      key: 'readTime',
    })
  }

  if (displayItems.value.includes('author') && authors.value.length) {
    items.push({
      label: authors.value[0].fullName || '',
      icon: { class: 'i-tabler-user' },
      key: 'author',
      info: authors.value.length > 1 ? `+ ${authors.value.length - 1}` : undefined,
    })
  }

  if (displayItems.value.includes('like')) {
    items.push({
      className: props.classes?.hoverOnly,
      label: props.likeCount ? String(props.likeCount) : '',
      icon: { class: props.isLiked ? 'i-tabler-heart-filled' : 'i-tabler-heart' },
      key: 'like',
      onClick: () => handleLike(),
    })
  }

  if (displayItems.value.includes('comment')) {
    items.push({
      className: props.classes?.hoverOnly,
      label: props.commentCount ? String(props.commentCount) : '',
      icon: { class: 'i-tabler-message-circle-2' },
      key: 'comment',
      onClick: () => handleComment(),
    })
  }

  if (displayItems.value.includes('share')) {
    items.push({
      className: props.classes?.hoverOnly,
      icon: { class: 'i-tabler-upload' },
      key: 'share',
      onClick: () => handleShare(),
    })
  }

  return items
})

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
    <button
      v-for="item in metaItems"
      :key="item.key"
      class="flex items-center transition-opacity"
      :class="[
        !!item.onClick ? 'cursor-pointer transition-colors hover:text-primary-400 focus:outline-none' : 'cursor-default',
        item.key === 'like' && isLiked ? 'text-primary-500' : '',
        item.className,
      ]"
      @click.prevent="item.onClick && item.onClick({})"
    >
      <XIcon
        v-if="item.icon"
        :media="item.icon"
        class="size-3.5 mr-1"
        :class="{ 'opacity-75': !item.onClick }"
      />
      <span v-if="item.label" class="text-xs font-medium">{{ item.label }}</span>
      <span v-if="item.info" class="ml-1">{{ item.info }}</span>
      <span v-if="item.key === 'share'" class="sr-only">Share</span>
    </button>
  </div>
</template>
