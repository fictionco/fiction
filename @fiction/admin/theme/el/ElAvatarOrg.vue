<script lang="ts" setup>
import ElImage from '@fiction/ui/media/ElImage.vue'
import { type MediaObject, useService, vue } from '@fiction/core'

const { fictionUser } = useService()

const activeAvatar = vue.computed<MediaObject | undefined>(() => {
  return fictionUser.activeOrganization.value?.avatar
})
</script>

<template>
  <div class="rounded-full ring-2 ring-theme-700 dark:ring-theme-0/90 overflow-hidden bg-white dark:bg-theme-800">
    <div v-if="!activeAvatar" class="flex justify-center items-center text-theme-400 dark:bg-theme-600/60 dark:text-theme-0 relative h-full w-full">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="size-[50%]"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
      </svg>
    </div>
    <ElImage v-else class="relative h-full w-full" :media="activeAvatar" />
  </div>
</template>
