<script lang="ts" setup>
import type { MediaObject } from '@fiction/core'
import type { Card } from '@fiction/site'
import { determineMediaFormat, getGradientCss, log, removeUndefined, vue, waitFor } from '@fiction/core'
import * as bh from 'blurhash'
import ClipPathAnim from '../anim/AnimClipPath.vue'

defineOptions({ name: 'XMedia' })

const {
  media,
  imageClass = '',
  animate = false,
  imageMode = 'cover',
  constraint = 'width',
  card,
  path,
} = defineProps<{
  media?: MediaObject
  imageClass?: string
  animate?: AnimateType
  imageMode?: ImageMode
  constraint?: 'width' | 'height'
  card?: Card
  path?: string
}>()

type ImageMode = 'inline' | 'cover' | 'contain' | 'inlineBlock'
type AnimateType = 'swipe' | 'expand' | '' | boolean

const logger = log.contextLogger('XMedia')

const loading = vue.ref(true)
const isMobile = vue.ref(false)
const blurCanvas = vue.ref<HTMLCanvasElement>()
const videoEl = vue.ref<HTMLVideoElement>()
const cleanupFreeze = vue.ref<(() => void) | undefined>()

const mediaFormat = vue.computed(() => {
  return determineMediaFormat(media)
})

async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.addEventListener('load', () => resolve(img))
    img.addEventListener('error', error => reject(error))
    img.src = src
  })
}

const blurhash = vue.computed(() => {
  if (media?.blurhash)
    return media.blurhash

  const urlObj = new URL(media?.url || '', 'http://dummybase.com')
  const params = new URLSearchParams(urlObj.search)
  return params.get('blurhash') || ''
})

async function setBlurHash() {
  if (blurhash.value) {
    const pixels = bh.decode(blurhash.value, 64, 64)
    await waitFor(15)
    const ctx = blurCanvas.value?.getContext('2d')
    if (ctx) {
      const imageData = ctx.createImageData(64, 64)
      imageData.data.set(pixels)
      ctx.putImageData(imageData, 0, 0)
    }
  }
}

const validMediaUrl = vue.computed(() => {
  const url = media?.url
  return url?.includes('file://') ? '' : url
})

const shouldAutoplay = vue.computed(() => {
  const controls = media?.videoControls || {}
  // Only autoplay if explicitly set to true, ignore hover settings on mobile
  if (isMobile.value) {
    return controls.autoplay === true
  }
  return controls.autoplay ?? (!controls.freeze?.playOnHover)
})

const shouldHandleHover = vue.computed(() => {
  // Disable hover on mobile entirely
  if (isMobile.value) {
    return false
  }
  return media?.videoControls?.freeze?.playOnHover
})

async function initVideoFirstFrame(video: HTMLVideoElement) {
  if (!shouldAutoplay.value) {
    try {
      video.currentTime = 0
      await video.play()
      await video.pause()
    }
    catch (err) {
      console.warn('Could not init video first frame:', err)
    }
  }
}

vue.onMounted(async () => {
  isMobile.value = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

  vue.watch(
    () => media?.url,
    async (url) => {
      loading.value = true
      setBlurHash()

      if (url && mediaFormat.value === 'image') {
        try {
          await loadImage(url)
        }
        catch (e) {
          const error = e as Error
          logger.error(`error loading image: ${error.message || 'No reported error'}: (${url})`, { error, data: media })
        }
        finally {
          loading.value = false
        }
      }
      else {
        loading.value = false
      }

      if (videoEl.value) {
        videoEl.value.muted = true
        videoEl.value.setAttribute('muted', '')

        // Initialize first frame
        await initVideoFirstFrame(videoEl.value)
      }
    },
    { immediate: true },
  )
})

vue.onBeforeUnmount(() => {
  if (cleanupFreeze.value) {
    cleanupFreeze.value()
  }
})

const attrs = vue.useAttrs()

const classes = vue.computed(() => {
  const c = (attrs.class as string) || ''

  const inlineImage = imageMode === 'inline'

  // For inline mode, apply constraint-based classes
  const inlineClasses = constraint === 'width'
    ? 'w-full h-auto'
    : 'h-full w-auto'

  return {
    container: c.includes('absolute') ? '' : 'relative',
    wrap: inlineImage ? (constraint === 'height' ? 'h-full' : '') : 'h-full w-full',
    media: inlineImage ? inlineClasses : 'absolute h-full w-full',
    html: inlineImage ? inlineClasses : 'h-full w-full *:w-full *:h-full',
    el: inlineImage ? inlineClasses : 'h-full w-full',
  }
})

const filters = vue.computed(() => media?.filters || [])

const videoAttrs = vue.computed(() => {
  const controls = media?.videoControls || {}

  return removeUndefined({
    playbackRate: controls.playbackRate,
    autoplay: shouldAutoplay.value,
    loop: controls.loop ?? true,
    muted: controls.muted ?? true,
    controls: controls.controls,
    preload: isMobile.value ? 'metadata' : (controls.preload ?? 'auto'),
    playsinline: controls.playsinline ?? true,
  })
})

