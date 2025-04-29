<script lang="ts" setup>
import type { Post } from '@fiction/posts'
import { dayjs, vue } from '@fiction/core'
import { countWords } from '@fiction/core/utils/wordCount'
import XIcon from '@fiction/ui/media/XIcon.vue'
import XButton from '../buttons/XButton.vue'

defineOptions({ name: 'PostItemMeta' })

const props = defineProps<{
  post: Post
  items?: ('date' | 'author')[]
  classes: {
    color?: string
    hoverOnly?: string
  }
}>()

// Default to showing all items if not specified
const displayItems = vue.computed(() =>
  props.items || ['date', 'author', 'readTime'],
)

// Format the date nicely
const formattedDate = vue.computed(() =>
  props.post.dateAt?.value ? dayjs(props.post.dateAt.value).format('MMM D') : '',
)

// Get author information
const author = vue.computed(() => {
  const authors = props.post.authors?.value || []
  return authors.length ? authors[0].fullName : ''
})

// Additional authors count
const additionalAuthors = vue.computed(() => {
  const authors = props.post.authors?.value || []
  return authors.length > 1 ? authors.length - 1 : 0
})

// Default style classes
const metaColorClass = vue.computed(() => props.classes?.color || 'text-theme-400')

// Top metadata items with filtering
const topItems = vue.computed(() => {
  const items = []

  if (displayItems.value.includes('date') && formattedDate.value)
    items.push(formattedDate.value)

  if (displayItems.value.includes('author') && author.value) {
    const authorText = additionalAuthors.value
      ? `${author.value} +${additionalAuthors.value}`
      : author.value
    items.push(authorText)
  }

  return items.filter(Boolean)
})
</script>

<template>
  <div class="flex gap-6">
    <!-- Top metadata row with uppercase and middots -->
    <div v-if="topItems.length" class="flex items-center">
      <div
        class="text-[.8em] font-sans gap-2 flex whitespace-nowrap"
        :class="[metaColorClass]"
      >
        <template v-for="(item, index) in topItems" :key="index">
          <span>{{ item }}</span>
          <span v-if="index < topItems.length - 1">·</span>
        </template>
      </div>
    </div>
  </div>
</template>
