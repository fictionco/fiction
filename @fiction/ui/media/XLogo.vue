<script lang="ts" setup>
import { vue } from '@fiction/core'
import { googleFontsUtility } from '@fiction/core/utils/fonts'
import type { MediaObject } from '@fiction/core'
import XIcon from '../media/XIcon.vue'

defineOptions({ name: 'XLogo' })

const {
  media,
  alt = '',
  alignment = 'center',
  addGoogleFont,
} = defineProps<{
  media: MediaObject
  alt?: string
  alignment?: 'left' | 'center' | 'right'
  addGoogleFont?: (family: string) => void
}>()

const mediaFormat = vue.computed(() => {
  if (media.format)
    return media.format
  if (media.url) {
    const extension = media.url.split('.').pop()?.toLowerCase()
    if (extension && ['mp4', 'webm', 'ogg'].includes(extension))
      return 'video'
    return 'image'
  }
  if (media.html)
    return 'html'
  if (media.typography)
    return 'typography'
  if (media.iconId)
    return 'iconId'
  if (media.el)
    return 'component'
  return 'url'
})

const typographyStyle = vue.computed(() => {
  const typography = media.typography
  if (!typography)
    return {}
  return {
    fontFamily: typography.font,
    fontWeight: typography.weight,
    lineHeight: 1,
    letterSpacing: typography.letterSpacing,
    fontSize: 'clamp(16px, 4vw, 48px)',
  }
})

vue.onMounted(() => {
  vue.watch(() => media.typography?.font, async (newFont) => {
    if (newFont) {
      if (addGoogleFont) {
        addGoogleFont(newFont)
      }
      else {
        await googleFontsUtility.loadFont(newFont)
      }
    }
  }, { immediate: true })
})

const containerClass = vue.computed(() => {
  const classes = ['inline-flex items-center h-full w-full']

  if (alignment === 'left') {
    classes.push('justify-start')
  }
  else if (alignment === 'center') {
    classes.push('justify-center')
  }
  else if (alignment === 'right') {
    classes.push('justify-end')
  }

  return classes
})

const contentClass = vue.computed(() => {
  return ['max-h-full object-contain']
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

const htmlWrapperClass = vue.computed(() => {
  const classes = ['inline-flex items-center h-full']

  if (alignment === 'left') {
    classes.push('justify-start')
  }
  else if (alignment === 'center') {
    classes.push('justify-center')
  }
  else if (alignment === 'right') {
    classes.push('justify-end')
  }

  return classes
})

const iconStyling = vue.computed(() => {
  return {
    classes: ['h-full w-auto aspect-square'],
  }
})

const isSvgContent = vue.computed(() => {
  return media.html?.trim().startsWith('<svg')
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
          class="inline-block h-full html-wrapper"
          :class="{ 'w-full': isSvgContent, 'w-auto': !isSvgContent }"
          v-html="media.html"
        />
      </span>
    </template>

    <template v-else-if="mediaFormat === 'typography'">
      <span
        class="whitespace-nowrap h-full flex items-center"
        :style="typographyStyle"
      >
        {{ media.typography?.text }}
      </span>
    </template>

    <template v-else-if="mediaFormat === 'iconId'">
      <XIcon :icon="media" :class="iconStyling.classes" />
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
.html-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: inherit;
}
.html-wrapper > * {
  height: 100%;
  max-width: 100%;
  max-height: 100%;
}
</style>
