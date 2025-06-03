<script lang="ts" setup>
import type { Post, TableCommentConfig } from '@fiction/posts'
import type { Card } from '@fiction/site'
import { timeAgo, toHtml, useService, vue } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import XEntry from '@fiction/ui/prose/XEntry.vue'

defineOptions({ name: 'PostComments' })

const { post, comments = [], card } = defineProps<{
  post: Post
  comments?: TableCommentConfig[]
  card?: Card
}>()

const emit = defineEmits<{
  (event: 'addComment', payload: TableCommentConfig): void
  (event: 'deleteComment', commentId: string): void
}>()

const { fictionUser } = useService()

const newComment = vue.ref('')
const currentUser = vue.computed(() => fictionUser?.activeUser.value)
const activeContact = vue.computed(() => card?.site?.activeContact.value)

function canDelete(comment: TableCommentConfig): boolean {
  if (!currentUser.value)
    return false
  return comment.userId === currentUser.value.userId || ['admin', 'owner'].includes(currentUser.value.systemRole || '')
}

async function addComment() {
  if (!newComment.value.trim())
    return

  emit('addComment', {
    postId: post.postId,
    content: newComment.value.trim(),
    userId: activeContact.value?.userId || currentUser.value?.userId || '',
  })

  newComment.value = ''
}

async function renderMarkdown(content: string): Promise<string> {
  return await toHtml(content)
}

const renderedComments = vue.ref<Record<string, string>>({})

vue.watchEffect(async () => {
  for (const comment of comments) {
    if (comment.commentId && comment.content) {
      renderedComments.value[comment.commentId] = await renderMarkdown(comment.content)
    }
  }
})
</script>

<template>
  <section class="pt-8">
    <h3 class="text-lg font-medium text-theme-200 mb-8">
      {{ comments.length }} {{ comments.length === 1 ? 'Response' : 'Responses' }}
    </h3>

    <div class="space-y-12 mb-12">
      <article v-for="comment in comments" :key="comment.commentId" class="group">
        <div class="flex items-baseline gap-4 mb-3 text-theme-400 font-mono border-b border-theme-700 pb-2">
          <span class="text-theme-200 font-medium">{{ comment.user?.fullName || 'Anonymous' }}</span>
          <time>{{ timeAgo(comment.createdAt) }}</time>
          <button
            v-if="canDelete(comment)"
            class="ml-auto opacity-0 group-hover:opacity-100 text-theme-400 hover:text-red-400 transition-opacity"
            @click="emit('deleteComment', comment.commentId!)"
          >
            x
          </button>
        </div>
        <XEntry>
          <div
            class="pl-4 text-theme-100 leading-relaxed  max-w-none"
            v-html="renderedComments[comment.commentId!] || comment.content"
          />
        </XEntry>
      </article>
    </div>

    <div v-if="activeContact || currentUser" class="">
      <div class="flex gap-4 items-start">
        <div class="flex-1">
          <textarea
            v-model="newComment"
            placeholder="Add your response..."
            class="w-full p-3 bg-theme-900/50 border border-theme-100/10 rounded text-theme-100 placeholder-theme-400 resize-none focus:outline-none focus:border-theme-100/20 font-mono leading-relaxed"
            rows="3"
          />
        </div>
        <XButton
          size="md"
          theme="primary"
          rounding="md"
          :disabled="!newComment.trim()"
          @click="addComment"
        >
          Post
        </XButton>
      </div>
      <p class="text-xs text-theme-500 mt-2 font-mono">
        Markdown supported
      </p>
    </div>

    <div v-else class="border-t border-theme-100/10 pt-8 text-center">
      <p class="text-theme-400 font-mono text-sm">
        Sign in to join the conversation
      </p>
    </div>
  </section>
</template>

<style scoped>

</style>
