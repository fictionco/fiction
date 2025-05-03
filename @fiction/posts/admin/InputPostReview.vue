<script lang="ts" setup>
import type { Post } from '../post'
import { vue } from '@fiction/core'
import XIcon from '@fiction/ui/media/XIcon.vue'

defineOptions({ name: 'PostReview' })

const props = defineProps<{
  post: Post
  recipientCount?: number
}>()

const hasNoEmailRecipients = vue.computed(() =>
  props.post.emailConfig?.value?.target === 'nobody' || !props.post.emailConfig?.value?.target,
)
</script>

<template>
  <div class="space-y-6">
    <!-- Distribution summary -->
    <div class="grid grid-cols-2 gap-4 border-t border-theme-200 dark:border-theme-700 py-4">
      <!-- Web publishing -->
      <div>
        <div class="text-sm text-theme-400 dark:text-theme-500 mb-1">
          Web
        </div>
        <div class="flex items-center gap-2">
          <XIcon
            :media="post.visibility.value === 'public' ? 'i-tabler-world' : 'i-tabler-lock'"
            class="text-cyan-500"
          />
          <span>{{ post.visibility.value === 'public' ? 'Public' : 'Private' }}</span>
        </div>
      </div>

      <!-- Email delivery -->
      <div>
        <div class="text-sm text-theme-400 dark:text-theme-500 mb-1">
          Email
        </div>
        <div class="flex items-center gap-2">
          <XIcon
            :media="hasNoEmailRecipients ? 'i-tabler-mail-off' : 'i-tabler-mail'"
            class="text-orange-500"
          />
          <span>
            {{ hasNoEmailRecipients ? 'Not sending' : recipientCount ? `${recipientCount} recipients` : 'All subscribers' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
