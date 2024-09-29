<script lang="ts" setup>
import type { IndexItem } from '@fiction/core'
import XMedia from '@fiction/ui/media/XMedia.vue'

const { item } = defineProps<{ item: IndexItem }>()

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
      v-if="!item.media?.url && !item.media?.html"
      class="flex items-center justify-center size-16"
    >
      <div class="text-2xl" :class="item.icon || 'i-tabler-circle'" />
    </div>
    <div v-else class="absolute inset-0 overflow-hidden">
      <XMedia class="absolute inset-0 z-10" :media="item.media" />
      <div
        class="absolute inset-0 z-20 mix-blend-difference pointer-events-none ring-2 ring-inset ring-black dark:ring-white rounded-full"
      />
    </div>
  </div>
</template>
