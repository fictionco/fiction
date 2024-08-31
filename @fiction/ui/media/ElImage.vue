<script lang="ts" setup>
import type { GradientPoint, GradientSetting, MediaObject } from '@fiction/core'
import { getColorScheme, log, vue, waitFor } from '@fiction/core'
import * as bh from 'blurhash'
import ClipPathAnim from '../anim/AnimClipPath.vue'

defineOptions({ name: 'ElImage' })

const props = defineProps({
  media: { type: Object as vue.PropType<MediaObject>, default: undefined },
  imageClass: { type: String, default: '' },
  animate: { type: [Boolean, String] as vue.PropType<AnimateType>, default: false },
  imageMode: { type: String as vue.PropType<ImageMode>, default: 'cover' },
})
type ImageMode = 'inline' | 'cover' | 'contain'
type AnimateType = 'swipe' | 'expand' | '' | boolean

const logger = log.contextLogger('ElImage')

const loading = vue.ref(true)
const blurCanvas = vue.ref<HTMLCanvasElement>()

async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.addEventListener('load', () => resolve(img))
    img.addEventListener('error', error => reject(error))
    img.src = src
  })
}

const blurhash = vue.computed(() => {
  if (props.media?.blurhash)
    return props.media.blurhash

  const urlObj = new URL(props.media?.url || '', 'http://dummybase.com')
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
    () => props.media?.url,
    async (url) => {
      loading.value = true
      setBlurHash()
      if (url) {
        try {
          await loadImage(url)
        }
        catch (e) {
          logger.warn(`error loading image: (${url})`, { error: e })
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

const attrs = vue.useAttrs()

const cls = vue.computed(() => {
  const c = (attrs.class as string) || ''
  return c.includes('absolute') ? '' : 'relative'
})

const filters = vue.computed(() => props.media?.filters || [])

function generateColorString(point: GradientPoint): string {
  if (point.color)
    return point.opacity !== undefined ? `${point.color}${Math.round(point.opacity * 255).toString(16).padStart(2, '0')}` : point.color

  if (['primary', 'theme'].includes(point.theme || '')) {
    const scale = point.scale || 500
    const themeVar = point.theme === 'theme' ? 'theme' : 'primary'
    const rgbVar = `var(--${themeVar}-${scale})`
    return `rgba(${rgbVar} / ${point.opacity ?? 1})`
  }
  else if (point.theme) {
    const v = getColorScheme(point.theme)[point.scale ?? 500]
    return `rgba(${v} / ${point.opacity ?? 1})`
  }

  return ''
}

function createGradientString(gradient: GradientSetting): string {
  if (gradient.css)
    return gradient.css

  const angle = gradient.angle ?? 0
  const stops = gradient.stops?.map((stop) => {
    const colorString = generateColorString(stop)
    return `${colorString} ${stop.percent != null ? `${stop.percent}%` : ''}`
  }).join(', ') ?? ''

  return `linear-gradient(${angle}deg, ${stops})`
}

const bgStyle = vue.computed(() => ({
  backgroundColor: props.media?.bgColor,
  backgroundImage: props.media?.bgGradient ? createGradientString(props.media.bgGradient) : undefined,
  backgroundRepeat: props.media?.bgRepeat,
  backgroundPosition: props.media?.bgPosition,
  backgroundSize: props.media?.bgSize,
}))

const overlayStyle = vue.computed(() => {
  const overlay = props.media?.overlay
  if (!overlay)
    return {}

  return {
    background: overlay.gradient ? createGradientString(overlay.gradient) : overlay.color,
    opacity: overlay.opacity,
    mixBlendMode: overlay.blendMode,
  }
})

const flipClass = vue.computed(() => {
  const flip = props.media?.modify?.flip
  if (!flip)
    return ''

  return flip === 'horizontal' ? 'scale-x-[-1]' : flip === 'vertical' ? 'scale-y-[-1]' : ''
})

const filterStyle = vue.computed(() => ({
  filter: filters.value.map(filter => `${filter.filter}(${filter.value ?? `${filter.percent}%`})`).join(' '),
}))

const inlineImage = vue.computed(() => props.imageMode === 'inline')
const imageModeClass = vue.computed(() => props.imageMode === 'contain' ? 'object-contain' : 'object-cover')

const mediaFormat = vue.computed(() => {
  if (props.media?.format && props.media?.format !== 'url')
    return props.media.format

  if (!props.media?.url)
    return 'html'

  const url = new URL(props.media.url, 'https://dummybase.com')

  // Check for other common image hosting services
  const imageHosts = ['imgur', 'gravatar', 'flickr']
  if (imageHosts.some(host => url.hostname.includes(host))) {
    return 'image'
  }

  const pathname = url.pathname
  const extension = pathname.split('.').pop()?.toLowerCase() || ''
  const formatMap: Record<string, string> = {
    'jpg': 'image',
    'jpeg': 'image',
    'png': 'image',
    'gif': 'image',
    'webp': 'image',
    'svg': 'image',
    'mp4': 'video',
    'webm': 'video',
    'ogg': 'video',
    'html': 'html',
    '': 'html',
  }

  const out = formatMap[extension]

  if (!out) {
    logger.error(`Unknown media format: ${extension}`)
  }

  return out
})
</script>

<template>
  <ClipPathAnim :animate="animate" :data-format="mediaFormat" :data-media-width="media?.width" :data-media-height="media?.height">
    <div
      v-if="media"
      :class="[!inlineImage ? 'h-full w-full' : '', cls, flipClass]"
      :style="[bgStyle]"
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
          class="absolute h-full w-full z-0 dark:bg-theme-800/30 bg-theme-50/50"
          :class="[imageClass, imageModeClass, inlineImage ? 'block' : '']"
          :src="media.url"
          :style="filterStyle"
          autoplay
          loop
          muted
          playsinline
        />
        <img
          v-else-if="mediaFormat === 'image' && media.url"
          class="inset-0 z-0"
          :class="[imageClass, imageModeClass, inlineImage ? 'block' : 'absolute h-full w-full']"
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
      class="absolute inset-[-1px] z-10"
      :style="overlayStyle"
    />
  </ClipPathAnim>
</template>import { url } from 'inspector';
