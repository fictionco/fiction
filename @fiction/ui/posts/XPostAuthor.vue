<script lang="ts" setup>
import type { User } from '@fiction/core'
import { vue } from '@fiction/core'
import ElAvatar from '@fiction/ui/common/ElAvatar.vue'

const { user } = defineProps<{
  user: User
}>()

const subtext = vue.computed(() => {
  return user.headline || (user.username ? `@${user.username}` : undefined) || 'Author'
})

const displayName = vue.computed(() => {
  return user.fullName ? user.fullName : user.email?.split('@')[0]
})
</script>

<template>
  <div class="text-base flex gap-4 items-center mt-4 not-prose">
    <ElAvatar class="size-8 lg:size-10 rounded-full ring-2 ring-white" :user />
    <div class="text-left text-base lg:text-lg">
      <div class="font-semibold">
        {{ displayName }}
      </div>
      <div v-if="subtext" class="font-sans text-sm lg:text-base text-theme-600 dark:text-theme-400">
        {{ subtext }}
      </div>
    </div>
  </div>
</template>
