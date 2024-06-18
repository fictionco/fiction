<script lang="ts" setup>
import type { User } from '@fiction/core'
import { gravatarUrlSync, stored, vue } from '@fiction/core'
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

const src = vue.ref('')

vue.onMounted(() => {
  vue.watchEffect(async () => {
    if (props.url) {
      src.value = props.url
    }
    else if (user.value && user.value.avatar?.url) {
      src.value = user.value.avatar.url
    }
    else if (user.value?.email || props.email) {
      const email = user.value?.email ? user.value.email : props.email
      const g = gravatarUrlSync(email, { size: props.imageSize, default: 'identicon' })
      src.value = g.url ? g.url : userBlank
    }
    else {
      src.value = userBlank
    }
  })
})
</script>

<template>
  <div
    class="fiction-avatar avatar bg-cover bg-center relative overflow-hidden"
  >
    <img class="object-cover inset-0" :src="src">
  </div>
</template>
