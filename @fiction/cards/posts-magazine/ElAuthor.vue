<script lang="ts" setup>
import type { User } from '@fiction/core'
import { dayjs, vue } from '@fiction/core'
import ElAvatar from '@fiction/ui/common/ElAvatar.vue'

const { user, dateAt } = defineProps<{
  user: User
  dateAt?: string
}>()

const subtext = vue.computed(() => {
  return user.username ? `@${user.username}` : dateAt ? dayjs(dateAt).format('MMMM D, YYYY') : ''
})

const displayName = vue.computed(() => {
  return user.fullName ? user.fullName : user.email?.split('@')[0]
})
</script>

<template>
  <div class="text-base flex gap-4 items-center mt-4 not-prose" :data-value="JSON.stringify(user)">
    <ElAvatar class="size-8 lg:size-10 rounded-full ring-2 ring-white" :email="user.email" />
    <div class="text-left text-sm lg:text-base leading-[1.3]">
      <div class="font-semibold  ">
        {{ displayName }}
      </div>
      <div class="font-sans antialiased text-[.9em]">
        {{ subtext }}
      </div>
    </div>
  </div>
</template>
