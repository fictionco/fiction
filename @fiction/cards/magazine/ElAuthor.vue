<script lang="ts" setup>
import { dayjs, vue } from '@fiction/core'
import ElAvatar from '@fiction/ui/common/ElAvatar.vue'
import type { User } from '@fiction/core'

const props = defineProps({
  user: { type: Object as vue.PropType<User>, required: true },
  dateAt: { type: String, default: undefined },

})

const subtext = vue.computed(() => {
  return props.user.username ? `@${props.user.username}` : props.dateAt ? dayjs(props.dateAt).format('MMMM D, YYYY') : ''
})
</script>

<template>
  <div class="text-base flex gap-3 items-center mt-4 not-prose">
    <ElAvatar class="size-12 rounded-full" :email="user.email" />
    <div class="text-left">
      <div class="font-semibold text-lg">
        {{ user.fullName }}
      </div>
      <div class="font-sans antialiased text-sm">
        {{ subtext }}
      </div>
    </div>
  </div>
</template>
