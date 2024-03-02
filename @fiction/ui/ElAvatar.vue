<script lang="ts" setup>
import type { PublicUser } from '@fiction/core'
import { stored, vue } from '@fiction/core'
import gravatarUrl from 'gravatar-url'
import userBlank from './img/user-blank.png'

const props = defineProps({
  userId: { type: String, default: '' },
  url: { type: String, default: '' },
  email: { type: String, default: '' },
  imageSize: { type: Number, default: 200 },
})
const user = vue.computed<PublicUser | undefined>(() => {
  if (!props.userId)
    return undefined
  return stored(props.userId) ?? undefined
})

const src = vue.computed<string>(() => {
  if (props.url) {
    return props.url
  }
  else if (user.value && user.value.avatar) {
    return user.value.avatar
  }
  else if (user.value || props.email) {
    const email = user.value ? user.value.email : props.email
    return (
      gravatarUrl(email, { size: props.imageSize, default: 'identicon' }) || ''
    )
  }
  else {
    return userBlank
  }
})
</script>

<template>
  <div
    class="factor-avatar avatar bg-cover bg-center relative overflow-hidden"
  >
    <img class="object-cover inset-0" :src="src">
  </div>
</template>
