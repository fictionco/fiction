<script lang="ts" setup>
import type { Post } from '@fiction/posts'
import { vue } from '@fiction/core'
import XButton from '../buttons/XButton.vue'

defineOptions({ name: 'PostItemMeta' })

const props = defineProps<{
  post: Post
  items?: ('like' | 'comment' | 'share')[]
}>()

const emit = defineEmits<{
  (e: 'update:like'): void
  (e: 'comment'): void
}>()

// Default to showing all items if not specified
const displayItems = vue.computed(() =>
  props.items || ['like', 'share'],
)

// Action buttons for the bottom row
const actionButtons = vue.computed(() => [
  {
    key: 'like',
    show: displayItems.value.includes('like'),
    label: props.post.likeCount.value || 'Like',
    icon: props.post.like.isLiked.value ? 'i-tabler-heart-filled' : 'i-tabler-heart',
    action: handleLike,
    active: props.post.like.isLiked.value,
  },
  {
    key: 'comment',
    show: displayItems.value.includes('comment'),
    label: props.post.commentCount.value || '',
    icon: 'i-tabler-message-circle-2',
    action: () => emit('comment'),
  },
  {
    key: 'share',
    show: displayItems.value.includes('share'),
    icon: 'i-tabler-upload',
    action: () => props.post.copyLinkToClipboard(),
  },
].filter(btn => btn.show))

async function handleLike() {
  try {
    await props.post.like.toggle()
    emit('update:like')
  }
  catch (error) {
    console.error('Error toggling like status', error)
  }
}
</script>

<template>
  <div
    v-if="actionButtons.length"
    class="flex items-center gap-4"
  >
    <XButton
      v-for="btn in actionButtons"
      :key="btn.key"
      :theme="btn.active ? 'primary' : 'default'"
      :icon="btn.icon"
      design="link"
      size="sm"
      @click.prevent="btn.action"
    >
      {{ btn.label }}
    </XButton>
  </div>
</template>
