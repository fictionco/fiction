<script lang="ts" setup>
import type { Post } from '@fiction/posts'
import { toHtml, vue } from '@fiction/core'
import XButton from '../../buttons/XButton.vue'

defineOptions({ name: 'PostComments' })

const { post } = defineProps<{
  post: Post
}>()

const newComment = vue.ref('')
const comments = vue.ref([
  {
    id: '1',
    author: 'Sarah Chen',
    content: 'The golden ratio examples clarify these concepts beautifully. Thank you for sharing.',
    date: '2h',
  },
  {
    id: '2',
    author: 'Marcus Wilson',
    content: 'This perspective aligns with our design system work. Elegant approach.',
    date: '4h',
  },
])

async function addComment() {
  if (!newComment.value.trim())
    return

  const htmlContent = await toHtml(newComment.value)

  comments.value.unshift({
    id: String(Date.now()),
    author: 'You',
    content: htmlContent,
    date: 'now',
  })

  newComment.value = ''
}
</script>

<template>
  <section class="mt-16 pt-8">
    <!-- Comments List -->
    <div class="space-y-12 mb-12">
      <article
        v-for="comment in comments"
        :key="comment.id"
        class="lg:text-2xl"
      >
        <div class="flex items-baseline gap-4 mb-3 text-sm text-theme-400 font-mono border-b border-theme-700 pb-2">
          <span class="text-theme-200 font-medium">{{ comment.author }}</span>
          <time>{{ comment.date }}</time>
        </div>
        <div
          class="text-theme-100 prose-comment"
          v-html="comment.content"
        />
      </article>
    </div>

    <!-- Comment Form -->
    <div class="flex border-t border-theme-700 pt-8 gap-4 items-start">
      <textarea
        v-model="newComment"
        placeholder="Your thoughts..."
        class="w-full p-0 bg-transparent border-none resize-none focus:outline-none text-xl leading-relaxed text-theme-100 placeholder-theme-500 font-mono"
        rows="4"
      />
      <div>
        <XButton
          size="lg"
          theme="default"
          :disabled="!newComment.trim()"
          icon-after="i-tabler-arrow-up"
          @click="addComment"
        >
          Add Response
        </XButton>
      </div>
    </div>
  </section>
</template>
