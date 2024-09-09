<script lang="ts" setup>
import { vue } from '@fiction/core'
import type { MediaObject } from '@fiction/core'
import XIcon from '../media/XIcon.vue'

defineOptions({ name: 'XMediaInline' })

const props = defineProps({
  media: {
    type: Object as vue.PropType<MediaObject>,
    required: true,
  },
  alt: { type: String, default: '' },
  alignment: {
    type: String as vue.PropType<'left' | 'center' | 'right'>,
    default: 'center',
  },
})

const emit = defineEmits<{
  (event: 'loadFont', fontKey: string): void
}>()

const mediaFormat = vue.computed(() => {
  if (props.media.format)
    return props.media.format
  if (props.media.url) {
    const extension = props.media.url.split('.').pop()?.toLowerCase()
    if (extension && ['mp4', 'webm', 'ogg'].includes(extension))
      return 'video'
    return 'image'
  }
  if (props.media.html)
    return 'html'
  if (props.media.typography)
    return 'typography'
  if (props.media.iconId)
    return 'iconId'
  if (props.media.el)
    return 'component'
  return 'url'
})

const typographyStyle = vue.computed(() => {
  const typography = props.media.typography
  if (!typography)
    return {}
  return {
    fontFamily: typography.font,
    fontWeight: typography.weight,
    lineHeight: typography.lineHeight,
    letterSpacing: typography.letterSpacing,
  }
})

vue.watch(() => props.media.typography?.font, (newFont) => {
  if (newFont) {
    emit('loadFont', newFont)
  }
}, { immediate: true })

const containerClass = vue.computed(() => {
  const classes = ['inline-flex items-center w-full h-full']

  if (props.alignment === 'left') {
    classes.push('justify-start')
  }
  else if (props.alignment === 'center') {
    classes.push('justify-center')
  }
  else if (props.alignment === 'right') {
    classes.push('justify-end')
  }

  return classes
})

const contentClass = vue.computed(() => {
  return ['max-w-full max-h-full object-contain']
})

const htmlContentRef = vue.ref<HTMLElement | null>(null)

vue.onMounted(() => {
  if (mediaFormat.value === 'html' && htmlContentRef.value) {
    const content = htmlContentRef.value
    const svg = content.querySelector('svg')
    if (svg) {
      svg.setAttribute('width', '100%')
      svg.setAttribute('height', '100%')
      svg.style.maxWidth = '100%'
      svg.style.maxHeight = '100%'
    }
  }
})

const isSvgContent = vue.computed(() => {
  return props.media.html?.trim().startsWith('<svg')
})

const htmlWrapperClass = vue.computed(() => {
  const classes = ['inline-flex items-center w-full h-full']

  if (props.alignment === 'left') {
    classes.push('justify-start')
  }
  else if (props.alignment === 'center') {
    classes.push('justify-center')
  }
  else if (props.alignment === 'right') {
    classes.push('justify-end')
  }

  classes.push('svg-wrapper')

  return classes
})

const iconStyling = vue.computed(() => {
  let maskPosition = 'center'

  if (props.alignment === 'left') {
    maskPosition = 'left'
  }
  else if (props.alignment === 'right') {
    maskPosition = 'right'
  }

  return {
    classes: ['w-full h-full'],
    style: { maskPosition },
  }
})
</script>

<template>
  <span :class="containerClass">
    <template v-if="mediaFormat === 'image' || mediaFormat === 'url'">
      <img
        v-if="media.url"
        :src="media.url"
        :alt="alt || media.alt"
        :class="contentClass"
      >
    </template>

    <template v-else-if="mediaFormat === 'html'">
      <span :class="htmlWrapperClass">
        <span
          ref="htmlContentRef"
          class="inline-block max-w-full h-full html-wrapper"
          v-html="media.html"
        />
      </span>
    </template>

    <template v-else-if="mediaFormat === 'typography'">
      <span
        class="inline-block whitespace-nowrap overflow-hidden text-ellipsis"
        :style="typographyStyle"
      >
        {{ media.typography?.text }}
      </span>
    </template>

    <template v-else-if="mediaFormat === 'iconId'">
      <XIcon :icon="media" :class="iconStyling.classes" :style="iconStyling.style" />
    </template>

    <template v-else-if="mediaFormat === 'video'">
      <video
        :src="media.url"
        :class="contentClass"
        controls
        playsinline
      >
        Your browser does not support the video tag.
      </video>
    </template>

    <template v-else-if="mediaFormat === 'component'">
      <component
        :is="media.el"
        v-bind="media"
        :class="contentClass"
      />
    </template>

    <template v-else>
      <span class="text-theme-500 dark:text-theme-400">Invalid Media Format</span>
    </template>
  </span>
</template>

<style scoped>
.html-wrapper > * {
  height: 100%;
  max-width: 100%;
  max-height: 100%;
}
</style>
