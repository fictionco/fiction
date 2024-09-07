<script lang="ts" setup>
import { clean, vue } from '@fiction/core'
import { systemIcons } from '@fiction/core/schemas/systemIcons'
import type { MediaObject } from '@fiction/core'

defineOptions({ name: 'XIcon' })

const props = defineProps({
  icon: { type: Object as vue.PropType<MediaObject >, required: true },
})

const iconData = vue.computed(() => {
  if (typeof props.icon === 'string') {
    return { iconId: props.icon }
  }
  return props.icon
})

const format = vue.computed(() => {
  if (iconData.value.format)
    return iconData.value.format
  if (iconData.value.iconId)
    return 'iconId'
  if (iconData.value.class)
    return 'iconClass'
  if (iconData.value.html)
    return 'html'
  if (iconData.value.url)
    return 'url'
  return 'iconId' // Default to iconId if no format can be determined
})

const iconContent = vue.computed(() => {
  switch (format.value) {
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

const isIconClass = vue.computed(() => ['iconId', 'iconClass'].includes(format.value))
</script>

<template>
  <span v-if="isIconClass" :class="iconContent" />
  <img
    v-else-if="format === 'image' || format === 'url'"
    :src="iconContent"
    alt="Icon"
  >
  <span v-else-if="format === 'html'" v-html="iconContent" />
</template>
