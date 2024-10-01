<script lang="ts" setup>
import type { MediaObject } from '@fiction/core'
import XIcon from '@fiction/ui/media/XIcon.vue'
import XMedia from '@fiction/ui/media/XMedia.vue'

const { media, icon } = defineProps<{ media?: MediaObject, icon?: string }>()

const mediaClass = `
  relative size-16
  bg-primary-50 dark:bg-primary-900/30
  dark:text-primary-300/70
  rounded-full overflow-hidden
  text-primary-500/50
  shrink-0
`
</script>

<template>
  <div :class="mediaClass">
    <div
      v-if="media && !media?.url && !media?.html"
      class="flex items-center justify-center size-16"
    >
      <XIcon class="size-8" :media />
    </div>
    <div v-else class="absolute inset-0 overflow-hidden">
      <XMedia class="absolute inset-0 z-10" :media="media" />
      <div
        class="absolute inset-0 z-20 mix-blend-difference pointer-events-none ring-2 ring-inset ring-black dark:ring-white rounded-full"
      />
    </div>
  </div>
</template>
