<script lang="ts" setup>
import type { Card } from '@fiction/site'
import { useService, vue } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import ElAvatar from '@fiction/ui/common/ElAvatar.vue'
import XDropDown from '@fiction/ui/common/XDropDown.vue'
import XIcon from '@fiction/ui/media/XIcon.vue'
import { getFictionAuthUrl, getFictionNavItems } from './navUtils'

defineOptions({ name: 'UserMenu' })

const { card } = defineProps<{ card: Card }>()
const { fictionUser, fictionEnv } = useService()
const user = vue.computed(() => fictionUser.activeUser?.value)
</script>

<template>
  <div class="flex items-center">
    <XDropDown
      v-if="user"
      :site="card.site"
      dropdown-alignment="end"
      mode="click"
      :classes="{ width: 'w-56' }"
      :items="getFictionNavItems({ fictionEnv })"
    >
      <template #top>
        <div
          class="border-theme-200 dark:border-theme-700 flex items-center space-x-3 border-b px-4 py-4 text-sm"
        >
          <div>
            <ElAvatar
              class="size-9"
              :user="user"
            />
          </div>
          <div class="font-sans min-w-0">
            <div class="truncate font-bold leading-tight">
              {{ user?.fullName || user?.email }}
            </div>
            <div class="text-xs text-theme-500 dark:text-theme-400 truncate">
              {{ user?.email }}
            </div>
          </div>
        </div>
      </template>
      <template #default="{ isActive }">
        <div class="flex items-center relative">
          <ElAvatar
            class="size-9 mr-1.5"
            :user="user"
          />
          <div
            class="z-20 rounded-full ring-1 ring-white bg-theme-600 dark:bg-theme-700 text-theme-100 dark:text-theme-300 size-4 flex items-center justify-center absolute bottom-0 right-0"
          >
            <XIcon
              class="size-[80%] transition-all text-theme-400 dark:text-theme-200"
              :class="isActive ? 'rotate-180' : ''"
              :media="{ class: 'i-tabler-chevron-down' }"
            />
          </div>
        </div>
      </template>
    </XDropDown>
    <XButton
      v-else
      icon-after="i-tabler-arrow-right"
      data-test-id="sign-in-button"
      :href="getFictionAuthUrl({ fictionEnv })"
    >
      Sign In
    </XButton>
  </div>
</template>
