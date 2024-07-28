<script lang="ts" setup>
import type { GradientSetting, ImageFilterConfig, MediaObject } from '@fiction/core'
import { log, vue, waitFor } from '@fiction/core'
import * as bh from 'blurhash'
import ClipPathAnim from '../anim/AnimClipPath.vue'

defineOptions({ name: 'ElImage' })

const props = defineProps({
  media: { type: Object as vue.PropType<MediaObject >, default: undefined },
  imageClass: { type: String as vue.PropType<string>, default: '' },
  animate: { type: [Boolean, String] as vue.PropType<'swipe' | 'expand' | '' | boolean>, default: false },
  inlineImage: { type: Boolean, default: false },
})

const logger = log.contextLogger('ElImage')

const loading = vue.ref(true)
const blurCanvas = vue.ref<HTMLCanvasElement>()

async function loadImage(src: string) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.addEventListener('load', () => resolve(img))
    img.addEventListener('error', (...args) => reject(args))
    img.src = src
  })
}

function getBlurHash() {
  if (props.media?.blurhash)
    return props.media?.blurhash

  const urlObj = new URL(props.media?.url || '', 'http://dummybase.com')
  const params = new URLSearchParams(urlObj.search) // this automatically decodes
  return params.get('blurhash') || undefined
}

const blurhash = vue.ref<string | undefined>()

async function setBlurHash() {
  blurhash.value = getBlurHash()

  if (blurhash.value) {
    const pixels = bh.decode(blurhash.value, 64, 64)

    await waitFor(15)

    const blurCanvasEl = blurCanvas.value

    if (!blurCanvasEl?.getContext)
      return

    const ctx = blurCanvasEl?.getContext('2d')
    const imageData = ctx?.createImageData(64, 64)
    imageData?.data.set(pixels)
    if (imageData && ctx)
      ctx.putImageData(imageData, 0, 0)
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
          logger.warn('Error loading image', { error: e })
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

function createGradientString(gradient: GradientSetting): string {
  if (gradient.css)
    return gradient.css

  const angle = gradient.angle ?? 0
  const stops = gradient.stops?.map(stop =>
    `${stop.color} ${stop.percent != null ? `${stop.percent}%` : ''}`,
  ).join(', ') ?? ''

  return `linear-gradient(${angle}deg, ${stops})`
}

const bgStyle = vue.computed(() => {
  const media = props.media
  if (!media)
    return {}

  return {
    backgroundColor: media.bgColor,
    backgroundImage: media.bgGradient ? createGradientString(media.bgGradient) : undefined,
    backgroundRepeat: media.bgRepeat,
    backgroundPosition: media.bgPosition,
    backgroundSize: media.bgSize,
  }
})

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

const filterStyle = vue.computed(() => {
  const filterString = filters.value
    .map((filter: ImageFilterConfig) =>
      `${filter.filter}(${filter.value ?? `${filter.percent}%`})`,
    )
    .join(' ')
  return { filter: filterString }
})
</script>

<template>
  <ClipPathAnim :animate="animate">
    <div v-if="media" class=" " :class="[!inlineImage ? `h-full w-full` : '', cls]" :style="bgStyle">
      <transition
        enter-active-class="transition ease duration-500"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition ease duration-500"
        leave-from-class="opacity-100 "
        leave-to-class="opacity-0"
      >
        <canvas
          v-if="blurhash && loading"
          ref="blurCanvas"
          class="absolute inset-0 z-10 h-full w-full"
          :class="imageClass"
          :data-hash="blurhash"
          width="64"
          height="64"
        />
      </transition>
      <template v-if="!loading">
        <div
          v-if="media.format === 'html'"
          :class="inlineImage ? '' : 'h-full w-full *:w-full *:h-full'"
          v-html="media.html"
        />
        <video
          v-else-if="media.format === 'video'"
          class="absolute h-full w-full object-cover z-0 dark:bg-theme-800/30 bg-theme-50/50"
          :class="[imageClass, inlineImage ? 'block' : '']"
          :src="media?.url || ''"
          :style="{ filter: filters?.map((_) => _.value).join(' ') }"
          autoplay
          loop
          muted
          playsinline
        />
        <img
          v-else-if="media?.url"
          class="inset-0 object-cover z-0"
          :class="[imageClass, inlineImage ? 'block' : 'absolute h-full w-full']"
          :src="media?.url || ''"
          :style="{ filter: filters?.map((_) => _.value).join(' ') }"
        >
        <iframe
          v-else-if="media.format === 'iframe'"
          class="absolute inset-0 h-full w-full z-0"
          :src="media?.url || ''"
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
</template>
