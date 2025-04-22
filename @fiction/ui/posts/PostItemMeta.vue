<script lang="ts" setup>
import type { NavList, NavListItem } from '@fiction/core'
import type { Post } from '@fiction/posts'
import { dayjs, vue } from '@fiction/core'
import { countWords } from '@fiction/core/utils/wordCount'
import XIcon from '@fiction/ui/media/XIcon.vue'

defineOptions({ name: 'PostItemMeta' })

const props = defineProps<{
  post: Post
  items?: ('date' | 'readTime' | 'author' | 'like' | 'comment' | 'share')[]
  classes: {
    color?: string
    hoverOnly?: string
    textSize?: string
  }
}>()

const emit = defineEmits<{
  (e: 'update:like'): void
  (e: 'comment'): void
  (e: 'share'): void
}>()

// Default to showing all items if not specified
const displayItems = vue.computed(() =>
  props.items || ['date', 'author', 'like', 'share'],
)

// Format the date nicely
const formattedDate = vue.computed(() =>
  props.post.dateAt?.value ? dayjs(props.post.dateAt.value).format('MMM D') : '',
)

// Calculate read time based on word count
const readTime = vue.computed(() => {
  const wordCount = props.post.content?.value ? countWords(props.post.content.value) : 0
  return Math.ceil(wordCount / 225)
})

// Get author information
const authors = vue.computed(() => props.post.authors?.value || [])

// Default style classes
const metaColorClass = vue.computed(() => props.classes?.color || 'text-theme-400')
const metaTextSize = vue.computed(() => props.classes?.textSize || 'text-xs @sm/post-item:text-sm')

// Configuration for top and bottom items
const itemsConfig = vue.computed<{ top: NavListItem[], bottom: NavListItem[] }>(() => ({
  top: [
    {
      key: 'date',
      isHidden: !displayItems.value.includes('date') || !formattedDate.value,
      label: formattedDate.value,
      icon: { class: 'i-tabler-calendar' },
    },
    {
      key: 'readTime',
      isHidden: !displayItems.value.includes('readTime') || !readTime.value,
      label: `${readTime.value} min`,
      icon: { class: 'i-tabler-clock' },
    },
    {
      key: 'author',
      isHidden: !displayItems.value.includes('author') || !authors.value.length,
      label: authors.value[0]?.fullName || '',
      icon: { class: 'i-tabler-user' },
      info: authors.value.length > 1 ? `+ ${authors.value.length - 1}` : undefined,
    },
  ],
  bottom: [
    {
      key: 'like',
      isHidden: !displayItems.value.includes('like'),
      label: props.post.likeCount.value ? String(props.post.likeCount.value) : '',
      icon: { class: props.post.like.isLiked.value ? 'i-tabler-heart-filled' : 'i-tabler-heart' },
      onClick: () => handleLike(),
    },
    {
      key: 'comment',
      isHidden: !displayItems.value.includes('comment'),
      label: props.post.commentCount.value ? String(props.post.commentCount.value) : '',
      icon: { class: 'i-tabler-message-circle-2' },
      onClick: () => handleComment(),
    },
    {
      key: 'share',
      isHidden: !displayItems.value.includes('share'),
      icon: { class: 'i-tabler-upload' },
      onClick: () => props.post.copyLinkToClipboard(),
      srLabel: 'Share',
    },
  ],
}))

async function handleLike() {
  try {
    await props.post.like.toggle()
    emit('update:like')
  }
  catch (error) {
    console.error('Error toggling like status', error)
  }
}

function handleComment() {
  emit('comment')
}
</script>

<template>
  <div class="flex gap-6">
    <div
      v-for="group in ['top', 'bottom']"
      :key="group"
      class="flex flex-wrap items-center gap-x-5 gap-y-2 font-sans"
      :class="[metaColorClass, metaTextSize]"
    >
      <button
        v-for="item in itemsConfig[group as 'top' | 'bottom'].filter(i => !i.isHidden)"
        :key="item.key"
        class="flex items-center transition-opacity"
        :class="[
          !!item.onClick ? 'cursor-pointer transition-colors hover:text-primary-400 focus:outline-none' : 'cursor-default',
          item.key === 'like' && props.post.like.isLiked.value ? 'text-primary-500 dark:text-primary-400' : '',
          group === 'bottom' ? props.classes?.hoverOnly : '',
        ]"
        @click.prevent="item.onClick && item.onClick({ item, event: $event })"
      >
        <XIcon
          v-if="item.icon"
          :media="item.icon"
          class="size-3.5 mr-1"
          :class="{ 'opacity-75': !item.onClick }"
        />
        <span v-if="item.label" class="text-sm font-normal">{{ item.label }}</span>
        <span v-if="item.info" class="ml-1">{{ item.info }}</span>
        <span v-if="item.srLabel" class="sr-only">{{ item.srLabel }}</span>
      </button>
    </div>
  </div>
</template>
