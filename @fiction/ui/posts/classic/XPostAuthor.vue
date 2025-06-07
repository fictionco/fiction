<script lang="ts" setup>
import type { User } from '@fiction/core'
import { vue } from '@fiction/core'
import ElAvatar from '@fiction/ui/common/ElAvatar.vue'

const { user } = defineProps<{
  user: User
}>()

const subtext = vue.computed(() => {
  return (user.handle ? `@${user.handle}` : undefined)
})

const displayName = vue.computed(() => {
  return user.fullName ? user.fullName : user.email?.split('@')[0]
})
</script>

<template>
  <div class="flex gap-[.7em] items-center not-prose">
    <ElAvatar class="size-[2em] rounded-full ring-1 ring-white" :user />
    <div class="text-left flex flex-col gap-1 leading-[1.2] text-[.9em]">
      <div class="font-semibold">
        {{ displayName }}
      </div>
      <div v-if="subtext" class="font-sans font-medium text-[.9em] text-theme-600 dark:text-theme-400">
        {{ subtext }}
      </div>
    </div>
  </div>
</template>
