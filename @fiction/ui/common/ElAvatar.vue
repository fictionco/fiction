<script lang="ts" setup>
import { gravatarUrlSync, stored, vue } from '@fiction/core'
import type { MediaObject, User } from '@fiction/core'
import ElImage from '../media/ElImage.vue'
import userBlank from './user-blank.png'

const props = defineProps({
  userId: { type: String, default: '' },
  url: { type: String, default: '' },
  email: { type: String, default: '' },
  imageSize: { type: Number, default: 200 },
})

const user = vue.computed<User | undefined>(() => {
  if (!props.userId)
    return undefined
  return stored(props.userId) ?? undefined
})

const media = vue.computed<MediaObject>(() => {
  let url: string | undefined
  if (props.url) {
    url = props.url
  }
  else if (user.value && user.value.avatar?.url) {
    url = user.value.avatar.url
  }
  else if (user.value?.email || props.email) {
    const email = user.value?.email ? user.value.email : props.email
    const g = gravatarUrlSync(email, { size: props.imageSize, default: 'identicon' })
    url = g.url
  }

  if (url) {
    return { format: 'url', url }
  }
  else {
    return { format: 'url', url: userBlank }
  }
})
</script>

<template>
  <ElImage class="rounded-full overflow-hidden dark:bg-theme-0/10" :media />
</template>
