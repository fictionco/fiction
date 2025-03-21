<script lang="ts" setup>
import type { MediaObject, User } from '@fiction/core'
import { gravatarUrlSync, vue } from '@fiction/core'
import XMedia from '../media/XMedia.vue'

const { user, url = '', imageSize = 200 } = defineProps<{
  user?: User
  url?: string
  imageSize?: number
}>()

const media = vue.computed<MediaObject>(() => {
  let mediaUrl: string | undefined
  if (url) {
    mediaUrl = url
  }
  else if (user && user.avatar?.url) {
    mediaUrl = user.avatar.url
  }
  else if (user?.email) {
    const email = user?.email
    const g = gravatarUrlSync(email, { size: imageSize })
    mediaUrl = g.url
  }

  if (mediaUrl) {
    return { format: 'url', url: mediaUrl }
  }
  else {
    return {
      format: 'html',
      html: `
        <div class="flex items-center justify-center p-[15%]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M12 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10z"></path>
          <path d="M20 21a8 8 0 0 0-16 0"></path>
        </svg>
        </div>
      `,
    }
  }
})
</script>

<template>
  <div class="relative rounded-full overflow-hidden dark:bg-theme-800 bg-theme-100 text-theme-500 dark:text-theme-400">
    <XMedia
      class="absolute inset-0 overflow-hidden"
      :media="media"
    />
    <div
      class="absolute inset-0 z-10 mix-blend-overlay dark:mix-blend-difference pointer-events-none ring-2 ring-inset ring-black dark:ring-white rounded-full"
    />
  </div>
</template>
