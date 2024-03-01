<template>
  <div v-if="media?.url" :class="cls">
    <img
      v-if="!loading && fit == 'inline'"
      class="inline-block"
      :class="imageClass"
      :src="media?.url || ''"
      :style="{
        filter: filters?.map((_) => _.value).join(' '),
      }"
    />

    <div v-else class="absolute inset-0">
      <transition
        enter-active-class="transition ease duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition ease duration-200"
        leave-from-class="opacity-100 "
        leave-to-class="opacity-0"
      >
        <canvas
          v-if="loading && media.blurhash"
          ref="blurCanvas"
          class="absolute inset-0 z-10 h-full w-full"
          :data-hash="media.blurhash"
          width="64"
          height="64"
        ></canvas>
      </transition>
      <img
        class="z-0 h-full w-full"
        :class="fit == 'cover' ? 'object-cover' : 'object-scale-down'"
        :src="media?.url || ''"
        :style="{
          filter: filters?.map((_) => _.value).join(' '),
          objectPosition,
        }"
      />
    </div>
    <ElOverlay :overlay="media.overlay"></ElOverlay>
  </div>
</template>
<script lang="ts" setup>
import { vue } from "@factor/api"
import * as bh from "blurhash"
import ElOverlay from "./ElOverlay.vue"
import { ImageFilterConfig, MediaDisplayObject } from "./utils"
const loading = vue.ref(true)
const blurCanvas = vue.ref()

const props = defineProps({
  media: {
    type: Object as vue.PropType<MediaDisplayObject>,
    default: undefined,
  },
  fit: {
    type: String as vue.PropType<"cover" | "contain" | "inline">,
    default: "cover",
  },
  objectPosition: {
    type: String as vue.PropType<"center" | "left" | "right">,
    default: "center",
  },
  imageClass: {
    type: String as vue.PropType<string>,
    default: "",
  },
})

const loadImage = async (src: string) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.addEventListener("load", () => resolve(img))
    img.addEventListener("error", (...args) => reject(args))
    img.src = src
  })
}

vue.onMounted(() => {
  vue.watch(
    () => props.media?.url,
    async (url) => {
      loading.value = true
      if (url) {
        await loadImage(url)
        loading.value = false
      } else {
        loading.value = false
      }
    },
    { immediate: true },
  )

  const { blurhash, width, height } = props.media || {}
  if (blurhash && width && height) {
    const pixels = bh.decode(blurhash, 64, 64)

    const blurCanvasEl = blurCanvas.value as HTMLCanvasElement
    const ctx = blurCanvasEl.getContext("2d")
    const imageData = ctx?.createImageData(64, 64)
    imageData?.data.set(pixels)
    if (imageData && ctx) {
      ctx.putImageData(imageData, 0, 0)
    }
  }
})

const attrs = vue.useAttrs()

const cls = vue.computed(() => {
  return attrs.class && (attrs.class as string).includes("absolute")
    ? ""
    : "relative"
})

const filters = vue.computed<ImageFilterConfig[]>(() => {
  return props.media?.filters || []
})
</script>
