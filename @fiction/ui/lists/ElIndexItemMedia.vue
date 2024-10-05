<script lang="ts" setup>
import type { MediaObject } from '@fiction/core'
import XIcon from '@fiction/ui/media/XIcon.vue'
import XMedia from '@fiction/ui/media/XMedia.vue'

const { media, icon } = defineProps<{ media?: MediaObject, icon?: string }>()

const mediaClass = `
  relative
  bg-theme-50 dark:bg-theme-600/40
  dark:text-theme-0
  rounded-full overflow-hidden
  text-theme-500/50
  shrink-0
`
</script>

<template>
  <div :class="mediaClass">
    <div
      v-if="media && !media?.url && !media?.html"
      class="w-full h-full flex items-center justify-center"
    >
      <XIcon class="size-[50%]" :media />
    </div>
    <div v-else class="absolute inset-0 overflow-hidden">
      <XMedia class="absolute inset-0 z-10" :media="media" />
      <div
        class="absolute inset-0 z-20 mix-blend-difference pointer-events-none ring-2 ring-inset ring-black dark:ring-white rounded-full"
      />
    </div>
  </div>
</template>
