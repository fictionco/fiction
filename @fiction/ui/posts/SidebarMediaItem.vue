<script lang="ts" setup>
import { vue } from '@fiction/core'
import XLink from '@fiction/ui/common/XLink.vue'
import XIcon from '@fiction/ui/media/XIcon.vue'
import XMedia from '@fiction/ui/media/XMedia.vue'

defineOptions({ name: 'SidebarMediaItem' })

const props = defineProps<{
  title: string
  subTitle?: string
  href?: string
  media?: any
}>()

// If no media is provided, a placeholder class is used
const hasMedia = vue.computed(() => !!props.media)
</script>

<template>
  <div class="flex items-center gap-3">
    <XLink class="size-12 shrink-0 rounded-md overflow-hidden" :href="href">
      <XMedia v-if="hasMedia" :media="media" class="h-full w-full object-cover" />
      <div
        v-else
        class="h-full w-full object-cover rounded-md bg-theme-200 dark:bg-theme-600/40 flex items-center justify-center text-theme-600/50"
      >
        <XIcon class="size-6" :media="{ class: 'i-tabler-photo' }" />
      </div>
    </XLink>

    <div>
      <XLink
        :href="href"
        class="text-sm font-medium hover:text-primary-500 transition-colors text-theme-900 dark:text-theme-50"
      >
        {{ title }}
      </XLink>
      <p v-if="subTitle" class="text-xs text-theme-500 dark:text-theme-400">
        {{ subTitle }}
      </p>
    </div>
  </div>
</template>
