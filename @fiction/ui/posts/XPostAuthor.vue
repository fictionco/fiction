<script lang="ts" setup>
import type { User } from '@fiction/core'
import { vue } from '@fiction/core'
import ElAvatar from '@fiction/ui/common/ElAvatar.vue'

const { user } = defineProps<{
  user: User
}>()

const subtext = vue.computed(() => {
  return user.headline || (user.handle ? `@${user.handle}` : undefined) || 'Author'
})

const displayName = vue.computed(() => {
  return user.fullName ? user.fullName : user.email?.split('@')[0]
})
</script>

<template>
  <div class="text-base flex gap-3 items-center not-prose">
    <ElAvatar class="size-8 lg:size-8 rounded-full ring-1 ring-white" :user />
    <div class="text-left text-sm">
      <div class="font-semibold">
        {{ displayName }}
      </div>
      <div v-if="subtext" class="font-sans text-xs text-theme-600 dark:text-theme-400">
        {{ subtext }}
      </div>
    </div>
  </div>
</template>
