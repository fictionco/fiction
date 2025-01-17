<script lang="ts" setup>
import type { MediaObject } from '@fiction/core'
import { determineMediaFormat, getGradientCss, log, removeUndefined, vue, waitFor } from '@fiction/core'
import * as bh from 'blurhash'
import ClipPathAnim from '../anim/AnimClipPath.vue'

defineOptions({ name: 'XMedia' })

const {
  media,
  imageClass = '',
  animate = false,
  imageMode = 'cover',
} = defineProps<{
  media?: MediaObject
  imageClass?: string
  animate?: AnimateType
  imageMode?: ImageMode
}>()

type ImageMode = 'inline' | 'cover' | 'contain'
type AnimateType = 'swipe' | 'expand' | '' | boolean

const logger = log.contextLogger('XMedia')

const loading = vue.ref(true)
const blurCanvas = vue.ref<HTMLCanvasElement>()
const videoEl = vue.ref<HTMLVideoElement>()
// used to clean up video listeners
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

vue.onMounted(() => {
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
          logger.error(`error loading image: ${error.message}: (${url})`, { error })
        }
        finally {
          loading.value = false
        }
      }
      else {
        loading.value = false
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

const cls = vue.computed(() => {
  const c = (attrs.class as string) || ''
  return c.includes('absolute') ? '' : 'relative'
})

const filters = vue.computed(() => media?.filters || [])

const videoAttrs = vue.computed(() => {
  const controls = media?.videoControls || {}

  const out = removeUndefined({
    playbackRate: controls.playbackRate,
    autoplay: controls.autoplay ?? (!controls.freeze?.playOnHover),
    loop: controls.loop ?? true,
    muted: controls.muted ?? true,
    controls: controls.controls,
    preload: controls.preload,
    poster: controls.poster,
    playsInline: controls.playsInline ?? true,
  })

  return out
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

const inlineImage = vue.computed(() => imageMode === 'inline')
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

function videoHover(args: { mode: 'enter' | 'leave' }) {
  const { mode } = args
  const el = videoEl.value
  if (el && media?.videoControls?.freeze?.playOnHover) {
    if (mode === 'enter') {
      el.play()
    }
    else {
      el.pause()
    }
  }
}
</script>

<template>
  <ClipPathAnim
    caller="media"
    :class="[cls, aspectClass]"
    :animate="animate"
    :data-format="mediaFormat || 'none'"
    :data-media-width="media?.width"
    :data-media-height="media?.height"
  >
    <div
      v-if="media"
      :class="[!inlineImage ? 'h-full w-full' : 'flex', flipClass]"
      :style="[bgStyle]"
      :data-loading="loading"
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
      <template v-if="!loading">
        <component
          :is="media.el"
          v-if="mediaFormat === 'component'"
          :class="[imageClass, inlineImage ? '' : 'h-full w-full']"
        />
        <div
          v-else-if="mediaFormat === 'html'"
          :class="[imageClass, inlineImage ? '' : 'h-full w-full *:w-full *:h-full']"
          v-html="media.html"
        />
        <video
          v-else-if="mediaFormat === 'video'"
          ref="videoEl"
          class="inset-0 z-0 transition-opacity"
          :class="[
            imageClass,
            imageModeClass,
            inlineImage ? 'block w-full' : 'absolute h-full w-full',
            media?.videoControls?.freeze?.playOnHover ? 'hover:opacity-90' : '',
          ]"
          :src="media.url"
          :style="filterStyle"
          v-bind="videoAttrs"
          @mouseenter="videoHover({ mode: 'enter' })"
          @mouseleave="videoHover({ mode: 'leave' })"
        />
        <img
          v-else-if="mediaFormat === 'image' && media.url"
          class="inset-0 z-0"
          :class="[imageClass, imageModeClass, inlineImage ? 'block w-full' : 'absolute h-full w-full']"
          :src="media.url"
          :style="filterStyle"
        >
        <iframe
          v-else-if="mediaFormat === 'iframe'"
          class="absolute inset-0 h-full w-full z-0"
          :src="media.url"
          frameborder="0"
          allowfullscreen
        />
      </template>

      <slot />
    </div>
    <div
      v-if="media?.overlay"
      class="absolute inset-[-1px] z-10 pointer-events-none"
      :style="overlayStyle"
    />
  </ClipPathAnim>
</template>
