<script lang="ts" setup>
import type { User } from '@fiction/core'
import { vue } from '@fiction/core'
import ElAvatar from '@fiction/ui/common/ElAvatar.vue'

const { user } = defineProps<{
  user: User
  dateAt?: string
}>()

const subtext = vue.computed(() => {
  return user.username || user.email ? `@${user.username || user.email?.split('@')[0]}` : 'Author'
})

const displayName = vue.computed(() => {
  return user.fullName ? user.fullName : user.email?.split('@')[0]
})
</script>

<template>
  <div class="text-base flex gap-4 items-center mt-4 not-prose" :data-value="JSON.stringify(user)">
    <ElAvatar class="size-8 lg:size-10 rounded-full ring-2 ring-white" :email="user.email" />
    <div class="text-left text-sm lg:text-base">
      <div class="font-semibold  ">
        {{ displayName }}
      </div>
      <div v-if="subtext" class="font-sans antialiased text-xs lg:text-sm text-primary-600 dark:text-primary-400">
        {{ subtext }}
      </div>
    </div>
  </div>
</template>
