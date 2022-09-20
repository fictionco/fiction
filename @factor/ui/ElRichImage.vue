<template>
  <div :class="cls">
    <img
      class="z-0 h-full w-full object-cover"
      :src="media?.url || ''"
      :style="{
        filter: filters?.map((_) => _.value).join(' '),
      }"
    />
    <div class="absolute inset-0 z-10" :style="overlayStyle"></div>
  </div>
</template>
<script lang="ts" setup>
import { vue } from "@factor/api"
import { getGradientCss, ImageFilterConfig, MediaDisplayObject } from "./utils"

const props = defineProps({
  media: {
    type: Object as vue.PropType<MediaDisplayObject>,
    default: undefined,
  },
})

const attrs = vue.useAttrs()

const cls = vue.computed(() => {
  return (attrs.class as string).includes("absolute") ? "" : "relative"
})

const filters = vue.computed<ImageFilterConfig[]>(() => {
  return props.media?.filters || []
})

const overlayStyle = vue.computed(() => {
  const out: vue.StyleValue = {}
  const ov = props.media?.overlay

  if (ov?.gradient?.stops?.length) {
    out.opacity = (ov.opacity ?? 30) / 100

    if (ov.gradient) {
      out["background-image"] = getGradientCss(ov.gradient)
    }

    if (ov.blendMode) {
      out.mixBlendMode = ov.blendMode as vue.CSSProperties["mixBlendMode"]
    }
  }

  return out
})
</script>
