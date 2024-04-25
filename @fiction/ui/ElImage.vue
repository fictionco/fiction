<script lang="ts" setup>
import { clean, log, vue, waitFor } from '@fiction/core'
import * as bh from 'blurhash'
import type { ImageFilterConfig, MediaDisplayObject } from '@fiction/core'
import ElOverlay from './ElOverlay.vue'
import ClipPathAnim from './AnimClipPath.vue'

defineOptions({ name: 'ElImage' })

const props = defineProps({
  media: { type: Object as vue.PropType<MediaDisplayObject>, default: undefined },
  imageClass: { type: String as vue.PropType<string>, default: '' },
  animate: { type: Boolean, default: false },
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

const filters = vue.computed<ImageFilterConfig[]>(() => props.media?.filters || [])
</script>

<template>
  <ClipPathAnim :enabled="animate">
    <div v-if="media" :class="cls" class="h-full w-full">
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
          class="h-full w-full *:w-full *:h-full"
          v-html="clean(media.html)"
        />
        <img
          v-else-if="media?.url"
          class="absolute inset-0 object-cover h-full w-full z-0"
          :class="imageClass"
          :src="media?.url || ''"
          :style="{ filter: filters?.map((_) => _.value).join(' ') }"
        >
      </template>
      <ElOverlay :overlay="media.overlay" />
      <slot />
    </div>
  </ClipPathAnim>
</template>
