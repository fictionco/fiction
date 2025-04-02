<script lang="ts" setup>
import type { MediaObject } from '@fiction/core/index.js'
import { dayjs } from '@fiction/core/index.js'

type EmailSettings = {
  senderName?: string
  senderEmail?: string
  subject?: string
  preview?: string
  avatar?: MediaObject
  dateAt?: string
}

const { emailBar } = defineProps<{
  emailBar?: EmailSettings
}>()
</script>

<template>
  <div v-if="emailBar" class="p-4 @[700px]/frame:p-6 space-y-6 border-b border-theme-200 dark:border-theme-600">
    <div class="flex flex-col">
      <span class="@[700px]/frame:text-xl text-lg">{{ emailBar.subject }}</span>
      <span v-if="emailBar.preview" class="text-sm lg:text-base text-theme-500 truncate">{{ emailBar.preview }}</span>
    </div>
    <div class="flex items-center gap-3 ">
      <img
        v-if="emailBar.avatar?.url"
        :src="emailBar.avatar.url"
        class="size-8 rounded-full"
        :alt="emailBar.senderName"
      >
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <span class="font-medium truncate">{{ emailBar.senderName || 'No Sender' }}</span>
            <span class="text-theme-500 truncate">&lt;{{ emailBar.senderEmail || 'no-reply@fiction.com' }}&gt;</span>
          </div>
        </div>
      </div>
      <div v-if="emailBar.dateAt">
        {{ dayjs(emailBar.dateAt).format('MMM D, YYYY h:mm A') }}
      </div>
    </div>
  </div>
</template>
