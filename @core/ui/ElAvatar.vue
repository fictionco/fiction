<template>
  <div
    class="factor-avatar avatar bg-cover bg-center"
    :style="{ backgroundImage: `url(${src})` }"
    :data-test="src"
  />
</template>
<script lang="ts" setup>
import { stored } from "@factor/api"
import { PublicUser } from "@factor/types"
import gravatar from "gravatar"
import { computed } from "vue"

const props = defineProps({
  userId: { type: String, default: "" },
  url: { type: String, default: "" },
  email: { type: String, default: "" },
})
const user = computed<PublicUser | undefined>(() => {
  if (!props.userId) return undefined
  return stored(props.userId) ?? undefined
})

const src = computed<string>(() => {
  if (props.url) {
    return props.url
  } else if (user.value && user.value.avatar) {
    return user.value.avatar
  } else if (user.value || props.email) {
    const email = user.value ? user.value.email : props.email
    return gravatar.url(email, { s: "200", d: "retro" }) || ""
  } else {
    return ""
  }
})
</script>
