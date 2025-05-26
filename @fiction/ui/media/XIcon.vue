<script lang="ts" setup>
import type { MediaObject } from '@fiction/core'
import { clean, determineMediaFormat, vue } from '@fiction/core'
import { recommendedIcons } from '@fiction/ui/lib/systemIcons'

defineOptions({ name: 'XIcon' })

const { media } = defineProps<{ media: MediaObject | string }>()

const iconData = vue.computed(() => {
  if (typeof media === 'string') {
    return (media.includes('i-') ? { class: media } : { iconId: media }) as MediaObject
  }
  return media as MediaObject
})

const mediaFormat = vue.computed(() => {
  const format = determineMediaFormat(iconData.value)
  return format
})

const iconContent = vue.computed(() => {
  switch (mediaFormat.value) {
    case 'html':
      return clean(iconData.value.html || '')
    case 'icon': {
      if (iconData.value.iconId) {
        const icon = recommendedIcons.find((icon) => {
          const iconClass = icon.class
          const iconId = iconData.value.iconId || ''
          const found = iconClass === `i-tabler-${iconId}`

          return found || iconClass.includes(iconId)
        })
        return icon ? icon.class : 'i-tabler-check'
      }
      else {
        return iconData.value.class || 'i-tabler-check'
      }
    }
    case 'image':
      return iconData.value.url
    default:
      return 'i-tabler-check'
  }
})
</script>

<template>
  <span v-if="mediaFormat === 'icon'" :class="iconContent" />
  <img
    v-else-if="mediaFormat === 'image'"
    :src="iconContent"
    alt="Icon"
  >
  <span v-else-if="mediaFormat === 'html'" v-html="iconContent" />
  <span v-else :data-icon-format="mediaFormat || 'none'" :data-icon-content="iconContent" />
</template>
