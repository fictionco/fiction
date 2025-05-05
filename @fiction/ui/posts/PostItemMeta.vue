<script lang="ts" setup>
import type { Post } from '@fiction/posts'
import { dayjs, vue } from '@fiction/core'
import XIcon from '../media/XIcon.vue'

defineOptions({ name: 'PostItemMeta' })

const props = defineProps<{
  post: Post
}>()

// Format the date nicely
const formattedDate = vue.computed(() =>
  props.post.dateAt?.value ? dayjs(props.post.dateAt.value).format('MMM D') : '',
)

// Get author information
const author = vue.computed(() => {
  const authors = props.post.authors?.value || []
  return authors.length ? authors[0].fullName : ''
})

const items = vue.computed(() => [
  {
    key: 'author',
    label: author.value,
    show: !!author.value,
  },
  {
    key: 'date',
    label: formattedDate.value,
    show: !!formattedDate.value,
  },
  {
    key: 'like',
    label: props.post.likeCount.value || '',
    icon: { class: props.post.like.isLiked.value ? 'i-tabler-heart-filled' : 'i-tabler-heart' },
    className: `cursor-pointer hover:opacity-80 ${props.post.like.isLiked.value ? 'text-primary-400' : ''}`,
    action: () => props.post.like.toggle(),
    active: props.post.like.isLiked.value,
    show: true,
  },
].filter(item => item.show))
</script>

<template>
  <div
    v-if="items.length"
    class="flex items-center justify-between gap-[.8em]"
  >
    <template v-for="(item, i) in items" :key="item.key">
      <div
        design="link"
        :icon="item.icon"
        class="flex items-center gap-0.5"
        :class="item.className"
        @click="item.action?.()"
      >
        <XIcon v-if="item.icon" class="size-[1em]" :media="item.icon" />
        <span class=" whitespace-nowrap truncate select-none">{{ item.label }}</span>
      </div>
      <span v-if="i < items.length - 1" class="opacity-80">·</span>
    </template>
  </div>
</template>
