<script lang="ts" setup>
import type { Card } from '@fiction/site'
import { useService } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import ElAvatar from '@fiction/ui/common/ElAvatar.vue'
import XDropDown from '@fiction/ui/common/XDropDown.vue'
import XIcon from '@fiction/ui/media/XIcon.vue'

defineOptions({
  name: 'UserMenu',
})

const { card } = defineProps<{
  card: Card
}>()

const service = useService()
</script>

<template>
  <div>
    <XDropDown
      v-if="service.fictionUser.activeUser?.value"
      v-slot="{ isActive }"
      dropdown-alignment="end"
      :items="[{ label: 'Profile', href: '/profile' }, { label: 'Sign Out', href: '/sign-out' }]"
    >
      <div class="flex items-center">
        <ElAvatar
          class="size-[1.7em] mr-1.5 rounded-full ring-2 ring-theme-200 dark:ring-theme-0"
          :user="service.fictionUser.activeUser?.value"
        />
        <XIcon
          class="size-[1em] transition-all text-theme-400 dark:text-theme-500"
          :class="isActive ? 'rotate-180' : ''"
          :media="{ class: 'i-tabler-chevron-down' }"
        />
      </div>
    </XDropDown>
    <XButton v-else icon-after="i-tabler-arrow-up-right">
      Sign In
    </XButton>
  </div>
</template>
