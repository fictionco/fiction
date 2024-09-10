<script lang="ts" setup>
import { determineMediaFormat, vue } from '@fiction/core'
import { googleFontsUtility } from '@fiction/core/utils/fonts'
import { twMerge } from 'tailwind-merge'
import type { MediaObject } from '@fiction/core'
import XIcon from '../media/XIcon.vue'

defineOptions({ name: 'XLogo' })

const {
  media,
  alt = '',
  alignmentClass = 'justify-center',
  addGoogleFont,
} = defineProps<{
  media: MediaObject
  alt?: string
  alignmentClass?: string
  addGoogleFont?: (family: string) => void
}>()

const containerRef = vue.ref<HTMLElement | null>(null)
const textRef = vue.ref<HTMLElement | null>(null)
const htmlContentRef = vue.ref<HTMLElement | null>(null)
const fontSize = vue.ref(16) // Default font size

const mediaFormat = vue.computed(() => {
  return determineMediaFormat(media)
})

const typographyStyle = vue.computed(() => {
  const typography = media.typography
  if (!typography)
    return {}
  return {
    fontFamily: typography.font,
    fontWeight: typography.weight,
    lineHeight: 1.2,
    letterSpacing: typography.letterSpacing,
    fontSize: fontSize.value && fontSize.value > 8 ? `${fontSize.value}px` : 'inherit',
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

  if (mediaFormat.value === 'typography') {
    const resizeObserver = new ResizeObserver(() => {
      adjustFontSize()
    })

    if (containerRef.value) {
      resizeObserver.observe(containerRef.value)
    }

    vue.onUnmounted(() => {
      resizeObserver.disconnect()
    })
  }

  if (mediaFormat.value === 'html' && htmlContentRef.value) {
    const svg = htmlContentRef.value.querySelector('svg')
    if (svg) {
      svg.setAttribute('width', '100%')
      svg.setAttribute('height', '100%')
      svg.style.maxWidth = '100%'
      svg.style.maxHeight = '100%'
    }
  }
})

const MIN_FONT_SIZE = 8 // Minimum font size in pixels

function adjustFontSize() {
  if (containerRef.value && textRef.value && fontSize.value > 8) {
    const containerHeight = containerRef.value.clientHeight
    let testSize = containerHeight
    textRef.value.style.fontSize = `${testSize}px`

    while (textRef.value.scrollHeight > containerHeight && testSize > MIN_FONT_SIZE) {
      testSize -= 1
      textRef.value.style.fontSize = `${testSize}px`
    }

    fontSize.value = testSize
  }
}

const containerClass = vue.computed(() => {
  const classes = ['inline-flex items-center w-full']

  classes.push(alignmentClass)

  return twMerge(classes.join(' '))
})

const contentClass = vue.computed(() => {
  return ['max-h-full object-contain']
})

const htmlWrapperClass = vue.computed(() => {
  const classes = ['inline-flex items-center h-full']

  classes.push(alignmentClass)

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
  <div ref="containerRef" :class="containerClass">
    <template v-if="mediaFormat === 'image' || mediaFormat === 'url'">
      <img v-if="media.url" :src="media.url" :alt="alt || media.alt" :class="contentClass">
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
      <div ref="textRef" class="whitespace-nowrap h-full" :style="typographyStyle">
        {{ media.typography?.text }}
      </div>
    </template>

    <template v-else-if="mediaFormat === 'iconId'">
      <XIcon :icon="media" :class="iconStyling.classes" />
    </template>

    <template v-else-if="mediaFormat === 'video'">
      <video :src="media.url" :class="contentClass" controls playsinline>
        Your browser does not support the video tag.
      </video>
    </template>

    <template v-else-if="mediaFormat === 'component'">
      <component :is="media.el" v-bind="media" :class="contentClass" />
    </template>

    <template v-else>
      <span class="text-theme-500 dark:text-theme-400">Invalid Media Format</span>
    </template>
  </div>
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
