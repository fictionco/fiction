<script lang="ts" setup>
import { clean, determineMediaFormat, vue } from '@fiction/core'
import { systemIcons } from '@fiction/ui/lib/systemIcons'
import type { MediaObject } from '@fiction/core'

defineOptions({ name: 'XIcon' })

const { media } = defineProps<{ media: MediaObject }>()

const iconData = vue.computed(() => {
  if (typeof media === 'string') {
    return { iconId: media }
  }
  return media
})

const mediaFormat = vue.computed(() => {
  return determineMediaFormat(media)
})

const iconContent = vue.computed(() => {
  switch (mediaFormat.value) {
    case 'html':
      return clean(iconData.value.html || '')
    case 'iconId': {
      const icon = systemIcons.find(icon => icon.iconId === iconData.value.iconId)
      return icon ? icon.iconClass : 'i-tabler-check'
    }
    case 'iconClass':
      return iconData.value.class || 'i-tabler-check'
    case 'image':
    case 'url':
      return iconData.value.url
    default:
      return 'i-tabler-check'
  }
})

const isIconClass = vue.computed(() => ['iconId', 'iconClass'].includes(mediaFormat.value || ''))
</script>

<template>
  <span v-if="isIconClass" :class="iconContent" />
  <img
    v-else-if="mediaFormat === 'image' || mediaFormat === 'url'"
    :src="iconContent"
    alt="Icon"
  >
  <span v-else-if="mediaFormat === 'html'" v-html="iconContent" />
</template>
