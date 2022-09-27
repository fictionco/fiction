<template>
  <div v-if="media?.url" :class="cls">
    <div class="absolute inset-0">
      <transition
        enter-active-class="transition ease duration-100"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition ease duration-100"
        leave-from-class="opacity-100 "
        leave-to-class="opacity-0"
      >
        <!-- <canvas
        v-if="loading && media.blurhash"
        ref="blurCanvas"
        class="z-0 h-full w-full"
      ></canvas> -->
        <img
          v-if="!loading"
          class="z-0 h-full w-full"
          :class="fit == 'cover' ? 'object-cover' : 'object-scale-down'"
          :src="media?.url || ''"
          :style="{
            filter: filters?.map((_) => _.value).join(' '),
            objectPosition,
          }"
        />
      </transition>
    </div>
    <ElOverlay :overlay="media.overlay"></ElOverlay>
  </div>
</template>
<script lang="ts" setup>
import { vue } from "@factor/api"
// import * as bh from "blurhash"
import ElOverlay from "./ElOverlay.vue"
import { ImageFilterConfig, MediaDisplayObject } from "./utils"
const loading = vue.ref(true)
//const blurCanvas = vue.ref()

const props = defineProps({
  media: {
    type: Object as vue.PropType<MediaDisplayObject>,
    default: undefined,
  },
  fit: {
    type: String as vue.PropType<"cover" | "contain">,
    default: "cover",
  },
  objectPosition: {
    type: String as vue.PropType<"center" | "left" | "right">,
    default: "center",
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

  // const { blurhash, width, height } = props.media || {}
  // if (blurhash && width && height) {
  //   const pixels = bh.decode(blurhash, width, height)

  //   const blurCanvasEl = blurCanvas.value as HTMLCanvasElement

  //   const ctx = blurCanvasEl.getContext("2d")
  //   const imageData = ctx?.createImageData(width, height)
  //   imageData?.data.set(pixels)
  //   if (imageData && ctx) {
  //     ctx.putImageData(imageData, 0, 0)
  //   }
  // }
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