const bgStyle = vue.computed(() => ({
  backgroundColor: media?.backgroundColor || undefined,
  backgroundImage: media?.gradient ? getGradientCss(media.gradient) : undefined,
  backgroundRepeat: media?.backgroundRepeat || undefined,
  backgroundPosition: media?.backgroundPosition || undefined,
  backgroundSize: media?.backgroundSize || undefined,
}))

const overlayStyle = vue.computed(() => {
  const overlay = media?.overlay
  if (!overlay)
    return {}

  return {
    background: overlay.gradient ? getGradientCss(overlay.gradient) : overlay.color,
    opacity: overlay.opacity,
    mixBlendMode: overlay.blendMode,
  }
})

const flipClass = vue.computed(() => {
  const flip = media?.modify?.flip
  if (!flip)
    return ''

  return flip === 'horizontal' ? 'scale-x-[-1]' : flip === 'vertical' ? 'scale-y-[-1]' : ''
})

const filterStyle = vue.computed(() => ({
  filter: filters.value.map(filter => `${filter.filter}(${filter.value ?? `${filter.percent}%`})`).join(' '),
}))

const imageModeClass = vue.computed(() => imageMode === 'contain' ? 'object-contain' : 'object-cover')

const aspectClass = vue.computed(() => {
  const aspectMappings: { [key: string]: string } = {
    square: 'aspect-square',
    tall: 'aspect-[9/16]',
    wide: 'aspect-[16/9]',
    golden: 'aspect-[1.618/1]',
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[4/3]',
    cinema: 'aspect-[21/9]',
    default: 'aspect-[4/3]',
  }

  const aspect = media?.aspect || ''

  return aspectMappings[aspect] || ''
})

async function videoHover(args: { mode: 'enter' | 'leave' }) {
  const { mode } = args
  const el = videoEl.value
  // Only handle hover if enabled and not on mobile
  if (el && shouldHandleHover.value) {
    if (mode === 'enter') {
      await el.play()
    }
    else {
      await el.pause()
    }
  }
}

function handleMediaClick(event: MouseEvent) {
  if (card?.site?.isEditable.value && path) {
    event.stopPropagation()
    event.preventDefault()
    card?.site?.setActiveCard({ cardId: card.cardId })
    card?.setEditPath({ path, caller: 'XMedia' })
  }
}
</script>

<template>
  <ClipPathAnim
    caller="media"
    :class="[classes.container, aspectClass]"
    :animate="animate"
    :data-format="mediaFormat || 'none'"
    :data-media-width="media?.width"
    :data-media-height="media?.height"
  >
    <div
      v-if="media"
      :class="[classes.wrap, flipClass]"
      :style="[bgStyle]"
      :data-loading="loading"
      @click="handleMediaClick($event)"
    >
      <transition
        enter-active-class="transition ease duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-50"
        leave-active-class="transition ease duration-300"
        leave-from-class="opacity-50"
        leave-to-class="opacity-0"
      >
        <canvas
          v-if="blurhash && loading && imageMode === 'cover'"
          ref="blurCanvas"
          class="absolute inset-0 z-10 h-full w-full"
          :class="imageClass"
          :data-hash="blurhash"
          width="64"
          height="64"
        />
      </transition>

      <component
        :is="media.el"
        v-if="mediaFormat === 'component'"
        v-show="!loading"
        :class="[imageClass, classes.el]"
      />
      <div
        v-else-if="mediaFormat === 'html'"
        v-show="!loading"
        :class="[imageClass, classes.html]"
        v-html="media.html"
      />
      <video
        v-else-if="mediaFormat === 'video'"
        v-show="!loading"
        ref="videoEl"
        class="inset-0 z-0 transition-opacity"
        :class="[
          imageClass,
          imageModeClass,
          classes.media,
          shouldHandleHover ? 'hover:opacity-90' : '',
        ]"
        :src="validMediaUrl"
        :aria-label="media?.alt"
        :style="filterStyle"
        v-bind="videoAttrs"
        draggable="false"
        @mouseenter="videoHover({ mode: 'enter' })"
        @mouseleave="videoHover({ mode: 'leave' })"
      />
      <img
        v-else-if="mediaFormat === 'image' && validMediaUrl"
        v-show="!loading"
        class="inset-0 z-0"
        :class="[imageClass, imageModeClass, classes.media]"
        :src="validMediaUrl"
        :style="filterStyle"
        :alt="media?.alt"
        draggable="false"
      >
      <iframe
        v-else-if="mediaFormat === 'iframe'"
        v-show="!loading"
        class="absolute inset-0 h-full w-full z-0"
        :src="validMediaUrl"
        frameborder="0"
        allowfullscreen
      />

      <slot />
    </div>
    <div
      v-if="media?.overlay"
      class="absolute inset-[-1px] z-10 pointer-events-none"
      :style="overlayStyle"
    />
  </ClipPathAnim>
</template>
