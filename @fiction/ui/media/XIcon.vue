<script lang="ts" setup>
import { clean, vue } from '@fiction/core'
import type { MediaObject } from '@fiction/core'
import { systemIcons } from './systemIcons'

defineOptions({ name: 'XIcon' })

const props = defineProps({
  media: { type: Object as vue.PropType<MediaObject>, required: true },
})

const iconContent = vue.computed(() => {
  switch (props.media.format) {
    case 'html':
      return clean(props.media.html || '')
    case 'iconId': {
      const icon = systemIcons.find(icon => icon.iconId === props.media.iconId)
      return icon ? icon.iconClass : 'i-tabler-check'
    }
    case 'iconClass':
      return props.media.class || 'i-tabler-check'
    case 'image':
    case 'url':
      return props.media.url
    default:
      return 'i-tabler-check'
  }
})

const isIconClass = vue.computed(() =>
  props.media.format === 'iconId' || props.media.format === 'iconClass',
)
</script>

<template>
  <span v-if="isIconClass" :class="iconContent" />
  <img v-else-if="media.format === 'image' || media.format === 'url'" :src="iconContent" alt="Icon">
  <span v-else-if="media.format === 'html'" v-html="iconContent" />
</template>
