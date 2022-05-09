<template>
  <div
    class="factor-avatar avatar bg-cover bg-center"
    :style="{ backgroundImage: `url(${src})` }"
    :data-test="src"
  />
</template>
<script lang="ts" setup>
import { stored, PublicUser, vue } from "@factor/api"
import gravatarUrl from "gravatar-url"

const props = defineProps({
  userId: { type: String, default: "" },
  url: { type: String, default: "" },
  email: { type: String, default: "" },
})
const user = vue.computed<PublicUser | undefined>(() => {
  if (!props.userId) return undefined
  return stored(props.userId) ?? undefined
})

const src = vue.computed<string>(() => {
  if (props.url) {
    return props.url
  } else if (user.value && user.value.avatar) {
    return user.value.avatar
  } else if (user.value || props.email) {
    const email = user.value ? user.value.email : props.email
    return gravatarUrl(email, { size: 200, default: "retro" }) || ""
  } else {
    return ""
  }
})
</script>
