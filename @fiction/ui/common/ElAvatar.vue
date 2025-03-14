<script lang="ts" setup>
import type { MediaObject, User } from '@fiction/core'
import { gravatarUrlSync, vue } from '@fiction/core'
import XMedia from '../media/XMedia.vue'
import userBlank from './user-blank.png'

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

  return { format: 'url', url: mediaUrl || userBlank }
})
</script>

<template>
  <XMedia class="rounded-full overflow-hidden dark:bg-theme-0/10" :media />
</template>
