<script lang="ts" setup>
import type { ColorThemeUser, MediaObject } from '@fiction/core'
import { vue } from '@fiction/core'
import XIcon from '@fiction/ui/media/XIcon.vue'
import XMedia from '@fiction/ui/media/XMedia.vue'
import { getColorThemeStyles } from '../utils'

const {
  media,
  icon,
  theme = 'default',
} = defineProps<{
  media?: MediaObject
  icon?: string | MediaObject
  theme?: ColorThemeUser
}>()

const mediaStyle = vue.computed(() => {
  if (!theme) {
    return {
      iconWrapper: `bg-theme-100/60 dark:bg-theme-600/40 dark:text-theme-0`,
      icon: 'text-theme-500/50 dark:text-theme-50',
    }
  }

  const style = getColorThemeStyles(theme || 'primary')

  return {
    base: `relative rounded-full overflow-hidden shrink-0`,
    iconWrapper: style?.bg,
    icon: style?.text,
    ring: style?.ring,
  }
})

const m = vue.computed(() => {
  return Object.keys(media || {}).length === 0 ? (typeof icon === 'string' ? { class: icon } : icon) : media
})
</script>

<template>
  <div :class="[mediaStyle.base, mediaStyle.iconWrapper, mediaStyle.icon]">
    <div
      v-if="m && !m?.url && !m?.html"
      :class="mediaStyle.ring"
      class="w-full h-full flex items-center justify-center rounded-full ring-2 ring-inset"
    >
      <XIcon class="size-[60%]" :media="m" />
    </div>
    <div v-else class="absolute inset-0 overflow-hidden">
      <XMedia class="absolute inset-0 z-10" :media="m" />
      <div
        class="absolute inset-0 z-20 mix-blend-overlay dark:mix-blend-difference pointer-events-none ring-2 ring-inset ring-black dark:ring-white rounded-full"
      />
    </div>
  </div>
</template>
