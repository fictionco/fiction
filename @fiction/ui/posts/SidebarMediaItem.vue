<script lang="ts" setup>
import { vue } from '@fiction/core'
import XMedia from '@fiction/ui/media/XMedia.vue'

defineOptions({ name: 'SidebarMediaItem' })

const props = defineProps<{
  title: string
  subtitle?: string
  href?: string
  media?: any
}>()

// If no media is provided, a placeholder class is used
const hasMedia = vue.computed(() => !!props.media)
</script>

<template>
  <div class="flex items-center gap-3">
    <div v-if="hasMedia" class="size-12 shrink-0 rounded-md overflow-hidden">
      <XMedia :media="media" class="h-full w-full object-cover" />
    </div>
    <div v-else class="size-12 rounded-md bg-theme-200 dark:bg-theme-700 shrink-0" />

    <div>
      <a
        :href="href || '#'"
        class="text-sm font-medium hover:text-primary-500 transition-colors text-theme-900 dark:text-theme-50"
      >
        {{ title }}
      </a>
      <p v-if="subtitle" class="text-xs text-theme-500 dark:text-theme-400">
        {{ subtitle }}
      </p>
    </div>
  </div>
</template>
