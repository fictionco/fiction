<script lang="ts" setup>
import type { MediaObject, Organization, User } from '@fiction/core'
import { gravatarUrlSync, vue } from '@fiction/core'
import XMedia from '../media/XMedia.vue'

defineOptions({ name: 'ElAvatar' })

const {
  user,
  org,
  url = '',
  imageSize = 200,
} = defineProps<{
  user?: User
  org?: Organization
  url?: string
  imageSize?: number
}>()

const mediaUrl = vue.computed(() => {
  if (url) {
    return url
  }
  else if (org && org.avatar?.url) {
    return org.avatar.url
  }
  else if (user && user.avatar?.url) {
    return user.avatar.url
  }
  else if (user?.email) {
    const email = user?.email
    const g = gravatarUrlSync(email, { size: imageSize })
    return g.url
  }
  return undefined
})

const media = vue.computed<MediaObject>(() => {
  const url = mediaUrl.value
  if (url) {
    return { url }
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
  <div class="relative rounded-full overflow-hidden dark:bg-theme-800 bg-theme-100 text-theme-500 dark:text-theme-400 select-none">
    <XMedia
      class="absolute inset-0 overflow-hidden"
      :media="media"
    />
    <div
      class="absolute inset-0 z-10 pointer-events-none ring-[.1em] ring-inset rounded-full"
      :class="mediaUrl ? 'ring-white' : 'ring-theme-400'"
    />
  </div>
</template>
